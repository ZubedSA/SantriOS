import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import KelasClient from "./kelas-client";

export const dynamic = "force-dynamic";

export default async function KelasPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <KelasClient tenantName={session.tenant.name} />;
}
