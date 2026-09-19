import { z } from "zod";

export const tahfizhGradeEnum = z.enum(["MUMTAZ", "JAYYID_JIDDAN", "JAYYID", "MAQBUL"]);

export const recordTahfizhSchema = z.object({
  studentId: z.string().min(1, "ID santri wajib diisi"),
  surah: z.string().min(1, "Nama surah wajib diisi"),
  ayahStart: z.number().int().positive().optional().nullable(),
  ayahEnd: z.number().int().positive().optional().nullable(),
  juz: z.number().int().min(1).max(30, "Juz antara 1 sampai 30"),
  grade: tahfizhGradeEnum.optional().default("JAYYID"),
  notes: z.string().optional().nullable(),
});

export type RecordTahfizhInput = z.input<typeof recordTahfizhSchema>;
