import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@santrios/auth";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { ModuleKey, SystemRoleType } from "@santrios/types";

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
    let email = body.email;

    if (!email && body.role) {
      const roleTarget = String(body.role).toUpperCase();
      if (roleTarget === "OWNER") email = "owner@demo.local";
      else if (roleTarget === "ADMIN") email = "admin@demo.local";
      else if (roleTarget === "BENDAHARA") email = "bendahara@demo.local";
      else if (roleTarget === "GURU") email = "guru@demo.local";
      else if (roleTarget === "MUSYRIF" || roleTarget === "KESANTRIAN") email = "musyrif@demo.local";
      else if (roleTarget === "WALI_SANTRI" || roleTarget === "WALI") email = "wali@demo.local";
    }

    if (!email || !DEMO_FALLBACK_USERS[email]) {
      return NextResponse.json({ error: "Peran demo tidak ditemukan" }, { status: 400 });
    }

    const demoFallback = DEMO_FALLBACK_USERS[email];
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
      success: true,
      message: `Berhasil beralih ke peran ${demoFallback.role}`,
      user: demoSessionPayload.user,
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
