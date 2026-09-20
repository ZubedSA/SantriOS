"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  FileCheck,
  PlusCircle,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  X,
  Edit3,
  Trash2,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";

interface PengajuanClientProps {
  tenantName: string;
}

export default function PengajuanClient({ tenantName }: PengajuanClientProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any | null>(null);

  const [submissions, setSubmissions] = useState([
    {
      id: "EXP-2026-041",
      title: "Pembelian Bahan Makanan & Beras Dapur Santri Mukim (2 Minggu)",
      category: "KONSUMSI",
      amount: 18500000,
      applicant: "Ustadz Mansur (Dapur Pondok)",
      date: "20 September 2026",
      status: "MENUNGGU_APPROVAL",
      notes: "Kebutuhan pokok 428 santri mukim untuk periode 21 Sept - 05 Okt 2026.",
    },
    {
      id: "EXP-2026-042",
      title: "Tagihan Listrik PLN & Internet Fiber Optik Kompleks Pesantren",
      category: "UTILITAS",
      amount: 6250000,
      applicant: "Ibu Nurhayati (Bendahara)",
      date: "19 September 2026",
      status: "MENUNGGU_APPROVAL",
      notes: "Beban pemakaian bulan Agustus 2026, jatuh tempo tanggal 20.",
    },
    {
      id: "EXP-2026-040",
      title: "Honor Dewan Asatidz & Guru Tugas Bulan Agustus 2026",
      category: "GAJI_HONOR",
      amount: 32000000,
      applicant: "Ibu Nurhayati (Bendahara)",
      date: "01 September 2026",
      status: "DISETUJUI_LUNAS",
      notes: "Telah ditransfer ke rekening 28 dewan guru dan staff.",
    },
  ]);

  const handleAddSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newSub = {
      id: `EXP-2026-0${submissions.length + 43}`,
      title: (fd.get("title") as string) || "Pengajuan Pengeluaran Baru",
      category: (fd.get("category") as string) || "OPERASIONAL",
      amount: Number(fd.get("amount")) || 1000000,
      applicant: (fd.get("applicant") as string) || "Bagian Terkait",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      status: "MENUNGGU_APPROVAL",
      notes: (fd.get("notes") as string) || "Catatan pengajuan anggaran.",
    };
    setSubmissions([newSub, ...submissions]);
    setIsAddOpen(false);
    setFeedback(`Pengajuan "${newSub.title}" berhasil diajukan ke Pengasuh/Kiai.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSub) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingSub,
      title: (fd.get("title") as string) || editingSub.title,
      category: (fd.get("category") as string) || editingSub.category,
      amount: Number(fd.get("amount")) || editingSub.amount,
      applicant: (fd.get("applicant") as string) || editingSub.applicant,
      notes: (fd.get("notes") as string) || editingSub.notes,
      status: (fd.get("status") as string) || editingSub.status,
    };
    setSubmissions(submissions.map((s) => (s.id === editingSub.id ? updated : s)));
    setEditingSub(null);
    setFeedback(`Pengajuan "${updated.title}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteSubmission = (id: string, title: string) => {
    if (confirm(`Yakin ingin membatalkan/menghapus pengajuan dana "${title}"?`)) {
      setSubmissions(submissions.filter((s) => s.id !== id));
      setFeedback(`Pengajuan dana "${title}" telah dihapus.`);
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Manajemen Anggaran • Pengajuan Dana Operasional</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Pengajuan Pengeluaran Dana</h1>
          <p className="text-xs md:text-sm text-teal-100/80 mt-1">
            Alur verifikasi pengeluaran, pengajuan operasional, dan tracking approval Kiai di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-teal-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Pengajuan Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Menunggu Approval" value={`${submissions.filter(s => s.status === 'MENUNGGU_APPROVAL').length} Pengajuan`} subtitle="Dalam antrean verifikasi" />
        <StatCard title="Disetujui / Lunas" value={`${submissions.filter(s => s.status === 'DISETUJUI_LUNAS').length} Pengajuan`} subtitle="Pencairan selesai" />
        <StatCard title="Total Pengajuan" value={`${submissions.length} Usulan`} subtitle="Bulan September 2026" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {submissions.map((s) => (
          <Card key={s.id} className="p-5 hover:shadow-md transition-all space-y-3 border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant={s.status === "MENUNGGU_APPROVAL" ? "warning" : "success"} className="text-[10px]">
                    {s.status.replace("_", " ")}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">ID: {s.id}</span>
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-900 mt-1">{s.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Pemohon: <strong>{s.applicant}</strong> • {s.date}</p>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5 mb-1">
                  <button
                    onClick={() => setEditingSub(s)}
                    title="Edit Pengajuan"
                    className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteSubmission(s.id, s.title)}
                    title="Hapus Pengajuan"
                    className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 uppercase block">Nominal Dana</span>
                <span className="text-base font-extrabold text-emerald-700 font-mono">{formatRupiah(s.amount)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
              {s.notes}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
              <span>Workflow: Bendahara &rarr; Pengasuh / Kiai &rarr; Kasir</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Pengajuan */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-teal-600" />
                Buat Pengajuan Dana Operasional Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmission} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Judul / Peruntukan Dana</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Pembelian Kitab & Modul Santri Baru"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
                  <select name="category" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="KONSUMSI">Konsumsi & Dapur</option>
                    <option value="UTILITAS">Utilitas (Listrik/Air/Wifi)</option>
                    <option value="GAJI_HONOR">Honor Dewan Asatidz</option>
                    <option value="SARPRAS">Sarana & Prasarana</option>
                    <option value="OPERASIONAL">Operasional Lembaga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    name="amount"
                    required
                    placeholder="Contoh: 5000000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Pemohon (Unit Kerja / Nama)</label>
                <input
                  type="text"
                  name="applicant"
                  required
                  placeholder="Ustadz Mansur (Sarpras & Dapur)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Rincian & Justifikasi Pengajuan</label>
                <textarea
                  name="notes"
                  rows={3}
                  required
                  placeholder="Jelaskan kebutuhan pembelian atau pengeluaran secara rinci..."
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
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md"
                >
                  Ajukan Dana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pengajuan */}
      {editingSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Pengajuan: {editingSub.id}
              </h3>
              <button onClick={() => setEditingSub(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmission} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Judul Peruntukan</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSub.title}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
                  <select name="category" defaultValue={editingSub.category} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="KONSUMSI">Konsumsi & Dapur</option>
                    <option value="UTILITAS">Utilitas</option>
                    <option value="GAJI_HONOR">Honor Asatidz</option>
                    <option value="SARPRAS">Sarana & Prasarana</option>
                    <option value="OPERASIONAL">Operasional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    name="amount"
                    defaultValue={editingSub.amount}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pemohon</label>
                  <input
                    type="text"
                    name="applicant"
                    defaultValue={editingSub.applicant}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select name="status" defaultValue={editingSub.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="MENUNGGU_APPROVAL">MENUNGGU_APPROVAL</option>
                    <option value="DISETUJUI_LUNAS">DISETUJUI_LUNAS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Catatan</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingSub.notes}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
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
