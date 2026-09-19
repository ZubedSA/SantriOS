"use client";

import React from "react";
import { Card, StatCard, Badge } from "@santrios/ui";
import {
  CreditCard,
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText,
  AlertTriangle,
  Send,
  PlusCircle,
  Wallet,
  Clock,
  CheckCircle2,
  Printer,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@santrios/utils";

interface BendaharaViewProps {
  tenantName: string;
  userName: string;
  metrics?: {
    totalStudents: number;
    activeStudents: number;
    financialSummary: { income: number; expense: number; balance: number; unpaid: number };
    recentTransactions: any[];
  };
}

export function BendaharaView({ tenantName, userName, metrics }: BendaharaViewProps) {
  const fin = metrics?.financialSummary;
  const stats = [
    {
      title: "Saldo Kas Utama",
      value: fin ? formatRupiah(fin.balance) : "Rp 142.8 jt",
      subtitle: "Buku kas operasional",
      icon: <Wallet className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Live DB", isPositive: true },
    },
    {
      title: "Penerimaan SPP Bulan Ini",
      value: fin ? formatRupiah(fin.income) : "Rp 64.5 jt",
      subtitle: "Pemasukan tercatat",
      icon: <ArrowUpCircle className="w-5 h-5 text-teal-600" />,
      trend: { value: "Terverifikasi", isPositive: true },
    },
    {
      title: "Tunggakan Belum Lunas",
      value: fin ? formatRupiah(fin.unpaid) : "Rp 12.3 jt",
      subtitle: "Piutang tagihan aktif",
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      trend: { value: "Perlu ditagih", isPositive: false },
    },
    {
      title: "Pengeluaran Bulan Ini",
      value: fin ? formatRupiah(fin.expense) : "Rp 28.4 jt",
      subtitle: "Dapur, operasional, gaji",
      icon: <ArrowDownCircle className="w-5 h-5 text-rose-500" />,
      trend: { value: "Terkontrol", isPositive: true },
    },
  ];

  const defaultTransactions = [
    {
      id: "trx-01",
      nis: "20260021",
      name: "Ahmad Fauzan",
      category: "SPP Syahriah (September)",
      amount: 500000,
      type: "IN",
      method: "Tunai Kasir",
      time: "15 menit lalu",
      status: "LUNAS",
    },
    {
      id: "trx-02",
      nis: "20260022",
      name: "Muhammad Ali Al-Fatih",
      category: "Uang Makan & Katering",
      amount: 450000,
      type: "IN",
      method: "Transfer Bank Muamalat",
      time: "45 menit lalu",
      status: "LUNAS",
    },
    {
      id: "trx-03",
      nis: "-",
      name: "Logistik Dapur & Beras",
      category: "Belanja Dapur Santri",
      amount: 4200000,
      type: "OUT",
      method: "Kas Tunai",
      time: "2 jam lalu",
      status: "SELESAI",
    },
    {
      id: "trx-04",
      nis: "20260025",
      name: "Zaidan Al-Ayyubi",
      category: "SPP Syahriah (September)",
      amount: 500000,
      type: "IN",
      method: "QRIS Pesantren",
      time: "3 jam lalu",
      status: "LUNAS",
    },
  ];

  const recentTransactions =
    metrics?.recentTransactions && metrics.recentTransactions.length > 0
      ? metrics.recentTransactions.map((t: any) => ({
          id: t.id,
          nis: t.student?.nis || "-",
          name: t.student?.name || t.category,
          category: t.category,
          amount: t.amount,
          type: t.type === "INCOME" ? "IN" : "OUT",
          method: t.method,
          time: new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" }).format(
            new Date(t.createdAt)
          ),
          status: "LUNAS",
        }))
      : defaultTransactions;

  const overdueStudents = [
    { name: "Bilal Ibnu Rabah", class: "Wustha 3", overdueMonths: 2, totalDue: 1000000, phone: "081234567891" },
    { name: "Fathur Rohman", class: "Ulya 1", overdueMonths: 1, totalDue: 500000, phone: "081234567892" },
    { name: "Usman Dan Fodio", class: "Wustha 1", overdueMonths: 1, totalDue: 500000, phone: "081234567893" },
  ];

  const handleSendWhatsApp = (std: { name: string; class: string; totalDue: number }) => {
    const text = encodeURIComponent(
      `Assalamu'alaikum Wr. Wb.\n\n` +
      `Yth. Bapak/Ibu Wali Santri dari ananda *${std.name}* (${std.class}),\n\n` +
      `Kami dari Bagian Keuangan / Bendahara *${tenantName}* menginformasikan total kewajiban SPP yang belum terselesaikan sebesar *${formatRupiah(std.totalDue)}*.\n\n` +
      `Pembayaran dapat ditransfer melalui:\n` +
      `🏦 *Bank Syariah Indonesia (BSI)*\n` +
      `No. Rekening: *7123-8899-01*\n` +
      `Atas Nama: *${tenantName} Keuangan*\n\n` +
      `Atau dibayarkan langsung di Meja Kasir Bendahara Pesantren.\n` +
      `Mohon konfirmasi bukti transfer jika sudah melakukan pembayaran.\n\n` +
      `Jazakumullahu khairan katsiran.\nWassalamu'alaikum Wr. Wb.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <Receipt className="w-3.5 h-3.5 text-amber-300" />
            <span>Pusat Keuangan & Kas Pesantren</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Ahlan wa Sahlan, Bendahara {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Kelola pos tagihan santri, kwitansi pembayaran SPP, arus kas operasional, dan rekapitulasi keuangan di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/dashboard/finance?tab=kasir&action=bayar"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Catat Pembayaran</span>
        </Link>
        <Link
          href="/dashboard/finance/billing"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Receipt className="w-4 h-4 text-emerald-600" />
          <span>Buat Tagihan Massal</span>
        </Link>
        <Link
          href="/dashboard/finance?tab=kaskecil&action=pengeluaran"
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <ArrowDownCircle className="w-4 h-4 text-rose-500" />
          <span>Input Kas Keluar</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Printer className="w-4 h-4 text-sky-600" />
          <span>Cetak Laporan Kas</span>
        </button>
      </div>

      {/* Financial KPIs */}
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

      {/* Grid: Transaksi Terakhir & Tunggakan SPP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1-2: Transaksi Arus Kas Terkini */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Buku Kas & Kwitansi Hari Ini
            </h3>
            <Link href="/dashboard/finance" className="text-xs text-emerald-700 font-semibold hover:underline">
              Lihat Seluruh Jurnal &rarr;
            </Link>
          </div>

          <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
            {recentTransactions.map((trx) => (
              <div key={trx.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      trx.type === "IN" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {trx.type === "IN" ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{trx.name}</p>
                    <p className="text-[11px] text-slate-500">{trx.category} • {trx.method}</p>
                    <span className="text-[10px] text-slate-400">{trx.time}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-xs font-bold ${trx.type === "IN" ? "text-emerald-700" : "text-rose-600"}`}>
                    {trx.type === "IN" ? "+" : "-"} {formatRupiah(trx.amount)}
                  </p>
                  <Badge variant={trx.type === "IN" ? "success" : "default"} className="text-[10px] mt-1">
                    {trx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Kolom 3: Santri Perlu Follow Up SPP */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Tunggakan SPP Santri
            </h3>
            <span className="text-xs text-slate-400">Jatuh Tempo</span>
          </div>

          <Card className="p-4 space-y-3">
            <div className="space-y-3">
              {overdueStudents.map((std, i) => (
                <div key={i} className="p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{std.name}</p>
                      <p className="text-[11px] text-slate-500">{std.class} • Nunggak {std.overdueMonths} Bulan</p>
                    </div>
                    <span className="text-xs font-bold text-rose-600">{formatRupiah(std.totalDue)}</span>
                  </div>

                  <button
                    onClick={() => handleSendWhatsApp(std)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors active:scale-95 shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Kirim Pengingat WhatsApp</span>
                  </button>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/finance/billing"
              className="block text-center text-xs font-semibold text-emerald-700 pt-2 hover:underline"
            >
              Lihat Seluruh Daftar Tagihan &rarr;
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
