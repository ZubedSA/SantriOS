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
} from "lucide-react";
import { RoleSwitcher } from "./components/role-switcher";
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

          {/* 1. BENDAHARA */}
          {session.role.name === "BENDAHARA" && (
            <>
              <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard Kas & Neraca</span>
              </Link>
              <Link href="/dashboard/finance" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Kasir Pembayaran SPP</span>
              </Link>
              <Link href="/dashboard/finance/billing" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Receipt className="w-4 h-4 text-teal-400" />
                <span>Tagihan & Tagihan Massal</span>
              </Link>
              <Link href="/dashboard/finance?tab=pengajuan" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Pengajuan Biaya (Approval)</span>
              </Link>
              <Link href="/dashboard/santri" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Status SPP Santri</span>
              </Link>
              <Link href="/audit" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Audit Mutasi & Kas</span>
              </Link>
            </>
          )}

          {/* 2. GURU (dengan Assignment Tahfizh) */}
          {session.role.name === "GURU" && (
            <>
              <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Jadwal Mengajar & KBM</span>
              </Link>
              <Link href="/dashboard/absensi" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Absensi Cepat KBM</span>
              </Link>
              <Link href="/dashboard/santri?tab=kelas" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Kelas Saya & Rapor Nilai</span>
              </Link>
              <Link href="/dashboard/activities?tab=tahfizh" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Setoran & Halaqah Tahfizh</span>
              </Link>
              <Link href="/dashboard/activities?tab=tugas" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Tugas & Silabus</span>
              </Link>
            </>
          )}

          {/* 3. KESANTRIAN / KEDISIPLINAN */}
          {(session.role.name === "KESANTRIAN" || session.role.name === "MUSYRIF") && (
            <>
              <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Building className="w-4 h-4 text-emerald-400" />
                <span>Dashboard Kesantrian</span>
              </Link>
              <Link href="/dashboard/activities?tab=disiplin" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Pelanggaran & Ta'zir (Poin)</span>
              </Link>
              <Link href="/dashboard/activities?tab=perizinan" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Izin Gerbang & Belum Kembali</span>
              </Link>
              <Link href="/dashboard/absensi" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Presensi Shalat & Ibadah</span>
              </Link>
              <Link href="/dashboard/santri?tab=asrama" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Kamar & Mutasi Asrama</span>
              </Link>
            </>
          )}

          {/* 4. KIAI / PENGASUH (Executive Mode) */}
          {(session.role.name === "KIAI" || session.role.name === "OWNER") && (
            <>
              <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Dashboard Eksekutif</span>
              </Link>
              <Link href="/dashboard?tab=kondisi" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Kondisi Pesantren (Radar)</span>
              </Link>
              <Link href="/dashboard?tab=persetujuan" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Persetujuan & Approval</span>
              </Link>
              <Link href="/dashboard?tab=disposisi" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Disposisi Tugas Kiai</span>
              </Link>
              <Link href="/dashboard/finance" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Keuangan & Arus Kas</span>
              </Link>
              <Link href="/dashboard/activities?tab=tahfizh" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <BookOpen className="w-4 h-4 text-teal-400" />
                <span>Capaian Mutu & Tahfizh</span>
              </Link>
              <Link href="/dashboard/santri" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Direktori Santri 360</span>
              </Link>
              <Link href="/audit" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Audit Trail & Keamanan</span>
              </Link>
            </>
          )}

          {/* 5. ADMIN / TU / SEKRETARIS */}
          {session.role.name === "ADMIN" && (
            <>
              <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Meja Kerja TU</span>
              </Link>
              <Link href="/dashboard/santri" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Data Santri & Wali</span>
              </Link>
              <Link href="/dashboard/santri?tab=dokumen" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Surat & Dokumen Resmi</span>
              </Link>
              <Link href="/dashboard/santri?tab=ppdb" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Building className="w-4 h-4 text-indigo-400" />
                <span>PPDB Santri Baru</span>
              </Link>
              <Link href="/dashboard?tab=disposisi" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <FileCheck className="w-4 h-4 text-amber-400" />
                <span>Tindak Lanjut Disposisi</span>
              </Link>
              <Link href="/dashboard/absensi" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Absensi & Rekap Pondok</span>
              </Link>
              <Link href="/dashboard/activities" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <CalendarCheck className="w-4 h-4 text-sky-400" />
                <span>Agenda & Pengumuman</span>
              </Link>
              <Link href="/modules" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                <Grid className="w-4 h-4 text-purple-400" />
                <span>Katalog Modul Aktif</span>
                <span className="ml-auto text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400">
                  {session.activeModules.length}
                </span>
              </Link>
            </>
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
          <div className="flex items-center gap-2.5 overflow-hidden">
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

      {/* Client Shell for Mobile Navigation Interactivity */}
      <DashboardClientShell role={session.role.name} />
    </div>
  );
}
