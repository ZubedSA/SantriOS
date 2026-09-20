"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Building,
  CheckCircle2,
  Search,
  Upload,
  Clock,
  ArrowDownUp,
  AlertTriangle,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";

interface RekonsiliasiClientProps {
  tenantName: string;
}

export default function RekonsiliasiClient({ tenantName }: RekonsiliasiClientProps) {
  const [items, setItems] = useState([
    {
      id: "REC-01",
      bankTrx: "TRF BSI - 20260920-00124 (SPP Ahmad Fauzan)",
      systemTrx: "Kuitansi KW-202609-082 (Ahmad Fauzan - Rp 650.000)",
      amount: 650000,
      date: "20 September 2026",
      status: "COCOK",
    },
    {
      id: "REC-02",
      bankTrx: "QRIS BSI MERCH - Ref #99281726 (Kantin/Koperasi)",
      systemTrx: "POS Kantin Santri - Transaksi 20 Sep",
      amount: 1420000,
      date: "20 September 2026",
      status: "COCOK",
    },
    {
      id: "REC-03",
      bankTrx: "TRF BANK LAIN - Hamba Allah (Tanpa Berita)",
      systemTrx: "Belum Ditemukan Invoice yang Cocok",
      amount: 2500000,
      date: "19 September 2026",
      status: "PERLU_PEMERIKSAAN",
    },
  ]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 text-white shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Audit & Pembukuan • Rekonsiliasi Perbankan</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Rekonsiliasi Bank & Kas</h1>
          <p className="text-xs md:text-sm text-teal-100/80 mt-1">
            Pencocokan mutasi rekening bank pesantren (BSI / Muamalat / Mandiri) dengan buku kas {tenantName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Total Mutasi Cocok" value="98.5%" subtitle="124 dari 126 transaksi" />
        <StatCard title="Perlu Pemeriksaan" value="2 Transaksi" subtitle="Total Rp 3.250.000" />
        <StatCard title="Saldo Bank Terverifikasi" value={formatRupiah(138500000)} subtitle="BSI Syariah Operasional" />
      </div>

      <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mutasi Rekening Bank</th>
                <th className="py-3 px-4">Catatan Sistem SantriOS</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4 text-center">Status Rekonsiliasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{it.bankTrx}</td>
                  <td className="py-3 px-4 text-slate-700">{it.systemTrx}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{formatRupiah(it.amount)}</td>
                  <td className="py-3 px-4 text-slate-500">{it.date}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={it.status === "COCOK" ? "success" : "warning"} className="text-[10px]">
                      {it.status.replace("_", " ")}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
