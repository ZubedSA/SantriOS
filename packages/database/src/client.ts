import { PrismaClient } from "@prisma/client";

declare global {
  // Allow global `var` declarations in TypeScript
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Centralized PrismaClient instance.
 * Reuses instance during development to prevent connection exhaustion.
 */
export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      process.env.DEBUG_QUERIES === "true"
        ? ["query", "error", "warn"]
        : process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export * from "@prisma/client";
