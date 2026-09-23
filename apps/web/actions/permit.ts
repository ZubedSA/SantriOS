"use server";

import { getCurrentSession } from "@/lib/session";
import { createTenantDb } from "@santrios/database";
import { hasModule } from "@santrios/modules";
import { requirePermission } from "@santrios/auth";
import {
  createPermitSchema,
  updatePermitStatusSchema,
  CreatePermitInput,
  UpdatePermitStatusInput,
} from "@santrios/validators";
import { revalidatePath } from "next/cache";

export async function createPermitAction(input: CreatePermitInput) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "PERIZINAN")) {
      return { success: false, error: "Modul Perizinan belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "permits.view");

    const parsed = createPermitSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message || "Data pengajuan izin tidak valid.",
      };
    }

    const tenantDb = createTenantDb(session.tenant.id);
    const permit = await tenantDb.permits.create(parsed.data);

    await tenantDb.logAudit({
      userId: session.user.id,
      action: "REQUEST_PERMIT",
      entity: "Permit",
      entityId: permit.id,
      newData: { studentId: permit.studentId, type: permit.type, reason: permit.reason },
    });

    revalidatePath("/dashboard/perizinan");
    revalidatePath("/dashboard/activities");
    revalidatePath("/dashboard");
    return { success: true, data: permit };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengajukan izin santri." };
  }
}

export async function updatePermitStatusAction(input: UpdatePermitStatusInput) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "PERIZINAN")) {
      return { success: false, error: "Modul Perizinan belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "permits.approve");

    const parsed = updatePermitStatusSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message || "Status perizinan tidak valid.",
      };
    }

    const tenantDb = createTenantDb(session.tenant.id);
    const updated = await tenantDb.permits.updateStatus(
      parsed.data.permitId,
      parsed.data.status,
      session.user.id
    );

    await tenantDb.logAudit({
      userId: session.user.id,
      action: `PERMIT_${parsed.data.status}`,
      entity: "Permit",
      entityId: updated.id,
      newData: { status: updated.status, approvedById: session.user.id },
    });

    revalidatePath("/dashboard/perizinan");
    revalidatePath("/dashboard/activities");
    revalidatePath("/dashboard");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memproses persetujuan perizinan." };
  }
}
