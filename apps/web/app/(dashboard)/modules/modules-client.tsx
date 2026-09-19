"use client";

import React, { useState } from "react";
import { SANTRIOS_MODULES, ALL_MODULE_KEYS } from "@santrios/modules";
import { ModuleKey } from "@santrios/types";
import { Card, Badge, Button } from "@santrios/ui";
import {
  Layers,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Lock,
  Sparkles,
  Info,
  Send,
  Building,
} from "lucide-react";

interface ModulesClientProps {
  tenantName: string;
  tenantId: string;
  userRole?: string;
  initialActiveModules?: string[];
}

export default function ModulesClient({
  tenantName,
  tenantId,
  userRole = "OWNER",
  initialActiveModules = ["CORE", "SANTRI", "KEUANGAN", "ABSENSI", "TAHFIZH", "ASRAMA", "PERIZINAN", "WALI_SANTRI"],
}: ModulesClientProps) {
  const isOwner = userRole === "OWNER" || userRole === "SUPER_ADMIN";

  const [activeModules, setActiveModules] = useState<string[]>(initialActiveModules);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleToggle = async (key: ModuleKey, currentlyEnabled: boolean) => {
    if (!isOwner) return;
    if (key === "CORE") return;

    setLoadingKey(key);
    setFeedback(null);

    const nextEnabled = !currentlyEnabled;

    try {
      const res = await fetch("/api/tenant/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: tenantId || "al-hikmah",
          moduleKey: key,
          enabled: nextEnabled,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", message: data.message || "Gagal mengubah status modul." });
        setLoadingKey(null);
        return;
      }

      if (nextEnabled) {
        setActiveModules((prev) => [...prev, key]);
      } else {
        setActiveModules((prev) => prev.filter((m) => m !== key));
      }

      setFeedback({ type: "success", message: data.message });
      setLoadingKey(null);
    } catch (err: any) {
      setFeedback({ type: "error", message: "Gagal terhubung ke server." });
      setLoadingKey(null);
    }
  };

  const handleRequestModule = (moduleName: string) => {
    alert(`Permintaan aktivasi modul "${moduleName}" telah diteruskan ke Kyai / Pimpinan Pesantren.`);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant={isOwner ? "success" : "default"}
              className={`text-[10px] font-semibold tracking-wide uppercase px-2.5 py-0.5 ${
                isOwner ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-emerald-100 text-emerald-800 border-emerald-200"
              }`}
            >
              {isOwner ? "👑 Panel Kontrol Lisensi Yayasan" : "🛠️ Katalog Fitur & Modul TU"}
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-emerald-600" />
            {isOwner ? "Registry & Pengelolaan Modul SaaS" : "Katalog Modul Aktif Pesantren"}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {isOwner
              ? `Konfigurasi modular SantriOS: Aktifkan atau nonaktifkan fitur sesuai paket langganan dan kebutuhan yayasan di ${tenantName}.`
              : `Daftar fitur dan modul sistem yang aktif di ${tenantName}. Perubahan lisensi dikelola oleh Pimpinan Yayasan.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-3 py-1 text-xs">
            {activeModules.length} Modul Aktif
          </Badge>
          <Badge variant="default" className="px-3 py-1 text-xs">
            {ALL_MODULE_KEYS.length - activeModules.length} Tersedia
          </Badge>
        </div>
      </div>

      {/* Admin Notice Strip */}
      {!isOwner && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <b>Tata Kelola Lisensi:</b> Pengaturan aktivasi dan penonaktifan modul memerlukan wewenang akun <b>Pimpinan (Owner)</b>. Anda dapat melihat modul yang sedang aktif atau mengajukan aktivasi modul tambahan.
          </span>
        </div>
      )}

      {/* Owner Plan Banner */}
      {isOwner && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">Paket Langganan Yayasan</span>
            </div>
            <p className="text-sm font-extrabold text-white">SantriOS Pesantren Mandiri — Tier Unlimited</p>
            <p className="text-xs text-emerald-200">
              Hak akses penuh ke seluruh ekosistem modul, multi-asrama, backup otomatis, dan audit trail perbankan.
            </p>
          </div>

          <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs self-start sm:self-auto">
            Langganan Aktif
          </Badge>
        </div>
      )}

      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 border animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* ================= MODULES GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_MODULE_KEYS.map((key) => {
          const mod = SANTRIOS_MODULES[key];
          const isEnabled = activeModules.includes(key);
          const isCore = mod.isCore;
          const isProcessing = loadingKey === key;

          return (
            <Card
              key={key}
              className={`p-5 flex flex-col justify-between transition-all ${
                isEnabled ? "border-emerald-200 bg-white" : "border-slate-200/80 bg-slate-50/70 opacity-80"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {key}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">{mod.name}</h3>
                  </div>

                  {isCore ? (
                    <Badge variant="success">Core</Badge>
                  ) : isEnabled ? (
                    <Badge variant="success">Aktif</Badge>
                  ) : (
                    <Badge variant="default">Non-Aktif</Badge>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">
                  {mod.description}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {isCore ? "Modul sistem pondasi" : isEnabled ? "Status: Aktif" : "Status: Non-Aktif"}
                </span>

                {/* Owner Control vs Admin Read-Only */}
                {isOwner ? (
                  isCore ? (
                    <span className="text-xs font-semibold text-slate-400 cursor-not-allowed">
                      Terkunci
                    </span>
                  ) : (
                    <button
                      disabled={isProcessing}
                      onClick={() => handleToggle(key, isEnabled)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                        isEnabled
                          ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                      }`}
                    >
                      {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
                      {isEnabled ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  )
                ) : (
                  /* Admin Actions */
                  isEnabled ? (
                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Siap Digunakan
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRequestModule(mod.name)}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1"
                    >
                      <Send className="w-3 h-3 text-slate-500" />
                      <span>Minta Aktivasi</span>
                    </button>
                  )
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
