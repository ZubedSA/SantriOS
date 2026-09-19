import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";
import { prisma, createTenantDb } from "@santrios/database";
import { toggleTenantModuleSchema } from "@santrios/validators";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = toggleTenantModuleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Data tidak valid", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { tenantId, moduleKey, enabled } = parsed.data;

    // Multi-tenant security check: ensure user belongs to this tenant or is super admin
    if (!session.role.isSuperAdmin && session.tenant.id !== tenantId) {
      return NextResponse.json(
        { message: "Akses ditolak: Anda tidak memiliki izin untuk tenant ini." },
        { status: 403 }
      );
    }

    if (moduleKey === "CORE") {
      return NextResponse.json(
        { message: "Modul CORE adalah modul dasar dan tidak dapat dinonaktifkan." },
        { status: 400 }
      );
    }

    // Find module in DB
    const mod = await prisma.module.findUnique({
      where: { key: moduleKey },
    });

    if (!mod) {
      return NextResponse.json({ message: "Modul tidak ditemukan." }, { status: 404 });
    }

    // Upsert tenant module record
    const updated = await prisma.tenantModule.upsert({
      where: {
        tenantId_moduleId: {
          tenantId,
          moduleId: mod.id,
        },
      },
      update: {
        enabled,
      },
      create: {
        tenantId,
        moduleId: mod.id,
        enabled,
      },
    });

    // Write audit log
    const tenantDb = createTenantDb(tenantId);
    await tenantDb.logAudit({
      userId: session.user.id,
      action: enabled ? "MODULE_ACTIVATED" : "MODULE_DEACTIVATED",
      entity: "Module",
      entityId: mod.id,
      newData: { moduleKey, enabled },
      ipAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
    });

    return NextResponse.json({
      message: `Modul ${mod.name} berhasil ${enabled ? "diaktifkan" : "dinonaktifkan"}.`,
      tenantModule: updated,
    });
  } catch (error: any) {
    console.error("Module toggle error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memperbarui status modul." },
      { status: 500 }
    );
  }
}
