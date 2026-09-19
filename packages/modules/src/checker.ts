import { ModuleKey } from "@santrios/types";
import { ModuleDisabledError } from "@santrios/utils";
import { SANTRIOS_MODULES } from "./registry";

/**
 * Checks if a tenant has a specific module enabled
 */
export function hasModule(activeModules: (ModuleKey | string)[], moduleKey: ModuleKey): boolean {
  if (moduleKey === "CORE") {
    return true; // CORE is always enabled for all tenants
  }
  return activeModules.includes(moduleKey);
}

/**
 * Throws a ModuleDisabledError if the required module is not enabled
 */
export function assertModuleEnabled(
  activeModules: (ModuleKey | string)[],
  moduleKey: ModuleKey
): void {
  if (!hasModule(activeModules, moduleKey)) {
    const info = SANTRIOS_MODULES[moduleKey];
    throw new ModuleDisabledError(info ? info.name : moduleKey);
  }
}
