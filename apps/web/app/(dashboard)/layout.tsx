import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MobileNav, Avatar } from "@santrios/ui";
import {
  LayoutDashboard,
  Grid,
  ShieldAlert,
  LogOut,
  Bell,
  Search,
  Building,
  CheckCircle2,
  Users,
  CreditCard,
  BookOpen,
  CalendarCheck,
  Receipt,
  FileText,
  FileCheck,
  FileSpreadsheet,
} from "lucide-react";
import { RoleSwitcher } from "./components/role-switcher";
import { MobileMenuTrigger } from "./components/mobile-menu-trigger";
import DashboardClientShell from "./client-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white border-r border-slate-800 shrink-0 select-none">
        {/* Pesantren Branding */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white shadow-md">
              S
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white truncate tracking-tight">
                {session.tenant.name}
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{session.tenant.slug}.santrios.id</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-slate-800/70 border border-slate-700/50 text-[11px]">
            <span className="text-slate-400">Peran:</span>
            <span className="font-semibold text-emerald-300">{session.role.name}</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigasi ({session.role.name})
          </div>

          {/* 1. KIAI / PENGASUH (Executive Mode - Section 3.7) */}
          {(session.role.name === "KIAI" || session.role.name === "OWNER") && (
            <div className="space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </Link>
              <Link href="/dashboard/kondisi" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Kondisi Pesantren</span>
              </Link>
              <Link href="/dashboard/santri" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Santri (Direktori 360)</span>
              </Link>
              <Link href="/dashboard/akademik" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Akademik</span>
              </Link>
              <Link href="/dashboard/tahfizh" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Tahfizh</span>
              </Link>
              <Link href="/dashboard/finance" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CreditCard className="w-4 h-4 text-teal-400" />
                <span>Keuangan</span>
              </Link>
              <Link href="/dashboard/kesantrian" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Building className="w-4 h-4 text-indigo-400" />
                <span>Kesantrian</span>
              </Link>
              <Link href="/dashboard/persetujuan" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileCheck className="w-4 h-4 text-rose-400" />
                <span>Persetujuan</span>
              </Link>
              <Link href="/dashboard/laporan" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Laporan</span>
              </Link>
              <Link href="/dashboard/notifikasi" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Notifikasi</span>
              </Link>
              <Link href="/dashboard/pengguna" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-rose-400" />
                <span>Manajemen Pengguna</span>
              </Link>
              <Link href="/modules" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Grid className="w-4 h-4 text-purple-400" />
                <span>Pengaturan</span>
              </Link>
            </div>
          )}

          {/* 2. ADMIN / TU / SEKRETARIS (Administration Mode - Section 4.15) */}
          {session.role.name === "ADMIN" && (
            <div className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard TU</span>
              </Link>

              {/* Data Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-emerald-400" />
                  <span>Data</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/santri" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Santri</span>
                  </Link>
                  <Link href="/dashboard/wali-santri" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Wali Santri</span>
                  </Link>
                  <Link href="/dashboard/guru-staf" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span>Guru & Staff</span>
                  </Link>
                  <Link href="/dashboard/master" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>Master Data</span>
                  </Link>
                  <Link href="/dashboard/pengguna" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Pengguna & Akun</span>
                  </Link>
                </div>
              </div>

              {/* Administrasi Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-teal-400" />
                  <span>Administrasi</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/surat" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Surat</span>
                  </Link>
                  <Link href="/dashboard/dokumen" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Dokumen</span>
                  </Link>
                  <Link href="/dashboard/perizinan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Perizinan</span>
                  </Link>
                  <Link href="/dashboard/disposisi" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Disposisi</span>
                  </Link>
                </div>
              </div>

              {/* Akademik Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarCheck className="w-3 h-3 text-sky-400" />
                  <span>Akademik</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/kelas" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span>Kelas</span>
                  </Link>
                  <Link href="/dashboard/jadwal" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>Jadwal</span>
                  </Link>
                  <Link href="/dashboard/absensi" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Absensi</span>
                  </Link>
                </div>
              </div>

              {/* PPDB */}
              <Link href="/dashboard/ppdb" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Building className="w-4 h-4 text-indigo-400" />
                <span>PPDB</span>
              </Link>

              {/* Keuangan Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3 h-3 text-emerald-400" />
                  <span>Keuangan</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/finance/billing" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Tagihan</span>
                  </Link>
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Pembayaran</span>
                  </Link>
                </div>
              </div>

              {/* Kegiatan, Pengumuman, Laporan, Pengaturan */}
              <Link href="/dashboard/kegiatan" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CalendarCheck className="w-4 h-4 text-cyan-400" />
                <span>Kegiatan</span>
              </Link>
              <Link href="/dashboard/pengumuman" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>Pengumuman</span>
              </Link>
              <Link href="/dashboard/laporan" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Laporan</span>
              </Link>
              <Link href="/modules" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Grid className="w-4 h-4 text-rose-400" />
                <span>Pengaturan</span>
              </Link>
            </div>
          )}

          {/* 3. GURU / USTADZ (Teaching Mode - Section 5 & Section 6) */}
          {session.role.name === "GURU" && (
            <div className="space-y-1">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </Link>
              <Link href="/dashboard/jadwal" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CalendarCheck className="w-4 h-4 text-teal-400" />
                <span>Jadwal Saya</span>
              </Link>
              <Link href="/dashboard/kelas" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Kelas Saya</span>
              </Link>
              <Link href="/dashboard/absensi" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Absensi</span>
              </Link>
              <Link href="/dashboard/nilai" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Nilai</span>
              </Link>
              <Link href="/dashboard/tugas" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                <span>Tugas</span>
              </Link>
              <Link href="/dashboard/santri" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Perkembangan Santri</span>
              </Link>

              {/* Assignment Guru Tahfizh (Section 6) */}
              <div className="pt-2">
                <div className="px-3 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-amber-400" />
                  <span>Tahfizh (Assignment)</span>
                </div>
                <div className="pl-3 border-l border-amber-500/30 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/tahfizh" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Halaqah Saya</span>
                  </Link>
                  <Link href="/dashboard/tahfizh" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Setoran</span>
                  </Link>
                  <Link href="/dashboard/tahfizh" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Murajaah</span>
                  </Link>
                  <Link href="/dashboard/tahfizh" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span>Target Hafalan</span>
                  </Link>
                  <Link href="/dashboard/tahfizh" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>Ujian</span>
                  </Link>
                  <Link href="/dashboard/santri" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>Perkembangan Santri</span>
                  </Link>
                  <Link href="/dashboard/laporan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Laporan</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 4. BENDAHARA (Finance Mode - Section 7.12) */}
          {session.role.name === "BENDAHARA" && (
            <div className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </Link>

              {/* Keuangan Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-3 h-3 text-emerald-400" />
                  <span>Keuangan</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Ringkasan</span>
                  </Link>
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Pemasukan</span>
                  </Link>
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Pengeluaran</span>
                  </Link>
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span>Kas</span>
                  </Link>
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>Bank</span>
                  </Link>
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Transfer</span>
                  </Link>
                </div>
              </div>

              {/* Tagihan Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Receipt className="w-3 h-3 text-teal-400" />
                  <span>Tagihan</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/finance/billing" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Daftar Tagihan</span>
                  </Link>
                  <Link href="/dashboard/finance/billing" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Buat Tagihan</span>
                  </Link>
                  <Link href="/dashboard/finance/billing" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Tagihan Massal</span>
                  </Link>
                  <Link href="/dashboard/finance/billing" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Tunggakan</span>
                  </Link>
                </div>
              </div>

              {/* Pembayaran Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-sky-400" />
                  <span>Pembayaran</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span>Semua Pembayaran</span>
                  </Link>
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Menunggu Verifikasi</span>
                  </Link>
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Terverifikasi</span>
                  </Link>
                  <Link href="/dashboard/finance" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Riwayat</span>
                  </Link>
                </div>
              </div>

              {/* Pengajuan Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-3 h-3 text-amber-400" />
                  <span>Pengajuan</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/finance/pengajuan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Pengajuan Pengeluaran</span>
                  </Link>
                  <Link href="/dashboard/finance/pengajuan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Menunggu Approval</span>
                  </Link>
                  <Link href="/dashboard/finance/pengajuan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Riwayat</span>
                  </Link>
                </div>
              </div>

              {/* Rekonsiliasi, Anggaran, Laporan, Pengaturan */}
              <Link href="/dashboard/finance/rekonsiliasi" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Building className="w-4 h-4 text-cyan-400" />
                <span>Rekonsiliasi</span>
              </Link>
              <Link href="/dashboard/finance/anggaran" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Anggaran</span>
              </Link>
              <Link href="/dashboard/laporan" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Laporan</span>
              </Link>
              <Link href="/dashboard/finance/pengaturan" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Grid className="w-4 h-4 text-slate-400" />
                <span>Pengaturan Keuangan</span>
              </Link>
            </div>
          )}

          {/* 5. KESANTRIAN / KEDISIPLINAN (Section 8.11) */}
          {(session.role.name === "KESANTRIAN" || session.role.name === "MUSYRIF") && (
            <div className="space-y-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </Link>
              <Link href="/dashboard/santri" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Santri</span>
              </Link>

              {/* Kedisiplinan Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  <span>Kedisiplinan</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/pelanggaran" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span>Pelanggaran</span>
                  </Link>
                  <Link href="/dashboard/pelanggaran" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Poin</span>
                  </Link>
                  <Link href="/dashboard/prestasi" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Prestasi</span>
                  </Link>
                  <Link href="/dashboard/pembinaan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Pembinaan</span>
                  </Link>
                  <Link href="/dashboard/tindakan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>Tindakan</span>
                  </Link>
                </div>
              </div>

              {/* Perizinan Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck className="w-3 h-3 text-amber-400" />
                  <span>Perizinan</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/perizinan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Pengajuan</span>
                  </Link>
                  <Link href="/dashboard/perizinan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Persetujuan</span>
                  </Link>
                  <Link href="/dashboard/perizinan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>Belum Kembali</span>
                  </Link>
                  <Link href="/dashboard/perizinan" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>Riwayat</span>
                  </Link>
                </div>
              </div>

              {/* Asrama Group */}
              <div className="pt-1">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3 h-3 text-sky-400" />
                  <span>Asrama</span>
                </div>
                <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                  <Link href="/dashboard/asrama" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    <span>Gedung</span>
                  </Link>
                  <Link href="/dashboard/asrama" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>Kamar</span>
                  </Link>
                  <Link href="/dashboard/asrama" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    <span>Penghuni</span>
                  </Link>
                  <Link href="/dashboard/asrama" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>Mutasi</span>
                  </Link>
                </div>
              </div>

              {/* Kegiatan Santri & Laporan */}
              <Link href="/dashboard/kegiatan" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CalendarCheck className="w-4 h-4 text-cyan-400" />
                <span>Kegiatan Santri</span>
              </Link>
              <Link href="/dashboard/laporan" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Laporan</span>
              </Link>
            </div>
          )}

          {/* Module section */}
          <div className="pt-4 px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Modul Aktif Pesantren
          </div>

          {session.activeModules
            .filter((k) => k !== "CORE")
            .slice(0, 6)
            .map((modKey) => (
              <div
                key={modKey}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{modKey}</span>
              </div>
            ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar name={session.user.name} size="sm" />
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white truncate max-w-[120px]">
                  {session.user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {session.user.email}
                </p>
              </div>
            </div>

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                title="Keluar"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header (hidden on desktop) */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md md:hidden">
          <div className="flex items-center gap-2 overflow-hidden">
            <MobileMenuTrigger />
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white text-xs shadow-sm shrink-0">
              S
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xs font-bold text-slate-900 truncate">
                {session.tenant.name}
              </h2>
              <p className="text-[10px] text-emerald-700 font-medium">
                {session.role.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <RoleSwitcher currentRole={session.role.name} userName={session.user.name} />
            <button className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <Avatar name={session.user.name} size="sm" />
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                title="Keluar"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              SantriOS Multi-Tenant v0.1
            </span>
            <RoleSwitcher currentRole={session.role.name} userName={session.user.name} />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari santri, guru, transaksi..."
                className="w-64 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Client Shell for Mobile Navigation Interactivity & Full Drawer */}
      <DashboardClientShell
        role={session.role.name}
        tenant={{ name: session.tenant.name, slug: session.tenant.slug }}
        user={{ name: session.user.name, email: session.user.email }}
        activeModules={session.activeModules}
      />
    </div>
  );
}
