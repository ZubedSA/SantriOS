"use client";

import React, { useState } from "react";
import { Card, Badge } from "@santrios/ui";
import {
  FileText,
  PlusCircle,
  Search,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  Send,
  Building,
  UserCheck,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface SuratClientProps {
  tenantName: string;
  userRole: string;
  userName: string;
}

export default function SuratClient({ tenantName, userRole, userName }: SuratClientProps) {
  const [activeTab, setActiveTab] = useState<"semua" | "keluar" | "masuk" | "keterangan" | "buat">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const [editingSurat, setEditingSurat] = useState<any | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [suratList, setSuratList] = useState([
    {
      id: "SRT-2026-001",
      number: "042/PONTREN-AL/EXT/IX/2026",
      type: "KELUAR",
      category: "Surat Keterangan Aktif",
      title: "Surat Keterangan Santri Aktif Mukim - Ahmad Fauzan (NIS: 20260021)",
      recipient: "Kantor Kemenag Wilayah Jawa Tengah",
      date: "18 September 2026",
      signee: "KH. Abdullah Munir (Pengasuh Pondok)",
      status: "TERKIRIM",
    },
    {
      id: "SRT-2026-002",
      number: "043/PONTREN-AL/INT/IX/2026",
      type: "KELUAR",
      category: "Surat Panggilan Wali",
      title: "Panggilan Wali Santri Terkait Pembinaan Kedisiplinan - Zulfikar Hidayat",
      recipient: "Bpk. Hidayatullah (Wali Santri)",
      date: "19 September 2026",
      signee: "Ustadz Mansur (Kepala Kesantrian)",
      status: "DIPROSES",
    },
    {
      id: "SRT-2026-003",
      number: "B-812/Kemenag.11/PP.00/IX/2026",
      type: "MASUK",
      category: "Surat Edaran",
      title: "Pemberitahuan Bantuan Operasional Pendidikan Pesantren 2026 Tahap II",
      recipient: `Sekretariat ${tenantName}`,
      date: "14 September 2026",
      signee: "Kasi PD Pontren Kemenag RI",
      status: "DIARSIPKAN",
    },
    {
      id: "SRT-2026-004",
      number: "044/PONTREN-AL/SK/IX/2026",
      type: "KELUAR",
      category: "Surat Keputusan",
      title: "SK Penetapan Dewan Penguji Tasmi' Tahfizh 30 Juz Semester Ganjil",
      recipient: "Dewan Asatidz Tahfizh",
      date: "20 September 2026",
      signee: "KH. Abdullah Munir",
      status: "TERKIRIM",
    },
  ]);

  const filteredSurat = suratList.filter((s) => {
    const matchQ =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "keluar") return matchQ && s.type === "KELUAR";
    if (activeTab === "masuk") return matchQ && s.type === "MASUK";
    if (activeTab === "keterangan") return matchQ && s.category.includes("Keterangan");
    return matchQ;
  });

  const handleGenerateSurat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newSurat = {
      id: `SRT-${Date.now().toString().slice(-4)}`,
      number: `045/PONTREN/${formData.get("type") === "MASUK" ? "INT" : "EXT"}/IX/2026`,
      type: (formData.get("type") as any) || "KELUAR",
      category: (formData.get("category") as string) || "Surat Keterangan",
      title: (formData.get("title") as string) || "Surat Resmi Pesantren",
      recipient: (formData.get("recipient") as string) || "Pihak Terkait",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      signee: userName,
      status: "TERKIRIM",
    };
    setSuratList([newSurat, ...suratList]);
    setActiveTab("semua");
    setFeedback(`Berhasil menerbitkan nomor surat resmi: ${newSurat.number}`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateSurat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSurat) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingSurat,
      title: (fd.get("title") as string) || editingSurat.title,
      category: (fd.get("category") as string) || editingSurat.category,
      recipient: (fd.get("recipient") as string) || editingSurat.recipient,
      status: (fd.get("status") as string) || editingSurat.status,
    };
    setSuratList(suratList.map((s) => (s.id === editingSurat.id ? updated : s)));
    setEditingSurat(null);
    setFeedback(`Surat ${updated.number} berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteSurat = (id: string, number: string) => {
    if (confirm(`Yakin ingin menghapus arsip surat nomor ${number}?`)) {
      setSuratList(suratList.filter((s) => s.id !== id));
      setFeedback(`Surat ${number} telah dihapus dari sistem.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Toast */}
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-white shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Administrasi Tata Usaha • Manajemen Surat Menyurat</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">
            Surat & Administrasi Resmi
          </h1>
          <p className="text-xs md:text-sm text-teal-100/80 mt-1">
            Pengelolaan surat keluar/masuk, surat keterangan santri aktif, surat tugas, dan penomoran otomatis di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setActiveTab("buat")}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Surat Baru</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "semua", label: "Semua Surat", count: suratList.length },
          { id: "keluar", label: "Surat Keluar", count: suratList.filter((s) => s.type === "KELUAR").length },
          { id: "masuk", label: "Surat Masuk", count: suratList.filter((s) => s.type === "MASUK").length },
          { id: "keterangan", label: "Surat Keterangan", count: suratList.filter((s) => s.category.includes("Keterangan")).length },
          { id: "buat", label: "➕ Form Buat Surat" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "buat" ? (
        <Card className="p-6 max-w-2xl border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            Terbitkan Surat Resmi Baru
          </h2>
          <form onSubmit={handleGenerateSurat} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tipe Surat</label>
                <select name="type" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="KELUAR">Surat Keluar (Eksternal)</option>
                  <option value="MASUK">Surat Masuk (Arsip)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kategori Dokumen</label>
                <select name="category" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="Surat Keterangan Aktif">Surat Keterangan Aktif Santri</option>
                  <option value="Surat Rekomendasi">Surat Rekomendasi</option>
                  <option value="Surat Panggilan Wali">Surat Panggilan Wali</option>
                  <option value="Surat Izin Khusus">Surat Izin Khusus</option>
                  <option value="Surat Keputusan (SK)">Surat Keputusan (SK)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Perihal / Judul Surat</label>
              <input
                type="text"
                name="title"
                required
                placeholder="Contoh: Surat Keterangan Aktif Santri - Muhammad Fatih (NIS: 20260012)"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Tujuan / Penerima</label>
              <input
                type="text"
                name="recipient"
                required
                placeholder="Contoh: Kantor Urusan Agama / Wali Santri / Instansi Terkait"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("semua")}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Terbitkan & Beri Nomor</span>
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor surat, perihal, atau kategori..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Table */}
          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Nomor Surat</th>
                    <th className="py-3 px-4">Perihal & Kategori</th>
                    <th className="py-3 px-4">Penerima / Instansi</th>
                    <th className="py-3 px-4">Tanggal & Penandatangan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Aksi Dokumen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSurat.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{s.number}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{s.title}</div>
                        <Badge variant="outline" className="text-[10px] mt-1">{s.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{s.recipient}</td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{s.date}</div>
                        <div className="text-[11px] text-slate-400">{s.signee}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={s.status === "TERKIRIM" ? "success" : s.status === "DIPROSES" ? "warning" : "default"} className="text-[10px]">
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setPreviewDoc(s)}
                            title="Cetak PDF"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingSurat(s)}
                            title="Edit Surat"
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSurat(s.id, s.number)}
                            title="Hapus Surat"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Modal Preview Dokumen */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Preview Dokumen Surat Resmi
              </h3>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="text-center pb-2 border-b border-slate-200">
                <p className="font-bold text-sm text-slate-900 tracking-wide uppercase">{tenantName}</p>
                <p className="text-[10px] text-slate-500">Sekretariat Tata Usaha & Biro Administrasi Pesantren</p>
              </div>
              <p><strong>Nomor:</strong> {previewDoc.number}</p>
              <p><strong>Perihal:</strong> {previewDoc.title}</p>
              <p><strong>Penerima:</strong> {previewDoc.recipient}</p>
              <p><strong>Tanggal Terbit:</strong> {previewDoc.date}</p>
              <p><strong>Penandatangan:</strong> {previewDoc.signee}</p>
              <div className="pt-2 text-slate-600 leading-relaxed text-[11px]">
                Dengan ini menerangkan bahwa dokumen di atas telah teregistrasi dalam sistem persuratan resmi {tenantName}.
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Lembar Resmi</span>
              </button>
            </div>
          </div>
      {/* Modal Edit Surat */}
      {editingSurat && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Surat: {editingSurat.number}
              </h3>
              <button onClick={() => setEditingSurat(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSurat} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Perihal / Judul Surat</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSurat.title}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kategori Surat</label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editingSurat.category}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tujuan / Penerima</label>
                <input
                  type="text"
                  name="recipient"
                  defaultValue={editingSurat.recipient}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Status Pengiriman</label>
                <select name="status" defaultValue={editingSurat.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="TERKIRIM">TERKIRIM</option>
                  <option value="DIPROSES">DIPROSES</option>
                  <option value="DIARSIPKAN">DIARSIPKAN</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSurat(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
