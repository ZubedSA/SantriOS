"use client";

import React from "react";
import { Menu } from "lucide-react";

export function MobileMenuTrigger() {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Buka Navigasi Lengkap"
      className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
      aria-label="Buka Menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
