import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MasterClient from "./master-client";

export const dynamic = "force-dynamic";

export default async function MasterPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <MasterClient tenantName={session.tenant.name} />;
}
