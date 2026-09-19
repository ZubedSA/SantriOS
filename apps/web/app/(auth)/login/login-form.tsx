"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card, Badge } from "@santrios/ui";
import { ShieldCheck, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payloadEmail = customEmail || email;
    const payloadPassword = customPassword || password;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: payloadEmail,
          password: payloadPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Login gagal. Periksa kembali email dan kata sandi.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMessage("Gagal terhubung ke server. Pastikan koneksi aman.");
      setIsLoading(false);
    }
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Demo123456!");
    handleLogin(undefined, demoEmail, "Demo123456!");
  };

  return (
    <div className="w-full max-w-md space-y-6 relative z-10">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-bold text-xl shadow-lg shadow-emerald-600/30">
          S
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Masuk ke SantriOS</h2>
        <p className="text-xs text-slate-400">Sistem Operasi Pesantren Modern Multi-Tenant</p>
      </div>

      {/* Login Card */}
      <Card className="p-6 bg-slate-800/90 border-slate-700/80 shadow-2xl backdrop-blur-md text-white">
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Pengguna
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@demo.local"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">Kata Sandi</label>
              <span className="text-[11px] text-emerald-400 hover:underline cursor-pointer">
                Lupa sandi?
              </span>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="emerald"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2 font-semibold shadow-lg shadow-emerald-700/30"
          >
            Masuk Sekarang
          </Button>
        </form>

        {/* Quick Demo Logins Section */}
        <div className="mt-6 pt-5 border-t border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Uji Coba Akun Demo Cepat
            </span>
            <Badge variant="info">1-Klik</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => quickLogin("owner@demo.local")}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
            >
              <p className="font-semibold text-emerald-400">Pimpinan / Owner</p>
              <p className="text-[10px] text-slate-400">owner@demo.local</p>
            </button>

            <button
              type="button"
              onClick={() => quickLogin("admin@demo.local")}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
            >
              <p className="font-semibold text-teal-400">Administrator</p>
              <p className="text-[10px] text-slate-400">admin@demo.local</p>
            </button>

            <button
              type="button"
              onClick={() => quickLogin("bendahara@demo.local")}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
            >
              <p className="font-semibold text-sky-400">Bendahara</p>
              <p className="text-[10px] text-slate-400">bendahara@demo.local</p>
            </button>

            <button
              type="button"
              onClick={() => quickLogin("guru@demo.local")}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
            >
              <p className="font-semibold text-amber-400">Guru / Pengajar</p>
              <p className="text-[10px] text-slate-400">guru@demo.local</p>
            </button>

            <button
              type="button"
              onClick={() => quickLogin("musyrif@demo.local")}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
            >
              <p className="font-semibold text-indigo-400">Musyrif Asrama</p>
              <p className="text-[10px] text-slate-400">musyrif@demo.local</p>
            </button>

            <button
              type="button"
              onClick={() => quickLogin("wali@demo.local")}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700/60 text-left transition-colors"
            >
              <p className="font-semibold text-rose-400">Wali Santri</p>
              <p className="text-[10px] text-slate-400">wali@demo.local</p>
            </button>
          </div>
        </div>
      </Card>

      {/* Footer Navigation */}
      <div className="text-center text-xs text-slate-400">
        Pesantren Anda belum terdaftar?{" "}
        <Link href="/onboarding" className="text-emerald-400 font-semibold hover:underline">
          Daftarkan Pesantren Sekarang
        </Link>
      </div>
    </div>
  );
}
