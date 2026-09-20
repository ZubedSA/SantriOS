"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  HeartHandshake,
  Search,
  PlusCircle,
  UserCheck,
  CheckCircle2,
  Calendar,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface PembinaanClientProps {
  tenantName: string;
}

export default function PembinaanClient({ tenantName }: PembinaanClientProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCounseling, setEditingCounseling] = useState<any | null>(null);

  const [counselings, setCounselings] = useState([
    {
      id: "BK-01",
      santri: "Muhammad Fatih",
      nis: "20260012",
      kelas: "Kelas Ulya 2",
      kamar: "Kamar Abu Bakar",
      issue: "Kerap terlambat bangun shalat shubuh dan motivasi belajar menurun",
      mentor: "Ustadz Mansur (Pembina Kesantrian)",
      target: "Jadwal tidur malam disiplin pukul 22.00 & piket adzan masjid",
      progress: "MEMBAIK",
      date: "20 September 2026",
    },
    {
      id: "BK-02",
      santri: "Farhan Hakim",
      nis: "20260024",
      kelas: "Kelas Wustha 1",
      kamar: "Kamar Ali",
      issue: "Kerap homesick dan sulit fokus saat halaqah tahfizh sore",
      mentor: "Ustadz Fatih Ridwan",
      target: "Konseling persuasif & bimbingan teman sekamar (peer-buddy)",
      progress: "DALAM_PROSES",
      date: "18 September 2026",
    },
  ]);

  const handleUpdateStatus = (id: string) => {
    setCounselings(counselings.map((c) => (c.id === id ? { ...c, progress: "MEMBAIK" } : c)));
    setFeedback("Status perkembangan pembinaan santri berhasil diperbarui menjadi Membaik.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddCounseling = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newCounsel = {
      id: `BK-0${counselings.length + 1}`,
      santri: (fd.get("santri") as string) || "Nama Santri",
      nis: (fd.get("nis") as string) || "202600" + Math.floor(10 + Math.random() * 80),
      kelas: (fd.get("kelas") as string) || "Kelas Ulya",
      kamar: (fd.get("kamar") as string) || "Kamar Asrama",
      issue: (fd.get("issue") as string) || "Fokus Masalah",
      mentor: (fd.get("mentor") as string) || "Ustadz Pembina",
      target: (fd.get("target") as string) || "Target Bimbingan",
      progress: "DALAM_PROSES",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    };
    setCounselings([newCounsel, ...counselings]);
    setIsAddOpen(false);
    setFeedback(`Sesi pembinaan santri "${newCounsel.santri}" berhasil dicatat.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleEditCounseling = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCounseling) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingCounseling,
      santri: (fd.get("santri") as string) || editingCounseling.santri,
      issue: (fd.get("issue") as string) || editingCounseling.issue,
      target: (fd.get("target") as string) || editingCounseling.target,
      mentor: (fd.get("mentor") as string) || editingCounseling.mentor,
      progress: (fd.get("progress") as string) || editingCounseling.progress,
    };
    setCounselings(counselings.map((c) => (c.id === editingCounseling.id ? updated : c)));
    setEditingCounseling(null);
    setFeedback(`Data konseling "${updated.santri}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteCounseling = (id: string, santri: string) => {
    if (confirm(`Yakin ingin menghapus sesi konseling untuk ${santri}?`)) {
      setCounselings(counselings.filter((c) => c.id !== id));
      setFeedback(`Sesi pembinaan ${santri} telah dihapus.`);
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
            <HeartHandshake className="w-4 h-4" />
            <span>Bimbingan & Konseling • Pendampingan Adab Santri</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Pembinaan Kesantrian</h1>
          <p className="text-xs md:text-sm text-teal-100/80 mt-1">
            Konseling kepribadian, pembinaan adab, pemantauan perubahan perilaku, dan pendampingan santri di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-teal-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buka Kasus Konseling</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {counselings.map((c) => (
          <Card key={c.id} className="p-5 hover:border-teal-400 hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{c.santri}</h3>
                <p className="text-xs text-slate-500">{c.kelas} • {c.kamar}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant={c.progress === "MEMBAIK" ? "success" : "warning"} className="text-[10px]">
                  {c.progress}
                </Badge>
                <button
                  onClick={() => setEditingCounseling(c)}
                  title="Edit Sesi"
                  className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteCounseling(c.id, c.santri)}
                  title="Hapus Sesi"
                  className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div>
                <strong className="text-slate-800 block">Fokus Masalah:</strong>
                <span className="text-slate-600">{c.issue}</span>
              </div>
              <div>
                <strong className="text-slate-800 block">Target Pembinaan:</strong>
                <span className="text-teal-800 font-medium">{c.target}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Pembina: <strong>{c.mentor}</strong></span>
              {c.progress !== "MEMBAIK" && (
                <button
                  onClick={() => handleUpdateStatus(c.id)}
                  className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px]"
                >
                  Tandai Membaik
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Konseling */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-teal-600" />
                Buka Kasus Konseling Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCounseling} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  required
                  placeholder="Contoh: Muhammad Ali"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kelas</label>
                  <input
                    type="text"
                    name="kelas"
                    placeholder="Kelas Ulya 1"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kamar Asrama</label>
                  <input
                    type="text"
                    name="kamar"
                    placeholder="Kamar Abu Bakar"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Fokus Permasalahan</label>
                <textarea
                  name="issue"
                  rows={2}
                  required
                  placeholder="Deskripsikan problem motivasi, adab, atau psikologis santri..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target / Solusi Pembinaan</label>
                <input
                  type="text"
                  name="target"
                  required
                  placeholder="Contoh: Konseling berkala & piket ibadah"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ustadz Pembina (Mentor)</label>
                <input
                  type="text"
                  name="mentor"
                  required
                  placeholder="Ustadz Mansur (Kesantrian)"
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
                  Simpan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Konseling */}
      {editingCounseling && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Bimbingan: {editingCounseling.santri}
              </h3>
              <button onClick={() => setEditingCounseling(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCounseling} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  defaultValue={editingCounseling.santri}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Fokus Permasalahan</label>
                <textarea
                  name="issue"
                  rows={2}
                  defaultValue={editingCounseling.issue}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Pembinaan</label>
                <input
                  type="text"
                  name="target"
                  defaultValue={editingCounseling.target}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pembina</label>
                  <input
                    type="text"
                    name="mentor"
                    defaultValue={editingCounseling.mentor}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select name="progress" defaultValue={editingCounseling.progress} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="DALAM_PROSES">DALAM_PROSES</option>
                    <option value="MEMBAIK">MEMBAIK</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCounseling(null)}
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
