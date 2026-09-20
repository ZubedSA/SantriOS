// User Roles defined in SantriOS Specification
export type SystemRoleType =
  | "SUPER_ADMIN"
  | "OWNER"
  | "KIAI"
  | "ADMIN"
  | "BENDAHARA"
  | "GURU"
  | "KESANTRIAN"
  | "MUSYRIF"
  | "WALI_SANTRI"
  | "SANTRI"
  | "STAFF";

// Teacher Assignments (Section 2 & 6 of Role Document)
// Role: Guru, Assignment: Guru Mapel, Wali Kelas, Guru Tahfizh
export type TeacherAssignment = "GURU_MAPEL" | "WALI_KELAS" | "GURU_TAHFIZH";

// Modular System Registry Keys
export type ModuleKey =
  | "CORE"
  | "SANTRI"
  | "KEUANGAN"
  | "ABSENSI"
  | "TAHFIZH"
  | "AKADEMIK"
  | "ASRAMA"
  | "PERIZINAN"
  | "WALI_SANTRI"
  | "PPDB"
  | "INVENTARIS"
  | "KOPERASI"
  | "ALUMNI";

// Tenant Status
export type TenantStatus = "ACTIVE" | "SUSPENDED" | "TRIAL" | "INACTIVE";

// User Status
export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";

// Core Tenant Interface
export interface Tenant {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  province?: string | null;
  logoUrl?: string | null;
  status: TenantStatus;
  createdAt: Date;
  updatedAt: Date;
}

// User Interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Role and Permission Interfaces
export interface Permission {
  id: string;
  key: string;
  name: string;
  moduleKey: ModuleKey;
  description?: string | null;
}

export interface Role {
  id: string;
  tenantId?: string | null;
  name: string;
  description?: string | null;
  isSystem: boolean;
  permissions?: Permission[];
}

export interface UserRole {
  id: string;
  userId: string;
  tenantId: string;
  roleId: string;
  role?: Role;
}

// Module and TenantModule
export interface ModuleInfo {
  id: string;
  key: ModuleKey;
  name: string;
  description: string;
  icon: string;
  isCore: boolean;
  isActive: boolean;
}

export interface TenantModule {
  id: string;
  tenantId: string;
  moduleId: string;
  enabled: boolean;
  activatedAt: Date;
  module?: ModuleInfo;
}

// Audit Log Interface
export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string | null;
  action: string;
  entity: string;
  entityId: string;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

// Auth Session Context
export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string | null;
  };
  tenant: {
    id: string;
    slug: string;
    name: string;
    logoUrl?: string | null;
  };
  role: {
    name: SystemRoleType | string;
    isSuperAdmin: boolean;
  };
  assignments?: TeacherAssignment[];
  permissions: string[];
  activeModules: ModuleKey[];
}

// Multi-Tenant Context
export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  userId?: string;
}

// -------------------------------------------------------------
// Extended Domain Types for 5 Roles (Section 3 - 8 of Specification)
// -------------------------------------------------------------

// Executive / Kiai Domain
export interface ExecutiveOverviewKPI {
  financialHealth: "STABIL" | "PERHATIAN" | "TINDAKAN";
  attendanceHealth: "STABIL" | "PERHATIAN" | "TINDAKAN";
  tahfizhHealth: "STABIL" | "PERHATIAN" | "TINDAKAN";
  academicHealth: "STABIL" | "PERHATIAN" | "TINDAKAN";
  disciplineHealth: "STABIL" | "PERHATIAN" | "TINDAKAN";
  dormitoryHealth: "STABIL" | "PERHATIAN" | "TINDAKAN";
  arrearsHealth: "STABIL" | "PERHATIAN" | "TINDAKAN";
  ppdbHealth: "STABIL" | "PERHATIAN" | "TINDAKAN";
}

export interface ExecutiveApproval {
  id: string;
  type: "EXPENSE" | "ACTIVITY" | "SPECIAL_PERMIT" | "POLICY";
  title: string;
  applicant: string;
  role: string;
  nominal?: number;
  date: string;
  urgency: "NORMAL" | "TINGGI" | "MENDESAK";
  status: "MENUNGGU" | "DISETUJUI" | "DITOLAK" | "REVISI";
  notes?: string;
}

export interface ExecutiveDisposition {
  id: string;
  title: string;
  picName: string;
  picRole: string;
  deadline: string;
  priority: "RENDAH" | "SEDANG" | "TINGGI";
  status: "MENUNGGU" | "PROSES" | "SELESAI";
  instructions: string;
  progressNotes?: string;
}

// Kesantrian & Kedisiplinan Domain
export interface DisciplineViolation {
  id: string;
  studentId: string;
  studentName: string;
  category: "RINGAN" | "SEDANG" | "BERAT";
  violation: string;
  points: number; // e.g. -2, -3, -5, -20
  location: string;
  date: string;
  reporter: string;
  actionTaken?: string;
  status: "TERCATAT" | "DALAM_PEMBINAAN" | "SELESAI";
}

export interface StudentAchievement {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  category: "AKADEMIK" | "TAHFIZH" | "AKHLAK" | "KEBERSIHAN" | "LOMBA";
  points: number; // e.g. +5, +10
  date: string;
  notes?: string;
}

export interface StudentCounseling {
  id: string;
  studentId: string;
  studentName: string;
  issue: string;
  mentor: string;
  actionPlan: string;
  targetDate: string;
  evaluationNotes?: string;
  status: "PROSES" | "MEMBAIK" | "SELESAI";
}

// Tahfizh Assignment Domain
export interface TahfizhHalaqah {
  id: string;
  name: string;
  mentorName: string;
  targetJuz: number;
  totalStudents: number;
  schedule: string;
}

export interface TahfizhSetoranInput {
  studentId: string;
  surah: string;
  ayahStart: number;
  ayahEnd: number;
  juz: number;
  type: "SABAQ" | "SABQI" | "MANZIL" | "TASMI";
  tajwidGrade: "MUMTAZ" | "JAYYID_JIDDAN" | "JAYYID" | "MAQBUL";
  fluencyGrade: "MUMTAZ" | "JAYYID_JIDDAN" | "JAYYID" | "MAQBUL";
  makhrajGrade: "MUMTAZ" | "JAYYID_JIDDAN" | "JAYYID" | "MAQBUL";
  overallGrade: "MUMTAZ" | "JAYYID_JIDDAN" | "JAYYID" | "MAQBUL";
  notes?: string;
}

// Finance Domain
export interface BulkInvoiceGeneration {
  classroomId?: string; // null for all active students
  title: string;
  category: "SPP" | "UANG_MAKAN" | "KEGIATAN" | "DAFTAR_ULANG";
  amount: number;
  dueDate: string;
  month: string;
  year: string;
}
