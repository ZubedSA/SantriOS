import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PenggunaClient from "./pengguna-client";

export const dynamic = "force-dynamic";

export default async function PenggunaPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PenggunaClient tenantName={session.tenant.name} currentUserRole={session.role.name} />;
}
