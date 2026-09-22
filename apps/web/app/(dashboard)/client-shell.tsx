"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { MobileNav, type MobileNavItem, Avatar } from "@santrios/ui";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Grid,
  ShieldAlert,
  CalendarCheck,
  BookOpen,
  Home,
  CheckCircle2,
  FileCheck,
  Receipt,
  FileText,
  Building2,
  Globe,
  Layers,
  Calendar,
  CheckSquare,
  Award,
  X,
  LogOut,
  Building,
  FileSpreadsheet,
  Bell,
  Menu,
} from "lucide-react";

interface DashboardClientShellProps {
  role?: string;
  tenant?: {
    name: string;
    slug: string;
  };
  user?: {
    name: string;
    email: string;
  };
  activeModules?: string[];
}

export default function DashboardClientShell({
  role = "OWNER",
  tenant = { name: "Pesantren SantriOS", slug: "pesantren" },
  user = { name: "Pengguna", email: "user@santrios.id" },
  activeModules = [],
}: DashboardClientShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Listen to custom event to toggle sidebar from mobile top header
  useEffect(() => {
    const handleToggle = () => setIsDrawerOpen((prev) => !prev);
    const handleOpen = () => setIsDrawerOpen(true);
    const handleClose = () => setIsDrawerOpen(false);

    window.addEventListener("toggle-mobile-sidebar", handleToggle);
    window.addEventListener("open-mobile-sidebar", handleOpen);
    window.addEventListener("close-mobile-sidebar", handleClose);

    return () => {
      window.removeEventListener("toggle-mobile-sidebar", handleToggle);
      window.removeEventListener("open-mobile-sidebar", handleOpen);
      window.removeEventListener("close-mobile-sidebar", handleClose);
    };
  }, []);

  // Close drawer on path change
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // 4 Primary Items + 1 Drawer Trigger "Menu"
  const getNavItems = (userRole: string): MobileNavItem[] => {
    const menuActionItem: MobileNavItem = {
      label: "Menu",
      icon: <Grid className="w-5 h-5" />,
      active: isDrawerOpen,
      onClick: () => setIsDrawerOpen(true),
    };

    switch (userRole) {
      case "BENDAHARA":
        return [
          { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Keuangan", href: "/dashboard/finance", icon: <CreditCard className="w-5 h-5" /> },
          { label: "Tagihan", href: "/dashboard/finance/billing", icon: <Receipt className="w-5 h-5" /> },
          { label: "Pengajuan", href: "/dashboard/finance/pengajuan", icon: <FileCheck className="w-5 h-5" /> },
          menuActionItem,
        ];
      case "GURU":
        return [
          { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Jadwal", href: "/dashboard/jadwal", icon: <CalendarCheck className="w-5 h-5" /> },
          { label: "Kelas", href: "/dashboard/kelas", icon: <Users className="w-5 h-5" /> },
          { label: "Absensi", href: "/dashboard/absensi", icon: <CheckSquare className="w-5 h-5" /> },
          menuActionItem,
        ];
      case "KESANTRIAN":
      case "MUSYRIF":
        return [
          { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Santri", href: "/dashboard/santri", icon: <Users className="w-5 h-5" /> },
          { label: "Pelanggaran", href: "/dashboard/pelanggaran", icon: <ShieldAlert className="w-5 h-5" /> },
          { label: "Perizinan", href: "/dashboard/perizinan", icon: <FileCheck className="w-5 h-5" /> },
          menuActionItem,
        ];
      case "WALI_SANTRI":
        return [
          { label: "Beranda", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
          { label: "Santri", href: "/dashboard/santri", icon: <Users className="w-5 h-5" /> },
          { label: "Kehadiran", href: "/dashboard/absensi", icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: "SPP", href: "/dashboard/finance", icon: <CreditCard className="w-5 h-5" /> },
          menuActionItem,
        ];
      case "SUPER_ADMIN":
        return [
          { label: "Overview", href: "/dashboard", icon: <Globe className="w-5 h-5" /> },
          { label: "Pesantren", href: "/dashboard/santri", icon: <Building2 className="w-5 h-5" /> },
          { label: "Modul", href: "/modules", icon: <Layers className="w-5 h-5" /> },
          { label: "Audit", href: "/audit", icon: <ShieldAlert className="w-5 h-5" /> },
          menuActionItem,
        ];
      case "ADMIN":
        return [
          { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Santri", href: "/dashboard/santri", icon: <Users className="w-5 h-5" /> },
          { label: "Surat", href: "/dashboard/surat", icon: <FileText className="w-5 h-5" /> },
          { label: "Perizinan", href: "/dashboard/perizinan", icon: <FileCheck className="w-5 h-5" /> },
          menuActionItem,
        ];
      case "KIAI":
      case "OWNER":
      default:
        return [
          { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Kondisi", href: "/dashboard/kondisi", icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: "Santri", href: "/dashboard/santri", icon: <Users className="w-5 h-5" /> },
          { label: "Persetujuan", href: "/dashboard/persetujuan", icon: <FileCheck className="w-5 h-5" /> },
          menuActionItem,
        ];
    }
  };

  const navItems = getNavItems(role);

  // Automatically prefetch current role's navigation targets on mount
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.href) {
        try {
          router.prefetch(item.href);
        } catch {}
      }
    });
  }, [navItems, router]);

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      {/* Bottom Navigation Bar */}
      <MobileNav
        currentPath={pathname}
        items={navItems}
        onNavigate={(href) => {
          router.push(href);
        }}
        onPrefetch={(href) => {
          try {
            router.prefetch(href);
          } catch {}
        }}
      />

      {/* Mobile Drawer (Slide-Over Navigation matching Desktop Sidebar 100%) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={closeDrawer}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-slate-900 text-white h-full shadow-2xl flex flex-col z-10 select-none animate-in slide-in-from-left duration-200 border-r border-slate-800">
            {/* Pesantren Branding Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white shadow-md shrink-0 text-sm">
                  S
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-xs font-bold text-white truncate tracking-tight">
                    {tenant.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="truncate">{tenant.slug}.santrios.id</span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Badge */}
            <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Mode Akses:</span>
              <span className="font-semibold text-emerald-300 px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-800/60">
                {role}
              </span>
            </div>

            {/* Scrollable Nav Items */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Navigasi Lengkap ({role})
              </div>

              {/* 1. KIAI / OWNER */}
              {(role === "KIAI" || role === "OWNER") && (
                <div className="space-y-1">
                  <Link href="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/dashboard/kondisi" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Kondisi Pesantren</span>
                  </Link>
                  <Link href="/dashboard/santri" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>Santri (Direktori 360)</span>
                  </Link>
                  <Link href="/dashboard/akademik" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Akademik</span>
                  </Link>
                  <Link href="/dashboard/tahfizh" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Tahfizh</span>
                  </Link>
                  <Link href="/dashboard/finance" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <CreditCard className="w-4 h-4 text-teal-400" />
                    <span>Keuangan</span>
                  </Link>
                  <Link href="/dashboard/kesantrian" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Building className="w-4 h-4 text-indigo-400" />
                    <span>Kesantrian</span>
                  </Link>
                  <Link href="/dashboard/persetujuan" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileCheck className="w-4 h-4 text-rose-400" />
                    <span>Persetujuan</span>
                  </Link>
                  <Link href="/dashboard/laporan" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Laporan</span>
                  </Link>
                  <Link href="/dashboard/notifikasi" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Notifikasi</span>
                  </Link>
                  <Link href="/dashboard/pengguna" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Users className="w-4 h-4 text-rose-400" />
                    <span>Manajemen Pengguna</span>
                  </Link>
                  <Link href="/modules" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Grid className="w-4 h-4 text-purple-400" />
                    <span>Pengaturan</span>
                  </Link>
                </div>
              )}

              {/* 2. ADMIN */}
              {role === "ADMIN" && (
                <div className="space-y-2">
                  <Link href="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
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
                      <Link href="/dashboard/santri" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Santri</span>
                      </Link>
                      <Link href="/dashboard/wali-santri" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                        <span>Wali Santri</span>
                      </Link>
                      <Link href="/dashboard/guru-staf" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        <span>Guru & Staff</span>
                      </Link>
                      <Link href="/dashboard/master" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        <span>Master Data</span>
                      </Link>
                      <Link href="/dashboard/pengguna" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
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
                      <Link href="/dashboard/surat" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                        <span>Surat</span>
                      </Link>
                      <Link href="/dashboard/dokumen" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Dokumen</span>
                      </Link>
                      <Link href="/dashboard/perizinan" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>Perizinan</span>
                      </Link>
                      <Link href="/dashboard/disposisi" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
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
                      <Link href="/dashboard/kelas" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        <span>Kelas</span>
                      </Link>
                      <Link href="/dashboard/jadwal" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                        <span>Jadwal</span>
                      </Link>
                      <Link href="/dashboard/absensi" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                        <span>Absensi</span>
                      </Link>
                    </div>
                  </div>

                  {/* PPDB */}
                  <Link href="/dashboard/ppdb" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
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
                      <Link href="/dashboard/finance/billing" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Tagihan</span>
                      </Link>
                      <Link href="/dashboard/finance" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                        <span>Pembayaran</span>
                      </Link>
                    </div>
                  </div>

                  {/* Kegiatan, Pengumuman, Laporan, Pengaturan */}
                  <Link href="/dashboard/kegiatan" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <CalendarCheck className="w-4 h-4 text-cyan-400" />
                    <span>Kegiatan</span>
                  </Link>
                  <Link href="/dashboard/pengumuman" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Pengumuman</span>
                  </Link>
                  <Link href="/dashboard/laporan" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Laporan</span>
                  </Link>
                  <Link href="/modules" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Grid className="w-4 h-4 text-rose-400" />
                    <span>Pengaturan</span>
                  </Link>
                </div>
              )}

              {/* 3. GURU */}
              {role === "GURU" && (
                <div className="space-y-1">
                  <Link href="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/dashboard/jadwal" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <CalendarCheck className="w-4 h-4 text-teal-400" />
                    <span>Jadwal Saya</span>
                  </Link>
                  <Link href="/dashboard/kelas" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>Kelas Saya</span>
                  </Link>
                  <Link href="/dashboard/absensi" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Absensi</span>
                  </Link>
                  <Link href="/dashboard/nilai" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>Nilai</span>
                  </Link>
                  <Link href="/dashboard/tugas" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileCheck className="w-4 h-4 text-indigo-400" />
                    <span>Tugas</span>
                  </Link>
                  <Link href="/dashboard/santri" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Perkembangan Santri</span>
                  </Link>

                  {/* Tahfizh Assignment Group */}
                  <div className="pt-2">
                    <div className="px-3 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-amber-400" />
                      <span>Tahfizh (Assignment)</span>
                    </div>
                    <div className="pl-3 border-l border-amber-500/30 ml-3 space-y-0.5 mt-0.5">
                      <Link href="/dashboard/tahfizh" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>Halaqah Saya</span>
                      </Link>
                      <Link href="/dashboard/tahfizh" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Setoran</span>
                      </Link>
                      <Link href="/dashboard/tahfizh" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                        <span>Murajaah</span>
                      </Link>
                      <Link href="/dashboard/tahfizh" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        <span>Target Hafalan</span>
                      </Link>
                      <Link href="/dashboard/tahfizh" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                        <span>Ujian</span>
                      </Link>
                      <Link href="/dashboard/laporan" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        <span>Laporan</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. BENDAHARA */}
              {role === "BENDAHARA" && (
                <div className="space-y-2">
                  <Link href="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
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
                      <Link href="/dashboard/finance" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Ringkasan Kas</span>
                      </Link>
                      <Link href="/dashboard/finance" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                        <span>Pemasukan</span>
                      </Link>
                      <Link href="/dashboard/finance" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        <span>Pengeluaran</span>
                      </Link>
                      <Link href="/dashboard/finance" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        <span>Kas & Bank</span>
                      </Link>
                    </div>
                  </div>

                  {/* Tagihan Group */}
                  <div className="pt-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Receipt className="w-3 h-3 text-teal-400" />
                      <span>Tagihan SPP</span>
                    </div>
                    <div className="pl-3 border-l border-slate-800 ml-3 space-y-0.5 mt-0.5">
                      <Link href="/dashboard/finance/billing" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                        <span>Daftar Tagihan</span>
                      </Link>
                      <Link href="/dashboard/finance/billing" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Tagihan Massal</span>
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
                      <Link href="/dashboard/finance/pengajuan" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>Pengajuan Belanja</span>
                      </Link>
                    </div>
                  </div>

                  {/* Rekonsiliasi, Anggaran, Laporan, Pengaturan */}
                  <Link href="/dashboard/finance/rekonsiliasi" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Building className="w-4 h-4 text-cyan-400" />
                    <span>Rekonsiliasi Bank</span>
                  </Link>
                  <Link href="/dashboard/finance/anggaran" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Anggaran</span>
                  </Link>
                  <Link href="/dashboard/laporan" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Laporan Keuangan</span>
                  </Link>
                  <Link href="/dashboard/finance/pengaturan" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Grid className="w-4 h-4 text-slate-400" />
                    <span>Pengaturan Keuangan</span>
                  </Link>
                </div>
              )}

              {/* 5. KESANTRIAN / MUSYRIF */}
              {(role === "KESANTRIAN" || role === "MUSYRIF") && (
                <div className="space-y-2">
                  <Link href="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/dashboard/santri" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
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
                      <Link href="/dashboard/pelanggaran" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        <span>Pelanggaran & Poin</span>
                      </Link>
                      <Link href="/dashboard/prestasi" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Prestasi Santri</span>
                      </Link>
                      <Link href="/dashboard/pembinaan" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                        <span>Pembinaan & Ta&apos;zir</span>
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
                      <Link href="/dashboard/perizinan" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                        <span>Pengajuan & Izin Keluar</span>
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
                      <Link href="/dashboard/asrama" onClick={closeDrawer} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        <span>Kamar & Gedung</span>
                      </Link>
                    </div>
                  </div>

                  {/* Kegiatan Santri & Laporan */}
                  <Link href="/dashboard/kegiatan" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <CalendarCheck className="w-4 h-4 text-cyan-400" />
                    <span>Kegiatan Santri</span>
                  </Link>
                  <Link href="/dashboard/laporan" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span>Laporan Kesantrian</span>
                  </Link>
                </div>
              )}

              {/* 6. WALI_SANTRI */}
              {role === "WALI_SANTRI" && (
                <div className="space-y-1">
                  <Link href="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Home className="w-4 h-4 text-emerald-400" />
                    <span>Beranda</span>
                  </Link>
                  <Link href="/dashboard/santri" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>Profil Anak Saya</span>
                  </Link>
                  <Link href="/dashboard/absensi" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Kehadiran & Absensi</span>
                  </Link>
                  <Link href="/dashboard/finance" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <CreditCard className="w-4 h-4 text-amber-400" />
                    <span>Tagihan & Pembayaran SPP</span>
                  </Link>
                  <Link href="/dashboard/tahfizh" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Capaian Mutaba&apos;ah Tahfizh</span>
                  </Link>
                  <Link href="/dashboard/perizinan" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <FileCheck className="w-4 h-4 text-rose-400" />
                    <span>Pengajuan Izin Pulang</span>
                  </Link>
                </div>
              )}

              {/* 7. SUPER_ADMIN */}
              {role === "SUPER_ADMIN" && (
                <div className="space-y-1">
                  <Link href="/dashboard" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>Overview Platform</span>
                  </Link>
                  <Link href="/dashboard/santri" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Building2 className="w-4 h-4 text-teal-400" />
                    <span>Daftar Pesantren</span>
                  </Link>
                  <Link href="/modules" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Manajemen Modul Global</span>
                  </Link>
                  <Link href="/audit" onClick={closeDrawer} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>Audit Trail Keamanan</span>
                  </Link>
                </div>
              )}

              {/* Modul Aktif Pesantren */}
              {activeModules.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Modul Aktif
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {activeModules
                      .filter((k) => k !== "CORE")
                      .slice(0, 5)
                      .map((modKey) => (
                        <div
                          key={modKey}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs text-slate-400"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>{modKey}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </nav>

            {/* Drawer Footer / User Info */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Avatar name={user.name} size="sm" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-white truncate max-w-[140px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    title="Keluar"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
