import { z } from "zod";

export const attendanceTypeEnum = z.enum([
  "SHALAT_SUBUH",
  "SHALAT_ZHUHUR",
  "SHALAT_ASHAR",
  "SHALAT_MAGHRIB",
  "SHALAT_ISYA",
  "KELAS",
  "HALAQAH",
]);

export const attendanceStatusEnum = z.enum(["HADIR", "SAKIT", "IZIN", "ALFA"]);

export const singleAttendanceSchema = z.object({
  studentId: z.string().min(1, "ID santri wajib"),
  status: attendanceStatusEnum,
  notes: z.string().optional().nullable(),
});

export const saveBulkAttendanceSchema = z.object({
  date: z.string().or(z.date()),
  type: attendanceTypeEnum,
  records: z.array(singleAttendanceSchema).min(1, "Minimal 1 record absensi"),
});

export type SaveBulkAttendanceInput = z.infer<typeof saveBulkAttendanceSchema>;
