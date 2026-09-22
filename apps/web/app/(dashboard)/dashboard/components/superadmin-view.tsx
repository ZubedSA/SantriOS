import React from "react";
import { Card, StatCard, Badge } from "@santrios/ui";
import {
  Globe,
  Building2,
  ShieldCheck,
  Layers,
  Server,
} from "lucide-react";
import Link from "next/link";

interface SuperAdminViewProps {
  userName: string;
}

export function SuperAdminView({ userName }: SuperAdminViewProps) {
  const stats = [
    {
      title: "Pesantren Terdaftar",
      value: "1 Tenant",
      subtitle: "Al-Hikmah Modern",
      icon: <Building2 className="w-5 h-5 text-emerald-600" />,
      trend: { value: "100% Aktif", isPositive: true },
    },
    {
      title: "Status Multi-Tenant",
      value: "Terisolasi",
      subtitle: "Zero Cross-Tenant Leaks",
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
      trend: { value: "Aman", isPositive: true },
    },
    {
      title: "Database Engine",
      value: "Neon PostgreSQL",
      subtitle: "Serverless & Pooled",
      icon: <Server className="w-5 h-5 text-sky-500" />,
      trend: { value: "Optimal", isPositive: true },
    },
    {
      title: "Modul SaaS Aktif",
      value: "13 Modul",
      subtitle: "Core, Santri, Keuangan, dll.",
      icon: <Layers className="w-5 h-5 text-purple-500" />,
      trend: { value: "Siap Pakai", isPositive: true },
    },
  ];

  const tenants = [
    {
      id: "tnt-1",
      name: "Pondok Pesantren Al-Hikmah Modern",
      slug: "al-hikmah",
      city: "Jawa Timur",
      status: "ACTIVE",
      plan: "PRO (Enterprise)",
      totalStudents: 428,
      joinedAt: "12 September 2026",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-sm border border-indigo-500/30">
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>SantriOS SaaS Super Administrator Panel</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {userName} 🛡️
          </h2>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            Pusat pemantauan seluruh pondok pesantren (multi-tenant), lisensi berlangganan, ketersediaan database, dan audit keamanan global.
          </p>
        </div>
      </div>

      {/* KPIs */}
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

      {/* Tenants Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Daftar Tenant Pesantren Terdaftar
          </h3>
          <span className="text-xs text-slate-400">Total: 1 Pesantren</span>
        </div>

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3.5">Nama Pesantren</th>
                  <th className="p-3.5">Domain / Slug</th>
                  <th className="p-3.5">Lokasi</th>
                  <th className="p-3.5">Paket</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">{t.name}</td>
                    <td className="p-3.5 font-mono text-emerald-700">{t.slug}.santrios.id</td>
                    <td className="p-3.5">{t.city}</td>
                    <td className="p-3.5">{t.plan}</td>
                    <td className="p-3.5">
                      <Badge variant="success">{t.status}</Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Link href="/dashboard" className="text-emerald-700 font-semibold hover:underline">
                        Kelola &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
