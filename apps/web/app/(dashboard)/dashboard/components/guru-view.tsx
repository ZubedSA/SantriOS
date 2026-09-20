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

  const [activeTab, setActiveTab] = useState<"jadwal" | "tahfizh" | "nilai" | "tugas">(
    initialTab === "tahfizh" && hasTahfizh
      ? "tahfizh"
      : initialTab === "nilai"
      ? "nilai"
      : initialTab === "tugas"
      ? "tugas"
      : "jadwal"
  );

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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "jadwal"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-md"
                : "bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwal & KBM Hari Ini</span>
          </button>

          {hasTahfizh && (
            <button
              onClick={() => setActiveTab("tahfizh")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "tahfizh"
                  ? "bg-amber-400 text-slate-950 font-bold shadow-md"
                  : "bg-emerald-900/40 text-amber-300 hover:bg-emerald-900/80 border border-emerald-700/40"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Assignment: Guru Tahfizh (Halaqah & Setoran)</span>
            </button>
          )}

          <Link
            href="/dashboard/santri?tab=kelas"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Input Nilai Rapor & Remedial</span>
          </Link>

          <Link
            href="/dashboard/absensi"
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 bg-emerald-900/40 text-emerald-200 hover:bg-emerald-900/80 border border-emerald-700/40"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Absensi Cepat KBM</span>
          </Link>
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
