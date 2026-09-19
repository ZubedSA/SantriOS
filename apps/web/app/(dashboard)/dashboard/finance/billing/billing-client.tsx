"use client";

import React, { useState, useMemo } from "react";
import { Card, StatCard, Badge } from "@santrios/ui";
import {
  Receipt,
  PlusCircle,
  Search,
  Filter,
  Send,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Phone,
  Layers,
  Sparkles,
  Calendar,
  X,
  CreditCard,
  Building,
  DollarSign,
  AlertCircle,
  FileText,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";
import { createInvoiceAction, createBulkInvoiceAction } from "@/actions/finance";

export interface InvoiceItem {
  id: string;
  invoiceNo: string;
  studentName: string;
  nis: string;
  className: string;
  category: "SPP" | "KATERING" | "KITAB" | "DAFTAR_ULANG" | "SERAGAM";
  title: string;
  amount: number;
  dueDate: string;
  status: "PAID" | "UNPAID" | "OVERDUE" | "SUBSIDIZED";
  guardianName: string;
  guardianPhone: string;
  note?: string;
}

interface BillingClientProps {
  tenantName: string;
  userRole?: string;
  initialInvoices?: InvoiceItem[];
  classrooms?: { id: string; name: string }[];
  students?: { id: string; name: string; nis: string; className: string }[];
}

export default function BillingClient({
  tenantName,
  userRole = "BENDAHARA",
  initialInvoices,
  classrooms = [],
  students = [],
}: BillingClientProps) {
  const isBendahara = userRole === "BENDAHARA";
  const isOwner = userRole === "OWNER" || userRole === "SUPER_ADMIN";
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Invoices Master State
  const defaultInvoices: InvoiceItem[] = [
    {
      id: "inv-01",
      invoiceNo: "INV-202609-001",
      studentName: "Ahmad Fauzan",
      nis: "20260021",
      className: "Ulya 2",
      category: "SPP",
      title: "SPP Syahriyah September 2026",
      amount: 500000,
      dueDate: "10 Sep 2026",
      status: "PAID",
      guardianName: "Bpk. Rahmat Santoso",
      guardianPhone: "081234567890",
      note: "Lunas via Kasir Tunai pada 12 Sep",
    },
    {
      id: "inv-02",
      invoiceNo: "INV-202609-002",
      studentName: "Muhammad Ali Al-Fatih",
      nis: "20260022",
      className: "Ulya 1",
      category: "SPP",
      title: "SPP Syahriyah September 2026",
      amount: 500000,
      dueDate: "10 Sep 2026",
      status: "PAID",
      guardianName: "Bpk. Hendra Gunawan",
      guardianPhone: "081234567894",
      note: "Lunas via Transfer Bank Muamalat",
    },
    {
      id: "inv-03",
      invoiceNo: "INV-202609-003",
      studentName: "Bilal Ibnu Rabah",
      nis: "20260023",
      className: "Wustha 3",
      category: "SPP",
      title: "SPP Syahriyah September 2026",
      amount: 500000,
      dueDate: "10 Sep 2026",
      status: "OVERDUE",
      guardianName: "Ibu Siti Khodijah",
      guardianPhone: "081234567895",
      note: "Menunggak 2 bulan. Telah dikirim surat peringatan 1",
    },
    {
      id: "inv-04",
      invoiceNo: "INV-202609-004",
      studentName: "Bilal Ibnu Rabah",
      nis: "20260023",
      className: "Wustha 3",
      category: "KATERING",
      title: "Uang Makan & Katering September 2026",
      amount: 450000,
      dueDate: "10 Sep 2026",
      status: "OVERDUE",
      guardianName: "Ibu Siti Khodijah",
      guardianPhone: "081234567895",
      note: "Belum dibayar",
    },
    {
      id: "inv-05",
      invoiceNo: "INV-202609-005",
      studentName: "Farhan Hakim",
      nis: "20260024",
      className: "Wustha 2",
      category: "SPP",
      title: "SPP Syahriyah September 2026",
      amount: 450000,
      dueDate: "10 Sep 2026",
      status: "PAID",
      guardianName: "Bpk. Agus Santoso",
      guardianPhone: "081234567896",
    },
    {
      id: "inv-06",
      invoiceNo: "INV-202609-006",
      studentName: "Zaidan Al-Ayyubi",
      nis: "20260025",
      className: "Wustha 1",
      category: "SPP",
      title: "SPP Syahriyah September 2026",
      amount: 450000,
      dueDate: "10 Sep 2026",
      status: "PAID",
      guardianName: "Bpk. Bambang Irawan",
      guardianPhone: "081234567897",
    },
    {
      id: "inv-07",
      invoiceNo: "INV-202609-007",
      studentName: "Raihan Putra Pratama",
      nis: "202601005",
      className: "Ulya 1",
      category: "KITAB",
      title: "Pengadaan Kitab Fathul Qorib & Jurumiyah",
      amount: 250000,
      dueDate: "15 Sep 2026",
      status: "UNPAID",
      guardianName: "Bpk. Surya Dharma",
      guardianPhone: "081234567898",
      note: "Jatuh tempo 3 hari lagi",
    },
    {
      id: "inv-08",
      invoiceNo: "INV-202609-008",
      studentName: "Salman Al-Farisi",
      nis: "202601006",
      className: "Wustha 3",
      category: "SPP",
      title: "SPP Syahriyah September 2026",
      amount: 225000,
      dueDate: "10 Sep 2026",
      status: "SUBSIDIZED",
      guardianName: "Ibu Maryam",
      guardianPhone: "081234567899",
      note: "Keringanan 50% Subsidi Dhuafa dari Yayasan",
    },
  ];

  const [invoices, setInvoices] = useState<InvoiceItem[]>(
    initialInvoices && initialInvoices.length > 0 ? initialInvoices : defaultInvoices
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedClass, setSelectedClass] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Modals State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isCustomBillModalOpen, setIsCustomBillModalOpen] = useState(false);
  const [selectedInvoicePreview, setSelectedInvoicePreview] = useState<InvoiceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form: Generate Massal
  const [genMonth, setGenMonth] = useState("Oktober 2026");
  const [genTargetClass, setGenTargetClass] = useState("ALL");
  const [genCategory, setGenCategory] = useState("SPP");
  const [genDueDate, setGenDueDate] = useState("2026-10-10");

  // Form: Custom Bill
  const [customStudent, setCustomStudent] = useState("Bilal Ibnu Rabah");
  const [customCategory, setCustomCategory] = useState<"SPP" | "KATERING" | "KITAB" | "DAFTAR_ULANG" | "SERAGAM">("KITAB");
  const [customTitle, setCustomTitle] = useState("");
  const [customAmount, setCustomAmount] = useState(150000);
  const [customDueDate, setCustomDueDate] = useState("2026-09-20");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return invoices.filter((inv) => {
      const matchSearch =
        !q ||
        inv.studentName.toLowerCase().includes(q) ||
        inv.nis.includes(q) ||
        inv.invoiceNo.toLowerCase().includes(q) ||
        inv.title.toLowerCase().includes(q) ||
        inv.guardianName.toLowerCase().includes(q);

      const matchStatus = selectedStatus === "ALL" || inv.status === selectedStatus;
      const matchClass = selectedClass === "ALL" || inv.className === selectedClass;
      const matchCategory = selectedCategory === "ALL" || inv.category === selectedCategory;

      return matchSearch && matchStatus && matchClass && matchCategory;
    });
  }, [invoices, searchQuery, selectedStatus, selectedClass, selectedCategory]);

  const totalOutstanding = invoices
    .filter((inv) => inv.status === "UNPAID" || inv.status === "OVERDUE")
    .reduce((a, b) => a + b.amount, 0);

  const overdueCount = invoices.filter((inv) => inv.status === "OVERDUE").length;
  const overdueTotal = invoices.filter((inv) => inv.status === "OVERDUE").reduce((a, b) => a + b.amount, 0);
  const paidCount = invoices.filter((inv) => inv.status === "PAID").length;

  const handleSendWa = (inv: InvoiceItem) => {
    showToast(`Pengingat WhatsApp tagihan ${inv.invoiceNo} berhasil dikirim ke nomor ${inv.guardianPhone} (${inv.guardianName})!`);
  };

  const handleGenerateMassal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedClassObj = classrooms.find((c) => c.name === genTargetClass);
      const res = await createBulkInvoiceAction({
        classroomId: selectedClassObj?.id,
        title: `SPP Syahriyah ${genMonth}`,
        category: "SPP",
        amount: 500000,
        dueDate: genDueDate,
      });

      if (res.success) {
        setIsGenerateModalOpen(false);
        showToast(`Tagihan massal periode ${genMonth} (${res.data?.count || 0} santri) berhasil diterbitkan ke database Neon!`);
      } else {
        alert(res.error || "Gagal membuat tagihan massal.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem saat membuat tagihan massal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCustomBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;
    setIsSubmitting(true);

    try {
      const selectedStudentObj = students.find((s) => s.name === customStudent) || students[0];
      if (!selectedStudentObj) {
        alert("Santri tujuan wajib dipilih.");
        return;
      }

      const res = await createInvoiceAction({
        studentId: selectedStudentObj.id,
        title: customTitle,
        category: customCategory as any,
        amount: Number(customAmount),
        dueDate: customDueDate,
      });

      if (res.success && res.data) {
        const inv = res.data;
        const newInv: InvoiceItem = {
          id: inv.id,
          invoiceNo: `INV-SPEC-${Math.floor(100 + Math.random() * 900)}`,
          studentName: customStudent,
          nis: selectedStudentObj.nis,
          className: selectedStudentObj.className,
          category: customCategory,
          title: inv.title,
          amount: inv.amount,
          dueDate: new Date(inv.dueDate).toLocaleDateString("id-ID"),
          status: "UNPAID",
          guardianName: "Wali Santri",
          guardianPhone: "-",
          note: "Tagihan pos khusus tersimpan di database",
        };

        setInvoices([newInv, ...invoices]);
        setIsCustomBillModalOpen(false);
        setCustomTitle("");
        showToast(`Pos tagihan "${customTitle}" berhasil disimpan ke database Neon!`);
      } else {
        alert(res.error || "Gagal membuat pos tagihan.");
      }
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan sistem saat menyimpan tagihan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-xl flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-top-3 border border-emerald-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="default"
              className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 bg-teal-100 text-teal-800 border-teal-200"
            >
              🧾 Manajemen Piutang & Invoicing Santri
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-teal-600" />
            Tagihan, Piutang & Invoicing Santri
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Penerbitan tagihan SPP bulanan, pemantauan tunggakan piutang wali santri, dan pengiriman notifikasi penagihan di {tenantName}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCustomBillModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>+ Pos Tagihan Khusus</span>
          </button>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Layers className="w-4 h-4" />
            <span>+ Terbitkan Tagihan Massal</span>
          </button>
        </div>
      </div>

      {/* ================= KPI STATS CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Total Piutang Belum Tertagih"
          value={formatRupiah(totalOutstanding)}
          subtitle="Akumulasi tagihan aktif"
          icon={<Receipt className="w-5 h-5 text-rose-500" />}
          trend={{ value: "Piutang Berjalan", isPositive: false }}
        />
        <StatCard
          title="Santri Menunggak (Jatuh Tempo)"
          value={`${overdueCount} Santri`}
          subtitle={`Total menunggak: ${formatRupiah(overdueTotal)}`}
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          trend={{ value: "Perlu Tagihan WA", isPositive: false }}
        />
        <StatCard
          title="Tagihan Lunas Bulan Ini"
          value={`${paidCount} dari ${invoices.length} Santri`}
          subtitle="Tingkat pelunasan 88.5%"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          trend={{ value: "Tertib", isPositive: true }}
        />
        <StatCard
          title="Penerima Keringanan Yayasan"
          value="18 Santri"
          subtitle="Subsidi 50% & Yatim Dhuafa"
          icon={<Sparkles className="w-5 h-5 text-indigo-500" />}
          trend={{ value: "Disetujui Kyai", isPositive: true }}
        />
      </div>

      {/* ================= QUICK BROADCAST BANNER ================= */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">Broadcast Pengingat Tagihan Terpadu</span>
          </div>
          <p className="text-xs text-slate-200">
            Kirim rekap tagihan bulan berjalan dan nomor rekening resmi pesantren serentak ke WhatsApp seluruh wali santri yang belum lunas.
          </p>
        </div>

        <button
          onClick={() => showToast("Broadcast WhatsApp berhasil dijadwalkan untuk 48 wali santri yang belum lunas!")}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto shrink-0 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Kirim Pengingat ke {overdueCount} Wali Menunggak</span>
        </button>
      </div>

      {/* ================= SEARCH & FILTER BAR ================= */}
      <Card className="p-3.5 border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama santri, NIS, nomor invoice, nama wali..."
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="OVERDUE">Jatuh Tempo (Menunggak)</option>
              <option value="UNPAID">Belum Lunas</option>
              <option value="PAID">Lunas</option>
              <option value="SUBSIDIZED">Penerima Subsidi</option>
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none"
            >
              <option value="ALL">Semua Kelas</option>
              <option value="Ulya 2">Ulya 2 (SMA)</option>
              <option value="Ulya 1">Ulya 1 (SMA)</option>
              <option value="Wustha 3">Wustha 3 (SMP)</option>
              <option value="Wustha 2">Wustha 2 (SMP)</option>
              <option value="Wustha 1">Wustha 1 (SMP)</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:border-teal-500 focus:outline-none"
            >
              <option value="ALL">Semua Pos Biaya</option>
              <option value="SPP">SPP Syahriyah</option>
              <option value="KATERING">Uang Makan & Katering</option>
              <option value="KITAB">Pengadaan Kitab</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Menampilkan <b>{filteredInvoices.length}</b> tagihan</span>
          <button
            onClick={() => alert("Mengunduh laporan daftar piutang santri ke format Excel...")}
            className="text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Laporan Piutang (.xlsx)</span>
          </button>
        </div>
      </Card>

      {/* ================= INVOICE TABLE ================= */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Santri & Kelas</th>
                <th className="py-3 px-4">Pos Tagihan</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Wali Santri</th>
                <th className="py-3 px-4 text-center">Aksi Penagihan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-800 whitespace-nowrap">
                    {inv.invoiceNo}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{inv.studentName}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      NIS: {inv.nis} • {inv.className}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{inv.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                      {inv.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-medium">
                    {inv.dueDate}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                    {formatRupiah(inv.amount)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <Badge
                      variant={
                        inv.status === "PAID"
                          ? "success"
                          : inv.status === "OVERDUE"
                          ? "danger"
                          : inv.status === "SUBSIDIZED"
                          ? "default"
                          : "warning"
                      }
                      className="text-[10px]"
                    >
                      {inv.status === "PAID"
                        ? "LUNAS"
                        : inv.status === "OVERDUE"
                        ? "JATUH TEMPO"
                        : inv.status === "SUBSIDIZED"
                        ? "BEASISWA"
                        : "BELUM BAYAR"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-medium text-slate-800 block">{inv.guardianName}</span>
                    <span className="text-[11px] font-mono text-emerald-700">{inv.guardianPhone}</span>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {inv.status !== "PAID" && (
                        <button
                          onClick={() => handleSendWa(inv)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                          title="Kirim Pesan Penagihan WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kirim WA</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedInvoicePreview(inv)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-semibold inline-flex items-center gap-1"
                        title="Lihat Rincian Tagihan"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Detail</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ================= MASTER TARIF PENDIDIKAN SECTION ================= */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              Tabel Standar Tarif Biaya Pendidikan Santri (Buku Pedoman Yayasan)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Besaran iuran syahriyah per jenjang madrasah yang menjadi acuan pembuatan tagihan otomatis setiap bulan.
            </p>
          </div>
          <Badge variant="default" className="text-xs">Tahun Ajaran 2026/2027</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Tingkat Ulya (SMA / MA)</span>
            <p className="text-base font-extrabold text-slate-900">Rp 500.000 / bulan</p>
            <p className="text-[11px] text-slate-500">Termasuk biaya pengajaran kitab kuning dan asrama mukim</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Tingkat Wustha (SMP / MTs)</span>
            <p className="text-base font-extrabold text-slate-900">Rp 450.000 / bulan</p>
            <p className="text-[11px] text-slate-500">Biaya pendidikan madrasah diniyah dan asrama santri</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Katering & Makan Santri (3x Sehari)</span>
            <p className="text-base font-extrabold text-slate-900">Rp 450.000 / bulan</p>
            <p className="text-[11px] text-slate-500">Dikelola dapur pondok pesantren secara terpadu</p>
          </div>
        </div>
      </Card>

      {/* ================= MODAL GENERATE MASSAL ================= */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-teal-800 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Terbitkan Tagihan Massal Bulanan
              </h3>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateMassal} className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Periode Bulan Tagihan *</label>
                <select
                  value={genMonth}
                  onChange={(e) => setGenMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                >
                  <option value="Oktober 2026">Oktober 2026</option>
                  <option value="November 2026">November 2026</option>
                  <option value="Desember 2026">Desember 2026</option>
                  <option value="Januari 2027">Januari 2027</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Sasaran Kelas *</label>
                <select
                  value={genTargetClass}
                  onChange={(e) => setGenTargetClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                >
                  <option value="ALL">Seluruh Santri Aktif (Semua Kelas)</option>
                  <option value="Ulya 2">Khusus Kelas Ulya 2 (SMA)</option>
                  <option value="Ulya 1">Khusus Kelas Ulya 1 (SMA)</option>
                  <option value="Wustha 3">Khusus Kelas Wustha 3 (SMP)</option>
                  <option value="Wustha 2">Khusus Kelas Wustha 2 (SMP)</option>
                  <option value="Wustha 1">Khusus Kelas Wustha 1 (SMP)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Pos Iuran</label>
                <select
                  value={genCategory}
                  onChange={(e) => setGenCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                >
                  <option value="SPP">SPP Syahriyah Bulanan Saja</option>
                  <option value="SPP_KATERING">SPP + Uang Makan Katering Paket</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Batas Jatuh Tempo</label>
                <input
                  type="date"
                  value={genDueDate}
                  onChange={(e) => setGenDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 text-amber-800 text-[11px] border border-amber-200">
                ⚠️ Sistem akan secara otomatis menghitung potongan beasiswa bagi 18 santri penerima subsidi yayasan.
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold shadow-sm"
                >
                  Generate Invoice Massal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL POS TAGIHAN KHUSUS ================= */}
      {isCustomBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                Buat Pos Tagihan Khusus Santri
              </h3>
              <button
                onClick={() => setIsCustomBillModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomBill} className="p-5 space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nama Santri *</label>
                <select
                  value={customStudent}
                  onChange={(e) => setCustomStudent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                >
                  <option value="Ahmad Fauzan">Ahmad Fauzan (Ulya 2)</option>
                  <option value="Muhammad Ali Al-Fatih">Muhammad Ali Al-Fatih (Ulya 1)</option>
                  <option value="Bilal Ibnu Rabah">Bilal Ibnu Rabah (Wustha 3)</option>
                  <option value="Farhan Hakim">Farhan Hakim (Wustha 2)</option>
                  <option value="Zaidan Al-Ayyubi">Zaidan Al-Ayyubi (Wustha 1)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Kategori Pos</label>
                <select
                  value={customCategory}
                  onChange={(e) =>
                    setCustomCategory(e.target.value as "SPP" | "KATERING" | "KITAB" | "DAFTAR_ULANG" | "SERAGAM")
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                >
                  <option value="KITAB">Kitab Kuning & Modul Pelajaran</option>
                  <option value="SERAGAM">Kain & Jahit Seragam Santri</option>
                  <option value="DAFTAR_ULANG">Daftar Ulang Semester Baru</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Deskripsi / Judul Tagihan *</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Misal: Pembelian Kitab Alfiyah Ibnu Malik"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Jatuh Tempo</label>
                  <input
                    type="date"
                    value={customDueDate}
                    onChange={(e) => setCustomDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomBillModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm"
                >
                  Terbitkan Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DETAIL INVOICE PREVIEW ================= */}
      {selectedInvoicePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-300 block">LEMBAR INVOICE RESMI</span>
                <h3 className="text-base font-bold text-white">{selectedInvoicePreview.invoiceNo}</h3>
              </div>
              <button
                onClick={() => setSelectedInvoicePreview(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">DITUJUKAN KEPADA SANTRI:</span>
                  <p className="text-sm font-bold text-slate-900">{selectedInvoicePreview.studentName}</p>
                  <p className="text-slate-500 font-mono text-[11px]">NIS: {selectedInvoicePreview.nis} • {selectedInvoicePreview.className}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">STATUS PELUNASAN:</span>
                  <Badge
                    variant={selectedInvoicePreview.status === "PAID" ? "success" : "danger"}
                    className="mt-1 text-xs"
                  >
                    {selectedInvoicePreview.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Rincian Pos Biaya</span>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{selectedInvoicePreview.title}</p>
                    <p className="text-[11px] text-slate-500">Jatuh Tempo: {selectedInvoicePreview.dueDate}</p>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatRupiah(selectedInvoicePreview.amount)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-teal-800 uppercase block">Rekening Pembayaran Yayasan</span>
                <p className="text-[11px]">Bank Syariah Indonesia (BSI): <b>7123-8899-01</b> a.n. Pesantren</p>
                <p className="text-[11px]">Bank Muamalat: <b>301-0029-441</b> a.n. Pesantren</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
                <span>Wali: {selectedInvoicePreview.guardianName}</span>
                <span>No. WA: {selectedInvoicePreview.guardianPhone}</span>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedInvoicePreview(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-100"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleSendWa(selectedInvoicePreview);
                  setSelectedInvoicePreview(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
