import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PrestasiClient from "./prestasi-client";

export const dynamic = "force-dynamic";

export default async function PrestasiPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PrestasiClient tenantName={session.tenant.name} />;
}
