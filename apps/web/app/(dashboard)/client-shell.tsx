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
          { label: "Kas & Neraca", href: "/dashboard", icon: <CreditCard className="w-5 h-5" /> },
          { label: "Kasir SPP", href: "/dashboard/finance", icon: <CreditCard className="w-5 h-5" /> },
          { label: "Tagihan", href: "/dashboard/finance/billing", icon: <Receipt className="w-5 h-5" /> },
          { label: "Audit", href: "/audit", icon: <ShieldAlert className="w-5 h-5" /> },
        ];
      case "GURU":
        return [
          { label: "Jadwal", href: "/dashboard", icon: <Calendar className="w-5 h-5" /> },
          { label: "Absen KBM", href: "/dashboard/absensi", icon: <CheckSquare className="w-5 h-5" /> },
          { label: "Nilai & Rapor", href: "/dashboard/santri", icon: <BookOpen className="w-5 h-5" /> },
          { label: "Tahfizh", href: "/dashboard/activities?tab=tahfizh", icon: <Award className="w-5 h-5" /> },
        ];
      case "KESANTRIAN":
      case "MUSYRIF":
        return [
          { label: "Asrama", href: "/dashboard", icon: <Home className="w-5 h-5" /> },
          { label: "Shalat", href: "/dashboard/absensi", icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: "Izin Gerbang", href: "/dashboard/activities?tab=perizinan", icon: <FileCheck className="w-5 h-5" /> },
          { label: "Ta'zir", href: "/dashboard/activities?tab=disiplin", icon: <ShieldAlert className="w-5 h-5" /> },
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
          { label: "Dokumen", href: "/dashboard/santri?tab=dokumen", icon: <FileText className="w-5 h-5" /> },
          { label: "Absensi", href: "/dashboard/absensi", icon: <CheckSquare className="w-5 h-5" /> },
        ];
      case "OWNER":
      default:
        return [
          { label: "Eksekutif", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
          { label: "Keuangan", href: "/dashboard/finance", icon: <CreditCard className="w-5 h-5" /> },
          { label: "Absensi", href: "/dashboard/absensi", icon: <CheckCircle2 className="w-5 h-5" /> },
          { label: "Santri", href: "/dashboard/santri", icon: <Users className="w-5 h-5" /> },
          { label: "Mutu", href: "/dashboard/activities", icon: <BookOpen className="w-5 h-5" /> },
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
