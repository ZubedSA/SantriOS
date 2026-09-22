"use client";

import React from "react";
import { cn } from "@santrios/utils";
import { LayoutDashboard, Users, Activity, CreditCard, Grid } from "lucide-react";

export interface MobileNavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export interface MobileNavProps {
  currentPath?: string;
  onNavigate?: (href: string) => void;
  onPrefetch?: (href: string) => void;
  className?: string;
  items?: MobileNavItem[];
}

export function MobileNav({
  currentPath = "/dashboard",
  onNavigate,
  onPrefetch,
  className,
  items,
}: MobileNavProps) {
  const defaultItems: MobileNavItem[] = [
    { label: "Home", href: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Santri", href: "/dashboard/santri", icon: <Users className="w-5 h-5" /> },
    { label: "Aktivitas", href: "/dashboard/santri", icon: <Activity className="w-5 h-5" /> },
    { label: "Keuangan", href: "/dashboard/finance", icon: <CreditCard className="w-5 h-5" /> },
    { label: "Lainnya", href: "/modules", icon: <Grid className="w-5 h-5" /> },
  ];

  const navItems = items && items.length > 0 ? items : defaultItems;

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-slate-200/80 bg-white/95 px-2 backdrop-blur-md md:hidden safe-area-bottom",
        className
      )}
    >
      {navItems.map((item, index) => {
        const key = item.href || `${item.label}-${index}`;
        const isActive =
          item.active !== undefined
            ? item.active
            : item.href
            ? currentPath === item.href || (item.href !== "/dashboard" && currentPath.startsWith(item.href))
            : false;

        const handleClick = () => {
          if (item.onClick) {
            item.onClick();
          } else if (item.href && onNavigate) {
            onNavigate(item.href);
          }
        };

        const handlePrefetch = () => {
          if (item.href && onPrefetch) {
            onPrefetch(item.href);
          }
        };

        return (
          <button
            key={key}
            onClick={handleClick}
            onMouseEnter={handlePrefetch}
            onTouchStart={handlePrefetch}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all duration-150 min-w-[56px]",
              isActive
                ? "text-emerald-700 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <div className={cn("transition-transform", isActive && "scale-110")}>
              {item.icon}
            </div>
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
