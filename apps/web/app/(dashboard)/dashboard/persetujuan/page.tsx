import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PersetujuanClient from "./persetujuan-client";

export const dynamic = "force-dynamic";

export default async function PersetujuanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PersetujuanClient tenantName={session.tenant.name} />;
}
