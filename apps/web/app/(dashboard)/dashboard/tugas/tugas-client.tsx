"use client";

import React, { useState } from "react";
import { Card, Badge } from "@santrios/ui";
import {
  CheckSquare,
  PlusCircle,
  Clock,
  CheckCircle2,
  FileText,
  Users,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface TugasClientProps {
  tenantName: string;
}

export default function TugasClient({ tenantName }: TugasClientProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  const [assignments, setAssignments] = useState([
    {
      id: "TGS-01",
      title: "Rangkuman Bab Thaharah & Syarat Sah Shalat (Kitab Fathul Qorib)",
      subject: "Fiqih Ibadah",
      class: "Kelas Wustha 2",
      deadline: "24 September 2026, 21.00 WIB",
      submitted: 28,
      total: 32,
      status: "AKTIF",
    },
    {
      id: "TGS-02",
      title: "I'rab 10 Kalimat Pilihan dari Matan Al-Jurumiyah",
      subject: "Bahasa Arab & Nahwu",
      class: "Kelas Ulya 1",
      deadline: "22 September 2026, 20.00 WIB",
      submitted: 25,
      total: 28,
      status: "AKTIF",
    },
    {
      id: "TGS-03",
      title: "Hafalan Matan Mandhumah Al-Jazariyyah Bait 1-15",
      subject: "Tajwid & Tahfizh",
      class: "Semua Santri Baru",
      deadline: "19 September 2026, 17.00 WIB",
      submitted: 34,
      total: 34,
      status: "SELESAI",
    },
  ]);

  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newTask = {
      id: `TGS-0${assignments.length + 1}`,
      title: (fd.get("title") as string) || "Tugas Baru",
      subject: (fd.get("subject") as string) || "Mata Pelajaran",
      class: (fd.get("class") as string) || "Kelas Ulya",
      deadline: (fd.get("deadline") as string) || "Besok, 21.00 WIB",
      submitted: 0,
      total: Number(fd.get("total")) || 30,
      status: "AKTIF",
    };
    setAssignments([newTask, ...assignments]);
    setIsAddOpen(false);
    setFeedback(`Tugas "${newTask.title}" berhasil diterbitkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingTask,
      title: (fd.get("title") as string) || editingTask.title,
      subject: (fd.get("subject") as string) || editingTask.subject,
      class: (fd.get("class") as string) || editingTask.class,
      deadline: (fd.get("deadline") as string) || editingTask.deadline,
      status: (fd.get("status") as string) || editingTask.status,
    };
    setAssignments(assignments.map((t) => (t.id === editingTask.id ? updated : t)));
    setEditingTask(null);
    setFeedback(`Tugas "${updated.title}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteTask = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus tugas "${title}"?`)) {
      setAssignments(assignments.filter((t) => t.id !== id));
      setFeedback(`Tugas "${title}" telah dihapus.`);
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 text-white shadow-xl border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Tugas & Evaluasi • Penugasan Santri</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Tugas & Latihan Santri</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Manajemen tugas terstruktur, batas waktu pengumpulan, dan status penyerahan di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Tugas Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assignments.map((t) => (
          <Card key={t.id} className="p-5 hover:border-indigo-400 hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant="outline" className="text-[10px]">{t.subject}</Badge>
              <div className="flex items-center gap-1.5">
                <Badge variant={t.status === "SELESAI" ? "success" : "warning"} className="text-[10px]">{t.status}</Badge>
                <button
                  onClick={() => setEditingTask(t)}
                  title="Edit Tugas"
                  className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteTask(t.id, t.title)}
                  title="Hapus Tugas"
                  className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t.class}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Pengumpulan:</span>
              <strong className="text-slate-900">{t.submitted} / {t.total} Santri</strong>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                {t.deadline}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Tugas */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                Buat Tugas Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Judul Tugas / Materi</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Terjemah & Analisis Matan Jurumiyah"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    placeholder="Bahasa Arab"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Rombel Kelas</label>
                  <input
                    type="text"
                    name="class"
                    required
                    placeholder="Kelas Ulya 1"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Batas Waktu</label>
                  <input
                    type="text"
                    name="deadline"
                    required
                    placeholder="25 Sep 2026, 21.00 WIB"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Total Santri</label>
                  <input
                    type="number"
                    name="total"
                    defaultValue={30}
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md"
                >
                  Terbitkan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Tugas */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Tugas: {editingTask.id}
              </h3>
              <button onClick={() => setEditingTask(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Judul Tugas</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingTask.title}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    name="subject"
                    defaultValue={editingTask.subject}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kelas</label>
                  <input
                    type="text"
                    name="class"
                    defaultValue={editingTask.class}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Batas Waktu</label>
                  <input
                    type="text"
                    name="deadline"
                    defaultValue={editingTask.deadline}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select name="status" defaultValue={editingTask.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="AKTIF">AKTIF</option>
                    <option value="SELESAI">SELESAI</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
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
