import React from "react";
import Link from "next/link";
import { Card, StatCard, Badge } from "@santrios/ui";
import {
  Users,
  BookOpen,
  CreditCard,
  CalendarCheck,
  FileCheck,
  Send,
  Phone,
  Sparkles,
  Award,
  Bell,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";

interface WaliViewProps {
  tenantName: string;
  userName: string;
}

export function WaliView({ tenantName, userName }: WaliViewProps) {
  const child = {
    name: "Ahmad Fauzan",
    nis: "20260021",
    class: "Kelas Ulya 2 (SMA)",
    room: "Kamar A-03 (Utsman Bin Affan)",
    musyrif: "Ustadz Fatih Al-Banjari",
    musyrifPhone: "081234567890",
    status: "AKTIF",
    condition: "Sehat di Pondok",
    hifzProgress: "5 Juz 14 Halaman (Juz 29 - 72%)",
    walletBalance: 185000,
  };

  const stats = [
    {
      title: "Capaian Hafalan",
      value: "5 Juz+",
      subtitle: "Terakhir: Surah Al-Mulk",
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Mumtaz (A)", isPositive: true },
    },
    {
      title: "Status SPP September",
      value: "Lunas",
      subtitle: "Dibayar via Kasir Tunai",
      icon: <CreditCard className="w-5 h-5 text-teal-600" />,
      trend: { value: "Tepat Waktu", isPositive: true },
    },
    {
      title: "Presensi Pekan Ini",
      value: "100%",
      subtitle: "Shalat & Pelajaran Hadir",
      icon: <CalendarCheck className="w-5 h-5 text-indigo-500" />,
      trend: { value: "Disiplin", isPositive: true },
    },
    {
      title: "Saldo Uang Saku",
      value: formatRupiah(child.walletBalance),
      subtitle: "Di Koperasi Pondok",
      icon: <CreditCard className="w-5 h-5 text-amber-500" />,
      trend: { value: "Cukup", isPositive: true },
    },
  ];

  const recentHafalan = [
    { surah: "Surah Al-Mulk (Ayat 1-30)", date: "11 September 2026", grade: "Mumtaz (A)", ustadz: "Ustadz Fatih" },
    { surah: "Surah Al-Qalam (Ayat 1-25)", date: "08 September 2026", grade: "Jayyid Jiddan (B+)", ustadz: "Ustadz Fatih" },
    { surah: "Murajaah Juz 30 (Khatam)", date: "04 September 2026", grade: "Mumtaz (A)", ustadz: "Ustadzah Fatimah" },
  ];

  const announcements = [
    {
      title: "Jadwal Sambangan (Kunjungan Wali Santri)",
      date: "Ahad, 20 September 2026",
      desc: "Kunjungan dibuka pukul 08.00 - 17.00 WIB. Harap membawa identitas kartu wali.",
    },
    {
      title: "Pemeriksaan Kesehatan Berkala Santri",
      date: "Jumat, 18 September 2026",
      desc: "Kerjasama dengan Puskesmas setempat untuk seluruh santri asrama putra dan putri.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Portal Wali Santri SantriOS</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Assalamu&apos;alaikum, {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Pantau perkembangan ananda <span className="font-semibold text-white">{child.name}</span> di{" "}
            <span className="font-semibold text-white">{tenantName}</span>, mulai dari hafalan Qur&apos;an, kehadiran shalat, hingga SPP.
          </p>
        </div>
      </div>

      {/* Child Profile Highlight Card */}
      <Card className="p-5 bg-gradient-to-br from-emerald-50 via-white to-slate-50 border-emerald-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white font-bold text-xl flex items-center justify-center shadow-md">
              {child.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">{child.name}</h3>
                <Badge variant="success" className="text-[10px]">
                  {child.condition}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">NIS: {child.nis} • {child.class}</p>
              <p className="text-xs text-emerald-800 font-medium">{child.room}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/6281234567890?text=Assalamu'alaikum%20Ustadz,%20saya%20wali%20dari%20${encodeURIComponent(child.name)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi Kesantrian</span>
            </a>
            <Link
              href="/dashboard/activities?tab=perizinan&action=izin"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ajukan Izin</span>
            </Link>
          </div>
        </div>

        {/* Quick Portal Navigation Links */}
        <div className="pt-3 border-t border-emerald-100/80 flex flex-wrap items-center gap-2">
          <Link
            href="/dashboard/santri"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[11px] font-semibold shadow-xs transition-all"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kartu Santri &amp; Rapor</span>
          </Link>
          <Link
            href="/dashboard/finance"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[11px] font-semibold shadow-xs transition-all"
          >
            <CreditCard className="w-3.5 h-3.5 text-teal-600" />
            <span>Tagihan SPP &amp; Transfer</span>
          </Link>
          <Link
            href="/dashboard/absensi"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[11px] font-semibold shadow-xs transition-all"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Presensi Shalat &amp; KBM</span>
          </Link>
          <Link
            href="/dashboard/activities?tab=tahfizh"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 text-[11px] font-semibold shadow-xs transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Buku Mutaba&apos;ah Tahfizh</span>
          </Link>
        </div>
      </Card>

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

      {/* Grid: Hafalan Terkini & Pengumuman Pondok */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1-2: Riwayat Setoran Hafalan Qur'an */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Riwayat Perkembangan Tahfizh Ananda
            </h3>
            <span className="text-xs text-slate-400">Update Terakhir 11 Sep</span>
          </div>

          <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
            {recentHafalan.map((h, i) => (
              <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900">{h.surah}</p>
                    <Badge variant="success" className="text-[10px]">
                      {h.grade}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">Disimak oleh {h.ustadz}</p>
                </div>
                <span className="text-xs text-slate-400 font-medium shrink-0">{h.date}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Kolom 3: Pengumuman Pesantren untuk Wali */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-600" />
              Pengumuman Pondok
            </h3>
          </div>

          <Card className="p-4 space-y-3">
            <div className="space-y-3">
              {announcements.map((ann, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs font-bold text-slate-900">{ann.title}</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">{ann.date}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{ann.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
