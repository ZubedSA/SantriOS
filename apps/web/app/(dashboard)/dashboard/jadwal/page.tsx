import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import JadwalClient from "./jadwal-client";

export const dynamic = "force-dynamic";

export default async function JadwalPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <JadwalClient tenantName={session.tenant.name} />;
}
