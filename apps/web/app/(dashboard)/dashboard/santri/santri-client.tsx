"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Users,
  UserPlus,
  Search,
  BookOpen,
  CreditCard,
  CalendarCheck,
  FileCheck,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  Award,
  Filter,
  Layers,
  Edit,
  Building,
  GraduationCap,
  CheckSquare,
  FileSpreadsheet,
  Home,
  FileText,
  QrCode,
  Send,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";
import { createStudentAction, updateStudentAction, deleteStudentAction } from "@/actions/santri";

export interface StudentItem {
  id: string;
  nis: string;
  nisn?: string;
  name: string;
  nickname: string;
  gender: "Laki-laki" | "Perempuan";
  birthPlace: string;
  birthDate: string;
  address: string;
  phone: string;
  className: string;
  roomName: string;
  status: "AKTIF" | "IZIN" | "SAKIT" | "ALUMNI";
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  hifzProgress: string;
  hifzDetail: string;
  tuitionStatus: "LUNAS" | "MENUNGGAK";
  tuitionDue: number;
  attendanceRate: string;
  recentPermit?: string;
}

export interface AcademicGrade {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  subject: string;
  uh: number;
  uts: number;
  uas: number;
  finalGrade: number;
  predicate: "Mumtaz (A)" | "Jayyid Jiddan (B+)" | "Jayyid (B)" | "Maqbul (C)" | "Dhaif (D)";
  status: "TUNTAS" | "REMEDIAL";
  notes: string;
  adab: "Sangat Baik (A)" | "Baik (B)" | "Cukup (C)";
}

interface SantriClientProps {
  tenantName: string;
  initialStudents: StudentItem[];
  classrooms?: { id: string; name: string }[];
  rooms?: { id: string; name: string }[];
  userRole?: string;
  initialTab?: string;
}

export default function SantriClient({
  tenantName,
  initialStudents,
  classrooms = [],
  rooms = [],
  userRole = "OWNER",
  initialTab,
}: SantriClientProps) {
  const isOwner = userRole === "OWNER" || userRole === "SUPER_ADMIN";
  const isGuru = userRole === "GURU";
  const isKesantrian = userRole === "KESANTRIAN" || userRole === "MUSYRIF";
  const isBendahara = userRole === "BENDAHARA";
  const isWali = userRole === "WALI_SANTRI";
  const isAdmin = userRole === "ADMIN" || (!isOwner && !isGuru && !isKesantrian && !isBendahara && !isWali);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  type DossierTab =
    | "ringkasan"
    | "wali"
    | "akademik"
    | "tahfizh"
    | "absensi"
    | "kedisiplinan"
    | "pembinaan"
    | "perizinan"
    | "keuangan"
    | "dokumen";
  const [activeDossierTab, setActiveDossierTab] = useState<DossierTab>("ringkasan");

  // Bendahara State
  const [tuitionFilter, setTuitionFilter] = useState<"ALL" | "LUNAS" | "MENUNGGAK">("ALL");

  // Wali Santri State
  const [waliChildTab, setWaliChildTab] = useState<"kts" | "biodata" | "rapor" | "tahfizh" | "spp">("kts");

  // Owner View Tabs
  const [ownerMainTab, setOwnerMainTab] = useState<"direktori" | "demografi" | "perhatian">("direktori");

  // Admin View Tabs & Document Center
  const [adminTab, setAdminTab] = useState<"direktori" | "dokumen" | "kamar_kelas">(
    initialTab === "dokumen" ? "dokumen" : "direktori"
  );
  const [docModal, setDocModal] = useState<"KTS" | "SURAT_AKTIF" | null>(null);
  const [selectedStudentForDoc, setSelectedStudentForDoc] = useState<StudentItem | null>(null);

  useEffect(() => {
    if (initialTab === "dokumen") {
      setAdminTab("dokumen");
    }
  }, [initialTab]);

  // Guru View State
  const [guruTab, setGuruTab] = useState<"nilai" | "remedial" | "adab">("nilai");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<AcademicGrade | null>(null);
  const [scoreNotification, setScoreNotification] = useState<string | null>(null);

  const handleSendWhatsAppReminder = (std: StudentItem) => {
    const cleanPhone = (std.guardianPhone || "").replace(/\D/g, "");
    const text = encodeURIComponent(
      `Assalamu'alaikum Wr. Wb.\n\n` +
      `Yth. Bapak/Ibu Wali Santri dari ananda *${std.name}* (${std.className}),\n\n` +
      `Kami dari Bagian Keuangan / Bendahara *${tenantName}* menginformasikan bahwa kewajiban SPP Syahriyah ananda saat ini berstatus *${std.tuitionStatus}* dengan nominal sebesar *${formatRupiah(std.tuitionDue || 500000)}*.\n\n` +
      `Pembayaran dapat ditransfer via rekening resmi pondok atau langsung ke Meja Kasir Bendahara.\n\n` +
      `Jazakumullahu khairan katsiran.\nWassalamu'alaikum Wr. Wb.`
    );
    window.open(`https://wa.me/${cleanPhone || "6281234567890"}?text=${text}`, "_blank");
  };

  const [academicGrades, setAcademicGrades] = useState<AcademicGrade[]>([
    {
      id: "grd-1",
      studentId: "std-1",
      studentName: "Ahmad Fauzan",
      className: "Ulya 2",
      subject: "Fiqih Ibadah (Fathul Qorib)",
      uh: 88,
      uts: 90,
      uas: 92,
      finalGrade: 90,
      predicate: "Mumtaz (A)",
      status: "TUNTAS",
      notes: "Fasih dalam memahami rukun dan dalil thaharah.",
      adab: "Sangat Baik (A)",
    },
    {
      id: "grd-2",
      studentId: "std-2",
      studentName: "Muhammad Ali Al-Fatih",
      className: "Ulya 1",
      subject: "Bahasa Arab & Nahwu (Al-Jurumiyah)",
      uh: 95,
      uts: 92,
      uas: 96,
      finalGrade: 94,
      predicate: "Mumtaz (A)",
      status: "TUNTAS",
      notes: "I'rab sangat mutqin, aktif berdiskusi di halaqah.",
      adab: "Sangat Baik (A)",
    },
    {
      id: "grd-3",
      studentId: "std-3",
      studentName: "Bilal Ibnu Rabah",
      className: "Wustha 2",
      subject: "Fiqih Ibadah (Fathul Qorib)",
      uh: 65,
      uts: 68,
      uas: 70,
      finalGrade: 68,
      predicate: "Dhaif (D)",
      status: "REMEDIAL",
      notes: "Perlu bimbingan remedial khusus bab wudhu & tayamum.",
      adab: "Baik (B)",
    },
    {
      id: "grd-4",
      studentId: "std-4",
      studentName: "Farhan Hakim",
      className: "Wustha 2",
      subject: "Hadits Arbain An-Nawawiyyah",
      uh: 72,
      uts: 70,
      uas: 74,
      finalGrade: 72,
      predicate: "Maqbul (C)",
      status: "REMEDIAL",
      notes: "Hafalan matan hadits 1-5 perlu muraja'ah ulang.",
      adab: "Baik (B)",
    },
    {
      id: "grd-5",
      studentId: "std-5",
      studentName: "Raihan Putra Pratama",
      className: "Ulya 1",
      subject: "Bahasa Arab & Nahwu (Al-Jurumiyah)",
      uh: 85,
      uts: 84,
      uas: 88,
      finalGrade: 86,
      predicate: "Jayyid Jiddan (B+)",
      status: "TUNTAS",
      notes: "Tanda-tanda i'rab isim mufrad & jamak taksir dikuasai.",
      adab: "Sangat Baik (A)",
    },
    {
      id: "grd-6",
      studentId: "std-6",
      studentName: "Salman Al-Farisi",
      className: "Wustha 2",
      subject: "Tahfizh Al-Qur'an (Juz 30)",
      uh: 90,
      uts: 92,
      uas: 94,
      finalGrade: 92,
      predicate: "Mumtaz (A)",
      status: "TUNTAS",
      notes: "Makhraj & tajwid sangat bersih dan tartil.",
      adab: "Sangat Baik (A)",
    },
  ]);

  // Admin Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);

  // Form State for Admin
  const [newNis, setNewNis] = useState("");
  const [newName, setNewName] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [newGender, setNewGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [newClass, setNewClass] = useState("Ulya 1");
  const [newRoom, setNewRoom] = useState("Kamar A-01");
  const [newGuardian, setNewGuardian] = useState("");
  const [newGuardianPhone, setNewGuardianPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((std) => {
      const matchSearch =
        !q ||
        std.name.toLowerCase().includes(q) ||
        std.nis.includes(q) ||
        std.className.toLowerCase().includes(q) ||
        std.roomName.toLowerCase().includes(q) ||
        std.guardianName.toLowerCase().includes(q);

      const matchStatus = selectedStatus === "ALL" || std.status === selectedStatus;
      const matchClass = selectedClass === "ALL" || std.className === selectedClass;

      return matchSearch && matchStatus && matchClass;
    });
  }, [students, searchQuery, selectedStatus, selectedClass]);

  // Filtered Academic Grades for Guru
  const filteredGrades = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return academicGrades.filter((g) => {
      const matchSearch =
        !q ||
        g.studentName.toLowerCase().includes(q) ||
        g.className.toLowerCase().includes(q) ||
        g.subject.toLowerCase().includes(q);

      const matchSubject = selectedSubject === "ALL" || g.subject.includes(selectedSubject);
      const matchClass = selectedClass === "ALL" || g.className === selectedClass;

      return matchSearch && matchSubject && matchClass;
    });
  }, [academicGrades, searchQuery, selectedSubject, selectedClass]);

  const remedialGrades = useMemo(() => {
    return academicGrades.filter((g) => g.status === "REMEDIAL");
  }, [academicGrades]);

  // Special lists for Owner
  const attentionStudents = useMemo(() => {
    return students.filter((std) => std.status === "IZIN" || std.status === "SAKIT" || std.tuitionStatus === "MENUNGGAK");
  }, [students]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newNis) return;
    setIsSubmitting(true);

    try {
      const selectedClassObj = classrooms.find((c) => c.name === newClass);
      const selectedRoomObj = rooms.find((r) => r.name === newRoom);

      const res = await createStudentAction({
        nis: newNis,
        name: newName,
        nickname: newNickname || newName.split(" ")[0],
        gender: newGender === "Perempuan" ? "PEREMPUAN" : "LAKI_LAKI",
        status: "AKTIF", // Default status pendaftaran santri baru
        classroomId: selectedClassObj?.id,
        dormitoryRoomId: selectedRoomObj?.id,
        guardianName: newGuardian || undefined,
        guardianPhone: newGuardianPhone || undefined,
        address: newAddress || undefined,
      });

      if (res.success && res.data) {
        const created = res.data;
        const newStudent: StudentItem = {
          id: created.id,
          nis: created.nis,
          name: created.name,
          nickname: created.nickname || created.name.split(" ")[0],
          gender: created.gender === "PEREMPUAN" ? "Perempuan" : "Laki-laki",
          birthPlace: created.birthPlace || "-",
          birthDate: "-",
          address: created.address || "-",
          phone: created.phone || "-",
          className: created.classroom?.name || newClass,
          roomName: created.dormitoryRoom?.name || newRoom,
          status: (created.status as any) || "AKTIF",
          guardianName: created.guardianName || "-",
          guardianPhone: created.guardianPhone || "-",
          guardianRelation: created.guardianRelation || "WALI",
          hifzProgress: "Juz 30 (Baru Masuk)",
          hifzDetail: "Baru memulai halaqah bimbingan.",
          tuitionStatus: "LUNAS",
          tuitionDue: 0,
          attendanceRate: "100%",
          recentPermit: "-",
        };

        setStudents([newStudent, ...students]);
        setIsAddModalOpen(false);
        setScoreNotification(`Santri ${created.name} (${created.nis}) berhasil disimpan ke database!`);
        setTimeout(() => setScoreNotification(null), 4000);

        // Reset Form
        setNewNis("");
        setNewName("");
        setNewNickname("");
        setNewAddress("");
        setNewGuardian("");
        setNewGuardianPhone("");
      } else {
        alert(res.error || "Gagal menyimpan data santri.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem saat menyimpan santri.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setIsSubmitting(true);

    try {
      const selectedClassObj = classrooms.find((c) => c.name === editingStudent.className);
      const res = await updateStudentAction(editingStudent.id, {
        status: editingStudent.status as any,
        classroomId: selectedClassObj?.id,
        guardianName: editingStudent.guardianName,
        guardianPhone: editingStudent.guardianPhone,
      });

      if (res.success) {
        setStudents((prev) =>
          prev.map((item) => (item.id === editingStudent.id ? editingStudent : item))
        );
        setIsEditModalOpen(false);
        setScoreNotification(`Data santri ${editingStudent.name} berhasil diperbarui!`);
        setTimeout(() => setScoreNotification(null), 4000);
        setEditingStudent(null);
      } else {
        alert(res.error || "Gagal memperbarui data santri.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem saat memperbarui data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;

    // Calculate final grade: 30% UH + 30% UTS + 40% UAS
    const finalCalculated = Math.round(editingGrade.uh * 0.3 + editingGrade.uts * 0.3 + editingGrade.uas * 0.4);
    let pred: "Mumtaz (A)" | "Jayyid Jiddan (B+)" | "Jayyid (B)" | "Maqbul (C)" | "Dhaif (D)" = "Mumtaz (A)";
    let stat: "TUNTAS" | "REMEDIAL" = "TUNTAS";

    if (finalCalculated >= 90) {
      pred = "Mumtaz (A)";
    } else if (finalCalculated >= 80) {
      pred = "Jayyid Jiddan (B+)";
    } else if (finalCalculated >= 75) {
      pred = "Jayyid (B)";
    } else if (finalCalculated >= 70) {
      pred = "Maqbul (C)";
      stat = "REMEDIAL";
    } else {
      pred = "Dhaif (D)";
      stat = "REMEDIAL";
    }

    const updated: AcademicGrade = {
      ...editingGrade,
      finalGrade: finalCalculated,
      predicate: pred,
      status: stat,
    };

    setAcademicGrades((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );

    setIsScoreModalOpen(false);
    setEditingGrade(null);
    setScoreNotification(`Nilai ${updated.studentName} mata pelajaran ${updated.subject} berhasil disimpan!`);
    setTimeout(() => setScoreNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {scoreNotification && (
        <div className="p-3.5 rounded-2xl bg-emerald-700 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in slide-in-from-top">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{scoreNotification}</span>
          </div>
          <button onClick={() => setScoreNotification(null)} className="text-white/80 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={isOwner ? "success" : isGuru ? "success" : isKesantrian ? "default" : isBendahara ? "success" : isWali ? "info" : "default"}
              className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 ${
                isOwner
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : isGuru
                  ? "bg-teal-100 text-teal-800 border-teal-200"
                  : isKesantrian
                  ? "bg-sky-100 text-sky-800 border-sky-200"
                  : isBendahara
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : isWali
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : "bg-emerald-100 text-emerald-800 border-emerald-200"
              }`}
            >
              {isOwner
                ? "👑 Pandangan Pimpinan Yayasan"
                : isGuru
                ? "📚 Meja Pengajar & Wali Kelas"
                : isKesantrian
                ? "🛡️ Bagian Kesantrian & Keasramaan"
                : isBendahara
                ? "💰 Rekapitulasi SPP & Piutang Santri"
                : isWali
                ? "👨‍👩‍👧 Portal Profil & Dokumen Ananda"
                : "🛠️ Meja Kerja Tata Usaha (TU)"}
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {isGuru ? (
              <GraduationCap className="w-6 h-6 text-emerald-600" />
            ) : isKesantrian ? (
              <Building className="w-6 h-6 text-sky-600" />
            ) : isBendahara ? (
              <CreditCard className="w-6 h-6 text-emerald-600" />
            ) : isWali ? (
              <HeartHandshake className="w-6 h-6 text-rose-600" />
            ) : (
              <Users className="w-6 h-6 text-emerald-600" />
            )}
            {isOwner
              ? "Direktori & Demografi Santri"
              : isGuru
              ? "Santri Kelas Bimbingan & Rapor Akademik"
              : isKesantrian
              ? "Kamar Asrama & Santri Mukim"
              : isBendahara
              ? "Status SPP & Direktori Wali Santri"
              : isWali
              ? "Biodata & Dokumen Resmi Ananda"
              : "Data Induk Santri & Kesiswaan"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isOwner
              ? `Pemantauan sebaran santri per jenjang, statistik asal daerah, rasio mukim, dan profil perkembangan santri di ${tenantName}.`
              : isGuru
              ? `Rekapitulasi santri kelas binaan, penginputan nilai madrasah diniyah, evaluasi tahfizh Al-Qur'an, dan bimbingan belajar santri di ${tenantName}.`
              : isKesantrian
              ? `Monitoring kamar asrama, kapasitas ranjang santri, status mukim/sakit/izin, dan koordinasi wali di ${tenantName}.`
              : isBendahara
              ? `Pemantauan ketertiban pembayaran SPP syahriyah, status tagihan, kontak WhatsApp wali, dan tindak lanjut penagihan di ${tenantName}.`
              : isWali
              ? `Akses mandiri wali santri terhadap Kartu Tanda Santri (KTS), riwayat nilai akademik, tahfizh, dan status administrasi di ${tenantName}.`
              : `Pencatatan biodata NISN, penempatan asrama, kelas, mutasi santri, dan kelengkapan berkas santri di ${tenantName}.`}
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              <button
                onClick={() => alert("Mengunduh Rekapitulasi Data Santri (Excel)...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh Rekap (.xlsx)</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-slate-200" />
                <span>Cetak Rapor Santri</span>
              </button>
            </>
          ) : isGuru ? (
            <>
              <button
                onClick={() => alert("Mengunduh Leger Nilai Akademik (.xlsx)...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh Leger Nilai (.xlsx)</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-slate-200" />
                <span>Cetak Rekap Nilai</span>
              </button>
            </>
          ) : isKesantrian ? (
            <>
              <button
                onClick={() => alert("Mengunduh Rekapitulasi Data Kamar & Asrama (.xlsx)...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh Data Kamar (.xlsx)</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-slate-200" />
                <span>Cetak Daftar Asrama</span>
              </button>
            </>
          ) : isBendahara ? (
            <>
              <button
                onClick={() => alert("Mengunduh Rekapitulasi SPP Santri Format Excel (.xlsx)...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh Rekap Piutang (.xlsx)</span>
              </button>
              <Link
                href="/dashboard/finance?tab=kasir&action=bayar"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <CreditCard className="w-3.5 h-3.5 text-white" />
                <span>Buka Kasir POS</span>
              </Link>
            </>
          ) : isWali ? (
            <>
              <button
                onClick={() => {
                  setSelectedStudentForDoc(students[0] || null);
                  setDocModal("KTS");
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5 text-white" />
                <span>Lihat Kartu Santri (KTS)</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak Biodata</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => alert("Fitur Import Excel (.xlsx) siap digunakan.")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Import Excel</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Tambah Santri Baru</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================= STATS SECTION ================= */}
      {isOwner ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Total Santri Terdaftar"
            value={`${students.length} Santri`}
            subtitle="100% Data Terverifikasi"
            icon={<Users className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "+12 Baru", isPositive: true }}
          />
          <StatCard
            title="Santri Tahfizh Mumtaz"
            value="48 Santri"
            subtitle="Nilai A (Mutqin & Tajwid)"
            icon={<Award className="w-5 h-5 text-amber-500" />}
            trend={{ value: "11% Total", isPositive: true }}
          />
          <StatCard
            title="Tingkat Kehadiran Mukim"
            value="98.2%"
            subtitle="Disiplin asrama & shalat"
            icon={<CalendarCheck className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Sangat Baik", isPositive: true }}
          />
          <StatCard
            title="Perhatian Khusus Kyai"
            value={`${attentionStudents.length} Santri`}
            subtitle="Sakit / Menunggak / Izin Lama"
            icon={<HeartHandshake className="w-5 h-5 text-rose-500" />}
            trend={{ value: "Perlu Tindakan", isPositive: false }}
          />
        </div>
      ) : isGuru ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Santri Kelas Binaan"
            value="68 Santri"
            subtitle="Wustha 2 & Ulya 1"
            icon={<Users className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Aktif KBM", isPositive: true }}
          />
          <StatCard
            title="Rata-rata Nilai KBM"
            value="86.4"
            subtitle="Predikat: Mumtaz (A)"
            icon={<Award className="w-5 h-5 text-amber-500" />}
            trend={{ value: "+2.1 Poin", isPositive: true }}
          />
          <StatCard
            title="Santri Butuh Remedial"
            value={`${remedialGrades.length} Santri`}
            subtitle="Nilai di bawah KKM 75"
            icon={<AlertCircle className="w-5 h-5 text-rose-500" />}
            trend={{ value: "Perlu Bimbingan", isPositive: false }}
          />
          <StatCard
            title="Ketuntasan Silabus"
            value="91.2%"
            subtitle="Semester Berjalan"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Sesuai Target", isPositive: true }}
          />
        </div>
      ) : isKesantrian ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Santri Mukim Asrama"
            value="402 Santri"
            subtitle="94% Tinggal di Pondok"
            icon={<Home className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Mukim", isPositive: true }}
          />
          <StatCard
            title="Kamar Asrama Terisi"
            value="42 / 46 Kamar"
            subtitle="Gedung Al-Faruq & Ash-Shiddiq"
            icon={<Building className="w-5 h-5 text-teal-600" />}
            trend={{ value: "4 Kamar Kosong", isPositive: true }}
          />
          <StatCard
            title="Santri Sakit di UKS"
            value="2 Santri"
            subtitle="Dalam Perawatan Asrama"
            icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Perlu Pantau", isPositive: false }}
          />
          <StatCard
            title="Izin Sambangan Pulang"
            value="3 Santri"
            subtitle="Tercatat Izin Resmi"
            icon={<CalendarCheck className="w-5 h-5 text-sky-600" />}
            trend={{ value: "Izin Aktif", isPositive: true }}
          />
        </div>
      ) : isBendahara ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Total Santri Terdaftar"
            value={`${students.length} Santri`}
            subtitle="Wajib Pembayaran SPP"
            icon={<Users className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Aktif", isPositive: true }}
          />
          <StatCard
            title="Santri SPP Lunas"
            value={`${students.filter((s) => s.tuitionStatus === "LUNAS").length} Santri`}
            subtitle="Tepat Waktu Bulan Ini"
            icon={<CheckCircle2 className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Tertib", isPositive: true }}
          />
          <StatCard
            title="Santri Menunggak"
            value={`${students.filter((s) => s.tuitionStatus === "MENUNGGAK").length} Santri`}
            subtitle="Perlu Kirim Pengingat WA"
            icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Prioritas WA", isPositive: false }}
          />
          <StatCard
            title="Total Piutang Berjalan"
            value={formatRupiah(
              students
                .filter((s) => s.tuitionStatus === "MENUNGGAK")
                .reduce((sum, s) => sum + (s.tuitionDue || 500000), 0)
            )}
            subtitle="Kewajiban Belum Terbayar"
            icon={<CreditCard className="w-5 h-5 text-rose-500" />}
            trend={{ value: "Buku Piutang", isPositive: false }}
          />
        </div>
      ) : isWali ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Status Keaktifan Ananda"
            value="Aktif Mukim"
            subtitle="Kamar Abu Bakar (Gedung Al-Faruq)"
            icon={<Home className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Sehat", isPositive: true }}
          />
          <StatCard
            title="Capaian Tahfizh Qur'an"
            value="Juz 29"
            subtitle="Surah Al-Mulk (Ayat 1-30)"
            icon={<Award className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Mumtaz (A)", isPositive: true }}
          />
          <StatCard
            title="Kehadiran Shalat & KBM"
            value="100% Hadir"
            subtitle="Disiplin & Tepat Waktu"
            icon={<CalendarCheck className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Pekan Ini", isPositive: true }}
          />
          <StatCard
            title="Status Administrasi SPP"
            value="Lunas"
            subtitle="September 2026 Terbayar"
            icon={<CreditCard className="w-5 h-5 text-sky-600" />}
            trend={{ value: "Tertib", isPositive: true }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Kapasitas Kelas Terisi"
            value="88%"
            subtitle="Ulya & Wustha"
            icon={<BookOpen className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Optimal", isPositive: true }}
          />
          <StatCard
            title="Kamar Asrama Terisi"
            value="42 / 46 Kamar"
            subtitle="Gedung A, B & C"
            icon={<Building className="w-5 h-5 text-sky-600" />}
            trend={{ value: "4 Kamar Kosong", isPositive: true }}
          />
          <StatCard
            title="Berkas PPDB Lengkap"
            value="92%"
            subtitle="KK, Akta & Ijazah Asal"
            icon={<FileCheck className="w-5 h-5 text-teal-600" />}
            trend={{ value: "5 Pending", isPositive: false }}
          />
          <StatCard
            title="Santri Izin Hari Ini"
            value="3 Santri"
            subtitle="Tercatat di Pos Gerbang"
            icon={<CalendarCheck className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Semua Izin Resmi", isPositive: true }}
          />
        </div>
      )}

      {/* ================= GURU VIEW TABS BAR ================= */}
      {isGuru && (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setGuruTab("nilai")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              guruTab === "nilai"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Daftar Nilai & Rapor Santri</span>
          </button>
          <button
            onClick={() => setGuruTab("remedial")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              guruTab === "remedial"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Santri Perlu Bimbingan / Remedial ({remedialGrades.length})</span>
          </button>
          <button
            onClick={() => setGuruTab("adab")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              guruTab === "adab"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Catatan Karakter & Bimbingan Belajar</span>
          </button>
        </div>
      )}

      {/* ================= GURU VIEW: TAB 1 DAFTAR NILAI ================= */}
      {isGuru && guruTab === "nilai" && (
        <div className="space-y-4 animate-in fade-in">
          {/* Search & Subject Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari santri, kelas, mapel..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">Semua Mata Pelajaran</option>
                <option value="Fiqih Ibadah">Fiqih Ibadah (Fathul Qorib)</option>
                <option value="Bahasa Arab & Nahwu">Bahasa Arab & Nahwu (Jurumiyah)</option>
                <option value="Hadits Arbain">Hadits Arbain An-Nawawiyyah</option>
                <option value="Tahfizh Al-Qur'an">Tahfizh Al-Qur'an</option>
              </select>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">Semua Kelas</option>
                <option value="Ulya 1">Kelas Ulya 1</option>
                <option value="Ulya 2">Kelas Ulya 2</option>
                <option value="Wustha 2">Kelas Wustha 2</option>
              </select>
            </div>
          </div>

          {/* Academic Grades Table */}
          <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Santri & Kelas</th>
                    <th className="p-4">Mata Pelajaran</th>
                    <th className="p-4 text-center">UH (30%)</th>
                    <th className="p-4 text-center">UTS (30%)</th>
                    <th className="p-4 text-center">UAS (40%)</th>
                    <th className="p-4 text-center">Nilai Akhir</th>
                    <th className="p-4 text-center">Predikat</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGrades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                            {grade.studentName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{grade.studentName}</p>
                            <span className="text-[11px] text-slate-400 font-medium">{grade.className}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        {grade.subject}
                        <p className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{grade.notes}</p>
                      </td>
                      <td className="p-4 text-center font-mono font-medium text-slate-700">{grade.uh}</td>
                      <td className="p-4 text-center font-mono font-medium text-slate-700">{grade.uts}</td>
                      <td className="p-4 text-center font-mono font-medium text-slate-700">{grade.uas}</td>
                      <td className="p-4 text-center font-mono font-bold text-slate-900 text-sm">{grade.finalGrade}</td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          grade.predicate.includes("Mumtaz")
                            ? "bg-emerald-100 text-emerald-800"
                            : grade.predicate.includes("Jayyid")
                            ? "bg-sky-100 text-sky-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {grade.predicate}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={grade.status === "TUNTAS" ? "success" : "danger"} className="text-[10px]">
                          {grade.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingGrade(grade);
                              setIsScoreModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition-colors flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Input Nilai</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ================= GURU VIEW: TAB 2 REMEDIAL ================= */}
      {isGuru && guruTab === "remedial" && (
        <div className="space-y-4 animate-in fade-in">
          <Card className="p-5 space-y-4 border-rose-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Daftar Santri Memerlukan Bimbingan Khusus & Remedial
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Santri dengan nilai akhir di bawah batas ketuntasan minimal (KKM: 75). Perlu pengulangan materi dan ujian remedial.
                </p>
              </div>
              <Badge variant="danger" className="text-xs">
                {remedialGrades.length} Santri Remedial
              </Badge>
            </div>

            <div className="divide-y divide-slate-100">
              {remedialGrades.map((grade) => (
                <div key={grade.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
                      {grade.studentName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{grade.studentName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {grade.className} • Mapel: <span className="font-semibold text-rose-700">{grade.subject}</span>
                      </p>
                      <p className="text-[11px] text-slate-600 mt-1 italic">
                        &ldquo;{grade.notes}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-semibold">Nilai Akhir</span>
                      <span className="text-base font-bold text-rose-600">{grade.finalGrade} / 100</span>
                    </div>

                    <button
                      onClick={() => {
                        setEditingGrade(grade);
                        setIsScoreModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      Bimbingan & Uji Ulang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ================= GURU VIEW: TAB 3 KARAKTER & ADAB ================= */}
      {isGuru && guruTab === "adab" && (
        <div className="space-y-4 animate-in fade-in">
          <Card className="p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                Catatan Karakter, Kedisiplinan & Adab Belajar
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluasi adab thalabul ilmi, ketertiban membawa kitab/mushaf, dan etika santri terhadap asatidz dan sesama kawan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {academicGrades.map((grade) => (
                <div key={grade.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">
                        {grade.studentName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{grade.studentName}</p>
                        <p className="text-[10px] text-slate-400">{grade.className}</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-[10px]">
                      Adab: {grade.adab}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {grade.notes}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span>Evaluator: Dewan Asatidz</span>
                    <button
                      onClick={() => {
                        setEditingGrade(grade);
                        setIsScoreModalOpen(true);
                      }}
                      className="text-teal-700 font-semibold hover:underline"
                    >
                      Update Catatan &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ================= OWNER TABS BAR ================= */}
      {isOwner && (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setOwnerMainTab("direktori")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerMainTab === "direktori"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Direktori & Rapor Santri</span>
          </button>
          <button
            onClick={() => setOwnerMainTab("demografi")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerMainTab === "demografi"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Sebaran Demografi & Asal Daerah</span>
          </button>
          <button
            onClick={() => setOwnerMainTab("perhatian")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerMainTab === "perhatian"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Santri Perlu Perhatian Pimpinan ({attentionStudents.length})</span>
          </button>
        </div>
      )}

      {/* ================= OWNER VIEW: TAB DEMOGRAFI ================= */}
      {isOwner && ownerMainTab === "demografi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Sebaran Santri Berdasarkan Asal Wilayah
            </h3>
            <p className="text-xs text-slate-500">
              Distribusi santri mukim dari berbagai provinsi dan kabupaten/kota.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Jawa Timur (Surabaya, Sidoarjo, Gresik, Malang)</span>
                  <span className="font-bold text-emerald-700">65% (278 Santri)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Jawa Tengah & D.I. Yogyakarta</span>
                  <span className="font-bold text-teal-700">18% (77 Santri)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: "18%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Jawa Barat & DKI Jakarta</span>
                  <span className="font-bold text-sky-700">10% (43 Santri)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: "10%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Luar Pulau Jawa (Sumatera, Kalimantan, Sulawesi)</span>
                  <span className="font-bold text-indigo-700">7% (30 Santri)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: "7%" }}></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              Piramida Jenjang Pendidikan & Kamar
            </h3>
            <p className="text-xs text-slate-500">
              Proporsi santri berdasarkan tingkatan madrasah dan pemondokan.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Tingkat Ulya (SMA)</span>
                <span className="text-xl font-extrabold text-emerald-950 mt-1 block">184 Santri</span>
                <span className="text-[11px] text-emerald-800">43% dari total santri</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100">
                <span className="text-[10px] uppercase font-bold text-teal-700 block">Tingkat Wustha (SMP)</span>
                <span className="text-xl font-extrabold text-teal-950 mt-1 block">198 Santri</span>
                <span className="text-[11px] text-teal-800">46% dari total santri</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
                <span className="text-[10px] uppercase font-bold text-sky-700 block">Santri Mukim Asrama</span>
                <span className="text-xl font-extrabold text-sky-950 mt-1 block">402 Santri</span>
                <span className="text-[11px] text-sky-800">94% santri tinggal di pondok</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Santri Kalong (Non-Mukim)</span>
                <span className="text-xl font-extrabold text-amber-950 mt-1 block">26 Santri</span>
                <span className="text-[11px] text-amber-800">6% warga sekitar pesantren</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ================= OWNER VIEW: TAB SANTRI PERHATIAN KHUSUS ================= */}
      {isOwner && ownerMainTab === "perhatian" && (
        <Card className="p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-rose-600" />
                Daftar Santri Memerlukan Perhatian Khusus Pimpinan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Santri yang sedang sakit berkepanjangan, perizinan darurat, atau memiliki tunggakan SPP yang membutuhkan kebijakan beasiswa pimpinan.
              </p>
            </div>
            <Badge variant="danger" className="text-xs">
              {attentionStudents.length} Santri Tercatat
            </Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {attentionStudents.map((std) => (
              <div key={std.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0">
                    {std.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{std.name}</p>
                      <Badge variant={std.status === "AKTIF" ? "default" : "warning"} className="text-[10px]">
                        {std.status}
                      </Badge>
                      {std.tuitionStatus === "MENUNGGAK" && (
                        <Badge variant="danger" className="text-[10px]">
                          Tunggakan: {formatRupiah(std.tuitionDue)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{std.className} • {std.roomName} • Wali: {std.guardianName} ({std.guardianPhone})</p>
                    <p className="text-[10px] text-rose-600 font-medium mt-0.5">
                      Catatan: {std.recentPermit || "Evaluasi rutin pengasuhan"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedStudent(std);
                      setActiveDossierTab("ringkasan");
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Buka Dossier
                  </button>
                  <button
                    onClick={() => alert(`Membuat memo pimpinan santri ${std.name}`)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                  >
                    Beri Disposisi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= ADMIN TABS BAR ================= */}
      {isAdmin && (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setAdminTab("direktori")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              adminTab === "direktori"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Data Induk Santri</span>
          </button>
          <button
            onClick={() => setAdminTab("dokumen")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              adminTab === "dokumen"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pusat Cetak Dokumen & KTS</span>
          </button>
          <button
            onClick={() => setAdminTab("kamar_kelas")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              adminTab === "kamar_kelas"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Penataan Kamar & Kelas</span>
          </button>
        </div>
      )}

      {/* ================= ADMIN TAB: PUSAT DOKUMEN & KTS ================= */}
      {isAdmin && adminTab === "dokumen" && (
        <div className="space-y-4 animate-in fade-in">
          <Card className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 text-white border-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  Layanan Sekretariat & Tata Usaha
                </span>
                <h3 className="text-base font-extrabold mt-1">Penerbitan Dokumen Resmi & KTS Digital</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Cetak Kartu Tanda Santri dengan barcode identitas dan Surat Keterangan Aktif Belajar berkop resmi pondok.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedStudentForDoc(students[0] || null);
                  setDocModal("KTS");
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all shrink-0 flex items-center gap-1.5"
              >
                <QrCode className="w-4 h-4" />
                <span>+ Cetak KTS Santri Baru</span>
              </button>
            </div>
          </Card>

          {/* Search Bar Dokumen */}
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari santri untuk cetak dokumen..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Total {filteredStudents.length} santri siap cetak berkas
            </span>
          </div>

          <Card className="p-0 overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama Lengkap</th>
                    <th className="py-3 px-4">NIS</th>
                    <th className="py-3 px-4">Kelas & Kamar</th>
                    <th className="py-3 px-4">Wali Santri</th>
                    <th className="py-3 px-4 text-center">Cetak KTS</th>
                    <th className="py-3 px-4 text-center">Surat Aktif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900">{std.name}</td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{std.nis}</td>
                      <td className="py-3 px-4 text-slate-700">{std.className} • {std.roomName}</td>
                      <td className="py-3 px-4 text-slate-600">{std.guardianName}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudentForDoc(std);
                            setDocModal("KTS");
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                        >
                          <QrCode className="w-3 h-3 text-emerald-600" />
                          <span>KTS Barcode</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudentForDoc(std);
                            setDocModal("SURAT_AKTIF");
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 hover:border-indigo-500 hover:text-indigo-700 transition-colors"
                        >
                          <FileText className="w-3 h-3 text-indigo-600" />
                          <span>Surat Keterangan</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ================= ADMIN TAB: PENATAAN KAMAR & KELAS ================= */}
      {isAdmin && adminTab === "kamar_kelas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              Plotting Rombongan Belajar (Kelas)
            </h3>
            <p className="text-xs text-slate-500">Kapasitas rombel jenjang Wustha dan Ulya di pesantren.</p>
            <div className="space-y-2 pt-2">
              {["Ulya 2 (SMA)", "Ulya 1 (SMA)", "Wustha 3 (SMP)", "Wustha 2 (SMP)", "Wustha 1 (SMP)"].map((cls, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{cls}</span>
                  <span className="font-bold text-emerald-700">32 Santri (Optimal)</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Home className="w-4 h-4 text-teal-600" />
              Penataan Kamar Asrama Mukim
            </h3>
            <p className="text-xs text-slate-500">Distribusi tempat tidur asrama gedung Al-Faruq & Ash-Shiddiq.</p>
            <div className="space-y-2 pt-2">
              {["Kamar Abu Bakar (A-01)", "Kamar Umar Bin Khattab (A-02)", "Kamar Utsman Bin Affan (A-03)", "Kamar Ali Bin Abi Thalib (A-04)"].map((rm, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{rm}</span>
                  <span className="font-bold text-teal-700">10 / 10 Santri (Penuh)</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ================= TABEL DIREKTORI UTAMA (ADMIN DIREKTORI & OWNER DIREKTORI) ================= */}
      {(!isGuru && ((isAdmin && adminTab === "direktori") || (isOwner && ownerMainTab === "direktori") || isKesantrian)) && (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama santri, NIS, kelas, kamar, wali..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="AKTIF">Aktif</option>
                <option value="IZIN">Izin</option>
                <option value="SAKIT">Sakit</option>
                <option value="ALUMNI">Alumni</option>
              </select>

              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">Semua Kelas</option>
                <option value="Ulya 2">Ulya 2 (SMA)</option>
                <option value="Ulya 1">Ulya 1 (SMA)</option>
                <option value="Wustha 3">Wustha 3 (SMP)</option>
                <option value="Wustha 2">Wustha 2 (SMP)</option>
                <option value="Wustha 1">Wustha 1 (SMP)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Menampilkan <b>{filteredStudents.length}</b> dari <b>{students.length}</b> santri terdaftar
            </span>
          </div>

          {/* Student Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredStudents.map((std) => (
              <Card
                key={std.id}
                className="p-4 hover:border-emerald-400 hover:shadow-md transition-all space-y-3 relative group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      {std.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {std.name}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-400">NIS: {std.nis}</p>
                    </div>
                  </div>

                  <Badge
                    variant={std.status === "AKTIF" ? "success" : std.status === "IZIN" ? "warning" : "default"}
                    className="text-[10px]"
                  >
                    {std.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-xl bg-slate-50 text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Kelas</span>
                    <span className="font-semibold text-slate-800 truncate block">{std.className}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Kamar</span>
                    <span className="font-semibold text-slate-800 truncate block">{std.roomName}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                  <span className="truncate max-w-[170px]">Hafalan: {std.hifzProgress}</span>

                  <div className="flex items-center gap-1.5">
                    {/* Admin Specific Action: Quick Edit */}
                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingStudent(std);
                          setIsEditModalOpen(true);
                        }}
                        className="px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Edit Data Santri"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSelectedStudent(std);
                        setActiveDossierTab("ringkasan");
                      }}
                      className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
                    >
                      {isOwner ? "Rapor Dossier &rarr;" : "Detail &rarr;"}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ================= BENDAHARA VIEW: DIREKTORI KEUANGAN & STATUS SPP SANTRI ================= */}
      {isBendahara && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari santri, NIS, kelas, wali..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={tuitionFilter}
                onChange={(e) => setTuitionFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
              >
                <option value="ALL">Semua Status SPP</option>
                <option value="LUNAS">Status: LUNAS</option>
                <option value="MENUNGGAK">Status: MENUNGGAK</option>
              </select>
            </div>
          </div>

          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nama Santri</th>
                    <th className="py-3 px-4">NIS</th>
                    <th className="py-3 px-4">Kelas & Kamar</th>
                    <th className="py-3 px-4">Status SPP</th>
                    <th className="py-3 px-4">Tunggakan</th>
                    <th className="py-3 px-4">Wali & WhatsApp</th>
                    <th className="py-3 px-4 text-center">Aksi Bendahara</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter((std) => {
                      const q = searchQuery.toLowerCase();
                      const matchQ = !q || std.name.toLowerCase().includes(q) || std.nis.includes(q) || std.className.toLowerCase().includes(q);
                      const matchStatus = tuitionFilter === "ALL" || std.tuitionStatus === tuitionFilter;
                      return matchQ && matchStatus;
                    })
                    .map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">{std.name}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{std.nis}</td>
                        <td className="py-3 px-4 text-slate-700">{std.className} • {std.roomName}</td>
                        <td className="py-3 px-4">
                          <Badge variant={std.tuitionStatus === "LUNAS" ? "success" : "danger"} className="text-[10px] font-bold">
                            {std.tuitionStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {std.tuitionStatus === "MENUNGGAK" ? (
                            <span className="text-rose-600 font-mono">{formatRupiah(std.tuitionDue || 500000)}</span>
                          ) : (
                            <span className="text-emerald-700 font-mono">Rp 0 (Lunas)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{std.guardianName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{std.guardianPhone}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleSendWhatsAppReminder(std)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] flex items-center gap-1 border border-emerald-200 transition-colors"
                              title="Kirim Pesan Pengingat Tagihan WhatsApp"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>Ingatkan WA</span>
                            </button>
                            <Link
                              href={`/dashboard/finance?tab=kasir&action=bayar&santri=${encodeURIComponent(std.name)}`}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                              title="Buka Kasir Pembayaran Tunai / Transfer"
                            >
                              <CreditCard className="w-3 h-3 text-emerald-400" />
                              <span>Kasir POS</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ================= WALI SANTRI VIEW: PORTAL PROFIL & DOKUMEN ANANDA ================= */}
      {isWali && (
        <div className="space-y-6 animate-in fade-in">
          {/* Child Selection Header Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white shadow-xl border border-emerald-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg border border-white/20 shrink-0">
                {(students[0]?.name || "A")[0]}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    {students[0]?.name || "Ahmad Fauzan"}
                  </h3>
                  <Badge variant="success" className="text-[10px] bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                    Santri Aktif Mukim
                  </Badge>
                </div>
                <p className="text-xs text-slate-300">
                  NIS: <span className="font-mono font-semibold text-emerald-300">{students[0]?.nis || "20260021"}</span> • {students[0]?.className || "Kelas Ulya 2"}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-teal-400" />
                  <span>{students[0]?.roomName || "Kamar Abu Bakar (Gedung Al-Faruq)"}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setSelectedStudentForDoc(students[0] || null);
                  setDocModal("KTS");
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Kartu Pelajar (KTS Digital)</span>
              </button>
              <button
                onClick={() => {
                  setSelectedStudentForDoc(students[0] || null);
                  setDocModal("SURAT_AKTIF");
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-teal-300" />
                <span>Surat Aktif Belajar</span>
              </button>
            </div>
          </div>

          {/* Wali Child Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
            <button
              onClick={() => setWaliChildTab("kts")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                waliChildTab === "kts" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Kartu Santri (KTS)</span>
            </button>
            <button
              onClick={() => setWaliChildTab("biodata")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                waliChildTab === "biodata" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Biodata Lengkap</span>
            </button>
            <button
              onClick={() => setWaliChildTab("rapor")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                waliChildTab === "rapor" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Rapor Nilai KBM</span>
            </button>
            <button
              onClick={() => setWaliChildTab("tahfizh")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                waliChildTab === "tahfizh" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Capaian Hafalan</span>
            </button>
            <button
              onClick={() => setWaliChildTab("spp")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
                waliChildTab === "spp" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Status Pembayaran SPP</span>
            </button>
          </div>

          {/* TAB 1: KTS CARD PREVIEW */}
          {waliChildTab === "kts" && (
            <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-3xl border border-slate-200 space-y-4">
              <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-5 border border-emerald-500/30 relative">
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                      S
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold tracking-tight leading-none">{tenantName}</h4>
                      <p className="text-[9px] text-emerald-300">KARTU TANDA SANTRI (KTS)</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-[8px] bg-emerald-400/20 text-emerald-200 border-0">
                    2026/2027
                  </Badge>
                </div>

                <div className="flex items-center gap-4 py-4">
                  <div className="w-16 h-20 rounded-xl bg-slate-800 border-2 border-emerald-400 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-inner">
                    {(students[0]?.name || "A")[0]}
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <p className="font-bold text-sm text-white">{students[0]?.name || "Ahmad Fauzan"}</p>
                    <p className="text-[11px] text-slate-300 font-mono">NIS: {students[0]?.nis || "20260021"}</p>
                    <p className="text-[10px] text-emerald-300">{students[0]?.className || "Kelas Ulya 2 (SMA)"}</p>
                    <p className="text-[10px] text-slate-400">{students[0]?.roomName || "Kamar Abu Bakar"}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-300">
                  <div className="font-mono">
                    BARCODE: *{students[0]?.nis || "20260021"}*
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">Pengasuh Pondok</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedStudentForDoc(students[0] || null);
                    setDocModal("KTS");
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Unduh KTS HD</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BIODATA LENGKAP */}
          {waliChildTab === "biodata" && (
            <Card className="p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Biodata Pribadi & Kontak Darurat Santri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400">Nama Lengkap</span>
                  <p className="font-bold text-slate-900">{students[0]?.name || "Ahmad Fauzan"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Nomor Induk Santri (NIS / NISN)</span>
                  <p className="font-mono font-bold text-slate-900">{students[0]?.nis || "20260021"} / 0082918291</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Tempat, Tanggal Lahir</span>
                  <p className="font-semibold text-slate-800">Semarang, 14 Mei 2009</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Alamat Tempat Tinggal</span>
                  <p className="font-semibold text-slate-800">Jl. Pemuda No. 45, Semarang, Jawa Tengah</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Nama Orang Tua / Wali</span>
                  <p className="font-semibold text-slate-800">{students[0]?.guardianName || "Bpk. Rahmat Santoso"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Nomor Telepon / WhatsApp Wali</span>
                  <p className="font-mono font-semibold text-slate-800">{students[0]?.guardianPhone || "081234567890"}</p>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: RAPOR NILAI */}
          {waliChildTab === "rapor" && (
            <Card className="p-0 overflow-hidden border-slate-200">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Lembar Hasil Belajar (Rapor KBM Semester Ganjil)</h3>
                  <p className="text-[11px] text-slate-500">Mata Pelajaran Madrasah Diniyah Pondok Pesantren</p>
                </div>
                <Badge variant="success" className="text-xs font-bold">Rata-rata: 90.0 (Mumtaz)</Badge>
              </div>
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-white text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Mata Pelajaran & Kitab</th>
                    <th className="py-3 px-4 text-center">UH</th>
                    <th className="py-3 px-4 text-center">UTS</th>
                    <th className="py-3 px-4 text-center">UAS</th>
                    <th className="py-3 px-4 text-center">Nilai Akhir</th>
                    <th className="py-3 px-4">Predikat</th>
                    <th className="py-3 px-4">Catatan Ustadz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {academicGrades.slice(0, 3).map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900">{g.subject}</td>
                      <td className="py-3 px-4 text-center font-mono">{g.uh}</td>
                      <td className="py-3 px-4 text-center font-mono">{g.uts}</td>
                      <td className="py-3 px-4 text-center font-mono">{g.uas}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-emerald-700">{g.finalGrade}</td>
                      <td className="py-3 px-4">
                        <Badge variant="success" className="text-[10px]">{g.predicate}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">{g.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {/* TAB 4: TAHFIZH */}
          {waliChildTab === "tahfizh" && (
            <Card className="p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Catatan Mutaba'ah Tahfizh Al-Qur'an Ananda
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
                  <span className="text-[11px] font-semibold text-emerald-800">Capaian Ziyadah</span>
                  <p className="text-xl font-bold text-emerald-950">5 Juz 14 Halaman</p>
                  <p className="text-[10px] text-emerald-700">Juz 29, Surah Al-Mulk s/d Al-Haqqah</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-100 text-center space-y-1">
                  <span className="text-[11px] font-semibold text-teal-800">Khatam Muraja'ah</span>
                  <p className="text-xl font-bold text-teal-950">Juz 30 Mutqin</p>
                  <p className="text-[10px] text-teal-700">Lulus Ujian Tasmi' Bil Ghaib</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-center space-y-1">
                  <span className="text-[11px] font-semibold text-amber-800">Nilai Rata-rata Tajwid</span>
                  <p className="text-xl font-bold text-amber-950">Mumtaz (A)</p>
                  <p className="text-[10px] text-amber-700">Disimak oleh Ustadz Fatih Al-Banjari</p>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 5: SPP */}
          {waliChildTab === "spp" && (
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Riwayat Pembayaran SPP & Kewajiban Santri</h3>
                  <p className="text-xs text-slate-500">Kewajiban SPP Syahriyah dan Uang Makan Katering</p>
                </div>
                <Link
                  href="/dashboard/finance"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Buka Portal Pembayaran &rarr;
                </Link>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                <div className="p-3.5 bg-white flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">SPP Syahriyah September 2026</p>
                    <p className="text-[11px] text-slate-500">Dibayarkan 10 September 2026 via Kasir Tunai</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-slate-900 block">Rp 500.000</span>
                    <Badge variant="success" className="text-[10px]">LUNAS</Badge>
                  </div>
                </div>
                <div className="p-3.5 bg-white flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">Uang Makan & Katering September 2026</p>
                    <p className="text-[11px] text-slate-500">Dibayarkan 10 September 2026 via Transfer Bank</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-slate-900 block">Rp 450.000</span>
                    <Badge variant="success" className="text-[10px]">LUNAS</Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ================= MODAL INPUT / EDIT NILAI SANTRI (GURU ONLY) ================= */}
      {isScoreModalOpen && editingGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-300" />
                  Penilaian KBM: {editingGrade.studentName}
                </h3>
                <p className="text-[11px] text-emerald-200 mt-0.5">{editingGrade.className} • {editingGrade.subject}</p>
              </div>
              <button
                onClick={() => {
                  setIsScoreModalOpen(false);
                  setEditingGrade(null);
                }}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bobot Perhitungan Rapor</span>
                <span className="font-semibold text-slate-800 text-[11px]">Nilai Akhir = (30% UH) + (30% UTS) + (40% UAS). KKM = 75.</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Nilai UH (30%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editingGrade.uh}
                    onChange={(e) => setEditingGrade({ ...editingGrade, uh: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-center text-sm font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Nilai UTS (30%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editingGrade.uts}
                    onChange={(e) => setEditingGrade({ ...editingGrade, uts: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-center text-sm font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Nilai UAS (40%) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={editingGrade.uas}
                    onChange={(e) => setEditingGrade({ ...editingGrade, uas: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-center text-sm font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Penilaian Sikap & Adab Belajar
                </label>
                <select
                  value={editingGrade.adab}
                  onChange={(e) =>
                    setEditingGrade({
                      ...editingGrade,
                      adab: e.target.value as "Sangat Baik (A)" | "Baik (B)" | "Cukup (C)",
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Sangat Baik (A)">Sangat Baik (A) - Tawadhu, tertib, bawa kitab lengkap</option>
                  <option value="Baik (B)">Baik (B) - Disiplin dan mematuhi tata tertib KBM</option>
                  <option value="Cukup (C)">Cukup (C) - Perlu peningkatan konsentrasi belajar</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Catatan Guru / Catatan Remedial
                </label>
                <textarea
                  rows={3}
                  value={editingGrade.notes}
                  onChange={(e) => setEditingGrade({ ...editingGrade, notes: e.target.value })}
                  placeholder="Berikan catatan perkembangan belajar santri..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsScoreModalOpen(false);
                    setEditingGrade(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Nilai Santri</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DETAIL MODAL PROFIL / DOSSIER SANTRI ================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-start justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-white/20 text-white font-extrabold text-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{selectedStudent.name}</h3>
                    <Badge variant="success" className="text-[10px] bg-emerald-500/30 text-emerald-200 border-none">
                      {selectedStudent.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-emerald-200 font-mono">
                    NIS: {selectedStudent.nis} • {selectedStudent.className}
                  </p>
                  <p className="text-xs text-emerald-100/90">{selectedStudent.roomName}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Tab Switcher - 10 Pillars of Student 360 (Section 10) */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto">
              {[
                { id: "ringkasan", label: "Biodata", icon: <Users className="w-3.5 h-3.5" /> },
                { id: "wali", label: "Wali Santri", icon: <Phone className="w-3.5 h-3.5" /> },
                { id: "akademik", label: "Akademik & Rapor", icon: <GraduationCap className="w-3.5 h-3.5" /> },
                { id: "tahfizh", label: "Tahfizh Al-Qur'an", icon: <BookOpen className="w-3.5 h-3.5" /> },
                { id: "absensi", label: "Presensi & Kehadiran", icon: <CalendarCheck className="w-3.5 h-3.5" /> },
                { id: "kedisiplinan", label: "Kedisiplinan & Poin", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                { id: "pembinaan", label: "Pembinaan & Konseling", icon: <HeartHandshake className="w-3.5 h-3.5" /> },
                { id: "perizinan", label: "Perizinan", icon: <FileCheck className="w-3.5 h-3.5" /> },
                ...(!isGuru && !isKesantrian ? [{ id: "keuangan", label: "Keuangan SPP", icon: <CreditCard className="w-3.5 h-3.5" /> }] : []),
                { id: "dokumen", label: "Dokumen & KTS", icon: <QrCode className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveDossierTab(tab.id as any)
                  }
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                    activeDossierTab === tab.id
                      ? "border-emerald-600 text-emerald-700 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body Tab Contents */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {activeDossierTab === "ringkasan" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nama Panggilan</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.nickname}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Jenis Kelamin</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.gender}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Tempat, Tanggal Lahir</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.birthPlace}, {selectedStudent.birthDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Alamat Asal</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.address}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Rombongan Belajar (Kelas)</span>
                      <span className="font-bold text-emerald-800">{selectedStudent.className}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Kamar Asrama Mukim</span>
                      <span className="font-bold text-slate-900">{selectedStudent.roomName}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeDossierTab === "wali" && (
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    Data Orang Tua / Wali Santri Terdaftar
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-500 block">
                        Nama Wali ({selectedStudent.guardianRelation})
                      </span>
                      <span className="font-bold text-slate-900">{selectedStudent.guardianName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">No. WhatsApp Resmi</span>
                      <a
                        href={`https://wa.me/${selectedStudent.guardianPhone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <span>{selectedStudent.guardianPhone}</span>
                        <Send className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {activeDossierTab === "akademik" && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Rapor KBM Semester Ganjil 2026/2027</span>
                      <Badge variant="success">Tuntas KKM</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center pt-1">
                      <div className="p-2 rounded-xl bg-white border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Rata-rata UH</span>
                        <span className="font-bold font-mono text-emerald-700">90.5</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Rata-rata UTS</span>
                        <span className="font-bold font-mono text-emerald-700">92.0</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">Nilai Akhir</span>
                        <span className="font-bold font-mono text-emerald-800 text-sm">91.2 (Mumtaz)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeDossierTab === "tahfizh" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Capaian Ziyadah & Muraja'ah</p>
                      <p className="text-sm font-bold text-emerald-800">{selectedStudent.hifzProgress}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{selectedStudent.hifzDetail}</p>
                    </div>
                    <Badge variant="success">Mumtaz (A)</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 italic text-center">
                    Binaan: Halaqah Utsman Bin Affan (Ustadzah Fatimah, Lc.)
                  </p>
                </div>
              )}

              {activeDossierTab === "absensi" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Tingkat Kehadiran KBM & Shalat</p>
                      <p className="text-base font-bold text-emerald-700">{selectedStudent.attendanceRate}</p>
                      <p className="text-[11px] text-slate-500">Tertib dan disiplin dalam seluruh kegiatan harian.</p>
                    </div>
                    <Badge variant="success">Sangat Disiplin</Badge>
                  </div>
                </div>
              )}

              {activeDossierTab === "kedisiplinan" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">Catatan Pelanggaran & Poin Ta'zir</p>
                      <Badge variant="success">Poin Pelanggaran: 0 (Bersih)</Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Santri tidak memiliki pelanggaran aktif. Menunjukkan perilaku tawadhu dan menjaga adab santri.
                    </p>
                  </div>
                </div>
              )}

              {activeDossierTab === "pembinaan" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-900">Catatan Pembinaan Kesantrian</p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Santri aktif dalam halaqah tarbiyah malam dan menjaga kebersihan kamar asrama dengan predikat memuaskan.
                    </p>
                  </div>
                </div>
              )}

              {activeDossierTab === "perizinan" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Riwayat Izin Terkini</p>
                    <p className="text-xs font-semibold text-slate-800 mt-1">{selectedStudent.recentPermit || "Tidak ada izin aktif / santri mukim di pondok"}</p>
                  </div>
                </div>
              )}

              {activeDossierTab === "keuangan" && !isGuru && !isKesantrian && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Status SPP Syahriyah</p>
                      <p className="text-sm font-bold text-slate-900">
                        {selectedStudent.tuitionStatus === "LUNAS" ? "Lunas Terverifikasi" : "Menunggak"}
                      </p>
                    </div>
                    <Badge variant={selectedStudent.tuitionStatus === "LUNAS" ? "success" : "danger"}>
                      {selectedStudent.tuitionStatus}
                    </Badge>
                  </div>
                </div>
              )}

              {activeDossierTab === "dokumen" && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-emerald-800 text-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-bold">KARTU TANDA SANTRI (KTS)</span>
                      <span className="text-[10px] font-mono">AKTIF 2026</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{selectedStudent.name}</p>
                      <p className="text-[11px] text-emerald-200 font-mono">NIS: {selectedStudent.nis}</p>
                      <p className="text-[10px] text-emerald-100">{selectedStudent.className} • {selectedStudent.roomName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rapor Santri</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL TAMBAH SANTRI BARU (ADMIN ONLY) ================= */}
      {isAddModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Pendaftaran Santri Baru (Meja TU)
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-5 space-y-3 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Nomor Induk Santri (NIS) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newNis}
                    onChange={(e) => setNewNis(e.target.value)}
                    placeholder="Contoh: 20260029"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nama lengkap santri"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Panggilan</label>
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="Panggilan sehari-hari"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Jenis Kelamin</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as "Laki-laki" | "Perempuan")}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Laki-laki">Laki-laki (Santriwan)</option>
                    <option value="Perempuan">Perempuan (Santriwati)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kelas Madrasah</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Ulya 1">Ulya 1 (SMA)</option>
                    <option value="Ulya 2">Ulya 2 (SMA)</option>
                    <option value="Wustha 1">Wustha 1 (SMP)</option>
                    <option value="Wustha 2">Wustha 2 (SMP)</option>
                    <option value="Wustha 3">Wustha 3 (SMP)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kamar Asrama</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder="Kamar A-01"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Orang Tua / Wali</label>
                <input
                  type="text"
                  value={newGuardian}
                  onChange={(e) => setNewGuardian(e.target.value)}
                  placeholder="Nama ayah / ibu / wali santri"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Nomor WhatsApp Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={newGuardianPhone}
                  onChange={(e) => setNewGuardianPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Alamat Rumah Lengkap</label>
                <textarea
                  rows={2}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Jl. Raya No..., Kota/Kabupaten..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                  Simpan Data Santri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT SANTRI (ADMIN ONLY) ================= */}
      {isEditModalOpen && editingStudent && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Data Santri — {editingStudent.name}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="p-5 space-y-3 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kelas Madrasah</label>
                  <select
                    value={editingStudent.className}
                    onChange={(e) => setEditingStudent({ ...editingStudent, className: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Ulya 1">Ulya 1 (SMA)</option>
                    <option value="Ulya 2">Ulya 2 (SMA)</option>
                    <option value="Wustha 1">Wustha 1 (SMP)</option>
                    <option value="Wustha 2">Wustha 2 (SMP)</option>
                    <option value="Wustha 3">Wustha 3 (SMP)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kamar Asrama</label>
                  <input
                    type="text"
                    value={editingStudent.roomName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, roomName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Status Keaktifan</label>
                <select
                  value={editingStudent.status}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, status: e.target.value as "AKTIF" | "IZIN" | "SAKIT" | "ALUMNI" })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="AKTIF">AKTIF (Mukim)</option>
                  <option value="IZIN">IZIN (Pulang Resmi)</option>
                  <option value="SAKIT">SAKIT (Rawat Inap/UKS)</option>
                  <option value="ALUMNI">ALUMNI (Tamat)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Orang Tua / Wali</label>
                <input
                  type="text"
                  value={editingStudent.guardianName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, guardianName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">No. WhatsApp Wali</label>
                <input
                  type="text"
                  value={editingStudent.guardianPhone}
                  onChange={(e) => setEditingStudent({ ...editingStudent, guardianPhone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CETAK KTS RESMI ================= */}
      {docModal === "KTS" && selectedStudentForDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Kartu Tanda Santri (KTS Digital)</h3>
              </div>
              <button
                onClick={() => setDocModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Kartu Fisik Preview */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden border border-emerald-500/30">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-700/50">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">KARTU TANDA SANTRI</p>
                    <p className="text-xs font-extrabold text-white">{tenantName}</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/60 text-emerald-300">
                  AKTIF 2026/2027
                </span>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <div className="w-16 h-20 rounded-xl bg-slate-800 border-2 border-emerald-400/50 flex flex-col items-center justify-center text-emerald-300 shrink-0">
                  <Users className="w-8 h-8 opacity-70" />
                  <span className="text-[8px] mt-1 text-slate-400">PASFOTO</span>
                </div>

                <div className="space-y-1 text-xs min-w-0">
                  <p className="font-extrabold text-sm text-white truncate">{selectedStudentForDoc.name}</p>
                  <p className="text-emerald-200 font-mono text-[11px]">NIS: {selectedStudentForDoc.nis}</p>
                  <p className="text-slate-300 text-[11px]">{selectedStudentForDoc.className}</p>
                  <p className="text-slate-300 text-[11px]">{selectedStudentForDoc.roomName}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-700/50 flex items-center justify-between text-[10px] text-emerald-200">
                <span className="font-mono">||| | |||| | ||| ||||</span>
                <span>SantriOS Digital Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak KTS (Print)</span>
              </button>
              <button
                onClick={() => setDocModal(null)}
                className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CETAK SURAT KETERANGAN AKTIF BELAJAR ================= */}
      {docModal === "SURAT_AKTIF" && selectedStudentForDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Surat Keterangan Aktif Belajar</h3>
              </div>
              <button
                onClick={() => setDocModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Kertas Kop Surat Resmi */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 text-xs space-y-4 font-serif">
              {/* Kop */}
              <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1 font-sans">
                <p className="font-extrabold text-sm text-slate-950 uppercase tracking-wide">PONDOK PESANTREN {tenantName.toUpperCase()}</p>
                <p className="text-[10px] text-slate-600">Sekretariat Tata Usaha • SK Kemenag No. 421/PP/2020</p>
                <p className="text-[9px] text-slate-500">Website: santrios.id • Email: tu@{tenantName.toLowerCase().replace(/\s+/g, "")}.id</p>
              </div>

              {/* Judul */}
              <div className="text-center space-y-0.5 pt-1">
                <p className="font-bold text-xs uppercase tracking-wider underline">SURAT KETERANGAN AKTIF BELAJAR</p>
                <p className="text-[10px] text-slate-500 font-mono">Nomor: 042/TU-PP/SK-AKTIF/IX/2026</p>
              </div>

              {/* Isi */}
              <div className="space-y-2 text-xs leading-relaxed font-sans">
                <p>Yang bertanda tangan di bawah ini Kepala Bagian Tata Usaha Pesantren menerangkan bahwa:</p>
                <div className="pl-4 space-y-1 text-slate-900 font-medium">
                  <p>Nama Lengkap : <span className="font-bold">{selectedStudentForDoc.name}</span></p>
                  <p>Nomor Induk Santri : <span className="font-mono">{selectedStudentForDoc.nis}</span></p>
                  <p>Tempat, Tgl Lahir : {selectedStudentForDoc.birthPlace}, {selectedStudentForDoc.birthDate}</p>
                  <p>Jenjang / Kelas : {selectedStudentForDoc.className}</p>
                  <p>Nama Wali : {selectedStudentForDoc.guardianName}</p>
                  <p>Alamat Asal : {selectedStudentForDoc.address}</p>
                </div>
                <p>
                  Adalah benar-benar santri mukim yang tercatat <b>AKTIF</b> mengikuti kegiatan belajar mengajar (KBM) dan kepengasuhan asrama pada Tahun Ajaran 2026/2027 di Pondok Pesantren {tenantName}.
                </p>
                <p>
                  Surat keterangan ini dibuat dengan sebenarnya untuk dipergunakan sebagaimana mestinya.
                </p>
              </div>

              {/* Tanda Tangan */}
              <div className="pt-4 flex justify-end font-sans">
                <div className="text-center space-y-8 text-xs">
                  <p>Ditetapkan di Pesantren, 19 September 2026</p>
                  <div>
                    <p className="font-bold underline text-slate-950">Ustadz H. Ahmad Syukron, S.Pd.I</p>
                    <p className="text-[10px] text-slate-500">Kepala Tata Usaha Pesantren</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen Resmi</span>
              </button>
              <button
                onClick={() => setDocModal(null)}
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
