"use client";

import React, { useState } from "react";
import { Card, Badge } from "@santrios/ui";
import {
  FileText,
  Search,
  Printer,
  Download,
  Award,
  CheckCircle2,
  PlusCircle,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface NilaiClientProps {
  tenantName: string;
}

export default function NilaiClient({ tenantName }: NilaiClientProps) {
  const [selectedClass, setSelectedClass] = useState("Kelas Ulya 2");
  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any | null>(null);

  const [grades, setGrades] = useState([
    {
      id: "GRD-01",
      nis: "20260021",
      name: "Ahmad Fauzan",
      uh: 88,
      uts: 90,
      uas: 92,
      adab: "Mumtaz (A)",
      final: 90.4,
      status: "TUNTAS",
    },
    {
      id: "GRD-02",
      nis: "20260022",
      name: "Bilal Al-Habasyi",
      uh: 85,
      uts: 84,
      uas: 88,
      adab: "Jayyid Jiddan (B+)",
      final: 86.1,
      status: "TUNTAS",
    },
    {
      id: "GRD-03",
      nis: "20260023",
      name: "Daffa Ibnu Sina",
      uh: 72,
      uts: 70,
      uas: 74,
      adab: "Jayyid (B)",
      final: 72.2,
      status: "REMEDIAL",
    },
  ]);

  const calculateFinal = (uh: number, uts: number, uas: number) => {
    return Math.round((uh * 0.3 + uts * 0.3 + uas * 0.4) * 10) / 10;
  };

  const handleUpdateGrade = (id: string, newUh: number) => {
    setGrades(
      grades.map((g) => {
        if (g.id !== id) return g;
        const final = calculateFinal(newUh, g.uts, g.uas);
        return { ...g, uh: newUh, final, status: final >= 75 ? "TUNTAS" : "REMEDIAL" };
      })
    );
    setFeedback("Nilai berhasil diperbarui dan tersimpan ke buku leger rapor.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddGrade = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const uh = Number(fd.get("uh")) || 80;
    const uts = Number(fd.get("uts")) || 80;
    const uas = Number(fd.get("uas")) || 80;
    const final = calculateFinal(uh, uts, uas);
    const newGrd = {
      id: `GRD-0${grades.length + 1}`,
      nis: (fd.get("nis") as string) || "202600" + Math.floor(10 + Math.random() * 80),
      name: (fd.get("name") as string) || "Nama Santri",
      uh,
      uts,
      uas,
      adab: (fd.get("adab") as string) || "Mumtaz (A)",
      final,
      status: final >= 75 ? "TUNTAS" : "REMEDIAL",
    };
    setGrades([...grades, newGrd]);
    setIsAddOpen(false);
    setFeedback(`Nilai santri "${newGrd.name}" berhasil diinput ke leger.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleFullEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGrade) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const uh = Number(fd.get("uh")) || editingGrade.uh;
    const uts = Number(fd.get("uts")) || editingGrade.uts;
    const uas = Number(fd.get("uas")) || editingGrade.uas;
    const final = calculateFinal(uh, uts, uas);
    const updated = {
      ...editingGrade,
      name: (fd.get("name") as string) || editingGrade.name,
      nis: (fd.get("nis") as string) || editingGrade.nis,
      uh,
      uts,
      uas,
      adab: (fd.get("adab") as string) || editingGrade.adab,
      final,
      status: final >= 75 ? "TUNTAS" : "REMEDIAL",
    };
    setGrades(grades.map((g) => (g.id === editingGrade.id ? updated : g)));
    setEditingGrade(null);
    setFeedback(`Rekap nilai "${updated.name}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteGrade = (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus rekap nilai untuk ${name}?`)) {
      setGrades(grades.filter((g) => g.id !== id));
      setFeedback(`Rekap nilai ${name} telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = grades.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()) || g.nis.includes(search));

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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-teal-950 text-white shadow-xl border border-amber-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Penilaian Santri • Leger Rapor & Asesmen</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Leger & Nilai Akademik</h1>
          <p className="text-xs md:text-sm text-amber-100/80 mt-1">
            Input nilai Ulangan Harian (UH), UTS, UAS, dan asesmen adab kesantrian di {tenantName}.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-amber-500/25 flex items-center gap-2 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Input Nilai Santri</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shadow-md border border-white/20 flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak Leger</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari santri atau NIS..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["Kelas Ulya 2", "Kelas Ulya 1", "Kelas Wustha 3"].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedClass === cls ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Santri & NIS</th>
                <th className="py-3 px-4">Nilai UH (30%)</th>
                <th className="py-3 px-4">Nilai UTS (30%)</th>
                <th className="py-3 px-4">Nilai UAS (40%)</th>
                <th className="py-3 px-4">Adab & Sikap</th>
                <th className="py-3 px-4">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div>{g.name}</div>
                    <div className="text-[11px] font-mono text-slate-400">NIS: {g.nis}</div>
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      defaultValue={g.uh}
                      onBlur={(e) => handleUpdateGrade(g.id, Number(e.target.value))}
                      className="w-16 p-1.5 rounded-lg border border-slate-200 text-center font-bold text-slate-900 focus:border-amber-500"
                    />
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{g.uts}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{g.uas}</td>
                  <td className="py-3 px-4 text-emerald-700 font-semibold">{g.adab}</td>
                  <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">{g.final}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={g.status === "TUNTAS" ? "success" : "danger"} className="text-[10px]">
                      {g.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setEditingGrade(g)}
                        title="Edit Nilai Komprehensif"
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGrade(g.id, g.name)}
                        title="Hapus Nilai"
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

      {/* Modal Tambah Nilai Santri */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-600" />
                Input Nilai Santri Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGrade} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Muhammad Ali"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">NIS</label>
                <input
                  type="text"
                  name="nis"
                  placeholder="20260025"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">UH (30%)</label>
                  <input
                    type="number"
                    name="uh"
                    defaultValue={80}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">UTS (30%)</label>
                  <input
                    type="number"
                    name="uts"
                    defaultValue={80}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">UAS (40%)</label>
                  <input
                    type="number"
                    name="uas"
                    defaultValue={80}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Asesmen Adab & Sikap</label>
                <select name="adab" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="Mumtaz (A)">Mumtaz (A) - Sangat Baik</option>
                  <option value="Jayyid Jiddan (B+)">Jayyid Jiddan (B+) - Baik Sekali</option>
                  <option value="Jayyid (B)">Jayyid (B) - Cukup Baik</option>
                  <option value="Maqbul (C)">Maqbul (C) - Perlu Bimbingan</option>
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
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Nilai Komprehensif */}
      {editingGrade && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Nilai: {editingGrade.name}
              </h3>
              <button onClick={() => setEditingGrade(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFullEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingGrade.name}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">NIS</label>
                  <input
                    type="text"
                    name="nis"
                    defaultValue={editingGrade.nis}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">UH</label>
                  <input
                    type="number"
                    name="uh"
                    defaultValue={editingGrade.uh}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">UTS</label>
                  <input
                    type="number"
                    name="uts"
                    defaultValue={editingGrade.uts}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">UAS</label>
                  <input
                    type="number"
                    name="uas"
                    defaultValue={editingGrade.uas}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Adab & Sikap</label>
                <select name="adab" defaultValue={editingGrade.adab} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="Mumtaz (A)">Mumtaz (A) - Sangat Baik</option>
                  <option value="Jayyid Jiddan (B+)">Jayyid Jiddan (B+) - Baik Sekali</option>
                  <option value="Jayyid (B)">Jayyid (B) - Cukup Baik</option>
                  <option value="Maqbul (C)">Maqbul (C) - Perlu Bimbingan</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
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
