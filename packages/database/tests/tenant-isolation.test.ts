/**
 * SantriOS Multi-Tenant Isolation & Security Test Suite
 * Validates Section 48 & Section 6 of MASTER PROMPT — SANTRIOS.md
 */

import { createTenantDb } from "../src/tenant";
import { TenantAccessError, ForbiddenError, ModuleDisabledError } from "@santrios/utils";
import { hasRole, hasPermission, requirePermission, isSuperAdmin } from "@santrios/auth";
import { hasModule, assertModuleEnabled } from "@santrios/modules";
import { AuthSession } from "@santrios/types";

function runTest(name: string, fn: () => void | Promise<void>) {
  return async () => {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      return true;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      return false;
    }
  };
}

async function main() {
  console.log("\n🔒 Starting SantriOS Security & Isolation Test Suite...\n");

  let passed = 0;
  let total = 0;

  const tests = [
    // -------------------------------------------------------------
    // 1. Tenant Isolation Tests
    // -------------------------------------------------------------
    runTest("Tenant isolation wrapper enforces non-empty tenant_id", () => {
      let threw = false;
      try {
        createTenantDb("");
      } catch (err: any) {
        threw = true;
        if (!(err instanceof TenantAccessError)) {
          throw new Error(`Expected TenantAccessError, got ${err.name}`);
        }
      }
      if (!threw) throw new Error("createTenantDb('') should have thrown TenantAccessError");
    }),

    runTest("Tenant isolation wrapper stores and scopes to tenantId", () => {
      const tenantA = createTenantDb("tenant-a-123");
      const tenantB = createTenantDb("tenant-b-456");

      if (tenantA.tenantId !== "tenant-a-123") {
        throw new Error("Tenant A ID mismatch");
      }
      if (tenantB.tenantId !== "tenant-b-456") {
        throw new Error("Tenant B ID mismatch");
      }
      if ((tenantA.tenantId as string) === (tenantB.tenantId as string)) {
        throw new Error("Tenants must be strictly isolated and non-identical");
      }
    }),

    // -------------------------------------------------------------
    // 2. RBAC & Permission Tests
    // -------------------------------------------------------------
    runTest("Owner role inherits full permissions within tenant", () => {
      const ownerSession: AuthSession = {
        user: { id: "u-owner", email: "owner@demo.local", name: "Pengasuh" },
        tenant: { id: "tenant-a", slug: "al-hikmah", name: "Al Hikmah" },
        role: { name: "OWNER", isSuperAdmin: false },
        permissions: ["core.view"],
        activeModules: ["CORE", "SANTRI", "KEUANGAN"],
      };

      if (!hasPermission(ownerSession, "finance.create")) {
        throw new Error("Owner should have permission for finance.create");
      }
      // Should not throw
      requirePermission(ownerSession, "students.delete");
    }),

    runTest("Regular role is strictly restricted to assigned permissions", () => {
      const guruSession: AuthSession = {
        user: { id: "u-guru", email: "guru@demo.local", name: "Ustadz" },
        tenant: { id: "tenant-a", slug: "al-hikmah", name: "Al Hikmah" },
        role: { name: "GURU", isSuperAdmin: false },
        permissions: ["attendance.view", "attendance.mark", "hafalan.create"],
        activeModules: ["CORE", "ABSENSI", "TAHFIZH"],
      };

      if (!hasPermission(guruSession, "attendance.mark")) {
        throw new Error("Guru should have attendance.mark permission");
      }
      if (hasPermission(guruSession, "finance.delete")) {
        throw new Error("Guru should NOT have finance.delete permission");
      }

      let threw = false;
      try {
        requirePermission(guruSession, "finance.approve");
      } catch (err) {
        threw = true;
        if (!(err instanceof ForbiddenError)) {
          throw new Error("Expected ForbiddenError");
        }
      }
      if (!threw) throw new Error("requirePermission should throw ForbiddenError for missing permission");
    }),

    runTest("Super Admin bypasses tenant permission restrictions", () => {
      const superAdminSession: AuthSession = {
        user: { id: "u-sa", email: "superadmin@santrios.local", name: "Super Admin" },
        tenant: { id: "global-system-tenant", slug: "system", name: "SaaS System" },
        role: { name: "SUPER_ADMIN", isSuperAdmin: true },
        permissions: [],
        activeModules: ["CORE"],
      };

      if (!isSuperAdmin(superAdminSession)) {
        throw new Error("Should be recognized as Super Admin");
      }
      if (!hasPermission(superAdminSession, "arbitrary.permission.key")) {
        throw new Error("Super Admin should satisfy any permission check");
      }
    }),

    // -------------------------------------------------------------
    // 3. Modular Feature Flag System Tests
    // -------------------------------------------------------------
    runTest("CORE module is unconditionally enabled for all tenants", () => {
      const activeModules: any[] = [];
      if (!hasModule(activeModules, "CORE")) {
        throw new Error("CORE module must always return true");
      }
    }),

    runTest("hasModule correctly validates active vs disabled modules", () => {
      const activeModules = ["CORE", "SANTRI", "ABSENSI"];

      if (!hasModule(activeModules, "SANTRI")) {
        throw new Error("SANTRI should be active");
      }
      if (hasModule(activeModules, "KOPERASI")) {
        throw new Error("KOPERASI should not be active");
      }

      let threw = false;
      try {
        assertModuleEnabled(activeModules, "KOPERASI");
      } catch (err) {
        threw = true;
        if (!(err instanceof ModuleDisabledError)) {
          throw new Error("Expected ModuleDisabledError");
        }
      }
      if (!threw) throw new Error("assertModuleEnabled should throw ModuleDisabledError");
    }),
  ];

  total = tests.length;
  for (const t of tests) {
    const ok = await t();
    if (ok) passed++;
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log(`========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

main();
