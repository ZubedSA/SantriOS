"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Home,
  Building,
  Users,
  Search,
  CheckCircle2,
  Sparkles,
  BedDouble,
  PlusCircle,
  Edit3,
  Trash2,
  X,
} from "lucide-react";

interface AsramaClientProps {
  tenantName: string;
}

export default function AsramaClient({ tenantName }: AsramaClientProps) {
  const [selectedGedung, setSelectedGedung] = useState("ALL");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);

  const [rooms, setRooms] = useState([
    {
      id: "KMR-A01",
      name: "Kamar Abu Bakar As-Siddiq",
      gedung: "Gedung Al-Faruq (Putra)",
      capacity: 10,
      occupants: 10,
      musyrif: "Ustadz Mansur",
      cleanliness: "A (Sangat Bersih)",
      status: "PENUH",
    },
    {
      id: "KMR-A02",
      name: "Kamar Umar Bin Khattab",
      gedung: "Gedung Al-Faruq (Putra)",
      capacity: 10,
      occupants: 9,
      musyrif: "Ustadz Fatih Ridwan",
      cleanliness: "B+ (Rapi)",
      status: "TERSEDIA_1",
    },
    {
      id: "KMR-A03",
      name: "Kamar Utsman Bin Affan",
      gedung: "Gedung Al-Faruq (Putra)",
      capacity: 12,
      occupants: 11,
      musyrif: "Ustadz Zaid",
      cleanliness: "A (Sangat Bersih)",
      status: "TERSEDIA_1",
    },
    {
      id: "KMR-B01",
      name: "Kamar Aisyah Binti Abu Bakar",
      gedung: "Gedung Khadijah (Putri)",
      capacity: 10,
      occupants: 10,
      musyrif: "Ustadzah Fatimah",
      cleanliness: "A (Sangat Bersih)",
      status: "PENUH",
    },
  ]);

  const handleAddRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const cap = Number(fd.get("capacity")) || 10;
    const occ = Number(fd.get("occupants")) || 0;
    const newRoom = {
      id: `KMR-${Date.now().toString().slice(-4)}`,
      name: (fd.get("name") as string) || "Kamar Baru",
      gedung: (fd.get("gedung") as string) || "Gedung Al-Faruq (Putra)",
      capacity: cap,
      occupants: occ,
      musyrif: (fd.get("musyrif") as string) || "Ustadz Pembina",
      cleanliness: (fd.get("cleanliness") as string) || "A (Sangat Bersih)",
      status: occ >= cap ? "PENUH" : `TERSEDIA_${cap - occ}`,
    };
    setRooms([...rooms, newRoom]);
    setIsAddOpen(false);
    setFeedback(`Kamar "${newRoom.name}" berhasil ditambahkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRoom) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const cap = Number(fd.get("capacity")) || editingRoom.capacity;
    const occ = Number(fd.get("occupants")) || editingRoom.occupants;
    const updated = {
      ...editingRoom,
      name: (fd.get("name") as string) || editingRoom.name,
      gedung: (fd.get("gedung") as string) || editingRoom.gedung,
      capacity: cap,
      occupants: occ,
      musyrif: (fd.get("musyrif") as string) || editingRoom.musyrif,
      cleanliness: (fd.get("cleanliness") as string) || editingRoom.cleanliness,
      status: occ >= cap ? "PENUH" : `TERSEDIA_${cap - occ}`,
    };
    setRooms(rooms.map((r) => (r.id === editingRoom.id ? updated : r)));
    setEditingRoom(null);
    setFeedback(`Data kamar "${updated.name}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteRoom = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus data kamar "${name}"?`)) {
      setRooms(rooms.filter((r) => r.id !== id));
      setFeedback(`Kamar "${name}" telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = rooms.filter((r) => selectedGedung === "ALL" || r.gedung.includes(selectedGedung));

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
            <Home className="w-4 h-4" />
            <span>Hunian Santri Mukim • Manajemen Asrama & Kamar</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Manajemen Asrama & Kamar</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Kapasitas ranjang, penghuni kamar, musyrif pembina, dan penilaian kebersihan asrama di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-400 text-white font-bold text-xs shadow-lg hover:shadow-sky-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Kamar Asrama</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Gedung" value="4 Gedung" subtitle="Putra & Putri" />
        <StatCard title="Total Kamar Mukim" value={`${rooms.length} Kamar`} subtitle="Dikelola penuh" />
        <StatCard title="Total Santri Mukim" value={`${rooms.reduce((s, r) => s + r.occupants, 0)} Santri`} subtitle="Kapasitas aktif" />
        <StatCard title="Sisa Ranjang" value={`${rooms.reduce((s, r) => s + (r.capacity - r.occupants), 0)} Slot`} subtitle="Siap ditempati" />
      </div>

      <div className="flex items-center gap-2">
        {["ALL", "Putra", "Putri"].map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGedung(g)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedGedung === g ? "bg-slate-900 text-white shadow-sm" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {g === "ALL" ? "Semua Asrama" : `Asrama ${g}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <Card key={r.id} className="p-5 hover:border-sky-400 hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant="outline" className="text-[10px]">{r.gedung}</Badge>
              <div className="flex items-center gap-1.5">
                <Badge variant={r.status === "PENUH" ? "default" : "success"} className="text-[10px]">
                  {r.occupants}/{r.capacity} Penghuni
                </Badge>
                <button
                  onClick={() => setEditingRoom(r)}
                  title="Edit Kamar"
                  className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteRoom(r.id, r.name)}
                  title="Hapus Kamar"
                  className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-900">{r.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">Musyrif Kamar: <strong className="text-slate-800">{r.musyrif}</strong></p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Skor Kebersihan & Kerapian:</span>
              <strong className="text-emerald-700 font-semibold">{r.cleanliness}</strong>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Kamar */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-sky-600" />
                Tambah Kamar Asrama Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Kamar</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Kamar Ali Bin Abi Thalib"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Gedung Asrama</label>
                <select name="gedung" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="Gedung Al-Faruq (Putra)">Gedung Al-Faruq (Putra)</option>
                  <option value="Gedung Khadijah (Putri)">Gedung Khadijah (Putri)</option>
                  <option value="Gedung As-Siddiq (Putra)">Gedung As-Siddiq (Putra)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kapasitas Ranjang</label>
                  <input
                    type="number"
                    name="capacity"
                    defaultValue={10}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Penghuni Terisi</label>
                  <input
                    type="number"
                    name="occupants"
                    defaultValue={0}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Musyrif Pembina</label>
                <input
                  type="text"
                  name="musyrif"
                  required
                  placeholder="Ustadz Zaid"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Penilaian Kebersihan</label>
                <select name="cleanliness" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="A (Sangat Bersih)">A (Sangat Bersih)</option>
                  <option value="B+ (Rapi)">B+ (Rapi)</option>
                  <option value="B (Cukup)">B (Cukup)</option>
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
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-md"
                >
                  Simpan Kamar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Kamar */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Kamar: {editingRoom.name}
              </h3>
              <button onClick={() => setEditingRoom(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Kamar</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingRoom.name}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Gedung</label>
                <select name="gedung" defaultValue={editingRoom.gedung} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="Gedung Al-Faruq (Putra)">Gedung Al-Faruq (Putra)</option>
                  <option value="Gedung Khadijah (Putri)">Gedung Khadijah (Putri)</option>
                  <option value="Gedung As-Siddiq (Putra)">Gedung As-Siddiq (Putra)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kapasitas</label>
                  <input
                    type="number"
                    name="capacity"
                    defaultValue={editingRoom.capacity}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Penghuni</label>
                  <input
                    type="number"
                    name="occupants"
                    defaultValue={editingRoom.occupants}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Musyrif</label>
                <input
                  type="text"
                  name="musyrif"
                  defaultValue={editingRoom.musyrif}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kebersihan</label>
                <select name="cleanliness" defaultValue={editingRoom.cleanliness} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="A (Sangat Bersih)">A (Sangat Bersih)</option>
                  <option value="B+ (Rapi)">B+ (Rapi)</option>
                  <option value="B (Cukup)">B (Cukup)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
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
