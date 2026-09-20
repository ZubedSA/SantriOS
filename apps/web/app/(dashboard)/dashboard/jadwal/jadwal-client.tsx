"use client";

import React, { useState } from "react";
import { Card, Badge } from "@santrios/ui";
import {
  CalendarCheck,
  Clock,
  BookOpen,
  Building,
  CheckCircle2,
  Users,
  PlusCircle,
  Edit3,
  Trash2,
  X,
} from "lucide-react";

interface JadwalClientProps {
  tenantName: string;
}

export default function JadwalClient({ tenantName }: JadwalClientProps) {
  const [selectedDay, setSelectedDay] = useState("SENIN");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);

  const [schedule, setSchedule] = useState([
    {
      id: "JDW-01",
      day: "SENIN",
      time: "07.30 - 09.00 WIB",
      subject: "Fiqih Ibadah (Fathul Qorib)",
      class: "Kelas Wustha 2",
      room: "Ruang A-02",
      teacher: "Ustadz Ahmad Fauzi, Lc.",
      status: "SELESAI",
    },
    {
      id: "JDW-02",
      day: "SENIN",
      time: "09.30 - 11.00 WIB",
      subject: "Bahasa Arab & Nahwu (Al-Jurumiyah)",
      class: "Kelas Ulya 1",
      room: "Ruang B-01",
      teacher: "Ustadz Fatih Ridwan, S.Pd.I.",
      status: "SELESAI",
    },
    {
      id: "JDW-03",
      day: "SENIN",
      time: "13.30 - 15.00 WIB",
      subject: "Tahfizh & Tajwid (Al-Jazariyyah)",
      class: "Semua Rombel",
      room: "Masjid Utama Al-Hidayah",
      teacher: "Dewan Asatidz Tahfizh",
      status: "SEDANG_BERJALAN",
    },
    {
      id: "JDW-04",
      day: "SENIN",
      time: "16.00 - 17.15 WIB",
      subject: "Ziyadah & Setoran Hafalan Sore",
      class: "Halaqah Sore",
      room: "Masjid Lantai 2",
      teacher: "Guru Tahfizh",
      status: "MENDATANG",
    },
    {
      id: "JDW-05",
      day: "SELASA",
      time: "07.30 - 09.00 WIB",
      subject: "Hadits (Arbain An-Nawawiyah)",
      class: "Kelas Ulya 2",
      room: "Ruang A-01",
      teacher: "Ustadz Mansur, M.Pd.",
      status: "MENDATANG",
    },
    {
      id: "JDW-06",
      day: "RABU",
      time: "08.00 - 09.30 WIB",
      subject: "Shorof (Al-Amtsilah At-Tashrifiyah)",
      class: "Kelas Wustha 1",
      room: "Ruang B-03",
      teacher: "Ustadz Zaid",
      status: "MENDATANG",
    },
  ]);

  const handleAddSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const newJadwal = {
      id: `JDW-0${schedule.length + 1}`,
      day: (fd.get("day") as string) || selectedDay,
      time: (fd.get("time") as string) || "08.00 - 09.30 WIB",
      subject: (fd.get("subject") as string) || "Mata Pelajaran",
      class: (fd.get("class") as string) || "Kelas Ulya",
      room: (fd.get("room") as string) || "Ruang Kelas",
      teacher: (fd.get("teacher") as string) || "Ustadz Pengajar",
      status: "MENDATANG",
    };
    setSchedule([...schedule, newJadwal]);
    setIsAddOpen(false);
    setFeedback(`Jadwal pelajaran "${newJadwal.subject}" (${newJadwal.day}) berhasil ditambahkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSchedule) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const updated = {
      ...editingSchedule,
      day: (fd.get("day") as string) || editingSchedule.day,
      time: (fd.get("time") as string) || editingSchedule.time,
      subject: (fd.get("subject") as string) || editingSchedule.subject,
      class: (fd.get("class") as string) || editingSchedule.class,
      room: (fd.get("room") as string) || editingSchedule.room,
      teacher: (fd.get("teacher") as string) || editingSchedule.teacher,
      status: (fd.get("status") as string) || editingSchedule.status,
    };
    setSchedule(schedule.map((s) => (s.id === editingSchedule.id ? updated : s)));
    setEditingSchedule(null);
    setFeedback(`Jadwal "${updated.subject}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteSchedule = (id: string, subject: string) => {
    if (confirm(`Yakin ingin menghapus jadwal "${subject}"?`)) {
      setSchedule(schedule.filter((s) => s.id !== id));
      setFeedback(`Jadwal "${subject}" telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filteredSchedule = schedule.filter((s) => s.day === selectedDay);

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
            <span>KBM & Penjadwalan • Kurikulum Pesantren</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Jadwal Pelajaran & KBM</h1>
          <p className="text-xs md:text-sm text-teal-100/80 mt-1">
            Jadwal tatap muka diniyah, halaqah tahfizh, dan mata pelajaran umum di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-teal-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Jadwal KBM</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {["SENIN", "SELASA", "RABU", "KAMIS", "SABTU", "AHAD"].map((day) => {
          const count = schedule.filter((s) => s.day === day).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedDay === day
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>Hari {day}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedDay === day ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredSchedule.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-slate-300 text-slate-500 text-xs">
          Belum ada jadwal KBM pada hari {selectedDay}. Klik tombol &quot;Tambah Jadwal KBM&quot; untuk menambahkan.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchedule.map((s) => (
            <Card key={s.id} className="p-5 hover:border-teal-400 hover:shadow-md transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{s.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={s.status === "SELESAI" ? "success" : s.status === "SEDANG_BERJALAN" ? "warning" : "default"} className="text-[10px]">
                    {s.status.replace("_", " ")}
                  </Badge>
                  <button
                    onClick={() => setEditingSchedule(s)}
                    title="Edit Jadwal"
                    className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(s.id, s.subject)}
                    title="Hapus Jadwal"
                    className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm md:text-base font-bold text-slate-900">{s.subject}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{s.class} • Pengajar: <strong className="text-slate-800">{s.teacher}</strong></p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {s.room}
                </span>
                <span className="font-semibold text-slate-800">Tatap Muka Rutin</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Tambah Jadwal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-teal-600" />
                Tambah Jadwal KBM Baru
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSchedule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mata Pelajaran / Kitab</label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Contoh: Fiqih (Fathul Qorib)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hari</label>
                  <select name="day" defaultValue={selectedDay} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    {["SENIN", "SELASA", "RABU", "KAMIS", "SABTU", "AHAD"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jam KBM</label>
                  <input
                    type="text"
                    name="time"
                    required
                    placeholder="07.30 - 09.00 WIB"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Rombel Kelas</label>
                  <input
                    type="text"
                    name="class"
                    required
                    placeholder="Kelas Ulya 2"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ruang Kelas</label>
                  <input
                    type="text"
                    name="room"
                    required
                    placeholder="Ruang A-01"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Guru / Ustadz Pengajar</label>
                <input
                  type="text"
                  name="teacher"
                  required
                  placeholder="Ustadz Ahmad Fauzi, Lc."
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Jadwal */}
      {editingSchedule && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Jadwal: {editingSchedule.subject}
              </h3>
              <button onClick={() => setEditingSchedule(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSchedule} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  name="subject"
                  defaultValue={editingSchedule.subject}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Hari</label>
                  <select name="day" defaultValue={editingSchedule.day} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    {["SENIN", "SELASA", "RABU", "KAMIS", "SABTU", "AHAD"].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Jam KBM</label>
                  <input
                    type="text"
                    name="time"
                    defaultValue={editingSchedule.time}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Rombel Kelas</label>
                  <input
                    type="text"
                    name="class"
                    defaultValue={editingSchedule.class}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Ruang</label>
                  <input
                    type="text"
                    name="room"
                    defaultValue={editingSchedule.room}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Guru Pengajar</label>
                <input
                  type="text"
                  name="teacher"
                  defaultValue={editingSchedule.teacher}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Status</label>
                <select name="status" defaultValue={editingSchedule.status} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                  <option value="MENDATANG">MENDATANG</option>
                  <option value="SEDANG_BERJALAN">SEDANG_BERJALAN</option>
                  <option value="SELESAI">SELESAI</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSchedule(null)}
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
