import React from "react";
import { cn } from "@santrios/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md",
        onClick && "cursor-pointer active:scale-[0.98]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="text-xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            {icon}
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {trend && (
            <span
              className={cn(
                "font-medium",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
