import { z } from "zod";

export const permitTypeEnum = z.enum([
  "IZIN_KELUAR",
  "IZIN_PULANG",
  "PULANG",
  "BEROBAT",
  "KEPERLUAN_KELUARGA",
  "LOMBA",
  "SAKIT",
]);
export const permitStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED", "ACTIVE"]);

export const createPermitSchema = z.object({
  studentId: z.string().min(1, "Santri wajib dipilih"),
  type: permitTypeEnum.optional().default("IZIN_KELUAR"),
  reason: z.string().min(3, "Alasan izin minimal 3 karakter"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
});

export type CreatePermitInput = z.input<typeof createPermitSchema>;

export const updatePermitStatusSchema = z.object({
  permitId: z.string().min(1, "ID perizinan wajib"),
  status: permitStatusEnum,
});

export type UpdatePermitStatusInput = z.infer<typeof updatePermitStatusSchema>;
