// User Roles defined in SantriOS Master Prompt
export type SystemRoleType =
  | "SUPER_ADMIN"
  | "OWNER"
  | "ADMIN"
  | "BENDAHARA"
  | "GURU"
  | "MUSYRIF"
  | "WALI_SANTRI"
  | "SANTRI"
  | "STAFF";

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
  permissions: string[];
  activeModules: ModuleKey[];
}

// Multi-Tenant Context
export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  userId?: string;
}
