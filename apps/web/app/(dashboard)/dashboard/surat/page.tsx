import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SuratClient from "./surat-client";

export const dynamic = "force-dynamic";

export default async function SuratPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return (
    <SuratClient
      tenantName={session.tenant.name}
      userRole={session.role.name}
      userName={session.user.name}
    />
  );
}
