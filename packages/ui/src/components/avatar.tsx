import React from "react";
import { cn } from "@santrios/utils";

export interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ name, imageUrl, size = "md", className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeStyles = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-emerald-100 font-semibold text-emerald-800 select-none",
        sizeStyles[size],
        className
      )}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials || "SO"}</span>
      )}
    </div>
  );
}
