"use server";

import { getCurrentSession } from "@/lib/session";
import { createTenantDb } from "@santrios/database";
import { hasModule } from "@santrios/modules";
import { requirePermission } from "@santrios/auth";
import {
  createStudentSchema,
  updateStudentSchema,
  CreateStudentInput,
  UpdateStudentInput,
} from "@santrios/validators";
import { revalidatePath } from "next/cache";

export async function createStudentAction(input: CreateStudentInput) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "SANTRI")) {
      return { success: false, error: "Modul Santri belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "students.create");

    const parsed = createStudentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message || "Data input santri tidak valid.",
      };
    }

    const tenantDb = createTenantDb(session.tenant.id);
    const student = await tenantDb.students.create(parsed.data);

    await tenantDb.logAudit({
      userId: session.user.id,
      action: "CREATE_STUDENT",
      entity: "Student",
      entityId: student.id,
      newData: { nis: student.nis, name: student.name, className: student.classroom?.name },
    });

    revalidatePath("/dashboard/santri");
    revalidatePath("/dashboard");
    return { success: true, data: student };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menambahkan santri baru." };
  }
}

export async function updateStudentAction(id: string, input: UpdateStudentInput) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "SANTRI")) {
      return { success: false, error: "Modul Santri belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "students.update");

    const parsed = updateStudentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message || "Data perubahan santri tidak valid.",
      };
    }

    const tenantDb = createTenantDb(session.tenant.id);
    const existing = await tenantDb.students.getById(id);
    if (!existing) return { success: false, error: "Data santri tidak ditemukan." };

    const updated = await tenantDb.students.update(id, parsed.data);

    await tenantDb.logAudit({
      userId: session.user.id,
      action: "UPDATE_STUDENT",
      entity: "Student",
      entityId: updated.id,
      oldData: { name: existing.name, status: existing.status },
      newData: { name: updated.name, status: updated.status },
    });

    revalidatePath("/dashboard/santri");
    revalidatePath("/dashboard");
    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal memperbarui data santri." };
  }
}

export async function deleteStudentAction(id: string) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "SANTRI")) {
      return { success: false, error: "Modul Santri belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "students.delete");

    const tenantDb = createTenantDb(session.tenant.id);
    const existing = await tenantDb.students.getById(id);
    if (!existing) return { success: false, error: "Data santri tidak ditemukan." };

    await tenantDb.students.delete(id);

    await tenantDb.logAudit({
      userId: session.user.id,
      action: "DELETE_STUDENT",
      entity: "Student",
      entityId: id,
      oldData: { name: existing.name, nis: existing.nis },
    });

    revalidatePath("/dashboard/santri");
    revalidatePath("/dashboard");
    return { success: true, data: { id } };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus data santri." };
  }
}
