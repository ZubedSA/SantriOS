"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Award,
  Sparkles,
  Search,
  PlusCircle,
  Trophy,
  Star,
  CheckCircle2,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface PrestasiClientProps {
  tenantName: string;
}

export default function PrestasiClient({ tenantName }: PrestasiClientProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAch, setEditingAch] = useState<any | null>(null);

  const [achievements, setAchievements] = useState([
    {
      id: "PRS-01",
      santri: "Muhammad Fatih",
      nis: "20260012",
      kelas: "Kelas Ulya 2",
      category: "TAHFIZH_QURAN",
      title: "Juara 1 Musabaqah Hifzhil Qur'an (MHQ) 20 Juz Tingkat Provinsi",
      event: "Festival Santri Nasional 2026",
      date: "14 September 2026",
      reward: "Beasiswa Kitab & Bebas SPP 1 Semester",
    },
    {
      id: "PRS-02",
      santri: "Ahmad Fauzan",
      nis: "20260021",
      kelas: "Kelas Ulya 2",
      category: "KEDISIPLINAN",
      title: "Santri Teladan Disiplin & Kebersihan Kamar Asrama Terbaik",
      event: "Evaluasi Bulanan Kesantrian",
      date: "01 September 2026",
      reward: "Sertifikat Penghargaan & Apresiasi Dewan Pengasuh",
    },
    {
      id: "PRS-03",
      santri: "Zulkifli Mansur",
      nis: "20260035",
      kelas: "Kelas Wustha 1",
      category: "KITAB_KUNING",
      title: "Juara 2 Qira'atul Kutub (Fathul Qorib) Antar Pondok Pesantren",
      event: "Porseni Antar Pontren",
      date: "25 Agustus 2026",
      reward: "Piala & Uang Pembinaan Rp 1.500.000",
    },
  ]);

  const handleAddAchievement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newAch = {
      id: `PRS-0${achievements.length + 1}`,
      santri: (fd.get("santri") as string) || "Santri Berprestasi",
      nis: (fd.get("nis") as string) || "202600" + Math.floor(10 + Math.random() * 80),
      kelas: (fd.get("kelas") as string) || "Kelas Ulya",
      category: (fd.get("category") as string) || "TAHFIZH_QURAN",
      title: (fd.get("title") as string) || "Prestasi Kejuaraan",
      event: (fd.get("event") as string) || "Ajang Perlombaan",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      reward: (fd.get("reward") as string) || "Piagam & Apresiasi",
    };
    setAchievements([newAch, ...achievements]);
    setIsAddOpen(false);
    setFeedback(`Prestasi santri "${newAch.santri}" berhasil dicatat.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateAchievement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAch) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingAch,
      santri: (fd.get("santri") as string) || editingAch.santri,
      title: (fd.get("title") as string) || editingAch.title,
      category: (fd.get("category") as string) || editingAch.category,
      event: (fd.get("event") as string) || editingAch.event,
      reward: (fd.get("reward") as string) || editingAch.reward,
    };
    setAchievements(achievements.map((a) => (a.id === editingAch.id ? updated : a)));
    setEditingAch(null);
    setFeedback(`Prestasi "${updated.title}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteAchievement = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus rekap prestasi "${title}"?`)) {
      setAchievements(achievements.filter((a) => a.id !== id));
      setFeedback(`Prestasi "${title}" telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = achievements.filter(
    (a) =>
      a.santri.toLowerCase().includes(search.toLowerCase()) ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.event.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white shadow-xl border border-amber-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Apresiasi & Teladan • Portofolio Santri Berprestasi</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Prestasi & Rekognisi Santri</h1>
          <p className="text-xs md:text-sm text-amber-100/80 mt-1">
            Pencatatan rekor hafalan Quran, kejuaraan musabaqah, adab teladan, dan prestasi eksternal santri di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-amber-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Catat Prestasi Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Prestasi Tercatat" value={`${achievements.length} Prestasi`} subtitle="Tahun Ajaran 2026/2027" />
        <StatCard title="Tingkat Nasional/Provinsi" value={`${achievements.filter(a => a.category.includes('TAHFIZH')).length} Kejuaraan`} subtitle="MHQ & MQK" />
        <StatCard title="Santri Teladan Disiplin" value="12 Santri" subtitle="Poin adab sempurna" />
        <StatCard title="Beasiswa Penghargaan" value="Rp 24 Juta" subtitle="Telah disalurkan" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari santri, prestasi, ajang kejuaraan..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <Card key={a.id} className="p-5 hover:border-amber-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-[10px]">{a.category.replace("_", " ")}</Badge>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-slate-400 font-mono mr-1">{a.date}</span>
                  <button
                    onClick={() => setEditingAch(a)}
                    title="Edit Prestasi"
                    className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteAchievement(a.id, a.title)}
                    title="Hapus Prestasi"
                    className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{a.title}</h3>
                <p className="text-xs text-slate-600 mt-1 font-semibold">{a.santri} • <span className="font-normal text-slate-500">{a.kelas}</span></p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 space-y-1">
                <p className="font-bold">Apresiasi & Reward:</p>
                <p className="text-amber-800">{a.reward}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Ajang: {a.event}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Tambah Prestasi */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-600" />
                Catat Prestasi Santri Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAchievement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  required
                  placeholder="Contoh: Muhammad Fatih"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kelas</label>
                  <input
                    type="text"
                    name="kelas"
                    placeholder="Kelas Ulya 2"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Bidang / Kategori</label>
                  <select name="category" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="TAHFIZH_QURAN">Tahfizh Qur&apos;an (MHQ)</option>
                    <option value="KITAB_KUNING">Kitab Kuning (MQK)</option>
                    <option value="KEDISIPLINAN">Kedisiplinan & Adab</option>
                    <option value="BAHASA_PIDATO">Pidato & Bahasa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Prestasi / Juara</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Juara 1 Musabaqah Hifzhil Qur'an 20 Juz"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Event / Penyelenggara</label>
                <input
                  type="text"
                  name="event"
                  required
                  placeholder="Festival Santri Nasional 2026 Kemenag"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Penghargaan / Reward</label>
                <input
                  type="text"
                  name="reward"
                  required
                  placeholder="Piala, Sertifikat & Beasiswa SPP 1 Semester"
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
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md"
                >
                  Simpan Prestasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Prestasi */}
      {editingAch && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Prestasi: {editingAch.santri}
              </h3>
              <button onClick={() => setEditingAch(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAchievement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  defaultValue={editingAch.santri}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Bidang Kategori</label>
                <select name="category" defaultValue={editingAch.category} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="TAHFIZH_QURAN">Tahfizh Qur&apos;an (MHQ)</option>
                  <option value="KITAB_KUNING">Kitab Kuning (MQK)</option>
                  <option value="KEDISIPLINAN">Kedisiplinan & Adab</option>
                  <option value="BAHASA_PIDATO">Pidato & Bahasa</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Prestasi</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingAch.title}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Event / Kejuaraan</label>
                <input
                  type="text"
                  name="event"
                  defaultValue={editingAch.event}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Reward</label>
                <input
                  type="text"
                  name="reward"
                  defaultValue={editingAch.reward}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAch(null)}
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
