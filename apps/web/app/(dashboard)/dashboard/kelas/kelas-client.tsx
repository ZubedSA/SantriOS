"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  BookOpen,
  Users,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  PlusCircle,
  Edit3,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";

interface KelasClientProps {
  tenantName: string;
}

export default function KelasClient({ tenantName }: KelasClientProps) {
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any | null>(null);

  const [classes, setClasses] = useState([
    {
      id: "KLS-01",
      name: "Kelas Ulya 2 (SMA Tingkat Akhir)",
      wali: "Ustadz Ahmad Fauzi, Lc.",
      total: 32,
      hadirToday: 32,
      room: "Ruang A-01 (Lantai 2)",
      program: "KMI & Aliyah Terpadu",
    },
    {
      id: "KLS-02",
      name: "Kelas Ulya 1 (SMA Tingkat Awal)",
      wali: "Ustadz Mansur, M.Pd.",
      total: 28,
      hadirToday: 27,
      room: "Ruang A-02 (Lantai 2)",
      program: "KMI & Aliyah Terpadu",
    },
    {
      id: "KLS-03",
      name: "Kelas Wustha 3 (SMP Tingkat Akhir)",
      wali: "Ustadz Fatih Ridwan, S.Pd.I.",
      total: 35,
      hadirToday: 34,
      room: "Ruang B-01 (Lantai 1)",
      program: "Tsanawiyah & Tahfizh",
    },
    {
      id: "KLS-04",
      name: "Kelas Wustha 2 (SMP)",
      wali: "Ustadz Zaid Al-Banjari",
      total: 30,
      hadirToday: 30,
      room: "Ruang B-02 (Lantai 1)",
      program: "Tsanawiyah & Tahfizh",
    },
    {
      id: "KLS-05",
      name: "Kelas Wustha 1 (SMP Tingkat Awal)",
      wali: "Ustadz Ilham Wahyudi",
      total: 34,
      hadirToday: 33,
      room: "Ruang B-03 (Lantai 1)",
      program: "Tsanawiyah & Tahfizh",
    },
  ]);

  const handleAddClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newCls = {
      id: `KLS-0${classes.length + 1}`,
      name: (fd.get("name") as string) || "Kelas Baru",
      wali: (fd.get("wali") as string) || "Wali Kelas",
      total: Number(fd.get("total")) || 30,
      hadirToday: Number(fd.get("total")) || 30,
      room: (fd.get("room") as string) || "Ruang Kelas",
      program: (fd.get("program") as string) || "KMI & Aliyah Terpadu",
    };
    setClasses([...classes, newCls]);
    setIsAddOpen(false);
    setFeedback(`Rombel "${newCls.name}" berhasil dibuat.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateClass = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingClass) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingClass,
      name: (fd.get("name") as string) || editingClass.name,
      wali: (fd.get("wali") as string) || editingClass.wali,
      total: Number(fd.get("total")) || editingClass.total,
      room: (fd.get("room") as string) || editingClass.room,
      program: (fd.get("program") as string) || editingClass.program,
    };
    setClasses(classes.map((c) => (c.id === editingClass.id ? updated : c)));
    setEditingClass(null);
    setFeedback(`Data rombel "${updated.name}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteClass = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus rombel kelas "${name}"?`)) {
      setClasses(classes.filter((c) => c.id !== id));
      setFeedback(`Rombel "${name}" telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = classes.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.wali.toLowerCase().includes(search.toLowerCase())
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-sky-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Akademik Pesantren • Rombongan Belajar</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Manajemen Kelas & Rombel</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Daftar rombel santri, wali kelas pembimbing, ruang belajar, dan presensi KBM di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-400 text-white font-bold text-xs shadow-lg hover:shadow-sky-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Rombel Kelas</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Rombel" value={`${classes.length} Kelas`} subtitle="Ulya & Wustha" />
        <StatCard title="Total Santri KBM" value={`${classes.reduce((sum, c) => sum + c.total, 0)} Santri`} subtitle="Aktif belajar mukim" />
        <StatCard title="Wali Kelas" value={`${classes.length} Asatidz`} subtitle="Semua terbina" />
        <StatCard title="Kehadiran KBM" value="98.2%" subtitle="Hari ini" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama kelas atau wali kelas..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <Card key={c.id} className="p-5 hover:border-sky-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="text-[10px]">{c.id}</Badge>
                <div className="flex items-center gap-1">
                  <Badge variant="success" className="text-[10px]">{c.hadirToday}/{c.total} Hadir</Badge>
                  <button
                    onClick={() => setEditingClass(c)}
                    title="Edit Kelas"
                    className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteClass(c.id, c.name)}
                    title="Hapus Kelas"
                    className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{c.program}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-700">
                <p>Wali Kelas: <strong>{c.wali}</strong></p>
                <p className="text-slate-500 text-[11px] flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {c.room}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href={`/dashboard/santri?class=${encodeURIComponent(c.name)}`}
                  className="text-sky-700 font-bold hover:underline"
                >
                  Lihat Santri &rarr;
                </Link>
                <Link
                  href={`/dashboard/absensi?class=${encodeURIComponent(c.name)}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold"
                >
                  Absensi KBM
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Tambah Rombel */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-sky-600" />
                Tambah Rombel Kelas Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Rombel</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Kelas Ulya 3 (SMA)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Program Kurikulum</label>
                <input
                  type="text"
                  name="program"
                  required
                  defaultValue="KMI & Aliyah Terpadu"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Wali Kelas</label>
                  <input
                    type="text"
                    name="wali"
                    required
                    placeholder="Ustadz Pembimbing"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kapasitas</label>
                  <input
                    type="number"
                    name="total"
                    defaultValue={30}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ruangan Belajar</label>
                <input
                  type="text"
                  name="room"
                  required
                  placeholder="Ruang A-03 (Lantai 2)"
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
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Rombel */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Rombel: {editingClass.name}
              </h3>
              <button onClick={() => setEditingClass(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateClass} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Rombel</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingClass.name}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Program Kurikulum</label>
                <input
                  type="text"
                  name="program"
                  defaultValue={editingClass.program}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Wali Kelas</label>
                  <input
                    type="text"
                    name="wali"
                    defaultValue={editingClass.wali}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kapasitas</label>
                  <input
                    type="number"
                    name="total"
                    defaultValue={editingClass.total}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ruang Kelas</label>
                <input
                  type="text"
                  name="room"
                  defaultValue={editingClass.room}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
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
