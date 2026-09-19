import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number to Indonesian Rupiah currency format (e.g., Rp 500.000)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a Date to Indonesian locale format
 */
export function formatDateId(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    ...options,
  }).format(d);
}

/**
 * Generates a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// -------------------------------------------------------------
// Standard SantriOS Error Hierarchy (Section 31 of Master Prompt)
// -------------------------------------------------------------

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 400, code = "APP_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  public readonly errors: Record<string, string[]>;
  constructor(message: string, errors: Record<string, string[]> = {}) {
    super(message, 422, "VALIDATION_ERROR");
    this.errors = errors;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Anda harus login untuk mengakses fitur ini.") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Anda tidak memiliki hak akses untuk tindakan ini.") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Data yang diminta tidak ditemukan.") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Terjadi konflik dengan data yang sudah ada.") {
    super(message, 409, "CONFLICT");
  }
}

export class TenantAccessError extends AppError {
  constructor(message = "Akses multi-tenant ditolak atau tenant tidak sesuai.") {
    super(message, 403, "TENANT_ACCESS_ERROR");
  }
}

export class ModuleDisabledError extends AppError {
  public readonly moduleKey?: string;
  constructor(moduleKey?: string) {
    const msg = moduleKey
      ? `Modul ${moduleKey} belum diaktifkan untuk pesantren Anda.`
      : "Modul ini tidak aktif pada pesantren Anda.";
    super(msg, 403, "MODULE_DISABLED_ERROR");
    this.moduleKey = moduleKey;
  }
}
