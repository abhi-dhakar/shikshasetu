/**
 * Authentication primitives shared by the Node and Proxy runtimes.
 * Passwords use PBKDF2-SHA256; sessions use HMAC-SHA256.
 */

export const SESSION_COOKIE = "ss_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;
export const PASSWORD_ITERATIONS = 210_000;

const PBKDF2_PREFIX = "pbkdf2_sha256";
const MIN_PBKDF2_ITERATIONS = 120_000;

export function adminUsername(): string {
  return process.env.ADMIN_USERNAME?.trim().toLowerCase() || "admin";
}

function sessionSecret(): string {
  const value =
    process.env.ADMIN_SESSION_SECRET?.trim() || process.env.DATABASE_URL?.trim();
  if (!value) throw new Error("ADMIN_SESSION_SECRET or DATABASE_URL is required");
  return value;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function encodeText(value: string): string {
  return toBase64Url(new TextEncoder().encode(value));
}

function decodeText(value: string): string {
  return new TextDecoder().decode(fromBase64Url(value));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ---------------- password hashing ---------------- */

async function derivePassword(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<string> {
  const source = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: salt as BufferSource,
      iterations,
    },
    source,
    256,
  );
  return toBase64Url(new Uint8Array(bits));
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(18));
  const derived = await derivePassword(password, salt, PASSWORD_ITERATIONS);
  return `${PBKDF2_PREFIX}$${PASSWORD_ITERATIONS}$${toBase64Url(salt)}$${derived}`;
}

export async function verifyPasswordHash(
  password: string,
  encoded: string,
): Promise<boolean> {
  const [prefix, iterationText, saltText, expected] = encoded.split("$");
  const iterations = Number(iterationText);
  if (
    prefix !== PBKDF2_PREFIX ||
    !Number.isInteger(iterations) ||
    iterations < MIN_PBKDF2_ITERATIONS ||
    !saltText ||
    !expected
  ) {
    return false;
  }
  try {
    const actual = await derivePassword(password, fromBase64Url(saltText), iterations);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/* ---------------- signed sessions ---------------- */

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(sessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function sign(payload: string): Promise<string> {
  const key = await hmacKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(new Uint8Array(signature));
}

export type AdminSession = {
  user: string;
  exp: number;
  iat: number;
  nonce: string;
};

export async function createSessionToken(user: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const random = crypto.getRandomValues(new Uint8Array(18));
  const payload: AdminSession = {
    user: user.trim().toLowerCase(),
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    nonce: toBase64Url(random),
  };
  const encoded = encodeText(JSON.stringify(payload));
  return `${encoded}.${await sign(encoded)}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token || !token.includes(".")) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  try {
    const expected = await sign(encoded);
    if (!timingSafeEqual(expected, signature)) return null;

    const session = JSON.parse(decodeText(encoded)) as AdminSession;
    const now = Date.now();
    if (!session?.exp || session.exp * 1000 < now) return null;
    if (!session.iat || session.iat * 1000 > now + 30_000) return null;
    if (!session.nonce || session.nonce.length < 16) return null;
    if (session.user !== adminUsername()) return null;
    return session;
  } catch {
    return null;
  }
}
