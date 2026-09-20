import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LaporanClient from "./laporan-client";

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <LaporanClient tenantName={session.tenant.name} />;
}
