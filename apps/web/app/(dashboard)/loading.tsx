import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse select-none">
      {/* Top Banner Skeleton */}
      <div className="rounded-3xl bg-slate-200/80 h-28 w-full p-6 flex flex-col justify-center gap-3">
        <div className="h-4 w-32 bg-slate-300 rounded-lg"></div>
        <div className="h-7 w-64 md:w-96 bg-slate-300 rounded-xl"></div>
      </div>

      {/* 4 StatCards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-200 rounded-md"></div>
              <div className="w-8 h-8 rounded-xl bg-slate-100"></div>
            </div>
            <div className="h-7 w-28 bg-slate-200 rounded-lg"></div>
            <div className="h-3 w-36 bg-slate-100 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Action Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="h-10 w-full sm:w-72 bg-white border border-slate-200 rounded-2xl"></div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="h-10 w-28 bg-white border border-slate-200 rounded-2xl"></div>
          <div className="h-10 w-36 bg-emerald-600/30 rounded-2xl"></div>
        </div>
      </div>

      {/* Card List / Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden divide-y divide-slate-100">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1">
              <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-36 md:w-56 bg-slate-200 rounded-md"></div>
                <div className="h-3 w-24 md:w-40 bg-slate-100 rounded-md"></div>
              </div>
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-lg shrink-0"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
