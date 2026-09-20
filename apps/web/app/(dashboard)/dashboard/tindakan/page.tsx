import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import TindakanClient from "./tindakan-client";

export const dynamic = "force-dynamic";

export default async function TindakanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <TindakanClient tenantName={session.tenant.name} />;
}
