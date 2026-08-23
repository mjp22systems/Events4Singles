import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "e4s_admin_session";
const SESSION_TTL_S = 8 * 60 * 60;

export type AdminSession = {
  role: "admin";
  accountId: string | null;
  displayName: string | null;
  email: string | null;
};

function secret(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET not set");
  return new TextEncoder().encode(s);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export async function signAdminToken(profile?: Partial<Omit<AdminSession, "role">>): Promise<string> {
  return new SignJWT({
    role: "admin",
    accountId: profile?.accountId ?? null,
    displayName: profile?.displayName ?? null,
    email: profile?.email ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_TTL_S)
    .sign(secret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function getAdminSession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role !== "admin") return null;
    return {
      role: "admin",
      accountId: typeof payload.accountId === "string" ? payload.accountId : null,
      displayName: typeof payload.displayName === "string" ? payload.displayName : null,
      email: typeof payload.email === "string" ? payload.email : null,
    };
  } catch {
    return null;
  }
}

export { SESSION_TTL_S };
