"use client";

import React, { useState, useEffect } from "react";
import { Card, StatCard, Badge } from "@santrios/ui";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Search,
  Filter,
  AlertCircle,
  X,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Check,
  UserCheck,
  AlertTriangle,
  Send,
  DoorOpen,
  FileCheck,
  Award,
  Download,
  Printer,
  HeartHandshake,
  GraduationCap,
  Sparkles,
  FileText,
  Loader2,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { recordTahfizhAction } from "@/actions/tahfizh";
import { createPermitAction, updatePermitStatusAction } from "@/actions/permit";
import { saveAttendanceBulkAction } from "@/actions/attendance";

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  category: "SHALAT" | "KBM" | "HALAQAH" | "ISTIRAHAT" | "KEBERSIHAN";
  location: string;
  pic: string;
  status: "COMPLETED" | "ACTIVE" | "UPCOMING";
  attendanceCount?: string;
  book?: string;
  topic?: string;
}

interface StudentAttendance {
  id: string;
  name: string;
  nis: string;
  room: string;
  className: string;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA";
  note?: string;
}

interface HafalanItem {
  id: string;
  studentName: string;
  className: string;
  type: "Ziyadah" | "Muraja'ah" | "Tasmi'";
  surah: string;
  juz: number;
  grade: "Mumtaz (A)" | "Jayyid Jiddan (B+)" | "Jayyid (B)" | "Maqbul (C)";
  ustadz: string;
  date: string;
  notes: string;
}

interface PermitItem {
  id: string;
  permitNo: string;
  studentName: string;
  className: string;
  reason: string;
  type: "PULANG" | "BEROBAT" | "KEPERLUAN_KELUARGA" | "LOMBA";
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "ACTIVE" | "COMPLETED" | "REJECTED";
  guardianName: string;
  phone: string;
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

interface ActivitiesClientProps {
  tenantName: string;
  userRole?: string;
  initialTab?: string;
  initialHafalan?: HafalanItem[];
  initialPermits?: PermitItem[];
  studentsList?: Array<{
    id: string;
    name: string;
    nis: string;
    className: string;
    room: string;
  }>;
}

export default function ActivitiesClient({
  tenantName,
  userRole = "OWNER",
  initialTab,
  initialHafalan = [],
  initialPermits = [],
  studentsList = [],
}: ActivitiesClientProps) {
  const isOwner = userRole === "OWNER" || userRole === "SUPER_ADMIN";
  const isGuru = userRole === "GURU";
  const isKesantrian = userRole === "KESANTRIAN" || userRole === "MUSYRIF";
  const isWali = userRole === "WALI_SANTRI";
  const isBendahara = userRole === "BENDAHARA";
  const isAdmin = userRole === "ADMIN" || (!isOwner && !isGuru && !isKesantrian && !isWali && !isBendahara);

  // Resolve initial tab dynamically
  const resolveInitialTab = (): "agenda" | "presensi" | "tahfizh" | "perizinan" | "disiplin" => {
    if (initialTab && ["agenda", "presensi", "tahfizh", "perizinan", "disiplin"].includes(initialTab)) {
      return initialTab as "agenda" | "presensi" | "tahfizh" | "perizinan" | "disiplin";
    }
    if (isWali) return "tahfizh";
    if (isBendahara) return "agenda";
    if (isGuru) return "presensi";
    if (isKesantrian) return "disiplin";
    return "agenda";
  };

  // Tab State
  const [ownerTab, setOwnerTab] = useState<"tahfizh" | "disiplin" | "izin_khusus">(
    initialTab === "disiplin" ? "disiplin" : initialTab === "perizinan" ? "izin_khusus" : "tahfizh"
  );
  const [activeTab, setActiveTab] = useState<"agenda" | "presensi" | "tahfizh" | "perizinan" | "disiplin">(resolveInitialTab());

  useEffect(() => {
    if (initialTab && ["agenda", "presensi", "tahfizh", "perizinan", "disiplin"].includes(initialTab)) {
      setActiveTab(initialTab as "agenda" | "presensi" | "tahfizh" | "perizinan" | "disiplin");
      if (initialTab === "disiplin") setOwnerTab("disiplin");
      if (initialTab === "perizinan") setOwnerTab("izin_khusus");
    }
  }, [initialTab]);

  // State: Kedisiplinan & Poin Ta'zir
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

  const [isViolationModalOpen, setIsViolationModalOpen] = useState(false);
  const [newViolation, setNewViolation] = useState({
    santri: "",
    nis: "",
    room: "Kamar A-01",
    category: "RINGAN" as "RINGAN" | "SEDANG" | "BERAT",
    violation: "",
    points: 5,
    taazir: "",
  });
  const [selectedGatePass, setSelectedGatePass] = useState<any | null>(null);

  // Guru KBM state
  const [selectedKbmClass, setSelectedKbmClass] = useState("Kelas Wustha 2 — Fiqih Ibadah");
  const [kbmTopic, setKbmTopic] = useState("Bab Thaharah: Pembahasan Syarat & Rukun Wudhu Kitab Fathul Qorib");

  // Read URL params on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") || params.get("view");
      if (tabParam === "presensi" || tabParam === "class") {
        setActiveTab("presensi");
      } else if (tabParam === "tahfizh") {
        setActiveTab("tahfizh");
      } else if (tabParam === "agenda") {
        setActiveTab("agenda");
      } else if (tabParam === "perizinan" || tabParam === "izin") {
        setActiveTab("perizinan");
      } else if (tabParam === "disiplin") {
        setActiveTab("disiplin");
      }
      if (params.get("action") === "new") {
        setShowHafalanModal(true);
      }
      if (params.get("action") === "izin" || params.get("action") === "new-izin") {
        setShowPermitModal(true);
      }
      const clsParam = params.get("class");
      if (clsParam) {
        setSelectedKbmClass(clsParam);
      }
    }
  }, []);

  // State: Agenda Harian
  const [schedules] = useState<ScheduleItem[]>([
    {
      id: "sch-1",
      time: "04:15 - 05:00 WIB",
      title: "Shalat Subuh Berjamaah & Dzikir Pagi",
      category: "SHALAT",
      location: "Masjid Jami' Al-Ikhlas",
      pic: "Ustadz H. Ahmad Dahlan",
      status: "COMPLETED",
      attendanceCount: "142 / 148 Santri",
    },
    {
      id: "sch-2",
      time: "05:00 - 06:15 WIB",
      title: "Halaqah Tahfizh Pagi (Ziyadah)",
      category: "HALAQAH",
      location: "Serambi Masjid & Kelas",
      pic: "Dewan Asatidz Tahfizh",
      status: "COMPLETED",
      attendanceCount: "145 / 148 Santri",
    },
    {
      id: "sch-3",
      time: "07:30 - 09:00 WIB",
      title: "Fiqih Ibadah (Fathul Qorib)",
      category: "KBM",
      location: "Gedung Belajar Ibnu Sina (Ruang A-02)",
      pic: "Ustadz Pengajar Diniyah",
      status: "COMPLETED",
      attendanceCount: "32 / 32 Santri",
      book: "Kitab Fathul Qorib Al-Mujib",
      topic: "Bab Thaharah: Syarat & Rukun Wudhu",
    },
    {
      id: "sch-4",
      time: "09:30 - 11:00 WIB",
      title: "Bahasa Arab & Nahwu (Al-Jurumiyah)",
      category: "KBM",
      location: "Gedung Belajar Ibnu Sina (Ruang B-01)",
      pic: "Ustadz Pengajar Diniyah",
      status: "ACTIVE",
      attendanceCount: "28 / 28 Santri",
      book: "Matan Al-Jurumiyah",
      topic: "Bab Al-Kalam: Pembagian Isim, Fi'il, Huruf",
    },
    {
      id: "sch-5",
      time: "12:00 - 12:45 WIB",
      title: "Shalat Zhuhur Berjamaah & Kultum",
      category: "SHALAT",
      location: "Masjid Jami' Al-Ikhlas",
      pic: "Ustadz Fatih Karim",
      status: "COMPLETED",
      attendanceCount: "146 / 148 Santri",
    },
    {
      id: "sch-6",
      time: "16:00 - 17:15 WIB",
      title: "Halaqah Tahfizh Sore (Utsman Bin Affan)",
      category: "HALAQAH",
      location: "Masjid Utama Lt. 1",
      pic: "Musyrif Halaqah Tahfizh",
      status: "UPCOMING",
      attendanceCount: "12 Santri Binaan",
      book: "Mushaf Al-Qur'an & Jazariyyah",
      topic: "Setoran Ziyadah Juz 29 & Muraja'ah",
    },
  ]);

  // State: Presensi Shalat / KBM
  const [selectedSession, setSelectedSession] = useState("KBM Diniyah Pagi");
  const [selectedRoom, setSelectedRoom] = useState("Semua Kamar");
  const [attendanceList, setAttendanceList] = useState<StudentAttendance[]>(() => {
    if (studentsList && studentsList.length > 0) {
      return studentsList.map((s) => ({
        id: s.id,
        name: s.name,
        nis: s.nis,
        room: s.room || "Kamar Santri",
        className: s.className || "Kelas Santri",
        status: "HADIR",
      }));
    }
    return [
      { id: "s-1", name: "Muhammad Zaki", nis: "202601001", room: "Kamar Abu Bakar", className: "Kelas Wustha 2", status: "HADIR" },
      { id: "s-2", name: "Ahmad Fauzan", nis: "202601002", room: "Kamar Abu Bakar", className: "Kelas Ulya 2", status: "HADIR" },
      { id: "s-3", name: "Bilal Al-Ghifari", nis: "202601003", room: "Kamar Umar", className: "Kelas Wustha 2", status: "SAKIT", note: "Demam di UKS" },
      { id: "s-4", name: "Farhan Hakim", nis: "202601004", room: "Kamar Umar", className: "Kelas Wustha 2", status: "HADIR" },
      { id: "s-5", name: "Raihan Putra Pratama", nis: "202601005", room: "Kamar Utsman", className: "Kelas Ulya 1", status: "IZIN", note: "Izin pulang sambangan" },
      { id: "s-6", name: "Salman Al-Farisi", nis: "202601006", room: "Kamar Utsman", className: "Kelas Wustha 2", status: "HADIR" },
      { id: "s-7", name: "Muhammad Ali Al-Fatih", nis: "202601007", room: "Kamar Ali", className: "Kelas Ulya 1", status: "HADIR" },
      { id: "s-8", name: "Hamzah Syahid", nis: "202601008", room: "Kamar Ali", className: "Kelas Wustha 2", status: "HADIR" },
    ];
  });
  const [isPresensiSaved, setIsPresensiSaved] = useState(false);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);

  // State: Tahfizh
  const [hafalanRecords, setHafalanRecords] = useState<HafalanItem[]>(() => {
    if (initialHafalan && initialHafalan.length > 0) return initialHafalan;
    return [
      {
        id: "haf-1",
        studentName: "Muhammad Zaki",
        className: "Kelas Wustha 2",
        type: "Ziyadah",
        surah: "An-Naba' 1-40",
        juz: 30,
        grade: "Mumtaz (A)",
        ustadz: "Ust. Pengajar",
        date: "Hari ini, 06:10 WIB",
        notes: "Tajwid makhraj sangat fasih, lanjut An-Nazi'at.",
      },
      {
        id: "haf-2",
        studentName: "Ahmad Fauzan",
        className: "Kelas Ulya 2",
        type: "Muraja'ah",
        surah: "Al-Baqarah 1-141 (Juz 1)",
        juz: 1,
        grade: "Mumtaz (A)",
        ustadz: "Ust. Pengajar",
        date: "Hari ini, 05:45 WIB",
        notes: "Mutqin lancar tanpa pengulangan ayat.",
      },
      {
        id: "haf-3",
        studentName: "Farhan Hakim",
        className: "Kelas Wustha 2",
        type: "Ziyadah",
        surah: "Al-Infitar 1-19",
        juz: 30,
        grade: "Jayyid Jiddan (B+)",
        ustadz: "Ust. Pengajar",
        date: "Hari ini, 06:00 WIB",
        notes: "Perhatikan ghunnah musyaddadah.",
      },
      {
        id: "haf-4",
        studentName: "Muhammad Ali Al-Fatih",
        className: "Kelas Ulya 1",
        type: "Tasmi'",
        surah: "Juz 30 Lengkap (An-Naba' s/d An-Nas)",
        juz: 30,
        grade: "Mumtaz (A)",
        ustadz: "KH. Abdullah Maksum",
        date: "Kemarin, 20:30 WIB",
        notes: "Lulus Ujian Tasmi' 1 Majelis. Direkomendasikan sertifikat syahadah.",
      },
    ];
  });

  // State: Perizinan
  const [permits, setPermits] = useState<PermitItem[]>(() => {
    if (initialPermits && initialPermits.length > 0) return initialPermits;
    return [
      {
        id: "pm-1",
        permitNo: "IZN-202609-001",
        studentName: "Bilal Al-Ghifari",
        className: "Kelas 9 MTs",
        reason: "Pemeriksaan mata & kontrol kacamata ke RSUD",
        type: "BEROBAT",
        startDate: "2026-09-12 09:00",
        endDate: "2026-09-12 16:00",
        status: "COMPLETED",
        guardianName: "H. Abdullah (Ayah)",
        phone: "08123456789",
      },
      {
        id: "pm-2",
        permitNo: "IZN-202609-002",
        studentName: "Raihan Putra Pratama",
        className: "Kelas 10 MA",
        reason: "Menghadiri pernikahan kakak kandung di Surabaya",
        type: "PULANG",
        startDate: "2026-09-12 14:00",
        endDate: "2026-09-14 17:00",
        status: "ACTIVE",
        guardianName: "Drs. Bambang H. (Ayah)",
        phone: "08139876543",
      },
      {
        id: "pm-3",
        permitNo: "IZN-202609-003",
        studentName: "Ahmad Fauzan",
        className: "Kelas 11 MA",
        reason: "Mengikuti Musabaqah Hifzhil Qur'an (MHQ) Tingkat Provinsi Jawa Timur",
        type: "LOMBA",
        startDate: "2026-09-15 07:00",
        endDate: "2026-09-17 21:00",
        status: "PENDING",
        guardianName: "Bpk. Rahmat Santoso (Ayah)",
        phone: "081234567890",
      },
    ];
  });

  // Modal State
  const [showHafalanModal, setShowHafalanModal] = useState(false);
  const [showPermitModal, setShowPermitModal] = useState(false);
  const [isSubmittingHafalan, setIsSubmittingHafalan] = useState(false);
  const [isSubmittingPermit, setIsSubmittingPermit] = useState(false);

  // New Hafalan Form State
  const [newHafalan, setNewHafalan] = useState({
    studentId: studentsList[0]?.id || "",
    studentName: studentsList[0]?.name || "",
    className: studentsList[0]?.className || "Kelas Wustha 2",
    type: "Ziyadah" as "Ziyadah" | "Muraja'ah" | "Tasmi'",
    surah: "",
    juz: 30,
    grade: "Mumtaz (A)" as "Mumtaz (A)" | "Jayyid Jiddan (B+)" | "Jayyid (B)" | "Maqbul (C)",
    ustadz: "Dewan Asatidz",
    notes: "",
  });

  // New Permit Form State
  const [newPermit, setNewPermit] = useState({
    studentId: studentsList[0]?.id || "",
    studentName: studentsList[0]?.name || "",
    className: studentsList[0]?.className || "Kelas 10 MA",
    reason: "",
    type: "PULANG" as "PULANG" | "BEROBAT" | "KEPERLUAN_KELUARGA" | "LOMBA",
    startDate: "",
    endDate: "",
    guardianName: "",
    phone: "",
  });

  // Filter attendance by room or class with single-pass counting
  const { filteredAttendance, countHadir, countIzin, countSakit, countAlpha, attendanceRate } = React.useMemo(() => {
    const list = attendanceList.filter((item) => {
      if (isGuru) {
        if (selectedKbmClass.includes("Wustha 2")) return item.className.includes("Wustha 2");
        if (selectedKbmClass.includes("Ulya 1")) return item.className.includes("Ulya 1");
        return true;
      }
      if (selectedRoom === "Semua Kamar") return true;
      return item.room === selectedRoom;
    });

    let hadir = 0;
    let izin = 0;
    let sakit = 0;
    let alpha = 0;

    for (const s of list) {
      if (s.status === "HADIR") hadir++;
      else if (s.status === "IZIN") izin++;
      else if (s.status === "SAKIT") sakit++;
      else if (s.status === "ALPHA") alpha++;
    }

    const rate = list.length > 0 ? Math.round((hadir / list.length) * 100) : 100;
    return {
      filteredAttendance: list,
      countHadir: hadir,
      countIzin: izin,
      countSakit: sakit,
      countAlpha: alpha,
      attendanceRate: rate,
    };
  }, [attendanceList, isGuru, selectedKbmClass, selectedRoom]);

  const handleMarkAllHadir = () => {
    setAttendanceList((prev) =>
      prev.map((s) => ({
        ...s,
        status: "HADIR",
        note: undefined,
      }))
    );
    setIsPresensiSaved(false);
  };

  const handleUpdateStatus = (id: string, status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA") => {
    setAttendanceList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    setIsPresensiSaved(false);
  };

  const handleSaveAttendance = async () => {
    setIsSavingAttendance(true);
    try {
      if (studentsList && studentsList.length > 0) {
        const records = filteredAttendance.map((s) => ({
          studentId: s.id,
          status: (s.status === "ALPHA" ? "ALFA" : s.status) as "HADIR" | "SAKIT" | "IZIN" | "ALFA",
          notes: s.note,
        }));
        const res = await saveAttendanceBulkAction({
          type: isGuru ? "KELAS" : "SHALAT_SUBUH",
          date: new Date().toISOString(),
          records,
        });
        if (!res.success) {
          alert(res.error || "Gagal menyimpan presensi.");
          setIsSavingAttendance(false);
          return;
        }
      }
      setIsPresensiSaved(true);
      setTimeout(() => setIsPresensiSaved(false), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan presensi.");
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const handleAddHafalan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingHafalan(true);
    try {
      let targetStudentId = newHafalan.studentId;
      if (!targetStudentId) {
        const found = studentsList.find((s) => s.name === newHafalan.studentName);
        if (found) targetStudentId = found.id;
      }

      const gradeMapping: Record<string, "MUMTAZ" | "JAYYID_JIDDAN" | "JAYYID" | "MAQBUL"> = {
        "Mumtaz (A)": "MUMTAZ",
        "Jayyid Jiddan (B+)": "JAYYID_JIDDAN",
        "Jayyid (B)": "JAYYID",
        "Maqbul (C)": "MAQBUL",
      };

      if (targetStudentId) {
        const res = await recordTahfizhAction({
          studentId: targetStudentId,
          surah: newHafalan.surah,
          juz: Number(newHafalan.juz),
          grade: gradeMapping[newHafalan.grade] || "JAYYID",
          notes: newHafalan.notes || undefined,
        });

        if (!res.success) {
          alert(res.error || "Gagal mencatat setoran hafalan.");
          setIsSubmittingHafalan(false);
          return;
        }
      }

      const newRecord: HafalanItem = {
        id: `haf-${Date.now()}`,
        studentName: newHafalan.studentName || "Santri",
        className: newHafalan.className,
        type: newHafalan.type,
        surah: newHafalan.surah,
        juz: Number(newHafalan.juz),
        grade: newHafalan.grade,
        ustadz: "Ustadz Pembina",
        date: "Baru saja",
        notes: newHafalan.notes,
      };
      setHafalanRecords([newRecord, ...hafalanRecords]);
      setShowHafalanModal(false);
      setNewHafalan({
        studentId: studentsList[0]?.id || "",
        studentName: studentsList[0]?.name || "",
        className: studentsList[0]?.className || "Kelas Wustha 2",
        type: "Ziyadah",
        surah: "",
        juz: 30,
        grade: "Mumtaz (A)",
        ustadz: "Dewan Asatidz",
        notes: "",
      });
    } catch (err: any) {
      alert(err.message || "Gagal mencatat hafalan.");
    } finally {
      setIsSubmittingHafalan(false);
    }
  };

  const handleApprovePermit = async (id: string) => {
    try {
      const res = await updatePermitStatusAction({ permitId: id, status: "APPROVED" });
      if (!res.success) {
        // If it was mock item, still update UI
        console.warn(res.error);
      }
      setPermits((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "APPROVED" } : p))
      );
    } catch {
      setPermits((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "APPROVED" } : p))
      );
    }
  };

  const handleRejectPermit = async (id: string) => {
    try {
      const res = await updatePermitStatusAction({ permitId: id, status: "REJECTED" });
      if (!res.success) {
        console.warn(res.error);
      }
      setPermits((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "REJECTED" } : p))
      );
    } catch {
      setPermits((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "REJECTED" } : p))
      );
    }
  };

  const handleCreatePermit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPermit(true);
    try {
      let targetStudentId = newPermit.studentId;
      if (!targetStudentId) {
        const found = studentsList.find((s) => s.name === newPermit.studentName);
        if (found) targetStudentId = found.id;
      }

      if (targetStudentId) {
        const res = await createPermitAction({
          studentId: targetStudentId,
          type: newPermit.type as any,
          reason: newPermit.reason,
          startDate: newPermit.startDate,
          endDate: newPermit.endDate,
        });

        if (!res.success) {
          alert(res.error || "Gagal membuat surat perizinan.");
          setIsSubmittingPermit(false);
          return;
        }
      }

      const created: PermitItem = {
        id: `pm-${Date.now()}`,
        permitNo: `IZN-${new Date().getFullYear()}09-${String(permits.length + 1).padStart(3, "0")}`,
        studentName: newPermit.studentName || "Santri",
        className: newPermit.className,
        reason: newPermit.reason,
        type: newPermit.type,
        startDate: newPermit.startDate.replace("T", " "),
        endDate: newPermit.endDate.replace("T", " "),
        status: "PENDING",
        guardianName: newPermit.guardianName || "Wali Santri",
        phone: newPermit.phone || "-",
      };
      setPermits([created, ...permits]);
      setShowPermitModal(false);
    } catch (err: any) {
      alert(err.message || "Gagal membuat perizinan.");
    } finally {
      setIsSubmittingPermit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  : isBendahara
                  ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                  : "bg-emerald-100 text-emerald-800 border-emerald-200"
              }`}
            >
              {isOwner
                ? "👑 Monitoring Standar Mutu Pondok"
                : isGuru
                ? "📖 Presensi Jam Pelajaran & Mutaba'ah Tahfizh"
                : isKesantrian
                ? "🛡️ Bagian Kesantrian & Keamanan Pondok"
                : isWali
                ? "👨‍👩‍👦 Portal Wali Santri • Mutaba'ah & Izin"
                : isBendahara
                ? "💰 Bagian Keuangan & Kalender Operasional"
                : "🛠️ Operasional Kesantrian & Keamanan"}
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {isGuru ? (
              <BookOpen className="w-6 h-6 text-emerald-600" />
            ) : isKesantrian ? (
              <CheckCircle2 className="w-6 h-6 text-teal-600" />
            ) : isWali ? (
              <BookOpen className="w-6 h-6 text-emerald-600" />
            ) : isBendahara ? (
              <Calendar className="w-6 h-6 text-indigo-600" />
            ) : (
              <Activity className="w-6 h-6 text-emerald-600" />
            )}
            {isOwner
              ? "Mutu Akademik, Tahfizh & Kesantrian"
              : isGuru
              ? "Presensi KBM & Bimbingan Tahfizh"
              : isKesantrian
              ? "Presensi Shalat 5 Waktu, Ketertiban & Perizinan"
              : isWali
              ? "Perkembangan Hafalan & Izin Keluar Ananda"
              : isBendahara
              ? "Kalender Kegiatan & Agenda Pesantren"
              : "Agenda Harian, Presensi & Perizinan Santri"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isOwner
              ? `Audit capaian target tahfizh Al-Qur'an, kelulusan tasmi', statistik kedisiplinan pondok, dan evaluasi kesantrian di ${tenantName}.`
              : isGuru
              ? `Pencatatan absensi kelas madrasah diniyah, setoran ziyadah & muraja'ah Al-Qur'an, serta jurnal mengajar harian di ${tenantName}.`
              : isKesantrian
              ? `Pencatatan absensi shalat fardhu berjamaah 5 waktu di masjid, sidak jam malam, dan penerbitan izin jalan santri di ${tenantName}.`
              : isWali
              ? `Pantau catatan mutaba'ah Al-Qur'an harian ananda, nilai tasmi', dan pengajuan surat izin santri online di ${tenantName}.`
              : isBendahara
              ? `Sinkronisasi jadwal KBM, kepulangan libur semester, dan agenda pesantren dengan siklus penagihan SPP di ${tenantName}.`
              : `Jadwal harian kegiatan pesantren, absensi shalat dan KBM, serta penerbitan surat izin santri keluar/pulang di ${tenantName}.`}
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              <button
                onClick={() => alert("Mengunduh Laporan Mutu & Capaian Tahfizh Santri (PDF)...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh Rapor Mutu</span>
              </button>
              <button
                onClick={() => alert("Mencetak Rekapitulasi Kedisiplinan & Ujian Tasmi'...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-200" />
                <span>Cetak Rekap Mutu</span>
              </button>
            </>
          ) : isGuru ? (
            <>
              <button
                onClick={() => setShowHafalanModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>+ Catat Setoran Tahfizh</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak Jurnal KBM</span>
              </button>
            </>
          ) : isKesantrian ? (
            <>
              <button
                onClick={() => setShowPermitModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>+ Terbitkan Surat Izin</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak Rekap Shalat</span>
              </button>
            </>
          ) : isWali ? (
            <>
              <button
                onClick={() => setShowPermitModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>+ Ajukan Izin Santri</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak Buku Mutaba&apos;ah</span>
              </button>
            </>
          ) : isBendahara ? (
            <Link
              href="/dashboard/finance"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Kasir &amp; Tagihan SPP</span>
            </Link>
          ) : (
            <>
              <button
                onClick={() => setShowHafalanModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Setoran Hafalan</span>
              </button>
              <button
                onClick={() => setShowPermitModal(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
              >
                <DoorOpen className="w-4 h-4" />
                <span>+ Buat Surat Izin</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================= STATS BAR ================= */}
      {isOwner ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Lulus Tasmi' 30 Juz"
            value="12 Santri"
            subtitle="Bersanad & Mutqin"
            icon={<Award className="w-5 h-5 text-amber-500" />}
            trend={{ value: "+2 Bulan ini", isPositive: true }}
          />
          <StatCard
            title="Nilai Rata-rata Tahfizh"
            value="88.5% (Mumtaz)"
            subtitle="Tajwid & Kelancaran"
            icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Sangat Baik", isPositive: true }}
          />
          <StatCard
            title="Disiplin Shalat Jamaah"
            value="96.4%"
            subtitle="Presensi 5 Waktu Asrama"
            icon={<CheckCircle2 className="w-5 h-5 text-teal-600" />}
            trend={{ value: "+1.2%", isPositive: true }}
          />
          <StatCard
            title="Izin Khusus Menunggu"
            value="2 Permohonan"
            subtitle="Izin keluar > 3 hari"
            icon={<ShieldCheck className="w-5 h-5 text-rose-500" />}
            trend={{ value: "Perlu Persetujuan", isPositive: false }}
          />
        </div>
      ) : isGuru ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Jadwal Mengajar Hari Ini"
            value="3 Sesi KBM"
            subtitle="Fiqih, Nahwu, Tahfizh"
            icon={<Calendar className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Aktif", isPositive: true }}
          />
          <StatCard
            title="Kehadiran Jam Pelajaran"
            value={`${attendanceRate}%`}
            subtitle={`${countHadir} dari ${filteredAttendance.length} santri hadir`}
            icon={<UserCheck className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Disiplin", isPositive: true }}
          />
          <StatCard
            title="Setoran Tahfizh Hari Ini"
            value={`${hafalanRecords.length} Santri`}
            subtitle="Ziyadah & Muraja'ah"
            icon={<BookOpen className="w-5 h-5 text-sky-600" />}
            trend={{ value: "+4 Baru", isPositive: true }}
          />
          <StatCard
            title="Antrean Uji Tasmi'"
            value="3 Santri"
            subtitle="Menunggu Penilaian Halaqah"
            icon={<Award className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Siap Diuji", isPositive: true }}
          />
        </div>
      ) : isKesantrian ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Kehadiran Shalat Hari Ini"
            value={`${attendanceRate}%`}
            subtitle={`${countHadir} dari ${filteredAttendance.length} santri hadir`}
            icon={<UserCheck className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Tertib", isPositive: true }}
          />
          <StatCard
            title="Santri Izin Keluar"
            value={`${permits.filter((p) => p.status === "ACTIVE").length} Santri`}
            subtitle="Di Luar Asrama Resmi"
            icon={<DoorOpen className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Izin Aktif", isPositive: true }}
          />
          <StatCard
            title="Izin Perlu Verifikasi"
            value={`${permits.filter((p) => p.status === "PENDING").length} Permohonan`}
            subtitle="Menunggu Tinjauan"
            icon={<FileCheck className="w-5 h-5 text-rose-500" />}
            trend={{ value: "Butuh Tindakan", isPositive: false }}
          />
          <StatCard
            title="Kondisi Keamanan Asrama"
            value="Kondusif"
            subtitle="Nihil Pelanggaran Berat"
            icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Aman", isPositive: true }}
          />
        </div>
      ) : isWali ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Capaian Hafalan Ananda"
            value="5 Juz+"
            subtitle="Juz 30 &amp; Juz 1 Mutqin"
            icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Mumtaz (A)", isPositive: true }}
          />
          <StatCard
            title="Setoran Terakhir"
            value="Surah Al-Mulk"
            subtitle="Ayat 1-30 (Lancar)"
            icon={<Award className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Tuntas", isPositive: true }}
          />
          <StatCard
            title="Status Keberadaan"
            value="Di Asrama"
            subtitle="Nihil Izin Terlambat"
            icon={<CheckCircle2 className="w-5 h-5 text-indigo-600" />}
            trend={{ value: "Tertib", isPositive: true }}
          />
          <StatCard
            title="Catatan Disiplin"
            value="0 Poin Ta'zir"
            subtitle="Ketertiban Sangat Baik"
            icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Teladan", isPositive: true }}
          />
        </div>
      ) : isBendahara ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Kalender Akademik"
            value="Semester Ganjil"
            subtitle="KBM Aktif Berjalan"
            icon={<Calendar className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Aktif", isPositive: true }}
          />
          <StatCard
            title="Jatuh Tempo SPP"
            value="Tgl 10 / Bulan"
            subtitle="Siklus Tagihan Syahriah"
            icon={<Clock className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Rutin", isPositive: true }}
          />
          <StatCard
            title="Agenda Libur Terdekat"
            value="18 Des 2026"
            subtitle="Liburan Akhir Semester"
            icon={<DoorOpen className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Libur KBM", isPositive: true }}
          />
          <StatCard
            title="Porsi Katering Harian"
            value="148 Santri"
            subtitle="Dapur Mukim Pesantren"
            icon={<Activity className="w-5 h-5 text-sky-600" />}
            trend={{ value: "Normal", isPositive: true }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Kehadiran Shalat Hari Ini"
            value={`${attendanceRate}%`}
            subtitle={`${countHadir} dari ${attendanceList.length} santri hadir`}
            icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="Setoran Tahfizh Harian"
            value={`${hafalanRecords.length} Santri`}
            subtitle="Ziyadah & Muraja'ah"
            icon={<BookOpen className="w-5 h-5 text-teal-600" />}
          />
          <StatCard
            title="Santri Izin Keluar"
            value={`${permits.filter((p) => p.status === "ACTIVE").length} Santri`}
            subtitle="Di Luar Asrama Resmi"
            icon={<DoorOpen className="w-5 h-5 text-amber-500" />}
          />
          <StatCard
            title="Agenda Aktif Saat Ini"
            value="KBM Pagi"
            subtitle="Gedung Belajar Ibnu Sina"
            icon={<Activity className="w-5 h-5 text-sky-600" />}
          />
        </div>
      )}

      {/* ================= TABS NAVIGATION ================= */}
      {isOwner ? (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setOwnerTab("tahfizh")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "tahfizh"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Capaian Tahfizh & Ujian Tasmi'</span>
          </button>
          <button
            onClick={() => setOwnerTab("disiplin")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "disiplin"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Kedisiplinan & Bimbingan Kesantrian</span>
          </button>
          <button
            onClick={() => setOwnerTab("izin_khusus")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "izin_khusus"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Otorisasi Izin Khusus Pulang (2)</span>
          </button>
        </div>
      ) : isGuru ? (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("presensi")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "presensi"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Presensi Jam Pelajaran (KBM)</span>
          </button>
          <button
            onClick={() => setActiveTab("tahfizh")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "tahfizh"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mutaba'ah & Setoran Tahfizh ({hafalanRecords.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("agenda")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "agenda"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwal & Silabus Mengajar</span>
          </button>
        </div>
      ) : isKesantrian ? (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("disiplin")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "disiplin"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Kedisiplinan & Poin Ta&apos;zir ({violations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("perizinan")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "perizinan"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Perizinan Keluar & Gerbang ({permits.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("presensi")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "presensi"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Presensi Shalat 5 Waktu di Masjid</span>
          </button>
          <button
            onClick={() => setActiveTab("agenda")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "agenda"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Jadwal Harian & Jam Malam</span>
          </button>
        </div>
      ) : isWali ? (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("tahfizh")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "tahfizh"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>📖 Buku Mutaba&apos;ah Tahfizh Ananda</span>
          </button>
          <button
            onClick={() => setActiveTab("perizinan")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "perizinan"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>🚪 Status &amp; Pengajuan Izin Keluar</span>
          </button>
          <button
            onClick={() => setActiveTab("disiplin")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "disiplin"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>🛡️ Catatan Ketertiban &amp; Akhlak</span>
          </button>
        </div>
      ) : isBendahara ? (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("agenda")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "agenda"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>📅 Agenda &amp; Kalender Operasional Pesantren</span>
          </button>
        </div>
      ) : (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("agenda")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "agenda"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agenda & Jadwal Harian</span>
          </button>
          <button
            onClick={() => setActiveTab("presensi")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "presensi"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Presensi Shalat & Kelas</span>
          </button>
          <button
            onClick={() => setActiveTab("tahfizh")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "tahfizh"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Halaqah Tahfizh ({hafalanRecords.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("perizinan")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeTab === "perizinan"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Perizinan & Gerbang ({permits.length})</span>
          </button>
        </div>
      )}

      {/* ================= OWNER TAB 1: CAPAIAN TAHFIZH & TASMI' ================= */}
      {isOwner && ownerTab === "tahfizh" && (
        <div className="space-y-4 animate-in fade-in">
          {/* Sebaran Hafalan Card */}
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Sebaran Capaian Hafalan Al-Qur'an Seluruh Santri
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi mutu hafalan santri dari Juz 30 hingga Khatam 30 Juz Mutqin.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { label: "Khatam 30 Juz (Mutqin Bersanad)", count: 12, percent: "3%" },
                { label: "Tahap Lanjutan (Juz 16 s/d 29)", count: 38, percent: "9%" },
                { label: "Tahap Menengah (Juz 6 s/d 15)", count: 54, percent: "13%" },
                { label: "Tahap Awal (Juz 1 s/d 5)", count: 86, percent: "20%" },
                { label: "Tingkat Dasar (Juz 30)", count: 238, percent: "55%" },
              ].map((lvl, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>{lvl.label}</span>
                    <span className="font-bold text-emerald-800">{lvl.count} Santri ({lvl.percent})</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: lvl.percent }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Antrean Ujian Tasmi' di Hadapan Kyai */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Antrean Ujian Tasmi' Majelis di Hadapan Kyai / Pimpinan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Santri yang telah lulus bimbingan musyrif halaqah dan siap tasmi' sekali duduk di depan Pimpinan Pesantren.
                </p>
              </div>
              <Badge variant="success" className="text-xs">
                2 Santri Siap Diuji
              </Badge>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                    A
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Ahmad Fauzan</h4>
                      <Badge variant="success" className="text-[10px]">Siap Tasmi' 5 Juz</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kelas 11 MA • Juz 1 s/d 5 • Rekomendasi: Ust. Syamsul Huda (Nilai Latihan: 95)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("Menjadwalkan Sidang Tasmi' Ahmad Fauzan...")}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
                  >
                    Jadwalkan Sidang
                  </button>
                </div>
              </div>

              <div className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">
                    M
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Muhammad Ali Al-Fatih</h4>
                      <Badge variant="success" className="text-[10px]">Siap Tasmi' Juz 30</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kelas 10 MA • Juz 30 Lengkap • Rekomendasi: Ust. Ridwan Malik (Nilai Latihan: 98)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("Menjadwalkan Sidang Tasmi' Muhammad Ali Al-Fatih...")}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
                  >
                    Jadwalkan Sidang
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ================= OWNER TAB 2: KEDISIPLINAN ================= */}
      {isOwner && ownerTab === "disiplin" && (
        <Card className="p-5 space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Tingkat Kedisiplinan Shalat Jamaah & Halaqah Asrama
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluasi konsistensi shalat fardhu berjamaah 5 waktu di masjid pondok.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
            {[
              { prayer: "Subuh", rate: "97.2%", status: "Sangat Disiplin" },
              { prayer: "Zhuhur", rate: "99.1%", status: "Tertib Penuh" },
              { prayer: "Ashar", rate: "98.5%", status: "Sangat Disiplin" },
              { prayer: "Maghrib", rate: "99.4%", status: "Tertib Penuh" },
              { prayer: "Isya", rate: "98.0%", status: "Sangat Disiplin" },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[11px] font-semibold text-slate-500">{p.prayer}</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">{p.rate}</span>
                <span className="text-[10px] text-emerald-700 font-medium">{p.status}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= OWNER TAB 3: OTORISASI IZIN KHUSUS ================= */}
      {isOwner && ownerTab === "izin_khusus" && (
        <Card className="p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                Permohonan Izin Khusus Keluar / Pulang Santri (&gt; 3 Hari)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sesuai tata tertib kesantrian, izin kepulangan lebih dari 3 hari membutuhkan persetujuan tertulis Pimpinan Pesantren.
              </p>
            </div>
            <Badge variant="danger" className="text-xs">
              2 Permohonan Menunggu
            </Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {permits.slice(1, 3).map((item) => (
              <div key={item.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.studentName}</span>
                    <Badge variant="warning" className="text-[10px]">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{item.reason}</p>
                  <p className="text-[11px] text-slate-500">
                    Durasi: <span className="font-semibold text-slate-700">{item.startDate} s/d {item.endDate}</span> • Wali: {item.guardianName} ({item.phone})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "PENDING" || item.status === "ACTIVE" ? (
                    <>
                      <button
                        onClick={() => handleRejectPermit(item.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleApprovePermit(item.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
                      >
                        Setujui Izin Pulang
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Telah disetujui
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= TAB 1 (AGENDA / JADWAL MENGAJAR) ================= */}
      {!isOwner && activeTab === "agenda" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {isGuru ? "Jadwal Mengajar & Silabus Diniyah Ustadz" : "Timeline Rutinitas Harian Santri"}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Semester Ganjil 2026/2027</span>
          </div>

          <div className="space-y-3">
            {schedules.map((item) => (
              <Card
                key={item.id}
                className={`p-4 border transition-all ${
                  item.status === "ACTIVE"
                    ? "border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.status === "ACTIVE"
                          ? "bg-emerald-600 text-white animate-pulse"
                          : item.status === "COMPLETED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.category === "SHALAT" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : item.category === "HALAQAH" ? (
                        <BookOpen className="w-5 h-5" />
                      ) : (
                        <Activity className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900">{item.time}</span>
                        <Badge
                          variant={
                            item.status === "ACTIVE"
                              ? "warning"
                              : item.status === "COMPLETED"
                              ? "success"
                              : "default"
                          }
                        >
                          {item.status === "ACTIVE"
                            ? "Sedang Berlangsung"
                            : item.status === "COMPLETED"
                            ? "Selesai"
                            : "Akan Datang"}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        📍 {item.location} • 👤 PJ: <span className="text-slate-700 font-medium">{item.pic}</span>
                      </p>
                      {item.book && (
                        <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                          📖 {item.book} • Pokok Bahasan: {item.topic}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {item.attendanceCount && (
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {item.attendanceCount}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setSelectedSession(item.title);
                        setActiveTab("presensi");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                    >
                      {item.status === "COMPLETED" ? "Lihat Presensi" : "Buka Presensi"}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2 (PRESENSI KBM / SHALAT) ================= */}
      {!isOwner && activeTab === "presensi" && (
        <div className="space-y-4 animate-in fade-in">
          <Card className="p-4 border-slate-200 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
                  <span>Sesi Kelas:</span>
                  <select
                    value={isGuru ? selectedKbmClass : selectedSession}
                    onChange={(e) => {
                      if (isGuru) {
                        setSelectedKbmClass(e.target.value);
                      } else {
                        setSelectedSession(e.target.value);
                      }
                    }}
                    className="bg-transparent font-bold text-emerald-800 focus:outline-none cursor-pointer"
                  >
                    {isGuru ? (
                      <>
                        <option value="Kelas Wustha 2 — Fiqih Ibadah">Kelas Wustha 2 — Fiqih Ibadah (Fathul Qorib)</option>
                        <option value="Kelas Ulya 1 — Bahasa Arab & Nahwu">Kelas Ulya 1 — Bahasa Arab & Nahwu (Al-Jurumiyah)</option>
                        <option value="Halaqah Sore — Tahfizh Al-Qur'an">Halaqah Sore — Tahfizh Al-Qur'an (Utsman)</option>
                      </>
                    ) : (
                      <>
                        <option value="Subuh Berjamaah">Subuh Berjamaah</option>
                        <option value="Halaqah Pagi">Halaqah Pagi</option>
                        <option value="KBM Diniyah Pagi">KBM Diniyah Pagi</option>
                        <option value="Zhuhur Berjamaah">Zhuhur Berjamaah</option>
                        <option value="Ashar Berjamaah">Ashar Berjamaah</option>
                      </>
                    )}
                  </select>
                </div>

                {!isGuru && (
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
                    <span>Filter Kamar:</span>
                    <select
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Semua Kamar">Semua Kamar</option>
                      <option value="Kamar Abu Bakar">Kamar Abu Bakar</option>
                      <option value="Kamar Umar">Kamar Umar</option>
                      <option value="Kamar Utsman">Kamar Utsman</option>
                      <option value="Kamar Ali">Kamar Ali</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllHadir}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition-colors flex items-center gap-1.5 active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Hadirkan Semua
                </button>
                <button
                  onClick={handleSaveAttendance}
                  disabled={isSavingAttendance}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 active:scale-95"
                >
                  {isSavingAttendance ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Presensi</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Input Jurnal Mengajar untuk Guru */}
            {isGuru && (
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  Jurnal / Pokok Bahasan KBM Hari Ini:
                </label>
                <input
                  type="text"
                  value={kbmTopic}
                  onChange={(e) => setKbmTopic(e.target.value)}
                  placeholder="Misal: Bab Thaharah: Syarat, Rukun, dan Sunnah Wudhu Kitab Fathul Qorib"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none bg-slate-50/50"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-600">Rekap:</span>
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
              <span className="ml-auto text-[11px] text-slate-500">
                Tingkat Kehadiran: <strong className="text-slate-900">{attendanceRate}%</strong>
              </span>
            </div>
          </Card>

          {isPresensiSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-sm">
              <Check className="w-4 h-4 text-emerald-600" />
              Data presensi {isGuru ? selectedKbmClass : selectedSession} dan jurnal materi berhasil disimpan!
            </div>
          )}

          <Card className="p-0 overflow-hidden border-slate-200 divide-y divide-slate-100">
            {filteredAttendance.map((student) => (
              <div
                key={student.id}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{student.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">NIS: {student.nis}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {student.className} • {student.room}
                    {student.note && (
                      <span className="ml-2 text-amber-600 italic">({student.note})</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
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

      {/* ================= TAB 3 (TAHFIZH) ================= */}
      {!isOwner && activeTab === "tahfizh" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                {isWali ? "Buku Mutaba'ah & Capaian Setoran Tahfizh Ananda" : "Mutaba'ah & Catatan Setoran Al-Qur'an Santri"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isWali
                  ? "Riwayat rekaman setoran hafalan Al-Qur'an ananda beserta nilai dan arahan tajwid dari Musyrif."
                  : "Pencatatan ziyadah hafalan baru, muraja'ah pengulangan, dan kelulusan tasmi' santri binaan."}
              </p>
            </div>

            {!isWali ? (
              <button
                onClick={() => setShowHafalanModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Catat Setoran Baru</span>
              </button>
            ) : (
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all shrink-0"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak Rapor Tahfizh</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {hafalanRecords.map((item) => (
              <Card key={item.id} className="p-4 border-slate-200 hover:border-emerald-300 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.studentName}</span>
                    <span className="text-[11px] text-slate-400">({item.className})</span>
                    <Badge
                      variant={
                        item.type === "Ziyadah"
                          ? "default"
                          : item.type === "Tasmi'"
                          ? "warning"
                          : "success"
                      }
                      className="text-[10px]"
                    >
                      {item.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                    <Badge variant="success" className="text-[10px] font-bold">
                      {item.grade}
                    </Badge>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-emerald-800">{item.surah}</span>
                    <span className="text-slate-400 ml-2 font-mono">(Juz {item.juz})</span>
                  </div>
                  <span className="text-slate-500 text-[11px]">Musyrif: {item.ustadz}</span>
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                    &ldquo;{item.notes}&rdquo;
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {(isAdmin || isKesantrian || isWali) && activeTab === "perizinan" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-emerald-600" />
                {isWali ? "Riwayat & Pengajuan Surat Izin Ananda" : "Daftar Izin Keluar & Kepulangan Santri"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isWali
                  ? "Status surat jalan resmi gerbang, izin berobat, dan permohonan kepulangan santri mukim."
                  : "Monitoring lalu lintas gerbang, surat jalan resmi, dan batas kepulangan santri mukim."}
              </p>
            </div>

            <button
              onClick={() => setShowPermitModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isWali ? "+ Ajukan Izin Santri" : "+ Terbitkan Surat Izin"}</span>
            </button>
          </div>

          <div className="space-y-3">
            {permits.map((item) => (
              <Card key={item.id} className="p-4 border-slate-200 hover:border-slate-300 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {item.permitNo}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{item.studentName}</span>
                    <span className="text-[11px] text-slate-400">({item.className})</span>
                  </div>

                  <Badge
                    variant={
                      item.status === "ACTIVE"
                        ? "warning"
                        : item.status === "COMPLETED"
                        ? "default"
                        : item.status === "APPROVED"
                        ? "success"
                        : "danger"
                    }
                  >
                    {item.status === "ACTIVE"
                      ? "Sedang Keluar"
                      : item.status === "COMPLETED"
                      ? "Telah Kembali"
                      : item.status === "APPROVED"
                      ? "Disetujui (Belum Berangkat)"
                      : "Ditolak"}
                  </Badge>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-medium text-slate-800">
                    Keperluan: <span className="font-normal text-slate-600">{item.reason}</span>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Waktu: <span className="font-semibold text-slate-700">{item.startDate}</span> s/d{" "}
                    <span className="font-semibold text-slate-700">{item.endDate}</span>
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Penjemput / Wali: <span className="text-slate-700">{item.guardianName} ({item.phone})</span>
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-medium">Verified by Kesantrian</span>
                    <button
                      onClick={() => setSelectedGatePass({ ...item, santri: item.studentName, room: item.className, duration: `${item.startDate} s/d ${item.endDate}`, expectedReturn: item.endDate })}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Cetak Surat Jalan Gerbang</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5 (KEDISIPLINAN & POIN TA'ZIR KESANTRIAN) ================= */}
      {isWali && activeTab === "disiplin" && (
        <div className="space-y-4 animate-in fade-in">
          <Card className="p-6 bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-200 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Catatan Kedisiplinan &amp; Akhlak Ananda</h3>
                  <Badge variant="success">Teladan (0 Poin Pelanggaran)</Badge>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Alhamdulillah, ananda <span className="font-semibold text-slate-800">Ahmad Fauzan</span> memiliki riwayat ketertiban yang sangat baik. Senantiasa menjaga adab santri, hadir shalat berjamaah 5 waktu tepat waktu, dan tidak pernah tercatat melakukan pelanggaran tata tertib pondok.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-emerald-100">
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Kedisiplinan Shalat</span>
                <p className="text-sm font-bold text-emerald-700 mt-0.5">100% Berjamaah</p>
                <span className="text-[10px] text-slate-400">Masjid Jami&apos; Pesantren</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Ketertiban Asrama</span>
                <p className="text-sm font-bold text-emerald-700 mt-0.5">Sangat Baik (A)</p>
                <span className="text-[10px] text-slate-400">Kamar A-03 (Utsman)</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Bimbingan Musyrif</span>
                <p className="text-sm font-bold text-emerald-700 mt-0.5">Rajin &amp; Berakhlak Baik</p>
                <span className="text-[10px] text-slate-400">Ustadz Pembina</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {!isWali && activeTab === "disiplin" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Matriks Kedisiplinan & Poin Ta&apos;zir Santri
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan pelanggaran tata tertib pondok, perhitungan akumulasi poin, dan penyelesaian sanksi edukatif.
              </p>
            </div>

            <button
              onClick={() => setIsViolationModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Catat Pelanggaran Santri</span>
            </button>
          </div>

          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Total Kasus</span>
              <p className="text-lg font-extrabold text-slate-900">{violations.length}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] text-rose-600 font-semibold uppercase">Ta&apos;zir Aktif</span>
              <p className="text-lg font-extrabold text-rose-600">
                {violations.filter((v) => v.taazirStatus === "BELUM_TUNTAS").length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] text-amber-600 font-semibold uppercase">Ambang SP2 (&gt;50 Poin)</span>
              <p className="text-lg font-extrabold text-amber-600">
                {violations.filter((v) => v.points >= 50).length} Santri
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] text-emerald-600 font-semibold uppercase">Sanksi Tuntas</span>
              <p className="text-lg font-extrabold text-emerald-600">
                {violations.filter((v) => v.taazirStatus === "TUNTAS").length}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {violations.map((v) => (
              <Card key={v.id} className="p-4 border-slate-200 hover:border-rose-200 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1">
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

                    <p className="text-xs font-semibold text-slate-800">{v.violation}</p>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Bentuk Sanksi Edukatif: </span>
                      {v.taazir}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <button
                      onClick={() =>
                        setViolations((prev) =>
                          prev.map((item) =>
                            item.id === v.id
                              ? {
                                  ...item,
                                  taazirStatus: item.taazirStatus === "BELUM_TUNTAS" ? "TUNTAS" : "BELUM_TUNTAS",
                                }
                              : item
                          )
                        )
                      }
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

      {/* ================= MODAL CATAT SETORAN HAFALAN ================= */}
      {showHafalanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Catat Setoran Hafalan Baru
              </h3>
              <button
                onClick={() => setShowHafalanModal(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHafalan} className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Santri *</label>
                {studentsList && studentsList.length > 0 ? (
                  <select
                    required
                    value={newHafalan.studentId}
                    onChange={(e) => {
                      const sel = studentsList.find((s) => s.id === e.target.value);
                      setNewHafalan({
                        ...newHafalan,
                        studentId: e.target.value,
                        studentName: sel?.name || "",
                        className: sel?.className || "Kelas Wustha 2",
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Santri --</option>
                    {studentsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.nis}) - {s.className}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={newHafalan.studentName}
                    onChange={(e) => setNewHafalan({ ...newHafalan, studentName: e.target.value })}
                    placeholder="Nama lengkap santri"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Jenis Setoran</label>
                  <select
                    value={newHafalan.type}
                    onChange={(e) =>
                      setNewHafalan({ ...newHafalan, type: e.target.value as "Ziyadah" | "Muraja'ah" | "Tasmi'" })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Ziyadah">Ziyadah (Ayat Baru)</option>
                    <option value="Muraja'ah">Muraja'ah (Ulang Hafalan)</option>
                    <option value="Tasmi'">Ujian Tasmi' Majelis</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Juz Ke-</label>
                  <input
                    type="number"
                    value={newHafalan.juz}
                    onChange={(e) => setNewHafalan({ ...newHafalan, juz: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Surah & Ayat Yang Disetorkan</label>
                <input
                  type="text"
                  required
                  value={newHafalan.surah}
                  onChange={(e) => setNewHafalan({ ...newHafalan, surah: e.target.value })}
                  placeholder="Misal: Surah Al-Mulk ayat 1-30"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nilai / Predikat</label>
                <select
                  value={newHafalan.grade}
                  onChange={(e) =>
                    setNewHafalan({
                      ...newHafalan,
                      grade: e.target.value as "Mumtaz (A)" | "Jayyid Jiddan (B+)" | "Jayyid (B)" | "Maqbul (C)",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Mumtaz (A)">Mumtaz (A) — Lancar, Tajwid Sempurna</option>
                  <option value="Jayyid Jiddan (B+)">Jayyid Jiddan (B+) — Baik Sekali</option>
                  <option value="Jayyid (B)">Jayyid (B) — Cukup Lancar</option>
                  <option value="Maqbul (C)">Maqbul (C) — Perlu Diulang</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Catatan Musyrif / Ustadz</label>
                <textarea
                  rows={2}
                  value={newHafalan.notes}
                  onChange={(e) => setNewHafalan({ ...newHafalan, notes: e.target.value })}
                  placeholder="Catatan tajwid atau kelancaran santri"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowHafalanModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHafalan}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold shadow-sm flex items-center gap-1.5"
                >
                  {isSubmittingHafalan ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Setoran</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL BUAT SURAT IZIN ================= */}
      {showPermitModal && (isAdmin || isKesantrian || isWali) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <DoorOpen className="w-4 h-4" />
                {isWali ? "Ajukan Permohonan Izin Keluar Ananda" : "Penerbitan Surat Izin Santri"}
              </h3>
              <button
                onClick={() => setShowPermitModal(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePermit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Santri *</label>
                {studentsList && studentsList.length > 0 ? (
                  <select
                    required
                    value={newPermit.studentId}
                    onChange={(e) => {
                      const sel = studentsList.find((s) => s.id === e.target.value);
                      setNewPermit({
                        ...newPermit,
                        studentId: e.target.value,
                        studentName: sel?.name || "",
                        className: sel?.className || "Santri",
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">-- Pilih Santri --</option>
                    {studentsList.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.nis}) - {s.className}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={newPermit.studentName}
                    onChange={(e) => setNewPermit({ ...newPermit, studentName: e.target.value })}
                    placeholder="Nama santri"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Jenis Izin</label>
                <select
                  value={newPermit.type}
                  onChange={(e) =>
                    setNewPermit({
                      ...newPermit,
                      type: e.target.value as "PULANG" | "BEROBAT" | "KEPERLUAN_KELUARGA" | "LOMBA",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="PULANG">Pulang ke Rumah</option>
                  <option value="BEROBAT">Berobat ke RS / Puskesmas</option>
                  <option value="KEPERLUAN_KELUARGA">Keperluan Keluarga</option>
                  <option value="LOMBA">Tugas Lomba Eksternal</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Alasan Izin Lengkap *</label>
                <textarea
                  rows={2}
                  required
                  value={newPermit.reason}
                  onChange={(e) => setNewPermit({ ...newPermit, reason: e.target.value })}
                  placeholder="Deskripsi keperluan izin santri"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Waktu Keluar</label>
                  <input
                    type="datetime-local"
                    required
                    value={newPermit.startDate}
                    onChange={(e) => setNewPermit({ ...newPermit, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Batas Waktu Kembali</label>
                  <input
                    type="datetime-local"
                    required
                    value={newPermit.endDate}
                    onChange={(e) => setNewPermit({ ...newPermit, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Penjemput / Wali Santri</label>
                <input
                  type="text"
                  value={newPermit.guardianName}
                  onChange={(e) => setNewPermit({ ...newPermit, guardianName: e.target.value })}
                  placeholder="Nama orang tua atau pengantar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPermitModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPermit}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold shadow-sm flex items-center gap-1.5"
                >
                  {isSubmittingPermit ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{isWali ? "Mengirim Permohonan..." : "Menerbitkan..."}</span>
                    </>
                  ) : (
                    <span>{isWali ? "Kirim Permohonan Izin" : "Terbitkan Surat Izin"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT PELANGGARAN SANTRI BARU */}
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

            <form
              onSubmit={(e) => {
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
                    taazir: newViolation.taazir || "Ta'zir kebersihan masjid",
                    taazirStatus: "BELUM_TUNTAS",
                    date: "Hari ini",
                  },
                  ...violations,
                ]);
                setIsViolationModalOpen(false);
                setNewViolation({ santri: "", nis: "", room: "Kamar A-01", category: "RINGAN", violation: "", points: 5, taazir: "" });
              }}
              className="p-5 space-y-3 text-xs overflow-y-auto"
            >
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

      {/* MODAL: CETAK SLIP GERBANG SATPAM */}
      {selectedGatePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-emerald-600" />
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
                <p>Kelas / Kamar : {selectedGatePass.room}</p>
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
