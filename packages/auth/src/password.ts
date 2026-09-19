import * as crypto from "crypto";

/**
 * Hashes a plaintext password using SHA-256 with salt
 */
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Verifies a plaintext password against a stored hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}
