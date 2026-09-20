"use client";

import React, { useState, useEffect } from "react";
import { Card, StatCard, Badge } from "@santrios/ui";
import {
  BookOpen,
  Calendar,
  CheckSquare,
  Award,
  Clock,
  CheckCircle2,
  Users,
  PlusCircle,
  Sparkles,
  FileText,
  Download,
  X,
  ExternalLink,
  Send,
  Check,
  Search,
} from "lucide-react";
import Link from "next/link";

interface GuruViewProps {
  tenantName: string;
  userName: string;
  metrics?: {
    totalStudents: number;
    activeStudents: number;
    attendanceToday: { total: number; hadir: number; rate: string };
    recentHafalan: any[];
  };
  assignments?: string[];
  initialTab?: string;
}

interface ClassItem {
  id: string;
  subject: string;
  class: string;
  time: string;
  room: string;
  totalStudents: number;
  attendanceDone: boolean;
  book: string;
  currentTopic: string;
}

export function GuruView({
  tenantName,
  userName,
  metrics,
  assignments = ["GURU_MAPEL", "WALI_KELAS", "GURU_TAHFIZH"],
  initialTab,
}: GuruViewProps) {
  const hasTahfizh = assignments.includes("GURU_TAHFIZH");

  const [activeTab, setActiveTab] = useState<
    | "jadwal"
    | "tahfizh"
    | "nilai"
    | "tugas"
    | "perkembangan"
    | "tahfizh_halaqah"
    | "tahfizh_setoran"
    | "tahfizh_murajaah"
    | "tahfizh_target"
    | "tahfizh_ujian"
    | "tahfizh_perkembangan"
    | "tahfizh_laporan"
  >(
    initialTab?.startsWith("tahfizh") && hasTahfizh
      ? (initialTab as any)
      : initialTab === "nilai"
      ? "nilai"
      : initialTab === "tugas"
      ? "tugas"
      : initialTab === "perkembangan"
      ? "perkembangan"
      : "jadwal"
  );

  useEffect(() => {
    const validTabs = [
      "jadwal",
      "tahfizh",
      "nilai",
      "tugas",
      "perkembangan",
      "tahfizh_halaqah",
      "tahfizh_setoran",
      "tahfizh_murajaah",
      "tahfizh_target",
      "tahfizh_ujian",
      "tahfizh_perkembangan",
      "tahfizh_laporan",
    ];
    if (initialTab && validTabs.includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  const [selectedMaterial, setSelectedMaterial] = useState<ClassItem | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Tahfizh Setoran Form State (Section 6.3 of Spec)
  const [isAddingSetoran, setIsAddingSetoran] = useState(false);
  const [setoranSantri, setSetoranSantri] = useState("Muhammad Ali Al-Fatih");
  const [setoranSurah, setSetoranSurah] = useState("Al-Mulk");
  const [setoranAyatStart, setSetoranAyatStart] = useState("1");
  const [setoranAyatEnd, setSetoranAyatEnd] = useState("30");
  const [setoranJuz, setSetoranJuz] = useState("29");
  const [setoranTajwid, setSetoranTajwid] = useState("Mumtaz (A)");
  const [setoranFluency, setSetoranFluency] = useState("Mumtaz (A)");
  const [setoranNotes, setSetoranNotes] = useState("Makhraj & kelancaran sangat baik, lanjutkan ziyadah Al-Qalam.");

  const [setoranList, setSetoranList] = useState([
    {
      id: "st-1",
      santri: "Muhammad Ali Al-Fatih",
      surah: "Al-Mulk",
      ayat: "Ayat 1-30",
      juz: 29,
      grade: "Mumtaz",
      time: "Hari Ini, 07.15 WIB",
      notes: "Sangat lancar, tajwid mutqin.",
    },
    {
      id: "st-2",
      santri: "Ahmad Fauzan",
      surah: "An-Naba'",
      ayat: "Ayat 1-40",
      juz: 30,
      grade: "Jayyid Jiddan",
      time: "Hari Ini, 07.30 WIB",
      notes: "Perlu perbaikan ghunnah pada ayat 15-20.",
    },
    {
      id: "st-3",
      santri: "Bilal Ibnu Rabah",
      surah: "Al-Insan",
      ayat: "Ayat 1-18",
      juz: 29,
      grade: "Jayyid",
      time: "Kemarin, 16.30 WIB",
      notes: "Muraja'ah ulang sebelum lanjut ke ayat 19.",
    },
  ]);

  const handleSaveSetoran = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `st-${Date.now()}`,
      santri: setoranSantri,
      surah: setoranSurah,
      ayat: `Ayat ${setoranAyatStart}-${setoranAyatEnd}`,
      juz: Number(setoranJuz),
      grade: setoranTajwid.split(" ")[0],
      time: "Baru saja",
      notes: setoranNotes,
    };
    setSetoranList([newEntry, ...setoranList]);
    setIsAddingSetoran(false);
    setFeedbackMsg(`Setoran santri ${setoranSantri} (${setoranSurah}) berhasil disimpan!`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const stats = [
    {
      title: "Jadwal Hari Ini",
      value: "3 Sesi",
      subtitle: "Fiqih, Nahwu, Tahfizh",
      icon: <Calendar className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Aktif", isPositive: true },
    },
    {
      title: "Santri Binaan",
      value: `${metrics?.activeStudents ?? 68} Santri`,
      subtitle: "Rombel & Halaqah",
      icon: <Users className="w-5 h-5 text-teal-600" />,
      trend: { value: "Live DB", isPositive: true },
    },
    {
      title: "Setoran Tahfizh",
      value: `${setoranList.length} Riwayat`,
      subtitle: "Halaqah Utsman Bin Affan",
      icon: <BookOpen className="w-5 h-5 text-sky-500" />,
      trend: { value: "Aktif", isPositive: true },
    },
    {
      title: "Tingkat Kehadiran",
      value: metrics?.attendanceToday?.rate ?? "94.2%",
      subtitle: metrics ? `${metrics.attendanceToday.hadir} santri hadir` : "Disiplin KBM",
      icon: <CheckSquare className="w-5 h-5 text-amber-500" />,
      trend: { value: "Terdata", isPositive: true },
    },
  ];

  const todayClasses: ClassItem[] = [
    {
      id: "cls-1",
      subject: "Fiqih Ibadah (Fathul Qorib)",
      class: "Kelas Wustha 2",
      time: "07.30 - 09.00 WIB",
      room: "Ruang A-02",
      totalStudents: 32,
      attendanceDone: true,
      book: "Kitab Fathul Qorib Al-Mujib (Syaikh Muhammad bin Qasim Al-Ghazi)",
      currentTopic: "Bab Thaharah: Syarat & Rukun Wudhu serta Pembatalnya",
    },
    {
      id: "cls-2",
      subject: "Bahasa Arab & Nahwu (Al-Jurumiyah)",
      class: "Kelas Ulya 1",
      time: "09.30 - 11.00 WIB",
      room: "Ruang B-01",
      totalStudents: 28,
      attendanceDone: false,
      book: "Matan Al-Jurumiyah (Ibnu Ajurrum Ash-Shanhaji)",
      currentTopic: "Bab Al-Kalam: Pembagian Isim, Fi'il, Huruf & Tanda-Tanda I'rab",
    },
    {
      id: "cls-3",
      subject: "Halaqah Tahfizh Sore",
      class: "Halaqah Utsman Bin Affan",
      time: "16.00 - 17.15 WIB",
      room: "Masjid Utama Lt. 1",
      totalStudents: 12,
      attendanceDone: false,
      book: "Mushaf Al-Qur'an & Mandhumah Al-Jazariyyah",
      currentTopic: "Ziyadah Juz 29 & Muraja'ah Juz 30 (Makharijul Huruf & Sifatul Huruf)",
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
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Teaching Mode • Ustadz / Guru Pengajar Pesantren</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Assalamu&apos;alaikum, Ustadzah {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Kelola jadwal KBM, absensi cepat, input nilai rapor, serta pembinaan halaqah tahfizh santri di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>

          {/* Assignments Badges (Section 2 & 6) */}
          <div className="pt-2 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-emerald-300/80 text-[11px]">Tugas Tambahan (Assignment):</span>
            {assignments.map((asg) => (
              <span
                key={asg}
                className="px-2 py-0.5 rounded-md bg-emerald-800/60 border border-emerald-600/40 text-[10px] font-semibold text-emerald-200"
              >
                {asg === "GURU_TAHFIZH"
                  ? "Guru Tahfizh Al-Qur'an"
                  : asg === "WALI_KELAS"
                  ? "Wali Kelas Ulya 1"
                  : "Guru Mapel Nahwu & Fiqih"}
              </span>
            ))}
          </div>
        </div>

        {/* Tab Navigasi Guru (Section 5 & 6) */}
        <div className="relative z-10 mt-6 pt-4 border-t border-emerald-800/40 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("jadwal")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "jadwal"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwal Saya</span>
          </button>

          <Link
            href="/dashboard/santri?tab=kelas"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kelas Saya</span>
          </Link>

          <Link
            href="/dashboard/absensi"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Absensi Cepat KBM</span>
          </Link>

          <button
            onClick={() => setActiveTab("nilai")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "nilai"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Nilai Rapor</span>
          </button>

          <button
            onClick={() => setActiveTab("tugas")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "tugas"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tugas</span>
          </button>

          <button
            onClick={() => setActiveTab("perkembangan")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "perkembangan"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Perkembangan Santri</span>
          </button>

          {hasTahfizh && (
            <>
              <button
                onClick={() => setActiveTab("tahfizh")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "tahfizh" || activeTab === "tahfizh_setoran"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                    : "bg-emerald-900/40 text-amber-300 hover:bg-emerald-900/80 border border-emerald-700/40"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Tahfizh: Setoran</span>
              </button>

              <button
                onClick={() => setActiveTab("tahfizh_murajaah")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "tahfizh_murajaah"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                    : "bg-emerald-900/40 text-amber-300 hover:bg-emerald-900/80 border border-emerald-700/40"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Murajaah</span>
              </button>

              <button
                onClick={() => setActiveTab("tahfizh_ujian")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "tahfizh_ujian"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                    : "bg-emerald-900/40 text-amber-300 hover:bg-emerald-900/80 border border-emerald-700/40"
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Ujian Tahfizh</span>
              </button>

              <button
                onClick={() => setActiveTab("tahfizh_laporan")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "tahfizh_laporan"
                    ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                    : "bg-emerald-900/40 text-amber-300 hover:bg-emerald-900/80 border border-emerald-700/40"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Laporan Tahfizh</span>
              </button>
            </>
          )}
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

      {/* ================= TAB 1: JADWAL & KBM ================= */}
      {activeTab === "jadwal" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Jadwal Mengajar & Pertemuan Hari Ini
            </h3>
            <Link
              href="/dashboard/absensi"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Buka Presensi KBM</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {todayClasses.map((cls) => (
              <Card key={cls.id} className="p-4 space-y-3 flex flex-col justify-between border-slate-200 hover:border-emerald-300 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={cls.attendanceDone ? "success" : "warning"} className="text-[10px]">
                      {cls.attendanceDone ? "Presensi Selesai" : "Belum Presensi"}
                    </Badge>
                    <span className="text-[10px] text-slate-400 font-mono">{cls.time}</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{cls.subject}</h4>
                    <p className="text-[11px] text-emerald-700 font-medium">{cls.class} • {cls.room}</p>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 line-clamp-2">
                    {cls.currentTopic}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">{cls.totalStudents} Santri</span>
                  <button
                    onClick={() => setSelectedMaterial(cls)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Materi & Kitab</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: ASSIGNMENT GURU TAHFIZH (SECTION 6) ================= */}
      {activeTab === "tahfizh" && hasTahfizh && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Assignment: Modul Guru Tahfizh (Halaqah & Setoran)
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan setoran cepat (surat, ayat, kelancaran, tajwid) serta monitoring target muraja&apos;ah santri.
              </p>
            </div>

            <button
              onClick={() => setIsAddingSetoran(!isAddingSetoran)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Input Setoran Santri</span>
            </button>
          </div>

          {/* Form Input Setoran Cepat (Section 6.3) */}
          {isAddingSetoran && (
            <Card className="p-5 border-amber-300 bg-amber-50/50 space-y-4 animate-in fade-in">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Form Input Setoran Cepat Tahfizh (Mobile-First)
              </h4>
              <form onSubmit={handleSaveSetoran} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Santri *</label>
                    <select
                      value={setoranSantri}
                      onChange={(e) => setSetoranSantri(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-amber-500 focus:outline-none bg-white"
                    >
                      <option value="Muhammad Ali Al-Fatih">Muhammad Ali Al-Fatih (Ulya 1)</option>
                      <option value="Ahmad Fauzan">Ahmad Fauzan (Ulya 2)</option>
                      <option value="Bilal Ibnu Rabah">Bilal Ibnu Rabah (Wustha 2)</option>
                      <option value="Farhan Hakim">Farhan Hakim (Wustha 1)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Surah *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Al-Mulk"
                      value={setoranSurah}
                      onChange={(e) => setSetoranSurah(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Juz</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={setoranJuz}
                      onChange={(e) => setSetoranJuz(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Ayat Mulai</label>
                    <input
                      type="number"
                      value={setoranAyatStart}
                      onChange={(e) => setSetoranAyatStart(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-500 focus:outline-none bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Ayat Selesai</label>
                    <input
                      type="number"
                      value={setoranAyatEnd}
                      onChange={(e) => setSetoranAyatEnd(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-500 focus:outline-none bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Tajwid & Makhraj</label>
                    <select
                      value={setoranTajwid}
                      onChange={(e) => setSetoranTajwid(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-amber-500 focus:outline-none bg-white"
                    >
                      <option value="Mumtaz (A)">Mumtaz (A)</option>
                      <option value="Jayyid Jiddan (B+)">Jayyid Jiddan (B+)</option>
                      <option value="Jayyid (B)">Jayyid (B)</option>
                      <option value="Maqbul (C)">Maqbul (C)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kelancaran</label>
                    <select
                      value={setoranFluency}
                      onChange={(e) => setSetoranFluency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-amber-500 focus:outline-none bg-white"
                    >
                      <option value="Mumtaz (A)">Mumtaz (A) - Tanpa Salah</option>
                      <option value="Jayyid Jiddan (B+)">Jayyid Jiddan (1-2x Ralat)</option>
                      <option value="Jayyid (B)">Jayyid (3-5x Ralat)</option>
                      <option value="Maqbul (C)">Maqbul (Perlu Diulang)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Catatan Pembimbing / Evaluasi</label>
                  <textarea
                    rows={2}
                    value={setoranNotes}
                    onChange={(e) => setSetoranNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-500 focus:outline-none bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingSetoran(false)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan Nilai Setoran</span>
                  </button>
                </div>
              </form>
            </Card>
          )}

          {/* Daftar Setoran Terkini */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">Riwayat Mutaba&apos;ah Setoran Halaqah</h4>
            {setoranList.map((st) => (
              <Card key={st.id} className="p-4 border-slate-200 space-y-2 hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{st.santri}</span>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                        Surah {st.surah} ({st.ayat}) • Juz {st.juz}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100">
                      &ldquo;{st.notes}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={st.grade === "Mumtaz" ? "success" : "default"} className="text-[10px]">
                      {st.grade}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{st.time}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: NILAI SISWA (Section 5.6) ================= */}
      {activeTab === "nilai" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Penilaian Akademik & Rapor Santri (Section 5.6)
            </h3>
            <Link
              href="/dashboard/santri?tab=kelas"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Buka Leger Nilai &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { subject: "Fiqih Ibadah", class: "Kelas Wustha 2", avg: "88.4", pass: "32/32 Santri", predicate: "Mumtaz" },
              { subject: "Nahwu & Bahasa Arab", class: "Kelas Ulya 1", avg: "91.2", pass: "28/28 Santri", predicate: "Mumtaz" },
              { subject: "Tauhid & Aqidah", class: "Kelas Wustha 1", avg: "86.5", pass: "30/30 Santri", predicate: "Jayyid Jiddan" },
            ].map((n, i) => (
              <Card key={i} className="p-4 space-y-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{n.subject}</span>
                  <Badge variant="success" className="text-[10px]">{n.predicate}</Badge>
                </div>
                <p className="text-[11px] text-slate-500">{n.class} • Ketuntasan: {n.pass}</p>
                <div className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400">Rata-rata Nilai:</span>
                  <span className="font-bold font-mono text-emerald-700">{n.avg}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: TUGAS SISWA (Section 5.7) ================= */}
      {activeTab === "tugas" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-600" />
              Tugas & Penugasan Santri (Section 5.7)
            </h3>
            <button
              onClick={() => alert("Membuka form penugasan santri baru...")}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
            >
              + Buat Tugas Baru
            </button>
          </div>

          <div className="space-y-3">
            {[
              { title: "Hafalan Nadzom Jurumiyah Bab I'rab", class: "Kelas Ulya 1", deadline: "Jumat, 25 September 2026", submitted: "26 / 28 Santri", status: "AKTIF" },
              { title: "Rangkuman Rukun Wudhu Kitab Fathul Qorib", class: "Kelas Wustha 2", deadline: "Senin, 28 September 2026", submitted: "30 / 32 Santri", status: "AKTIF" },
            ].map((t, i) => (
              <Card key={i} className="p-4 space-y-2 border-slate-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{t.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{t.class} • Tenggat: <span className="text-rose-600 font-semibold">{t.deadline}</span></p>
                  </div>
                  <Badge variant="success" className="text-[10px]">{t.submitted}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: PERKEMBANGAN SANTRI (Section 5.8) ================= */}
      {activeTab === "perkembangan" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-600" />
            Catatan Bimbingan & Perkembangan Santri (Section 5.8)
          </h3>
          <p className="text-xs text-slate-500">
            Guru fokus pada adab, kehadiran KBM, dan capaian akademik santri. Data finansial keluarga dilindungi oleh sistem.
          </p>
          <div className="space-y-3">
            {[
              { name: "Muhammad Ali Al-Fatih", class: "Ulya 1", notes: "Sangat antusias saat kajian Nahwu, adab kepada ustadz sangat baik, aktif membantu teman halaqah.", adab: "Mumtaz (A)" },
              { name: "Ahmad Fauzan", class: "Wustha 2", notes: "Pemahaman Fiqih cepat, perlu sedikit dorongan ketelitian dalam menghafal matan syarat shalat.", adab: "Jayyid Jiddan (B+)" },
            ].map((p, i) => (
              <Card key={i} className="p-4 space-y-1.5 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{p.name} ({p.class})</span>
                  <Badge variant="success" className="text-[10px]">{p.adab}</Badge>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {p.notes}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: TAHFIZH MURAJAAH (Section 6.4) ================= */}
      {activeTab === "tahfizh_murajaah" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              Jurnal Muraja&apos;ah Santri (Section 6.4)
            </h3>
            <button
              onClick={() => alert("Mencatat muraja'ah santri...")}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold"
            >
              + Catat Muraja&apos;ah
            </button>
          </div>
          <div className="space-y-3">
            {[
              { santri: "Muhammad Ali Al-Fatih", juz: "Juz 28 & 29", fluency: "Lancar Mutqin", date: "Hari ini, 16.30 WIB" },
              { santri: "Ahmad Fauzan", juz: "Juz 30 (An-Naba s.d An-Nas)", fluency: "Lancar (1 catatan wakaf)", date: "Kemarin, 16.45 WIB" },
            ].map((m, i) => (
              <Card key={i} className="p-3.5 space-y-1 border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{m.santri}</span>
                  <span className="text-[10px] text-slate-400">{m.date}</span>
                </div>
                <p className="text-emerald-700 font-semibold">{m.juz} • Status: {m.fluency}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: TAHFIZH UJIAN (Section 6.7) ================= */}
      {activeTab === "tahfizh_ujian" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Ujian Tahfizh & Tasmi&apos; (Section 6.7)
            </h3>
            <button
              onClick={() => alert("Menjadwalkan ujian tasmi'...")}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
            >
              + Jadwalkan Ujian Tasmi&apos;
            </button>
          </div>
          <div className="space-y-3">
            {[
              { santri: "Muhammad Ali Al-Fatih", type: "Tasmi' Sekali Duduk 5 Juz (Juz 26-30)", examiner: "Ustadz Ridwan & Ustadz Syarif", grade: "98.5 (Mumtaz)", status: "LULUS_BERSERTIFIKAT" },
              { santri: "Bilal Ibnu Rabah", type: "Ujian Juz 30 Bil-Ghaib", examiner: "Ustadzah Fatimah, Lc.", grade: "92.0 (Jayyid Jiddan)", status: "LULUS" },
            ].map((u, i) => (
              <Card key={i} className="p-4 space-y-2 border-slate-200 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{u.santri}</h4>
                    <p className="text-purple-800 font-semibold text-[11px] mt-0.5">{u.type}</p>
                    <p className="text-slate-400 text-[10px]">Penguji: {u.examiner}</p>
                  </div>
                  <Badge variant="success" className="text-[10px]">{u.grade}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: TAHFIZH LAPORAN (Section 6.8) ================= */}
      {activeTab === "tahfizh_laporan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Laporan Kemajuan Hafalan Halaqah (Section 6.8)
            </h3>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
            >
              Cetak Rekap Tahfizh
            </button>
          </div>
          <Card className="p-4 space-y-2 border-slate-200 text-xs">
            <p className="font-semibold text-slate-800">Capaian Mutu Tahfizh:</p>
            <p className="text-slate-600">
              100% santri halaqah bimbingan aktif menyetorkan ziyadah minimal 1 halaman per hari dan muraja&apos;ah rutin sebelum waktu shalat maghrib.
            </p>
          </Card>
        </div>
      )}

      {/* Modal Detail Kitab & Silabus */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Silabus & Buku Referensi KBM
              </h3>
              <button onClick={() => setSelectedMaterial(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Mata Pelajaran & Kelas</span>
                <p className="font-bold text-slate-900 text-sm">{selectedMaterial.subject}</p>
                <p className="text-emerald-700 font-semibold">{selectedMaterial.class} • {selectedMaterial.room}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Kitab Rujukan</span>
                <p className="font-bold text-slate-800">{selectedMaterial.book}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Fokus Bahasan Pertemuan</span>
                <p className="text-slate-700 leading-relaxed">{selectedMaterial.currentTopic}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
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
