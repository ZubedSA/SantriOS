"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Settings,
  CreditCard,
  Building,
  CheckCircle2,
  Save,
} from "lucide-react";

interface PengaturanKeuanganClientProps {
  tenantName: string;
}

export default function PengaturanKeuanganClient({ tenantName }: PengaturanKeuanganClientProps) {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-950 text-white shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>Konfigurasi Finansial • Rekening & Kanal Pembayaran</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Pengaturan Keuangan</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Pengaturan akun bank penerima SPP, kasir kuitansi, dan nominal iuran santri di {tenantName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4 border-slate-200">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-600" />
            Rekening Bank Penampung SPP & Donasi
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nama Bank</label>
              <input type="text" defaultValue="Bank Syariah Indonesia (BSI)" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nomor Rekening Resmi</label>
              <input type="text" defaultValue="714-8899-221" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono" />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Atas Nama Pemilik Rekening</label>
              <input type="text" defaultValue={`Yayasan Pesantren ${tenantName}`} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-4 border-slate-200">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Kebijakan Nominal SPP & Denda
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Iuran SPP Mukim Standar</label>
              <input type="text" defaultValue="Rp 650.000 / bulan" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold" />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Jatuh Tempo Pembayaran Bulanan</label>
              <input type="text" defaultValue="Tanggal 10 setiap bulan" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white" />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nomor Kontak Kasir (Bukti Transfer WA)</label>
              <input type="text" defaultValue="0821-9988-1122 (Ibu Nurhayati)" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-mono" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
