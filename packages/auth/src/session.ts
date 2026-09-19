import { SignJWT, jwtVerify } from "jose";
import { AuthSession } from "@santrios/types";
import { UnauthorizedError } from "@santrios/utils";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "santrios-default-development-secret-32-chars-long"
);

export async function createSessionToken(session: AuthSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AuthSession> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AuthSession;
  } catch (error) {
    throw new UnauthorizedError("Sesi login telah kedaluwarsa atau tidak valid.");
  }
}
