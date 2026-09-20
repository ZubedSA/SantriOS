"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Users,
  Search,
  Phone,
  MessageCircle,
  Link as LinkIcon,
  CheckCircle2,
  Mail,
  X,
  PlusCircle,
  Edit3,
  Trash2,
  UserPlus,
} from "lucide-react";

interface WaliSantriClientProps {
  tenantName: string;
}

export default function WaliSantriClient({ tenantName }: WaliSantriClientProps) {
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingWali, setEditingWali] = useState<any | null>(null);

  const [guardians, setGuardians] = useState([
    {
      id: "WLI-001",
      name: "Bpk. H. Fathurrahman",
      santriList: ["Ahmad Fauzan (Kelas Ulya 2)", "Fatimah Azzahra (Kelas Wustha 1)"],
      relation: "Ayah Kandung",
      phone: "0812-9988-7711",
      city: "Semarang, Jawa Tengah",
      portalStatus: "TERHUBUNG",
    },
    {
      id: "WLI-002",
      name: "Ibu Dra. Hj. Rahmawati",
      santriList: ["Rizky Ramadhan (Kelas Wustha 3)"],
      relation: "Ibu Kandung",
      phone: "0813-2233-4455",
      city: "Surakarta, Jawa Tengah",
      portalStatus: "TERHUBUNG",
    },
    {
      id: "WLI-003",
      name: "Bpk. Bambang Sulistyo",
      santriList: ["Rizky Dwi Ananda (Calon Santri PPDB)"],
      relation: "Ayah Kandung",
      phone: "0812-3456-7890",
      city: "Sleman, D.I. Yogyakarta",
      portalStatus: "BELUM_TERHUBUNG",
    },
    {
      id: "WLI-004",
      name: "Bpk. Ali Ridho, S.T.",
      santriList: ["Haidar Ali (Kelas Ulya 1)"],
      relation: "Wali Santri",
      phone: "0852-1122-3344",
      city: "Surabaya, Jawa Timur",
      portalStatus: "TERHUBUNG",
    },
  ]);

  const handleSendInvite = (phone: string, name: string) => {
    setFeedback(`Tautan aktivasi portal wali santri telah disiapkan untuk dikirim ke WhatsApp ${name} (${phone}).`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddGuardian = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const santriStr = (fd.get("santriList") as string) || "Santri";
    const newWali = {
      id: `WLI-00${guardians.length + 1}`,
      name: (fd.get("name") as string) || "Wali Santri Baru",
      santriList: santriStr.split(",").map((s) => s.trim()),
      relation: (fd.get("relation") as string) || "Ayah Kandung",
      phone: (fd.get("phone") as string) || "0812-0000-0000",
      city: (fd.get("city") as string) || "Kota Domisili",
      portalStatus: "BELUM_TERHUBUNG",
    };
    setGuardians([newWali, ...guardians]);
    setIsAddOpen(false);
    setFeedback(`Data wali "${newWali.name}" berhasil ditambahkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateGuardian = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingWali) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const santriStr = (fd.get("santriList") as string) || editingWali.santriList.join(", ");
    const updated = {
      ...editingWali,
      name: (fd.get("name") as string) || editingWali.name,
      relation: (fd.get("relation") as string) || editingWali.relation,
      phone: (fd.get("phone") as string) || editingWali.phone,
      city: (fd.get("city") as string) || editingWali.city,
      portalStatus: (fd.get("portalStatus") as string) || editingWali.portalStatus,
      santriList: santriStr.split(",").map((s) => s.trim()),
    };
    setGuardians(guardians.map((g) => (g.id === editingWali.id ? updated : g)));
    setEditingWali(null);
    setFeedback(`Data wali "${updated.name}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteGuardian = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus data wali "${name}"?`)) {
      setGuardians(guardians.filter((g) => g.id !== id));
      setFeedback(`Data wali "${name}" telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = guardians.filter((g) => {
    return (
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search) ||
      g.santriList.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    );
  });

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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-sky-950 text-white shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Keluarga & Relasi • Portal Wali Santri</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Direktori Wali Santri</h1>
          <p className="text-xs md:text-sm text-teal-100/80 mt-1">
            Sinkronisasi nomor WhatsApp orang tua/wali dengan santri mukim, undangan portal rapor & SPP di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-teal-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Wali Santri</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Total Wali Terdaftar" value={`${guardians.length} Wali`} subtitle="Terverifikasi dalam sistem" />
        <StatCard title="Portal Aktif" value={`${guardians.filter(g => g.portalStatus === 'TERHUBUNG').length} Akun`} subtitle="Menerima broadcast WA berkala" />
        <StatCard title="Belum Terhubung" value={`${guardians.filter(g => g.portalStatus !== 'TERHUBUNG').length} Akun`} subtitle="Perlu kirim undangan" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama wali, nomor WhatsApp, atau nama anak..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Wali Santri</th>
                  <th className="py-3 px-4">Santri yang Dihubungkan</th>
                  <th className="py-3 px-4">Nomor WhatsApp</th>
                  <th className="py-3 px-4">Kota Domisili</th>
                  <th className="py-3 px-4">Status Portal</th>
                  <th className="py-3 px-4 text-center">Aksi Hubungan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{g.name}</div>
                      <Badge variant="outline" className="text-[10px] mt-1">{g.relation}</Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="space-y-0.5">
                        {g.santriList.map((s, idx) => (
                          <div key={idx} className="font-medium text-slate-900">• {s}</div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-emerald-800 font-semibold">{g.phone}</td>
                    <td className="py-3 px-4 text-slate-600">{g.city}</td>
                    <td className="py-3 px-4">
                      <Badge variant={g.portalStatus === "TERHUBUNG" ? "success" : "warning"} className="text-[10px]">
                        {g.portalStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleSendInvite(g.phone, g.name)}
                          title="Kirim Undangan WhatsApp"
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] inline-flex items-center gap-1 border border-emerald-200"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kirim WA</span>
                        </button>
                        <button
                          onClick={() => setEditingWali(g)}
                          title="Edit Data Wali"
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuardian(g.id, g.name)}
                          title="Hapus Data Wali"
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

      {/* Modal Tambah Wali Santri */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-600" />
                Tambah Hubungan Wali Santri
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGuardian} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap Wali</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Bpk. Gunawan Wibisono"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hubungan Keluarga</label>
                  <select name="relation" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="Ayah Kandung">Ayah Kandung</option>
                    <option value="Ibu Kandung">Ibu Kandung</option>
                    <option value="Wali Santri">Wali / Kerabat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    placeholder="0812-3456-7890"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Santri Asuhan (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  name="santriList"
                  required
                  placeholder="Ahmad Fauzan (Kelas Ulya 2)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kota / Kabupaten Domisili</label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Kudus, Jawa Tengah"
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
                  Simpan Wali
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Wali Santri */}
      {editingWali && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Wali: {editingWali.name}
              </h3>
              <button onClick={() => setEditingWali(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateGuardian} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap Wali</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingWali.name}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hubungan</label>
                  <select name="relation" defaultValue={editingWali.relation} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="Ayah Kandung">Ayah Kandung</option>
                    <option value="Ibu Kandung">Ibu Kandung</option>
                    <option value="Wali Santri">Wali / Kerabat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingWali.phone}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Santri Asuhan (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  name="santriList"
                  defaultValue={editingWali.santriList.join(", ")}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kota Domisili</label>
                  <input
                    type="text"
                    name="city"
                    defaultValue={editingWali.city}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status Portal</label>
                  <select name="portalStatus" defaultValue={editingWali.portalStatus} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="TERHUBUNG">TERHUBUNG</option>
                    <option value="BELUM_TERHUBUNG">BELUM_TERHUBUNG</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWali(null)}
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
