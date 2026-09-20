"use client";

import React, { useState } from "react";
import { Card, Badge } from "@santrios/ui";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  PlusCircle,
  X,
  Edit3,
  Trash2,
  AlertCircle,
  Send,
} from "lucide-react";

interface DisposisiClientProps {
  tenantName: string;
  userName: string;
}

export default function DisposisiClient({ tenantName, userName }: DisposisiClientProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingDisp, setEditingDisp] = useState<any | null>(null);

  const [dispositions, setDispositions] = useState([
    {
      id: "DSP-01",
      title: "Siapkan Surat Pemberitahuan Libur Ramadhan & Panduan Santri",
      from: "Kyai KH. Abdullah Munir",
      pic: "Admin Tata Usaha",
      deadline: "25 September 2026",
      priority: "TINGGI",
      instructions: "Format surat resmi berkop pondok, cantumkan batas akhir penjemputan dan nomor piket asrama.",
      status: "DALAM_PROSES",
    },
    {
      id: "DSP-02",
      title: "Verifikasi Berkas 5 Pendaftar PPDB Jalur Prestasi Tahfizh",
      from: "Kyai KH. Abdullah Munir",
      pic: "Panitia PPDB & TU",
      deadline: "22 September 2026",
      priority: "SEDANG",
      instructions: "Cek keaslian sertifikat tahfizh 5 juz dan input jadwal tes sima'an.",
      status: "DALAM_PROSES",
    },
    {
      id: "DSP-03",
      title: "Pemeriksaan Kelayakan Sanitasi & Air Kamar Mandi Asrama Putri",
      from: "Kyai KH. Abdullah Munir",
      pic: "Bagian Sarpras & Kesantrian",
      deadline: "19 September 2026",
      priority: "TINGGI",
      instructions: "Koordinasikan dengan teknisi pipa dan pastikan tandon air bersih.",
      status: "SELESAI",
    },
  ]);

  const handleComplete = (id: string) => {
    setDispositions(dispositions.map((d) => (d.id === id ? { ...d, status: "SELESAI" } : d)));
    setFeedback(`Tugas disposisi berhasil diselesaikan dan dilaporkan ke Kiai.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddDisp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newDisp = {
      id: `DSP-0${dispositions.length + 1}`,
      title: (fd.get("title") as string) || "Instruksi Baru",
      from: (fd.get("from") as string) || "Kyai KH. Abdullah Munir",
      pic: (fd.get("pic") as string) || "Tata Usaha",
      deadline: (fd.get("deadline") as string) || "3 Hari Mendatang",
      priority: (fd.get("priority") as string) || "SEDANG",
      instructions: (fd.get("instructions") as string) || "Mohon dilaksanakan dengan tertib.",
      status: "DALAM_PROSES",
    };
    setDispositions([newDisp, ...dispositions]);
    setIsAddOpen(false);
    setFeedback(`Disposisi baru "${newDisp.title}" berhasil diterbitkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateDisp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDisp) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingDisp,
      title: (fd.get("title") as string) || editingDisp.title,
      pic: (fd.get("pic") as string) || editingDisp.pic,
      priority: (fd.get("priority") as string) || editingDisp.priority,
      deadline: (fd.get("deadline") as string) || editingDisp.deadline,
      instructions: (fd.get("instructions") as string) || editingDisp.instructions,
      status: (fd.get("status") as string) || editingDisp.status,
    };
    setDispositions(dispositions.map((d) => (d.id === editingDisp.id ? updated : d)));
    setEditingDisp(null);
    setFeedback(`Disposisi "${updated.title}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteDisp = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus disposisi "${title}"?`)) {
      setDispositions(dispositions.filter((d) => d.id !== id));
      setFeedback(`Disposisi "${title}" telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-rose-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Task Management • Disposisi Pengasuh & Pimpinan</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Disposisi & Tugas Kiai</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Daftar instruksi langsung dari Pengasuh Pesantren kepada Tata Usaha, Kesantrian, dan Satuan Kerja {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-400 text-white font-bold text-xs shadow-lg hover:shadow-rose-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Disposisi Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {dispositions.map((disp) => (
          <Card key={disp.id} className="p-5 space-y-4 border-slate-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={disp.priority === "TINGGI" ? "danger" : "warning"} className="text-[10px]">
                    Prioritas {disp.priority}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {disp.id}</span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 mt-1.5">{disp.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dari: <strong>{disp.from}</strong> • Ditugaskan kepada: <strong className="text-slate-800">{disp.pic}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={disp.status === "SELESAI" ? "success" : "warning"} className="text-xs">
                  {disp.status === "SELESAI" ? "SELESAI DILAPORKAN" : "DALAM PROSES"}
                </Badge>
                <button
                  onClick={() => setEditingDisp(disp)}
                  title="Edit Disposisi"
                  className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteDisp(disp.id, disp.title)}
                  title="Hapus Disposisi"
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Instruksi Kiai:</strong>
              {disp.instructions}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>Batas Akhir: <strong className="text-rose-600 font-semibold">{disp.deadline}</strong></span>
              </div>

              {disp.status !== "SELESAI" ? (
                <button
                  onClick={() => handleComplete(disp.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Selesai & Laporkan</span>
                </button>
              ) : (
                <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Selesai dikerjakan
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Disposisi */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-600" />
                Buat Disposisi / Tugas Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDisp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Judul / Perihal Tugas</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Pengadaan Seragam Santri Baru 2026"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pemberi Instruksi</label>
                  <input
                    type="text"
                    name="from"
                    defaultValue="Kyai KH. Abdullah Munir"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ditugaskan Kepada (PIC)</label>
                  <input
                    type="text"
                    name="pic"
                    required
                    placeholder="Contoh: Bagian Kesantrian / TU"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Prioritas</label>
                  <select name="priority" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="TINGGI">TINGGI (Segera)</option>
                    <option value="SEDANG">SEDANG (Standar)</option>
                    <option value="RENDAH">RENDAH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Batas Waktu (Deadline)</label>
                  <input
                    type="text"
                    name="deadline"
                    required
                    placeholder="Contoh: 28 September 2026"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Instruksi Rinci</label>
                <textarea
                  name="instructions"
                  rows={3}
                  required
                  placeholder="Tuliskan petunjuk teknis dan output yang diharapkan..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
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
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Terbitkan Disposisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Disposisi */}
      {editingDisp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Disposisi: {editingDisp.id}
              </h3>
              <button onClick={() => setEditingDisp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateDisp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Judul / Perihal Tugas</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingDisp.title}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ditugaskan Kepada (PIC)</label>
                  <input
                    type="text"
                    name="pic"
                    defaultValue={editingDisp.pic}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Prioritas</label>
                  <select name="priority" defaultValue={editingDisp.priority} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="TINGGI">TINGGI</option>
                    <option value="SEDANG">SEDANG</option>
                    <option value="RENDAH">RENDAH</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Batas Waktu</label>
                  <input
                    type="text"
                    name="deadline"
                    defaultValue={editingDisp.deadline}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status Pengerjaan</label>
                  <select name="status" defaultValue={editingDisp.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="DALAM_PROSES">DALAM_PROSES</option>
                    <option value="SELESAI">SELESAI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Instruksi Rinci</label>
                <textarea
                  name="instructions"
                  rows={3}
                  defaultValue={editingDisp.instructions}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDisp(null)}
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
