import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import GuruStafClient from "./guru-staf-client";

export const dynamic = "force-dynamic";

export default async function GuruStafPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <GuruStafClient tenantName={session.tenant.name} />;
}
