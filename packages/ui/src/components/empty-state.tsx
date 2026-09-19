import React from "react";
import { cn } from "@santrios/utils";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm border border-slate-100">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 max-w-sm text-xs text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
