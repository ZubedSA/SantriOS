"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

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
}

export function AdminView({ tenantName, userName, activeModules, metrics }: AdminViewProps) {
  const [activeModal, setActiveModal] = useState<"KTS" | "SURAT_AKTIF" | null>(null);
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

  const activeStudentsCount = metrics?.activeStudents ?? 428;
  const classroomsCount = metrics?.classroomsCount ?? 12;
  const roomsCount = metrics?.roomsCount ?? 46;
  const pendingPermits = metrics?.pendingPermitsCount ?? 2;

  const stats = [
    {
      title: "Data Santri Aktif",
      value: `${activeStudentsCount} Santri`,
      subtitle: `${metrics?.totalStudents ?? activeStudentsCount} total terdaftar`,
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Live DB", isPositive: true },
    },
    {
      title: "Rombel & Kelas Belajar",
      value: `${classroomsCount} Rombel`,
      subtitle: "Terdata aktif di sistem",
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
      title: "Antrean Berkas PPDB",
      value: "5 Berkas",
      subtitle: "Menunggu verifikasi TU",
      icon: <FileText className="w-5 h-5 text-sky-500" />,
      trend: { value: "Prioritas", isPositive: false },
    },
  ];

  const adminTasks = [
    {
      id: "tsk-1",
      title: "Verifikasi Berkas PPDB Santri Baru",
      desc: "5 calon santri telah mengunggah akta kelahiran dan kartu keluarga.",
      status: "Prioritas",
      action: "Buka Berkas",
    },
    {
      id: "tsk-2",
      title: "Penerbitan Kartu Tanda Santri (KTS)",
      desc: "12 santri baru angkatan 2026 siap cetak kartu identitas resmi ber-barcode.",
      status: "Siap Cetak",
      action: "Cetak KTS",
      onClick: () => setActiveModal("KTS"),
    },
    {
      id: "tsk-3",
      title: "Surat Keterangan Aktif Belajar",
      desc: "Permohonan surat keterangan resmi untuk beasiswa Dinas Pendidikan.",
      status: "Pengajuan",
      action: "Buat Surat",
      onClick: () => setActiveModal("SURAT_AKTIF"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/30">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <Settings className="w-3.5 h-3.5 text-amber-300" />
            <span>Meja Kerja Tata Usaha & Sekretariat Pesantren</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Assalamu&apos;alaikum, Admin {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Pengelolaan data induk santri, penataan kelas & asrama, registrasi santri baru, serta penerbitan surat resmi di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
        </div>
      </div>

      {/* Action Bar: Murni Wewenang Administrasi & Dokumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/dashboard/santri"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Santri Baru (PPDB)</span>
        </Link>
        <Link
          href="/dashboard/santri"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all"
        >
          <Home className="w-4 h-4 text-teal-600" />
          <span>Penataan Kelas & Kamar</span>
        </Link>
        <button
          onClick={() => setActiveModal("KTS")}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all"
        >
          <QrCode className="w-4 h-4 text-sky-600" />
          <span>Cetak KTS Ber-Barcode</span>
        </button>
        <button
          onClick={() => setActiveModal("SURAT_AKTIF")}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all"
        >
          <Printer className="w-4 h-4 text-indigo-600" />
          <span>Surat Keterangan Aktif</span>
        </button>
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

      {/* Agenda & Tasks */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600" />
          Tugas & Pelayanan Surat Tata Usaha
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adminTasks.map((t) => (
            <Card key={t.id} className="p-4 space-y-2.5 hover:border-emerald-200 transition-colors flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant={t.status === "Prioritas" ? "danger" : "default"} className="text-[10px]">
                    {t.status}
                  </Badge>
                  <span className="text-[10px] text-slate-400">Hari ini</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{t.title}</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">{t.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                {t.onClick ? (
                  <button
                    onClick={t.onClick}
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>{t.action}</span>
                    <span>&rarr;</span>
                  </button>
                ) : (
                  <Link
                    href="/dashboard/santri"
                    className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <span>{t.action}</span>
                    <span>&rarr;</span>
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* MODAL 1: CETAK KARTU TANDA SANTRI (KTS) BER-BARCODE */}
      {activeModal === "KTS" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Preview Kartu Tanda Santri (KTS)</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
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
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak KTS (Print)</span>
              </button>
              <button
                onClick={() => setActiveModal(null)}
                className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CETAK SURAT KETERANGAN SANTRI AKTIF BELAJAR */}
      {activeModal === "SURAT_AKTIF" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Surat Keterangan Aktif Belajar</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
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
                  Adalah benar-benar santri mukim yang tercatat **AKTIF** mengikuti kegiatan belajar mengajar (KBM) dan kepengasuhan asrama pada Tahun Ajaran 2026/2027 di Pondok Pesantren {tenantName}.
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
                onClick={() => setActiveModal(null)}
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
