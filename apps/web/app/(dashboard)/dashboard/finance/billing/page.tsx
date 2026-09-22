import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { createTenantDb } from "@santrios/database";
import BillingClient, { InvoiceItem } from "./billing-client";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  // Peran GURU & KESANTRIAN murni fokus pembinaan, tidak mengelola tagihan santri
  if (session.role.name === "GURU" || session.role.name === "KESANTRIAN" || session.role.name === "MUSYRIF") {
    redirect("/dashboard");
  }

  // Wali Santri diarahkan ke portal pembayaran & tagihan SPP mandiri
  if (session.role.name === "WALI_SANTRI") {
    redirect("/dashboard/finance");
  }

  let initialInvoices: InvoiceItem[] = [];
  let classrooms: { id: string; name: string }[] = [];
  let studentsList: { id: string; name: string; nis: string; className: string }[] = [];

  try {
    const tenantDb = createTenantDb(session.tenant.id);

    const [{ invoices }, dbClassrooms, { students }] = await Promise.all([
      tenantDb.finance.listInvoices({ take: 100 }),
      tenantDb.students.getClassrooms(),
      tenantDb.students.list({ take: 100 }),
    ]);

    classrooms = dbClassrooms.map((c) => ({ id: c.id, name: c.name }));
    studentsList = students.map((s) => ({
      id: s.id,
      name: s.name,
      nis: s.nis,
      className: s.classroom?.name || "-",
    }));

    initialInvoices = invoices.map((inv, idx) => ({
      id: inv.id,
      invoiceNo: `INV-${new Date(inv.createdAt).getFullYear()}${String(new Date(inv.createdAt).getMonth() + 1).padStart(2, "0")}-${String(idx + 1).padStart(3, "0")}`,
      studentName: inv.student?.name || "Santri",
      nis: inv.student?.nis || "-",
      className: inv.student?.classroom?.name || "-",
      category: (inv.category as any) || "SPP",
      title: inv.title,
      amount: inv.amount,
      dueDate: new Date(inv.dueDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: inv.status as "PAID" | "UNPAID" | "OVERDUE",
      guardianName: inv.student?.guardianName || "Wali Santri",
      guardianPhone: inv.student?.guardianPhone || "-",
    }));
  } catch (err: any) {
    console.warn("⚠️ [BillingPage] Gagal memuat data tagihan dari DB:", err.message);
  }

  return (
    <BillingClient
      tenantName={session.tenant.name}
      userRole={session.role.name}
      initialInvoices={initialInvoices}
      classrooms={classrooms.map((c) => ({ id: c.id, name: c.name }))}
      students={studentsList}
    />
  );
}
