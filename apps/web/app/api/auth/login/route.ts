import { NextRequest, NextResponse } from "next/server";
import { prisma, createTenantDb } from "@santrios/database";
import { verifyPassword, createSessionToken } from "@santrios/auth";
import { loginSchema } from "@santrios/validators";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { ModuleKey, SystemRoleType } from "@santrios/types";

// Demo Accounts registry for offline / unseeded environment preview
const DEMO_FALLBACK_USERS: Record<
  string,
  {
    name: string;
    role: SystemRoleType;
    permissions: string[];
  }
> = {
  "owner@demo.local": {
    name: "KH. Abdullah Munir",
    role: "OWNER",
    permissions: [
      "students.view", "students.create", "students.edit", "students.delete",
      "finance.view", "finance.create", "finance.export",
      "attendance.view", "attendance.mark",
      "tahfizh.view", "tahfizh.input",
      "permits.view", "permits.approve",
      "settings.view", "settings.edit",
    ],
  },
  "admin@demo.local": {
    name: "Ustadz Ridwan, S.Pd.",
    role: "ADMIN",
    permissions: [
      "students.view", "students.create", "students.edit",
      "attendance.view", "attendance.mark",
      "tahfizh.view", "tahfizh.input",
      "permits.view", "permits.approve",
      "settings.view",
    ],
  },
  "bendahara@demo.local": {
    name: "Ustadz Syamsul Hadi, S.E.",
    role: "BENDAHARA",
    permissions: [
      "finance.view", "finance.create", "finance.export",
      "students.view",
    ],
  },
  "guru@demo.local": {
    name: "Ustadzah Fatimah, Lc.",
    role: "GURU",
    permissions: [
      "students.view",
      "attendance.view", "attendance.mark",
      "tahfizh.view", "tahfizh.input",
    ],
  },
  "musyrif@demo.local": {
    name: "Ustadz Fatih Al-Banjari",
    role: "MUSYRIF",
    permissions: [
      "students.view",
      "attendance.view", "attendance.mark",
      "permits.view", "permits.approve",
    ],
  },
  "wali@demo.local": {
    name: "Bpk. Rahmat Santoso (Wali)",
    role: "WALI_SANTRI",
    permissions: [
      "students.view",
      "attendance.view",
      "tahfizh.view",
      "permits.view",
      "finance.view",
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { email, password } = parsed.data;

    let user: any = null;
    let dbConnected = true;

    // 1. Try querying real database
    try {
      user = await prisma.user.findUnique({
        where: { email },
        include: {
          userRoles: {
            include: {
              tenant: true,
              role: {
                include: {
                  permissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          },
        },
      });
    } catch (dbError) {
      console.warn("Database query skipped or failed, checking demo fallback:", dbError);
      dbConnected = false;
    }

    // 2. Fallback to demo accounts if DB is offline or user not found in DB
    const demoFallback = DEMO_FALLBACK_USERS[email.toLowerCase()];
    if ((!user || !dbConnected) && demoFallback && password === "Demo123456!") {
      const demoModules: ModuleKey[] = [
        "CORE", "SANTRI", "KEUANGAN", "ABSENSI", "TAHFIZH", "AKADEMIK", "ASRAMA", "PERIZINAN", "WALI_SANTRI"
      ];

      const demoSessionPayload = {
        user: {
          id: `demo-${demoFallback.role.toLowerCase()}`,
          email,
          name: demoFallback.name,
          avatarUrl: null,
        },
        tenant: {
          id: "demo-tenant-alhikmah",
          slug: "al-hikmah",
          name: "Pondok Pesantren Al-Hikmah Modern",
          logoUrl: null,
        },
        role: {
          name: demoFallback.role,
          isSuperAdmin: false,
        },
        permissions: demoFallback.permissions,
        activeModules: demoModules,
      };

      const token = await createSessionToken(demoSessionPayload);

      const response = NextResponse.json({
        message: "Login berhasil (Demo Mode)",
        user: demoSessionPayload.user,
        tenant: demoSessionPayload.tenant,
        role: demoSessionPayload.role,
      });

      response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { message: "Email atau password salah." },
        { status: 401 }
      );
    }

    if (user.status !== "ACTIVE") {
      return NextResponse.json(
        { message: "Akun pengguna non-aktif. Hubungi administrator." },
        { status: 403 }
      );
    }

    // Determine primary tenant and role
    const primaryUserRole = user.userRoles[0];
    const isSuperAdmin = user.email.includes("superadmin");

    let tenantId = primaryUserRole?.tenantId || "global-system-tenant";
    let tenantSlug = primaryUserRole?.tenant?.slug || "system";
    let tenantName = primaryUserRole?.tenant?.name || "SaaS System";
    let tenantLogo = primaryUserRole?.tenant?.logoUrl || null;
    let roleName = (primaryUserRole?.role?.name as SystemRoleType) || (isSuperAdmin ? "SUPER_ADMIN" : "STAFF");

    // Gather permissions
    const permissions: string[] = [];
    if (primaryUserRole?.role?.permissions) {
      primaryUserRole.role.permissions.forEach((rp: any) => {
        permissions.push(rp.permission.key);
      });
    }

    // Get active modules
    let activeModules: ModuleKey[] = ["CORE"];
    if (primaryUserRole?.tenantId) {
      try {
        const tenantModules = await prisma.tenantModule.findMany({
          where: { tenantId: primaryUserRole.tenantId, enabled: true },
          include: { module: true },
        });
        activeModules = tenantModules.map((tm: any) => tm.module.key as ModuleKey);
        if (!activeModules.includes("CORE")) activeModules.unshift("CORE");
      } catch (err) {
        console.warn("Failed fetching tenant modules:", err);
      }
    }

    const sessionPayload = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      tenant: {
        id: tenantId,
        slug: tenantSlug,
        name: tenantName,
        logoUrl: tenantLogo,
      },
      role: {
        name: roleName,
        isSuperAdmin,
      },
      permissions,
      activeModules,
    };

    const token = await createSessionToken(sessionPayload);

    // Audit log (guarded so DB logging issues do not block successful login)
    if (primaryUserRole?.tenantId) {
      try {
        const tenantDb = createTenantDb(primaryUserRole.tenantId);
        await tenantDb.logAudit({
          userId: user.id,
          action: "USER_LOGIN",
          entity: "User",
          entityId: user.id,
          newData: { email: user.email, role: roleName },
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        });
      } catch (auditErr) {
        console.warn("Audit log skipped:", auditErr);
      }
    }

    const response = NextResponse.json({
      message: "Login berhasil",
      user: sessionPayload.user,
      tenant: sessionPayload.tenant,
      role: sessionPayload.role,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server saat proses login.",
        detail: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
