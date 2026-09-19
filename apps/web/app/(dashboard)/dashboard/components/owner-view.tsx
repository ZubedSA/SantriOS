"use client";

import React, { useState } from "react";
import { StatCard, Card, Badge } from "@santrios/ui";
import { SANTRIOS_MODULES } from "@santrios/modules";
import {
  Users,
  CalendarCheck,
  CreditCard,
  BookOpen,
  ArrowUpRight,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Building,
  AlertTriangle,
  Check,
  X,
  FileText,
  HeartPulse,
  Scale,
  Send,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@santrios/utils";

interface OwnerViewProps {
  tenantName: string;
  userName: string;
  activeModules: string[];
  metrics?: {
    totalStudents: number;
    activeStudents: number;
    classroomsCount: number;
    roomsCount: number;
    financialSummary: { income: number; expense: number; balance: number; unpaid: number };
    attendanceToday: { total: number; hadir: number; rate: string };
    pendingPermitsCount: number;
    recentHafalan: any[];
    recentTransactions: any[];
    recentAuditLogs: any[];
  };
}

export function OwnerView({ tenantName, userName, activeModules, metrics }: OwnerViewProps) {
  const [activeTab, setActiveTab] = useState<"ringkasan" | "disposisi" | "perhatian">("ringkasan");
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Disposisi State
  const [dispositions, setDispositions] = useState([
    {
      id: "disp-1",
      type: "IZIN_PULANG_KHUSUS",
      title: "Permohonan Izin Pulang Darurat (4 Hari)",
      target: "Bilal Ibnu Rabah (Kamar A-03 / Kelas Ulya 1)",
      reason: "Nenek kandung kritis di RSUD Solo, dijemput orang tua",
      submittedBy: "Musyrif Kamar (Ustadz Fatih)",
      date: "Hari Ini, 09.30 WIB",
      status: "PENDING",
    },
    {
      id: "disp-2",
      type: "IZIN_PULANG_KHUSUS",
      title: "Izin Menghadiri Pernikahan Kakak Kandung (3 Hari)",
      target: "Ahmad Zaki (Kamar A-01 / Kelas Wustha 2)",
      reason: "Pernikahan saudara kandung di Surabaya",
      submittedBy: "Wali Santri via Admin",
      date: "Kemarin, 16.45 WIB",
      status: "PENDING",
    },
    {
      id: "disp-3",
      type: "ANGGARAN_BESAR",
      title: "Pengajuan Dana Logistik Beras Dapur Santri (500 Kg)",
      target: "Rp 6.750.000 (Kas Operasional)",
      reason: "Stok beras dapur santri mukim tersisa 2 hari",
      submittedBy: "Bendahara (Ustadz Syamsul)",
      date: "Hari Ini, 08.00 WIB",
      status: "PENDING",
    },
  ]);

  // Santri Perhatian Khusus
  const [attentionList] = useState([
    {
      id: "att-1",
      name: "Ahmad Fauzan",
      nis: "20260021",
      classRoom: "Kelas Ulya 2",
      room: "Kamar Abu Bakar",
      category: "KEUANGAN",
      issue: "Tunggakan SPP & Uang Makan 4 Bulan Berturut-turut",
      detail: "Nominal: Rp 2.000.000. Wali belum merespons pesan konfirmasi TU.",
      severity: "TINGGI",
    },
    {
      id: "att-2",
      name: "Farhan Hakim",
      nis: "20260024",
      classRoom: "Kelas Wustha 2",
      room: "Kamar Umar",
      category: "KESEHATAN",
      issue: "Dirawat di UKS Pondok > 3 Hari (Gejala Tifus)",
      detail: "Suhu 38.5°C, dipantau perawat UKS. Menunggu keputusan rujukan ke RS.",
      severity: "SEDANG",
    },
    {
      id: "att-3",
      name: "Zaidan Al-Ayyubi",
      nis: "20260025",
      classRoom: "Kelas Wustha 1",
      room: "Kamar Utsman",
      category: "KEDISIPLINAN",
      issue: "Akumulasi Poin Pelanggaran Mencapai 65 Poin (Ambang SP2)",
      detail: "Kasus: 4x Terlambat Shalat Subuh, membawa HP non-resmi ke asrama.",
      severity: "TINGGI",
    },
  ]);

  const handleActionDisposition = (id: string, action: "APPROVED" | "REJECTED") => {
    setDispositions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: action } : d))
    );
    const item = dispositions.find((d) => d.id === id);
    setFeedbackMsg(
      action === "APPROVED"
        ? `Permohonan "${item?.title}" telah Anda RESTUI / SETUJUI.`
        : `Permohonan "${item?.title}" telah Anda TOLAK.`
    );
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const totalStudentsVal = metrics?.activeStudents ?? 428;
  const attendanceVal = metrics?.attendanceToday?.rate ?? "94.2%";
  const incomeVal = metrics?.financialSummary
    ? `Rp ${(metrics.financialSummary.income / 1_000_000).toFixed(1)} jt`
    : "Rp 58.4 jt";
  const tahfizhVal = metrics?.recentHafalan ? `${metrics.recentHafalan.length} Santri` : "42 Santri";

  const stats = [
    {
      title: "Santri Mukim Aktif",
      value: String(totalStudentsVal),
      subtitle: `${metrics?.totalStudents ?? 428} terdata di pondok`,
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Live DB", isPositive: true },
    },
    {
      title: "Kehadiran Shalat & KBM",
      value: attendanceVal,
      subtitle: metrics ? `${metrics.attendanceToday.hadir} santri hadir hari ini` : "391 santri hadir di pondok",
      icon: <CalendarCheck className="w-5 h-5 text-teal-600" />,
      trend: { value: "Disiplin", isPositive: true },
    },
    {
      title: "Arus Kas & SPP Bulan Ini",
      value: incomeVal,
      subtitle: metrics?.financialSummary
        ? `Saldo Kas: Rp ${(metrics.financialSummary.balance / 1_000_000).toFixed(1)} jt`
        : "86% dari target bulanan",
      icon: <CreditCard className="w-5 h-5 text-amber-500" />,
      trend: { value: "Kas Terverifikasi", isPositive: true },
    },
    {
      title: "Mutaba'ah Tahfizh",
      value: tahfizhVal,
      subtitle: "Setoran mutaba'ah santri",
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      trend: { value: "Aktif", isPositive: true },
    },
  ];

  const recentActivities =
    metrics?.recentAuditLogs && metrics.recentAuditLogs.length > 0
      ? metrics.recentAuditLogs.map((log: any) => ({
          id: log.id,
          title: log.action.replace(/_/g, " "),
          actor: log.user?.name || "Petugas Sistem",
          desc: `Entitas: ${log.entity} #${log.entityId?.slice(-6) || "SYS"}`,
          time: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(
            new Date(log.createdAt)
          ),
          icon: <Sparkles className="w-4 h-4 text-emerald-600" />,
          tag: log.entity,
        }))
      : [
          {
            id: "act-1",
            title: "Penerimaan SPP Syahriah",
            actor: "Bendahara (Ustadz Syamsul)",
            desc: "Santri: Ahmad Fauzan (Kelas Ulya 2) — Rp 500.000 via Kasir",
            time: "10 menit lalu",
            icon: <CreditCard className="w-4 h-4 text-emerald-600" />,
            tag: "Keuangan",
          },
          {
            id: "act-2",
            title: "Setoran Khatam Juz 30",
            actor: "Musyrif (Ustadz Fatih)",
            desc: "Santri: Muhammad Ali Al-Fatih (Mumtaz)",
            time: "35 menit lalu",
            icon: <BookOpen className="w-4 h-4 text-teal-600" />,
            tag: "Tahfizh",
          },
          {
            id: "act-3",
            title: "Presensi Shalat Subuh",
            actor: "Musyrif Kamar A-03",
            desc: "Presensi santri mukim: 26 Hadir, 1 Sakit di UKS",
            time: "2 jam lalu",
            icon: <CalendarCheck className="w-4 h-4 text-sky-600" />,
            tag: "Absensi",
          },
        ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Kokpit Eksekutif Pimpinan Pesantren</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Assalamu&apos;alaikum, Kyai {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Ringkasan menyeluruh operasional, stabilitas kas, dan perkembangan santri di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
        </div>

        {/* Quick Tabs on Banner */}
        <div className="relative z-10 mt-5 pt-4 border-t border-emerald-800/40 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("ringkasan")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ringkasan"
                ? "bg-emerald-500 text-slate-950 shadow-md"
                : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            Ringkasan Eksekutif
          </button>
          <button
            onClick={() => setActiveTab("disposisi")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "disposisi"
                ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                : "bg-emerald-900/40 text-amber-300 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <span>Disposisi & Kebijakan</span>
            {dispositions.filter((d) => d.status === "PENDING").length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                {dispositions.filter((d) => d.status === "PENDING").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("perhatian")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "perhatian"
                ? "bg-rose-500 text-white shadow-md font-bold"
                : "bg-emerald-900/40 text-rose-300 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <span>Radar Perhatian Khusus</span>
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600/80 text-white text-[10px]">
              {attentionList.length}
            </span>
          </button>
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

      {/* TAB 1: RINGKASAN EKSEKUTIF */}
      {activeTab === "ringkasan" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Activity Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Aktivitas Operasional Terkini
              </h3>
              <Link href="/audit" className="text-xs text-emerald-700 font-semibold hover:underline">
                Audit Lengkap &rarr;
              </Link>
            </div>

            <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
              {recentActivities.map((act) => (
                <div key={act.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-900 truncate">{act.title}</p>
                      <Badge variant="default" className="text-[10px] shrink-0">
                        {act.tag}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{act.desc}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                      <span>{act.actor}</span>
                      <span>•</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Right 1 Col: Status Modul */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Modul Pesantren Aktif
              </h3>
              <Link
                href="/modules"
                className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                Kelola
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 pb-2 border-b border-slate-100">
                <span>Status Berlangganan SaaS</span>
                <Badge variant="success">
                  {activeModules.length} Modul Aktif
                </Badge>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {activeModules.map((modKey) => {
                  const info = SANTRIOS_MODULES[modKey as keyof typeof SANTRIOS_MODULES];
                  return (
                    <div
                      key={modKey}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-800">
                          {info ? info.name : modKey}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {modKey}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Link
                  href="/modules"
                  className="block w-full py-2 px-3 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                >
                  + Pengaturan Fitur Pesantren
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: PUSAT DISPOSISI & KEBIJAKAN PIMPINAN */}
      {activeTab === "disposisi" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-600" />
                Pusat Disposisi & Restu Pengasuh
              </h3>
              <p className="text-xs text-slate-500">
                Persetujuan perizinan pulang darurat dan permohonan anggaran operasional khusus.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {dispositions.filter((d) => d.status === "PENDING").length} Menunggu Keputusan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dispositions.map((disp) => (
              <Card key={disp.id} className="p-4 space-y-3 border-slate-200 hover:border-amber-400/50 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge
                      variant={disp.type === "IZIN_PULANG_KHUSUS" ? "warning" : "default"}
                      className="text-[10px]"
                    >
                      {disp.type === "IZIN_PULANG_KHUSUS" ? "Izin Pulang Khusus" : "Anggaran Khusus"}
                    </Badge>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        disp.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : disp.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {disp.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{disp.title}</h4>
                  <p className="text-[11px] font-semibold text-emerald-700">{disp.target}</p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    &ldquo;{disp.reason}&rdquo;
                  </p>

                  <div className="text-[10px] text-slate-400 space-y-0.5 pt-1">
                    <p>Diajukan oleh: <span className="text-slate-600 font-medium">{disp.submittedBy}</span></p>
                    <p>Waktu: <span>{disp.date}</span></p>
                  </div>
                </div>

                {disp.status === "PENDING" ? (
                  <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                    <button
                      onClick={() => handleActionDisposition(disp.id, "APPROVED")}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Restui / Setujui
                    </button>
                    <button
                      onClick={() => handleActionDisposition(disp.id, "REJECTED")}
                      className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Tolak
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 text-center text-xs font-semibold text-slate-500 border-t border-slate-100">
                    Telah diputuskan: <span className={disp.status === "APPROVED" ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}>{disp.status === "APPROVED" ? "Disetujui" : "Ditolak"}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: RADAR SANTRI PERHATIAN KHUSUS */}
      {activeTab === "perhatian" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Radar Santri Perlu Perhatian Khusus
              </h3>
              <p className="text-xs text-slate-500">
                Santri dengan indikasi penanganan mendesak (tunggakan berat, kesehatan, atau akumulasi ta&apos;zir).
              </p>
            </div>
            <Link
              href="/dashboard/santri"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Lihat Direktori Santri &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {attentionList.map((item) => (
              <Card key={item.id} className="p-4 border-slate-200 hover:shadow-sm transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{item.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">NIS: {item.nis}</span>
                      <span className="text-[11px] text-slate-500">• {item.classRoom} ({item.room})</span>
                      <Badge
                        variant={
                          item.category === "KEUANGAN"
                            ? "warning"
                            : item.category === "KESEHATAN"
                            ? "info"
                            : "danger"
                        }
                        className="text-[10px]"
                      >
                        {item.category === "KEUANGAN" ? "Keuangan" : item.category === "KESEHATAN" ? "Kesehatan UKS" : "Kedisiplinan"}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-800">{item.issue}</p>
                    <p className="text-xs text-slate-600">{item.detail}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/dashboard/santri?search=${item.name}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Buka Profil
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
