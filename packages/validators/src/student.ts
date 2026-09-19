import { z } from "zod";

export const studentGenderEnum = z.enum(["LAKI_LAKI", "PEREMPUAN"]);
export const studentStatusEnum = z.enum(["AKTIF", "IZIN", "SAKIT", "LULUS", "KELUAR"]);

export const createStudentSchema = z.object({
  nis: z.string().min(3, "NIS minimal 3 karakter"),
  nisn: z.string().optional().nullable(),
  name: z.string().min(2, "Nama santri minimal 2 karakter"),
  nickname: z.string().optional().nullable(),
  gender: studentGenderEnum,
  birthPlace: z.string().optional().nullable(),
  birthDate: z.string().or(z.date()).optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  status: studentStatusEnum.optional().default("AKTIF"),
  classroomId: z.string().optional().nullable(),
  dormitoryRoomId: z.string().optional().nullable(),
  guardianName: z.string().optional().nullable(),
  guardianPhone: z.string().optional().nullable(),
  guardianRelation: z.string().optional().nullable(),
});

export type CreateStudentInput = z.input<typeof createStudentSchema>;

export const updateStudentSchema = createStudentSchema.partial();

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

export const filterStudentSchema = z.object({
  search: z.string().optional(),
  classroomId: z.string().optional(),
  dormitoryRoomId: z.string().optional(),
  status: studentStatusEnum.optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(50),
});

export type FilterStudentInput = z.infer<typeof filterStudentSchema>;
