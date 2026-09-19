"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, StatCard, Badge } from "@santrios/ui";
import {
  CheckCircle2,
  Clock,
  Calendar,
  Users,
  BookOpen,
  ShieldCheck,
  Home,
  AlertCircle,
  Check,
  X,
  Printer,
  Download,
  Search,
  Filter,
  Building,
  UserCheck,
  Sparkles,
  FileText,
  AlertTriangle,
  HeartHandshake,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  BedDouble,
  GraduationCap,
} from "lucide-react";
import { saveAttendanceBulkAction } from "@/actions/attendance";

export interface StudentAttendance {
  id: string;
  name: string;
  nis: string;
  room: string;
  className: string;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA";
  note?: string;
  lastSeen?: string;
}

interface AbsensiClientProps {
  tenantName: string;
  userRole?: string;
  userName?: string;
  initialTab?: string;
  initialClass?: string;
  initialStudents?: StudentAttendance[];
}

export default function AbsensiClient({
  tenantName,
  userRole = "KESANTRIAN",
  userName = "Pengguna",
  initialTab,
  initialClass,
  initialStudents,
}: AbsensiClientProps) {
  const isOwner = userRole === "OWNER" || userRole === "SUPER_ADMIN";
  const isGuru = userRole === "GURU";
  const isKesantrian = userRole === "KESANTRIAN" || userRole === "MUSYRIF";
  const isWali = userRole === "WALI_SANTRI";
  const isAdmin = userRole === "ADMIN";

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // ================= STATE KESANTRIAN (SHALAT 5 WAKTU & ASRAMA) =================
  const [prayerSession, setPrayerSession] = useState("Subuh Berjamaah");
  const [selectedRoom, setSelectedRoom] = useState("Semua Kamar");
  const [kesantrianTab, setKesantrianTab] = useState<"shalat" | "apel" | "rekap">(
    initialTab === "apel" ? "apel" : initialTab === "rekap" ? "rekap" : "shalat"
  );

  // ================= STATE GURU (KBM & PELAJARAN) =================
  const [selectedKbmClass, setSelectedKbmClass] = useState(initialClass || "Kelas Wustha 2 — Fiqih Ibadah");
  const [kbmTopic, setKbmTopic] = useState("Bab Thaharah: Pembahasan Syarat & Rukun Wudhu Kitab Fathul Qorib");
  const [guruTab, setGuruTab] = useState<"kbm" | "tahfizh" | "jurnal">(
    initialTab === "tahfizh" ? "tahfizh" : initialTab === "jurnal" ? "jurnal" : "kbm"
  );

  // ================= STATE OWNER =================
  const [ownerTab, setOwnerTab] = useState<"shalat_rekap" | "kbm_rekap" | "perhatian">(
    initialTab === "kbm_rekap" ? "kbm_rekap" : initialTab === "perhatian" ? "perhatian" : "shalat_rekap"
  );

  // ================= STATE ADMIN & WALI =================
  const [adminTab, setAdminTab] = useState<"rekap_harian" | "blanko">("rekap_harian");
  const [isWaliLeaveModalOpen, setIsWaliLeaveModalOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveType, setLeaveType] = useState("SAKIT");

  useEffect(() => {
    if (initialTab) {
      if (["shalat", "apel", "rekap"].includes(initialTab)) setKesantrianTab(initialTab as any);
      if (["kbm", "tahfizh", "jurnal"].includes(initialTab)) setGuruTab(initialTab as any);
      if (["shalat_rekap", "kbm_rekap", "perhatian"].includes(initialTab)) setOwnerTab(initialTab as any);
    }
    if (initialClass) {
      setSelectedKbmClass(initialClass);
    }
  }, [initialTab, initialClass]);

  // Data Siswa Presensi
  const defaultStudents: StudentAttendance[] = [
    {
      id: "std-1",
      name: "Muhammad Zaki",
      nis: "202601001",
      room: "Kamar Abu Bakar",
      className: "Kelas Wustha 2",
      status: "HADIR",
      lastSeen: "Saf 1 Masjid Utama",
    },
    {
      id: "std-2",
      name: "Ahmad Fauzan",
      nis: "202601002",
      room: "Kamar Abu Bakar",
      className: "Kelas Ulya 2",
      status: "HADIR",
      lastSeen: "Saf 2 Masjid Utama",
    },
    {
      id: "std-3",
      name: "Bilal Al-Ghifari",
      nis: "202601003",
      room: "Kamar Umar",
      className: "Kelas Wustha 2",
      status: "SAKIT",
      note: "Demam di UKS Pondok",
      lastSeen: "Klinik / UKS",
    },
    {
      id: "std-4",
      name: "Farhan Hakim",
      nis: "202601004",
      room: "Kamar Umar",
      className: "Kelas Wustha 2",
      status: "HADIR",
      lastSeen: "Saf 1 Serambi Kanan",
    },
    {
      id: "std-5",
      name: "Raihan Putra Pratama",
      nis: "202601005",
      room: "Kamar Utsman",
      className: "Kelas Ulya 1",
      status: "IZIN",
      note: "Izin pulang sambangan keluarga",
      lastSeen: "Luar Asrama (Izin)",
    },
    {
      id: "std-6",
      name: "Salman Al-Farisi",
      nis: "202601006",
      room: "Kamar Utsman",
      className: "Kelas Wustha 2",
      status: "HADIR",
      lastSeen: "Saf 2 Masjid Utama",
    },
    {
      id: "std-7",
      name: "Muhammad Ali Al-Fatih",
      nis: "202601007",
      room: "Kamar Ali",
      className: "Kelas Ulya 1",
      status: "HADIR",
      lastSeen: "Saf 1 Masjid Utama",
    },
    {
      id: "std-8",
      name: "Hamzah Syahid",
      nis: "202601008",
      room: "Kamar Ali",
      className: "Kelas Wustha 2",
      status: "HADIR",
      lastSeen: "Saf 2 Serambi Kiri",
    },
    {
      id: "std-9",
      name: "Abdullah Azzam",
      nis: "202601009",
      room: "Kamar Abu Bakar",
      className: "Kelas Wustha 2",
      status: "ALPHA",
      note: "Masbuk terlambat rakaat 2",
    },
  ];

  const [students, setStudents] = useState<StudentAttendance[]>(
    initialStudents && initialStudents.length > 0 ? initialStudents : defaultStudents
  );

  // Read URL parameters on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get("room");
      const sessionParam = params.get("session");
      const classParam = params.get("class");
      if (roomParam) setSelectedRoom(roomParam);
      if (sessionParam) setPrayerSession(sessionParam);
      if (classParam) setSelectedKbmClass(classParam);
    }
  }, []);

  // Filtered Students with pre-lowercased query for maximum performance
  const filteredStudents = useMemo<StudentAttendance[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    const hasQuery = query.length > 0;
    const isWustha2 = selectedKbmClass.includes("Wustha 2");
    const isUlya1 = selectedKbmClass.includes("Ulya 1");

    return students.filter((s) => {
      if (hasQuery) {
        const matchSearch =
          s.name.toLowerCase().includes(query) ||
          s.nis.includes(query);
        if (!matchSearch) return false;
      }

      if (isKesantrian) {
        if (selectedRoom !== "Semua Kamar" && s.room !== selectedRoom) {
          return false;
        }
      } else if (isGuru) {
        if (isWustha2 && s.className !== "Kelas Wustha 2") {
          return false;
        }
        if (isUlya1 && s.className !== "Kelas Ulya 1") {
          return false;
        }
      }

      return true;
    });
  }, [students, searchQuery, isKesantrian, selectedRoom, isGuru, selectedKbmClass]);

  // Single-pass Counters calculation
  const { countHadir, countIzin, countSakit, countAlpha, attendanceRate } = useMemo(() => {
    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alpha = 0;

    for (let i = 0; i < filteredStudents.length; i++) {
      const st = filteredStudents[i].status;
      if (st === "HADIR") hadir++;
      else if (st === "IZIN") izin++;
      else if (st === "SAKIT") sakit++;
      else if (st === "ALPHA") alpha++;
    }

    const rate = filteredStudents.length > 0
      ? Math.round((hadir / filteredStudents.length) * 100)
      : 0;

    return {
      countHadir: hadir,
      countIzin: izin,
      countSakit: sakit,
      countAlpha: alpha,
      attendanceRate: rate,
    };
  }, [filteredStudents]);

  const handleUpdateStatus = (id: string, status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA") => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleMarkAllHadir = () => {
    setStudents((prev) =>
      prev.map((s) =>
        s.status === "SAKIT" || s.status === "IZIN" ? s : { ...s, status: "HADIR" }
      )
    );
  };

  const handleSaveAttendance = async () => {
    setIsSubmitting(true);
    try {
      const activityType = isGuru
        ? "KELAS"
        : prayerSession.toLowerCase().includes("subuh")
        ? "SHALAT_SUBUH"
        : prayerSession.toLowerCase().includes("ashar")
        ? "SHALAT_ASHAR"
        : prayerSession.toLowerCase().includes("maghrib")
        ? "SHALAT_MAGHRIB"
        : prayerSession.toLowerCase().includes("isya")
        ? "SHALAT_ISYA"
        : "SHALAT_ZHUHUR";

      const records = filteredStudents.map((s: StudentAttendance) => ({
        studentId: s.id,
        status: (s.status === "ALPHA" ? "ALFA" : s.status) as any,
        notes: s.note || undefined,
      }));

      const res = await saveAttendanceBulkAction({
        date: new Date(),
        type: activityType as any,
        records,
      });

      if (res.success) {
        setIsSaved(true);
        if (isGuru) {
          setSaveMessage(`Presensi ${selectedKbmClass} (${records.length} santri) berhasil disimpan ke database Neon!`);
        } else if (isKesantrian) {
          setSaveMessage(`Presensi ${prayerSession} untuk ${selectedRoom} (${records.length} santri) berhasil disimpan ke database Neon!`);
        } else {
          setSaveMessage(`Data presensi (${records.length} santri) berhasil disimpan ke database Neon!`);
        }
        setTimeout(() => setIsSaved(false), 4500);
      } else {
        alert(res.error || "Gagal menyimpan presensi.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem saat menyimpan presensi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={isOwner ? "success" : isGuru ? "success" : isKesantrian ? "default" : "default"}
              className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 ${
                isOwner
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : isGuru
                  ? "bg-teal-100 text-teal-800 border-teal-200"
                  : isKesantrian
                  ? "bg-sky-100 text-sky-800 border-sky-200"
                  : isWali
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-slate-100 text-slate-800 border-slate-200"
              }`}
            >
              {isOwner
                ? "👑 Pandangan Pimpinan & Kyai Pengasuh"
                : isGuru
                ? "📖 Meja Pengajar & Ustadz Diniyah"
                : isKesantrian
                ? "🛡️ Bagian Kesantrian & Keamanan Pondok"
                : isWali
                ? "👨‍👩‍👦 Portal Orang Tua / Wali Santri"
                : "🛠️ Meja Kerja Tata Usaha (TU)"}
            </Badge>
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {isGuru ? (
              <BookOpen className="w-6 h-6 text-emerald-600" />
            ) : isKesantrian ? (
              <CheckCircle2 className="w-6 h-6 text-teal-600" />
            ) : isWali ? (
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
            ) : (
              <Calendar className="w-6 h-6 text-emerald-600" />
            )}
            {isOwner
              ? "Tinjauan Kedisiplinan & Presensi Santri"
              : isGuru
              ? "Absensi Jam Pelajaran & Jurnal KBM"
              : isKesantrian
              ? "Presensi Shalat 5 Waktu & Apel Asrama"
              : isWali
              ? "Laporan Kehadiran Putra/Putri Anda"
              : "Rekapitulasi Presensi Seluruh Santri"}
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {isOwner
              ? `Audit komprehensif tingkat kepatuhan shalat fardhu berjamaah di masjid, absensi KBM madrasah, dan disiplin santri di ${tenantName}.`
              : isGuru
              ? `Pengabsenan siswa per mata pelajaran, materi ajar harian, serta mutaba'ah halaqah tahfizh di ${tenantName}.`
              : isKesantrian
              ? `Roll-call shalat fardhu berjamaah di masjid pondok, apel kamar asrama 24 jam, dan pengecekan santri sakit di ${tenantName}.`
              : isWali
              ? `Pantauan langsung kepatuhan ibadah shalat 5 waktu dan kehadiran belajar harian di ${tenantName}.`
              : `Pencatatan dan arsip kehadiran santri harian untuk pelaporan berkala di ${tenantName}.`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak Lembar Presensi</span>
          </button>
          <button
            onClick={() => alert("Mengunduh Rekapitulasi Presensi Format Excel (.xlsx)...")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-slate-200" />
            <span>Unduh Rekap (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      {isOwner ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Kedisiplinan Shalat Subuh"
            value="97.2%"
            subtitle="Masjid Jami' Al-Ikhlas"
            icon={<Sunrise className="w-5 h-5 text-amber-500" />}
            trend={{ value: "+1.5%", isPositive: true }}
          />
          <StatCard
            title="Kehadiran Jam KBM"
            value="98.4%"
            subtitle="Madrasah Diniyah"
            icon={<GraduationCap className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Tertib", isPositive: true }}
          />
          <StatCard
            title="Santri Izin & Sakit"
            value="5 Santri"
            subtitle="2 Sakit (UKS), 3 Izin Resmi"
            icon={<AlertCircle className="w-5 h-5 text-sky-600" />}
            trend={{ value: "Terkontrol", isPositive: true }}
          />
          <StatCard
            title="Perhatian Masbuk / Alpha"
            value="2 Santri"
            subtitle="Perlu Konseling Kesantrian"
            icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
            trend={{ value: "Butuh Tindakan", isPositive: false }}
          />
        </div>
      ) : isGuru ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Kehadiran Kelas Hari Ini"
            value={`${attendanceRate}%`}
            subtitle={`${countHadir} dari ${filteredStudents.length} santri hadir`}
            icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Aktif KBM", isPositive: true }}
          />
          <StatCard
            title="Mata Pelajaran Aktif"
            value="Fiqih Ibadah"
            subtitle="Kitab Fathul Qorib"
            icon={<BookOpen className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Ruang A-02", isPositive: true }}
          />
          <StatCard
            title="Santri Sakit / Izin"
            value={`${countSakit + countIzin} Santri`}
            subtitle={`${countSakit} Sakit, ${countIzin} Izin`}
            icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Tercatat", isPositive: true }}
          />
          <StatCard
            title="Ketuntasan Silabus"
            value="92.5%"
            subtitle="Bab Thaharah Selesai"
            icon={<CheckCircle2 className="w-5 h-5 text-sky-600" />}
            trend={{ value: "On Track", isPositive: true }}
          />
        </div>
      ) : isKesantrian ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title={`Kehadiran ${prayerSession.split(" ")[0]}`}
            value={`${attendanceRate}%`}
            subtitle={`${countHadir} dari ${filteredStudents.length} santri berjamaah`}
            icon={<UserCheck className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Tertib", isPositive: true }}
          />
          <StatCard
            title="Santri Sakit di UKS"
            value={`${countSakit} Santri`}
            subtitle="Dalam Perawatan Asrama"
            icon={<HeartHandshake className="w-5 h-5 text-rose-500" />}
            trend={{ value: "Pantau Medis", isPositive: false }}
          />
          <StatCard
            title="Izin Sambangan Keluar"
            value={`${countIzin} Santri`}
            subtitle="Tercatat Izin Resmi Pos"
            icon={<Home className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Izin Aktif", isPositive: true }}
          />
          <StatCard
            title="Kepatuhan Kamar Asrama"
            value="98.1%"
            subtitle="Gedung Al-Faruq"
            icon={<Building className="w-5 h-5 text-sky-600" />}
            trend={{ value: "Sangat Baik", isPositive: true }}
          />
        </div>
      ) : isWali ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Shalat Subuh Hari Ini"
            value="Hadir Berjamaah"
            subtitle="Saf 1 Masjid Utama"
            icon={<Sunrise className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Tepat Waktu", isPositive: true }}
          />
          <StatCard
            title="Kehadiran Kelas KBM"
            value="100% Hadir"
            subtitle="Fiqih Ibadah & Nahwu"
            icon={<BookOpen className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Aktif", isPositive: true }}
          />
          <StatCard
            title="Kondisi Kesehatan"
            value="Sehat Wal'afiat"
            subtitle="Aktif di Kamar Abu Bakar"
            icon={<HeartHandshake className="w-5 h-5 text-sky-600" />}
            trend={{ value: "Baik", isPositive: true }}
          />
          <StatCard
            title="Rata-rata Kehadiran"
            value="99.2%"
            subtitle="Bulan September 2026"
            icon={<CheckCircle2 className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Mumtaz", isPositive: true }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Total Santri Terdata"
            value="148 Santri"
            subtitle="Mukim Asrama Aktif"
            icon={<Users className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="Rata-rata Presensi"
            value="97.8%"
            subtitle="Shalat & KBM"
            icon={<CheckCircle2 className="w-5 h-5 text-teal-600" />}
          />
          <StatCard
            title="Total Santri Sakit"
            value="2 Santri"
            subtitle="Dirawat di UKS"
            icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
          />
          <StatCard
            title="Total Santri Izin"
            value="3 Santri"
            subtitle="Izin Resmi Tercatat"
            icon={<Calendar className="w-5 h-5 text-sky-600" />}
          />
        </div>
      )}

      {/* ================= SUCCESS BANNER NOTIFICATION ================= */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{saveMessage}</span>
          </div>
          <button onClick={() => setIsSaved(false)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= TABS NAVIGATION (ROLE SPECIFIC) ================= */}
      {isKesantrian && (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setKesantrianTab("shalat")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              kesantrianTab === "shalat"
                ? "bg-teal-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Presensi Shalat 5 Waktu Masjid</span>
          </button>
          <button
            onClick={() => setKesantrianTab("apel")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              kesantrianTab === "apel"
                ? "bg-teal-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Apel Malam & Sidak Asrama</span>
          </button>
          <button
            onClick={() => setKesantrianTab("rekap")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              kesantrianTab === "rekap"
                ? "bg-teal-700 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Rekapitulasi Kepatuhan Kamar</span>
          </button>
        </div>
      )}

      {isGuru && (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setGuruTab("kbm")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              guruTab === "kbm"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Absensi Jam Pelajaran (KBM)</span>
          </button>
          <button
            onClick={() => setGuruTab("tahfizh")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              guruTab === "tahfizh"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Absensi Halaqah Tahfizh</span>
          </button>
          <button
            onClick={() => setGuruTab("jurnal")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              guruTab === "jurnal"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Riwayat Jurnal Mengajar</span>
          </button>
        </div>
      )}

      {isOwner && (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setOwnerTab("shalat_rekap")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "shalat_rekap"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Disiplin Shalat 5 Waktu Masjid</span>
          </button>
          <button
            onClick={() => setOwnerTab("kbm_rekap")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "kbm_rekap"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kehadiran KBM Madrasah Diniyah</span>
          </button>
          <button
            onClick={() => setOwnerTab("perhatian")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "perhatian"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Santri Butuh Perhatian Khusus</span>
          </button>
        </div>
      )}

      {isAdmin && (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setAdminTab("rekap_harian")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              adminTab === "rekap_harian"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Presensi & Kehadiran Santri</span>
          </button>
          <button
            onClick={() => setAdminTab("blanko")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              adminTab === "blanko"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Blanko Cetak Presensi Kelas</span>
          </button>
        </div>
      )}

      {/* ================= MAIN CONTENT: ROLL-CALL FORM & ROSTER ================= */}
      {(!isOwner || ownerTab === "shalat_rekap") && !isWali && (!isAdmin || adminTab === "rekap_harian") && (
        <div className="space-y-4">
          <Card className="p-4 md:p-5 border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              {/* Selectors */}
              <div className="flex flex-wrap items-center gap-2.5">
                {isKesantrian ? (
                  <>
                    <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Sesi Shalat:</span>
                      <select
                        value={prayerSession}
                        onChange={(e) => setPrayerSession(e.target.value)}
                        className="bg-transparent font-bold text-teal-900 focus:outline-none cursor-pointer"
                      >
                        <option value="Subuh Berjamaah">Subuh Berjamaah (04.30 WIB)</option>
                        <option value="Zhuhur Berjamaah">Zhuhur Berjamaah (12.00 WIB)</option>
                        <option value="Ashar Berjamaah">Ashar Berjamaah (15.15 WIB)</option>
                        <option value="Maghrib Berjamaah">Maghrib Berjamaah (17.45 WIB)</option>
                        <option value="Isya Berjamaah">Isya Berjamaah (19.00 WIB)</option>
                        <option value="Apel Malam Asrama">Apel Malam Asrama (22.00 WIB)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
                      <BedDouble className="w-3.5 h-3.5 text-slate-500" />
                      <span>Kamar:</span>
                      <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        <option value="Semua Kamar">Semua Kamar (Gedung Al-Faruq)</option>
                        <option value="Kamar Abu Bakar">Kamar Abu Bakar (A-01)</option>
                        <option value="Kamar Umar">Kamar Umar (A-02)</option>
                        <option value="Kamar Utsman">Kamar Utsman (A-03)</option>
                        <option value="Kamar Ali">Kamar Ali (A-04)</option>
                      </select>
                    </div>
                  </>
                ) : isGuru ? (
                  <>
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kelas / Mapel:</span>
                      <select
                        value={selectedKbmClass}
                        onChange={(e) => setSelectedKbmClass(e.target.value)}
                        className="bg-transparent font-bold text-emerald-900 focus:outline-none cursor-pointer"
                      >
                        <option value="Kelas Wustha 2 — Fiqih Ibadah">Kelas Wustha 2 — Fiqih Ibadah (Fathul Qorib)</option>
                        <option value="Kelas Ulya 1 — Bahasa Arab & Nahwu">Kelas Ulya 1 — Bahasa Arab (Al-Jurumiyah)</option>
                        <option value="Kelas Ulya 2 — Hadits Arbain">Kelas Ulya 2 — Hadits Arbain Nawawiyyah</option>
                        <option value="Halaqah Sore — Tahfizh Al-Qur'an">Halaqah Sore — Tahfizh Al-Qur'an</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="text-xs font-bold text-slate-800">
                    Rekapitulasi Presensi Santri Hari Ini
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllHadir}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Hadirkan Semua</span>
                </button>
                <button
                  onClick={handleSaveAttendance}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Presensi</span>
                </button>
              </div>
            </div>

            {/* Input Jurnal Mengajar untuk Guru */}
            {isGuru && (
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  Jurnal / Pokok Bahasan KBM Hari Ini:
                </label>
                <input
                  type="text"
                  value={kbmTopic}
                  onChange={(e) => setKbmTopic(e.target.value)}
                  placeholder="Misal: Bab Thaharah: Pembahasan Syarat & Rukun Wudhu Kitab Fathul Qorib"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none bg-white"
                />
              </div>
            )}

            {/* Search & Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama santri atau NIS..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">Rekap:</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {countHadir} Hadir
                </span>
                <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-md">
                  {countIzin} Izin
                </span>
                <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                  {countSakit} Sakit
                </span>
                <span className="text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-md">
                  {countAlpha} Alpha
                </span>
                <span className="ml-2 font-bold text-slate-800">
                  Tingkat Kehadiran: <span className="text-emerald-600">{attendanceRate}%</span>
                </span>
              </div>
            </div>
          </Card>

          {/* Roll-call List */}
          <Card className="p-0 overflow-hidden border-slate-200 divide-y divide-slate-100">
            {filteredStudents.map((student: StudentAttendance) => (
              <div
                key={student.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{student.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">NIS: {student.nis}</span>
                    {student.lastSeen && (
                      <span className="text-[10px] text-slate-400 italic">
                        • {student.lastSeen}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {student.className} • {student.room}
                    {student.note && (
                      <span className="ml-2 text-amber-600 font-medium">({student.note})</span>
                    )}
                  </p>
                </div>

                {/* 1-Click Status Toggles */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleUpdateStatus(student.id, "HADIR")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === "HADIR"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Hadir
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(student.id, "IZIN")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === "IZIN"
                        ? "bg-sky-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Izin
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(student.id, "SAKIT")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === "SAKIT"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Sakit
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(student.id, "ALPHA")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      student.status === "ALPHA"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Alpha
                  </button>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ================= OWNER VIEW (BREAKDOWN SHALAT & PERHATIAN) ================= */}
      {isOwner && ownerTab === "shalat_rekap" && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Tingkat Disiplin Shalat Fardhu Berjamaah di Masjid (Evaluasi Bulanan)
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-1">
            {[
              { prayer: "Subuh Berjamaah", rate: "97.2%", status: "Sangat Disiplin", pic: "Ust. Dahlan" },
              { prayer: "Zhuhur Berjamaah", rate: "99.1%", status: "Tertib Penuh", pic: "Ust. Fatih" },
              { prayer: "Ashar Berjamaah", rate: "98.5%", status: "Sangat Disiplin", pic: "Ust. Ridwan" },
              { prayer: "Maghrib Berjamaah", rate: "99.4%", status: "Tertib Penuh", pic: "Kyai Munir" },
              { prayer: "Isya Berjamaah", rate: "98.0%", status: "Sangat Disiplin", pic: "Ust. Syamsul" },
            ].map((p, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
                <span className="text-[11px] font-semibold text-slate-500">{p.prayer}</span>
                <span className="text-lg font-bold text-slate-900 block">{p.rate}</span>
                <Badge variant="success" className="text-[10px]">
                  {p.status}
                </Badge>
                <p className="text-[10px] text-slate-400 pt-1">Imam: {p.pic}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= ADMIN BLANKO PRESENSI CETAK ================= */}
      {isAdmin && adminTab === "blanko" && (
        <Card className="p-6 space-y-4 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Dokumen Tata Usaha
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Blanko Presensi Kelas Harian (Siap Cetak Fisik)
              </h3>
              <p className="text-xs text-slate-500">
                Format lembar presensi manual untuk papan absensi kelas dan halaqah pesantren.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Blanko Lembar Absensi</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">Nama Santri</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Kelas / Kamar</th>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <th key={i} className="py-2.5 px-1 text-center w-7 border-l border-slate-200">
                      {i + 1}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center border-l border-slate-200">Paraf Guru</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {students.slice(0, 10).map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-center text-slate-400 font-sans">{idx + 1}</td>
                    <td className="py-2 px-3 font-sans font-semibold text-slate-900">{s.name}</td>
                    <td className="py-2 px-3 text-slate-500">{s.nis}</td>
                    <td className="py-2 px-3 font-sans text-slate-600">{s.className}</td>
                    {Array.from({ length: 15 }).map((_, i) => (
                      <td key={i} className="py-2 px-1 border-l border-slate-200 text-center text-slate-300">
                        •
                      </td>
                    ))}
                    <td className="py-2 px-3 border-l border-slate-200"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ================= WALI SANTRI VIEW ================= */}
      {isWali && (
        <div className="space-y-4">
          <Card className="p-5 border-emerald-100 bg-emerald-50/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Riwayat Kehadiran Ananda: Muhammad Zaki (NIS: 202601001)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelas Wustha 2 • Kamar Abu Bakar (Gedung Al-Faruq)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs font-bold">
                  Status: Hadir Penuh
                </Badge>
                <button
                  onClick={() => setIsWaliLeaveModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>+ Ajukan Izin / Sakit</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {[
                { time: "Subuh (04.30)", title: "Shalat Berjamaah", status: "HADIR", note: "Saf 1 Masjid" },
                { time: "Pagi (07.30)", title: "Fiqih Ibadah", status: "HADIR", note: "Kelas Wustha 2" },
                { time: "Siang (12.00)", title: "Zhuhur Berjamaah", status: "HADIR", note: "Saf 1 Masjid" },
                { time: "Sore (15.30)", title: "Tahfizh Al-Qur'an", status: "HADIR", note: "Ziyadah Juz 30" },
                { time: "Malam (19.00)", title: "Isya Berjamaah", status: "HADIR", note: "Masjid Utama" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-2xl border border-emerald-200/60 shadow-xs text-center space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono">{item.time}</span>
                  <p className="text-xs font-bold text-slate-800">{item.title}</p>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {item.status}
                  </span>
                  <p className="text-[10px] text-slate-500">{item.note}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ================= MODAL PENGAJUAN IZIN WALI SANTRI ================= */}
      {isWaliLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-emerald-300" />
                  Formulir Permohonan Izin / Sakit
                </h3>
                <p className="text-[11px] text-emerald-200 mt-0.5">Untuk Ananda: Muhammad Zaki</p>
              </div>
              <button
                onClick={() => setIsWaliLeaveModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsWaliLeaveModalOpen(false);
                setSaveMessage("Permohonan izin ananda berhasil dikirimkan ke Ustadz Musyrif Asrama!");
                setIsSaved(true);
                setLeaveReason("");
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Kategori Permohonan Izin *
                </label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="SAKIT">Sakit (Istirahat di UKS / Kamar Asrama)</option>
                  <option value="PULANG_BEROBAT">Pulang Berobat ke Rumah / RS</option>
                  <option value="ACARA_KELUARGA">Kepulangan Acara Keluarga Mendesak</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Tanggal Mulai *</label>
                  <input
                    type="date"
                    required
                    defaultValue="2026-09-20"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Tanggal Selesai *</label>
                  <input
                    type="date"
                    required
                    defaultValue="2026-09-22"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Alasan & Keterangan Tambahan *
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Jelaskan kondisi sakit ananda atau keperluan izin..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWaliLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Permohonan Izin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
