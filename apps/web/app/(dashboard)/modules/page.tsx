import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ModulesClient from "./modules-client";

export const dynamic = "force-dynamic";

export default async function ModulesPage() {
  const session = await getCurrentSession();
  if (!session) {
    redirect("/login");
  }

  // Modul platform hanya dikelola oleh OWNER, ADMIN, atau SUPER_ADMIN
  if (
    session.role.name === "GURU" ||
    session.role.name === "KESANTRIAN" ||
    session.role.name === "MUSYRIF" ||
    session.role.name === "BENDAHARA" ||
    session.role.name === "WALI_SANTRI"
  ) {
    redirect("/dashboard");
  }

  return (
    <ModulesClient
      tenantName={session.tenant.name}
      tenantId={session.tenant.id}
      userRole={session.role.name}
      initialActiveModules={session.activeModules}
    />
  );
}
