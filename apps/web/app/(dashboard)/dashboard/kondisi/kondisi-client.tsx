"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Users,
  CreditCard,
  BookOpen,
  Building,
  Clock,
  Printer,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@santrios/utils";

interface KondisiClientProps {
  tenantName: string;
}

export default function KondisiClient({ tenantName }: KondisiClientProps) {
  const radarItems = [
    { title: "Kehadiran Santri Mukim", value: "98.2%", status: "STABIL", note: "420 hadir dari 428 santri", icon: Users, color: "text-emerald-500" },
    { title: "Kehadiran Dewan Guru KBM", value: "100%", status: "STABIL", note: "Semua 12 jadwal KBM hari ini terisi", icon: CheckCircle2, color: "text-teal-500" },
    { title: "Capaian Target Tahfizh", value: "91.4%", status: "STABIL", note: "392 santri mencapai target ziyadah pekanan", icon: BookOpen, color: "text-amber-500" },
    { title: "Likuiditas Kas & Bank", value: formatRupiah(142500000), status: "STABIL", note: "Cadangan operasional aman 3 bulan ke depan", icon: CreditCard, color: "text-emerald-600" },
    { title: "Tingkat Tagihan Tertagih", value: "84.5%", status: "PERHATIAN", note: "Rp 24,5 jt tunggakan SPP dalam penagihan", icon: CreditCard, color: "text-amber-600" },
    { title: "Santri Izin Keluar Pondok", value: "5 Santri", status: "STABIL", note: "2 sakit berobat, 3 keperluan keluarga", icon: Clock, color: "text-sky-500" },
    { title: "Santri Belum Kembali", value: "1 Santri", status: "PERHATIAN", note: "Terlambat 2 jam dari batas izin", icon: AlertTriangle, color: "text-rose-500" },
    { title: "Santri Sakit / Istirahat UKS", value: "3 Santri", status: "STABIL", note: "Dalam pantauan petugas medis pondok", icon: Activity, color: "text-teal-600" },
    { title: "Pelanggaran Berat Pekan Ini", value: "0 Kasus", status: "STABIL", note: "Kondisi adab & ketertiban kondusif", icon: ShieldCheck, color: "text-emerald-500" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Executive Radar • Kondisi Pesantren 9-Parameter</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Kondisi Pesantren (Executive Overview)</h1>
          <p className="text-xs md:text-sm text-teal-100/80 mt-1">
            Ringkasan strategis 9 pilar pondok pesantren untuk Kiai & Dewan Pengasuh {tenantName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {radarItems.map((r, i) => {
          const Icon = r.icon;
          const isWarning = r.status === "PERHATIAN";
          return (
            <Card key={i} className={`p-5 space-y-3 border-slate-200 hover:shadow-md transition-all ${isWarning ? "border-amber-300 bg-amber-50/20" : ""}`}>
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl bg-slate-100 ${r.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <Badge variant={isWarning ? "warning" : "success"} className="text-[10px] font-bold">
                  {r.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{r.title}</h3>
                <p className="text-xl font-extrabold text-slate-900 mt-1">{r.value}</p>
                <p className="text-xs text-slate-600 mt-0.5">{r.note}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
