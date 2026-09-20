import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import NilaiClient from "./nilai-client";

export const dynamic = "force-dynamic";

export default async function NilaiPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <NilaiClient tenantName={session.tenant.name} />;
}
