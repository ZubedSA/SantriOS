"use client";

import React, { useState, useMemo } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  ShieldCheck,
  CreditCard,
  Printer,
  Download,
  Search,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Receipt,
  Landmark,
  CheckCircle2,
  Clock,
  User,
  Terminal,
  FileCheck,
  FileText,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";

export interface FinancialAuditItem {
  id: string;
  receiptNo: string;
  time: string;
  action: string;
  title: string;
  account: string;
  actor: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  verification: "TERVERIFIKASI" | "NOTA_TERLAMPIR" | "PENDING_REKONSILIASI";
  refBank: string;
}

export interface SecurityAuditItem {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  user: string;
  ip: string;
  time: string;
  detail: string;
  status: "SUCCESS" | "WARNING" | "FAILED";
}

export interface OperationalAuditItem {
  id: string;
  time: string;
  actor: string;
  category: "KESISWAAN" | "ASRAMA" | "PERIZINAN" | "AKADEMIK";
  action: string;
  target: string;
  detail: string;
}

interface AuditClientProps {
  tenantName: string;
  userRole: string;
  userName: string;
}

export default function AuditClient({ tenantName, userRole, userName }: AuditClientProps) {
  const isBendahara = userRole === "BENDAHARA";
  const isOwner = userRole === "OWNER" || userRole === "SUPER_ADMIN";

  // Tab State for Owner
  const [activeOwnerTab, setActiveOwnerTab] = useState<"finansial" | "keamanan">("finansial");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Financial Audit Records
  const [financialLogs] = useState<FinancialAuditItem[]>([
    {
      id: "tx-aud-01",
      receiptNo: "KW-202609-001",
      time: "Hari ini, 09:30 WIB",
      action: "PENERIMAAN_SPP",
      title: "SPP Syahriyah September — Ahmad Fauzan (Ulya 2)",
      account: "Kasir Tunai TU",
      actor: "Ustadz Syamsul (Bendahara)",
      type: "INCOME",
      amount: 500000,
      verification: "TERVERIFIKASI",
      refBank: "CASH-0926-01",
    },
    {
      id: "tx-aud-02",
      receiptNo: "KW-202609-002",
      time: "Hari ini, 08:45 WIB",
      action: "PENERIMAAN_KATERING",
      title: "Uang Makan & Katering — Muhammad Ali Al-Fatih (Ulya 1)",
      account: "Bank Muamalat (301-0029-441)",
      actor: "Wali Santri via M-Banking",
      type: "INCOME",
      amount: 450000,
      verification: "TERVERIFIKASI",
      refBank: "MUT-TRF-882190",
    },
    {
      id: "tx-aud-03",
      receiptNo: "KW-OUT-202609-001",
      time: "Kemarin, 14:15 WIB",
      action: "PENGELUARAN_LOGISTIK",
      title: "Pengadaan Beras 500kg & Sembako Dapur Santri",
      account: "Kas Tunai Bendahara",
      actor: "Staf Logistik Dapur (Disetujui Kyai)",
      type: "EXPENSE",
      amount: 4200000,
      verification: "NOTA_TERLAMPIR",
      refBank: "VOUCHER-OUT-102",
    },
    {
      id: "tx-aud-04",
      receiptNo: "KW-202609-003",
      time: "Kemarin, 11:20 WIB",
      action: "PENERIMAAN_SPP",
      title: "SPP Syahriyah September — Zaidan Al-Ayyubi (Wustha 1)",
      account: "QRIS Bank Syariah Indonesia",
      actor: "Payment Gateway QRIS",
      type: "INCOME",
      amount: 500000,
      verification: "TERVERIFIKASI",
      refBank: "BSI-QRIS-993812",
    },
    {
      id: "tx-aud-05",
      receiptNo: "KW-OUT-202609-002",
      time: "10 Sep 2026, 10:00 WIB",
      action: "PENGELUARAN_OPERASIONAL",
      title: "Pembelian ATK, Tinta Printer & Kertas Ujian Madrasah",
      account: "Kas Kecil TU",
      actor: "Kasir Tata Usaha",
      type: "EXPENSE",
      amount: 750000,
      verification: "NOTA_TERLAMPIR",
      refBank: "NOTA-TOKO-441",
    },
    {
      id: "tx-aud-06",
      receiptNo: "KW-202609-004",
      time: "09 Sep 2026, 15:30 WIB",
      action: "INFAQ_PEMBANGUNAN",
      title: "Infaq Pembangunan Asrama Santri Baru — Bpk. Hendra",
      account: "BSI Giro Yayasan (7123-8899-01)",
      actor: "Ustadz Syamsul (Bendahara)",
      type: "INCOME",
      amount: 2500000,
      verification: "TERVERIFIKASI",
      refBank: "BSI-TRF-771829",
    },
  ]);

  // Security / System Logs for Owner & Super Admin
  const [securityLogs] = useState<SecurityAuditItem[]>([
    {
      id: "sec-1",
      action: "USER_LOGIN",
      entity: "User",
      entityId: "usr-01",
      user: userName,
      ip: "127.0.0.1",
      time: "Baru saja",
      detail: `Pengguna berhasil login dengan sesi peran ${userRole}`,
      status: "SUCCESS",
    },
    {
      id: "sec-2",
      action: "BUDGET_APPROVAL",
      entity: "Finance",
      entityId: "app-1",
      user: "KH. Abdullah Maksum",
      ip: "182.253.11.45",
      time: "1 jam yang lalu",
      detail: "Otorisasi pengeluaran renovasi atap asrama sebesar Rp 6.500.000",
      status: "SUCCESS",
    },
    {
      id: "sec-3",
      action: "MODULE_STATUS_TOGGLE",
      entity: "Module",
      entityId: "mod-tahfizh",
      user: "KH. Abdullah Maksum",
      ip: "182.253.11.45",
      time: "3 jam yang lalu",
      detail: "Verifikasi konfigurasi modul Tahfizh Al-Qur'an aktif",
      status: "SUCCESS",
    },
    {
      id: "sec-4",
      action: "TENANT_CONFIG_SYNC",
      entity: "Tenant",
      entityId: "al-hikmah",
      user: "System Daemon",
      ip: "127.0.0.1",
      time: "Kemarin, 23:59 WIB",
      detail: "Sinkronisasi backup database harian & snapshot kasir",
      status: "SUCCESS",
    },
  ]);

  // Operational Logs for Admin
  const [operationalLogs] = useState<OperationalAuditItem[]>([
    {
      id: "op-1",
      time: "Hari ini, 09:15 WIB",
      actor: "Staf Tata Usaha",
      category: "KESISWAAN",
      action: "TAMBAH_SANTRI",
      target: "Zaidan Al-Ayyubi (20260025)",
      detail: "Pendaftaran santri baru masuk kelas Wustha 1 dan penempatan Kamar Ali",
    },
    {
      id: "op-2",
      time: "Hari ini, 08:30 WIB",
      actor: "Staf Kesantrian",
      category: "PERIZINAN",
      action: "TERBIT_IZIN",
      target: "Bilal Al-Ghifari (202601003)",
      detail: "Penerbitan surat izin jalan berobat RSUD nomor IZN-202609-001",
    },
    {
      id: "op-3",
      time: "Kemarin, 16:00 WIB",
      actor: "Musyrif Asrama",
      category: "ASRAMA",
      action: "MUTASI_KAMAR",
      target: "Ahmad Fauzan (20260021)",
      detail: "Pindah kamar dari Asrama Gedung A-01 ke Kamar A-03 (Utsman)",
    },
    {
      id: "op-4",
      time: "Kemarin, 05:00 WIB",
      actor: "Musyrif Shalat",
      category: "AKADEMIK",
      action: "SIMPAN_PRESENSI",
      target: "Shalat Subuh Berjamaah",
      detail: "Pencatatan presensi 148 santri: 142 Hadir, 3 Sakit, 3 Izin",
    },
  ]);

  const filteredFinancialLogs = useMemo(() => {
    return financialLogs.filter((log) => {
      const matchSearch =
        log.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.account.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = filterType === "ALL" || log.type === filterType;
      return matchSearch && matchType;
    });
  }, [financialLogs, searchQuery, filterType]);

  const totalIn = financialLogs.filter((l) => l.type === "INCOME").reduce((a, b) => a + b.amount, 0);
  const totalOut = financialLogs.filter((l) => l.type === "EXPENSE").reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={isOwner ? "success" : isBendahara ? "success" : "default"}
              className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 ${
                isOwner
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : isBendahara
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-blue-100 text-blue-800 border-blue-200"
              }`}
            >
              {isOwner
                ? "👑 Audit Trail Eksekutif Yayasan"
                : isBendahara
                ? "💰 Audit Transaksi Keuangan & Kas"
                : "🛠️ Log Aktivitas Operasional TU"}
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            {isBendahara
              ? "Audit Transaksi & Rekonsiliasi Kas"
              : isOwner
              ? "Audit Trail & Pengawasan Yayasan"
              : "Log Aktivitas Operasional Kesiswaan"}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {isBendahara
              ? `Rekam jejak setiap kwitansi pembayaran santri, kas keluar operasional, dan bukti mutasi kas di ${tenantName}.`
              : isOwner
              ? `Pengawasan terpusat mutasi finansial, otorisasi anggaran belanja, dan integritas sistem ${tenantName}.`
              : `Catatan mutasi santri, penerbitan surat jalan izin, dan rekam absensi pondok di ${tenantName}.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Mengunduh Lembar Audit Transaksi Kas (.xlsx)...")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekspor Audit (.xlsx)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-200" />
            <span>Cetak Rekap Audit</span>
          </button>
        </div>
      </div>

      {/* ================= OWNER TABS SWITCHER ================= */}
      {isOwner && (
        <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-sm overflow-x-auto gap-1">
          <button
            onClick={() => setActiveOwnerTab("finansial")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeOwnerTab === "finansial"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Audit Transaksi Keuangan & Kas ({financialLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveOwnerTab("keamanan")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all shrink-0 ${
              activeOwnerTab === "keamanan"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Log Keamanan & Sistem ({securityLogs.length})</span>
          </button>
        </div>
      )}

      {/* ================= VIEW 1: FINANCIAL AUDIT (BENDAHARA & OWNER) ================= */}
      {(isBendahara || (isOwner && activeOwnerTab === "finansial")) && (
        <div className="space-y-4 animate-in fade-in">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <StatCard
              title="Kas Masuk Terverifikasi"
              value={formatRupiah(totalIn)}
              subtitle={`${financialLogs.filter((l) => l.type === "INCOME").length} Transaksi SPP & Infaq`}
              icon={<ArrowUpCircle className="w-5 h-5 text-emerald-600" />}
              trend={{ value: "Lunas & Tercatat", isPositive: true }}
            />
            <StatCard
              title="Kas Keluar Diotorisasi"
              value={formatRupiah(totalOut)}
              subtitle={`${financialLogs.filter((l) => l.type === "EXPENSE").length} Transaksi Belanja & ATK`}
              icon={<ArrowDownCircle className="w-5 h-5 text-rose-500" />}
              trend={{ value: "Nota Lengkap", isPositive: true }}
            />
            <StatCard
              title="Status Rekonsiliasi"
              value="100% Klop"
              subtitle="Kwitansi vs Buku Kas"
              icon={<CheckCircle2 className="w-5 h-5 text-teal-600" />}
              trend={{ value: "Sesuai Saldo", isPositive: true }}
            />
            <StatCard
              title="Total Kwitansi Resmi"
              value={`${financialLogs.length} Nomor`}
              subtitle="Urut & Tidak Ada Loncat"
              icon={<Receipt className="w-5 h-5 text-sky-600" />}
              trend={{ value: "Valid", isPositive: true }}
            />
          </div>

          {/* Search & Filter Bar */}
          <Card className="p-3 border-slate-200">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nomor kwitansi, nama santri, akun kas, atau kasir..."
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="ALL">Semua Arus Kas</option>
                  <option value="INCOME">Penerimaan (Kas Masuk)</option>
                  <option value="EXPENSE">Pengeluaran (Kas Keluar)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Financial Transactions Audit Table */}
          <Card className="p-0 overflow-hidden border-slate-200">
            <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Jurnal Audit Transaksi Keuangan</span>
                <span className="text-[11px] text-slate-500">
                  Daftar transaksi kasir, nomor kwitansi resmi, dan status verifikasi mutasi
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Menampilkan <b>{filteredFinancialLogs.length}</b> transaksi
              </span>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredFinancialLogs.map((tx) => (
                <div key={tx.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-800">{tx.receiptNo}</span>
                    <span
                      className={`text-xs font-extrabold ${
                        tx.type === "INCOME" ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {tx.type === "INCOME" ? "+" : "-"} {formatRupiah(tx.amount)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{tx.title}</p>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <p>Akun: {tx.account}</p>
                    <p>Waktu: {tx.time}</p>
                    <p>Petugas: {tx.actor}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <Badge variant="success" className="text-[10px]">
                      {tx.verification}
                    </Badge>
                    <button
                      onClick={() => alert(`Mencetak kwitansi resmi ${tx.receiptNo}...`)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Cetak</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">No. Kwitansi</th>
                    <th className="py-3 px-4">Uraian Transaksi</th>
                    <th className="py-3 px-4">Akun / Rekening</th>
                    <th className="py-3 px-4">Petugas Kasir</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-center">Status Audit</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFinancialLogs.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {tx.time}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                        {tx.receiptNo}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 max-w-xs">
                        {tx.title}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {tx.account}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        {tx.actor}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-extrabold whitespace-nowrap ${
                          tx.type === "INCOME" ? "text-emerald-700" : "text-rose-700"
                        }`}
                      >
                        {tx.type === "INCOME" ? "+" : "-"} {formatRupiah(tx.amount)}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <Badge
                          variant={tx.verification === "TERVERIFIKASI" ? "success" : "default"}
                          className="text-[10px]"
                        >
                          {tx.verification}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => alert(`Mencetak salinan kwitansi ${tx.receiptNo}...`)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-700 inline-flex items-center gap-1"
                          title="Cetak Struk"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Kwitansi</span>
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

      {/* ================= VIEW 2: SECURITY & SYSTEM AUDIT (OWNER / SUPER_ADMIN) ================= */}
      {isOwner && activeOwnerTab === "keamanan" && (
        <Card className="p-0 overflow-hidden border-slate-200 animate-in fade-in">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Log Keamanan, Akses & Konfigurasi Sistem</span>
              <span className="text-[11px] text-slate-500">
                Catatan otentikasi login pengguna, perubahan pengaturan yayasan, dan otorisasi anggaran
              </span>
            </div>
            <Badge variant="success" className="text-xs">Isolasi Tenant Aktif</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Aksi Sistem</th>
                  <th className="py-3 px-4">Entitas</th>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {securityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {log.time}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                      {log.action}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                        {log.entity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{log.user}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.detail}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ================= VIEW 3: OPERATIONAL AUDIT (ADMIN TU) ================= */}
      {!isOwner && !isBendahara && (
        <Card className="p-0 overflow-hidden border-slate-200 animate-in fade-in">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Log Mutasi Kesiswaan & Operasional Tata Usaha</span>
              <span className="text-[11px] text-slate-500">
                Pencatatan aktivitas penambahan santri, mutasi kamar, dan penerbitan perizinan
              </span>
            </div>
            <Badge variant="default" className="text-xs">Log Operasional TU</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Aksi</th>
                  <th className="py-3 px-4">Target Santri / Agenda</th>
                  <th className="py-3 px-4">Pelaksana TU</th>
                  <th className="py-3 px-4">Detail Mutasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operationalLogs.map((op) => (
                  <tr key={op.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {op.time}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                        {op.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{op.action}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{op.target}</td>
                    <td className="py-3 px-4 text-slate-700">{op.actor}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm">{op.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
