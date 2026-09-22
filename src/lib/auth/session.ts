import crypto from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "mama_admin_session";
const SESSION_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecretKey(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    "mama-store-fallback-secret-2026-super-secure-key-991"
  );
}

export function signToken(data: Record<string, unknown>): string {
  const secret = getSecretKey();
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): Record<string, unknown> | null {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const secret = getSecretKey();
  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  // Constant-time comparison to prevent timing attacks
  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSig);
  if (sigBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.exp && typeof data.exp === "number" && Date.now() > data.exp) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function verifyAdminCredentials(user: string, pass: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "mama2026!";

  const userHash = crypto.createHash("sha256").update(user).digest();
  const adminUserHash = crypto.createHash("sha256").update(adminUser).digest();

  const passHash = crypto.createHash("sha256").update(pass).digest();
  const adminPassHash = crypto.createHash("sha256").update(adminPass).digest();

  const userMatch = crypto.timingSafeEqual(userHash, adminUserHash);
  const passMatch = crypto.timingSafeEqual(passHash, adminPassHash);

  return userMatch && passMatch;
}

export async function createAdminSession(username: string): Promise<string> {
  const exp = Date.now() + SESSION_EXPIRY_MS;
  const token = signToken({ role: "admin", username, exp });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY_MS / 1000,
  });

  return token;
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAdminSession(): Promise<{ role: string; username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (payload && payload.role === "admin") {
    return {
      role: "admin",
      username: String(payload.username || "admin"),
    };
  }
  return null;
}

// In-Memory Rate Limiter
type RateLimitRecord = { count: number; resetAt: number };
const rateLimits = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const record = rateLimits.get(key);

  if (!record || now > record.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
    return { success: false, retryAfterSec };
  }

  record.count += 1;
  return { success: true };
}
