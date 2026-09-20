"use client";

import React, { useState } from "react";
import { Card, Badge } from "@santrios/ui";
import {
  DoorOpen,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Printer,
  X,
  Phone,
  Edit3,
  Trash2,
} from "lucide-react";

interface PerizinanClientProps {
  tenantName: string;
  userRole: string;
}

export default function PerizinanClient({ tenantName, userRole }: PerizinanClientProps) {
  const [activeTab, setActiveTab] = useState<"semua" | "menunggu" | "aktif" | "belum_kembali" | "riwayat">("semua");
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPermit, setEditingPermit] = useState<any | null>(null);

  const [permits, setPermits] = useState([
    {
      id: "IZN-2026-091",
      santri: "Muhammad Fatih",
      nis: "20260012",
      kelas: "Kelas Ulya 2",
      alasan: "Menghadiri pernikahan kakak kandung di Surabaya",
      tipe: "PULANG",
      tglKeluar: "18 Sep 2026, 08.00",
      tglKembali: "20 Sep 2026, 17.00",
      status: "BELUM_KEMBALI",
      isOverdue: true,
      wali: "Bpk. Fathurrahman (0812-9988-7711)",
    },
    {
      id: "IZN-2026-092",
      santri: "Rizky Ramadhan",
      nis: "20260018",
      kelas: "Kelas Wustha 3",
      alasan: "Pemeriksaan kesehatan mata & spesialis di RSUD",
      tipe: "BEROBAT",
      tglKeluar: "20 Sep 2026, 09.00",
      tglKembali: "20 Sep 2026, 16.00",
      status: "AKTIF",
      isOverdue: false,
      wali: "Ibu Rahmawati (0813-2233-4455)",
    },
    {
      id: "IZN-2026-093",
      santri: "Haidar Ali",
      nis: "20260029",
      kelas: "Kelas Ulya 1",
      alasan: "Izin kepulangan perpanjangan keluarga",
      tipe: "PULANG",
      tglKeluar: "21 Sep 2026, 07.00",
      tglKembali: "23 Sep 2026, 17.00",
      status: "MENUNGGU",
      isOverdue: false,
      wali: "Bpk. Ali Ridho (0852-1122-3344)",
    },
    {
      id: "IZN-2026-094",
      santri: "Zulkifli Mansur",
      nis: "20260035",
      kelas: "Kelas Wustha 1",
      alasan: "Izin berobat flu & istirahat",
      tipe: "BEROBAT",
      tglKeluar: "16 Sep 2026, 10.00",
      tglKembali: "18 Sep 2026, 17.00",
      status: "SELESAI",
      isOverdue: false,
      wali: "Bpk. Mansur (0877-4433-2211)",
    },
  ]);

  const handleApprove = (id: string) => {
    setPermits(permits.map((p) => (p.id === id ? { ...p, status: "AKTIF" } : p)));
    setFeedback(`Izin ${id} berhasil disetujui! Santri diizinkan meninggalkan gerbang pondok.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCheckIn = (id: string) => {
    setPermits(permits.map((p) => (p.id === id ? { ...p, status: "SELESAI", isOverdue: false } : p)));
    setFeedback(`Santri telah check-in kembali ke pesantren dengan tertib.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddPermit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newPermit = {
      id: `IZN-2026-${Math.floor(100 + Math.random() * 900)}`,
      santri: (fd.get("santri") as string) || "Nama Santri",
      nis: (fd.get("nis") as string) || "202600" + Math.floor(10 + Math.random() * 80),
      kelas: (fd.get("kelas") as string) || "Kelas Ulya",
      alasan: (fd.get("alasan") as string) || "Izin Resmi",
      tipe: (fd.get("tipe") as string) || "PULANG",
      tglKeluar: (fd.get("tglKeluar") as string) || "Hari ini, 08.00",
      tglKembali: (fd.get("tglKembali") as string) || "Besok, 17.00",
      status: "MENUNGGU",
      isOverdue: false,
      wali: (fd.get("wali") as string) || "Wali Santri",
    };
    setPermits([newPermit, ...permits]);
    setIsAddOpen(false);
    setFeedback(`Permohonan izin baru untuk ${newPermit.santri} berhasil diajukan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdatePermit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPermit) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingPermit,
      santri: (fd.get("santri") as string) || editingPermit.santri,
      kelas: (fd.get("kelas") as string) || editingPermit.kelas,
      alasan: (fd.get("alasan") as string) || editingPermit.alasan,
      tipe: (fd.get("tipe") as string) || editingPermit.tipe,
      tglKembali: (fd.get("tglKembali") as string) || editingPermit.tglKembali,
      wali: (fd.get("wali") as string) || editingPermit.wali,
    };
    setPermits(permits.map((p) => (p.id === editingPermit.id ? updated : p)));
    setEditingPermit(null);
    setFeedback(`Data izin ${updated.id} berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeletePermit = (id: string, santri: string) => {
    if (confirm(`Yakin ingin membatalkan/menghapus permohonan izin untuk ${santri}?`)) {
      setPermits(permits.filter((p) => p.id !== id));
      setFeedback(`Izin untuk ${santri} telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = permits.filter((p) => {
    const matchQ = p.santri.toLowerCase().includes(search.toLowerCase()) || p.nis.includes(search);
    if (activeTab === "menunggu") return matchQ && p.status === "MENUNGGU";
    if (activeTab === "aktif") return matchQ && p.status === "AKTIF";
    if (activeTab === "belum_kembali") return matchQ && p.isOverdue;
    if (activeTab === "riwayat") return matchQ && p.status === "SELESAI";
    return matchQ;
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-rose-950 text-white shadow-xl border border-amber-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <DoorOpen className="w-4 h-4" />
            <span>Perizinan Santri • Kontrol Gerbang & Keamanan</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Perizinan Keluar Santri</h1>
          <p className="text-xs md:text-sm text-amber-100/80 mt-1">
            Validasi surat izin pulang/berobat, status check-out gerbang, dan pemantauan santri belum kembali di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-amber-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ajukan Izin Baru</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "semua", label: "Semua Izin", count: permits.length },
          { id: "menunggu", label: "Menunggu Persetujuan", count: permits.filter((p) => p.status === "MENUNGGU").length },
          { id: "aktif", label: "Sedang di Luar Pondok", count: permits.filter((p) => p.status === "AKTIF").length },
          { id: "belum_kembali", label: "⚠️ Belum Kembali (Terlambat)", count: permits.filter((p) => p.isOverdue).length },
          { id: "riwayat", label: "Riwayat Selesai", count: permits.filter((p) => p.status === "SELESAI").length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-md">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama santri atau NIS..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Santri & Rombel</th>
                  <th className="py-3 px-4">Alasan & Tipe Izin</th>
                  <th className="py-3 px-4">Batas Waktu</th>
                  <th className="py-3 px-4">Wali Penjamin</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{p.santri}</div>
                      <div className="text-[11px] font-mono text-slate-400">NIS: {p.nis} • {p.kelas}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{p.alasan}</div>
                      <Badge variant="outline" className="text-[10px] mt-1">{p.tipe}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700">Keluar: {p.tglKeluar}</div>
                      <div className={`font-semibold ${p.isOverdue ? "text-rose-600 animate-pulse" : "text-slate-500"}`}>
                        Kembali: {p.tglKembali}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{p.wali}</td>
                    <td className="py-3 px-4">
                      {p.isOverdue ? (
                        <Badge variant="danger" className="text-[10px] font-bold animate-pulse">
                          BELUM KEMBALI
                        </Badge>
                      ) : (
                        <Badge variant={p.status === "SELESAI" ? "success" : p.status === "AKTIF" ? "warning" : "default"} className="text-[10px]">
                          {p.status}
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {p.status === "MENUNGGU" && (
                          <button
                            onClick={() => handleApprove(p.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs"
                          >
                            Setujui Izin
                          </button>
                        )}
                        {p.status === "AKTIF" || p.isOverdue ? (
                          <button
                            onClick={() => handleCheckIn(p.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold shadow-xs"
                          >
                            Check-in Kembali
                          </button>
                        ) : null}
                        <button
                          onClick={() => setEditingPermit(p)}
                          title="Edit Izin"
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePermit(p.id, p.santri)}
                          title="Hapus / Batalkan Izin"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => window.print()}
                          title="Cetak Surat Izin"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-300"
                        >
                          <Printer className="w-3.5 h-3.5" />
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

      {/* Modal Tambah Izin */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-600" />
                Ajukan Surat Izin Keluar Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPermit} className="space-y-4 text-xs">
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
                  <label className="block text-slate-600 font-semibold mb-1">NIS Santri</label>
                  <input
                    type="text"
                    name="nis"
                    placeholder="20260012"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kelas / Rombel</label>
                  <input
                    type="text"
                    name="kelas"
                    placeholder="Kelas Ulya 2"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tipe Izin</label>
                  <select name="tipe" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="PULANG">Pulang ke Rumah</option>
                    <option value="BEROBAT">Berobat ke RS / Klinik</option>
                    <option value="DINAS">Tugas / Lomba Lembaga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Wali Penjamin</label>
                  <input
                    type="text"
                    name="wali"
                    placeholder="Bpk. Fathurrahman"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Alasan Keperluan</label>
                <textarea
                  name="alasan"
                  rows={2}
                  required
                  placeholder="Jelaskan alasan izin secara ringkas dan jelas..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Waktu Keluar</label>
                  <input
                    type="text"
                    name="tglKeluar"
                    defaultValue="Hari ini, 08.00"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Waktu Kembali</label>
                  <input
                    type="text"
                    name="tglKembali"
                    defaultValue="Besok, 17.00"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
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
                  Ajukan Izin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Izin */}
      {editingPermit && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Detail Izin: {editingPermit.id}
              </h3>
              <button onClick={() => setEditingPermit(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePermit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  defaultValue={editingPermit.santri}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kelas</label>
                  <input
                    type="text"
                    name="kelas"
                    defaultValue={editingPermit.kelas}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tipe Izin</label>
                  <select name="tipe" defaultValue={editingPermit.tipe} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="PULANG">Pulang ke Rumah</option>
                    <option value="BEROBAT">Berobat ke RS / Klinik</option>
                    <option value="DINAS">Tugas / Lomba Lembaga</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Alasan Keperluan</label>
                <textarea
                  name="alasan"
                  rows={2}
                  defaultValue={editingPermit.alasan}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Waktu Kembali</label>
                  <input
                    type="text"
                    name="tglKembali"
                    defaultValue={editingPermit.tglKembali}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Wali Penjamin</label>
                  <input
                    type="text"
                    name="wali"
                    defaultValue={editingPermit.wali}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPermit(null)}
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
