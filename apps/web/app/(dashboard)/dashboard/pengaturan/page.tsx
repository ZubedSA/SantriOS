import React from "react";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, Badge } from "@santrios/ui";
import {
  Settings,
  Grid,
  ShieldCheck,
  CreditCard,
  Building,
  Bell,
  Sliders,
  CheckCircle2,
  Lock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PengaturanPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const settingsCards = [
    {
      title: "Konfigurasi Modul Pesantren",
      desc: "Aktifkan atau nonaktifkan modul santri, tahfizh, keuangan, dan perizinan.",
      href: "/modules",
      icon: Grid,
      badge: "Modul SaaS",
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Pengaturan Keuangan & Tarif SPP",
      desc: "Atur rekening bank pondok, kategori tagihan, dan metode pembayaran.",
      href: "/dashboard/finance/pengaturan",
      icon: CreditCard,
      badge: "Keuangan",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Profil & Identitas Pesantren",
      desc: "Nama pondok, logo resmi, alamat, kontak WhatsApp, dan domain santrios.id.",
      href: "/dashboard/santri",
      icon: Building,
      badge: "Profil",
      color: "text-sky-600 bg-sky-50",
    },
    {
      title: "Audit Trail & Keamanan Sistem",
      desc: "Log rekaman aktivitas pengguna, riwayat login, dan integritas multi-tenant.",
      href: "/audit",
      icon: ShieldCheck,
      badge: "Keamanan",
      color: "text-rose-600 bg-rose-50",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Pusat Konfigurasi • SantriOS Settings</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Pengaturan Sistem Pesantren</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Kelola preferensi operasional, modul aktif, dan keamanan sistem {session.tenant.name}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link key={idx} href={item.href}>
              <Card className="p-5 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all h-full flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {item.badge}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Buka Konfigurasi</span>
                  <span className="text-emerald-600 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
