"use server";

import { getCurrentSession } from "@/lib/session";
import { createTenantDb } from "@santrios/database";
import { hasModule } from "@santrios/modules";
import { requirePermission } from "@santrios/auth";
import { saveBulkAttendanceSchema, SaveBulkAttendanceInput } from "@santrios/validators";
import { revalidatePath } from "next/cache";

export async function saveAttendanceBulkAction(input: SaveBulkAttendanceInput) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "ABSENSI")) {
      return { success: false, error: "Modul Absensi belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "attendance.mark");

    const parsed = saveBulkAttendanceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message || "Data presensi tidak valid.",
      };
    }

    const tenantDb = createTenantDb(session.tenant.id);
    const result = await tenantDb.attendance.markBulk(parsed.data);

    await tenantDb.logAudit({
      userId: session.user.id,
      action: "MARK_ATTENDANCE",
      entity: "AttendanceRecord",
      entityId: session.tenant.id,
      newData: {
        date: parsed.data.date,
        type: parsed.data.type,
        count: parsed.data.records.length,
      },
    });

    revalidatePath("/dashboard/absensi");
    revalidatePath("/dashboard");
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menyimpan data presensi." };
  }
}
