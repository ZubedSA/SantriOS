import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import RekonsiliasiClient from "./rekonsiliasi-client";

export const dynamic = "force-dynamic";

export default async function RekonsiliasiPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  return <RekonsiliasiClient tenantName={session.tenant.name} />;
}
