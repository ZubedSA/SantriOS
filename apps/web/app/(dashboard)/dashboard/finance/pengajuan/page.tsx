import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PengajuanClient from "./pengajuan-client";

export const dynamic = "force-dynamic";

export default async function PengajuanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PengajuanClient tenantName={session.tenant.name} />;
}
