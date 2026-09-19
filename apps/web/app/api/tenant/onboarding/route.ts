import { NextRequest, NextResponse } from "next/server";
import { prisma, createTenantDb } from "@santrios/database";
import { hashPassword, createSessionToken } from "@santrios/auth";
import { createTenantSchema } from "@santrios/validators";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { ModuleKey } from "@santrios/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createTenantSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validasi gagal", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Check if slug is taken
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: data.slug },
    });

    if (existingTenant) {
      return NextResponse.json(
        { message: `Slug '${data.slug}' sudah digunakan oleh pesantren lain. Silakan pilih slug lain.` },
        { status: 409 }
      );
    }

    // Check if owner email is taken
    const existingUser = await prisma.user.findUnique({
      where: { email: data.ownerEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: `Email '${data.ownerEmail}' sudah terdaftar dalam sistem.` },
        { status: 409 }
      );
    }

    // Perform atomic onboarding transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          slug: data.slug,
          name: data.name,
          tagline: data.tagline,
          phone: data.phone,
          email: data.email || undefined,
          address: data.address,
          city: data.city,
          province: data.province,
          status: "ACTIVE",
        },
      });

      // 2. Create Owner User
      const owner = await tx.user.create({
        data: {
          name: data.ownerName,
          email: data.ownerEmail,
          passwordHash: hashPassword(data.ownerPassword),
          phone: data.phone,
          status: "ACTIVE",
        },
      });

      // 3. Create Tenant OWNER Role
      const ownerRole = await tx.role.create({
        data: {
          tenantId: tenant.id,
          name: "OWNER",
          description: "Pimpinan / Pengasuh Pesantren Utama",
          isSystem: true,
        },
      });

      // Also create default ADMIN role for the tenant
      await tx.role.create({
        data: {
          tenantId: tenant.id,
          name: "ADMIN",
          description: "Administrator Operasional Pesantren",
          isSystem: true,
        },
      });

      // 4. Assign Owner Role to User
      await tx.userRole.create({
        data: {
          userId: owner.id,
          tenantId: tenant.id,
          roleId: ownerRole.id,
        },
      });

      // 5. Activate Selected Modules + CORE
      const allModulesToActivate = Array.from(
        new Set(["CORE", ...data.selectedModules])
      );

      const dbModules = await tx.module.findMany({
        where: { key: { in: allModulesToActivate } },
      });

      for (const mod of dbModules) {
        await tx.tenantModule.create({
          data: {
            tenantId: tenant.id,
            moduleId: mod.id,
            enabled: true,
          },
        });
      }

      // 6. Assign Free Plan by default
      const freePlan = await tx.plan.findUnique({ where: { key: "FREE" } });
      if (freePlan) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        await tx.subscription.create({
          data: {
            tenantId: tenant.id,
            planId: freePlan.id,
            status: "ACTIVE",
            currentPeriodEnd: nextMonth,
          },
        });
      }

      // 7. Initial Audit Log
      await tx.auditLog.create({
        data: {
          tenantId: tenant.id,
          userId: owner.id,
          action: "TENANT_ONBOARDED",
          entity: "Tenant",
          entityId: tenant.id,
          newData: {
            name: tenant.name,
            slug: tenant.slug,
            modules: allModulesToActivate,
          },
          ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
        },
      });

      return { tenant, owner, activeModules: allModulesToActivate as ModuleKey[] };
    });

    // Create session token and auto-login
    const sessionPayload = {
      user: {
        id: result.owner.id,
        email: result.owner.email,
        name: result.owner.name,
        avatarUrl: null,
      },
      tenant: {
        id: result.tenant.id,
        slug: result.tenant.slug,
        name: result.tenant.name,
        logoUrl: null,
      },
      role: {
        name: "OWNER",
        isSuperAdmin: false,
      },
      permissions: ["*"],
      activeModules: result.activeModules,
    };

    const token = await createSessionToken(sessionPayload);

    const response = NextResponse.json({
      message: "Onboarding pesantren berhasil!",
      tenant: result.tenant,
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("Onboarding API Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memproses registrasi pesantren." },
      { status: 500 }
    );
  }
}
