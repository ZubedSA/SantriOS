import { z } from "zod";

export const invoiceCategoryEnum = z.enum(["SPP", "UANG_MAKAN", "SERAGAM", "DAFTAR_ULANG", "LAINNYA"]);
export const invoiceStatusEnum = z.enum(["UNPAID", "PAID", "OVERDUE", "CANCELLED"]);
export const transactionTypeEnum = z.enum(["INCOME", "EXPENSE"]);
export const transactionCategoryEnum = z.enum([
  "SPP",
  "UANG_MAKAN",
  "KATERING",
  "BELANJA_DAPUR",
  "OPERASIONAL",
  "GAJI",
  "PEMELIHARAAN",
  "INFAQ",
  "LAINNYA",
]);
export const paymentMethodEnum = z.enum(["CASH", "TRANSFER", "QRIS", "VA"]);

export const createInvoiceSchema = z.object({
  studentId: z.string().min(1, "Santri wajib dipilih"),
  title: z.string().min(3, "Judul tagihan minimal 3 karakter"),
  category: invoiceCategoryEnum.optional().default("SPP"),
  amount: z.number().int().positive("Nominal harus lebih dari 0"),
  dueDate: z.string().or(z.date()),
});

export type CreateInvoiceInput = z.input<typeof createInvoiceSchema>;

export const createBulkInvoiceSchema = z.object({
  classroomId: z.string().optional(),
  title: z.string().min(3, "Judul tagihan minimal 3 karakter"),
  category: invoiceCategoryEnum.optional().default("SPP"),
  amount: z.number().int().positive("Nominal harus lebih dari 0"),
  dueDate: z.string().or(z.date()),
});

export type CreateBulkInvoiceInput = z.input<typeof createBulkInvoiceSchema>;

export const createTransactionSchema = z.object({
  type: transactionTypeEnum,
  category: transactionCategoryEnum,
  amount: z.number().int().positive("Nominal harus lebih dari 0"),
  method: paymentMethodEnum.optional().default("CASH"),
  description: z.string().optional().nullable(),
  studentId: z.string().optional().nullable(),
  invoiceId: z.string().optional().nullable(),
});

export type CreateTransactionInput = z.input<typeof createTransactionSchema>;
