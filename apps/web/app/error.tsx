"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global app error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Terjadi Kendala Sistem</h1>
      <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
        Terjadi kesalahan saat memproses data. Silakan coba memuat ulang atau kembali ke dashboard.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
        >
          Ke Dashboard
        </a>
      </div>
    </div>
  );
}
