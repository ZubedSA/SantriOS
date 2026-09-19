import Link from "next/link";
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ShieldCheck, Layers, Smartphone, Database, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getCurrentSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white selection:bg-emerald-500">
      {/* Navbar */}
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 font-bold text-white text-lg">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">SantriOS</h1>
            <p className="text-[10px] text-emerald-300 font-medium tracking-wide uppercase">Operating System for Modern Pesantren</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-xl text-slate-200 hover:text-white transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/onboarding"
            className="px-4 py-2 text-sm font-medium rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            Daftar Pesantren
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-24 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          SantriOS Foundation v0.1 Ready
        </div>

        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
          Platform SaaS Modular & Multi-Tenant untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Pesantren Modern</span>
        </h2>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Satu platform terintegrasi untuk mengelola seluruh aspek kepesantrenan: administrasi santri, keuangan, absensi harian, setoran tahfizh, dan portal wali dengan arsitektur multi-tenant terisolasi.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
          >
            Buka Demo Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/onboarding"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 flex items-center justify-center transition-all hover:border-slate-600"
          >
            Mulai Onboarding Pesantren
          </Link>
        </div>
      </section>

      {/* Feature Pills */}
      <section className="px-6 py-10 max-w-5xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-2 text-left">
          <Smartphone className="w-6 h-6 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Mobile-First UX</h3>
          <p className="text-xs text-slate-400">Dirancang khusus untuk layar 320px–430px dengan navigasi bottom-bar responsif.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-2 text-left">
          <ShieldCheck className="w-6 h-6 text-teal-400" />
          <h3 className="text-sm font-semibold text-white">Multi-Tenant Isolation</h3>
          <p className="text-xs text-slate-400">Data antar pesantren terpisah secara mutlak melalui tenantDb repository layer.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-2 text-left">
          <Layers className="w-6 h-6 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">13 Modul Fleksibel</h3>
          <p className="text-xs text-slate-400">Setiap pesantren bebas mengaktifkan modul sesuai kapasitas operasionalnya.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-2 text-left">
          <Database className="w-6 h-6 text-teal-400" />
          <h3 className="text-sm font-semibold text-white">Neon PostgreSQL</h3>
          <p className="text-xs text-slate-400">Serverless PostgreSQL berkecepatan tinggi dengan Prisma ORM terpusat.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-slate-800/60 text-center text-xs text-slate-400">
        SantriOS &copy; 2026 — Built for Indonesian Pesantren Digital Transformation.
      </footer>
    </main>
  );
}
