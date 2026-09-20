import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import DisposisiClient from "./disposisi-client";

export const dynamic = "force-dynamic";

export default async function DisposisiPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <DisposisiClient tenantName={session.tenant.name} userName={session.user.name} />;
}
