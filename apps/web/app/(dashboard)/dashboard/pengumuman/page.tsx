import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PengumumanClient from "./pengumuman-client";

export const dynamic = "force-dynamic";

export default async function PengumumanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <PengumumanClient tenantName={session.tenant.name} />;
}
