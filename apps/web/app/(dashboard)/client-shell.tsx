"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MobileNav, type MobileNavItem } from "@santrios/ui";
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
  ArrowDownCircle,
  FileText,
  Building2,
  Globe,
  Layers,
  GraduationCap,
  Calendar,
  CheckSquare,
  Award,
} from "lucide-react";

interface DashboardClientShellProps {
  role?: string;
}

export default function DashboardClientShell({ role = "OWNER" }: DashboardClientShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getNavItems = (userRole: string): MobileNavItem[] => {
    switch (userRole) {
      case "BENDAHARA":
        return [
          { label: "Dashboard", href: "/dashboard", icon: <CreditCard className="w-5 h-5" /> },
          { label: "Kasir SPP", href: "/dashboard/finance", icon: <CreditCard className="w-5 h-5" /> },
          { label: "Tagihan", href: "/dashboard/finance/billing", icon: <Receipt className="w-5 h-5" /> },
          { label: "Pengajuan", href: "/dashboard/finance/pengajuan", icon: <FileCheck className="w-5 h-5" /> },
          { label: "Laporan", href: "/dashboard/laporan", icon: <FileText className="w-5 h-5" /> },
        ];
      case "GURU":
        return [
          { label: "Jadwal", href: "/dashboard/jadwal", icon: <Calendar className="w-5 h-5" /> },
          { label: "Kelas", href: "/dashboard/kelas", icon: <Users className="w-5 h-5" /> },
          { label: "Absensi", href: "/dashboard/absensi", icon: <CheckSquare className="w-5 h-5" /> },
          { label: "Nilai", href: "/dashboard/nilai", icon: <Award className="w-5 h-5" /> },
          { label: "Tahfizh", href: "/dashboard/tahfizh", icon: <BookOpen className="w-5 h-5" /> },
        ];
      case "KESANTRIAN":
      case "MUSYRIF":
        return [
          { label: "Kesantrian", href: "/dashboard", icon: <Building2 className="w-5 h-5" /> },
          { label: "Disiplin", href: "/dashboard/pelanggaran", icon: <ShieldAlert className="w-5 h-5" /> },
          { label: "Izin", href: "/dashboard/perizinan", icon: <FileCheck className="w-5 h-5" /> },
          { label: "Asrama", href: "/dashboard/asrama", icon: <Home className="w-5 h-5" /> },
          { label: "Prestasi", href: "/dashboard/prestasi", icon: <Award className="w-5 h-5" /> },
        ];
      case "WALI_SANTRI":
        return [
          { label: "Beranda", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
          { label: "Kehadiran", href: "/dashboard/absensi", icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: "Anak Saya", href: "/dashboard/santri", icon: <GraduationCap className="w-5 h-5" /> },
          { label: "SPP", href: "/dashboard/finance", icon: <Receipt className="w-5 h-5" /> },
        ];
      case "SUPER_ADMIN":
        return [
          { label: "Overview", href: "/dashboard", icon: <Globe className="w-5 h-5" /> },
          { label: "Pesantren", href: "/dashboard/santri", icon: <Building2 className="w-5 h-5" /> },
          { label: "Modul", href: "/modules", icon: <Layers className="w-5 h-5" /> },
          { label: "Audit", href: "/audit", icon: <ShieldAlert className="w-5 h-5" /> },
        ];
      case "ADMIN":
        return [
          { label: "Meja TU", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Santri", href: "/dashboard/santri", icon: <Users className="w-5 h-5" /> },
          { label: "Surat", href: "/dashboard/surat", icon: <FileText className="w-5 h-5" /> },
          { label: "Absensi", href: "/dashboard/absensi", icon: <CheckSquare className="w-5 h-5" /> },
          { label: "Disposisi", href: "/dashboard/disposisi", icon: <FileCheck className="w-5 h-5" /> },
        ];
      case "KIAI":
      case "OWNER":
      default:
        return [
          { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Kondisi", href: "/dashboard/kondisi", icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: "Persetujuan", href: "/dashboard/persetujuan", icon: <FileCheck className="w-5 h-5" /> },
          { label: "Laporan", href: "/dashboard/laporan", icon: <FileText className="w-5 h-5" /> },
          { label: "Keuangan", href: "/dashboard/finance", icon: <CreditCard className="w-5 h-5" /> },
        ];
    }
  };

  const navItems = getNavItems(role);

  // Automatically prefetch current role's navigation targets on mount
  useEffect(() => {
    navItems.forEach((item) => {
      try {
        router.prefetch(item.href);
      } catch {}
    });
  }, [navItems, router]);

  return (
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
  );
}
