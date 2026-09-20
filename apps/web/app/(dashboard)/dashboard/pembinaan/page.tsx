import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PembinaanClient from "./pembinaan-client";

export const dynamic = "force-dynamic";

export default async function PembinaanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PembinaanClient tenantName={session.tenant.name} />;
}
