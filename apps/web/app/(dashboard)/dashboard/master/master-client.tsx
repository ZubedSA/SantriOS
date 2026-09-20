"use client";

import React, { useState } from "react";
import { Card, Badge } from "@santrios/ui";
import {
  Layers,
  PlusCircle,
  Search,
  Building,
  Calendar,
  BookOpen,
  DoorOpen,
  CheckCircle2,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface MasterClientProps {
  tenantName: string;
}

export default function MasterClient({ tenantName }: MasterClientProps) {
  const [activeTab, setActiveTab] = useState<"ta" | "kelas" | "gedung" | "mapel">("ta");
  const [feedback, setFeedback] = useState<string | null>(null);

  // States for Master entities
  const [taList, setTaList] = useState([
    { id: "TA-01", name: "2026/2027 - Semester Ganjil", range: "15 Juli 2026 s/d 20 Desember 2026", status: "AKTIF" },
    { id: "TA-02", name: "2026/2027 - Semester Genap", range: "05 Januari 2027 s/d 20 Juni 2027", status: "MENDATANG" },
    { id: "TA-03", name: "2025/2026 - Semester Genap", range: "05 Januari 2026 s/d 20 Juni 2026", status: "SELESAI" },
  ]);

  const [kelasList, setKelasList] = useState([
    { id: "KLS-01", name: "Kelas Ulya 2 (Aliyah)", wali: "Ustadz Ahmad Fauzi, Lc.", santri: "32 Santri", ruang: "Ruang A-01" },
    { id: "KLS-02", name: "Kelas Ulya 1 (Aliyah)", wali: "Ustadz Mansur, M.Pd.", santri: "28 Santri", ruang: "Ruang A-02" },
    { id: "KLS-03", name: "Kelas Wustha 3 (Tsanawiyah)", wali: "Ustadz Fatih Ridwan", santri: "35 Santri", ruang: "Ruang B-01" },
    { id: "KLS-04", name: "Kelas Wustha 2 (Tsanawiyah)", wali: "Ustadz Zaid Al-Banjari", santri: "30 Santri", ruang: "Ruang B-02" },
    { id: "KLS-05", name: "Kelas Wustha 1 (Tsanawiyah)", wali: "Ustadz Ilham Wahyudi", santri: "34 Santri", ruang: "Ruang B-03" },
  ]);

  const [gedungList, setGedungList] = useState([
    { id: "GDG-01", name: "Gedung Al-Faruq (Asrama Putra)", units: "24 Kamar Mukim", cap: "240 Santri" },
    { id: "GDG-02", name: "Gedung As-Siddiq (KBM Putra)", units: "12 Ruang Kelas", cap: "360 Meja Belajar" },
    { id: "GDG-03", name: "Gedung Khadijah (Asrama Putri)", units: "20 Kamar Mukim", cap: "200 Santriwati" },
    { id: "GDG-04", name: "Masjid Utama Al-Hidayah", units: "2 Lantai Berjamaah", cap: "1.000 Jamaah" },
  ]);

  const [mapelList, setMapelList] = useState([
    { id: "MPL-01", name: "Fiqih (Fathul Qorib Al-Mujib)", level: "Ulya & Wustha", cat: "Diniyah" },
    { id: "MPL-02", name: "Nahwu (Matan Al-Jurumiyah & Imrithi)", level: "Wustha 1-3", cat: "Gramatika Arab" },
    { id: "MPL-03", name: "Shorof (Al-Amtsilah At-Tashrifiyah)", level: "Wustha 1-2", cat: "Gramatika Arab" },
    { id: "MPL-04", name: "Hadits (Arbain An-Nawawiyah)", level: "Semua Tingkat", cat: "Diniyah" },
    { id: "MPL-05", name: "Tahfizh & Tajwid (Al-Jazariyyah)", level: "Intensif Tahfizh", cat: "Tahfizh Quran" },
    { id: "MPL-06", name: "Bahasa Inggris & Umum", level: "Kurikulum Formal", cat: "Akademik Umum" },
  ]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ tab: "ta" | "kelas" | "gedung" | "mapel"; data: any } | null>(null);

  // Add Item
  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (activeTab === "ta") {
      const newItem = {
        id: `TA-0${taList.length + 1}`,
        name: (fd.get("name") as string) || "Tahun Ajaran Baru",
        range: (fd.get("range") as string) || "Periode Tanggal",
        status: (fd.get("status") as string) || "MENDATANG",
      };
      setTaList([...taList, newItem]);
    } else if (activeTab === "kelas") {
      const newItem = {
        id: `KLS-0${kelasList.length + 1}`,
        name: (fd.get("name") as string) || "Nama Rombel",
        wali: (fd.get("wali") as string) || "Wali Kelas",
        santri: `${fd.get("santri") || 30} Santri`,
        ruang: (fd.get("ruang") as string) || "Ruang Kelas",
      };
      setKelasList([...kelasList, newItem]);
    } else if (activeTab === "gedung") {
      const newItem = {
        id: `GDG-0${gedungList.length + 1}`,
        name: (fd.get("name") as string) || "Nama Fasilitas",
        units: (fd.get("units") as string) || "Jumlah Unit",
        cap: (fd.get("cap") as string) || "Kapasitas",
      };
      setGedungList([...gedungList, newItem]);
    } else if (activeTab === "mapel") {
      const newItem = {
        id: `MPL-0${mapelList.length + 1}`,
        name: (fd.get("name") as string) || "Mata Pelajaran",
        level: (fd.get("level") as string) || "Tingkat Santri",
        cat: (fd.get("cat") as string) || "Diniyah",
      };
      setMapelList([...mapelList, newItem]);
    }

    setIsAddOpen(false);
    setFeedback(`Data master ${activeTab.toUpperCase()} berhasil ditambahkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Update Item
  const handleUpdateItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    const form = e.currentTarget;
    const fd = new FormData(form);

    if (editingItem.tab === "ta") {
      const updated = {
        ...editingItem.data,
        name: (fd.get("name") as string) || editingItem.data.name,
        range: (fd.get("range") as string) || editingItem.data.range,
        status: (fd.get("status") as string) || editingItem.data.status,
      };
      setTaList(taList.map((t) => (t.id === updated.id ? updated : t)));
    } else if (editingItem.tab === "kelas") {
      const updated = {
        ...editingItem.data,
        name: (fd.get("name") as string) || editingItem.data.name,
        wali: (fd.get("wali") as string) || editingItem.data.wali,
        ruang: (fd.get("ruang") as string) || editingItem.data.ruang,
      };
      setKelasList(kelasList.map((k) => (k.id === updated.id ? updated : k)));
    } else if (editingItem.tab === "gedung") {
      const updated = {
        ...editingItem.data,
        name: (fd.get("name") as string) || editingItem.data.name,
        units: (fd.get("units") as string) || editingItem.data.units,
        cap: (fd.get("cap") as string) || editingItem.data.cap,
      };
      setGedungList(gedungList.map((g) => (g.id === updated.id ? updated : g)));
    } else if (editingItem.tab === "mapel") {
      const updated = {
        ...editingItem.data,
        name: (fd.get("name") as string) || editingItem.data.name,
        level: (fd.get("level") as string) || editingItem.data.level,
        cat: (fd.get("cat") as string) || editingItem.data.cat,
      };
      setMapelList(mapelList.map((m) => (m.id === updated.id ? updated : m)));
    }

    setEditingItem(null);
    setFeedback(`Data master berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Delete Item
  const handleDeleteItem = (tab: "ta" | "kelas" | "gedung" | "mapel", id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus data master "${name}"?`)) {
      if (tab === "ta") setTaList(taList.filter((t) => t.id !== id));
      if (tab === "kelas") setKelasList(kelasList.filter((k) => k.id !== id));
      if (tab === "gedung") setGedungList(gedungList.filter((g) => g.id !== id));
      if (tab === "mapel") setMapelList(mapelList.filter((m) => m.id !== id));
      setFeedback(`Data "${name}" berhasil dihapus.`);
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Konfigurasi Dasar • Master Data Lembaga</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Master Data Pesantren</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Pengelolaan tahun ajaran, kurikulum, rombongan belajar, gedung asrama, dan ruang kelas di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-400 text-white font-bold text-xs shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Data Master</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "ta", label: `Tahun Ajaran (${taList.length})`, icon: Calendar },
          { id: "kelas", label: `Rombel Kelas (${kelasList.length})`, icon: BookOpen },
          { id: "gedung", label: `Gedung & Fasilitas (${gedungList.length})`, icon: Building },
          { id: "mapel", label: `Mata Pelajaran & Kitab (${mapelList.length})`, icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content per Tab */}
      {activeTab === "ta" && (
        <Card className="p-5 space-y-4 border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Tahun Ajaran & Kalender Akademik</h3>
            <Badge variant="success" className="text-xs">TA Aktif: 2026/2027 Ganjil</Badge>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {taList.map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{t.name}</span>
                  <span className="text-slate-400 block text-[11px]">{t.range}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={t.status === "AKTIF" ? "success" : "outline"} className="text-[10px]">
                    {t.status}
                  </Badge>
                  <button
                    onClick={() => setEditingItem({ tab: "ta", data: t })}
                    title="Edit Tahun Ajaran"
                    className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem("ta", t.id, t.name)}
                    title="Hapus Tahun Ajaran"
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "kelas" && (
        <Card className="p-5 space-y-4 border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">Tingkat Pendidikan & Rombongan Belajar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {kelasList.map((k) => (
              <div key={k.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{k.name}</span>
                    <p className="text-slate-600 mt-0.5">Wali Kelas: <strong>{k.wali}</strong></p>
                    <p className="text-slate-500 text-[11px]">{k.santri} • {k.ruang}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem({ tab: "kelas", data: k })}
                      title="Edit Rombel"
                      className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem("kelas", k.id, k.name)}
                      title="Hapus Rombel"
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "gedung" && (
        <Card className="p-5 space-y-4 border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">Gedung & Fasilitas Pesantren</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {gedungList.map((g) => (
              <div key={g.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{g.name}</span>
                    <p className="text-slate-600 text-[11px] mt-0.5">{g.units}</p>
                    <Badge variant="outline" className="text-[10px] mt-1">{g.cap}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem({ tab: "gedung", data: g })}
                      title="Edit Fasilitas"
                      className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem("gedung", g.id, g.name)}
                      title="Hapus Fasilitas"
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "mapel" && (
        <Card className="p-5 space-y-4 border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">Daftar Mata Pelajaran & Kitab Kuning</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {mapelList.map((m) => (
              <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{m.name}</span>
                  <span className="text-slate-500 text-[11px]">{m.level}</span>
                  <Badge variant="outline" className="text-[10px] mt-1 block w-fit">{m.cat}</Badge>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingItem({ tab: "mapel", data: m })}
                    title="Edit Mapel"
                    className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem("mapel", m.id, m.name)}
                    title="Hapus Mapel"
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal Tambah Master Item */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                Tambah Master: {activeTab.toUpperCase()}
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama / Judul Entitas</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={
                    activeTab === "ta"
                      ? "Contoh: 2027/2028 - Semester Ganjil"
                      : activeTab === "kelas"
                      ? "Contoh: Kelas Ulya 3"
                      : activeTab === "gedung"
                      ? "Contoh: Gedung Tahfizh Baru"
                      : "Contoh: Aqidah (Aqidatul Awwam)"
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {activeTab === "ta" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Rentang Tanggal</label>
                    <input
                      type="text"
                      name="range"
                      placeholder="15 Juli 2027 s/d 20 Desember 2027"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Status</label>
                    <select name="status" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                      <option value="MENDATANG">MENDATANG</option>
                      <option value="AKTIF">AKTIF</option>
                      <option value="SELESAI">SELESAI</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === "kelas" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Wali Kelas</label>
                    <input
                      type="text"
                      name="wali"
                      placeholder="Ustadz Pembimbing"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Kapasitas Santri</label>
                      <input
                        type="number"
                        name="santri"
                        defaultValue={30}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Ruang Kelas</label>
                      <input
                        type="text"
                        name="ruang"
                        placeholder="Ruang A-03"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === "gedung" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Fungsi / Deskripsi Unit</label>
                    <input
                      type="text"
                      name="units"
                      placeholder="Contoh: 10 Kamar Mukim"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kapasitas</label>
                    <input
                      type="text"
                      name="cap"
                      placeholder="Contoh: 100 Santri"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </>
              )}

              {activeTab === "mapel" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tingkat Kelas</label>
                    <input
                      type="text"
                      name="level"
                      placeholder="Contoh: Semua Tingkat / Wustha"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
                    <select name="cat" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                      <option value="Diniyah">Diniyah & Kitab Kuning</option>
                      <option value="Gramatika Arab">Gramatika Arab (Nahwu/Shorof)</option>
                      <option value="Tahfizh Quran">Tahfizh & Tajwid</option>
                      <option value="Akademik Umum">Akademik Umum / Bahasa</option>
                    </select>
                  </div>
                </>
              )}

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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Simpan Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Master Item */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Master: {editingItem.data.name}
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama / Judul</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem.data.name}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              {editingItem.tab === "ta" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Rentang Tanggal</label>
                    <input
                      type="text"
                      name="range"
                      defaultValue={editingItem.data.range}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Status</label>
                    <select name="status" defaultValue={editingItem.data.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                      <option value="MENDATANG">MENDATANG</option>
                      <option value="AKTIF">AKTIF</option>
                      <option value="SELESAI">SELESAI</option>
                    </select>
                  </div>
                </>
              )}

              {editingItem.tab === "kelas" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Wali Kelas</label>
                    <input
                      type="text"
                      name="wali"
                      defaultValue={editingItem.data.wali}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Ruang Kelas</label>
                    <input
                      type="text"
                      name="ruang"
                      defaultValue={editingItem.data.ruang}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </>
              )}

              {editingItem.tab === "gedung" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Fasilitas Unit</label>
                    <input
                      type="text"
                      name="units"
                      defaultValue={editingItem.data.units}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kapasitas</label>
                    <input
                      type="text"
                      name="cap"
                      defaultValue={editingItem.data.cap}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </>
              )}

              {editingItem.tab === "mapel" && (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Tingkat</label>
                    <input
                      type="text"
                      name="level"
                      defaultValue={editingItem.data.level}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
                    <input
                      type="text"
                      name="cat"
                      defaultValue={editingItem.data.cat}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
