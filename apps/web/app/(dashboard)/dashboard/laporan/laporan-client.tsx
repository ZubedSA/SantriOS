"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  FileText,
  CreditCard,
  BookOpen,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

interface LaporanClientProps {
  tenantName: string;
}

export default function LaporanClient({ tenantName }: LaporanClientProps) {
  const [period, setPeriod] = useState("BULANAN");

  const reports = [
    { title: "Laporan Rekapitulasi Keuangan & Arus Kas", cat: "KEUANGAN", icon: CreditCard, ext: "XLSX / PDF", desc: "Pemasukan SPP, donasi, pengeluaran operasional, dan saldo kas/bank." },
    { title: "Laporan Kemajuan Tahfizh & Setoran Santri", cat: "TAHFIZH", icon: BookOpen, ext: "PDF", desc: "Rekap capaian ziyadah juz, muraja'ah, dan daftar santri tertinggal target." },
    { title: "Laporan Presensi KBM & Kehadiran Santri", cat: "AKADEMIK", icon: FileText, ext: "XLSX", desc: "Persentase kehadiran per kelas, izin, sakit, dan alpa harian/bulanan." },
    { title: "Laporan Poin Pelanggaran & Kedisiplinan", cat: "KESANTRIAN", icon: ShieldAlert, ext: "PDF", desc: "Statistik pelanggaran santri, santri terlambat izin, dan rekap ta'zir." },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-purple-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Pusat Laporan Terpadu • Executive & Operational Report</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Laporan & Rekapitulasi</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Unduh laporan berkala keuangan, capaian tahfizh, kehadiran KBM, dan rekap kesantrian {tenantName}.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {["HARIAN", "MINGGUAN", "BULANAN", "SEMESTER", "TAHUNAN"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              period === p ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Periode {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => {
          const Icon = r.icon;
          return (
            <Card key={i} className="p-5 hover:border-purple-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className="text-[10px]">{r.ext}</Badge>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{r.desc}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Format Resmi Pesantren</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 border border-slate-300"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak</span>
                  </button>
                  <button
                    onClick={() => alert(`Mengunduh file: ${r.title} (${period})`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Excel</span>
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
