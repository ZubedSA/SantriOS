import React from "react";
import { getCurrentSession } from "@/lib/session";
import { createTenantDb } from "@santrios/database";
import { redirect } from "next/navigation";
import ActivitiesClient from "./activities-client";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const initialTab = searchParams?.tab;

  let initialHafalan: any[] = [];
  let initialPermits: any[] = [];
  let studentsList: any[] = [];

  try {
    const tenantDb = createTenantDb(session.tenant.id);

    // Parallel fetch real data scoped strictly to current tenant
    const [tahfizhRes, permitsRes, studentsRes] = await Promise.all([
      tenantDb.tahfizh.list({ take: 50 }),
      tenantDb.permits.list({ take: 50 }),
      tenantDb.students.list({ take: 200 }),
    ]);

    initialHafalan = tahfizhRes.records.map((r) => ({
      id: r.id,
      studentName: r.student.name,
      className: r.student.classroom?.name || "Kelas Santri",
      type: "Ziyadah" as const,
      surah: r.ayahStart && r.ayahEnd ? `${r.surah} ayat ${r.ayahStart}-${r.ayahEnd}` : r.surah,
      juz: r.juz,
      grade: (r.grade === "MUMTAZ"
        ? "Mumtaz (A)"
        : r.grade === "JAYYID_JIDDAN"
        ? "Jayyid Jiddan (B+)"
        : r.grade === "JAYYID"
        ? "Jayyid (B)"
        : "Maqbul (C)") as "Mumtaz (A)" | "Jayyid Jiddan (B+)" | "Jayyid (B)" | "Maqbul (C)",
      ustadz: r.mentor?.name || "Dewan Asatidz",
      date: new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(r.createdAt)
      ),
      notes: r.notes || "",
    }));

    initialPermits = permitsRes.permits.map((p) => ({
      id: p.id,
      permitNo: `IZN-${p.id.slice(-6).toUpperCase()}`,
      studentName: p.student.name,
      className: p.student.classroom?.name || "Santri Mukim",
      reason: p.reason,
      type: (p.type as any) || "PULANG",
      startDate: new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short" }).format(
        new Date(p.startDate)
      ),
      endDate: new Intl.DateTimeFormat("id-ID", { dateStyle: "short", timeStyle: "short" }).format(
        new Date(p.endDate)
      ),
      status: (p.status as any) || "PENDING",
      guardianName: (p.student as any).guardianName || "Wali Santri",
      phone: (p.student as any).guardianPhone || "-",
    }));

    studentsList = studentsRes.students.map((s) => ({
      id: s.id,
      name: s.name,
      nis: s.nis,
      className: s.classroom?.name || "Kelas Santri",
      room: s.dormitoryRoom?.name || "Kamar Santri",
    }));
  } catch (err: any) {
    console.warn("⚠️ [ActivitiesPage] Gagal memuat data aktivitas dari DB:", err.message);
  }

  return (
    <ActivitiesClient
      tenantName={session.tenant.name}
      userRole={session.role.name}
      initialTab={initialTab}
      initialHafalan={initialHafalan}
      initialPermits={initialPermits}
      studentsList={studentsList}
    />
  );
}
