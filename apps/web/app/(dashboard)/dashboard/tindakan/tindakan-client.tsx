"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Scale,
  Search,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  X,
  Edit3,
  Trash2,
  Clock,
} from "lucide-react";

interface TindakanClientProps {
  tenantName: string;
}

export default function TindakanClient({ tenantName }: TindakanClientProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<any | null>(null);

  const [actions, setActions] = useState([
    {
      id: "TDK-01",
      santri: "Muhammad Fatih",
      nis: "20260012",
      pelanggaran: "Terlambat apel shubuh (Poin -5)",
      taazir: "Setoran 1/2 juz Al-Qur'an & kurve kebersihan masjid",
      supervisor: "Ustadz Mansur",
      status: "BELUM_SELESAI",
      deadline: "21 September 2026",
    },
    {
      id: "TDK-02",
      santri: "Zulfikar Hidayat",
      nis: "20260044",
      pelanggaran: "Penyalahgunaan smartphone (Poin -20)",
      taazir: "Penyitaan HP 1 semester & membuat resume adab penuntut ilmu",
      supervisor: "Ustadz Fatih Ridwan",
      status: "BELUM_SELESAI",
      deadline: "25 September 2026",
    },
    {
      id: "TDK-03",
      santri: "Daffa Ibnu Sina",
      nis: "20260023",
      pelanggaran: "Tidak memakai peci KBM (Poin -2)",
      taazir: "Menghafal 20 mufradat bahasa Arab baru",
      supervisor: "Ustadz Zaid",
      status: "SELESAI",
      deadline: "18 September 2026",
    },
  ]);

  const handleComplete = (id: string) => {
    setActions(actions.map((a) => (a.id === id ? { ...a, status: "SELESAI" } : a)));
    setFeedback("Ta'zir santri telah dinyatakan selesai dan lulus evaluasi adab.");
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddAction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newAct = {
      id: `TDK-0${actions.length + 1}`,
      santri: (fd.get("santri") as string) || "Nama Santri",
      nis: (fd.get("nis") as string) || "202600" + Math.floor(10 + Math.random() * 80),
      pelanggaran: (fd.get("pelanggaran") as string) || "Pelanggaran Tata Tertib",
      taazir: (fd.get("taazir") as string) || "Bentuk Sanksi Edukatif",
      supervisor: (fd.get("supervisor") as string) || "Ustadz Pengawas",
      status: "BELUM_SELESAI",
      deadline: (fd.get("deadline") as string) || "3 Hari Mendatang",
    };
    setActions([newAct, ...actions]);
    setIsAddOpen(false);
    setFeedback(`Tindakan ta'zir untuk "${newAct.santri}" berhasil ditugaskan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateAction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAction) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingAction,
      santri: (fd.get("santri") as string) || editingAction.santri,
      pelanggaran: (fd.get("pelanggaran") as string) || editingAction.pelanggaran,
      taazir: (fd.get("taazir") as string) || editingAction.taazir,
      supervisor: (fd.get("supervisor") as string) || editingAction.supervisor,
      deadline: (fd.get("deadline") as string) || editingAction.deadline,
      status: (fd.get("status") as string) || editingAction.status,
    };
    setActions(actions.map((a) => (a.id === editingAction.id ? updated : a)));
    setEditingAction(null);
    setFeedback(`Tindakan ta'zir "${updated.santri}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteAction = (id: string, santri: string) => {
    if (confirm(`Yakin ingin membatalkan/menghapus tugas ta'zir santri ${santri}?`)) {
      setActions(actions.filter((a) => a.id !== id));
      setFeedback(`Tindakan ta'zir ${santri} telah dihapus.`);
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-rose-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Tindakan & Ta&apos;zir • Penegakan Disiplin Edukatif</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Tindakan Disiplin & Ta&apos;zir</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Monitoring pelaksanaan sanksi edukatif, setoran hafalan kafarat, dan kurve kebersihan santri di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-400 text-white font-bold text-xs shadow-lg hover:shadow-rose-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tugaskan Ta&apos;zir Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((a) => (
          <Card key={a.id} className="p-5 hover:border-rose-400 hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{a.santri}</h3>
                <span className="text-[11px] text-slate-400 font-mono">NIS: {a.nis}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant={a.status === "SELESAI" ? "success" : "warning"} className="text-[10px]">
                  {a.status.replace("_", " ")}
                </Badge>
                <button
                  onClick={() => setEditingAction(a)}
                  title="Edit Sanksi"
                  className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteAction(a.id, a.santri)}
                  title="Hapus Sanksi"
                  className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <p className="text-slate-600">Pelanggaran: <strong className="text-slate-900">{a.pelanggaran}</strong></p>
              <p className="text-slate-600">Bentuk Ta&apos;zir: <strong className="text-rose-700">{a.taazir}</strong></p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Pengawas: <strong>{a.supervisor}</strong></span>
              {a.status !== "SELESAI" ? (
                <button
                  onClick={() => handleComplete(a.id)}
                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                >
                  Tandai Tuntas
                </button>
              ) : (
                <span className="text-emerald-700 font-semibold text-[11px]">Selesai Dijalani</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Ta'zir */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-rose-600" />
                Tugaskan Sanksi Ta&apos;zir Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  required
                  placeholder="Contoh: Zulkifli Mansur"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Pelanggaran Terkait</label>
                <input
                  type="text"
                  name="pelanggaran"
                  required
                  placeholder="Contoh: Keluar gerbang tanpa surat izin (Poin -10)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Bentuk Ta&apos;zir Edukatif</label>
                <textarea
                  name="taazir"
                  rows={2}
                  required
                  placeholder="Contoh: Menghafal Surah Al-Mulk ayat 1-30 & kurve asrama"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ustadz Pengawas</label>
                  <input
                    type="text"
                    name="supervisor"
                    required
                    placeholder="Ustadz Mansur"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Batas Waktu</label>
                  <input
                    type="text"
                    name="deadline"
                    defaultValue="3 Hari Mendatang"
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
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md"
                >
                  Tugaskan Ta&apos;zir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Ta'zir */}
      {editingAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Sanksi: {editingAction.santri}
              </h3>
              <button onClick={() => setEditingAction(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Santri</label>
                <input
                  type="text"
                  name="santri"
                  defaultValue={editingAction.santri}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Pelanggaran</label>
                <input
                  type="text"
                  name="pelanggaran"
                  defaultValue={editingAction.pelanggaran}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Bentuk Ta&apos;zir</label>
                <textarea
                  name="taazir"
                  rows={2}
                  defaultValue={editingAction.taazir}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Pengawas</label>
                  <input
                    type="text"
                    name="supervisor"
                    defaultValue={editingAction.supervisor}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select name="status" defaultValue={editingAction.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="BELUM_SELESAI">BELUM_SELESAI</option>
                    <option value="SELESAI">SELESAI</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAction(null)}
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
