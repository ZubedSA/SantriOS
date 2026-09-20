"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  Printer,
  FileCheck,
  Award,
  X,
  Edit3,
  Trash2,
  UserPlus,
} from "lucide-react";
import { formatRupiah } from "@santrios/utils";

interface PPDBClientProps {
  tenantName: string;
}

export default function PPDBClient({ tenantName }: PPDBClientProps) {
  const [activeTab, setActiveTab] = useState<"semua" | "menunggu" | "lulus" | "aktif">("semua");
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<any | null>(null);

  const [applicants, setApplicants] = useState([
    {
      id: "PPDB-2026-001",
      name: "Rizky Dwi Ananda",
      program: "Tahfizh & Madrasah Aliyah (Ulya)",
      origin: "SMP Negeri 1 Sleman, Yogyakarta",
      guardian: "Bpk. Bambang Sulistyo (0812-3456-7890)",
      hafalanAwal: "5 Juz Mutqin",
      regDate: "15 September 2026",
      status: "LULUS_SELEKSI",
      paymentStatus: "LUNAS",
    },
    {
      id: "PPDB-2026-002",
      name: "Fauziah Nurul Izzah",
      program: "Madrasah Tsanawiyah (Wustha Putri)",
      origin: "SDIT Bina Insan Mulia, Solo",
      guardian: "Ibu Haryati (0813-9876-5432)",
      hafalanAwal: "Juz 30",
      regDate: "17 September 2026",
      status: "VERIFIKASI_BERKAS",
      paymentStatus: "LUNAS",
    },
    {
      id: "PPDB-2026-003",
      name: "Gibran Al-Ghifari",
      program: "Kulliyatul Mu'allimin Al-Islamiyyah (KMI)",
      origin: "Pesantren Salafiyah Kudus",
      guardian: "Bpk. H. Sholihin (0857-1122-3344)",
      hafalanAwal: "3 Juz",
      regDate: "18 September 2026",
      status: "LULUS_SELEKSI",
      paymentStatus: "BELUM_BAYAR",
    },
  ]);

  const handleConvert = (id: string, name: string) => {
    setApplicants(applicants.map((a) => (a.id === id ? { ...a, status: "AKTIF_SANTRI" } : a)));
    setFeedback(`Alhamdulillah! ${name} resmi dikonversi menjadi Santri Aktif ${tenantName}.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddApplicant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newApp = {
      id: `PPDB-2026-0${applicants.length + 1}`,
      name: (fd.get("name") as string) || "Calon Santri",
      program: (fd.get("program") as string) || "Tahfizh & Aliyah (Ulya)",
      origin: (fd.get("origin") as string) || "Asal Sekolah",
      guardian: (fd.get("guardian") as string) || "Nama & No Telp Wali",
      hafalanAwal: (fd.get("hafalanAwal") as string) || "Belum ada",
      regDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      status: (fd.get("status") as string) || "VERIFIKASI_BERKAS",
      paymentStatus: (fd.get("paymentStatus") as string) || "LUNAS",
    };
    setApplicants([newApp, ...applicants]);
    setIsAddOpen(false);
    setFeedback(`Pendaftar baru "${newApp.name}" berhasil didaftarkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateApplicant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingApp) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingApp,
      name: (fd.get("name") as string) || editingApp.name,
      program: (fd.get("program") as string) || editingApp.program,
      origin: (fd.get("origin") as string) || editingApp.origin,
      guardian: (fd.get("guardian") as string) || editingApp.guardian,
      hafalanAwal: (fd.get("hafalanAwal") as string) || editingApp.hafalanAwal,
      status: (fd.get("status") as string) || editingApp.status,
      paymentStatus: (fd.get("paymentStatus") as string) || editingApp.paymentStatus,
    };
    setApplicants(applicants.map((a) => (a.id === editingApp.id ? updated : a)));
    setEditingApp(null);
    setFeedback(`Data calon santri "${updated.name}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteApplicant = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus berkas pendaftaran ${name}?`)) {
      setApplicants(applicants.filter((a) => a.id !== id));
      setFeedback(`Berkas pendaftar ${name} telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = applicants.filter((a) => {
    const matchQ = a.name.toLowerCase().includes(search.toLowerCase()) || a.origin.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "menunggu") return matchQ && a.status === "VERIFIKASI_BERKAS";
    if (activeTab === "lulus") return matchQ && a.status === "LULUS_SELEKSI";
    if (activeTab === "aktif") return matchQ && a.status === "AKTIF_SANTRI";
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl border border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>PPDB Online • Penerimaan Santri Baru</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Pendaftaran Santri Baru (PPDB)</h1>
          <p className="text-xs md:text-sm text-emerald-100/80 mt-1">
            Manajemen verifikasi berkas, tes baca Quran & sima'an tahfizh, serta konversi pendaftar ke santri aktif di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pendaftar Manual</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Pendaftar" value={`${applicants.length} Calon`} subtitle="Tahun Ajaran 2026/2027" />
        <StatCard title="Lulus Seleksi" value={`${applicants.filter(a => a.status === 'LULUS_SELEKSI').length} Calon`} subtitle="Siap daftar ulang" />
        <StatCard title="Santri Aktif Mukim" value={`${applicants.filter(a => a.status === 'AKTIF_SANTRI').length} Santri`} subtitle="Telah konversi" />
        <StatCard title="Kuota Tersedia" value="150 Kursi" subtitle="Penerimaan baru" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: "semua", label: "Semua Pendaftar", count: applicants.length },
          { id: "menunggu", label: "Verifikasi Berkas", count: applicants.filter((a) => a.status === "VERIFIKASI_BERKAS").length },
          { id: "lulus", label: "Lulus Seleksi", count: applicants.filter((a) => a.status === "LULUS_SELEKSI").length },
          { id: "aktif", label: "Sudah Menjadi Santri Aktif", count: applicants.filter((a) => a.status === "AKTIF_SANTRI").length },
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
            placeholder="Cari nama santri, sekolah asal..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Nama Calon Santri</th>
                  <th className="py-3 px-4">Program & Asal Sekolah</th>
                  <th className="py-3 px-4">Hafalan Awal</th>
                  <th className="py-3 px-4">Kontak Wali</th>
                  <th className="py-3 px-4">Status Seleksi</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div>{a.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{a.id} • {a.regDate}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{a.program}</div>
                      <div className="text-[11px] text-slate-500">{a.origin}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">{a.hafalanAwal}</td>
                    <td className="py-3 px-4 text-slate-600">{a.guardian}</td>
                    <td className="py-3 px-4">
                      <Badge variant={a.status === "AKTIF_SANTRI" ? "success" : a.status === "LULUS_SELEKSI" ? "info" : "warning"} className="text-[10px]">
                        {a.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {a.status === "LULUS_SELEKSI" && (
                          <button
                            onClick={() => handleConvert(a.id, a.name)}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Jadikan Santri</span>
                          </button>
                        )}
                        <button
                          onClick={() => setEditingApp(a)}
                          title="Edit Pendaftar"
                          className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteApplicant(a.id, a.name)}
                          title="Hapus Pendaftar"
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

      {/* Modal Tambah Pendaftar Manual */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                Tambah Pendaftar PPDB Manual
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddApplicant} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap Calon Santri</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Muhammad Ilham"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Program Pilihan</label>
                <select name="program" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="Tahfizh & Madrasah Aliyah (Ulya)">Tahfizh & Madrasah Aliyah (Ulya)</option>
                  <option value="Madrasah Tsanawiyah (Wustha)">Madrasah Tsanawiyah (Wustha)</option>
                  <option value="Kulliyatul Mu'allimin Al-Islamiyyah (KMI)">Kulliyatul Mu'allimin Al-Islamiyyah (KMI)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Asal Sekolah</label>
                  <input
                    type="text"
                    name="origin"
                    required
                    placeholder="SMPN 1 Solo"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hafalan Awal</label>
                  <input
                    type="text"
                    name="hafalanAwal"
                    defaultValue="Juz 30"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama & Kontak Wali</label>
                <input
                  type="text"
                  name="guardian"
                  required
                  placeholder="Bpk. Rahmat (0812-3344-5566)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status Awal</label>
                  <select name="status" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="VERIFIKASI_BERKAS">VERIFIKASI_BERKAS</option>
                    <option value="LULUS_SELEKSI">LULUS_SELEKSI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Biaya Pendaftaran</label>
                  <select name="paymentStatus" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="LUNAS">LUNAS</option>
                    <option value="BELUM_BAYAR">BELUM_BAYAR</option>
                  </select>
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
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Simpan Pendaftar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pendaftar */}
      {editingApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Calon Santri: {editingApp.name}
              </h3>
              <button onClick={() => setEditingApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateApplicant} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingApp.name}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Program</label>
                <select name="program" defaultValue={editingApp.program} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="Tahfizh & Madrasah Aliyah (Ulya)">Tahfizh & Madrasah Aliyah (Ulya)</option>
                  <option value="Madrasah Tsanawiyah (Wustha)">Madrasah Tsanawiyah (Wustha)</option>
                  <option value="Kulliyatul Mu'allimin Al-Islamiyyah (KMI)">Kulliyatul Mu'allimin Al-Islamiyyah (KMI)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Asal Sekolah</label>
                  <input
                    type="text"
                    name="origin"
                    defaultValue={editingApp.origin}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hafalan Awal</label>
                  <input
                    type="text"
                    name="hafalanAwal"
                    defaultValue={editingApp.hafalanAwal}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Wali</label>
                <input
                  type="text"
                  name="guardian"
                  defaultValue={editingApp.guardian}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Status Seleksi</label>
                <select name="status" defaultValue={editingApp.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="VERIFIKASI_BERKAS">VERIFIKASI_BERKAS</option>
                  <option value="LULUS_SELEKSI">LULUS_SELEKSI</option>
                  <option value="AKTIF_SANTRI">AKTIF_SANTRI</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
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
