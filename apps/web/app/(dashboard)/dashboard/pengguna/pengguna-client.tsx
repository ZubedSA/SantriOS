"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Edit3,
  Trash2,
  X,
  Mail,
  Phone,
  Shield,
  Crown,
  CreditCard,
  BookOpen,
  Building,
  GraduationCap,
  Copy,
} from "lucide-react";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleLabel: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
  lastLogin: string;
}

const INITIAL_USERS: UserAccount[] = [
  {
    id: "usr-01",
    name: "KH. Abdullah Munir",
    email: "kiai@demo.local",
    phone: "0812-3456-7890",
    role: "KIAI",
    roleLabel: "Kiai / Pengasuh",
    status: "ACTIVE",
    createdAt: "01 Jan 2026",
    lastLogin: "Hari ini, 07:15 WIB",
  },
  {
    id: "usr-02",
    name: "Ustadz Ridwan, S.Pd.",
    email: "admin@demo.local",
    phone: "0813-9876-5432",
    role: "ADMIN",
    roleLabel: "Admin / Sekretaris TU",
    status: "ACTIVE",
    createdAt: "02 Jan 2026",
    lastLogin: "Hari ini, 08:30 WIB",
  },
  {
    id: "usr-03",
    name: "Ustadz Syamsul Hadi, S.E.",
    email: "bendahara@demo.local",
    phone: "0852-1122-3344",
    role: "BENDAHARA",
    roleLabel: "Bendahara Pesantren",
    status: "ACTIVE",
    createdAt: "05 Jan 2026",
    lastLogin: "Kemarin, 16:45 WIB",
  },
  {
    id: "usr-04",
    name: "Ustadzah Fatimah, Lc.",
    email: "guru@demo.local",
    phone: "0878-3344-5566",
    role: "GURU",
    roleLabel: "Dewan Asatidz / Guru",
    status: "ACTIVE",
    createdAt: "10 Jan 2026",
    lastLogin: "Hari ini, 06:50 WIB",
  },
  {
    id: "usr-05",
    name: "Ustadz Fatih Al-Banjari",
    email: "kesantrian@demo.local",
    phone: "0896-7788-9900",
    role: "KESANTRIAN",
    roleLabel: "Kesantrian & Musyrif",
    status: "ACTIVE",
    createdAt: "12 Jan 2026",
    lastLogin: "Kemarin, 21:10 WIB",
  },
  {
    id: "usr-06",
    name: "Bpk. Rahmat Santoso",
    email: "wali@demo.local",
    phone: "0812-7711-8822",
    role: "WALI_SANTRI",
    roleLabel: "Wali Santri (Ahmad)",
    status: "ACTIVE",
    createdAt: "15 Feb 2026",
    lastLogin: "Kemarin, 19:30 WIB",
  },
  {
    id: "usr-07",
    name: "Ibu Siti Nurhaliza",
    email: "siti.wali@demo.local",
    phone: "0813-4455-6677",
    role: "WALI_SANTRI",
    roleLabel: "Wali Santri (Fatimah)",
    status: "PENDING",
    createdAt: "18 Feb 2026",
    lastLogin: "Belum pernah",
  },
];

const ROLE_OPTIONS = [
  { value: "KIAI", label: "Kiai / Pengasuh", icon: Crown, color: "text-amber-600 bg-amber-50 border-amber-200" },
  { value: "ADMIN", label: "Admin / Sekretaris TU", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { value: "BENDAHARA", label: "Bendahara", icon: CreditCard, color: "text-sky-600 bg-sky-50 border-sky-200" },
  { value: "GURU", label: "Guru / Ustadz", icon: BookOpen, color: "text-teal-600 bg-teal-50 border-teal-200" },
  { value: "KESANTRIAN", label: "Kesantrian / Musyrif", icon: Building, color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { value: "WALI_SANTRI", label: "Wali Santri", icon: GraduationCap, color: "text-rose-600 bg-rose-50 border-rose-200" },
];

export default function PenggunaClient({
  tenantName,
  currentUserRole,
}: {
  tenantName: string;
  currentUserRole: string;
}) {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [resettingUser, setResettingUser] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Create Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "GURU",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "PENDING",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const pendingCount = users.filter((u) => u.status === "PENDING").length;
  const staffCount = users.filter((u) => ["ADMIN", "GURU", "BENDAHARA", "KESANTRIAN"].includes(u.role)).length;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert("Harap lengkapi nama, email, dan password awal.");
      return;
    }

    const roleObj = ROLE_OPTIONS.find((r) => r.value === formData.role);
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || "-",
      role: formData.role,
      roleLabel: roleObj ? roleObj.label : formData.role,
      status: formData.status,
      createdAt: "Hari ini",
      lastLogin: "Belum pernah",
    };

    setUsers([newUser, ...users]);
    setShowCreateModal(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "GURU",
      status: "ACTIVE",
    });
    showToast(`Akun '${newUser.name}' (${newUser.roleLabel}) berhasil dibuat.`);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const roleObj = ROLE_OPTIONS.find((r) => r.value === editingUser.role);
    const updated: UserAccount = {
      ...editingUser,
      roleLabel: roleObj ? roleObj.label : editingUser.role,
    };

    setUsers(users.map((u) => (u.id === editingUser.id ? updated : u)));
    setEditingUser(null);
    showToast(`Data akun '${updated.name}' berhasil diperbarui.`);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus akun '${name}' secara permanen? Tindakan ini tidak dapat dibatalkan.`)) {
      setUsers(users.filter((u) => u.id !== id));
      showToast(`Akun '${name}' telah dihapus dari sistem.`);
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const newStatus = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          showToast(`Status akun '${u.name}' diubah menjadi ${newStatus}.`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser || !newPassword) return;

    showToast(`Password untuk '${resettingUser.email}' berhasil direset menjadi: ${newPassword}`);
    setResettingUser(null);
    setNewPassword("");
  };

  const getRoleBadge = (roleKey: string) => {
    const r = ROLE_OPTIONS.find((opt) => opt.value === roleKey);
    if (!r) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {roleKey}
        </span>
      );
    }
    const IconComp = r.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${r.color}`}>
        <IconComp className="w-3 h-3" />
        <span>{r.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
            <Shield className="w-4 h-4" />
            <span>Manajemen Akses Terpusat • {tenantName}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Manajemen Pengguna & Akun</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola seluruh akun login, kredensial password, hak akses peran (RBAC), dan status keaktifan dalam satu tempat.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Tambah Akun Pengguna</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Akun</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{users.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Pengguna terdaftar</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Akun Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{activeCount}</p>
          <p className="text-[10px] text-teal-600 mt-0.5 font-medium">Bisa login ke sistem</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Asatidz & Staf</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{staffCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Admin, Guru, Bendahara, Kesantrian</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Aktivasi</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{pendingCount}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Menunggu verifikasi pertama</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pengguna, email, atau nomor telepon..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none w-full md:w-48"
            >
              <option value="ALL">Semua Peran (Role)</option>
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:outline-none w-full md:w-36"
            >
              <option value="ALL">Semua Status</option>
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Nonaktif (Suspend)</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table & Mobile Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Pengguna</th>
                <th className="py-3 px-4">Kredensial & Kontak</th>
                <th className="py-3 px-4">Peran (Role)</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4">Terakhir Login</th>
                <th className="py-3 px-4 text-center">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Tidak ada akun pengguna yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">Terdaftar: {u.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono text-[11px]">{u.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{u.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{getRoleBadge(u.role)}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : u.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        }`}
                        title="Klik untuk mengubah status"
                      >
                        {u.status === "ACTIVE" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : u.status === "PENDING" ? (
                          <>
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Nonaktif</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">{u.lastLogin}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setResettingUser(u);
                            setNewPassword("Santri@" + Math.floor(1000 + Math.random() * 9000));
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          title="Edit Akun & Peran"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Hapus Akun"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: Card List */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              Tidak ada akun yang sesuai pencarian.
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div key={u.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs">{u.name}</h3>
                      <p className="text-[11px] text-slate-500 font-mono">{u.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(u.id)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      u.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {u.status}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div>{getRoleBadge(u.role)}</div>
                  <span className="text-[10px] text-slate-400">{u.phone}</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setResettingUser(u);
                      setNewPassword("Santri@" + Math.floor(1000 + Math.random() * 9000));
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <KeyRound className="w-3 h-3 text-amber-500" />
                    <span>Reset Pass</span>
                  </button>
                  <button
                    onClick={() => setEditingUser(u)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Edit3 className="w-3 h-3 text-sky-500" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id, u.name)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: Tambah Pengguna Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tambah Akun Pengguna Baru</h3>
                  <p className="text-[10px] text-slate-500">Buat kredensial login dan tentukan peran sistem</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ustadz M. Farhan, S.H.I."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email (Login) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@pesantren.id"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password Awal *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Kombinasi huruf & angka"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, password: "Santri@" + Math.floor(1000 + Math.random() * 9000) })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-emerald-600 hover:underline font-semibold"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Peran Akses (Role) *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Akun</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ACTIVE">Aktif Langsung</option>
                    <option value="PENDING">Pending Aktivasi</option>
                    <option value="INACTIVE">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Simpan & Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Pengguna */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Perbarui Akun Pengguna</h3>
                  <p className="text-[10px] text-slate-500">{editingUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP</label>
                <input
                  type="tel"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Peran Akses (Role)</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Akun</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ACTIVE">Aktif</option>
                    <option value="INACTIVE">Nonaktif (Suspend)</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Reset Password */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reset Password Akun</h3>
                  <p className="text-[10px] text-slate-500">{resettingUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setResettingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru yang Di-generate</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-slate-50 rounded-xl border border-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(newPassword);
                      showToast("Password disalin ke clipboard!");
                    }}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                    title="Salin Password"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Pengguna dapat langsung login dengan password ini atau menggantinya setelah login.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20"
                >
                  Terapkan Password Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
