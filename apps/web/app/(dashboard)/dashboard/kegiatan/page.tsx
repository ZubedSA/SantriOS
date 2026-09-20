import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import KegiatanClient from "./kegiatan-client";

export const dynamic = "force-dynamic";

export default async function KegiatanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <KegiatanClient tenantName={session.tenant.name} />;
}
