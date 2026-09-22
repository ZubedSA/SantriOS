"use client";

import React, { useState, useEffect } from "react";
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
  Building,
  Layers,
  X,
  Check,
  Search,
  Share2,
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
  initialTab?: string;
}

export function BendaharaView({
  tenantName,
  userName,
  metrics,
  initialTab,
}: BendaharaViewProps) {
  const [activeTab, setActiveTab] = useState<
    | "ringkasan"
    | "tagihan_massal"
    | "tunggakan"
    | "kasir"
    | "pengajuan"
    | "kas_bank"
    | "rekonsiliasi"
    | "anggaran"
    | "laporan"
    | "pengaturan_keuangan"
  >(
    initialTab === "billing" || initialTab === "tagihan" || initialTab === "tagihan_massal" || initialTab === "massal"
      ? "tagihan_massal"
      : initialTab === "tunggakan"
      ? "tunggakan"
      : initialTab === "kasir" || initialTab === "semua_bayar" || initialTab === "menunggu_verifikasi" || initialTab === "terverifikasi"
      ? "kasir"
      : initialTab === "pengajuan" || initialTab === "menunggu_approval" || initialTab === "riwayat_pengajuan"
      ? "pengajuan"
      : initialTab === "kas" || initialTab === "kas_bank" || initialTab === "bank" || initialTab === "transfer"
      ? "kas_bank"
      : initialTab === "rekonsiliasi"
      ? "rekonsiliasi"
      : initialTab === "anggaran"
      ? "anggaran"
      : initialTab === "laporan"
      ? "laporan"
      : initialTab === "pengaturan_keuangan"
      ? "pengaturan_keuangan"
      : "ringkasan"
  );

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const validTabs = [
      "ringkasan",
      "tagihan_massal",
      "tunggakan",
      "kasir",
      "pengajuan",
      "kas_bank",
      "rekonsiliasi",
      "anggaran",
      "laporan",
      "pengaturan_keuangan",
    ];
    if (initialTab && validTabs.includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  // Modal Cetak Kuitansi State
  const [activeReceiptModal, setActiveReceiptModal] = useState<any | null>(null);

  // Fitur Massal: Buat Tagihan Massal State (Section 7.3 of Spec)
  const [massBillTitle, setMassBillTitle] = useState("SPP & Uang Makan Oktober 2026");
  const [massBillCategory, setMassBillCategory] = useState("SPP");
  const [massBillTarget, setMassBillTarget] = useState("ALL"); // ALL or classroom
  const [massBillAmount, setMassBillAmount] = useState("500000");
  const [massBillDueDate, setMassBillDueDate] = useState("10 Oktober 2026");
  const [massBillCount, setMassBillCount] = useState(428);

  const handleGenerateMassBilling = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(
      `Alhamdulillah! Tagihan Massal "${massBillTitle}" sebesar ${formatRupiah(Number(massBillAmount))} berhasil dibuat untuk ${massBillCount} santri aktif!`
    );
    setTimeout(() => setFeedbackMsg(null), 5000);
  };

  // Pengajuan Pengeluaran ke Kiai (Section 7.6 & 7.7)
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Belanja Dapur Santri");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseList, setExpenseList] = useState([
    {
      id: "exp-1",
      title: "Logistik Beras Dapur Santri (500 Kg)",
      category: "Belanja Dapur Santri",
      amount: 6750000,
      status: "MENUNGGU_APPROVAL_KIAI",
      date: "Hari Ini, 08.00 WIB",
      notes: "Stok beras dapur tersisa 2 hari untuk konsumsi santri.",
    },
    {
      id: "exp-2",
      title: "Pembayaran Tagihan Listrik PLN & Internet Indihome",
      category: "Utilitas & Operasional",
      amount: 4850000,
      status: "DISETUJUI_KIAI",
      date: "Kemarin",
      notes: "Tagihan rutin bulanan gedung asrama & ruang KBM.",
    },
    {
      id: "exp-3",
      title: "Honor Ustadz Pengajar & Karyawan Pesantren",
      category: "Gaji & Honorarium",
      amount: 32000000,
      status: "LUNAS_TERBAYAR",
      date: "01 September 2026",
      notes: "Transfer honorarium 28 ustadz dan 6 staf pondok.",
    },
  ]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount) return;

    const newExp = {
      id: `exp-${Date.now()}`,
      title: expenseTitle,
      category: expenseCategory,
      amount: Number(expenseAmount),
      status: Number(expenseAmount) >= 5000000 ? "MENUNGGU_APPROVAL_KIAI" : "DISETUJUI_KIAI",
      date: "Baru saja",
      notes: expenseDesc || "-",
    };

    setExpenseList([newExp, ...expenseList]);
    setExpenseTitle("");
    setExpenseAmount("");
    setExpenseDesc("");
    setFeedbackMsg(
      Number(expenseAmount) >= 5000000
        ? `Pengajuan "${newExp.title}" diteruskan ke Kiai untuk persetujuan (nominal > Rp 5 jt).`
        : `Pengajuan "${newExp.title}" berhasil dicatat dan siap dicairkan.`
    );
    setTimeout(() => setFeedbackMsg(null), 4500);
  };

  // Santri Menunggak (Section 7.8)
  const [arrearsList] = useState([
    {
      id: "arr-1",
      name: "Ahmad Fauzan",
      nis: "20260021",
      className: "Kelas Ulya 2",
      room: "Kamar Abu Bakar",
      guardian: "Bpk. Rahmat Santoso",
      phone: "081987654322",
      monthsCount: 4,
      totalDue: 2000000,
    },
    {
      id: "arr-2",
      name: "Zaidan Al-Ayyubi",
      nis: "20260025",
      className: "Kelas Wustha 1",
      room: "Kamar Utsman",
      guardian: "Bpk. H. Salman",
      phone: "081234567895",
      monthsCount: 3,
      totalDue: 1500000,
    },
    {
      id: "arr-3",
      name: "Farhan Hakim",
      nis: "20260024",
      className: "Kelas Wustha 2",
      room: "Kamar Umar",
      guardian: "Ibu Nurul Aini",
      phone: "085678901235",
      monthsCount: 2,
      totalDue: 1000000,
    },
  ]);

  const handleSendWaReminder = (item: typeof arrearsList[0]) => {
    const cleanPhone = item.phone.replace(/\D/g, "");
    const text = encodeURIComponent(
      `Assalamu'alaikum Wr. Wb.\n\nYth. Bapak/Ibu ${item.guardian} (Wali dari ${item.name} - ${item.className}),\n\nKami menginformasikan bahwa kewajiban SPP ananda di Pesantren ${tenantName} tercatat menunggak selama ${item.monthsCount} bulan sebesar *${formatRupiah(item.totalDue)}*.\n\nPembayaran dapat dilakukan melalui transfer rekening atau loket kasir Bendahara.\n\nJazakumullah khairan katsiran.\nWassalamu'alaikum Wr. Wb.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
  };

  const [transactions, setTransactions] = useState([
    {
      id: "trx-01",
      receiptNo: "KWT-2026-0901",
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
      receiptNo: "KWT-2026-0902",
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
      receiptNo: "KWT-2026-0903",
      nis: "-",
      name: "Logistik Dapur Santri",
      category: "Belanja Dapur Santri",
      amount: 4200000,
      type: "OUT",
      method: "Kas Tunai",
      time: "2 jam lalu",
      status: "SELESAI",
    },
  ]);

  const fin = metrics?.financialSummary;
  const stats = [
    {
      title: "Saldo Kas & Bank",
      value: fin ? formatRupiah(fin.balance) : "Rp 142.8 jt",
      subtitle: "Buku kas operasional aktif",
      icon: <Wallet className="w-5 h-5 text-emerald-600" />,
      trend: { value: "Likuid", isPositive: true },
    },
    {
      title: "Penerimaan SPP Bulan Ini",
      value: fin ? formatRupiah(fin.income) : "Rp 64.5 jt",
      subtitle: "Pemasukan tercatat kasir",
      icon: <ArrowUpCircle className="w-5 h-5 text-teal-600" />,
      trend: { value: "86% Target", isPositive: true },
    },
    {
      title: "Tunggakan Belum Lunas",
      value: fin ? formatRupiah(fin.unpaid) : "Rp 12.3 jt",
      subtitle: `${arrearsList.length} santri menunggak`,
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      trend: { value: "Perlu ditagih", isPositive: false },
    },
    {
      title: "Pengeluaran Operasional",
      value: fin ? formatRupiah(fin.expense) : "Rp 28.4 jt",
      subtitle: "Dapur, operasional, honor",
      icon: <ArrowDownCircle className="w-5 h-5 text-rose-500" />,
      trend: { value: "Terkontrol", isPositive: true },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-900 text-white text-xs font-semibold shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-emerald-300 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/30">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-500/30">
            <CreditCard className="w-3.5 h-3.5 text-amber-300" />
            <span>Finance Mode • Bendahara & Tata Kelola Keuangan</span>
          </div>

          <h2 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Assalamu&apos;alaikum, Ustadz {userName} 👋
          </h2>

          <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
            Pengelolaan loket pembayaran SPP, pembuatan tagihan massal, kas & bank, serta pengajuan belanja operasional di{" "}
            <span className="font-semibold text-white">{tenantName}</span>.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
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

      {/* ================= TAB 1: RINGKASAN KAS & MUTASI ================= */}
      {activeTab === "ringkasan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Transaksi Kas & Pembayaran Terkini
            </h3>
            <button
              onClick={() => setActiveTab("kasir")}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Input Kasir Baru</span>
            </button>
          </div>

          <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
            {transactions.map((t) => (
              <div key={t.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      t.type === "IN" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {t.type === "IN" ? "+" : "-"}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.name}</p>
                    <p className="text-[11px] text-slate-500">{t.category} • {t.method}</p>
                    <p className="text-[10px] text-slate-400 font-mono">No. Kuitansi: {t.receiptNo} • {t.time}</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span
                    className={`text-xs font-bold font-mono block ${
                      t.type === "IN" ? "text-emerald-700" : "text-rose-700"
                    }`}
                  >
                    {t.type === "IN" ? "+" : "-"} {formatRupiah(t.amount)}
                  </span>
                  <button
                    onClick={() => setActiveReceiptModal(t)}
                    className="text-[10px] text-emerald-700 font-semibold hover:underline flex items-center gap-1 justify-end ml-auto"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Cetak Kuitansi</span>
                  </button>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ================= TAB 2: BUAT TAGIHAN MASSAL (SECTION 7.3) ================= */}
      {activeTab === "tagihan_massal" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Receipt className="w-5 h-5 text-teal-600" />
                Generator Tagihan Massal (Section 7.3)
              </h3>
              <p className="text-xs text-slate-500">
                Otomatisasi pembuatan tagihan SPP bulanan untuk seluruh santri aktif dalam 1-klik.
              </p>
            </div>
          </div>

          <Card className="p-6 border-slate-200 space-y-4">
            <form onSubmit={handleGenerateMassBilling} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Tagihan *</label>
                  <input
                    type="text"
                    required
                    value={massBillTitle}
                    onChange={(e) => setMassBillTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kategori Tagihan</label>
                  <select
                    value={massBillCategory}
                    onChange={(e) => setMassBillCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="SPP">SPP Syahriyah Bulanan</option>
                    <option value="UANG_MAKAN">Uang Makan & Katering</option>
                    <option value="KEGIATAN">Kegiatan & Ujian Semester</option>
                    <option value="DAFTAR_ULANG">Daftar Ulang Santri</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Target Santri</label>
                  <select
                    value={massBillTarget}
                    onChange={(e) => {
                      setMassBillTarget(e.target.value);
                      setMassBillCount(e.target.value === "ALL" ? 428 : 32);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ALL">Semua Santri Aktif (428 Santri)</option>
                    <option value="ULYA_1">Kelas Ulya 1 (28 Santri)</option>
                    <option value="ULYA_2">Kelas Ulya 2 (32 Santri)</option>
                    <option value="WUSTHA_1">Kelas Wustha 1 (30 Santri)</option>
                    <option value="WUSTHA_2">Kelas Wustha 2 (32 Santri)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nominal per Santri (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={massBillAmount}
                    onChange={(e) => setMassBillAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Batas Waktu (Jatuh Tempo)</label>
                  <input
                    type="text"
                    value={massBillDueDate}
                    onChange={(e) => setMassBillDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-emerald-900 text-xs space-y-1">
                <span className="font-bold block">Ringkasan Estimasi Piutang:</span>
                <p>
                  Akan diterbitkan sebanyak <strong>{massBillCount} lembar tagihan</strong> dengan total potensi penerimaan:{" "}
                  <strong className="text-emerald-800 font-mono text-sm">
                    {formatRupiah(Number(massBillAmount) * massBillCount)}
                  </strong>.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Proses & Terbitkan Tagihan Massal</span>
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* ================= TAB 3: REKAP TUNGGAKAN & WA (SECTION 7.8) ================= */}
      {activeTab === "tunggakan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Rekap Tunggakan & Pengingat WhatsApp Wali Santri (Section 7.8)
              </h3>
              <p className="text-xs text-slate-500">
                Kirim pesan tagihan otomatis langsung ke nomor WhatsApp resmi wali santri.
              </p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
              Total Piutang: {formatRupiah(fin?.unpaid ?? 12300000)}
            </span>
          </div>

          <div className="space-y-3">
            {arrearsList.map((item) => (
              <Card key={item.id} className="p-4 border-slate-200 hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">NIS: {item.nis}</span>
                      <span className="text-[11px] text-slate-500">• {item.className} ({item.room})</span>
                      <Badge variant="danger" className="text-[10px]">
                        Nunggak {item.monthsCount} Bulan
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600">
                      Wali: <strong>{item.guardian}</strong> ({item.phone})
                    </p>
                    <p className="text-xs font-bold text-rose-700 font-mono">
                      Nominal Tunggakan: {formatRupiah(item.totalDue)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSendWaReminder(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Pengingat WA</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: KASIR PEMBAYARAN CEPAT (SECTION 7.4) ================= */}
      {activeTab === "kasir" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Meja Kasir Pembayaran SPP & Kuitansi (Section 7.4)
              </h3>
              <p className="text-xs text-slate-500">Pencatatan pembayaran loket tunai, transfer, dan QRIS.</p>
            </div>
            <Link
              href="/dashboard/finance"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
            >
              Buka Modul Kasir Lengkap &rarr;
            </Link>
          </div>

          <Card className="p-5 border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Input Pembayaran Baru</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Pilih Santri</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none">
                  <option>Ahmad Fauzan (20260021 - Ulya 2)</option>
                  <option>Muhammad Ali Al-Fatih (20260022 - Ulya 1)</option>
                  <option>Bilal Ibnu Rabah (20260023 - Wustha 2)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Pos Pembayaran</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none">
                  <option>SPP Syahriyah Bulanan (Rp 500.000)</option>
                  <option>Uang Makan & Katering (Rp 450.000)</option>
                  <option>Infaq Pembangunan (Rp 200.000)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Metode Bayar</label>
                <select className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none">
                  <option>Tunai di Loket Kasir</option>
                  <option>Transfer Bank Muamalat</option>
                  <option>QRIS Pesantren</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setFeedbackMsg("Pembayaran sebesar Rp 500.000 berhasil dicatat & kuitansi siap dicetak!");
                  setTimeout(() => setFeedbackMsg(null), 4000);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Simpan & Cetak Kuitansi</span>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* ================= TAB 5: PENGAJUAN PENGELUARAN (APPROVAL KIAI) ================= */}
      {activeTab === "pengajuan" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5 text-rose-600" />
                Workflow Pengajuan Pengeluaran & Approval Kiai (Section 7.6 & 7.7)
              </h3>
              <p className="text-xs text-slate-500">
                Pengeluaran di atas Rp 5.000.000 wajib mendapatkan otorisasi dan restu dari Kiai/Pengasuh.
              </p>
            </div>
          </div>

          {/* Form Buat Pengajuan */}
          <Card className="p-5 border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Form Pengajuan Biaya Baru</h4>
            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Keperluan Pengeluaran *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Belanja beras dapur santri 500 kg"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Catatan & Keterangan</label>
                <textarea
                  rows={2}
                  placeholder="Rincian harga satuan, supplier, atau alasan urgensi..."
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Kirim Pengajuan Biaya</span>
                </button>
              </div>
            </form>
          </Card>

          {/* Daftar Pengajuan */}
          <div className="space-y-3">
            {expenseList.map((exp) => (
              <Card key={exp.id} className="p-4 border-slate-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                      <Badge
                        variant={
                          exp.status === "DISETUJUI_KIAI" || exp.status === "LUNAS_TERBAYAR"
                            ? "success"
                            : "warning"
                        }
                        className="text-[10px]"
                      >
                        {exp.status === "MENUNGGU_APPROVAL_KIAI"
                          ? "Menunggu Restu Kiai"
                          : exp.status === "DISETUJUI_KIAI"
                          ? "Disetujui Kiai"
                          : "Lunas Dicairkan"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">{exp.category} • {exp.date}</p>
                    <p className="text-xs text-slate-600">&ldquo;{exp.notes}&rdquo;</p>
                  </div>

                  <span className="text-xs font-bold font-mono text-rose-700 self-start sm:self-center">
                    {formatRupiah(exp.amount)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: KAS & BANK PESANTREN (SECTION 7.5) ================= */}
      {activeTab === "kas_bank" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building className="w-5 h-5 text-indigo-600" />
            Akun Kas & Rekening Bank Pesantren (Section 7.5)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Kas Utama Operasional</span>
              <p className="text-lg font-bold font-mono text-emerald-800">Rp 48.500.000</p>
              <p className="text-[11px] text-slate-500">Brankas Kantor Bendahara</p>
            </Card>
            <Card className="p-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Kas Kecil (Petty Cash)</span>
              <p className="text-lg font-bold font-mono text-teal-800">Rp 4.250.000</p>
              <p className="text-[11px] text-slate-500">Kebutuhan darurat & ATK</p>
            </Card>
            <Card className="p-4 space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Muamalat Giro</span>
              <p className="text-lg font-bold font-mono text-slate-900">Rp 90.050.000</p>
              <p className="text-[11px] text-slate-500">No. Rek: 123-456-7890</p>
            </Card>
          </div>
        </div>
      )}

      {/* ================= TAB: REKONSILIASI BANK (Section 7.9) ================= */}
      {activeTab === "rekonsiliasi" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-600" />
              Rekonsiliasi Transaksi Bank vs SantriOS (Section 7.9)
            </h3>
            <button
              onClick={() => alert("Menjalankan pencocokan otomatis mutasi rekening...")}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold"
            >
              Sinkronkan Mutasi Bank
            </button>
          </div>

          <div className="space-y-3">
            {[
              { desc: "Transfer SPP Syahriyah - An. Muhammad Ali Al-Fatih", amount: 500000, bankDate: "Hari Ini, 09.15 WIB", systemDate: "Hari Ini, 09.16 WIB", status: "COCOK" },
              { desc: "Penerimaan Biaya Seragam - An. Ahmad Fauzan", amount: 450000, bankDate: "Kemarin, 14.20 WIB", systemDate: "Kemarin, 14.20 WIB", status: "COCOK" },
              { desc: "Transfer Masuk Tanpa Keterangan NIS", amount: 250000, bankDate: "Kemarin, 11.00 WIB", systemDate: "-", status: "PERLU_PEMERIKSAAN" },
            ].map((r, i) => (
              <Card key={i} className="p-4 space-y-2 border-slate-200 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{r.desc}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">Waktu Bank: {r.bankDate} • Waktu SantriOS: {r.systemDate}</p>
                  </div>
                  <Badge variant={r.status === "COCOK" ? "success" : "warning"} className="text-[10px]">
                    {r.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-slate-400">Nominal Mutasi:</span>
                  <span className="font-bold font-mono text-emerald-700">{formatRupiah(r.amount)}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: ANGGARAN & BUDGETING (Section 7.10) ================= */}
      {activeTab === "anggaran" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Anggaran & Realisasi Belanja Pesantren (Section 7.10)
            </h3>
            <button
              onClick={() => alert("Menambahkan pos pagu anggaran...")}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              + Pos Anggaran Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { category: "Logistik & Dapur Santri", budget: 35000000, used: 24500000, pct: "70%" },
              { category: "Utilitas Listrik, Air & Internet", budget: 10000000, used: 6850000, pct: "68%" },
              { category: "Honor & Tunjangan Asatidz", budget: 45000000, used: 45000000, pct: "100%" },
            ].map((b, i) => (
              <Card key={i} className="p-4 space-y-2 border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block">{b.category}</span>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Plafon: {formatRupiah(b.budget)}</span>
                  <span className="font-bold text-slate-800">{b.pct}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: b.pct }} />
                </div>
                <p className="text-[11px] text-slate-400">Realisasi: {formatRupiah(b.used)}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: LAPORAN KEUANGAN (Section 7.11) ================= */}
      {activeTab === "laporan" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Laporan Keuangan & Arus Kas (Section 7.11)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => alert("Mengunduh Rekapitulasi (.xlsx)...")}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
              >
                Unduh Excel
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
              >
                Cetak Laporan PDF
              </button>
            </div>
          </div>

          <Card className="p-4 space-y-3 border-slate-200 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Total Pemasukan</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">Rp 64.5 jt</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Total Pengeluaran</span>
                <span className="font-bold text-rose-700 font-mono text-sm">Rp 28.4 jt</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Surplus Operasional</span>
                <span className="font-bold text-teal-700 font-mono text-sm">+ Rp 36.1 jt</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-400 block">Piutang SPP Santri</span>
                <span className="font-bold text-amber-600 font-mono text-sm">Rp 12.3 jt</span>
              </div>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Arus kas bulan berjalan dalam status likuid dan sehat. Pembukuan diverifikasi secara berkala dengan bukti fisik kuitansi serta rekening koran bank.
            </p>
          </Card>
        </div>
      )}

      {/* ================= TAB: PENGATURAN KEUANGAN ================= */}
      {activeTab === "pengaturan_keuangan" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-600" />
            Pengaturan Keuangan Pesantren
          </h3>
          <Card className="p-4 space-y-3 border-slate-200 text-xs">
            <p className="font-bold text-slate-900">Batas Threshold Approval Kiai</p>
            <p className="text-slate-600 text-[11px]">
              Setiap pengajuan pengeluaran di atas <strong>Rp 5.000.000</strong> wajib mendapatkan persetujuan digital dari Kiai sebelum dana kas dicairkan.
            </p>
            <div className="pt-2">
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-1 rounded-md border border-emerald-200">
                Threshold Saat Ini: Rp 5.000.000 (Configured)
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* ================= MODAL KUITANSI PEMBAYARAN ================= */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Kuitansi Resmi Pembayaran
              </h3>
              <button onClick={() => setActiveReceiptModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>{activeReceiptModal.receiptNo}</span>
                <span>{activeReceiptModal.time}</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{activeReceiptModal.name}</p>
              <p className="text-slate-600">Pos: {activeReceiptModal.category}</p>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Total Dibayar:</span>
                <span className="text-base font-bold font-mono text-emerald-700">
                  {formatRupiah(activeReceiptModal.amount)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveReceiptModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  setActiveReceiptModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Kuitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
