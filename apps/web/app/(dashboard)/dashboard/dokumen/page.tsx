import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import DokumenClient from "./dokumen-client";

export const dynamic = "force-dynamic";

export default async function DokumenPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <DokumenClient tenantName={session.tenant.name} />;
}
