import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { createTenantDb } from "@santrios/database";
import AbsensiClient, { StudentAttendance } from "./absensi-client";

export const dynamic = "force-dynamic";

export default async function AbsensiPage({
  searchParams,
}: {
  searchParams?: { tab?: string; class?: string };
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const initialTab = searchParams?.tab;
  const initialClass = searchParams?.class;

  // Bendahara murni menangani keuangan, jika membuka absensi diarahkan ke finance
  if (session.role.name === "BENDAHARA") {
    redirect("/dashboard/finance");
  }

  let initialStudents: StudentAttendance[] = [];

  try {
    const tenantDb = createTenantDb(session.tenant.id);

    // Load real students and today's attendance records
    const [{ students }, todayRecords] = await Promise.all([
      tenantDb.students.list({ take: 100 }),
      tenantDb.attendance.list({ date: new Date() }),
    ]);

    initialStudents = students.map((s) => {
      const todayRec = todayRecords.find((r) => r.studentId === s.id);
      const mappedStatus = todayRec
        ? todayRec.status === "ALFA"
          ? "ALPHA"
          : (todayRec.status as "HADIR" | "IZIN" | "SAKIT" | "ALPHA")
        : s.status === "IZIN"
        ? "IZIN"
        : s.status === "SAKIT"
        ? "SAKIT"
        : "HADIR";

      return {
        id: s.id,
        name: s.name,
        nis: s.nis,
        room: s.dormitoryRoom?.name || "Kamar Santri",
        className: s.classroom?.name || "Kelas Santri",
        status: mappedStatus,
        note: todayRec?.notes || undefined,
        lastSeen: "Presensi Santri",
      };
    });
  } catch (err: any) {
    console.warn("⚠️ [AbsensiPage] Gagal menjangkau server database, menggunakan data default cadangan:", err.message);
  }

  return (
    <AbsensiClient
      tenantName={session.tenant.name}
      userRole={session.role.name}
      userName={session.user.name}
      initialTab={initialTab}
      initialClass={initialClass}
      initialStudents={initialStudents}
    />
  );
}
