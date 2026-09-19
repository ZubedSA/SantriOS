"use server";

import { getCurrentSession } from "@/lib/session";
import { createTenantDb } from "@santrios/database";
import { hasModule } from "@santrios/modules";
import { requirePermission } from "@santrios/auth";
import {
  createInvoiceSchema,
  createBulkInvoiceSchema,
  createTransactionSchema,
  CreateInvoiceInput,
  CreateBulkInvoiceInput,
  CreateTransactionInput,
} from "@santrios/validators";
import { revalidatePath } from "next/cache";

export async function createInvoiceAction(input: CreateInvoiceInput) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "KEUANGAN")) {
      return { success: false, error: "Modul Keuangan belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "finance.create");

    const parsed = createInvoiceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message || "Data input tagihan tidak valid.",
      };
    }

    const tenantDb = createTenantDb(session.tenant.id);
    const invoice = await tenantDb.finance.createInvoice(parsed.data);

    await tenantDb.logAudit({
      userId: session.user.id,
      action: "CREATE_INVOICE",
      entity: "Invoice",
      entityId: invoice.id,
      newData: { title: invoice.title, amount: invoice.amount, studentId: invoice.studentId },
    });

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/finance/billing");
    return { success: true, data: invoice };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal membuat tagihan." };
  }
}

export async function createBulkInvoiceAction(input: CreateBulkInvoiceInput) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "KEUANGAN")) {
      return { success: false, error: "Modul Keuangan belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "finance.create");

    const parsed = createBulkInvoiceSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message || "Data input generate tagihan tidak valid.",
      };
    }

    const tenantDb = createTenantDb(session.tenant.id);
    const result = await tenantDb.finance.createBulkInvoice(parsed.data);

    await tenantDb.logAudit({
      userId: session.user.id,
      action: "GENERATE_BULK_INVOICES",
      entity: "Invoice",
      entityId: session.tenant.id,
      newData: {
        title: parsed.data.title,
        amount: parsed.data.amount,
        classroomId: parsed.data.classroomId,
        count: result.count,
      },
    });

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/finance/billing");
    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal membuat tagihan massal." };
  }
}

export async function createTransactionAction(input: CreateTransactionInput) {
  try {
    const session = await getCurrentSession();
    if (!session) return { success: false, error: "Sesi telah berakhir, silakan login kembali." };

    if (!hasModule(session.activeModules, "KEUANGAN")) {
      return { success: false, error: "Modul Keuangan belum aktif untuk pesantren ini." };
    }

    requirePermission(session, "finance.create");

    const parsed = createTransactionSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors[0]?.message || "Data transaksi kasir tidak valid.",
      };
    }

    const tenantDb = createTenantDb(session.tenant.id);
    const tx = await tenantDb.finance.createTransaction(parsed.data);

    await tenantDb.logAudit({
      userId: session.user.id,
      action: "RECORD_TRANSACTION",
      entity: "Transaction",
      entityId: tx.id,
      newData: {
        receiptNo: tx.receiptNo,
        type: tx.type,
        amount: tx.amount,
        invoiceId: tx.invoiceId,
      },
    });

    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard/finance/billing");
    revalidatePath("/dashboard");
    return { success: true, data: tx };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mencatat transaksi keuangan." };
  }
}
