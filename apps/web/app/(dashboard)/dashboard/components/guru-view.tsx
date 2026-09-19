"use client";

import React, { useState } from "react";
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

export function GuruView({ tenantName, userName, metrics }: GuruViewProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<ClassItem | null>(null);

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
      subtitle: "Terdata di rombel aktif",
      icon: <Users className="w-5 h-5 text-teal-600" />,
      trend: { value: "Live DB", isPositive: true },
    },
    {
      title: "Setoran Tahfizh",
      value: `${metrics?.recentHafalan?.length ?? 8} Riwayat`,
      subtitle: "Setoran mutaba'ah santri",
      icon: <BookOpen className="w-5 h-5 text-sky-500" />,
      trend: { value: "Aktif", isPositive: true },
    },
    {
      title: "Tingkat Kehadiran",
      value: metrics?.attendanceToday?.rate ?? "1 Kelas",
      subtitle: metrics ? `${metrics.attendanceToday.hadir} hadir hari ini` : "Fiqih Wustha 2 selesai",
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

  const recentHafalan = [
    {
      id: "hfz-1",
      santri: "Ahmad Fauzan",
      surah: "Surah Al-Mulk (Ayat 1-30)",
      juz: "Juz 29",
      grade: "Mumtaz (A)",
      time: "Tadi pagi",
    },
    {
      id: "hfz-2",
      santri: "Muhammad Ali Al-Fatih",
      surah: "Surah An-Naba' (Ayat 1-40)",
      juz: "Juz 30",
      grade: "Jayyid Jiddan (B+)",
      time: "Kemarin sore",
    },
    {
      id: "hfz-3",
      santri: "Bilal Ibnu Rabah",
      surah: "Surah Al-Insan (Ayat 1-31)",
      juz: "Juz 29",
      grade: "Mumtaz (A)",
      time: "Kemarin sore",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Portal Akademik & Pengajar Pesantren</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Ahlan wa Sahlan, Ustadz {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Kelola jadwal mengajar, presensi jam pelajaran, penilaian ujian, dan bimbingan setoran tahfizh santri di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
        </div>
      </div>

      {/* Action Bar with direct links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/dashboard/absensi"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Input Presensi Kelas</span>
        </Link>
        <Link
          href="/dashboard/activities?tab=tahfizh"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>Catat Setoran Hafalan</span>
        </Link>
        <Link
          href="/dashboard/santri"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Input Nilai Santri</span>
        </Link>
        <Link
          href="/dashboard/activities?tab=agenda"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>Jadwal Mingguan</span>
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

      {/* Grid: Jadwal Hari Ini & Setoran Tahfizh */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1-2: Jadwal Pelajaran Hari Ini */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Jadwal Mengajar Hari Ini
            </h3>
            <span className="text-xs text-slate-400">Semester Ganjil 2026/2027</span>
          </div>

          <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
            {todayClasses.map((cls) => (
              <div key={cls.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900">{cls.subject}</p>
                    <Badge variant={cls.attendanceDone ? "success" : "warning"} className="text-[10px]">
                      {cls.attendanceDone ? "Presensi Selesai" : "Belum Absen"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">{cls.class} • {cls.room} ({cls.totalStudents} santri)</p>
                  <p className="text-[10px] text-emerald-700 font-semibold">{cls.time}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/dashboard/absensi?class=${encodeURIComponent(cls.class)}`}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors"
                  >
                    {cls.attendanceDone ? "Edit Presensi" : "Buka Presensi"}
                  </Link>
                  <button
                    onClick={() => setSelectedMaterial(cls)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors"
                  >
                    Materi & Tugas
                  </button>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Kolom 3: Setoran Tahfizh Terkini */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Setoran Tahfizh Binaan
            </h3>
            <Link href="/dashboard/activities?tab=tahfizh" className="text-xs text-emerald-700 font-semibold hover:underline">
              Halaqah &rarr;
            </Link>
          </div>

          <Card className="p-4 space-y-3">
            <div className="space-y-2.5">
              {recentHafalan.map((h) => (
                <div key={h.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-900">{h.santri}</p>
                    <Badge variant="success" className="text-[10px]">
                      {h.grade}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{h.surah}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>{h.juz}</span>
                    <span>{h.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/activities?tab=tahfizh&action=new"
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Catat Setoran Santri Baru</span>
            </Link>
          </Card>
        </div>
      </div>

      {/* Modal Silabus & Materi Ajar */}
      {selectedMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Silabus Pembelajaran Diniyah</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedMaterial.subject}</h3>
                <p className="text-xs text-slate-500">{selectedMaterial.class} • {selectedMaterial.room}</p>
              </div>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <p className="text-slate-400 text-[10px] font-semibold uppercase">Kitab Rujukan</p>
                <p className="font-semibold text-slate-800">{selectedMaterial.book}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-semibold uppercase">Pokok Bahasan Pekan Ini</p>
                <p className="font-semibold text-emerald-700">{selectedMaterial.currentTopic}</p>
              </div>
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-slate-600">
                <span>Capaian Silabus Semester:</span>
                <span className="font-bold text-slate-900">75% (Tuntas Sesuai Kalender)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`Mengunduh Silabus & RPP: ${selectedMaterial.subject}`);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Unduh RPP (.pdf)</span>
              </button>
              <button
                onClick={() => setSelectedMaterial(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
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
