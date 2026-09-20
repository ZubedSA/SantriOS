import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import NotifikasiClient from "./notifikasi-client";

export const dynamic = "force-dynamic";

export default async function NotifikasiPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <NotifikasiClient tenantName={session.tenant.name} />;
}
