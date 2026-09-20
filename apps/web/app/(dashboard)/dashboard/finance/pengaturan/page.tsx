import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PengaturanKeuanganClient from "./pengaturan-client";

export const dynamic = "force-dynamic";

export default async function PengaturanKeuanganPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PengaturanKeuanganClient tenantName={session.tenant.name} />;
}
