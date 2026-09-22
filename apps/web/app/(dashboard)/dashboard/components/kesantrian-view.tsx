"use client";

import React, { useState, useEffect } from "react";
import { Card, StatCard, Badge } from "@santrios/ui";
import {
  Home,
  Users,
  CheckCircle2,
  FileCheck,
  ShieldAlert,
  Clock,
  BedDouble,
  Check,
  X,
  PlusCircle,
  AlertTriangle,
  Building,
  Printer,
  Scale,
  Award,
  Sparkles,
  QrCode,
  CalendarCheck,
  HeartHandshake,
  UserCheck,
  Layers,
} from "lucide-react";
import Link from "next/link";

interface KesantrianViewProps {
  tenantName: string;
  userName: string;
  metrics?: {
    totalStudents: number;
    activeStudents: number;
    roomsCount: number;
    attendanceToday: { total: number; hadir: number; rate: string };
    pendingPermitsCount: number;
  };
  initialTab?: string;
}

interface ViolationItem {
  id: string;
  santri: string;
  nis: string;
  room: string;
  category: "RINGAN" | "SEDANG" | "BERAT";
  violation: string;
  points: number;
  taazir: string;
  taazirStatus: "BELUM_TUNTAS" | "TUNTAS";
  date: string;
}

export function KesantrianView({
  tenantName,
  userName,
  metrics,
  initialTab,
}: KesantrianViewProps) {
  const [selectedGatePass, setSelectedGatePass] = useState<any | null>(null);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);

  const [selectedTab, setSelectedTab] = useState<
    | "disiplin"
    | "pelanggaran"
    | "poin"
    | "prestasi"
    | "pembinaan"
    | "tindakan"
    | "perizinan"
    | "perizinan_pengajuan"
    | "perizinan_persetujuan"
    | "perizinan_belum_kembali"
    | "perizinan_riwayat"
    | "asrama"
    | "asrama_gedung"
    | "kamar"
    | "asrama_penghuni"
    | "asrama_mutasi"
    | "kegiatan"
    | "laporan"
  >(
    initialTab === "prestasi"
      ? "prestasi"
      : initialTab === "pembinaan"
      ? "pembinaan"
      : initialTab === "tindakan"
      ? "tindakan"
      : initialTab?.startsWith("perizinan")
      ? (initialTab as any)
      : initialTab?.startsWith("asrama") || initialTab === "kamar"
      ? (initialTab as any)
      : initialTab === "kegiatan"
      ? "kegiatan"
      : initialTab === "laporan"
      ? "laporan"
      : initialTab === "poin"
      ? "poin"
      : "disiplin"
  );

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const validTabs = [
      "disiplin",
      "pelanggaran",
      "poin",
      "prestasi",
      "pembinaan",
      "tindakan",
      "perizinan",
      "perizinan_pengajuan",
      "perizinan_persetujuan",
      "perizinan_belum_kembali",
      "perizinan_riwayat",
      "asrama",
      "asrama_gedung",
      "kamar",
      "asrama_penghuni",
      "asrama_mutasi",
      "kegiatan",
      "laporan",
    ];
    if (initialTab && validTabs.includes(initialTab)) {
      setSelectedTab(initialTab as any);
    }
  }, [initialTab]);

  // Perizinan & Santri Belum Kembali (Section 8.7 of Spec)
  const [permits, setPermits] = useState([
    {
      id: "prm-1",
      permitNo: "IZN-260901",
      santri: "Bilal Ibnu Rabah",
      nis: "202601003",
      room: "Kamar A-03 (Utsman)",
      type: "Izin Keluar Beli Kitab",
      reason: "Membeli perlengkapan kitab & obat di apotek",
      duration: "14.00 - 17.00 WIB (Hari ini)",
      expectedReturn: "17.00 WIB",
      status: "APPROVED",
      isOverdue: false,
    },
    {
      id: "prm-2",
      permitNo: "IZN-260902",
      santri: "Ahmad Zaki",
      nis: "202601004",
      room: "Kamar A-01 (Abu Bakar)",
      type: "Izin Pulang Keluarga",
      reason: "Menghadiri pernikahan kakak kandung di Surabaya",
      duration: "2 Hari (19 - 21 Sep)",
      expectedReturn: "21 Sep, 18.00 WIB",
      status: "PENDING",
      isOverdue: false,
    },
    {
      id: "prm-3",
      permitNo: "IZN-260900",
      santri: "Zaidan Al-Ayyubi",
      nis: "20260025",
      room: "Kamar A-04 (Ali)",
      type: "Izin Keluar Berobat Gigi",
      reason: "Pemeriksaan di Klinik Gigi drg. Rahmawati",
      duration: "10.00 - 13.00 WIB (Kemarin)",
      expectedReturn: "Kemarin, 13.00 WIB",
      status: "APPROVED",
      isOverdue: true, // BELUM KEMBALI & OVERDUE (Section 8.7)
    },
  ]);

  // Pelanggaran Santri (Section 8.3 of Spec: Poin -2, -3, -5, -20, dll)
  const [violations, setViolations] = useState<ViolationItem[]>([
    {
      id: "v-1",
      santri: "Zaidan Al-Ayyubi",
      nis: "20260025",
      room: "Kamar A-04",
      category: "BERAT",
      violation: "Membawa Smartphone tanpa izin di lemari asrama",
      points: 20,
      taazir: "Sita HP s/d libur semester + Hafalan Surah Al-Waqi'ah",
      taazirStatus: "BELUM_TUNTAS",
      date: "Hari Ini, 07.15 WIB",
    },
    {
      id: "v-2",
      santri: "Farhan Hakim",
      nis: "20260024",
      room: "Kamar A-02",
      category: "RINGAN",
      violation: "Terlambat apel shalat Subuh berjamaah di masjid",
      points: 2,
      taazir: "Piket kebersihan shaf terdepan masjid 2 hari",
      taazirStatus: "TUNTAS",
      date: "Kemarin, Subuh",
    },
    {
      id: "v-3",
      santri: "Ihsanul Amal",
      nis: "20260027",
      room: "Kamar A-01",
      category: "SEDANG",
      violation: "Keluar gerbang pondok tanpa surat jalan satpam",
      points: 5,
      taazir: "Khidmah dapur santri 3 hari berturut-turut",
      taazirStatus: "BELUM_TUNTAS",
      date: "2 hari lalu",
    },
  ]);

  // Prestasi Santri (Section 8.4 of Spec: Reward Positif)
  const [achievements, setAchievements] = useState([
    {
      id: "ach-1",
      santri: "Muhammad Ali Al-Fatih",
      nis: "202601007",
      title: "Juara 1 Musabaqah Hifzhil Qur'an (MHQ) 10 Juz",
      category: "Prestasi Tahfizh",
      rewardPoints: "+10 Poin",
      date: "18 September 2026",
    },
    {
      id: "ach-2",
      santri: "Ahmad Fauzan",
      nis: "20260021",
      title: "Santri Teladan Disiplin & Shalat Berjamaah 100%",
      category: "Kedisiplinan Terbaik",
      rewardPoints: "+5 Poin",
      date: "15 September 2026",
    },
  ]);

  // Catatan Pembinaan Santri (Section 8.5 of Spec)
  const [counselingRecords, setCounselingRecords] = useState([
    {
      id: "cn-1",
      santri: "Zaidan Al-Ayyubi",
      nis: "20260025",
      issue: "Kerap terlambat bangun shalat Subuh & sering bermain game",
      mentor: "Ustadz Fatih (Kesantrian)",
      targetChange: "Tidur sebelum pukul 22.00 WIB dan bangun 04.00 WIB",
      status: "DALAM_EVALUASI",
      evaluationDate: "25 September 2026",
    },
    {
      id: "cn-2",
      santri: "Farhan Hakim",
      nis: "20260024",
      issue: "Kerap homesick dan sulit fokus pada halaqah tahfizh",
      mentor: "Ustadz Fatih (Kesantrian)",
      targetChange: "Bimbingan konseling persuasif & dukungan teman sekamar",
      status: "MEMBAIK",
      evaluationDate: "22 September 2026",
    },
  ]);

  // Asrama & Kamar (Section 8.8)
  const dormitoryRooms = [
    { name: "Kamar A-01 (Abu Bakar)", occupants: 10, capacity: 10, status: "Lengkap (10/10)", cleanScore: "A (Sangat Bersih)" },
    { name: "Kamar A-02 (Umar Bin Khattab)", occupants: 10, capacity: 10, status: "1 Sakit (Di UKS)", cleanScore: "B+ (Rapi)" },
    { name: "Kamar A-03 (Utsman Bin Affan)", occupants: 11, capacity: 12, status: "1 Izin Sambangan", cleanScore: "A (Sangat Bersih)" },
    { name: "Kamar A-04 (Ali Bin Abi Thalib)", occupants: 11, capacity: 12, status: "Lengkap (11/12)", cleanScore: "A (Sangat Bersih)" },
  ];

  // Handler Check-in Kepulangan Santri
  const handleCheckInReturn = (permitId: string) => {
    setPermits((prev) =>
      prev.map((p) => (p.id === permitId ? { ...p, isOverdue: false, status: "COMPLETED" } : p))
    );
    setFeedbackMsg("Alhamdulillah! Santri telah check-in kembali ke pesantren.");
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const stats = [
    {
      title: "Santri Mukim Asrama",
      value: `${metrics?.activeStudents ?? 428} Santri`,
      subtitle: "46 kamar asrama mukim",
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Live DB", isPositive: true },
    },
    {
      title: "Presensi Shalat Berjamaah",
      value: metrics?.attendanceToday?.rate ?? "95.2%",
      subtitle: metrics ? `${metrics.attendanceToday.hadir} hadir di masjid` : "403 Hadir, 1 Sakit UKS",
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />,
      trend: { value: "Tertib", isPositive: true },
    },
    {
      title: "Santri Belum Kembali",
      value: `${permits.filter((p) => p.isOverdue).length} Santri`,
      subtitle: "Terlambat kembali ke pondok",
      icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
      trend: { value: "Perlu Dicek", isPositive: false },
    },
    {
      title: "Prestasi Santri",
      value: `${achievements.length} Capaian`,
      subtitle: "Santri teladan & lomba",
      icon: <Award className="w-5 h-5 text-amber-500" />,
      trend: { value: "Membanggakan", isPositive: true },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-900 text-white text-xs font-semibold shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/30">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <Building className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Development & Discipline • Kesantrian & Kedisiplinan Pesantren</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Assalamu&apos;alaikum, Ustadz {userName} 👋
          </h2>
          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Pembinaan adab santri, penegakan tata tertib & poin ta&apos;zir, pengawasan perizinan gerbang, serta kontrol asrama di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-5">
        {stats.map((item, idx) => (
          <StatCard
            key={idx}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
            icon={item.icon}
            trend={item.trend}
          />
        ))}
      </div>

      {/* ================= TAB 1: PELANGGARAN & POIN TA'ZIR ================= */}
      {selectedTab === "disiplin" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Kedisiplinan & Poin Pelanggaran Santri (Section 8.3)
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan pelanggaran berpoin minus (-2, -3, -5, -20) dan tindak lanjut sanksi ta&apos;zir edukatif.
              </p>
            </div>
            <button
              onClick={() => setIsViolationModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Catat Pelanggaran</span>
            </button>
          </div>

          <div className="space-y-3">
            {violations.map((v) => (
              <Card key={v.id} className="p-4 border-slate-200 hover:border-slate-300 transition-all space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{v.santri}</span>
                      <span className="text-[11px] text-slate-400 font-mono">NIS: {v.nis}</span>
                      <span className="text-[11px] text-slate-500">• {v.room}</span>
                      <Badge variant={v.category === "BERAT" ? "danger" : v.category === "SEDANG" ? "warning" : "default"} className="text-[10px]">
                        {v.category} (-{v.points} Poin)
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{v.violation}</p>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      Ta&apos;zir Edukatif: <strong>{v.taazir}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    <Badge variant={v.taazirStatus === "TUNTAS" ? "success" : "danger"} className="text-[10px]">
                      {v.taazirStatus === "TUNTAS" ? "Ta'zir Tuntas" : "Belum Tuntas"}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRESTASI & SANTRI TELADAN (SECTION 8.4) ================= */}
      {selectedTab === "prestasi" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Prestasi & Santri Teladan (Section 8.4)
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan perkembangan positif, kebersihan asrama, ketepatan waktu, dan reward poin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <Card key={ach.id} className="p-4 border-slate-200 space-y-2 hover:border-amber-300 transition-all">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-900">{ach.santri}</span>
                    <p className="text-xs font-semibold text-amber-800">{ach.title}</p>
                    <p className="text-[11px] text-slate-500">{ach.category} • {ach.date}</p>
                  </div>
                  <Badge variant="success" className="text-[10px] bg-emerald-50 text-emerald-800 border-emerald-200 font-mono">
                    {ach.rewardPoints}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PEMBINAAN & KONSELING (SECTION 8.5) ================= */}
      {selectedTab === "pembinaan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-teal-600" />
                Alur Pembinaan & Evaluasi Santri (Section 8.5)
              </h3>
              <p className="text-xs text-slate-500">
                Alur: Pelanggaran &rarr; Pembinaan & Konseling &rarr; Target Perubahan &rarr; Evaluasi.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {counselingRecords.map((cn) => (
              <Card key={cn.id} className="p-4 border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{cn.santri}</h4>
                      <Badge variant={cn.status === "MEMBAIK" ? "success" : "warning"} className="text-[10px]">
                        {cn.status === "MEMBAIK" ? "Perkembangan Membaik" : "Dalam Evaluasi"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-700">Masalah: {cn.issue}</p>
                    <p className="text-xs text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                      Target Perubahan: <strong>{cn.targetChange}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400">Pembina: {cn.mentor} • Evaluasi: {cn.evaluationDate}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: PERIZINAN & SANTRI BELUM KEMBALI (SECTION 8.7) ================= */}
      {selectedTab === "perizinan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Perizinan Santri & Monitoring Belum Kembali (Section 8.7)
              </h3>
              <p className="text-xs text-slate-500">
                Pengawasan izin keluar gerbang santri dan deteksi otomatis keterlambatan kembali ke pondok.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {permits.map((p) => (
              <Card
                key={p.id}
                className={`p-4 border-2 transition-all space-y-2 ${
                  p.isOverdue ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{p.santri}</span>
                      <span className="text-[11px] text-slate-500 font-mono">No: {p.permitNo}</span>
                      <span className="text-[11px] text-slate-500">• {p.room}</span>
                      {p.isOverdue ? (
                        <Badge variant="danger" className="text-[10px] animate-pulse">
                          BELUM KEMBALI (TERLAMBAT)
                        </Badge>
                      ) : (
                        <Badge variant={p.status === "APPROVED" ? "success" : "warning"} className="text-[10px]">
                          {p.status}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 font-semibold">{p.type} • &ldquo;{p.reason}&rdquo;</p>
                    <p className="text-[11px] text-slate-500">
                      Waktu Izin: {p.duration} • Batas Kembali: <strong className={p.isOverdue ? "text-rose-700" : "text-slate-800"}>{p.expectedReturn}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {p.isOverdue ? (
                      <button
                        onClick={() => handleCheckInReturn(p.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Catat Kepulangan (Check-In)</span>
                      </button>
                    ) : p.status === "APPROVED" ? (
                      <button
                        onClick={() => setSelectedGatePass(p)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Slip Satpam</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setPermits((prev) =>
                            prev.map((it) => (it.id === p.id ? { ...it, status: "APPROVED" } : it))
                          );
                          setFeedbackMsg(`Izin ${p.santri} disetujui.`);
                          setTimeout(() => setFeedbackMsg(null), 3000);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                      >
                        Setujui Izin
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: ASRAMA & KAMAR ================= */}
      {selectedTab === "kamar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-indigo-600" />
                Kontrol Asrama, Kapasitas & Mutasi Kamar (Section 8.8)
              </h3>
              <p className="text-xs text-slate-500">Pengecekan sanitasi, kebersihan, dan penempatan santri.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dormitoryRooms.map((room, i) => (
              <Card key={i} className="p-4 space-y-3 hover:border-emerald-300 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">{room.name}</p>
                  <Badge variant={room.status.includes("Lengkap") ? "success" : "warning"} className="text-[10px]">
                    {room.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 text-slate-600">
                  <span>Kapasitas: <b>{room.occupants} / {room.capacity}</b></span>
                  <span>Kebersihan: <b className="text-emerald-700">{room.cleanScore}</b></span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/dashboard/absensi?room=${encodeURIComponent(room.name.split(" (")[0])}`}
                    className="flex-1 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors text-center"
                  >
                    Presensi Kamar
                  </Link>
                  <Link
                    href="/dashboard/santri"
                    className="flex-1 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors text-center"
                  >
                    Daftar Santri
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: TINDAKAN & TA'ZIR EDUKATIF (Section 8.6) ================= */}
      {selectedTab === "tindakan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                Daftar Tindakan & Ta&apos;zir Edukatif (Section 8.6)
              </h3>
              <p className="text-xs text-slate-500">
                Alur: Pelanggaran &rarr; Pembinaan &rarr; Tindakan Ta&apos;zir &rarr; Evaluasi & Perkembangan
              </p>
            </div>
            <button
              onClick={() => setIsViolationModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
            >
              + Catat Pelanggaran / Ta&apos;zir
            </button>
          </div>

          <div className="space-y-3">
            {[
              { type: "Teguran & Nasihat", target: "Santri terlambat apel pagi (1x)", penalty: "-2 Poin • Doa bersama & piket teras masjid", status: "TUNTAS" },
              { type: "Tugas Pembinaan (Ziyadah)", target: "Tidak mengikuti jamaah maghrib", penalty: "-3 Poin • Setoran 1/2 juz Al-Qur'an ba'da subuh", status: "DALAM_PROSES" },
              { type: "Panggilan Wali & Ta'zir Berat", target: "Membawa barang terlarang (Smartphone non-resmi)", penalty: "-20 Poin • Pemanggilan orang tua & skorsing 3 hari di pondok", status: "DALAM_PROSES" },
            ].map((t, i) => (
              <Card key={i} className="p-4 space-y-2 border-slate-200 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{t.type}</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">Kasus: {t.target}</p>
                    <p className="text-emerald-800 font-semibold text-[11px] mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      Bentuk Tindakan: {t.penalty}
                    </p>
                  </div>
                  <Badge variant={t.status === "TUNTAS" ? "success" : "warning"} className="text-[10px]">
                    {t.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: KEGIATAN SANTRI (Section 8.9) ================= */}
      {selectedTab === "kegiatan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-cyan-600" />
              Jadwal Kegiatan & Disiplin Harian Santri (Section 8.9)
            </h3>
            <Link
              href="/dashboard/kegiatan"
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold"
            >
              Buka Jadwal Kegiatan &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { time: "04.00 - 05.15 WIB", activity: "Bangun Pagi, Qiyamul Lail & Shalat Subuh Berjamaah", pic: "Pembina Asrama & Keamanan", loc: "Masjid Jami" },
              { time: "05.30 - 06.30 WIB", activity: "Halaqah Ziyadah Tahfizh Pagi", pic: "Dewan Asatidz Tahfizh", loc: "Halaqah Asrama" },
              { time: "16.00 - 17.15 WIB", activity: "Halaqah Muraja'ah & Dzikir Sore Al-Ma'tsurat", pic: "Ustadz Pembina", loc: "Masjid Lt. 1 & 2" },
              { time: "20.00 - 21.30 WIB", activity: "Belajar Mandiri Malam (Muajjah / Mudzakarah Kitab)", pic: "Pengurus Asrama", loc: "Gedung Belajar" },
            ].map((act, i) => (
              <Card key={i} className="p-4 space-y-1.5 border-slate-200 text-xs">
                <span className="font-bold text-emerald-700 font-mono text-[11px] block">{act.time}</span>
                <p className="font-bold text-slate-900">{act.activity}</p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Lokasi: {act.loc}</span>
                  <span>PIC: {act.pic}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: LAPORAN KESANTRIAN (Section 8.10) ================= */}
      {selectedTab === "laporan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Printer className="w-5 h-5 text-purple-600" />
              Laporan & Rekapitulasi Kesantrian (Section 8.10)
            </h3>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap Kesantrian</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <Card className="p-4 space-y-1.5 border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Ta&apos;zir Tuntas</span>
              <p className="text-2xl font-black text-emerald-700">91.4%</p>
              <p className="text-[11px] text-slate-500">Santri menyelesaikan tugas pembinaan tepat waktu.</p>
            </Card>
            <Card className="p-4 space-y-1.5 border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tingkat Kebersihan Asrama</span>
              <p className="text-2xl font-black text-teal-700">Nilai A</p>
              <p className="text-[11px] text-slate-500">Rata-rata penilaian sanitasi 46 kamar.</p>
            </Card>
            <Card className="p-4 space-y-1.5 border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Kepatuhan Izin Keluar</span>
              <p className="text-2xl font-black text-slate-900">98.2%</p>
              <p className="text-[11px] text-slate-500">Santri kembali tepat waktu sebelum batas jam malam.</p>
            </Card>
          </div>
        </div>
      )}

      {/* MODAL CETAK SLIP POS SATPAM */}
      {selectedGatePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Surat Izin Jalan Gerbang Satpam</h3>
              </div>
              <button
                onClick={() => setSelectedGatePass(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-2xl border-2 border-dashed border-amber-300 text-slate-800 text-xs space-y-3">
              <div className="text-center pb-2 border-b border-amber-200">
                <p className="font-extrabold text-xs uppercase tracking-wide">POS KEAMANAN & GERBANG UTAMA</p>
                <p className="text-[10px] text-slate-600">{tenantName}</p>
                <p className="text-[11px] font-mono font-bold text-emerald-800 mt-1">NO: {selectedGatePass.permitNo}</p>
              </div>

              <div className="space-y-1 text-xs">
                <p>Nama Santri : <span className="font-bold">{selectedGatePass.santri}</span></p>
                <p>Kamar Asrama : {selectedGatePass.room}</p>
                <p>Keperluan : <span className="italic font-medium">{selectedGatePass.reason}</span></p>
                <p>Durasi Izin : <span className="font-semibold">{selectedGatePass.duration}</span></p>
                <p className="text-rose-700 font-bold">Wajib Tiba di Pondok : {selectedGatePass.expectedReturn}</p>
              </div>

              <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-[10px] text-slate-500">
                <span>Disetujui: Bag. Kesantrian</span>
                <span className="font-mono">VERIFIED BY SANTRIOS</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Slip Gerbang</span>
              </button>
              <button
                onClick={() => setSelectedGatePass(null)}
                className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Backward compatibility alias
export const MusyrifView = KesantrianView;
