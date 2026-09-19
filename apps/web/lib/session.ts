import { cache } from "react";
import { cookies } from "next/headers";
import { AuthSession } from "@santrios/types";
import { verifySessionToken } from "@santrios/auth";

export const SESSION_COOKIE_NAME = "santrios_session";

/**
 * Retrieves the current verified user session from cookies.
 * Deduplicated per request lifecycle via React cache() so verifySessionToken
 * runs exactly once across layouts, pages, and server components.
 * Returns null if not authenticated or expired.
 */
export const getCurrentSession = cache(async (): Promise<AuthSession | null> => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    return await verifySessionToken(token);
  } catch {
    return null;
  }
});
