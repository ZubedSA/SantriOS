import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PelanggaranClient from "./pelanggaran-client";

export const dynamic = "force-dynamic";

export default async function PelanggaranPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PelanggaranClient tenantName={session.tenant.name} />;
}
