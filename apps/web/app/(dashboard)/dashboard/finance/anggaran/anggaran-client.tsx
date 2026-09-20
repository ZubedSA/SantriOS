"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  PieChart,
  DollarSign,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";

interface AnggaranClientProps {
  tenantName: string;
}

export default function AnggaranClient({ tenantName }: AnggaranClientProps) {
  const budgets = [
    { name: "Konsumsi & Dapur Santri Mukim", budget: 240000000, realized: 165000000, percent: 68.7 },
    { name: "Honorarium Dewan Asatidz & Karyawan", budget: 380000000, realized: 256000000, percent: 67.3 },
    { name: "Utilitas Listrik, Air, & WiFi Kompleks", budget: 60000000, realized: 41500000, percent: 69.1 },
    { name: "Pemeliharaan Gedung & Sarpras Pondok", budget: 45000000, realized: 22800000, percent: 50.6 },
    { name: "Kegiatan PHBI & Sima'an Kubro", budget: 35000000, realized: 18000000, percent: 51.4 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4" />
            <span>RAB Tahunan • Pengendalian Realisasi Anggaran</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Anggaran & Rencana Biaya (RAB)</h1>
          <p className="text-xs md:text-sm text-emerald-100/80 mt-1">
            Plafon belanja pos operasional, persentase serapan dana, dan sisa anggaran di {tenantName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Pagu Anggaran TA" value={formatRupiah(760000000)} subtitle="Tahun Ajaran 2026/2027" />
        <StatCard title="Total Realisasi s/d Hari Ini" value={formatRupiah(503300000)} subtitle="Serapan 66.2% (Terkendali)" />
        <StatCard title="Sisa Plafon Anggaran" value={formatRupiah(256700000)} subtitle="Aman untuk 4 bulan ke depan" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {budgets.map((b, i) => (
          <Card key={i} className="p-5 space-y-3 border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{b.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pagu: <strong>{formatRupiah(b.budget)}</strong> • Realisasi: <strong className="text-emerald-700">{formatRupiah(b.realized)}</strong>
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-mono font-bold">
                {b.percent}% Terserap
              </Badge>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-600 h-2.5 rounded-full transition-all"
                style={{ width: `${b.percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Sisa Alokasi: <strong className="text-slate-800">{formatRupiah(b.budget - b.realized)}</strong></span>
              <span className="text-emerald-700 font-semibold">Terkendali Sesuai Rencana</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
