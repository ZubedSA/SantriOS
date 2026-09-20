import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import WaliSantriClient from "./wali-santri-client";

export const dynamic = "force-dynamic";

export default async function WaliSantriPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <WaliSantriClient tenantName={session.tenant.name} />;
}
