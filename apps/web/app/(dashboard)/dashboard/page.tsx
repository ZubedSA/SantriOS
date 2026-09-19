import React from "react";
import { getCurrentSession } from "@/lib/session";
import { createTenantDb } from "@santrios/database";
import { redirect } from "next/navigation";
import { OwnerView } from "./components/owner-view";
import { AdminView } from "./components/admin-view";
import { BendaharaView } from "./components/bendahara-view";
import { GuruView } from "./components/guru-view";
import { KesantrianView } from "./components/kesantrian-view";
import { WaliView } from "./components/wali-view";
import { SuperAdminView } from "./components/superadmin-view";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  // 1. Super Admin View (SaaS Platform Operator)
  if (session.role.isSuperAdmin || session.role.name === "SUPER_ADMIN") {
    return <SuperAdminView userName={session.user.name} />;
  }

  // Fetch real aggregated metrics scoped strictly to current tenant with fallback
  let metrics = undefined;
  try {
    const tenantDb = createTenantDb(session.tenant.id);
    metrics = await tenantDb.dashboard.getMetrics();
  } catch (err: any) {
    console.warn("⚠️ [DashboardPage] Database sedang reconnecting atau offline, menampilkan data tampilan:", err.message);
  }

  // 2. Role-Tailored Experience per Tenant (Section 40 of Master Prompt)
  switch (session.role.name) {
    case "BENDAHARA":
      return (
        <BendaharaView
          tenantName={session.tenant.name}
          userName={session.user.name}
          metrics={metrics}
        />
      );

    case "GURU":
      return (
        <GuruView
          tenantName={session.tenant.name}
          userName={session.user.name}
          metrics={metrics}
        />
      );

    case "KESANTRIAN":
    case "MUSYRIF":
      return (
        <KesantrianView
          tenantName={session.tenant.name}
          userName={session.user.name}
          metrics={metrics}
        />
      );

    case "WALI_SANTRI":
      return (
        <WaliView
          tenantName={session.tenant.name}
          userName={session.user.name}
        />
      );

    case "ADMIN":
      return (
        <AdminView
          tenantName={session.tenant.name}
          userName={session.user.name}
          activeModules={session.activeModules}
          metrics={metrics}
        />
      );

    case "OWNER":
    default:
      return (
        <OwnerView
          tenantName={session.tenant.name}
          userName={session.user.name}
          activeModules={session.activeModules}
          metrics={metrics}
        />
      );
  }
}
