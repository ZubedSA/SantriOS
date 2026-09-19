import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 mb-4 shadow-lg">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight">404 — Halaman Tidak Ditemukan</h1>
      <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
        Halaman atau modul yang Anda cari tidak tersedia atau belum diaktifkan untuk pesantren Anda.
      </p>
      <a
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Dashboard
      </a>
    </div>
  );
}
