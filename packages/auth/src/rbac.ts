import { AuthSession, SystemRoleType } from "@santrios/types";
import { ForbiddenError } from "@santrios/utils";

/**
 * Checks if current user has the specified system role
 */
export function hasRole(session: AuthSession, role: SystemRoleType | string): boolean {
  if (session.role.isSuperAdmin) return true;
  return session.role.name === role;
}

/**
 * Checks if current user has a specific permission key
 */
export function hasPermission(session: AuthSession, permissionKey: string): boolean {
  if (session.role.isSuperAdmin) return true;
  if (session.role.name === "OWNER") return true; // Owner has all permissions within their tenant
  return session.permissions.includes(permissionKey);
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
