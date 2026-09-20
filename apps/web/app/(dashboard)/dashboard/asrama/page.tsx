import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AsramaClient from "./asrama-client";

export const dynamic = "force-dynamic";

export default async function AsramaPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <AsramaClient tenantName={session.tenant.name} />;
}
