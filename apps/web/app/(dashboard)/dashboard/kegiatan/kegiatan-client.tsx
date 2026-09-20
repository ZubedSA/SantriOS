"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  CalendarCheck,
  Search,
  PlusCircle,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  X,
  Edit3,
  Trash2,
} from "lucide-react";

interface KegiatanClientProps {
  tenantName: string;
}

export default function KegiatanClient({ tenantName }: KegiatanClientProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  const [events, setEvents] = useState([
    {
      id: "EVT-01",
      title: "Kajian Akbar Bulanan & Doa Bersama Wali Santri",
      date: "Ahad, 27 September 2026",
      time: "08.00 - 11.30 WIB",
      location: "Masjid Utama Al-Hidayah",
      pic: "Ustadz Mansur & Panitia Syiar",
      participants: "Seluruh Santri & Wali Santri Mukim",
      status: "AKAN_DATANG",
    },
    {
      id: "EVT-02",
      title: "Tasmi' Kubro 30 Juz Sekali Duduk Santri Pilihan",
      date: "Sabtu, 03 Oktober 2026",
      time: "Ba'da Shubuh s/d Isya",
      location: "Aula Pertemuan Gedung As-Siddiq",
      pic: "Dewan Asatidz Tahfizh",
      participants: "3 Santri Mumtaz & Undangan Khusus",
      status: "PERSIAPAN",
    },
    {
      id: "EVT-03",
      title: "Kerja Bakti Akbar (Kurve) Kebersihan Lingkungan Asrama",
      date: "Jumat, 18 September 2026",
      time: "06.30 - 08.30 WIB",
      location: "Seluruh Kompleks Pesantren",
      pic: "Bagian Kesantrian",
      participants: "Seluruh Santri & Asatidz Mukim",
      status: "SELESAI",
    },
  ]);

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newEvent = {
      id: `EVT-0${events.length + 1}`,
      title: (fd.get("title") as string) || "Acara Baru",
      date: (fd.get("date") as string) || "Ahad Mendatang",
      time: (fd.get("time") as string) || "08.00 - 10.00 WIB",
      location: (fd.get("location") as string) || "Masjid Utama",
      pic: (fd.get("pic") as string) || "Panitia",
      participants: (fd.get("participants") as string) || "Seluruh Santri",
      status: "AKAN_DATANG",
    };
    setEvents([...events, newEvent]);
    setIsAddOpen(false);
    setFeedback(`Acara "${newEvent.title}" berhasil dijadwalkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingEvent,
      title: (fd.get("title") as string) || editingEvent.title,
      date: (fd.get("date") as string) || editingEvent.date,
      time: (fd.get("time") as string) || editingEvent.time,
      location: (fd.get("location") as string) || editingEvent.location,
      pic: (fd.get("pic") as string) || editingEvent.pic,
      participants: (fd.get("participants") as string) || editingEvent.participants,
      status: (fd.get("status") as string) || editingEvent.status,
    };
    setEvents(events.map((e) => (e.id === editingEvent.id ? updated : e)));
    setEditingEvent(null);
    setFeedback(`Kegiatan "${updated.title}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Yakin ingin membatalkan/menghapus acara "${title}"?`)) {
      setEvents(events.filter((e) => e.id !== id));
      setFeedback(`Acara "${title}" telah dihapus.`);
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Agenda & Kalender • Aktivitas Pesantren</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Kegiatan & Kalender Pondok</h1>
          <p className="text-xs md:text-sm text-teal-100/80 mt-1">
            Penjadwalan acara resmi, kajian akbar, sima&apos;an kubro, dan agenda santri di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-teal-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Jadwalkan Acara Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((e) => (
          <Card key={e.id} className="p-5 hover:border-teal-400 hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between">
              <Badge variant={e.status === "SELESAI" ? "default" : "success"} className="text-[10px]">
                {e.status.replace("_", " ")}
              </Badge>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-mono mr-1">{e.id}</span>
                <button
                  onClick={() => setEditingEvent(e)}
                  title="Edit Acara"
                  className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(e.id, e.title)}
                  title="Hapus Acara"
                  className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-sm md:text-base font-bold text-slate-900">{e.title}</h3>
              <p className="text-xs text-teal-700 font-semibold mt-1">{e.date} • {e.time}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-600">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{e.location}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{e.participants}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
              Penanggung Jawab: <strong className="text-slate-800">{e.pic}</strong>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Acara */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-teal-600" />
                Jadwalkan Acara Pondok Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Acara / Kegiatan</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Peringatan Maulid Nabi & Tabligh Akbar"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hari & Tanggal</label>
                  <input
                    type="text"
                    name="date"
                    required
                    placeholder="Sabtu, 10 Okt 2026"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Waktu</label>
                  <input
                    type="text"
                    name="time"
                    required
                    placeholder="08.00 - 12.00 WIB"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Lokasi Kegiatan</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="Masjid Utama Al-Hidayah"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    name="pic"
                    required
                    placeholder="Ustadz Mansur"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Peserta</label>
                  <input
                    type="text"
                    name="participants"
                    required
                    placeholder="Seluruh Santri Mukim"
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
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md"
                >
                  Jadwalkan Acara
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Acara */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Acara: {editingEvent.title}
              </h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Acara</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingEvent.title}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Tanggal</label>
                  <input
                    type="text"
                    name="date"
                    defaultValue={editingEvent.date}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Waktu</label>
                  <input
                    type="text"
                    name="time"
                    defaultValue={editingEvent.time}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Lokasi</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={editingEvent.location}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">PIC</label>
                  <input
                    type="text"
                    name="pic"
                    defaultValue={editingEvent.pic}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select name="status" defaultValue={editingEvent.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="AKAN_DATANG">AKAN_DATANG</option>
                    <option value="PERSIAPAN">PERSIAPAN</option>
                    <option value="SELESAI">SELESAI</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
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
