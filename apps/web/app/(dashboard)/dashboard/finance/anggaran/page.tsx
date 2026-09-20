import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AnggaranClient from "./anggaran-client";

export const dynamic = "force-dynamic";

export default async function AnggaranPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <AnggaranClient tenantName={session.tenant.name} />;
}
