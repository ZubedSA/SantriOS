import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import TahfizhClient from "./tahfizh-client";

export const dynamic = "force-dynamic";

export default async function TahfizhPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <TahfizhClient tenantName={session.tenant.name} />;
}
