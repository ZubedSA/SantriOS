import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import TugasClient from "./tugas-client";

export const dynamic = "force-dynamic";

export default async function TugasPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <TugasClient tenantName={session.tenant.name} />;
}
