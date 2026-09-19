import React, { Suspense } from "react";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 px-4 py-8 relative selection:bg-emerald-500">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="text-white text-xs">Memuat halaman login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
