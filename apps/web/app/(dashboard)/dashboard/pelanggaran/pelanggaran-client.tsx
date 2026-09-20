"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  ShieldAlert,
  Search,
  PlusCircle,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface PelanggaranClientProps {
  tenantName: string;
}

export default function PelanggaranClient({ tenantName }: PelanggaranClientProps) {
  const [activeTab, setActiveTab] = useState<"kasus" | "poin">("kasus");
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingVio, setEditingVio] = useState<any | null>(null);

  const [violations, setViolations] = useState([
    {
      id: "VIO-01",
      santri: "Muhammad Fatih",
      nis: "20260012",
      kelas: "Kelas Ulya 2",
      kamar: "Kamar Abu Bakar",
      category: "SEDANG",
      description: "Terlambat shalat shubuh berjamaah di masjid lebih dari 15 menit",
      points: -5,
      date: "20 September 2026",
      officer: "Ustadz Mansur (Kesantrian)",
      taazirStatus: "BELUM_TUNTAS",
      action: "Setoran hafalan 1/2 juz & piket teras masjid",
    },
    {
      id: "VIO-02",
      santri: "Zulfikar Hidayat",
      nis: "20260044",
      kelas: "Kelas Wustha 3",
      kamar: "Kamar Umar",
      category: "BERAT",
      description: "Membawa dan menyimpan gadget/smartphone di dalam asrama tanpa izin",
      points: -20,
      date: "18 September 2026",
      officer: "Ustadz Fatih",
      taazirStatus: "BELUM_TUNTAS",
      action: "Penyitaan barang & pemanggilan wali santri ke kantor",
    },
    {
      id: "VIO-03",
      santri: "Daffa Ibnu Sina",
      nis: "20260023",
      kelas: "Kelas Wustha 2",
      kamar: "Kamar Utsman",
      category: "RINGAN",
      description: "Tidak memakai peci saat masuk jam pelajaran KBM diniyah",
      points: -2,
      date: "17 September 2026",
      officer: "Ustadz Zaid",
      taazirStatus: "SELESAI",
      action: "Teguran lisan & mencatat kosa kata bahasa Arab",
    },
  ]);

  const handleCompleteTaazir = (id: string) => {
    setViolations(violations.map((v) => (v.id === id ? { ...v, taazirStatus: "SELESAI" } : v)));
    setFeedback("Ta'zir edukatif telah dituntaskan santri dan diverifikasi oleh kesantrian.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddViolation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const category = (fd.get("category") as string) || "RINGAN";
    const defaultPoints = category === "BERAT" ? -20 : category === "SEDANG" ? -5 : -2;
    const newVio = {
      id: `VIO-0${violations.length + 1}`,
      santri: (fd.get("santri") as string) || "Santri",
      nis: (fd.get("nis") as string) || "20260015",
      kelas: (fd.get("kelas") as string) || "Kelas Ulya 1",
      kamar: (fd.get("kamar") as string) || "Kamar Asrama",
      category,
      description: (fd.get("description") as string) || "Keterangan pelanggaran",
      points: Number(fd.get("points")) || defaultPoints,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      officer: "Bagian Kesantrian",
      taazirStatus: "BELUM_TUNTAS",
      action: (fd.get("action") as string) || "Sanksi edukatif santri",
    };
    setViolations([newVio, ...violations]);
    setIsAddOpen(false);
    setFeedback(`Pelanggaran santri "${newVio.santri}" berhasil dicatat.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateViolation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingVio) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingVio,
      santri: (fd.get("santri") as string) || editingVio.santri,
      category: (fd.get("category") as string) || editingVio.category,
      description: (fd.get("description") as string) || editingVio.description,
      points: Number(fd.get("points")) || editingVio.points,
      action: (fd.get("action") as string) || editingVio.action,
      taazirStatus: (fd.get("taazirStatus") as string) || editingVio.taazirStatus,
    };
    setViolations(violations.map((v) => (v.id === editingVio.id ? updated : v)));
    setEditingVio(null);
    setFeedback(`Catatan pelanggaran "${updated.santri}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteViolation = (id: string, santri: string) => {
    if (confirm(`Yakin ingin menghapus catatan pelanggaran untuk ${santri}?`)) {
      setViolations(violations.filter((v) => v.id !== id));
      setFeedback(`Catatan pelanggaran ${santri} telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = violations.filter(
    (v) =>
      v.santri.toLowerCase().includes(search.toLowerCase()) ||
      v.nis.includes(search) ||
      v.description.toLowerCase().includes(search.toLowerCase())
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-amber-950 text-white shadow-xl border border-rose-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Kedisiplinan & Tata Tertib • Bagian Kesantrian</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Kedisiplinan & Pelanggaran</h1>
          <p className="text-xs md:text-sm text-rose-100/80 mt-1">
            Pencatatan pelanggaran adab santri, pembobotan poin ta&apos;zir, dan kontrol sanksi edukatif di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-rose-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Catat Kasus Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Kasus Tercatat" value={`${violations.length} Kasus`} subtitle="Tercatat dalam sistem" />
        <StatCard title="Ta'zir Belum Tuntas" value={`${violations.filter(v => v.taazirStatus !== 'SELESAI').length} Santri`} subtitle="Menjalani bimbingan" />
        <StatCard title="Rata-rata Poin Disiplin" value="94 / 100" subtitle="Kategori Sangat Baik" />
        <StatCard title="Pelanggaran Berat" value={`${violations.filter(v => v.category === 'BERAT').length} Kasus`} subtitle="Perlu tindak lanjut" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "kasus", label: `Daftar Kasus Pelanggaran (${violations.length})` },
          { id: "poin", label: "Tabel Konfigurasi Poin Ta'zir" },
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

      {activeTab === "kasus" ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari santri, NIS, atau kronologi..."
              className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Santri & Kamar</th>
                    <th className="py-3 px-4">Pelanggaran & Kronologi</th>
                    <th className="py-3 px-4">Bobot Poin</th>
                    <th className="py-3 px-4">Tindakan Edukatif (Ta'zir)</th>
                    <th className="py-3 px-4">Petugas & Tanggal</th>
                    <th className="py-3 px-4 text-center">Status & Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div>{v.santri}</div>
                        <div className="text-[11px] font-mono text-slate-400">NIS: {v.nis} • {v.kamar}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-800 font-medium">{v.description}</div>
                        <Badge variant={v.category === "BERAT" ? "danger" : v.category === "SEDANG" ? "warning" : "default"} className="text-[10px] mt-1">
                          Kategori {v.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-rose-600 text-sm font-mono">{v.points}</td>
                      <td className="py-3 px-4 text-slate-700">{v.action}</td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{v.date}</div>
                        <div className="text-[11px]">{v.officer}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {v.taazirStatus === "BELUM_TUNTAS" ? (
                            <button
                              onClick={() => handleCompleteTaazir(v.id)}
                              className="px-2.5 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] shadow-xs"
                            >
                              Tuntas
                            </button>
                          ) : (
                            <Badge variant="success" className="text-[10px]">TUNTAS</Badge>
                          )}
                          <button
                            onClick={() => setEditingVio(v)}
                            title="Edit Kasus"
                            className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteViolation(v.id, v.santri)}
                            title="Hapus Kasus"
                            className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
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
      ) : (
        <Card className="p-5 border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Konfigurasi Aturan Poin Pelanggaran (SOP Pesantren)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { rule: "Terlambat apel / upacara pagi", pts: "-2 Poin", cat: "RINGAN" },
              { rule: "Tidak mengikuti shalat berjamaah tanpa uzur", pts: "-5 Poin", cat: "SEDANG" },
              { rule: "Keluar gerbang pondok tanpa surat izin resmi", pts: "-10 Poin", cat: "SEDANG" },
              { rule: "Membawa/menyimpan smartphone tanpa izin", pts: "-20 Poin", cat: "BERAT" },
              { rule: "Merokok / Vaping di lingkungan pesantren", pts: "-30 Poin", cat: "BERAT" },
              { rule: "Perkelahian / Tindakan merugikan sesama santri", pts: "-50 Poin", cat: "SANGAT BERAT" },
            ].map((r, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{r.rule}</span>
                  <Badge variant="outline" className="text-[10px] mt-1">{r.cat}</Badge>
                </div>
                <span className="font-bold text-rose-600 text-sm font-mono">{r.pts}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Modal Tambah Pelanggaran */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-600" />
                Catat Kasus Pelanggaran Santri
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddViolation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  required
                  placeholder="Contoh: Zulfikar Hidayat"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">NIS</label>
                  <input
                    type="text"
                    name="nis"
                    placeholder="20260044"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kamar Asrama</label>
                  <input
                    type="text"
                    name="kamar"
                    placeholder="Kamar Umar"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
                  <select name="category" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="RINGAN">RINGAN (-2 Poin)</option>
                    <option value="SEDANG">SEDANG (-5 Poin)</option>
                    <option value="BERAT">BERAT (-20 Poin)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pengurangan Poin</label>
                  <input
                    type="number"
                    name="points"
                    placeholder="-5"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-rose-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kronologi / Uraian Pelanggaran</label>
                <textarea
                  name="description"
                  rows={2}
                  required
                  placeholder="Uraikan detail kejadian dengan jelas..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Tindakan Edukatif (Ta'zir)</label>
                <input
                  type="text"
                  name="action"
                  required
                  placeholder="Setoran hafalan 1/2 juz & piket masjid"
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
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pelanggaran */}
      {editingVio && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Kasus: {editingVio.santri}
              </h3>
              <button onClick={() => setEditingVio(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateViolation} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  defaultValue={editingVio.santri}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kategori</label>
                  <select name="category" defaultValue={editingVio.category} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="RINGAN">RINGAN</option>
                    <option value="SEDANG">SEDANG</option>
                    <option value="BERAT">BERAT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Bobot Poin</label>
                  <input
                    type="number"
                    name="points"
                    defaultValue={editingVio.points}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-rose-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Kronologi</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingVio.description}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Ta'zir Edukatif</label>
                <input
                  type="text"
                  name="action"
                  defaultValue={editingVio.action}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Status Ta'zir</label>
                <select name="taazirStatus" defaultValue={editingVio.taazirStatus} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="BELUM_TUNTAS">BELUM_TUNTAS</option>
                  <option value="SELESAI">SELESAI</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingVio(null)}
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
