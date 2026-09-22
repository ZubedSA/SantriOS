import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { createTenantDb } from "@santrios/database";
import FinanceClient from "./finance-client";

export const dynamic = "force-dynamic";

export default async function FinancePage({
  searchParams,
}: {
  searchParams?: { tab?: string; action?: string };
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const initialTab = searchParams?.tab;
  const initialAction = searchParams?.action;

  // Peran GURU & KESANTRIAN murni fokus pembinaan, tidak mengelola kasir SPP
  if (session.role.name === "GURU" || session.role.name === "KESANTRIAN" || session.role.name === "MUSYRIF") {
    redirect("/dashboard");
  }

  let initialTransactions: any[] = [];
  let initialInvoices: any[] = [];
  let studentsList: any[] = [];
  let summary = {
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    totalUnpaid: 0,
  };

  try {
    const tenantDb = createTenantDb(session.tenant.id);

    // Fetch live transactions, invoices, summary, and students from DB
    const [dbSummary, { transactions }, { invoices }, { students }] = await Promise.all([
      tenantDb.finance.getSummary(),
      tenantDb.finance.listTransactions({ take: 50 }),
      tenantDb.finance.listInvoices({ take: 50 }),
      tenantDb.students.list({ take: 100 }),
    ]);

    summary = dbSummary;

    initialTransactions = transactions.map((t) => ({
      id: t.id,
      receiptNo: t.receiptNo,
      title: t.description || `${t.type === "INCOME" ? "Penerimaan" : "Pengeluaran"} ${t.category}`,
      category: t.category,
      amount: t.amount,
      type: t.type as "INCOME" | "EXPENSE",
      method: t.method,
      date: new Date(t.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      actor: "Kasir TU",
    }));

    initialInvoices = invoices.map((inv) => ({
      id: inv.id,
      studentName: inv.student?.name || "Santri",
      nis: inv.student?.nis || "-",
      className: inv.student?.classroom?.name || "-",
      title: inv.title,
      amount: inv.amount,
      dueDate: new Date(inv.dueDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: inv.status as "PAID" | "UNPAID" | "OVERDUE",
    }));

    studentsList = students.map((s) => ({
      id: s.id,
      name: s.name,
      nis: s.nis,
      className: s.classroom?.name || "-",
    }));
  } catch (err: any) {
    console.warn("⚠️ [FinancePage] Gagal memuat data keuangan dari DB:", err.message);
  }

  return (
    <FinanceClient
      tenantName={session.tenant.name}
      userRole={session.role.name}
      initialTab={initialTab}
      initialAction={initialAction}
      initialSummary={summary}
      initialTransactions={initialTransactions}
      initialInvoices={initialInvoices}
      studentsList={studentsList}
    />
  );
}
