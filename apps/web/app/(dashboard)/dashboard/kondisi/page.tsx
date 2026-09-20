import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import KondisiClient from "./kondisi-client";

export const dynamic = "force-dynamic";

export default async function KondisiPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <KondisiClient tenantName={session.tenant.name} />;
}
