import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AuditClient from "./audit-client";

export const dynamic = "force-dynamic";

export default async function AuditTrailPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  // Peran GURU, KESANTRIAN, & WALI SANTRI tidak memiliki wewenang audit transaksi atau log keamanan yayasan
  if (
    session.role.name === "GURU" ||
    session.role.name === "KESANTRIAN" ||
    session.role.name === "MUSYRIF" ||
    session.role.name === "WALI_SANTRI"
  ) {
    redirect("/dashboard");
  }

  return (
    <AuditClient
      tenantName={session.tenant.name}
      userRole={session.role.name}
      userName={session.user.name}
    />
  );
}
