import React from "react";
import Link from "next/link";
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
} from "lucide-react";

interface MusyrifViewProps {
  tenantName: string;
  userName: string;
}

export function MusyrifView({ tenantName, userName }: MusyrifViewProps) {
  const stats = [
    {
      title: "Santri Asrama Binaan",
      value: "42 Santri",
      subtitle: "Gedung Al-Faruq (Kamar A1-A4)",
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Lengkap", isPositive: true },
    },
    {
      title: "Presensi Shalat Subuh",
      value: "95.2%",
      subtitle: "40 Hadir, 1 Sakit, 1 Izin",
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />,
      trend: { value: "Tertib", isPositive: true },
    },
    {
      title: "Izin Menunggu Review",
      value: "3 Izin",
      subtitle: "Keluar / Pulang pondok",
      icon: <FileCheck className="w-5 h-5 text-amber-500" />,
      trend: { value: "Butuh tindakan", isPositive: false },
    },
    {
      title: "Catatan Disiplin",
      value: "Nihil",
      subtitle: "Hari ini bersih pelanggaran",
      icon: <ShieldAlert className="w-5 h-5 text-indigo-500" />,
      trend: { value: "Kondusif", isPositive: true },
    },
  ];

  const dormitoryRooms = [
    { name: "Kamar A-01 (Abu Bakar)", occupants: 10, capacity: 10, status: "Lengkap", cleanScore: "A" },
    { name: "Kamar A-02 (Umar Bin Khattab)", occupants: 10, capacity: 10, status: "1 Sakit (UKS)", cleanScore: "B+" },
    { name: "Kamar A-03 (Utsman Bin Affan)", occupants: 11, capacity: 12, status: "1 Izin Pulang", cleanScore: "A" },
    { name: "Kamar A-04 (Ali Bin Abi Thalib)", occupants: 11, capacity: 12, status: "Lengkap", cleanScore: "A" },
  ];

  const pendingPermits = [
    {
      id: "prm-1",
      santri: "Bilal Ibnu Rabah",
      room: "Kamar A-03",
      type: "Izin Keluar",
      reason: "Membeli perlengkapan kitab & obat di apotek",
      duration: "14.00 - 17.00 WIB",
    },
    {
      id: "prm-2",
      santri: "Ahmad Zaki",
      room: "Kamar A-01",
      type: "Izin Pulang",
      reason: "Menghadiri pernikahan kakak kandung",
      duration: "2 Hari (12 - 14 Sep)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <Home className="w-3.5 h-3.5 text-amber-300" />
            <span>Pusat Pembinaan Asrama & Santri</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Ahlan wa Sahlan, Musyrif {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Pantau ketertiban kamar asrama, presensi shalat berjamaah 5 waktu, dan verifikasi perizinan santri binaan di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/dashboard/absensi"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Presensi Shalat Waktu</span>
        </Link>
        <Link
          href="/dashboard/activities?tab=perizinan"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Verifikasi Perizinan</span>
        </Link>
        <Link
          href="/dashboard/activities?tab=disiplin"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Catat Pelanggaran</span>
        </Link>
        <Link
          href="/dashboard/santri"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <BedDouble className="w-4 h-4 text-sky-600" />
          <span>Sidak Kamar & Asrama</span>
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

      {/* Grid: Kamar Asrama & Perizinan Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1-2: Kamar Asrama Binaan */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600" />
              Kondisi Kamar Binaan (Gedung Al-Faruq)
            </h3>
            <span className="text-xs text-slate-400">Pengecekan Malam Hari</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {dormitoryRooms.map((room, i) => (
              <Card key={i} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">{room.name}</p>
                  <Badge variant={room.status === "Lengkap" ? "success" : "warning"} className="text-[10px]">
                    {room.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-50 text-slate-600">
                  <span>Kapasitas: <b>{room.occupants} / {room.capacity}</b></span>
                  <span>Kebersihan: <b className="text-emerald-700">{room.cleanScore}</b></span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button className="flex-1 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors">
                    Presensi Kamar
                  </button>
                  <button className="flex-1 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors">
                    Daftar Santri
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Kolom 3: Izin Keluar Menunggu Verifikasi */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-amber-500" />
              Izin Perlu Diverifikasi
            </h3>
            <span className="text-xs text-slate-400">2 Menunggu</span>
          </div>

          <Card className="p-4 space-y-3">
            <div className="space-y-3">
              {pendingPermits.map((p) => (
                <div key={p.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{p.santri}</p>
                      <p className="text-[10px] text-slate-500">{p.room} • {p.type}</p>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold">{p.duration}</span>
                  </div>

                  <p className="text-[11px] text-slate-600 italic">&ldquo;{p.reason}&rdquo;</p>

                  <div className="flex items-center gap-2 pt-1">
                    <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors">
                      <Check className="w-3.5 h-3.5" />
                      Setujui
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-rose-600 text-[11px] font-semibold transition-colors">
                      <X className="w-3.5 h-3.5" />
                      Tolak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
