import React, { Suspense } from "react";
import { OnboardingWizard } from "./onboarding-wizard";

export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between py-8 px-4 selection:bg-emerald-500">
      <Suspense fallback={<div className="text-white text-xs text-center py-12">Memuat formulir pendaftaran pesantren...</div>}>
        <OnboardingWizard />
      </Suspense>

      <footer className="text-center text-xs text-slate-500 pt-8">
        SantriOS &copy; 2026 — Multi-Tenant Architecture Foundation v0.1
      </footer>
    </div>
  );
}
