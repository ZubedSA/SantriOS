"use client";

import React, { useState } from "react";
import { Card, Badge, StatCard } from "@santrios/ui";
import {
  Users,
  Search,
  PlusCircle,
  BookOpen,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  X,
  Edit3,
  Trash2,
  UserCheck,
} from "lucide-react";

interface GuruStafClientProps {
  tenantName: string;
}

export default function GuruStafClient({ tenantName }: GuruStafClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);

  const [teachers, setTeachers] = useState([
    {
      id: "TCH-001",
      name: "Ustadz Ahmad Fauzi, Lc.",
      nip: "19880412-2020-001",
      roleType: "GURU",
      assignments: ["Guru Fiqih (Fathul Qorib)", "Wali Kelas Ulya 2", "Guru Tahfizh"],
      phone: "0812-8877-6655",
      email: "ahmad.fauzi@santrios.id",
      status: "AKTIF",
      halaqah: "Halaqah Utsman (12 Santri)",
    },
    {
      id: "TCH-002",
      name: "Ustadz Fatih Ridwan, S.Pd.I.",
      nip: "19920815-2021-004",
      roleType: "GURU",
      assignments: ["Guru Bahasa Arab & Nahwu", "Pembina Kesantrian"],
      phone: "0813-7766-5544",
      email: "fatih.ridwan@santrios.id",
      status: "AKTIF",
      halaqah: "-",
    },
    {
      id: "TCH-003",
      name: "Ustadzah Siti Fatimah, Al-Hafizhah",
      nip: "19950120-2022-009",
      roleType: "GURU",
      assignments: ["Guru Tahfizh Putri", "Wali Kelas Wustha 1 Putri"],
      phone: "0852-3344-5566",
      email: "siti.fatimah@santrios.id",
      status: "AKTIF",
      halaqah: "Halaqah Aisyah (15 Santriwati)",
    },
    {
      id: "STF-001",
      name: "Bpk. Mulyadi Saputra",
      nip: "19850510-2018-002",
      roleType: "STAFF",
      assignments: ["Kepala Tata Usaha & Kearsipan"],
      phone: "0857-4433-2211",
      email: "mulyadi.tu@santrios.id",
      status: "AKTIF",
      halaqah: "-",
    },
    {
      id: "STF-002",
      name: "Ibu Nurhayati, S.Ak.",
      nip: "19930704-2023-011",
      roleType: "STAFF",
      assignments: ["Kasir & Bendahara Pesantren"],
      phone: "0821-9988-1122",
      email: "nurhayati.kasir@santrios.id",
      status: "AKTIF",
      halaqah: "-",
    },
  ]);

  const handleAddTeacher = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const roleType = (fd.get("roleType") as string) || "GURU";
    const assignmentsStr = (fd.get("assignments") as string) || "Guru Mata Pelajaran";
    const newTeacher = {
      id: `${roleType === "GURU" ? "TCH" : "STF"}-00${teachers.length + 1}`,
      name: (fd.get("name") as string) || "Pegawai Baru",
      nip: (fd.get("nip") as string) || `19900101-2026-0${teachers.length + 1}`,
      roleType: roleType as "GURU" | "STAFF",
      assignments: assignmentsStr.split(",").map((s) => s.trim()),
      phone: (fd.get("phone") as string) || "0812-0000-0000",
      email: (fd.get("email") as string) || "pegawai@santrios.id",
      status: "AKTIF",
      halaqah: (fd.get("halaqah") as string) || "-",
    };
    setTeachers([newTeacher, ...teachers]);
    setIsAddOpen(false);
    setFeedback(`Data pegawai "${newTeacher.name}" berhasil ditambahkan.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleUpdateTeacher = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTeacher) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const assignmentsStr = (fd.get("assignments") as string) || editingTeacher.assignments.join(", ");
    const updated = {
      ...editingTeacher,
      name: (fd.get("name") as string) || editingTeacher.name,
      nip: (fd.get("nip") as string) || editingTeacher.nip,
      roleType: (fd.get("roleType") as string) || editingTeacher.roleType,
      phone: (fd.get("phone") as string) || editingTeacher.phone,
      email: (fd.get("email") as string) || editingTeacher.email,
      halaqah: (fd.get("halaqah") as string) || editingTeacher.halaqah,
      assignments: assignmentsStr.split(",").map((s) => s.trim()),
    };
    setTeachers(teachers.map((t) => (t.id === editingTeacher.id ? updated : t)));
    setEditingTeacher(null);
    setFeedback(`Data "${updated.name}" berhasil diperbarui.`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (confirm(`Yakin ingin menonaktifkan / menghapus data "${name}"?`)) {
      setTeachers(teachers.filter((t) => t.id !== id));
      setFeedback(`Data pegawai "${name}" telah dihapus.`);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const filtered = teachers.filter((t) => {
    const matchQ = t.name.toLowerCase().includes(search.toLowerCase()) || t.nip.includes(search);
    const matchType = filter === "ALL" || t.roleType === filter;
    return matchQ && matchType;
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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 text-white shadow-xl border border-teal-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Kepegawaian • Dewan Asatidz & Tenaga Kependidikan</span>
          </div>
          <h1 className="text-xl md:text-3xl font-extrabold tracking-tight">Direktori Guru & Staff</h1>
          <p className="text-xs md:text-sm text-teal-100/80 mt-1">
            Manajemen NIP, bidang pengajaran, penugasan wali kelas, dan kontak asatidz di {tenantName}.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-teal-500/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Guru / Staff</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Total Guru / Asatidz" value={`${teachers.filter(t => t.roleType === 'GURU').length} Guru`} subtitle="Muallim & Penguji Tahfizh" />
        <StatCard title="Total Tenaga Staff" value={`${teachers.filter(t => t.roleType === 'STAFF').length} Karyawan`} subtitle="TU, Bendahara, Sarpras" />
        <StatCard title="Total Pegawai" value={`${teachers.length} Orang`} subtitle="Aktif bertugas" />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama guru, NIP, atau mata pelajaran..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "GURU", "STAFF"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === type ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {type === "ALL" ? "Semua Pegawai" : type === "GURU" ? "Dewan Guru" : "Tenaga Staff"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} className="p-4 hover:border-teal-400 hover:shadow-md transition-all space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  {t.name[0]}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">{t.name}</h3>
                  <p className="text-[11px] font-mono text-slate-400">NIP: {t.nip}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge variant={t.roleType === "GURU" ? "success" : "default"} className="text-[10px]">
                  {t.roleType}
                </Badge>
                <button
                  onClick={() => setEditingTeacher(t)}
                  title="Edit Pegawai"
                  className="p-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDeleteTeacher(t.id, t.name)}
                  title="Hapus Pegawai"
                  className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Penugasan & Assignment:</span>
              <ul className="list-disc pl-4 space-y-0.5 font-medium text-slate-800 text-[11px]">
                {t.assignments.map((asg, i) => (
                  <li key={i}>{asg}</li>
                ))}
              </ul>
              {t.halaqah !== "-" && (
                <div className="pt-1 text-[11px] text-amber-700 font-semibold">
                  📖 {t.halaqah}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {t.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {t.email.split("@")[0]}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tambah Guru / Staff */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-teal-600" />
                Tambah Dewan Guru / Staff
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Contoh: Ustadz Bilal Al-Habsyi, Lc."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">NIP / ID Pegawai</label>
                  <input
                    type="text"
                    name="nip"
                    placeholder="19950210-2026-005"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kategori Peran</label>
                  <select name="roleType" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="GURU">Guru / Asatidz</option>
                    <option value="STAFF">Tenaga Staff / TU</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Penugasan (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  name="assignments"
                  required
                  placeholder="Guru Hadits, Wali Kelas Wustha 2"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Binaan Halaqah Tahfizh (Opsional)</label>
                <input
                  type="text"
                  name="halaqah"
                  placeholder="Halaqah Ali (10 Santri) atau -"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email Resmi</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ustadz@santrios.id"
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
                  Simpan Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Guru / Staff */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                Edit Data: {editingTeacher.name}
              </h3>
              <button onClick={() => setEditingTeacher(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTeacher} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingTeacher.name}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">NIP</label>
                  <input
                    type="text"
                    name="nip"
                    defaultValue={editingTeacher.nip}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Kategori Peran</label>
                  <select name="roleType" defaultValue={editingTeacher.roleType} className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium">
                    <option value="GURU">Guru / Asatidz</option>
                    <option value="STAFF">Tenaga Staff / TU</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Penugasan (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  name="assignments"
                  defaultValue={editingTeacher.assignments.join(", ")}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Halaqah Tahfizh</label>
                <input
                  type="text"
                  name="halaqah"
                  defaultValue={editingTeacher.halaqah}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Nomor WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    defaultValue={editingTeacher.phone}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email Resmi</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingTeacher.email}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
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
