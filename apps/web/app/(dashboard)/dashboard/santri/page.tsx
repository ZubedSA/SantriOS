import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { createTenantDb } from "@santrios/database";
import SantriClient, { StudentItem } from "./santri-client";

export const dynamic = "force-dynamic";

export default async function SantriPage({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const initialTab = searchParams?.tab;

  let initialStudents: StudentItem[] = [];
  let classrooms: { id: string; name: string }[] = [];
  let rooms: { id: string; name: string }[] = [];

  try {
    const tenantDb = createTenantDb(session.tenant.id);

    // Fetch live students, classrooms, and dormitory rooms from Neon DB
    const [{ students }, dbClassrooms, dbRooms] = await Promise.all([
      tenantDb.students.list({ take: 200 }),
      tenantDb.students.getClassrooms(),
      tenantDb.students.getDormitoryRooms(),
    ]);

    classrooms = dbClassrooms.map((c: any) => ({ id: c.id, name: c.name }));
    rooms = dbRooms.map((r: any) => ({ id: r.id, name: r.name }));

    initialStudents = students.map((s: any) => {
      const totalDue = (s.invoices || []).reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
      const latestHafalan = s.hafalanRecords?.[0];

      return {
        id: s.id,
        nis: s.nis,
        nisn: s.nisn || undefined,
        name: s.name,
        nickname: s.nickname || s.name.split(" ")[0],
        gender: s.gender === "PEREMPUAN" ? "Perempuan" : "Laki-laki",
        birthPlace: s.birthPlace || "-",
        birthDate: s.birthDate
          ? new Date(s.birthDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "-",
        address: s.address || "-",
        phone: s.phone || "-",
        className: s.classroom?.name || "Belum Ditentukan",
        roomName: s.dormitoryRoom?.name || "Belum Ditentukan",
        status: (s.status as any) || "AKTIF",
        guardianName: s.guardianName || "-",
        guardianPhone: s.guardianPhone || "-",
        guardianRelation: s.guardianRelation || "WALI",
        hifzProgress: latestHafalan
          ? `Juz ${latestHafalan.juz} (${latestHafalan.surah})`
          : "Juz 30 (Baru)",
        hifzDetail: latestHafalan
          ? `Setoran terakhir: ${latestHafalan.surah} (Nilai: ${latestHafalan.grade})`
          : "Baru memulai halaqah bimbingan.",
        tuitionStatus: totalDue > 0 ? "MENUNGGAK" : "LUNAS",
        tuitionDue: totalDue,
        attendanceRate: "98.5%",
        recentPermit: "-",
      };
    });
  } catch (err: any) {
    console.warn("⚠️ [SantriPage] Gagal memuat data santri dari DB:", err.message);
  }

  return (
    <SantriClient
      tenantName={session.tenant.name}
      initialTab={initialTab}
      initialStudents={initialStudents}
      classrooms={classrooms}
      rooms={rooms}
      userRole={session.role.name}
    />
  );
}
