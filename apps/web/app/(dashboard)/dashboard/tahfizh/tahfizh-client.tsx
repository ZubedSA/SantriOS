"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  Award,
  Sparkles,
  Users,
  Printer,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface TahfizhClientProps {
  tenantName: string;
}

export default function TahfizhClient({ tenantName }: TahfizhClientProps) {
  const [activeTab, setActiveTab] = useState<"setoran" | "halaqah" | "murajaah" | "target" | "ujian">("setoran");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [editingSetoran, setEditingSetoran] = useState<any | null>(null);

  const [records, setRecords] = useState([
    {
      id: "TFZ-01",
      santri: "Muhammad Fatih",
      nis: "20260012",
      kelas: "Kelas Ulya 2",
      surah: "Surah An-Nur ayat 1-25",
      juz: 18,
      type: "ZIYADAH",
      grade: "Mumtaz (A)",
      mentor: "Ustadz Ahmad Fauzi, Lc.",
      date: "20 September 2026, 06.30 WIB",
    },
    {
      id: "TFZ-02",
      santri: "Rizky Ramadhan",
      nis: "20260018",
      kelas: "Kelas Wustha 3",
      surah: "Surah Maryam ayat 1-50",
      juz: 16,
      type: "MURAJAAH",
      grade: "Jayyid Jiddan (B+)",
      mentor: "Ustadz Ahmad Fauzi, Lc.",
      date: "20 September 2026, 06.45 WIB",
    },
    {
      id: "TFZ-03",
      santri: "Zulkifli Mansur",
      nis: "20260035",
      kelas: "Kelas Wustha 1",
      surah: "Surah Al-Mulk ayat 1-30",
      juz: 29,
      type: "ZIYADAH",
      grade: "Mumtaz (A)",
      mentor: "Ustadz Zaid",
      date: "19 September 2026, 16.30 WIB",
    },
  ]);

  const handleAddSetoran = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newRec = {
      id: `TFZ-${Date.now().toString().slice(-4)}`,
      santri: (fd.get("santri") as string) || "Santri",
      nis: "202600" + Math.floor(10 + Math.random() * 80),
      kelas: "Kelas Ulya 1",
      surah: (fd.get("surah") as string) || "Surah Al-Baqarah",
      juz: Number(fd.get("juz")) || 1,
      type: (fd.get("type") as string) || "ZIYADAH",
      grade: (fd.get("grade") as string) || "Mumtaz (A)",
      mentor: "Ustadz Pembimbing",
      date: "Hari ini",
    };
    setRecords([newRec, ...records]);
    setFeedback(`Alhamdulillah! Setoran ${newRec.santri} (${newRec.surah}) berhasil dicatat.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateSetoran = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSetoran) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingSetoran,
      santri: (fd.get("santri") as string) || editingSetoran.santri,
      surah: (fd.get("surah") as string) || editingSetoran.surah,
      juz: Number(fd.get("juz")) || editingSetoran.juz,
      type: (fd.get("type") as string) || editingSetoran.type,
      grade: (fd.get("grade") as string) || editingSetoran.grade,
    };
    setRecords(records.map((r) => (r.id === editingSetoran.id ? updated : r)));
    setEditingSetoran(null);
    setFeedback(`Catatan setoran ${updated.santri} berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteSetoran = (id: string, santri: string) => {
    if (confirm(`Yakin ingin menghapus riwayat setoran ${santri}?`)) {
      setRecords(records.filter((r) => r.id !== id));
      setFeedback(`Riwayat setoran ${santri} telah dihapus.`);
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Program Unggulan • Tahfizh Al-Qur&apos;an 30 Juz</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Sentra Tahfizh & Halaqah</h1>
          <p className="text-xs md:text-sm text-emerald-100/80 mt-1">
            Jurnal setoran ziyadah, muraja&apos;ah berkala, tasmi&apos; juz, dan target capaian santri di {tenantName}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Santri Tahfizh" value="428 Santri" subtitle="Aktif setor harian" />
        <StatCard title="Khatam 30 Juz Mutqin" value="38 Santri" subtitle="Alumni & santri aktif" />
        <StatCard title="Setoran Hari Ini" value="342 Setoran" subtitle="Pagi & Sore" />
        <StatCard title="Halaqah Bimbingan" value="24 Kelompok" subtitle="Rata-rata 15 santri" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "setoran", label: "Setoran Ziyadah Harian" },
          { id: "murajaah", label: "Muraja'ah Berkala" },
          { id: "halaqah", label: "Halaqah Saya" },
          { id: "target", label: "Target Hafalan" },
          { id: "ujian", label: "Ujian & Tasmi'" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Quick Setoran */}
        <Card className="p-5 border-slate-200 shadow-sm space-y-4 h-fit">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            Input Setoran Santri
          </h3>
          <form onSubmit={handleAddSetoran} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
              <input
                type="text"
                name="santri"
                required
                placeholder="Contoh: Ahmad Fauzan"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Juz</label>
                <input
                  type="number"
                  name="juz"
                  min="1"
                  max="30"
                  required
                  placeholder="Juz 1-30"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Jenis</label>
                <select name="type" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="ZIYADAH">Ziyadah (Baru)</option>
                  <option value="MURAJAAH">Muraja&apos;ah</option>
                  <option value="TASMI">Tasmi&apos; Ujian</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Surah & Rentang Ayat</label>
              <input
                type="text"
                name="surah"
                required
                placeholder="Contoh: An-Nur ayat 1-20"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Nilai & Predikat</label>
              <select name="grade" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                <option value="Mumtaz (A)">Mumtaz (A) - Lancar & Tajwid Tepat</option>
                <option value="Jayyid Jiddan (B+)">Jayyid Jiddan (B+) - Baik Sekali</option>
                <option value="Jayyid (B)">Jayyid (B) - Cukup Lancar</option>
                <option value="Maqbul (C)">Maqbul (C) - Perlu Diulang</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md flex items-center justify-center gap-1.5 pt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Catatan Setoran</span>
            </button>
          </form>
        </Card>

        {/* List Setoran Terbaru */}
        <div className="lg:col-span-2 space-y-3">
          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-800">Riwayat Setoran Terbaru</h4>
              <span className="text-[11px] text-slate-500">Live Sinkronisasi</span>
            </div>
            <div className="divide-y divide-slate-100">
              {records.map((r) => (
                <div key={r.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{r.santri}</span>
                      <Badge variant="outline" className="text-[10px]">Juz {r.juz}</Badge>
                      <Badge variant={r.type === "ZIYADAH" ? "success" : "info"} className="text-[10px]">{r.type}</Badge>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">📖 {r.surah}</p>
                    <p className="text-[11px] text-slate-400">Penguji: {r.mentor} • {r.date}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="success" className="text-[10px] font-bold">
                      {r.grade}
                    </Badge>
                    <button
                      onClick={() => setEditingSetoran(r)}
                      title="Edit Setoran"
                      className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSetoran(r.id, r.santri)}
                      title="Hapus Setoran"
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal Edit Setoran */}
      {editingSetoran && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Catatan Setoran: {editingSetoran.santri}
              </h3>
              <button onClick={() => setEditingSetoran(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSetoran} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  defaultValue={editingSetoran.santri}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Juz</label>
                  <input
                    type="number"
                    name="juz"
                    defaultValue={editingSetoran.juz}
                    min="1"
                    max="30"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jenis</label>
                  <select name="type" defaultValue={editingSetoran.type} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="ZIYADAH">Ziyadah</option>
                    <option value="MURAJAAH">Muraja&apos;ah</option>
                    <option value="TASMI">Tasmi&apos;</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Surah & Rentang Ayat</label>
                <input
                  type="text"
                  name="surah"
                  defaultValue={editingSetoran.surah}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nilai & Predikat</label>
                <select name="grade" defaultValue={editingSetoran.grade} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="Mumtaz (A)">Mumtaz (A) - Lancar & Tajwid Tepat</option>
                  <option value="Jayyid Jiddan (B+)">Jayyid Jiddan (B+) - Baik Sekali</option>
                  <option value="Jayyid (B)">Jayyid (B) - Cukup Lancar</option>
                  <option value="Maqbul (C)">Maqbul (C) - Perlu Diulang</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSetoran(null)}
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
