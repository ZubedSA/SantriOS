import { AuthSession, SystemRoleType } from "@santrios/types";
import { ForbiddenError } from "@santrios/utils";

/**
 * Checks if current user has the specified system role
 */
export function hasRole(session: AuthSession, role: SystemRoleType | string): boolean {
  if (session.role.isSuperAdmin) return true;
  const currentRole = session.role.name;
  if (role === "KIAI" || role === "OWNER") {
    return currentRole === "KIAI" || currentRole === "OWNER";
  }
  if (role === "KESANTRIAN" || role === "MUSYRIF") {
    return currentRole === "KESANTRIAN" || currentRole === "MUSYRIF";
  }
  return currentRole === role;
}

/**
 * Checks if current user has a specific assignment (e.g. GURU_TAHFIZH, WALI_KELAS)
 */
export function hasAssignment(session: AuthSession, assignment: string): boolean {
  if (session.role.isSuperAdmin || session.role.name === "OWNER" || session.role.name === "KIAI") return true;
  return session.assignments?.includes(assignment as any) ?? false;
}

/**
 * Permission aliases dictionary to prevent mismatches between modules and server actions
 */
const PERMISSION_ALIASES: Record<string, string[]> = {
  "students.update": ["students.edit", "students.update"],
  "students.edit": ["students.update", "students.edit"],
  "hafalan.create": ["tahfizh.input", "tahfizh.setoran.create", "tahfizh.create", "hafalan.create"],
  "tahfizh.input": ["hafalan.create", "tahfizh.input", "tahfizh.setoran.create"],
  "permission.request": ["permits.create", "permits.view", "permits.request", "permission.request"],
  "permits.create": ["permission.request", "permits.create", "permits.view"],
  "permission.approve": ["permits.approve", "permission.approve"],
  "permits.approve": ["permission.approve", "permits.approve"],
  "permission.view": ["permits.view", "permission.view"],
  "permits.view": ["permission.view", "permits.view"],
};

/**
 * Checks if current user has a specific permission key
 */
export function hasPermission(session: AuthSession, permissionKey: string): boolean {
  if (!session) return false;
  if (session.role?.isSuperAdmin) return true;
  if (session.role?.name === "OWNER" || session.role?.name === "KIAI") return true; // Owner/Kiai has all permissions within their tenant
  if (!session.permissions || !Array.isArray(session.permissions)) return false;

  // Wildcard permissions
  if (session.permissions.includes("*") || session.permissions.includes("all")) return true;

  // Direct match
  if (session.permissions.includes(permissionKey)) return true;

  // Scope wildcard match e.g. "students.*"
  const [scope] = permissionKey.split(".");
  if (scope && session.permissions.includes(`${scope}.*`)) return true;

  // Alias lookup
  const aliases = PERMISSION_ALIASES[permissionKey];
  if (aliases && aliases.some((alias) => session.permissions.includes(alias))) {
    return true;
  }

  return false;
}

/**
 * Throws ForbiddenError if user lacks permission
 */
export function requirePermission(session: AuthSession, permissionKey: string): void {
  if (!hasPermission(session, permissionKey)) {
    throw new ForbiddenError(
      `Akses ditolak: Anda tidak memiliki izin '${permissionKey}'.`
    );
  }
}

/**
 * Validates SaaS Super Admin role
 */
export function isSuperAdmin(session: AuthSession): boolean {
  return session.role.isSuperAdmin === true;
}

export function requireSuperAdmin(session: AuthSession): void {
  if (!isSuperAdmin(session)) {
    throw new ForbiddenError("Akses ditolak: Hanya Super Admin SaaS yang diizinkan.");
  }
}
