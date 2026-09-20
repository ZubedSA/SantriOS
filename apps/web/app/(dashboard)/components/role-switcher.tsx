"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Crown,
  ShieldAlert,
  CreditCard,
  BookOpen,
  Building,
  GraduationCap,
  Sparkles,
  Check,
} from "lucide-react";

interface RoleSwitcherProps {
  currentRole: string;
  userName: string;
}

const ROLES = [
  {
    key: "KIAI",
    label: "Kiai / Pengasuh",
    desc: "Executive Mode: Radar Pesantren, Approval & Disposisi",
    icon: Crown,
    color: "text-amber-500 bg-amber-50 border-amber-200",
  },
  {
    key: "ADMIN",
    label: "Admin / TU / Sekretaris",
    desc: "Administration Mode: Data Induk, Surat, PPDB & Tugas TU",
    icon: ShieldAlert,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    key: "GURU",
    label: "Guru / Ustadz",
    desc: "Teaching Mode: KBM, Absen Cepat, Nilai & Guru Tahfizh",
    icon: BookOpen,
    color: "text-teal-600 bg-teal-50 border-teal-200",
  },
  {
    key: "BENDAHARA",
    label: "Bendahara",
    desc: "Finance Mode: Kasir SPP, Tagihan Massal, Kas & Approval",
    icon: CreditCard,
    color: "text-sky-600 bg-sky-50 border-sky-200",
  },
  {
    key: "KESANTRIAN",
    label: "Kesantrian & Kedisiplinan",
    desc: "Student Development: Pelanggaran, Ta'zir, Asrama & Izin",
    icon: Building,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
  },
  {
    key: "WALI_SANTRI",
    label: "Wali Santri",
    desc: "Portal Wali: Capaian Anak, Ibadah, Rapor & Tagihan SPP",
    icon: GraduationCap,
    color: "text-rose-600 bg-rose-50 border-rose-200",
  },
];

export function RoleSwitcher({ currentRole, userName }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitch = async (roleKey: string) => {
    if (roleKey === currentRole) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    try {
      const res = await fetch("/api/auth/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleKey }),
      });

      if (res.ok) {
        setIsOpen(false);
        // Refresh and navigate to dashboard of new role
        window.location.href = "/dashboard";
      } else {
        alert("Gagal beralih peran.");
        setIsSwitching(false);
      }
    } catch {
      alert("Terjadi kesalahan jaringan saat beralih peran.");
      setIsSwitching(false);
    }
  };

  const isRoleActive = (key: string) => {
    if (key === "KIAI") return currentRole === "KIAI" || currentRole === "OWNER";
    if (key === "KESANTRIAN") return currentRole === "KESANTRIAN" || currentRole === "MUSYRIF";
    return currentRole === key;
  };

  const activeRoleObj = ROLES.find((r) => isRoleActive(r.key)) || ROLES[0];

  const IconComp = activeRoleObj.icon;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-xs font-semibold text-slate-800 transition-all active:scale-95 shadow-xs"
        title="Klik untuk simulasi beralih peran"
      >
        <div className={`p-1 rounded-lg ${activeRoleObj.color}`}>
          <IconComp className="w-3.5 h-3.5" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-[10px] text-slate-500 font-medium leading-none">Simulasi Peran</p>
          <p className="text-xs font-bold text-slate-900 leading-tight">{activeRoleObj.label}</p>
        </div>
        <span className="sm:hidden text-xs font-bold">{activeRoleObj.label.split(" ")[0]}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 z-50 animate-in fade-in-50 zoom-in-95">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Ganti Peran Akun Demo
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                1-Klik
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Pilih peran untuk menguji workflow dan antarmuka masing-masing bagian.
            </p>
          </div>

          <div className="space-y-1">
            {ROLES.map((r) => {
              const ItemIcon = r.icon;
              const isSelected = isRoleActive(r.key);

              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => handleSwitch(r.key)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all text-xs ${
                    isSelected
                      ? "bg-slate-100/90 font-bold text-slate-900 border border-slate-200/80"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${r.color}`}>
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{r.label}</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{r.desc}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
