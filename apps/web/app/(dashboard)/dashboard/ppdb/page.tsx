import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PPDBClient from "./ppdb-client";

export const dynamic = "force-dynamic";

export default async function PPDBPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PPDBClient tenantName={session.tenant.name} />;
}
