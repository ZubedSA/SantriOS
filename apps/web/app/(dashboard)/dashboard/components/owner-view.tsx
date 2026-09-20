"use client";

import React, { useState, useEffect } from "react";
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
  Activity,
  Printer,
  FileSpreadsheet,
  AlertCircle,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Info,
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
  initialTab?: string;
}

export function OwnerView({
  tenantName,
  userName,
  activeModules,
  metrics,
  initialTab,
}: OwnerViewProps) {
  const [activeTab, setActiveTab] = useState<
    "ringkasan" | "kondisi" | "persetujuan" | "disposisi" | "laporan"
  >(
    initialTab === "kondisi"
      ? "kondisi"
      : initialTab === "persetujuan"
      ? "persetujuan"
      : initialTab === "disposisi"
      ? "disposisi"
      : initialTab === "laporan"
      ? "laporan"
      : "ringkasan"
  );

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab && ["ringkasan", "kondisi", "persetujuan", "disposisi", "laporan"].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  // Persetujuan / Approval State (Section 3.4 of Spec)
  const [approvals, setApprovals] = useState([
    {
      id: "appr-1",
      type: "PENGELUARAN_BESAR",
      title: "Pengajuan Logistik Beras Dapur Santri (500 Kg)",
      applicant: "Ustadz Syamsul Hadi, S.E. (Bendahara)",
      nominal: 6750000,
      urgency: "MENDESAK",
      date: "Hari Ini, 08.00 WIB",
      reason: "Stok beras dapur santri mukim tersisa 2 hari untuk konsumsi 428 santri.",
      status: "PENDING",
    },
    {
      id: "appr-2",
      type: "KEGIATAN",
      title: "Pemberangkatan Rihlah Ilmiah & Ziarah Santri Akhir Ulya",
      applicant: "Ustadz Ridwan, S.Pd. (Admin TU / Panitia)",
      nominal: 18500000,
      urgency: "TINGGI",
      date: "Kemarin, 14.30 WIB",
      reason: "Sewa 3 armada bus pariwisata & konsumsi santri kelas akhir ke Makam Walisongo.",
      status: "PENDING",
    },
    {
      id: "appr-3",
      type: "IZIN_KHUSUS",
      title: "Permohonan Izin Pulang Santri Darurat (> 3 Hari)",
      applicant: "Ustadz Fatih (Kesantrian)",
      nominal: 0,
      urgency: "TINGGI",
      date: "Hari Ini, 09.15 WIB",
      reason: "Santri: Bilal Ibnu Rabah. Nenek kandung kritis di RSUD Solo, dijemput langsung orang tua.",
      status: "PENDING",
    },
    {
      id: "appr-4",
      type: "KEBIJAKAN",
      title: "Pemberian Beasiswa Santri Yatim & Du'afa 2026/2027",
      applicant: "Bagian Kesejahteraan Santri",
      nominal: 12000000,
      urgency: "NORMAL",
      date: "2 hari lalu",
      reason: "Keringanan SPP 100% untuk 4 santri berprestasi yang kurang mampu.",
      status: "PENDING",
    },
  ]);

  // Disposisi Kiai State (Section 4.14 & 9.1 of Spec)
  const [dispositions, setDispositions] = useState([
    {
      id: "disp-1",
      title: "Siapkan Surat Pemberitahuan Libur Ramadhan & Panduan Santri",
      pic: "Admin TU (Ustadz Ridwan)",
      deadline: "25 September 2026",
      priority: "TINGGI",
      instructions: "Format surat resmi berkop pondok, cantumkan batas akhir penjemputan dan nomor piket asrama.",
      status: "DALAM_PROSES",
      progress: "Draf surat selesai dibuat, sedang menunggu nomor surat.",
    },
    {
      id: "disp-2",
      title: "Audit Fisik Kas & Rekonsiliasi Rekening Bank Muamalat",
      pic: "Bendahara (Ustadz Syamsul)",
      deadline: "28 September 2026",
      priority: "TINGGI",
      instructions: "Cocokkan selisih setoran kasir tunai dengan mutasi bank per 20 September.",
      status: "DALAM_PROSES",
      progress: "80% transaksi telah dicocokkan, sisa 3 transaksi transfer belum ada slip.",
    },
    {
      id: "disp-3",
      title: "Pemeriksaan Kamar & Penertiban Kedisiplinan Malam",
      pic: "Kepala Kesantrian (Ustadz Fatih)",
      deadline: "Hari Ini, 22.00 WIB",
      priority: "MENDESAK",
      instructions: "Pastikan seluruh santri mukim telah masuk asrama sebelum jam malam dan cek santri di UKS.",
      status: "SELESAI",
      progress: "Pemeriksaan selesai. 1 santri dirawat di UKS, seluruh kamar tertib.",
    },
  ]);

  // Form Disposisi Baru
  const [newDispTitle, setNewDispTitle] = useState("");
  const [newDispPic, setNewDispPic] = useState("Admin TU (Ustadz Ridwan)");
  const [newDispDeadline, setNewDispDeadline] = useState("");
  const [newDispPriority, setNewDispPriority] = useState<"RENDAH" | "SEDANG" | "TINGGI">("TINGGI");
  const [newDispInstructions, setNewDispInstructions] = useState("");
  const [isAddingDisp, setIsAddingDisp] = useState(false);

  // Laporan Periode State (Section 3.5 of Spec)
  const [reportPeriod, setReportPeriod] = useState<"HARI" | "MINGGU" | "BULAN" | "SEMESTER" | "TAHUN">("BULAN");
  const [reportCategory, setReportCategory] = useState<"KEUANGAN" | "SANTRI" | "AKADEMIK" | "TAHFIZH" | "KEDISIPLINAN">("KEUANGAN");

  // Approval Action Handler
  const handleApprovalAction = (id: string, action: "APPROVED" | "REJECTED" | "REVISION") => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
    const target = approvals.find((a) => a.id === id);
    if (action === "APPROVED") {
      setFeedbackMsg(`Alhamdulillah, pengajuan "${target?.title}" telah Anda RESTUI / SETUJUI.`);
    } else if (action === "REJECTED") {
      setFeedbackMsg(`Pengajuan "${target?.title}" telah Anda TOLAK.`);
    } else {
      setFeedbackMsg(`Pengajuan "${target?.title}" telah dikembalikan untuk REVISI / KLARIFIKASI.`);
    }
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // Submit Disposisi Baru
  const handleCreateDisposition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDispTitle.trim()) return;

    const newItem = {
      id: `disp-${Date.now()}`,
      title: newDispTitle,
      pic: newDispPic,
      deadline: newDispDeadline || "Segera",
      priority: newDispPriority,
      instructions: newDispInstructions,
      status: "DALAM_PROSES",
      progress: "Baru saja didisposisikan oleh Kiai.",
    };

    setDispositions([newItem, ...dispositions]);
    setIsAddingDisp(false);
    setNewDispTitle("");
    setNewDispInstructions("");
    setFeedbackMsg(`Disposisi "${newDispTitle}" berhasil diteruskan ke ${newDispPic}.`);
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  const totalStudentsVal = metrics?.activeStudents ?? 428;
  const attendanceVal = metrics?.attendanceToday?.rate ?? "94.2%";
  const incomeVal = metrics?.financialSummary
    ? `Rp ${(metrics.financialSummary.income / 1_000_000).toFixed(1)} jt`
    : "Rp 64.5 jt";
  const balanceVal = metrics?.financialSummary
    ? `Rp ${(metrics.financialSummary.balance / 1_000_000).toFixed(1)} jt`
    : "Rp 142.8 jt";

  const stats = [
    {
      title: "Santri Mukim Aktif",
      value: String(totalStudentsVal),
      subtitle: `${metrics?.totalStudents ?? 428} terdaftar resmi`,
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Live Database", isPositive: true },
    },
    {
      title: "Tingkat Kehadiran Harian",
      value: attendanceVal,
      subtitle: metrics ? `${metrics.attendanceToday.hadir} santri hadir` : "391 santri disiplin di pondok",
      icon: <CalendarCheck className="w-5 h-5 text-teal-600" />,
      trend: { value: "Disiplin Tinggi", isPositive: true },
    },
    {
      title: "Saldo Kas & Bank",
      value: balanceVal,
      subtitle: `Pemasukan bulan ini: ${incomeVal}`,
      icon: <CreditCard className="w-5 h-5 text-amber-500" />,
      trend: { value: "Likuid & Aman", isPositive: true },
    },
    {
      title: "Persetujuan Menunggu",
      value: `${approvals.filter((a) => a.status === "PENDING").length} Pengajuan`,
      subtitle: "Membutuhkan restu Kiai",
      icon: <FileCheck className="w-5 h-5 text-rose-500" />,
      trend: { value: "Prioritas", isPositive: false },
    },
  ];

  // 8 Domain Kondisi Pesantren / Executive Overview (Section 3.3 of Spec)
  const executiveIndicators = [
    {
      domain: "Kondisi Keuangan",
      status: "STABIL" as const,
      kpi: "Surplus Kas Rp 36.1 jt",
      desc: "Pemasukan SPP mencapai 86% dari target. Kas operasional mencukupi kebutuhan 3 bulan ke depan.",
      action: "Pertahankan kontrol pengeluaran logistik",
    },
    {
      domain: "Kehadiran Santri (Shalat & KBM)",
      status: "STABIL" as const,
      kpi: "94.2% Rata-rata Kehadiran",
      desc: "Sebagian besar santri tertib shalat berjamaah 5 waktu di masjid dan hadir di kelas tepat waktu.",
      action: "Monitoring santri izin keluar gerbang",
    },
    {
      domain: "Perkembangan Tahfizh",
      status: "PERHATIAN" as const,
      kpi: "82% Memenuhi Target Hafalan",
      desc: "14 santri di Halaqah Wustha 1 tertinggal ziyadah juz 29 dan butuh jam tambahan muraja'ah sore.",
      action: "Instruksikan Ustadz Tahfizh adakan bimbingan intensif",
    },
    {
      domain: "Kondisi Akademik",
      status: "STABIL" as const,
      kpi: "96% Tuntas KKM (Nilai ≥ 75)",
      desc: "Proses KBM semester berjalan lancar. Materi Nahwu & Fiqih sesuai silabus pesantren.",
      action: "Jadwalkan evaluasi tengah semester",
    },
    {
      domain: "Kedisiplinan & Perilaku",
      status: "PERHATIAN" as const,
      kpi: "6 Kasus Pelanggaran Minggu Ini",
      desc: "Terdapat 1 pelanggaran berat membawa smartphone non-resmi dan 5 kasus keterlambatan apel pagi.",
      action: "Panggil santri bersangkutan untuk pembinaan ta'zir",
    },
    {
      domain: "Kondisi Asrama & Kamar",
      status: "STABIL" as const,
      kpi: "46 Kamar Terisi (92% Kapasitas)",
      desc: "Sanitasi dan kebersihan kamar asrama terpelihara dengan baik. 1 santri dalam perawatan UKS.",
      action: "Pantau kesehatan santri di UKS",
    },
    {
      domain: "Tunggakan SPP & Uang Makan",
      status: "TINDAKAN" as const,
      kpi: "Rp 12.3 jt Belum Terbayar",
      desc: "18 santri menunggak > 2 bulan berturut-turut. Perlu tindak lanjut komunikasi persuasif dengan wali santri.",
      action: "Disposisikan Bendahara kirim pengingat WhatsApp",
    },
    {
      domain: "PPDB Santri Baru 2026/2027",
      status: "STABIL" as const,
      kpi: "142 Calon Santri Mendaftar",
      desc: "Kuota 85% terpenuhi. Seleksi baca Al-Qur'an dan wawancara wali tahap 1 berjalan tertib.",
      action: "Persiapkan penempatan kamar & kelas santri baru",
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

      {/* Header Banner - Executive Kokpit */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/30">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Executive Mode • Pengasuh & Pimpinan Pesantren</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Assalamu&apos;alaikum, Kyai {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Pusat kendali eksekutif untuk memantau stabilitas, memutuskan persetujuan strategis, serta mengarahkan kebijakan di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
        </div>

        {/* 5 Tab Menu Kiai (Section 3.7 & Spec) */}
        <div className="relative z-10 mt-6 pt-4 border-t border-emerald-800/40 flex flex-wrap gap-2">
          {[
            { id: "ringkasan", label: "Dashboard", icon: Sparkles },
            { id: "kondisi", label: "Kondisi Pesantren (Radar)", icon: Activity },
            { id: "persetujuan", label: "Persetujuan / Approval", icon: FileCheck, count: approvals.filter((a) => a.status === "PENDING").length },
            { id: "disposisi", label: "Disposisi Tugas Kiai", icon: FileText, count: dispositions.filter((d) => d.status === "DALAM_PROSES").length },
            { id: "laporan", label: "Laporan Eksekutif", icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSel
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                    : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Stats Cards */}
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

      {/* ================= TAB 1: DASHBOARD EKSEKUTIF ================= */}
      {activeTab === "ringkasan" && (
        <div className="space-y-6">
          {/* Strategic Alert Box (Section 3.6) */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3.5 text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-950">Notifikasi Strategis Pesantren</h4>
              <p className="text-xs text-amber-800 leading-relaxed">
                Terdapat <strong>{approvals.filter((a) => a.status === "PENDING").length} permohonan persetujuan</strong> menunggu keputusan Kiai, serta <strong>18 santri</strong> dengan akumulasi tunggakan SPP lebih dari 2 bulan yang perlu ditindaklanjuti.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("persetujuan")}
              className="ml-auto px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs shrink-0"
            >
              Tinjau Sekarang
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Aktivitas Operasional */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Aktivitas Operasional & Audit Trail
                </h3>
                <Link href="/audit" className="text-xs text-emerald-700 font-semibold hover:underline">
                  Audit Lengkap &rarr;
                </Link>
              </div>

              <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
                {[
                  {
                    title: "Penerimaan Pembayaran SPP Tunai",
                    actor: "Bendahara (Ustadz Syamsul)",
                    desc: "Santri: Ahmad Fauzan (Kelas Ulya 2) — Rp 500.000 via Meja Kasir TU",
                    time: "15 menit lalu",
                    tag: "Keuangan",
                  },
                  {
                    title: "Setoran Ziyadah Juz 29 Mutqin",
                    actor: "Guru Tahfizh (Ustadzah Fatimah)",
                    desc: "Santri: Muhammad Ali Al-Fatih — Predikat Mumtaz (A)",
                    time: "45 menit lalu",
                    tag: "Tahfizh",
                  },
                  {
                    title: "Pencatatan Presensi Shalat Ashar",
                    actor: "Petugas Kesantrian (Ustadz Fatih)",
                    desc: "Presensi 428 santri mukim: 403 Hadir, 1 Sakit di UKS, 24 Izin",
                    time: "2 jam lalu",
                    tag: "Absensi",
                  },
                ].map((act, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">{act.title}</p>
                        <Badge variant="default" className="text-[10px]">{act.tag}</Badge>
                      </div>
                      <p className="text-xs text-slate-600">{act.desc}</p>
                      <p className="text-[10px] text-slate-400">{act.actor} • {act.time}</p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Quick Actions & Modul */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                Akses Langsung Kiai
              </h3>

              <Card className="p-4 space-y-2.5">
                <button
                  onClick={() => setActiveTab("kondisi")}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-left transition-colors flex items-center justify-between text-xs font-semibold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Radar Kondisi Pesantren
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab("persetujuan")}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-left transition-colors flex items-center justify-between text-xs font-semibold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-amber-600" />
                    Hub Persetujuan Kiai
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab("disposisi")}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-left transition-colors flex items-center justify-between text-xs font-semibold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    Kirim Disposisi ke TU
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab("laporan")}
                  className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-left transition-colors flex items-center justify-between text-xs font-semibold text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                    Cetak Laporan Eksekutif
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: KONDISI PESANTREN (EXECUTIVE OVERVIEW) ================= */}
      {activeTab === "kondisi" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Kondisi Pesantren / Executive Overview
              </h3>
              <p className="text-xs text-slate-500">
                Pemantauan kesehatan institusi secara holistik dengan 3 indikator: <strong>Stabil</strong>, <strong>Perlu Perhatian</strong>, dan <strong>Perlu Tindakan</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {executiveIndicators.map((item, idx) => (
              <Card key={idx} className="p-4 space-y-3 flex flex-col justify-between border-slate-200 hover:border-emerald-300 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{item.domain}</span>
                    <Badge
                      variant={
                        item.status === "STABIL"
                          ? "success"
                          : item.status === "PERHATIAN"
                          ? "warning"
                          : "danger"
                      }
                      className="text-[10px]"
                    >
                      {item.status === "STABIL" ? "Stabil" : item.status === "PERHATIAN" ? "Perlu Perhatian" : "Perlu Tindakan"}
                    </Badge>
                  </div>
                  <p className="text-sm font-extrabold text-emerald-800">{item.kpi}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 font-medium">
                    Rekomendasi: <span className="text-slate-800 font-semibold">{item.action}</span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PERSETUJUAN / APPROVAL HUB ================= */}
      {activeTab === "persetujuan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-600" />
                Hub Persetujuan Eksekutif Kiai
              </h3>
              <p className="text-xs text-slate-500">
                Otorisasi pengeluaran dana besar, perizinan berisiko, dan kegiatan santri sesuai workflow pesantren.
              </p>
            </div>
            <Badge variant="warning" className="text-xs">
              {approvals.filter((a) => a.status === "PENDING").length} Menunggu Keputusan
            </Badge>
          </div>

          <div className="space-y-3">
            {approvals.map((item) => (
              <Card key={item.id} className="p-5 border-slate-200 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <Badge
                        variant={
                          item.urgency === "MENDESAK"
                            ? "danger"
                            : item.urgency === "TINGGI"
                            ? "warning"
                            : "default"
                        }
                        className="text-[10px]"
                      >
                        {item.urgency}
                      </Badge>
                      {item.nominal > 0 && (
                        <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          {formatRupiah(item.nominal)}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      &ldquo;{item.reason}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>Diajukan oleh: <strong className="text-slate-700">{item.applicant}</strong></span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {item.status === "PENDING" ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApprovalAction(item.id, "APPROVED")}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>Restui / Setujui</span>
                      </button>
                      <button
                        onClick={() => handleApprovalAction(item.id, "REVISION")}
                        className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition-all"
                      >
                        Minta Revisi
                      </button>
                      <button
                        onClick={() => handleApprovalAction(item.id, "REJECTED")}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-all"
                      >
                        Tolak
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
                      Status:{" "}
                      <span className={item.status === "APPROVED" ? "text-emerald-600" : item.status === "REVISION" ? "text-amber-600" : "text-rose-600"}>
                        {item.status === "APPROVED" ? "Disetujui" : item.status === "REVISION" ? "Revisi Diminta" : "Ditolak"}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: DISPOSISI TUGAS KIAI ================= */}
      {activeTab === "disposisi" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                Sistem Disposisi Kiai (Manajemen Tugas TU & Staf)
              </h3>
              <p className="text-xs text-slate-500">
                Pemberian instruksi dan amanat dari Kiai kepada Admin TU, Bendahara, atau Kesantrian dengan pelacakan status.
              </p>
            </div>
            <button
              onClick={() => setIsAddingDisp(!isAddingDisp)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Disposisi Baru</span>
            </button>
          </div>

          {/* Form Buat Disposisi */}
          {isAddingDisp && (
            <Card className="p-5 border-emerald-200 bg-emerald-50/40 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Form Amanat & Disposisi Baru
              </h4>
              <form onSubmit={handleCreateDisposition} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Judul Tugas / Amanat *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Siapkan surat kegiatan Ramadhan"
                      value={newDispTitle}
                      onChange={(e) => setNewDispTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">PIC / Penanggung Jawab *</label>
                    <select
                      value={newDispPic}
                      onChange={(e) => setNewDispPic(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="Admin TU (Ustadz Ridwan)">Admin TU (Ustadz Ridwan)</option>
                      <option value="Bendahara (Ustadz Syamsul)">Bendahara (Ustadz Syamsul)</option>
                      <option value="Kepala Kesantrian (Ustadz Fatih)">Kepala Kesantrian (Ustadz Fatih)</option>
                      <option value="Ustadz Tahfizh (Ustadzah Fatimah)">Ustadz Tahfizh (Ustadzah Fatimah)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Tenggat Waktu (Deadline)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 25 September 2026"
                      value={newDispDeadline}
                      onChange={(e) => setNewDispDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Prioritas</label>
                    <select
                      value={newDispPriority}
                      onChange={(e) => setNewDispPriority(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="RENDAH">Rendah</option>
                      <option value="SEDANG">Sedang</option>
                      <option value="TINGGI">Tinggi / Mendesak</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Instruksi & Arahan Kiai</label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan arahan spesifik untuk pelaksana..."
                    value={newDispInstructions}
                    onChange={(e) => setNewDispInstructions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingDisp(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Terbitkan Disposisi</span>
                  </button>
                </div>
              </form>
            </Card>
          )}

          {/* Daftar Disposisi */}
          <div className="space-y-3">
            {dispositions.map((item) => (
              <Card key={item.id} className="p-4 border-slate-200 hover:border-slate-300 transition-all space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <Badge variant={item.priority === "TINGGI" ? "danger" : "default"} className="text-[10px]">
                        {item.priority}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      PIC: <strong className="text-slate-700">{item.pic}</strong> • Deadline: <strong className="text-slate-700">{item.deadline}</strong>
                    </p>
                  </div>
                  <Badge variant={item.status === "SELESAI" ? "success" : "warning"} className="text-[10px] self-start sm:self-center">
                    {item.status === "SELESAI" ? "Selesai" : "Dalam Proses"}
                  </Badge>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong>Arahan:</strong> {item.instructions}
                </p>

                <div className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Progres Terbaru: {item.progress}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: LAPORAN EKSEKUTIF ================= */}
      {activeTab === "laporan" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-purple-600" />
                Laporan Eksekutif Terpadu
              </h3>
              <p className="text-xs text-slate-500">
                Pilih periode dan area laporan untuk tinjauan menyeluruh atau cetak dokumen resmi.
              </p>
            </div>

            {/* Filter Periode */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              {(["HARI", "MINGGU", "BULAN", "SEMESTER", "TAHUN"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setReportPeriod(p)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    reportPeriod === p ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {p === "HARI" ? "Hari" : p === "MINGGU" ? "Minggu" : p === "BULAN" ? "Bulan" : p === "SEMESTER" ? "Semester" : "Tahun"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Kategori Laporan */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["KEUANGAN", "SANTRI", "AKADEMIK", "TAHFIZH", "KEDISIPLINAN"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setReportCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  reportCategory === cat
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "KEUANGAN"
                  ? "Keuangan & Kas"
                  : cat === "SANTRI"
                  ? "Santri & Rombel"
                  : cat === "AKADEMIK"
                  ? "Akademik KBM"
                  : cat === "TAHFIZH"
                  ? "Capaian Tahfizh"
                  : "Kedisiplinan & Ta'zir"}
              </button>
            ))}
          </div>

          {/* Isi Laporan Dinamis */}
          <Card className="p-6 space-y-4 border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Ringkasan Laporan {reportCategory} • Periode {reportPeriod}
                </h4>
                <p className="text-xs text-slate-500">Pondok Pesantren {tenantName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
                <button
                  onClick={() => {
                    setFeedbackMsg("Laporan PDF ringkas berhasil di-generate.");
                    setTimeout(() => setFeedbackMsg(null), 3000);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ekspor PDF</span>
                </button>
              </div>
            </div>

            {reportCategory === "KEUANGAN" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Total Pemasukan</span>
                    <span className="font-bold text-emerald-700 font-mono text-sm">{incomeVal}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Total Pengeluaran</span>
                    <span className="font-bold text-rose-700 font-mono text-sm">Rp 28.4 jt</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Surplus / Defisit</span>
                    <span className="font-bold text-teal-700 font-mono text-sm">+ Rp 36.1 jt</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Sisa Saldo Kas</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">{balanceVal}</span>
                  </div>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Laporan keuangan menunjukkan tren positif dengan rasio kepatuhan pembayaran SPP santri mukim mencapai 86%. Anggaran belanja dapur dan listrik terkendali di bawah batas plafon anggaran bulanan.
                </p>
              </div>
            )}

            {reportCategory === "TAHFIZH" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Total Santri Tahfizh</span>
                    <span className="font-bold text-slate-900 text-sm">428 Santri</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Khatam 30 Juz Tahun Ini</span>
                    <span className="font-bold text-emerald-700 text-sm">12 Santri</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Target Sesuai Silabus</span>
                    <span className="font-bold text-teal-700 text-sm">82% Mutqin</span>
                  </div>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Sebanyak 12 santri telah menyelesaikan tasmi&apos; 30 juz bil ghaib sekali duduk. Program ziyadah pagi dan muraja&apos;ah sore berjalan stabil di 8 halaqah tahfizh binaan ustadz/ustadzah.
                </p>
              </div>
            )}

            {reportCategory === "KEDISIPLINAN" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Total Pelanggaran Bulan Ini</span>
                    <span className="font-bold text-amber-700 text-sm">19 Kasus</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Santri Prestasi / Teladan</span>
                    <span className="font-bold text-emerald-700 text-sm">34 Santri</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Status Pembinaan Tuntas</span>
                    <span className="font-bold text-teal-700 text-sm">91%</span>
                  </div>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Sistem ta&apos;zir edukatif (hafalan surat & khidmah masjid) efektif menekan angka pelanggaran berulang hingga 40% dibandingkan semester sebelumnya.
                </p>
              </div>
            )}

            {reportCategory === "SANTRI" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Santri Putra</span>
                    <span className="font-bold text-slate-900 text-sm">240 Santri</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Santri Putri</span>
                    <span className="font-bold text-slate-900 text-sm">188 Santri</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Rasio Kamar & Santri</span>
                    <span className="font-bold text-teal-700 text-sm">9.3 Santri/Kamar</span>
                  </div>
                </div>
              </div>
            )}

            {reportCategory === "AKADEMIK" && (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Jumlah Rombel Aktif</span>
                    <span className="font-bold text-slate-900 text-sm">12 Kelas</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Guru & Ustadz Pengampu</span>
                    <span className="font-bold text-emerald-700 text-sm">28 Ustadz</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Rata-rata Nilai KBM</span>
                    <span className="font-bold text-teal-700 text-sm">84.8 (Baik)</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
