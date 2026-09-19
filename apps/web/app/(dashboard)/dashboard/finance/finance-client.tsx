"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, StatCard, Badge } from "@santrios/ui";
import {
  CreditCard,
  Receipt,
  ArrowUpCircle,
  ArrowDownCircle,
  PlusCircle,
  FileText,
  Wallet,
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  X,
  Printer,
  Download,
  ShieldCheck,
  Building,
  Check,
  XCircle,
  PiggyBank,
  TrendingUp,
  Landmark,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";
import { createTransactionAction } from "@/actions/finance";

interface TransactionItem {
  id: string;
  receiptNo: string;
  title: string;
  category: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  method: string;
  date: string;
  actor: string;
}

interface InvoiceItem {
  id: string;
  studentName: string;
  nis: string;
  className: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "UNPAID" | "OVERDUE";
}

interface BudgetApprovalItem {
  id: string;
  title: string;
  department: string;
  requester: string;
  amount: number;
  description: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedAt?: string;
}

interface FinanceClientProps {
  tenantName: string;
  userRole?: string;
  initialTab?: string;
  initialAction?: string;
  initialSummary?: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    totalUnpaid: number;
  };
  initialTransactions?: TransactionItem[];
  initialInvoices?: InvoiceItem[];
  studentsList?: { id: string; name: string; nis: string; className: string }[];
}

export default function FinanceClient({
  tenantName,
  userRole = "OWNER",
  initialTab,
  initialAction,
  initialSummary,
  initialTransactions,
  initialInvoices,
  studentsList = [],
}: FinanceClientProps) {
  const isOwner = userRole === "OWNER" || userRole === "SUPER_ADMIN";
  const isBendahara = userRole === "BENDAHARA";
  const isWali = userRole === "WALI_SANTRI";
  const isAdmin = userRole === "ADMIN" || (!isOwner && !isBendahara && !isWali);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionItem | null>(null);

  // Wali Santri State
  const [waliTransferModal, setWaliTransferModal] = useState<InvoiceItem | null>(null);
  const [transferSenderName, setTransferSenderName] = useState("");
  const [transferBank, setTransferBank] = useState("BSI (Bank Syariah Indonesia)");
  const [transferSuccessMsg, setTransferSuccessMsg] = useState<string | null>(null);

  function terbilangRupiah(amount: number): string {
    const words = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    function numToWords(n: number): string {
      if (n < 12) return words[n];
      if (n < 20) return numToWords(n - 10) + " Belas";
      if (n < 100) return numToWords(Math.floor(n / 10)) + " Puluh " + numToWords(n % 10);
      if (n < 200) return "Seratus " + numToWords(n - 100);
      if (n < 1000) return numToWords(Math.floor(n / 100)) + " Ratus " + numToWords(n % 100);
      if (n < 2000) return "Seribu " + numToWords(n - 1000);
      if (n < 1000000) return numToWords(Math.floor(n / 1000)) + " Ribu " + numToWords(n % 1000);
      if (n < 1000000000) return numToWords(Math.floor(n / 1000000)) + " Juta " + numToWords(n % 1000000);
      return "";
    }
    const result = numToWords(amount).replace(/\s+/g, " ").trim();
    return (result || "Nol") + " Rupiah";
  }

  function handleSendWhatsApp(inv: InvoiceItem) {
    const text = encodeURIComponent(
      `Assalamu'alaikum Wr. Wb.\n\n` +
      `Yth. Bapak/Ibu Wali Santri dari ananda *${inv.studentName}* (${inv.className} - NIS: ${inv.nis}),\n\n` +
      `Kami dari Bagian Keuangan / Bendahara *${tenantName}* menginformasikan tagihan *${inv.title}* sebesar *${formatRupiah(inv.amount)}* yang jatuh tempo pada *${inv.dueDate}*.\n\n` +
      `Pembayaran dapat ditransfer melalui rekening resmi:\n` +
      `🏦 *Bank Syariah Indonesia (BSI)*\n` +
      `No. Rekening: *7123-8899-01*\n` +
      `Atas Nama: *${tenantName} Keuangan*\n\n` +
      `Atau dibayarkan tunai langsung di Meja Kasir Bendahara Pesantren.\n` +
      `Bukti transfer dapat difoto dan dikirimkan ke nomor ini.\n\n` +
      `Jazakumullahu khairan katsiran.\nWassalamu'alaikum Wr. Wb.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  // Owner Tab vs Admin/Bendahara Tab
  const [ownerTab, setOwnerTab] = useState<"otorisasi" | "aruskas" | "kolektibilitas" | "jurnal">(
    initialTab === "aruskas" ? "aruskas" : initialTab === "kolektibilitas" ? "kolektibilitas" : initialTab === "jurnal" ? "jurnal" : "otorisasi"
  );
  const [adminTab, setAdminTab] = useState<"kasir" | "tagihan" | "kaskecil" | "kwitansi">(
    initialTab === "tagihan" ? "tagihan" : initialTab === "kaskecil" ? "kaskecil" : initialTab === "kwitansi" ? "kwitansi" : "kasir"
  );

  // Approval items for Owner
  const [approvals, setApprovals] = useState<BudgetApprovalItem[]>([
    {
      id: "app-1",
      title: "Renovasi Atap & Plafon Gedung Asrama B",
      department: "Sarana & Prasarana",
      requester: "Ustadz Ridwan, S.Pd. (Kabag Sarpras)",
      amount: 6500000,
      description: "Perbaikan genteng bocor sebelum musim hujan dan penggantian 12 lembar plafon kamar B-02 s/d B-04.",
      date: "Hari ini, 08:30 WIB",
      status: "PENDING",
    },
    {
      id: "app-2",
      title: "Pengadaan 50 Eksemplar Mushaf Al-Qur'an Standar Kudus",
      department: "Bagian Tahfizh & Halaqah",
      requester: "Ustadz Fatih (Koordinator Tahfizh)",
      amount: 2000000,
      description: "Penggantian mushaf usang untuk santri halaqah tingkat Wustha dan Ulya.",
      date: "Kemarin, 16:00 WIB",
      status: "PENDING",
    },
    {
      id: "app-3",
      title: "Servis Rutin & Penggantian Oli Genset Utama 25 KVA",
      department: "Operasional Kelistrikan",
      requester: "Pak Joko (Teknisi Listrik)",
      amount: 1850000,
      description: "Pemeliharaan berkala genset darurat antisipasi pemadaman bergilir PLN.",
      date: "2 hari yang lalu",
      status: "APPROVED",
      approvedAt: "Kemarin oleh Kyai",
    },
  ]);

  const defaultTransactions: TransactionItem[] = [
    {
      id: "tx-1",
      receiptNo: "KW-202609-001",
      title: "SPP Syahriyah September — Ahmad Fauzan",
      category: "SPP",
      amount: 500000,
      type: "INCOME",
      method: "Kasir Tunai",
      date: "Hari ini, 09:30 WIB",
      actor: "Ustadz Syamsul (Bendahara)",
    },
    {
      id: "tx-2",
      receiptNo: "KW-202609-002",
      title: "Uang Makan & Katering — Muhammad Ali",
      category: "KATERING",
      amount: 450000,
      type: "INCOME",
      method: "Transfer Bank Muamalat",
      date: "Hari ini, 08:45 WIB",
      actor: "Ustadz Syamsul (Bendahara)",
    },
    {
      id: "tx-3",
      receiptNo: "KW-202609-OUT-001",
      title: "Pengadaan Beras 500kg & Bahan Dapur Santri",
      category: "BELANJA_DAPUR",
      amount: 4200000,
      type: "EXPENSE",
      method: "Kas Tunai",
      date: "Kemarin, 14:15 WIB",
      actor: "Staf Logistik Dapur",
    },
    {
      id: "tx-4",
      receiptNo: "KW-202609-003",
      title: "SPP Syahriyah September — Zaidan Al-Ayyubi",
      category: "SPP",
      amount: 500000,
      type: "INCOME",
      method: "QRIS Pesantren",
      date: "Kemarin, 11:20 WIB",
      actor: "Online Payment",
    },
  ];

  const [transactions, setTransactions] = useState<TransactionItem[]>(
    initialTransactions && initialTransactions.length > 0 ? initialTransactions : defaultTransactions
  );

  const defaultInvoices: InvoiceItem[] = [
    {
      id: "inv-1",
      studentName: "Ahmad Fauzan",
      nis: "20260021",
      className: "Ulya 2",
      title: "SPP Syahriyah September 2026",
      amount: 500000,
      dueDate: "10 Sep 2026",
      status: "PAID",
    },
    {
      id: "inv-2",
      studentName: "Muhammad Ali Al-Fatih",
      nis: "20260022",
      className: "Ulya 1",
      title: "SPP Syahriyah September 2026",
      amount: 500000,
      dueDate: "10 Sep 2026",
      status: "PAID",
    },
    {
      id: "inv-3",
      studentName: "Bilal Ibnu Rabah",
      nis: "20260023",
      className: "Wustha 3",
      title: "SPP Syahriyah September 2026",
      amount: 500000,
      dueDate: "10 Sep 2026",
      status: "OVERDUE",
    },
    {
      id: "inv-4",
      studentName: "Farhan Hakim",
      nis: "20260024",
      className: "Wustha 2",
      title: "SPP Syahriyah September 2026",
      amount: 500000,
      dueDate: "10 Sep 2026",
      status: "PAID",
    },
    {
      id: "inv-5",
      studentName: "Zaidan Al-Ayyubi",
      nis: "20260025",
      className: "Wustha 1",
      title: "SPP Syahriyah September 2026",
      amount: 500000,
      dueDate: "10 Sep 2026",
      status: "PAID",
    },
  ];

  const [invoices, setInvoices] = useState<InvoiceItem[]>(
    initialInvoices && initialInvoices.length > 0 ? initialInvoices : defaultInvoices
  );

  // Modals for Admin / Bendahara
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(initialAction === "bayar");
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(initialAction === "pengeluaran");
  const [payStudent, setPayStudent] = useState(studentsList[0]?.name || "Ahmad Fauzan");

  useEffect(() => {
    if (initialTab && ["kasir", "tagihan", "kaskecil", "kwitansi"].includes(initialTab)) {
      setAdminTab(initialTab as any);
    }
    if (initialTab && ["otorisasi", "aruskas", "kolektibilitas", "jurnal"].includes(initialTab)) {
      setOwnerTab(initialTab as any);
    }
    if (initialAction === "bayar") setIsPaymentModalOpen(true);
    if (initialAction === "pengeluaran") setIsExpenseModalOpen(true);
  }, [initialTab, initialAction]);
  const [payAmount, setPayAmount] = useState(500000);
  const [payCategory, setPayCategory] = useState("SPP");
  const [payMethod, setPayMethod] = useState("Kasir Tunai");

  const [expTitle, setExpTitle] = useState("");
  const [expAmount, setExpAmount] = useState(100000);
  const [expCategory, setExpCategory] = useState("OPERASIONAL");

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "APPROVED", approvedAt: "Baru saja disetujui Kyai" } : app
      )
    );
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: "REJECTED" } : app))
    );
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedStudentObj = studentsList.find((s) => s.name === payStudent);
      const matchingInvoice = invoices.find(
        (inv) => inv.studentName === payStudent && inv.status !== "PAID"
      );

      const methodVal = payMethod.includes("QRIS")
        ? "QRIS"
        : payMethod.includes("Transfer")
        ? "TRANSFER"
        : "CASH";

      const res = await createTransactionAction({
        type: "INCOME",
        category: payCategory as any,
        amount: Number(payAmount),
        method: methodVal,
        description: `Pembayaran ${payCategory} an. ${payStudent}`,
        studentId: selectedStudentObj?.id,
        invoiceId: matchingInvoice?.id,
      });

      if (res.success && res.data) {
        const tx = res.data;
        const newTx: TransactionItem = {
          id: tx.id,
          receiptNo: tx.receiptNo,
          title: `Pembayaran ${tx.category} — ${payStudent}`,
          category: tx.category,
          amount: tx.amount,
          type: "INCOME",
          method: payMethod,
          date: "Baru saja",
          actor: "Petugas Kasir TU",
        };

        setTransactions([newTx, ...transactions]);
        if (matchingInvoice) {
          setInvoices((prev) =>
            prev.map((inv) => (inv.id === matchingInvoice.id ? { ...inv, status: "PAID" } : inv))
          );
        }
        setIsPaymentModalOpen(false);
        setSelectedReceipt(newTx);
      } else {
        alert(res.error || "Gagal menyimpan pembayaran.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem saat memproses kasir.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle) return;
    setIsSubmitting(true);

    try {
      const res = await createTransactionAction({
        type: "EXPENSE",
        category: expCategory as any,
        amount: Number(expAmount),
        method: "CASH",
        description: expTitle,
      });

      if (res.success && res.data) {
        const tx = res.data;
        const newTx: TransactionItem = {
          id: tx.id,
          receiptNo: tx.receiptNo,
          title: expTitle,
          category: tx.category,
          amount: tx.amount,
          type: "EXPENSE",
          method: "Kas Tunai TU",
          date: "Baru saja",
          actor: "Kasir Operasional TU",
        };

        setTransactions([newTx, ...transactions]);
        setIsExpenseModalOpen(false);
        setExpTitle("");
        alert(`Pengeluaran kas ${tx.receiptNo} berhasil dicatat ke database Neon!`);
      } else {
        alert(res.error || "Gagal mencatat pengeluaran.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem saat memproses pengeluaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === "PENDING").length;
  const pendingApprovalsTotal = approvals
    .filter((a) => a.status === "PENDING")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={isOwner ? "success" : isBendahara ? "success" : isWali ? "info" : "default"}
              className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 ${
                isOwner
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : isBendahara
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : isWali
                  ? "bg-rose-100 text-rose-800 border-rose-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              }`}
            >
              {isOwner
                ? "👑 Otoritas Pengawasan Yayasan"
                : isBendahara
                ? "💰 Pusat Keuangan & Kasir Bendahara"
                : isWali
                ? "👨‍👩‍👧 Portal Pembayaran Wali Santri"
                : "🛠️ Meja Kasir & Penagihan TU"}
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            {isOwner
              ? "Laporan Keuangan & Otorisasi Anggaran"
              : isBendahara
              ? "Pusat Kasir Pembayaran & Kas Pesantren"
              : isWali
              ? "Tagihan & Pembayaran SPP Santri"
              : "Kasir Pembayaran & Tagihan Santri"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isOwner
              ? `Ikhtisar likuiditas kas & bank, tren penerimaan SPP, persetujuan pengeluaran anggaran di atas plafon di ${tenantName}.`
              : isBendahara
              ? `Penerimaan kasir SPP harian, mutasi kas masuk/keluar, penerbitan invoice santri, dan kwitansi resmi di ${tenantName}.`
              : isWali
              ? `Informasi tagihan syahriyah ananda, rekening resmi pesantren, konfirmasi bukti transfer, dan unduh kwitansi resmi di ${tenantName}.`
              : `Penerimaan pembayaran SPP harian, cetak nota kwitansi, penerbitan tagihan bulanan, dan kas kecil di ${tenantName}.`}
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {isOwner ? (
            <>
              <button
                onClick={() => alert("Mengunduh Laporan Pertanggungjawaban (LPJ) Yayasan...")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unduh LPJ Yayasan</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-200" />
                <span>Cetak Neraca Keuangan</span>
              </button>
            </>
          ) : isWali ? (
            <>
              <button
                onClick={() => alert("Menampilkan Petunjuk Rekening Pembayaran Resmi Pesantren.")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                <span>Rekening Resmi</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-200" />
                <span>Cetak Rekap Pembayaran</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
              >
                <ArrowDownCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>+ Kas Keluar</span>
              </button>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Kasir Terima Bayar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================= STATS SECTION ================= */}
      {isOwner ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Total Kas & Saldo Bank"
            value="Rp 184.500.000"
            subtitle="BSI, Muamalat & Tunai"
            icon={<Landmark className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Likuiditas Aman", isPositive: true }}
          />
          <StatCard
            title="Penerimaan SPP Bulan Ini"
            value="Rp 58.400.000"
            subtitle="86% dari target Rp 68 Jt"
            icon={<TrendingUp className="w-5 h-5 text-teal-600" />}
            trend={{ value: "+4.2%", isPositive: true }}
          />
          <StatCard
            title="Pengeluaran Operasional"
            value="Rp 24.800.000"
            subtitle="Gaji ustadz & katering"
            icon={<ArrowDownCircle className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Sesuai RAPB", isPositive: true }}
          />
          <StatCard
            title="Menunggu Otorisasi Kyai"
            value={`${pendingApprovalsCount} Pengajuan`}
            subtitle={`Total: ${formatRupiah(pendingApprovalsTotal)}`}
            icon={<ShieldCheck className="w-5 h-5 text-rose-500" />}
            trend={{ value: "Perlu Tindakan", isPositive: false }}
          />
        </div>
      ) : isWali ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Status SPP September"
            value="Lunas"
            subtitle="Terbayar Tepat Waktu"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "Tertib", isPositive: true }}
          />
          <StatCard
            title="Total Tagihan Terbayar"
            value="Rp 950.000"
            subtitle="SPP & Katering September"
            icon={<CreditCard className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Lunas", isPositive: true }}
          />
          <StatCard
            title="Sisa Kewajiban Berjalan"
            value="Rp 0"
            subtitle="Tidak Ada Tunggakan"
            icon={<Wallet className="w-5 h-5 text-sky-600" />}
            trend={{ value: "Nihil", isPositive: true }}
          />
          <StatCard
            title="Batas Tempo Bulanan"
            value="Tgl 10"
            subtitle="Setiap Awal Bulan"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
            trend={{ value: "Disiplin", isPositive: true }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <StatCard
            title="Setoran Kasir Hari Ini"
            value="Rp 4.850.000"
            subtitle="14 Transaksi Tunai & QRIS"
            icon={<Wallet className="w-5 h-5 text-emerald-600" />}
            trend={{ value: "+18% vs kemarin", isPositive: true }}
          />
          <StatCard
            title="Tagihan SPP Belum Lunas"
            value="48 Santri"
            subtitle="Total piutang Rp 24 Jt"
            icon={<Receipt className="w-5 h-5 text-rose-500" />}
            trend={{ value: "Jatuh Tempo 10 Sep", isPositive: false }}
          />
          <StatCard
            title="Sisa Kas Kecil TU"
            value="Rp 2.150.000"
            subtitle="Untuk ATK & darurat"
            icon={<PiggyBank className="w-5 h-5 text-sky-600" />}
            trend={{ value: "Cukup", isPositive: true }}
          />
          <StatCard
            title="Kwitansi Resmi Dicetak"
            value="14 Lembar"
            subtitle="Tercatat di sistem hari ini"
            icon={<Printer className="w-5 h-5 text-teal-600" />}
            trend={{ value: "Terverifikasi", isPositive: true }}
          />
        </div>
      )}

      {/* ================= TABS NAVIGATION ================= */}
      {isOwner ? (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setOwnerTab("otorisasi")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "otorisasi"
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Otorisasi Pengeluaran Anggaran ({pendingApprovalsCount})</span>
          </button>
          <button
            onClick={() => setOwnerTab("aruskas")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "aruskas"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Arus Kas & Rekening Bank</span>
          </button>
          <button
            onClick={() => setOwnerTab("kolektibilitas")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "kolektibilitas"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Kolektibilitas SPP & Beasiswa</span>
          </button>
          <button
            onClick={() => setOwnerTab("jurnal")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              ownerTab === "jurnal"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit Log Transaksi</span>
          </button>
        </div>
      ) : isWali ? (
        <div className="space-y-6 animate-in fade-in">
          {transferSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{transferSuccessMsg}</span>
              </div>
              <button onClick={() => setTransferSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  Daftar Tagihan & Status Pembayaran Ananda
                </h3>
                <span className="text-xs text-slate-500">Semester Ganjil 2026/2027</span>
              </div>

              <div className="space-y-3">
                {invoices.slice(0, 3).map((inv) => (
                  <Card key={inv.id} className="p-4 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-300 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900">{inv.title}</p>
                        <Badge variant={inv.status === "PAID" ? "success" : "danger"} className="text-[10px]">
                          {inv.status === "PAID" ? "LUNAS" : "BELUM LUNAS"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500">Santri: {inv.studentName} ({inv.className} - NIS: {inv.nis})</p>
                      <p className="text-[10px] text-slate-400">Jatuh Tempo: {inv.dueDate}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="text-sm font-extrabold font-mono text-slate-900">{formatRupiah(inv.amount)}</span>
                      {inv.status === "PAID" ? (
                        <button
                          onClick={() => {
                            setSelectedReceipt({
                              id: `rec-${inv.id}`,
                              receiptNo: `KW-202609-${inv.id.slice(-3).toUpperCase()}`,
                              title: inv.title,
                              category: "SPP",
                              amount: inv.amount,
                              type: "INCOME",
                              method: "Kasir Tunai",
                              date: "10 Sep 2026",
                              actor: "Bendahara Pesantren",
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 border border-emerald-200 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cetak Kwitansi</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setWaliTransferModal(inv)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Konfirmasi Transfer
                        </button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-teal-600" />
                Rekening Resmi Pesantren
              </h3>

              <Card className="p-4 space-y-3 bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
                <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Bank Syariah Indonesia (BSI)</span>
                    <Badge variant="success" className="text-[9px]">UTAMA</Badge>
                  </div>
                  <p className="text-base font-mono font-extrabold text-emerald-800 tracking-wider">7123-8899-01</p>
                  <p className="text-[10px] text-slate-500">Atas Nama: <b>{tenantName} Keuangan</b></p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-xs space-y-1">
                  <span className="text-xs font-bold text-slate-900">Bank Muamalat</span>
                  <p className="text-base font-mono font-extrabold text-emerald-800 tracking-wider">123-4567-890</p>
                  <p className="text-[10px] text-slate-500">Atas Nama: <b>Yayasan Pondok Pesantren</b></p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-xs text-center space-y-1">
                  <p className="text-xs font-bold text-emerald-400">QRIS Pesantren Modern</p>
                  <p className="text-[10px] text-slate-300">Scan via BCA, BSI, Mandiri, OVO, Gopay</p>
                  <div className="py-2 flex justify-center">
                    <div className="p-2 bg-white rounded-xl text-slate-900 text-[10px] font-mono font-bold">
                      [SCAN QRIS RESMI SANTRIOS]
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setAdminTab("kasir")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              adminTab === "kasir"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Kasir POS & Kwitansi Cepat</span>
          </button>
          <button
            onClick={() => setAdminTab("kaskecil")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              adminTab === "kaskecil"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Buku Kas Kecil TU & Operasional</span>
          </button>
          <button
            onClick={() => setAdminTab("kwitansi")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              adminTab === "kwitansi"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Arsip Struk & Kwitansi</span>
          </button>
          <Link
            href="/dashboard/finance/billing"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 ml-auto"
          >
            <Receipt className="w-3.5 h-3.5 text-teal-600" />
            <span>Buka Tagihan & Piutang Santri &rarr;</span>
          </Link>
        </div>
      )}

      {/* ================= OWNER TAB 1: OTORISASI ANGGARAN ================= */}
      {isOwner && ownerTab === "otorisasi" && (
        <Card className="p-5 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                Permohonan Pengeluaran Anggaran Menunggu Persetujuan Kyai
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                SOP Keuangan: Pengeluaran di atas plafon operasional (&gt; Rp 1.000.000) wajib mendapatkan otorisasi Pimpinan / Kyai sebelum dana dicairkan.
              </p>
            </div>
            <Badge variant="danger" className="text-xs self-start sm:self-auto">
              {pendingApprovalsCount} Menunggu Tindakan
            </Badge>
          </div>

          <div className="space-y-3 pt-2">
            {approvals.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.status === "PENDING"
                    ? "bg-amber-50/40 border-amber-200"
                    : item.status === "APPROVED"
                    ? "bg-emerald-50/30 border-emerald-200"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <Badge
                        variant={
                          item.status === "PENDING"
                            ? "warning"
                            : item.status === "APPROVED"
                            ? "success"
                            : "default"
                        }
                        className="text-[10px]"
                      >
                        {item.status === "PENDING"
                          ? "MENUNGGU OTORISASI"
                          : item.status === "APPROVED"
                          ? "DISETUJUI KYAI"
                          : "DITOLAK"}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Divisi: <b>{item.department}</b></span>
                      <span>•</span>
                      <span>Diajukan oleh: <b>{item.requester}</b></span>
                      <span>•</span>
                      <span>Waktu: <b>{item.date}</b></span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Nominal Anggaran</span>
                      <span className="text-base font-extrabold text-slate-900">
                        {formatRupiah(item.amount)}
                      </span>
                    </div>

                    {item.status === "PENDING" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReject(item.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-all"
                        >
                          Tolak / Revisi
                        </button>
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Setujui (Approve)
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        {item.approvedAt || "Selesai ditindaklanjuti"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= OWNER TAB 2: ARUS KAS & REKENING ================= */}
      {isOwner && ownerTab === "aruskas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Landmark className="w-4 h-4 text-emerald-600" />
              Saldo Rekening Resmi Pesantren
            </h3>
            <p className="text-xs text-slate-500">
              Rekapitulasi saldo likuid yayasan pada rekening perbankan syariah dan kas tunai.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Bank Syariah Indonesia (BSI)</span>
                  <p className="text-xs text-slate-600">No. Rek: 7123-8899-01 (Giro Operasional)</p>
                </div>
                <span className="text-sm font-extrabold text-emerald-950">Rp 120.000.000</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700">Bank Muamalat Indonesia</span>
                  <p className="text-xs text-slate-600">No. Rek: 301-0029-441 (Tabungan SPP)</p>
                </div>
                <span className="text-sm font-extrabold text-teal-950">Rp 54.500.000</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700">Kas Tunai Bendahara Pesantren</span>
                  <p className="text-xs text-slate-600">Brankas Kantor Utama</p>
                </div>
                <span className="text-sm font-extrabold text-amber-950">Rp 10.000.000</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Tren Arus Kas 4 Bulan Terakhir
            </h3>
            <p className="text-xs text-slate-500">
              Perbandingan penerimaan santri vs pengeluaran operasional.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { month: "Juni 2026", in: 62000000, out: 48000000, surplus: "+ Rp 14.000.000" },
                { month: "Juli 2026 (PPDB)", in: 98000000, out: 65000000, surplus: "+ Rp 33.000.000" },
                { month: "Agustus 2026", in: 59000000, out: 44000000, surplus: "+ Rp 15.000.000" },
                { month: "September 2026 (Berjalan)", in: 58400000, out: 24800000, surplus: "+ Rp 33.600.000" },
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.month}</span>
                    <span className="text-[11px] text-slate-500">
                      Masuk: {formatRupiah(item.in)} • Keluar: {formatRupiah(item.out)}
                    </span>
                  </div>
                  <Badge variant="success" className="text-[11px]">
                    {item.surplus}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ================= OWNER TAB 3: KOLEKTIBILITAS SPP & BEASISWA ================= */}
      {isOwner && ownerTab === "kolektibilitas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              Tingkat Kolektibilitas SPP Per Tingkat Kelas
            </h3>
            <div className="space-y-3 pt-1">
              {[
                { name: "Kelas Ulya 2 (SMA)", rate: "94%", count: "47 / 50 Santri" },
                { name: "Kelas Ulya 1 (SMA)", rate: "89%", count: "48 / 54 Santri" },
                { name: "Kelas Wustha 3 (SMP)", rate: "82%", count: "41 / 50 Santri" },
                { name: "Kelas Wustha 2 (SMP)", rate: "88%", count: "44 / 50 Santri" },
                { name: "Kelas Wustha 1 (SMP)", rate: "91%", count: "42 / 46 Santri" },
              ].map((cls, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{cls.name}</span>
                    <span className="text-emerald-700">{cls.rate} ({cls.count})</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: cls.rate }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Program Subsidi & Beasiswa Yayasan
            </h3>
            <p className="text-xs text-slate-500">
              Santri yatim dhuafa dan berprestasi tahfizh yang menerima keringanan biaya resmi dari pimpinan yayasan.
            </p>

            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">Beasiswa Tahfizh 30 Juz Mutqin</span>
                  <span className="text-[11px] text-slate-500 block">Gratis SPP & Katering 100% (12 Santri)</span>
                </div>
                <span className="font-bold text-slate-800">Rp 11.400.000 / bln</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">Subsidi Yatim & Dhuafa Yayasan</span>
                  <span className="text-[11px] text-slate-500 block">Keringanan biaya 50% (18 Santri)</span>
                </div>
                <span className="font-bold text-slate-800">Rp 8.550.000 / bln</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ================= OWNER TAB 4: JURNAL TRANSAKSI ================= */}
      {isOwner && ownerTab === "jurnal" && (
        <Card className="p-0 overflow-hidden border-slate-200 animate-in fade-in">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Audit Jurnal Kasir & Buku Kas</span>
              <span className="text-[11px] text-slate-500">Catatan mutasi riil yang diinput oleh bendahara dan kasir TU</span>
            </div>
            <button
              onClick={() => alert("Mengekspor seluruh riwayat transaksi ke format Excel...")}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">No. Kwitansi</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Petugas</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{tx.receiptNo}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{tx.title}</td>
                    <td className="py-3 px-4 text-slate-600">{tx.method}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{tx.date}</td>
                    <td className="py-3 px-4 text-slate-700">{tx.actor}</td>
                    <td
                      className={`py-3 px-4 text-right font-extrabold ${
                        tx.type === "INCOME" ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {tx.type === "INCOME" ? "+" : "-"} {formatRupiah(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ================= ADMIN TAB 1: KASIR & KWITANSI CEPAT ================= */}
      {!isOwner && adminTab === "kasir" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Antarmuka Kasir Pembayaran Santri
              </h3>
              <p className="text-xs text-slate-500">
                Pilih santri untuk mencatat pembayaran tunai atau transfer serta cetak kwitansi fisik.
              </p>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buka Form Kasir (POS)</span>
            </button>
          </div>

          <Card className="p-0 overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">No. Nota</th>
                    <th className="py-3 px-4">Uraian Pembayaran</th>
                    <th className="py-3 px-4">Metode</th>
                    <th className="py-3 px-4">Waktu Transaksi</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions
                    .filter((t) => t.type === "INCOME")
                    .map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{tx.receiptNo}</td>
                        <td className="py-3 px-4 font-medium text-slate-900">{tx.title}</td>
                        <td className="py-3 px-4 text-slate-600">{tx.method}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{tx.date}</td>
                        <td className="py-3 px-4 text-right font-extrabold text-emerald-700">
                          {formatRupiah(tx.amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSelectedReceipt(tx)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Cetak Nota</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ================= ADMIN TAB 2: KELOLA TAGIHAN & INVOICE ================= */}
      {!isOwner && adminTab === "tagihan" && (
        <Card className="p-0 overflow-hidden border-slate-200 animate-in fade-in">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Daftar Tagihan SPP Santri</span>
              <span className="text-[11px] text-slate-500">Status pelunasan dan pengiriman pengingat WhatsApp</span>
            </div>
            <button
              onClick={() => alert("Tagihan SPP bulan berjalan berhasil dibuat massal untuk seluruh santri aktif!")}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm self-start sm:self-auto"
            >
              + Buat Tagihan Massal Bulan Baru
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Santri</th>
                  <th className="py-3 px-4">NIS</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Pos Tagihan</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Tindakan TU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{inv.studentName}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{inv.nis}</td>
                    <td className="py-3 px-4 text-slate-700">{inv.className}</td>
                    <td className="py-3 px-4 text-slate-600">{inv.title}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{formatRupiah(inv.amount)}</td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={inv.status === "PAID" ? "success" : "danger"}
                        className="text-[10px]"
                      >
                        {inv.status === "PAID" ? "LUNAS" : "BELUM LUNAS"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.status !== "PAID" && (
                        <button
                          onClick={() => handleSendWhatsApp(inv)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                          title="Kirim pengingat tagihan santri via WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kirim WA</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ================= ADMIN TAB 3: BUKU KAS KECIL OPERASIONAL ================= */}
      {!isOwner && adminTab === "kaskecil" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PiggyBank className="w-4 h-4 text-emerald-600" />
                Catatan Pengeluaran Kas Kecil Tata Usaha
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan pengeluaran operasional harian kantor, ATK, fotokopi lembar ujian, dan konsumsi tamu.
              </p>
            </div>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
            >
              <ArrowDownCircle className="w-4 h-4" />
              <span>+ Catat Belanja Kas Kecil</span>
            </button>
          </div>

          <Card className="p-0 overflow-hidden border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">No. Bukti Kas</th>
                    <th className="py-3 px-4">Keperluan Pengeluaran</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Petugas</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions
                    .filter((t) => t.type === "EXPENSE")
                    .map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{tx.receiptNo}</td>
                        <td className="py-3 px-4 font-medium text-slate-900">{tx.title}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{tx.date}</td>
                        <td className="py-3 px-4 text-slate-700">{tx.actor}</td>
                        <td className="py-3 px-4 text-right font-extrabold text-rose-700">
                          - {formatRupiah(tx.amount)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ================= ADMIN TAB 4: RIWAYAT KWITANSI ================= */}
      {!isOwner && adminTab === "kwitansi" && (
        <Card className="p-5 space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-600" />
            Arsip Kwitansi Pembayaran Kasir
          </h3>
          <p className="text-xs text-slate-500">
            Cari nomor kwitansi untuk mencetak salinan bagi wali santri yang membutuhkan bukti pembayaran fisik.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold text-emerald-800">{tx.receiptNo}</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{tx.title}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{tx.date} • {tx.method}</p>
                </div>

                <button
                  onClick={() => setSelectedReceipt(tx)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Ulang</span>
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ================= MODAL KASIR TERIMA PEMBAYARAN (ADMIN ONLY) ================= */}
      {isPaymentModalOpen && !isOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Kasir Penerimaan Pembayaran Santri
              </h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePayment} className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Pilih Santri *</label>
                <select
                  value={payStudent}
                  onChange={(e) => setPayStudent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Ahmad Fauzan">Ahmad Fauzan (Ulya 2 - 20260021)</option>
                  <option value="Muhammad Ali Al-Fatih">Muhammad Ali Al-Fatih (Ulya 1 - 20260022)</option>
                  <option value="Bilal Ibnu Rabah">Bilal Ibnu Rabah (Wustha 3 - 20260023)</option>
                  <option value="Farhan Hakim">Farhan Hakim (Wustha 2 - 20260024)</option>
                  <option value="Zaidan Al-Ayyubi">Zaidan Al-Ayyubi (Wustha 1 - 20260025)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Pos Pembayaran *</label>
                <select
                  value={payCategory}
                  onChange={(e) => setPayCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="SPP">SPP Syahriyah Bulanan</option>
                  <option value="KATERING">Uang Makan & Katering Santri</option>
                  <option value="KITAB">Pengadaan Kitab Kuning & Modul</option>
                  <option value="DAFTAR_ULANG">Daftar Ulang / PPDB</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nominal Pembayaran (Rp) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Metode Pembayaran</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Kasir Tunai">Kasir Tunai di Meja TU</option>
                  <option value="Transfer Bank BSI">Transfer Bank BSI</option>
                  <option value="Transfer Bank Muamalat">Transfer Bank Muamalat</option>
                  <option value="QRIS Pesantren">QRIS Statis Pesantren</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                  Proses & Cetak Kwitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CATAT KAS KELUAR (ADMIN ONLY) ================= */}
      {isExpenseModalOpen && !isOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-rose-700 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ArrowDownCircle className="w-4 h-4" />
                Catat Kas Keluar Operasional TU
              </h3>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Keperluan / Deskripsi Pengeluaran *
                </label>
                <input
                  type="text"
                  required
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="Misal: Beli Kertas HVS & Tinta Printer TU"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kategori Pengeluaran</label>
                <select
                  value={expCategory}
                  onChange={(e) => setExpCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                >
                  <option value="OPERASIONAL_TU">ATK & Operasional TU</option>
                  <option value="KONSUMSI_TAMU">Konsumsi Tamu & Rapat</option>
                  <option value="FOTOKOPI">Fotokopi & Penggandaan Modul</option>
                  <option value="DARURAT">Biaya Darurat Medis Santri</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nominal (Rp) *</label>
                <input
                  type="number"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
                >
                  Simpan Bukti Kas Keluar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL CETAK KWITANSI RESMI ================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Cetak Kwitansi Bukti Pembayaran Sah</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Receipt Slip */}
            <div id="kwitansi-printable" className="p-6 space-y-5 bg-white text-slate-900">
              {/* Pesantren Letterhead */}
              <div className="border-b-2 border-slate-900 pb-4 text-center">
                <h2 className="text-base font-black uppercase tracking-wider text-slate-900">{tenantName}</h2>
                <p className="text-[11px] text-slate-600">
                  Bagian Administrasi Keuangan & Kasir Bendahara Pesantren
                </p>
                <p className="text-[10px] text-slate-400">
                  Email: bendahara@{tenantName.toLowerCase().replace(/\s+/g, "")}.id • Rek. Resmi BSI 7123-8899-01
                </p>
                <div className="mt-3 inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs tracking-widest uppercase border border-emerald-300">
                  BUKTI PEMBAYARAN SAH (KWITANSI)
                </div>
              </div>

              {/* Kwitansi Body */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-mono">No. Nota: <b className="text-slate-900 font-bold">{selectedReceipt.receiptNo}</b></span>
                  <span className="text-slate-500">Waktu: <b className="text-slate-900 font-semibold">{selectedReceipt.date}</b></span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="text-slate-500 font-medium">Telah Diterima Dari</span>
                  <span className="col-span-2 font-bold text-slate-900">: {selectedReceipt.title.replace(/^Pembayaran\s+[^\—]+\—\s*/i, "").replace(/^SPP\s+[^\—]+\—\s*/i, "")}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="text-slate-500 font-medium">Uang Sejumlah</span>
                  <span className="col-span-2 italic font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    : {terbilangRupiah(selectedReceipt.amount)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="text-slate-500 font-medium">Untuk Pembayaran</span>
                  <span className="col-span-2 font-medium text-slate-900">: {selectedReceipt.title} ({selectedReceipt.category})</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="text-slate-500 font-medium">Metode Transaksi</span>
                  <span className="col-span-2 font-semibold text-slate-800">: {selectedReceipt.method}</span>
                </div>

                <div className="pt-2 flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase">Jumlah Dibayar:</span>
                  <span className="text-lg font-black text-emerald-700 font-mono">
                    {formatRupiah(selectedReceipt.amount)}
                  </span>
                </div>
              </div>

              {/* Signature Section */}
              <div className="pt-4 flex justify-between items-end text-center text-xs">
                <div>
                  <p className="text-[11px] text-slate-500">Penyetor / Wali Santri</p>
                  <div className="h-14"></div>
                  <p className="font-semibold text-slate-800 underline">( ............................ )</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Kasir / Bendahara Pesantren</p>
                  <div className="h-8 flex items-center justify-center">
                    <span className="px-2 py-0.5 rounded border border-emerald-500 text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50">
                      [ LUNAS & TERCATAT ]
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 underline">{selectedReceipt.actor}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Kwitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL KONFIRMASI TRANSFER WALI SANTRI ================= */}
      {waliTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-300" />
                  Konfirmasi Pembayaran Transfer
                </h3>
                <p className="text-[11px] text-emerald-200 mt-0.5">{waliTransferModal.title}</p>
              </div>
              <button
                onClick={() => setWaliTransferModal(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTransferSuccessMsg(
                  `Bukti transfer pembayaran ${waliTransferModal.title} sebesar ${formatRupiah(waliTransferModal.amount)} berhasil dikirim ke Bendahara!`
                );
                setWaliTransferModal(null);
                setTransferSenderName("");
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Rekening Tujuan Transfer:</span>
                <p className="text-xs font-mono font-bold">BSI (Bank Syariah Indonesia) — 7123-8899-01</p>
                <p className="text-[11px] text-emerald-800">a.n. {tenantName} Keuangan</p>
                <p className="text-xs font-bold text-slate-900 pt-1">
                  Nominal Transfer: <span className="font-mono text-emerald-700">{formatRupiah(waliTransferModal.amount)}</span>
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Bank Pengirim / Metode Pembayaran *
                </label>
                <select
                  value={transferBank}
                  onChange={(e) => setTransferBank(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold focus:border-emerald-500 focus:outline-none"
                >
                  <option value="BSI (Bank Syariah Indonesia)">BSI (Bank Syariah Indonesia)</option>
                  <option value="Bank BCA">Bank Central Asia (BCA)</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="Bank BRI">Bank Rakyat Indonesia (BRI)</option>
                  <option value="Bank BNI">Bank Negara Indonesia (BNI)</option>
                  <option value="Bank Muamalat">Bank Muamalat</option>
                  <option value="QRIS Pesantren">QRIS (Gopay / OVO / ShopeePay)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Nama Pemilik Rekening Pengirim *
                </label>
                <input
                  type="text"
                  required
                  value={transferSenderName}
                  onChange={(e) => setTransferSenderName(e.target.value)}
                  placeholder="Contoh: Rahmat Santoso"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Unggah Bukti Struk Transfer (Foto / Screenshot) *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWaliTransferModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kirim Konfirmasi ke Kasir</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
