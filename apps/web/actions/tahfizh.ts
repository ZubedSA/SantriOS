"use server";

import { getCurrentSession } from "@/lib/session";
import { createTenantDb } from "@santrios/database";
import { hasModule } from "@santrios/modules";
import { requirePermission } from "@santrios/auth";
import { recordTahfizhSchema, RecordTahfizhInput } from "@santrios/validators";
import { revalidatePath } from "next/cache";

export async function recordTahfizhAction(input: RecordTahfizhInput) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "TAHFIZH")) {
      return { success: false, error: "Modul Tahfizh belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "hafalan.create");

    const parsed = recordTahfizhSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message || "Data setoran tahfizh tidak valid.",
      };
    }

    const tenantDb = createTenantDb(session.tenant.id);
    const record = await tenantDb.tahfizh.record({
      ...parsed.data,
      mentorId: session.user.id,
    });

    await tenantDb.logAudit({
      userId: session.user.id,
      action: "RECORD_HAFALAN",
      entity: "HafalanRecord",
      entityId: record.id,
      newData: {
        studentId: record.studentId,
        surah: record.surah,
        juz: record.juz,
        grade: record.grade,
      },
    });

    revalidatePath("/dashboard/activities");
    revalidatePath("/dashboard/santri");
    revalidatePath("/dashboard");
    return { success: true, data: record };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mencatat setoran tahfizh." };
  }
}
