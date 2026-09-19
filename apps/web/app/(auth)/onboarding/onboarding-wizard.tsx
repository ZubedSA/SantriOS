"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Card, Badge } from "@santrios/ui";
import { SANTRIOS_MODULES, ALL_MODULE_KEYS } from "@santrios/modules";
import { ModuleKey } from "@santrios/types";
import {
  Building2,
  Layers,
  UserCheck,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    city: "",
    province: "",
    phone: "",
    selectedModules: ["SANTRI", "KEUANGAN", "ABSENSI", "TAHFIZH", "WALI_SANTRI"] as string[],
    ownerName: "",
    ownerEmail: "",
    ownerPassword: "",
  });

  const handleNameChange = (name: string) => {
    const autoSlug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const toggleModule = (key: ModuleKey) => {
    if (key === "CORE") return; // CORE is permanent
    setFormData((prev) => {
      const exists = prev.selectedModules.includes(key);
      const updated = exists
        ? prev.selectedModules.filter((m) => m !== key)
        : [...prev.selectedModules, key];
      return { ...prev, selectedModules: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/tenant/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Gagal melakukan pendaftaran. Periksa input Anda.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMessage("Koneksi gagal saat proses registrasi. Silakan coba kembali.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white text-base shadow-md">
            S
          </div>
          <span className="font-bold text-base tracking-tight">SantriOS</span>
        </Link>
        <Link href="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
          Sudah terdaftar? <span className="text-emerald-400 font-semibold">Masuk</span>
        </Link>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 1 ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30" : "bg-slate-800 text-slate-400"
            }`}
          >
            1
          </div>
          <span className={`text-xs font-medium ${step >= 1 ? "text-emerald-300" : "text-slate-500"}`}>
            Profil Pesantren
          </span>
        </div>

        <div className={`flex-1 h-0.5 mx-3 ${step >= 2 ? "bg-emerald-500" : "bg-slate-800"}`} />

        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 2 ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30" : "bg-slate-800 text-slate-400"
            }`}
          >
            2
          </div>
          <span className={`text-xs font-medium ${step >= 2 ? "text-emerald-300" : "text-slate-500"}`}>
            Pilih Modul
          </span>
        </div>

        <div className={`flex-1 h-0.5 mx-3 ${step >= 3 ? "bg-emerald-500" : "bg-slate-800"}`} />

        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= 3 ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30" : "bg-slate-800 text-slate-400"
            }`}
          >
            3
          </div>
          <span className={`text-xs font-medium ${step >= 3 ? "text-emerald-300" : "text-slate-500"}`}>
            Akun Pimpinan
          </span>
        </div>
      </div>

      {/* Wizard Card Form */}
      <Card className="p-6 md:p-8 bg-slate-800/90 border-slate-700/80 shadow-2xl backdrop-blur-md text-white">
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: PROFIL PESANTREN */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Identitas Pondok Pesantren
              </h3>
              <p className="text-xs text-slate-400">
                Data ini akan menjadi identitas resmi tenant pesantren Anda dalam sistem SantriOS.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Pondok Pesantren *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Pondok Pesantren Darul Muttaqin"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subdomain / Slug Unik *
                </label>
                <div className="flex items-center rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm">
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        slug: e.target.value.toLowerCase().replace(/[^\w-]/g, ""),
                      })
                    }
                    placeholder="darul-muttaqin"
                    className="bg-transparent text-white outline-none w-full"
                  />
                  <span className="text-xs text-slate-400 shrink-0">.santrios.id</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Alamat unik untuk isolasi data dan akses pesantren Anda.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tagline / Motto Pesantren
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Contoh: Berilmu, Beramal, Berakhlakul Karimah"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kota / Kab</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Malang"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="Jawa Timur"
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="button"
                variant="emerald"
                size="md"
                disabled={!formData.name || !formData.slug}
                onClick={() => setStep(2)}
                className="gap-2"
              >
                Lanjut ke Pilih Modul
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PILIH MODUL */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                Pilih Modul Awal Pesantren
              </h3>
              <p className="text-xs text-slate-400">
                Pilih modul yang ingin diaktifkan sekarang. Anda dapat mengubahnya kapan saja nanti.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1 pt-2">
              {ALL_MODULE_KEYS.map((key) => {
                const mod = SANTRIOS_MODULES[key];
                const isCore = mod.isCore;
                const isSelected = isCore || formData.selectedModules.includes(key);

                return (
                  <div
                    key={key}
                    onClick={() => !isCore && toggleModule(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isCore
                        ? "bg-emerald-950/40 border-emerald-500/40 cursor-default"
                        : isSelected
                        ? "bg-slate-700/60 border-emerald-500 cursor-pointer shadow-sm"
                        : "bg-slate-900/60 border-slate-700/60 opacity-60 hover:opacity-100 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{mod.name}</span>
                      {isSelected ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2">{mod.description}</p>
                    {isCore && <span className="text-[10px] text-emerald-400 font-medium mt-1 inline-block">Wajib (Core)</span>}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-700/60">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(1)}
                className="gap-2 text-slate-300 border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>

              <Button
                type="button"
                variant="emerald"
                size="md"
                onClick={() => setStep(3)}
                className="gap-2"
              >
                Lanjut ke Akun Pimpinan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: AKUN PIMPINAN */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                Akun Pimpinan / Pengasuh (Owner)
              </h3>
              <p className="text-xs text-slate-400">
                Akun pemilik utama yang memiliki kendali penuh atas seluruh tata kelola pesantren.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama Lengkap Pimpinan / Pengasuh *
                </label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Contoh: KH. Ahmad Dahlan / Ustadz Muhammad"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Login Pimpinan *
                </label>
                <input
                  type="email"
                  required
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  placeholder="kyai@pesantren.id"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kata Sandi Login *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.ownerPassword}
                  onChange={(e) => setFormData({ ...formData, ownerPassword: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {/* Summary Box */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-1">
                <p className="font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Ringkasan Registrasi:
                </p>
                <p className="text-slate-300">
                  Pesantren: <span className="text-white font-medium">{formData.name}</span> ({formData.slug}.santrios.id)
                </p>
                <p className="text-slate-300">
                  Modul Aktif: <span className="text-white font-medium">{formData.selectedModules.length + 1} modul</span>
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-700/60">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(2)}
                className="gap-2 text-slate-300 border-slate-700"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>

              <Button
                type="submit"
                variant="emerald"
                size="lg"
                isLoading={isLoading}
                className="gap-2 font-semibold shadow-lg shadow-emerald-600/30"
              >
                Selesaikan & Masuk Dashboard
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
