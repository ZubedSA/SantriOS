"use client";

import React, { useState } from "react";
import { Card, Badge } from "@santrios/ui";
import {
  FolderArchive,
  Search,
  Download,
  Upload,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";

interface DokumenClientProps {
  tenantName: string;
}

export default function DokumenClient({ tenantName }: DokumenClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);

  const [docs, setDocs] = useState([
    { id: "DOC-01", name: "SK Pengangkatan Dewan Asatidz 2026/2027", cat: "SK_LEGALITAS", size: "2.4 MB", date: "15 Juli 2026", ext: "PDF" },
    { id: "DOC-02", name: "Akta Notaris & Izin Operasional Kemenag", cat: "SK_LEGALITAS", size: "8.1 MB", date: "10 Januari 2025", ext: "PDF" },
    { id: "DOC-03", name: "Kurikulum & Silabus Pesantren Formal", cat: "AKADEMIK", size: "5.1 MB", date: "20 Agustus 2026", ext: "PDF" },
    { id: "DOC-04", name: "Silabus Halaqah Tahfizh 30 Juz & Mutqin", cat: "AKADEMIK", size: "3.2 MB", date: "12 Agustus 2026", ext: "PDF" },
    { id: "DOC-05", name: "SOP Perizinan Keluar Gerbang Pondok", cat: "TATA_TERTIB", size: "1.1 MB", date: "10 Agustus 2026", ext: "PDF" },
    { id: "DOC-06", name: "Tata Tertib Asrama & Buku Panduan Santri", cat: "TATA_TERTIB", size: "4.5 MB", date: "01 Juli 2026", ext: "PDF" },
    { id: "DOC-07", name: "Data Berkas Akta & KK Santri Baru PPDB 2026", cat: "SANTRI", size: "18.2 MB", date: "02 September 2026", ext: "ZIP" },
    { id: "DOC-08", name: "Arsip Rekap Nilai Ujian Semester Lalu", cat: "RAPOR", size: "3.8 MB", date: "25 Juni 2026", ext: "XLSX" },
  ]);

  const handleAddDoc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      name: (fd.get("name") as string) || "Dokumen Baru",
      cat: (fd.get("cat") as string) || "AKADEMIK",
      size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      ext: (fd.get("ext") as string) || "PDF",
    };
    setDocs([newDoc, ...docs]);
    setIsAddOpen(false);
    setFeedback(`Dokumen "${newDoc.name}" berhasil diunggah ke arsip.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateDoc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDoc) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingDoc,
      name: (fd.get("name") as string) || editingDoc.name,
      cat: (fd.get("cat") as string) || editingDoc.cat,
      ext: (fd.get("ext") as string) || editingDoc.ext,
    };
    setDocs(docs.map((d) => (d.id === editingDoc.id ? updated : d)));
    setEditingDoc(null);
    setFeedback(`Metadata dokumen "${updated.name}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteDoc = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus berkas "${name}"?`)) {
      setDocs(docs.filter((d) => d.id !== id));
      setFeedback(`Berkas "${name}" telah dihapus dari repositori arsip.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = docs.filter((d) => {
    const matchQ = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "ALL" || d.cat === category;
    return matchQ && matchCat;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      {/* Toast Feedback */}
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 text-white shadow-xl border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FolderArchive className="w-4 h-4" />
            <span>Document Center • Pusat Arsip & Berkas</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Dokumen Pesantren</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Repositori resmi SK pengangkatan, legalitas yayasan, kurikulum KBM, dan arsip digital {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Unggah Dokumen Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama berkas atau dokumen..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "SK_LEGALITAS", "AKADEMIK", "TATA_TERTIB", "SANTRI", "RAPOR"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                category === cat ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "ALL" ? "Semua" : cat.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <Card key={d.id} className="p-4 hover:border-indigo-400 hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs">
                  {d.ext}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{d.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{d.date} • {d.size}</p>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Badge variant="outline" className="text-[10px]">{d.cat.replace("_", " ")}</Badge>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setFeedback(`Mengunduh berkas "${d.name}"...`);
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  title="Unduh Berkas"
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingDoc(d)}
                  title="Edit Metadata"
                  className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteDoc(d.id, d.name)}
                  title="Hapus Berkas"
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Dokumen */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" />
                Unggah Dokumen Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoc} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Dokumen / Berkas</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: SK Panitia Ujian Semester 2026"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
                <select name="cat" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="SK_LEGALITAS">SK & Legalitas</option>
                  <option value="AKADEMIK">Akademik & Silabus</option>
                  <option value="TATA_TERTIB">Tata Tertib & SOP</option>
                  <option value="SANTRI">Berkas Santri / PPDB</option>
                  <option value="RAPOR">Rapor & Nilai</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Format Berkas</label>
                <select name="ext" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="PDF">PDF (Dokumen Resmi)</option>
                  <option value="XLSX">Excel (.xlsx)</option>
                  <option value="DOCX">Word (.docx)</option>
                  <option value="ZIP">Arsip (.zip)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Simpan & Unggah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Dokumen */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Informasi Dokumen
              </h3>
              <button onClick={() => setEditingDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDoc} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Dokumen / Berkas</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingDoc.name}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
                <select name="cat" defaultValue={editingDoc.cat} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="SK_LEGALITAS">SK & Legalitas</option>
                  <option value="AKADEMIK">Akademik & Silabus</option>
                  <option value="TATA_TERTIB">Tata Tertib & SOP</option>
                  <option value="SANTRI">Berkas Santri / PPDB</option>
                  <option value="RAPOR">Rapor & Nilai</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Format Berkas</label>
                <select name="ext" defaultValue={editingDoc.ext} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="PDF">PDF (Dokumen Resmi)</option>
                  <option value="XLSX">Excel (.xlsx)</option>
                  <option value="DOCX">Word (.docx)</option>
                  <option value="ZIP">Arsip (.zip)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
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
