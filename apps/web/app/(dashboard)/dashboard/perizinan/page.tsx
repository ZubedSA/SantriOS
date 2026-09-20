import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PerizinanClient from "./perizinan-client";

export const dynamic = "force-dynamic";

export default async function PerizinanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PerizinanClient tenantName={session.tenant.name} userRole={session.role.name} />;
}
