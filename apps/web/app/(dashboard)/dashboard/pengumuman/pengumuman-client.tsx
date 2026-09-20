"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Bell,
  Search,
  PlusCircle,
  Send,
  Users,
  CheckCircle2,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface PengumumanClientProps {
  tenantName: string;
}

export default function PengumumanClient({ tenantName }: PengumumanClientProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<any | null>(null);

  const [announcements, setAnnouncements] = useState([
    {
      id: "ANN-01",
      title: "Jadwal Kunjungan (Sambangan) Wali Santri Bulan September 2026",
      target: "SEMUA_WALI",
      date: "19 September 2026",
      content: "Sambangan santri mukim dilaksanakan pada Ahad terakhir bulan ini, mulai pukul 08.00 s/d 16.30 WIB dengan mematuhi adab berpakaian sopan dan tertib di lingkungan pesantren.",
      status: "TERSIAR_WA",
    },
    {
      id: "ANN-02",
      title: "Pemberitahuan Ujian Tengah Semester (UTS) Ganjil TA 2026/2027",
      target: "SANTRI_DAN_GURU",
      date: "15 September 2026",
      content: "Pelaksanaan UTS Diniyah dan Kepesantrenan akan dimulai pada 05 Oktober 2026. Seluruh santri diharapkan menuntaskan hafalan ziyadah dan muraja'ah tepat waktu.",
      status: "TERSIAR_PORTAL",
    },
  ]);

  const handleAddAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newAnn = {
      id: `ANN-0${announcements.length + 1}`,
      title: (fd.get("title") as string) || "Pengumuman Baru",
      target: (fd.get("target") as string) || "SEMUA_WALI",
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      content: (fd.get("content") as string) || "Isi pengumuman resmi.",
      status: (fd.get("status") as string) || "TERSIAR_WA",
    };
    setAnnouncements([newAnn, ...announcements]);
    setIsAddOpen(false);
    setFeedback(`Pengumuman "${newAnn.title}" berhasil disiarkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateAnnouncement = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingAnn) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingAnn,
      title: (fd.get("title") as string) || editingAnn.title,
      target: (fd.get("target") as string) || editingAnn.target,
      content: (fd.get("content") as string) || editingAnn.content,
      status: (fd.get("status") as string) || editingAnn.status,
    };
    setAnnouncements(announcements.map((a) => (a.id === editingAnn.id ? updated : a)));
    setEditingAnn(null);
    setFeedback(`Pengumuman "${updated.title}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteAnnouncement = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus pengumuman "${title}"?`)) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
      setFeedback(`Pengumuman "${title}" telah dihapus.`);
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-amber-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Pusat Informasi • Siaran & Notifikasi Massal</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Pengumuman & Siaran</h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            Broadcast pengumuman resmi ke wali santri, guru, dan santri mukim di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-amber-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((a) => (
          <Card key={a.id} className="p-5 hover:border-amber-400 hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant="outline" className="text-[10px]">{a.target.replace("_", " ")}</Badge>
              <div className="flex items-center gap-1.5">
                <Badge variant="success" className="text-[10px]">{a.status}</Badge>
                <button
                  onClick={() => setEditingAnn(a)}
                  title="Edit Siaran"
                  className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteAnnouncement(a.id, a.title)}
                  title="Hapus Siaran"
                  className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-900">{a.title}</h3>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">{a.date}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {a.content}
            </p>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Pengumuman */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-600" />
                Buat Pengumuman Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Libur Hari Raya & Kepulangan Santri"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target Audiens</label>
                  <select name="target" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="SEMUA_WALI">Semua Wali Santri</option>
                    <option value="SANTRI_DAN_GURU">Santri & Dewan Guru</option>
                    <option value="UMUM">Seluruh Warga Pondok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kanal Siaran</label>
                  <select name="status" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="TERSIAR_WA">WhatsApp Broadcast</option>
                    <option value="TERSIAR_PORTAL">Portal Aplikasi</option>
                    <option value="SEMUA_KANAL">Semua Kanal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Isi Pengumuman</label>
                <textarea
                  name="content"
                  rows={4}
                  required
                  placeholder="Tuliskan isi surat edaran atau maklumat resmi..."
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
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md"
                >
                  Siarkan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Pengumuman */}
      {editingAnn && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Pengumuman: {editingAnn.title}
              </h3>
              <button onClick={() => setEditingAnn(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateAnnouncement} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingAnn.title}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Target</label>
                  <select name="target" defaultValue={editingAnn.target} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="SEMUA_WALI">Semua Wali Santri</option>
                    <option value="SANTRI_DAN_GURU">Santri & Dewan Guru</option>
                    <option value="UMUM">Seluruh Warga Pondok</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select name="status" defaultValue={editingAnn.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="TERSIAR_WA">WhatsApp Broadcast</option>
                    <option value="TERSIAR_PORTAL">Portal Aplikasi</option>
                    <option value="SEMUA_KANAL">Semua Kanal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Isi Pengumuman</label>
                <textarea
                  name="content"
                  rows={4}
                  defaultValue={editingAnn.content}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAnn(null)}
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
