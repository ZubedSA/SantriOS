"use client";

import React, { useState, useEffect } from "react";
import { StatCard, Card, Badge } from "@santrios/ui";
import {
  Users,
  UserPlus,
  Home,
  ShieldCheck,
  Grid,
  Clock,
  Sparkles,
  CheckCircle2,
  FileText,
  Settings,
  CalendarCheck,
  Printer,
  Download,
  X,
  Check,
  QrCode,
  GraduationCap,
  Building2,
  PlusCircle,
  FileCheck,
  Phone,
  Send,
  Search,
  BookOpen,
  Award,
  Layers,
  CreditCard,
  Bell,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@santrios/utils";

interface AdminViewProps {
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
  };
  initialTab?: string;
}

export function AdminView({
  tenantName,
  userName,
  activeModules,
  metrics,
  initialTab,
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<
    | "meja_kerja"
    | "surat"
    | "dokumen"
    | "perizinan"
    | "disposisi"
    | "ppdb"
    | "guru_staf"
    | "wali_santri"
    | "master"
    | "kelas"
    | "jadwal"
    | "kegiatan"
    | "pengumuman"
    | "laporan"
  >(
    initialTab === "dokumen"
      ? "dokumen"
      : initialTab === "surat"
      ? "surat"
      : initialTab === "perizinan"
      ? "perizinan"
      : initialTab === "disposisi"
      ? "disposisi"
      : initialTab === "ppdb"
      ? "ppdb"
      : initialTab === "guru" || initialTab === "guru_staf"
      ? "guru_staf"
      : initialTab === "wali" || initialTab === "wali_santri"
      ? "wali_santri"
      : initialTab === "master"
      ? "master"
      : initialTab === "kelas"
      ? "kelas"
      : initialTab === "jadwal"
      ? "jadwal"
      : initialTab === "kegiatan"
      ? "kegiatan"
      : initialTab === "pengumuman"
      ? "pengumuman"
      : initialTab === "laporan"
      ? "laporan"
      : "meja_kerja"
  );

  const [activeModal, setActiveModal] = useState<"KTS" | "SURAT_AKTIF" | "SURAT_PANGGILAN" | "CATAT_BAYAR" | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const validTabs = [
      "meja_kerja",
      "surat",
      "dokumen",
      "perizinan",
      "disposisi",
      "ppdb",
      "guru_staf",
      "wali_santri",
      "master",
      "kelas",
      "jadwal",
      "kegiatan",
      "pengumuman",
      "laporan",
    ];
    if (initialTab && validTabs.includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  // Data Contoh Siswa untuk KTS & Surat
  const [selectedStudentForDoc, setSelectedStudentForDoc] = useState({
    name: "Muhammad Ali Al-Fatih",
    nis: "202601007",
    nisn: "0082918291",
    className: "Kelas Ulya 1",
    roomName: "Kamar Ali Bin Abi Thalib",
    birthPlace: "Semarang",
    birthDate: "14 Mei 2009",
    guardianName: "H. Abdullah Pratama",
    address: "Jl. Pemuda No. 45, Semarang, Jawa Tengah",
  });

  // Disposisi dari Kiai (Section 4.14 of Spec)
  const [adminDispositions, setAdminDispositions] = useState([
    {
      id: "disp-1",
      title: "Siapkan Surat Pemberitahuan Libur Ramadhan & Panduan Santri",
      from: "Kyai KH. Abdullah Munir",
      deadline: "25 September 2026",
      priority: "TINGGI",
      instructions: "Format surat resmi berkop pondok, cantumkan batas akhir penjemputan dan nomor piket asrama.",
      status: "DALAM_PROSES",
    },
    {
      id: "disp-2",
      title: "Verifikasi Berkas 5 Pendaftar PPDB Jalur Prestasi Tahfizh",
      from: "Kyai KH. Abdullah Munir",
      deadline: "22 September 2026",
      priority: "SEDANG",
      instructions: "Cek keaslian sertifikat tahfizh 5 juz dan input jadwal tes sima'an.",
      status: "DALAM_PROSES",
    },
  ]);

  // PPDB Applicants (Section 4.7 of Spec)
  const [ppdbApplicants, setPpdbApplicants] = useState([
    {
      id: "ppdb-01",
      regNo: "PPDB-2026-081",
      name: "Rizky Ramadhan",
      originSchool: "SMP Islam Terpadu Al-Bayan",
      guardian: "Bpk. Bambang Supeno",
      phone: "081234567891",
      status: "LULUS_SELEKSI",
      docsVerified: true,
      selectedClass: "Kelas Ulya 1",
      selectedRoom: "Kamar Abu Bakar",
    },
    {
      id: "ppdb-02",
      regNo: "PPDB-2026-082",
      name: "Farah Diba Azzahra",
      originSchool: "MTs Negeri 1 Kudus",
      guardian: "Ibu Siti Maimunah",
      phone: "081987654321",
      status: "VERIFIKASI_BERKAS",
      docsVerified: false,
      selectedClass: "Kelas Ulya 1",
      selectedRoom: "Kamar Khadijah",
    },
    {
      id: "ppdb-03",
      regNo: "PPDB-2026-083",
      name: "Haidar Ali",
      originSchool: "SDIT Nurul Fikri",
      guardian: "Bpk. Dr. Hendra",
      phone: "085678901234",
      status: "LULUS_SELEKSI",
      docsVerified: true,
      selectedClass: "Kelas Wustha 1",
      selectedRoom: "Kamar Utsman",
    },
  ]);

  // Guru & Staff with Assignments (Section 4.4 & 6.1 of Spec)
  const [teachers, setTeachers] = useState([
    {
      id: "t-1",
      name: "Ustadzah Fatimah, Lc.",
      nip: "GR-2026-004",
      phone: "081234567890",
      roles: ["GURU"],
      assignments: ["GURU_MAPEL", "WALI_KELAS", "GURU_TAHFIZH"],
      classes: "Ulya 1, Wustha 2",
      subject: "Nahwu, Fiqih, Tahfizh Al-Qur'an",
    },
    {
      id: "t-2",
      name: "Ustadz Ridwan, S.Pd.",
      nip: "ADM-2026-001",
      phone: "081398765432",
      roles: ["ADMIN", "GURU"],
      assignments: ["GURU_MAPEL"],
      classes: "Ulya 2",
      subject: "Bahasa Arab & Tata Usaha",
    },
    {
      id: "t-3",
      name: "Ustadz Fatih Al-Banjari",
      nip: "KSN-2026-003",
      phone: "085712345678",
      roles: ["KESANTRIAN"],
      assignments: ["GURU_MAPEL"],
      classes: "Semua Rombel Asrama",
      subject: "Kedisiplinan & Adab Santri",
    },
    {
      id: "t-4",
      name: "Ustadz Syamsul Hadi, S.E.",
      nip: "BND-2026-002",
      phone: "082134567899",
      roles: ["BENDAHARA"],
      assignments: [],
      classes: "-",
      subject: "Keuangan & Akuntansi Pesantren",
    },
  ]);

  // Wali Santri Connected Directory (Section 4.6 of Spec)
  const [guardians] = useState([
    {
      id: "w-1",
      name: "H. Abdullah Pratama",
      phone: "081234567811",
      relation: "Ayah Kandung",
      studentName: "Muhammad Ali Al-Fatih",
      studentNis: "202601007",
      address: "Semarang, Jawa Tengah",
      waVerified: true,
    },
    {
      id: "w-2",
      name: "Bpk. Rahmat Santoso",
      phone: "081987654322",
      relation: "Ayah Kandung",
      studentName: "Ahmad Fauzan",
      studentNis: "20260021",
      address: "Surakarta, Jawa Tengah",
      waVerified: true,
    },
    {
      id: "w-3",
      name: "Ibu Hj. Maryam Salimah",
      phone: "085678901233",
      relation: "Ibu Kandung",
      studentName: "Bilal Ibnu Rabah",
      studentNis: "202601003",
      address: "Yogyakarta",
      waVerified: false,
    },
  ]);

  // Handler Konversi PPDB ke Santri Aktif (Section 4.7)
  const handleConvertPpdbToStudent = (applicantId: string) => {
    const applicant = ppdbApplicants.find((p) => p.id === applicantId);
    if (!applicant) return;

    const generatedNis = `2026${Math.floor(1000 + Math.random() * 9000)}`;
    setPpdbApplicants((prev) =>
      prev.map((p) => (p.id === applicantId ? { ...p, status: "TERDAFTAR_SANTRI" } : p))
    );

    setFeedbackMsg(
      `Alhamdulillah! Calon santri "${applicant.name}" berhasil dikonversi menjadi Santri Aktif dengan NIS: ${generatedNis} (${applicant.selectedClass}).`
    );
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // Handler Selesaikan Disposisi
  const handleCompleteDisposition = (id: string) => {
    setAdminDispositions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "SELESAI" } : d))
    );
    setFeedbackMsg("Tugas disposisi Kiai telah ditandai SELESAI dan dilaporkan kembali.");
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const activeStudentsCount = metrics?.activeStudents ?? 428;
  const classroomsCount = metrics?.classroomsCount ?? 12;
  const roomsCount = metrics?.roomsCount ?? 46;

  const stats = [
    {
      title: "Data Santri Aktif",
      value: `${activeStudentsCount} Santri`,
      subtitle: `${metrics?.totalStudents ?? activeStudentsCount} total terdaftar`,
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Live Database", isPositive: true },
    },
    {
      title: "Rombel & Kelas Belajar",
      value: `${classroomsCount} Rombel`,
      subtitle: "Terdata aktif semester ini",
      icon: <Grid className="w-5 h-5 text-teal-600" />,
      trend: { value: "Aktif", isPositive: true },
    },
    {
      title: "Kapasitas Asrama",
      value: `${roomsCount} Kamar`,
      subtitle: "Kamar santri mukim",
      icon: <Home className="w-5 h-5 text-amber-500" />,
      trend: { value: "Tersedia", isPositive: true },
    },
    {
      title: "Pendaftar PPDB Baru",
      value: `${ppdbApplicants.filter((p) => p.status !== "TERDAFTAR_SANTRI").length} Calon`,
      subtitle: "Menunggu proses TU",
      icon: <GraduationCap className="w-5 h-5 text-sky-500" />,
      trend: { value: "Prioritas", isPositive: false },
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
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            <span>Administration Mode • Tata Usaha & Sekretariat Pesantren</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Assalamu&apos;alaikum, Admin {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Pusat operasional data santri, wali santri, persuratan resmi, penataan kelas & asrama, serta tindak lanjut disposisi Kiai di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
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

      {/* ================= TAB 1: MEJA KERJA TU & DISPOSISI KIAI ================= */}
      {activeTab === "meja_kerja" && (
        <div className="space-y-6">
          {/* Disposisi dari Kiai (Section 4.14 of Spec) */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Tindak Lanjut Amanat & Disposisi Kiai
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminDispositions.map((d) => (
                <Card key={d.id} className="p-4 border-slate-200 space-y-3 flex flex-col justify-between hover:border-emerald-200 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={d.priority === "TINGGI" ? "danger" : "default"} className="text-[10px]">
                        Prioritas {d.priority}
                      </Badge>
                      <span className="text-[10px] text-slate-400">Deadline: {d.deadline}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{d.title}</h4>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      &ldquo;{d.instructions}&rdquo;
                    </p>
                    <p className="text-[10px] text-slate-400">Dari: <strong className="text-slate-600">{d.from}</strong></p>
                  </div>

                  {d.status === "SELESAI" ? (
                    <div className="pt-2 text-center text-xs font-semibold text-emerald-700 border-t border-slate-100 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tuntas Dilaporkan ke Kiai</span>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCompleteDisposition(d.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Tandai Selesai & Lapor Kiai</span>
                      </button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PERSURATAN & DOKUMEN RESMI ================= */}
      {activeTab === "surat" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Generator Surat Resmi & Document Center (Section 4.5)
              </h3>
              <p className="text-xs text-slate-500">
                Penerbitan surat resmi berkop pondok dengan penomoran otomatis terintegrasi data santri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Surat Keterangan Aktif Santri",
                desc: "Untuk beasiswa, keperluan dinas pendidikan, atau bank.",
                action: () => setActiveModal("SURAT_AKTIF"),
                icon: FileText,
                color: "text-emerald-600 bg-emerald-50",
              },
              {
                title: "Kartu Tanda Santri (KTS)",
                desc: "Cetak kartu santri resmi ber-barcode NISN & data kamar.",
                action: () => setActiveModal("KTS"),
                icon: QrCode,
                color: "text-sky-600 bg-sky-50",
              },
              {
                title: "Surat Panggilan Wali Santri",
                desc: "Untuk konsultasi pembinaan akhlak atau administrasi pondok.",
                action: () => setActiveModal("SURAT_PANGGILAN"),
                icon: Phone,
                color: "text-amber-600 bg-amber-50",
              },
              {
                title: "Surat Tugas & Izin Kegiatan",
                desc: "Surat delegasi lomba, musabaqah, atau kegiatan dakwah santri.",
                action: () => {
                  setFeedbackMsg("Format surat tugas resmi dibuka.");
                  setTimeout(() => setFeedbackMsg(null), 3000);
                },
                icon: Award,
                color: "text-purple-600 bg-purple-50",
              },
            ].map((tmpl, idx) => {
              const Icon = tmpl.icon;
              return (
                <Card key={idx} className="p-4 space-y-3 flex flex-col justify-between border-slate-200 hover:border-emerald-300 transition-all">
                  <div className="space-y-2">
                    <div className={`w-9 h-9 rounded-xl ${tmpl.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{tmpl.title}</h4>
                    <p className="text-xs text-slate-500">{tmpl.desc}</p>
                  </div>
                  <button
                    onClick={tmpl.action}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Generate & Cetak</span>
                  </button>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PPDB & VERIFIKASI ================= */}
      {activeTab === "ppdb" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Penerimaan Santri Baru (PPDB 2026/2027)
              </h3>
              <p className="text-xs text-slate-500">
                Verifikasi kelengkapan berkas akta/KK dan konversi 1-klik calon santri lulus menjadi santri aktif.
              </p>
            </div>
            <Link
              href="/dashboard/ppdb"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Buka Modul PPDB &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {ppdbApplicants.map((p) => (
              <Card key={p.id} className="p-4 border-slate-200 space-y-3 hover:shadow-xs transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900">{p.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">No. Reg: {p.regNo}</span>
                      <Badge
                        variant={
                          p.status === "TERDAFTAR_SANTRI"
                            ? "success"
                            : p.status === "LULUS_SELEKSI"
                            ? "default"
                            : "warning"
                        }
                        className="text-[10px]"
                      >
                        {p.status === "TERDAFTAR_SANTRI" ? "Santri Aktif" : p.status === "LULUS_SELEKSI" ? "Lulus Seleksi" : "Verifikasi Berkas"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Asal Sekolah: {p.originSchool} • Wali: {p.guardian} ({p.phone})
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Rencana Rombel: {p.selectedClass} • Asrama: {p.selectedRoom}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {p.status === "LULUS_SELEKSI" ? (
                      <button
                        onClick={() => handleConvertPpdbToStudent(p.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Konversi ke Santri Aktif</span>
                      </button>
                    ) : p.status === "TERDAFTAR_SANTRI" ? (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Sudah Jadi Santri
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setFeedbackMsg(`Berkas calon santri "${p.name}" dinyatakan LENGKAP & VALID.`);
                          setPpdbApplicants((prev) =>
                            prev.map((it) => (it.id === p.id ? { ...it, status: "LULUS_SELEKSI", docsVerified: true } : it))
                          );
                          setTimeout(() => setFeedbackMsg(null), 3000);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold border border-slate-200 transition-all"
                      >
                        Verifikasi Berkas
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: GURU & PENUGASAN (ASSIGNMENT) ================= */}
      {activeTab === "guru_staf" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Direktori Guru & Penugasan Assignment (Section 2 & 6)
              </h3>
              <p className="text-xs text-slate-500">
                Prinsip arsitektur: Role Guru memiliki tugas tambahan (Wali Kelas, Guru Tahfizh, Guru Mapel).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachers.map((t) => (
              <Card key={t.id} className="p-4 border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">NIP: {t.nip} • {t.phone}</p>
                    <p className="text-xs text-slate-600">Mapel: {t.subject}</p>
                  </div>
                  <Badge variant="default" className="text-[10px]">{t.roles.join(", ")}</Badge>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assignment Aktif:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {t.assignments.map((asg) => (
                      <span
                        key={asg}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          asg === "GURU_TAHFIZH"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : asg === "WALI_KELAS"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {asg === "GURU_TAHFIZH" ? "Guru Tahfizh" : asg === "WALI_KELAS" ? "Wali Kelas" : "Guru Mapel"}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: DATA WALI SANTRI & WA ================= */}
      {activeTab === "wali_santri" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-600" />
                Data Induk Wali Santri & Integrasi WhatsApp (Section 4.6)
              </h3>
              <p className="text-xs text-slate-500">
                Hubungkan relasi santri dan wali santri, nomor WhatsApp terverifikasi, serta undangan akun portal.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {guardians.map((w) => (
              <Card key={w.id} className="p-4 border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{w.name}</span>
                      <span className="text-[11px] text-slate-500">({w.relation})</span>
                      <Badge variant={w.waVerified ? "success" : "warning"} className="text-[10px]">
                        {w.waVerified ? "WA Terverifikasi" : "Belum Verifikasi"}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Santri Binaan: <strong>{w.studentName}</strong> (NIS: {w.studentNis})
                    </p>
                    <p className="text-[11px] text-slate-400">Domisili: {w.address} • No. HP: {w.phone}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/${w.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim WA</span>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: MASTER DATA ================= */}
      {activeTab === "master" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Master Data Pesantren (Section 4.4)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Tahun Ajaran & Semester</h4>
              <p className="text-xs text-emerald-700 font-semibold">2026/2027 • Semester Ganjil</p>
              <p className="text-[11px] text-slate-400">Status: Aktif Berjalan</p>
            </Card>
            <Card className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Rombongan Belajar (Kelas)</h4>
              <p className="text-xs text-slate-800 font-semibold">12 Kelas (Ulya & Wustha)</p>
              <p className="text-[11px] text-slate-400">Tiap rombel maksimal 32 santri</p>
            </Card>
            <Card className="p-4 space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Gedung & Kamar Asrama</h4>
              <p className="text-xs text-slate-800 font-semibold">3 Gedung • 46 Kamar</p>
              <p className="text-[11px] text-slate-400">Kapasitas total 460 ranjang</p>
            </Card>
          </div>
        </div>
      )}

      {/* ================= TAB: DOKUMEN CENTER (Section 4.13) ================= */}
      {activeTab === "dokumen" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              Document Center & Arsip Institusi (Section 4.13)
            </h3>
            <button
              onClick={() => alert("Mengunggah arsip dokumen institusi baru...")}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              + Unggah Berkas Arsip
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { name: "SK Pengangkatan Dewan Guru 2026/2027", category: "SK & Legalitas", size: "2.4 MB", date: "15 Juli 2026" },
              { name: "Kurikulum & Silabus Pesantren Formal", category: "Akademik", size: "5.1 MB", date: "20 Agustus 2026" },
              { name: "Data Berkas Akta & KK Santri Baru", category: "Dokumen Santri", size: "18.2 MB", date: "02 September 2026" },
              { name: "SOP Perizinan Keluar Gerbang Pondok", category: "Tata Tertib", size: "1.1 MB", date: "10 Agustus 2026" },
              { name: "Arsip Rekap Nilai Ujian Semester Lalu", category: "Rapor", size: "3.8 MB", date: "25 Juni 2026" },
            ].map((doc, idx) => (
              <Card key={idx} className="p-3.5 space-y-2 border-slate-200">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs text-slate-900 line-clamp-1">{doc.name}</span>
                  <Badge variant="outline" className="text-[10px] shrink-0">{doc.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>{doc.size}</span>
                  <span>{doc.date}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: PERIZINAN ADMINISTRATIF (Section 4.8) ================= */}
      {activeTab === "perizinan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-500" />
              Administrasi & Rekap Perizinan Santri (Section 4.8)
            </h3>
            <Link
              href="/dashboard/perizinan"
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
            >
              Buka Gerbang Keluar &rarr;
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
            <p className="font-semibold text-amber-950">Catatan Operasional TU:</p>
            <p className="text-amber-800">
              Admin bertugas memverifikasi kelengkapan dokumen surat keterangan izin dan mencatat kepulangan/keberangkatan fisik santri.
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB: DISPOSISI KIAI (Section 4.14) ================= */}
      {activeTab === "disposisi" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-rose-500" />
              Tindak Lanjut Disposisi Kiai (Section 4.14)
            </h3>
            <span className="text-xs text-slate-400">Alur: Kiai &rarr; Disposisi &rarr; TU &rarr; Pelaksanaan</span>
          </div>

          <div className="space-y-3">
            {adminDispositions.map((disp) => (
              <Card key={disp.id} className="p-4 space-y-3 border-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{disp.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Dari: <strong>{disp.from}</strong> • Tenggat Waktu: <span className="text-rose-600 font-semibold">{disp.deadline}</span>
                    </p>
                    <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      Instruksi: {disp.instructions}
                    </p>
                  </div>
                  <Badge variant={disp.status === "SELESAI" ? "success" : "warning"} className="text-[10px]">
                    {disp.status}
                  </Badge>
                </div>
                {disp.status !== "SELESAI" && (
                  <button
                    onClick={() => handleCompleteDisposition(disp.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    Tandai Selesai & Laporkan ke Kiai
                  </button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: KELAS & JADWAL ================= */}
      {activeTab === "kelas" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Grid className="w-5 h-5 text-sky-600" />
            Pengelolaan Kelas & Jadwal Pelajaran Pesantren
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {["Ulya 1 (Aliyah Putra)", "Ulya 2 (Aliyah Putri)", "Wustha 1 (Tsanawiyah Putra)", "Wustha 2 (Tsanawiyah Putri)", "Idad Lughawi (Persiapan)"].map((k, i) => (
              <Card key={i} className="p-3.5 space-y-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{k}</span>
                  <Badge variant="success" className="text-[10px]">Aktif</Badge>
                </div>
                <p className="text-[11px] text-slate-500">Kapasitas: 32 Santri • Wali Kelas: Ustadz Fauzan, M.Pd.</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: KEGIATAN & PENGUMUMAN ================= */}
      {(activeTab === "kegiatan" || activeTab === "pengumuman") && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-cyan-600" />
            Agenda Kegiatan & Pengumuman Pesantren
          </h3>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-950 block">Kajian Akbar Kitab Ihya Ulumuddin</span>
              <span className="text-[11px] text-emerald-800">Setiap Ahad Pagi • Masjid Jami Pesantren • PIC: Ustadz Syarif</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-900 block">Jadwal Seleksi Gelombang 2 PPDB</span>
              <span className="text-[11px] text-slate-600">Sabtu, 15 Oktober 2026 • Ruang Aula Utama • PIC: Panitia PPDB</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB: LAPORAN ================= */}
      {activeTab === "laporan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-purple-600" />
              Laporan Administrasi & Rekapitulasi Pondok
            </h3>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap Bulanan</span>
            </button>
          </div>
          <Card className="p-4 space-y-2 border-slate-200 text-xs">
            <p className="font-semibold text-slate-800">Laporan Administrasi Tertib:</p>
            <p className="text-slate-600 leading-relaxed">
              Seluruh berkas santri mukim, surat keterangan resmi, pendaftaran PPDB, dan daftar wali santri tersinkronisasi dalam basis data terpusat.
            </p>
          </Card>
        </div>
      )}

      {/* ================= MODAL CETAK KTS ================= */}
      {activeModal === "KTS" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-sky-600" />
                Cetak Kartu Tanda Santri (KTS)
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Kartu Preview */}
            <div className="rounded-2xl bg-gradient-to-tr from-emerald-800 via-teal-700 to-emerald-900 text-white p-5 space-y-4 shadow-md border border-emerald-600/40">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold tracking-tight uppercase">PONDOK PESANTREN {tenantName}</h4>
                  <p className="text-[10px] text-emerald-200">Kartu Identitas Resmi Santri Mukim</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-bold">
                  S
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-20 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-xl font-bold">
                  {selectedStudentForDoc.name[0]}
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-sm text-white">{selectedStudentForDoc.name}</p>
                  <p className="font-mono text-emerald-200">NIS: {selectedStudentForDoc.nis}</p>
                  <p className="text-[11px] text-emerald-100">{selectedStudentForDoc.className}</p>
                  <p className="text-[10px] text-emerald-200/80">{selectedStudentForDoc.roomName}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Kartu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL SURAT KETERANGAN AKTIF ================= */}
      {activeModal === "SURAT_AKTIF" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Surat Keterangan Santri Aktif
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <p className="font-mono text-[11px] text-slate-500">Nomor: 421/PP-{tenantName.slice(0, 3).toUpperCase()}/IX/2026</p>
              <p className="font-semibold text-slate-800">
                Menerangkan bahwa santri berikut benar-benar aktif belajar di Pesantren {tenantName}:
              </p>
              <div className="pl-3 border-l-2 border-emerald-500 space-y-0.5 text-[11px] text-slate-700">
                <p>Nama: <strong>{selectedStudentForDoc.name}</strong></p>
                <p>NIS/NISN: {selectedStudentForDoc.nis} / {selectedStudentForDoc.nisn}</p>
                <p>Rombel: {selectedStudentForDoc.className}</p>
                <p>Kamar: {selectedStudentForDoc.roomName}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  window.print();
                  setActiveModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Dokumen Resmi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
