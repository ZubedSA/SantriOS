"use client";

import React, { useState } from "react";
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

export function KesantrianView({ tenantName, userName, metrics }: KesantrianViewProps) {
  const [selectedGatePass, setSelectedGatePass] = useState<any | null>(null);
  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"kamar" | "disiplin" | "perizinan">("disiplin");

  const [pendingPermits, setPendingPermits] = useState([
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
      status: "PENDING",
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
    },
  ]);

  const [violations, setViolations] = useState<ViolationItem[]>([
    {
      id: "v-1",
      santri: "Zaidan Al-Ayyubi",
      nis: "20260025",
      room: "Kamar A-04",
      category: "BERAT",
      violation: "Membawa & menyembunyikan Smartphone tanpa izin di lemari asrama",
      points: 50,
      taazir: "Sita HP s/d liburan semester + Hafalan Surah Al-Waqi'ah + Khidmah Aula",
      taazirStatus: "BELUM_TUNTAS",
      date: "Hari Ini, 07.15 WIB",
    },
    {
      id: "v-2",
      santri: "Farhan Hakim",
      nis: "20260024",
      room: "Kamar A-02",
      category: "RINGAN",
      violation: "Terlambat Bangun Shalat Shubuh (Masbuk Rakaat 2 di Masjid)",
      points: 5,
      taazir: "Membaca 1 Juz Al-Qur'an tartil setelah Shalat Ashar",
      taazirStatus: "TUNTAS",
      date: "Kemarin Subuh",
    },
    {
      id: "v-3",
      santri: "Raihan Putra Pratama",
      nis: "20260026",
      room: "Kamar A-03",
      category: "SEDANG",
      violation: "Menggunakan bahasa daerah / non-resmi pada pekan Bahasa Arab",
      points: 15,
      taazir: "Membawa kamus Munjid & menghafal 50 mufrodat baru di depan musyrif",
      taazirStatus: "BELUM_TUNTAS",
      date: "2 hari lalu",
    },
  ]);

  const [newViolation, setNewViolation] = useState({
    santri: "",
    nis: "",
    room: "Kamar A-01",
    category: "RINGAN" as "RINGAN" | "SEDANG" | "BERAT",
    violation: "",
    points: 5,
    taazir: "",
  });

  const stats = [
    {
      title: "Santri Mukim Asrama",
      value: `${metrics?.activeStudents ?? 42} Santri`,
      subtitle: `${metrics?.roomsCount ?? 46} kamar asrama binaan`,
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Live DB", isPositive: true },
    },
    {
      title: "Presensi Shalat 5 Waktu",
      value: metrics?.attendanceToday?.rate ?? "95.2%",
      subtitle: metrics ? `${metrics.attendanceToday.hadir} hadir tercatat` : "40 Hadir, 1 Sakit di UKS",
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />,
      trend: { value: "Disiplin", isPositive: true },
    },
    {
      title: "Izin Gerbang Menunggu",
      value: `${pendingPermits.filter((p) => p.status === "PENDING").length} Surat`,
      subtitle: "Menunggu approval musyrif",
      icon: <FileCheck className="w-5 h-5 text-sky-500" />,
      trend: { value: "Pos Satpam", isPositive: true },
    },
    {
      title: "Kasus Pelanggaran Ta'zir",
      value: `${violations.length} Santri`,
      subtitle: `${violations.filter((v) => v.taazirStatus === "BELUM_TUNTAS").length} ta'zir aktif`,
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      trend: { value: "Kamtib", isPositive: false },
    },
  ];

  const dormitoryRooms = [
    { name: "Kamar A-01 (Abu Bakar)", occupants: 10, capacity: 10, status: "Lengkap (10/10)", cleanScore: "A (Sangat Bersih)" },
    { name: "Kamar A-02 (Umar Bin Khattab)", occupants: 10, capacity: 10, status: "1 Sakit (Di UKS)", cleanScore: "B+ (Rapi)" },
    { name: "Kamar A-03 (Utsman Bin Affan)", occupants: 11, capacity: 12, status: "1 Izin Sambangan", cleanScore: "A (Sangat Bersih)" },
    { name: "Kamar A-04 (Ali Bin Abi Thalib)", occupants: 11, capacity: 12, status: "Lengkap (11/12)", cleanScore: "A (Sangat Bersih)" },
  ];

  const handleApprovePermit = (p: any) => {
    setPendingPermits((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, status: "APPROVED" } : item))
    );
    setSelectedGatePass({ ...p, status: "APPROVED" });
  };

  const handleRejectPermit = (id: string) => {
    setPendingPermits((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "REJECTED" } : p))
    );
  };

  const handleToggleTaazir = (id: string) => {
    setViolations((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              taazirStatus: v.taazirStatus === "BELUM_TUNTAS" ? "TUNTAS" : "BELUM_TUNTAS",
            }
          : v
      )
    );
  };

  const handleAddViolation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newViolation.santri || !newViolation.violation) return;
    setViolations([
      {
        id: `v-${Date.now()}`,
        santri: newViolation.santri,
        nis: newViolation.nis || "202600" + Math.floor(10 + Math.random() * 80),
        room: newViolation.room,
        category: newViolation.category,
        violation: newViolation.violation,
        points: Number(newViolation.points),
        taazir: newViolation.taazir || "Ta'zir kebersihan lingkungan masjid",
        taazirStatus: "BELUM_TUNTAS",
        date: "Hari ini",
      },
      ...violations,
    ]);
    setIsViolationModalOpen(false);
    setNewViolation({ santri: "", nis: "", room: "Kamar A-01", category: "RINGAN", violation: "", points: 5, taazir: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/30">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <Scale className="w-3.5 h-3.5 text-amber-300" />
            <span>Pusat Komando Kesantrian & Mahkamah Kedisiplinan</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Ahlan wa Sahlan, Ustadz {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Pengawalan shalat 5 waktu di masjid, kontrol jam malam asrama, pos perizinan gerbang, dan pembinaan kedisiplinan santri di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
        </div>

        {/* Quick Tabs on Banner */}
        <div className="relative z-10 mt-5 pt-4 border-t border-emerald-800/40 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTab("disiplin")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedTab === "disiplin"
                ? "bg-rose-500 text-white shadow-md font-bold"
                : "bg-emerald-900/40 text-rose-300 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Buku Pelanggaran & Ta&apos;zir ({violations.length})</span>
          </button>

          <button
            onClick={() => setSelectedTab("perizinan")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedTab === "perizinan"
                ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                : "bg-emerald-900/40 text-amber-300 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Izin Gerbang Pos Satpam</span>
            {pendingPermits.filter((p) => p.status === "PENDING").length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {pendingPermits.filter((p) => p.status === "PENDING").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setSelectedTab("kamar")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedTab === "kamar"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Kondisi Kamar Asrama</span>
          </button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/dashboard/absensi"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Presensi Shalat 5 Waktu</span>
        </Link>
        <button
          onClick={() => setIsViolationModalOpen(true)}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>+ Catat Pelanggaran Santri</span>
        </button>
        <button
          onClick={() => setSelectedTab("perizinan")}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all"
        >
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Verifikasi Izin Gerbang</span>
        </button>
        <Link
          href="/dashboard/santri"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all"
        >
          <BedDouble className="w-4 h-4 text-sky-600" />
          <span>Kontrol Kamar & UKS</span>
        </Link>
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

      {/* TAB 1: BUKU PELANGGARAN & POIN TA'ZIR */}
      {selectedTab === "disiplin" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Buku Catatan Kedisiplinan & Poin Ta&apos;zir Santri
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan pelanggaran, akumulasi poin sanksi, dan pemantauan eksekusi ta&apos;zir edukatif.
              </p>
            </div>
            <button
              onClick={() => setIsViolationModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Input Pelanggaran Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {violations.map((v) => (
              <Card key={v.id} className="p-4 border-slate-200 hover:shadow-sm transition-all space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{v.santri}</span>
                      <span className="text-[11px] text-slate-400 font-mono">NIS: {v.nis}</span>
                      <span className="text-[11px] text-slate-500">• {v.room}</span>
                      <Badge
                        variant={
                          v.category === "BERAT" ? "danger" : v.category === "SEDANG" ? "warning" : "default"
                        }
                        className="text-[10px]"
                      >
                        {v.category === "BERAT" ? "Pelanggaran Berat" : v.category === "SEDANG" ? "Pelanggaran Sedang" : "Pelanggaran Ringan"}
                      </Badge>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                        +{v.points} Poin Ta&apos;zir
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 mt-1">{v.violation}</p>
                    <div className="mt-1 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Bentuk Ta&apos;zir: </span>
                      {v.taazir}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleTaazir(v.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        v.taazirStatus === "TUNTAS"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                      }`}
                    >
                      {v.taazirStatus === "TUNTAS" ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Ta&apos;zir Tuntas</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Belum Tuntas</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400">{v.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PUSAT PERIZINAN GERBANG POS SATPAM */}
      {selectedTab === "perizinan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Pusat Perizinan Gerbang Pos Satpam (Gate Pass)
              </h3>
              <p className="text-xs text-slate-500">
                Verifikasi permohonan santri keluar pondok dan penerbitan slip jalan resmi pos satpam.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {pendingPermits.length} Data Terdaftar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPermits.map((p) => (
              <Card key={p.id} className="p-4 space-y-3 border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {p.permitNo}
                    </span>
                    <Badge variant={p.status === "APPROVED" ? "success" : p.status === "PENDING" ? "warning" : "danger"} className="text-[10px]">
                      {p.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{p.santri}</h4>
                    <p className="text-[11px] text-slate-500">{p.room} • NIS: {p.nis}</p>
                    <p className="text-xs font-semibold text-emerald-800 mt-1">{p.type}</p>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                    &ldquo;{p.reason}&rdquo;
                  </p>

                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <p>Masa Izin: <span className="font-semibold text-slate-800">{p.duration}</span></p>
                    <p>Wajib Kembali: <span className="font-semibold text-rose-700">{p.expectedReturn}</span></p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  {p.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleApprovePermit(p)}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Setujui & Buat Slip</span>
                      </button>
                      <button
                        onClick={() => handleRejectPermit(p.id)}
                        className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-rose-600 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSelectedGatePass(p)}
                      className="w-full py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Cetak Surat Jalan Gerbang (Gate Pass)</span>
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KONDISI KAMAR ASRAMA & UKS */}
      {selectedTab === "kamar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600" />
              Kondisi Kamar Binaan (Gedung Asrama Al-Faruq)
            </h3>
            <span className="text-xs text-slate-400">Pengecekan Jam Malam & UKS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

      {/* MODAL: INPUT PELANGGARAN SANTRI */}
      {isViolationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-rose-800 to-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-300" />
                Catat Pelanggaran / Poin Ta&apos;zir Santri
              </h3>
              <button
                onClick={() => setIsViolationModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddViolation} className="p-5 space-y-3 text-xs overflow-y-auto">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Santri *</label>
                <input
                  type="text"
                  required
                  value={newViolation.santri}
                  onChange={(e) => setNewViolation({ ...newViolation, santri: e.target.value })}
                  placeholder="Misal: Zaidan Al-Ayyubi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kamar Asrama</label>
                  <select
                    value={newViolation.room}
                    onChange={(e) => setNewViolation({ ...newViolation, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                  >
                    <option value="Kamar A-01">Kamar A-01 (Abu Bakar)</option>
                    <option value="Kamar A-02">Kamar A-02 (Umar)</option>
                    <option value="Kamar A-03">Kamar A-03 (Utsman)</option>
                    <option value="Kamar A-04">Kamar A-04 (Ali)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Tingkat Pelanggaran</label>
                  <select
                    value={newViolation.category}
                    onChange={(e) => {
                      const cat = e.target.value as "RINGAN" | "SEDANG" | "BERAT";
                      setNewViolation({
                        ...newViolation,
                        category: cat,
                        points: cat === "RINGAN" ? 5 : cat === "SEDANG" ? 15 : 50,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none font-semibold"
                  >
                    <option value="RINGAN">Ringan (5 Poin)</option>
                    <option value="SEDANG">Sedang (15 Poin)</option>
                    <option value="BERAT">Berat (50 Poin)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Bentuk Pelanggaran *</label>
                <textarea
                  rows={2}
                  required
                  value={newViolation.violation}
                  onChange={(e) => setNewViolation({ ...newViolation, violation: e.target.value })}
                  placeholder="Misal: Terlambat shalat subuh, kabur dari asrama, membawa barang terlarang..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Bentuk Sanksi Edukatif (Ta&apos;zir) *</label>
                <input
                  type="text"
                  required
                  value={newViolation.taazir}
                  onChange={(e) => setNewViolation({ ...newViolation, taazir: e.target.value })}
                  placeholder="Misal: Menghafal Surah Al-Mulk + Piket serambi masjid"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsViolationModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
                >
                  Simpan Pelanggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CETAK SURAT JALAN GERBANG SATPAM (GATE PASS) */}
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

            {/* Slip Pos Satpam */}
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

// Alias for backward compatibility
export const MusyrifView = KesantrianView;
