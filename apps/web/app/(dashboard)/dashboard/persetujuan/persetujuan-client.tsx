"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  CreditCard,
  Building,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";

interface PersetujuanClientProps {
  tenantName: string;
}

export default function PersetujuanClient({ tenantName }: PersetujuanClientProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const [approvals, setApprovals] = useState([
    {
      id: "APP-01",
      title: "Pengadaan Kitab Kuning & Mushaf Al-Qur'an Santri Baru",
      applicant: "Ustadz Ahmad Fauzi (Bagian Akademik)",
      amount: 14500000,
      category: "PENGELUARAN_BESAR",
      date: "20 September 2026",
      status: "PENDING",
      desc: "Pembelian 50 eksemplar Fathul Qorib, Al-Jurumiyah, dan 50 Mushaf Pojok Menara Kudus untuk semester ganjil.",
    },
    {
      id: "APP-02",
      title: "Izin Khusus Santri Mengikuti Kafilah MTQ Nasional",
      applicant: "Ustadz Mansur (Kepala Kesantrian)",
      amount: 0,
      category: "IZIN_KHUSUS",
      date: "19 September 2026",
      status: "PENDING",
      desc: "Dispensasi 7 hari mukim untuk Muhammad Fatih mewakili kafilah provinsi Jawa Tengah di arena MTQ Nasional.",
    },
    {
      id: "APP-03",
      title: "Perbaikan Instalasi Listrik & Pompa Air Asrama Putra",
      applicant: "Bpk. Slamet (Sarpras)",
      amount: 4200000,
      category: "OPERASIONAL",
      date: "18 September 2026",
      status: "DISETUJUI",
      desc: "Penggantian pompa submersible 1 HP yang rusak agar pasokan wudhu santri normal kembali.",
    },
  ]);

  const handleApprove = (id: string) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "DISETUJUI" } : a)));
    setFeedback(`Pengajuan ${id} berhasil disetujui oleh Kiai / Pengasuh.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleReject = (id: string) => {
    setApprovals(approvals.map((a) => (a.id === id ? { ...a, status: "DITOLAK" } : a)));
    setFeedback(`Pengajuan ${id} telah ditolak dengan catatan evaluasi.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-900 text-white text-xs font-semibold shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Executive Approval • Meja Persetujuan Pengasuh</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Persetujuan & Kebijakan Kiai</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Otorisasi pencairan dana besar, dispensasi izin khusus, dan persetujuan kegiatan santri di {tenantName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {approvals.map((a) => (
          <Card key={a.id} className="p-5 space-y-4 border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={a.status === "PENDING" ? "warning" : a.status === "DISETUJUI" ? "success" : "danger"} className="text-[10px]">
                    {a.status}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {a.id}</span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 mt-1.5">{a.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Diajukan oleh: <strong>{a.applicant}</strong> • {a.date}</p>
              </div>

              {a.amount > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nominal Dana</span>
                  <span className="text-base font-extrabold text-emerald-700 font-mono">{formatRupiah(a.amount)}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed">
              {a.desc}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <Badge variant="outline" className="text-[10px]">{a.category.replace("_", " ")}</Badge>

              {a.status === "PENDING" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(a.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tolak</span>
                  </button>
                  <button
                    onClick={() => handleApprove(a.id)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Setujui (Approve)</span>
                  </button>
                </div>
              ) : (
                <span className="font-semibold text-xs text-slate-600">Keputusan telah dicatat</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
