"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Bell,
  AlertTriangle,
  Clock,
  CreditCard,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

interface NotifikasiClientProps {
  tenantName: string;
}

export default function NotifikasiClient({ tenantName }: NotifikasiClientProps) {
  const alerts = [
    {
      id: "NTF-01",
      title: "Peringatan Dini: 1 Santri Terlambat Kembali ke Asrama",
      desc: "Muhammad Fatih (Kelas Ulya 2) belum check-in gerbang hingga pukul 19.00 WIB (Batas izin 17.00 WIB). Kontak wali santri telah dihubungi oleh kesantrian.",
      level: "URGENT",
      date: "20 September 2026, 19.15 WIB",
      category: "KEDISIPLINAN",
    },
    {
      id: "NTF-02",
      title: "Pengajuan Anggaran Pengadaan Kitab Menunggu Persetujuan",
      desc: "Ustadz Ahmad Fauzi mengajukan dana Rp 14.500.000 untuk pembelian kitab kuning santri baru semester ganjil.",
      level: "PERHATIAN",
      date: "20 September 2026, 14.30 WIB",
      category: "KEUANGAN",
    },
    {
      id: "NTF-03",
      title: "Laporan Kemajuan: 38 Santri Telah Menuntaskan 30 Juz Mutqin",
      desc: "Dewan Penguji Tahfizh mengonfirmasi kelulusan tasmi' kubro 2 santri pekan ini dengan predikat Mumtaz.",
      level: "INFO",
      date: "19 September 2026, 10.00 WIB",
      category: "TAHFIZH",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Notifikasi Strategis • Early Warning System</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Notifikasi & Peringatan Strategis</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Pemberitahuan kejadian mendesak, evaluasi kedisiplinan, dan sinyal penting pesantren di {tenantName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {alerts.map((a) => (
          <Card key={a.id} className="p-5 hover:shadow-md transition-all space-y-2 border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Badge variant={a.level === "URGENT" ? "danger" : a.level === "PERHATIAN" ? "warning" : "info"} className="text-[10px]">
                  {a.level}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">{a.date}</span>
              </div>
              <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {a.desc}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
