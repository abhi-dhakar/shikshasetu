import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { adminAuditLogs, adminLoginAttempts } from "@/db/schema";

const MAX_ATTEMPTS = 5;
const BLOCK_MS = 10 * 60 * 1000;

export async function requestFingerprint(ip: string, userAgent: string): Promise<string> {
  const pepper =
    process.env.ADMIN_RATE_LIMIT_PEPPER ||
    process.env.ADMIN_SESSION_SECRET ||
    "local-rate-limit-pepper";
  const source = `${ip.trim().toLowerCase()}|${userAgent.slice(0, 240)}|${pepper}`;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(source),
  );
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function loginBlockedFor(fingerprint: string): Promise<number> {
  const now = new Date();
  const [row] = await db
    .select({ blockedUntil: adminLoginAttempts.blockedUntil })
    .from(adminLoginAttempts)
    .where(
      and(
        eq(adminLoginAttempts.fingerprint, fingerprint),
        gt(adminLoginAttempts.blockedUntil, now),
      ),
    )
    .limit(1);

  if (!row?.blockedUntil) return 0;
  return Math.max(
    Math.ceil((row.blockedUntil.getTime() - now.getTime()) / 1000),
    0,
  );
}

export async function registerFailedLogin(fingerprint: string): Promise<number> {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .select()
      .from(adminLoginAttempts)
      .where(eq(adminLoginAttempts.fingerprint, fingerprint))
      .limit(1);

    const nextCount = (row?.failedCount ?? 0) + 1;
    const now = new Date();

    if (nextCount >= MAX_ATTEMPTS) {
      const blockedUntil = new Date(now.getTime() + BLOCK_MS);
      await tx
        .insert(adminLoginAttempts)
        .values({ fingerprint, failedCount: 0, blockedUntil, updatedAt: now })
        .onConflictDoUpdate({
          target: adminLoginAttempts.fingerprint,
          set: { failedCount: 0, blockedUntil, updatedAt: now },
        });
      return 0;
    }

    await tx
      .insert(adminLoginAttempts)
      .values({ fingerprint, failedCount: nextCount, blockedUntil: null, updatedAt: now })
      .onConflictDoUpdate({
        target: adminLoginAttempts.fingerprint,
        set: { failedCount: nextCount, blockedUntil: null, updatedAt: now },
      });

    return MAX_ATTEMPTS - nextCount;
  });
}

export async function clearLoginAttempts(fingerprint: string) {
  await db
    .delete(adminLoginAttempts)
    .where(eq(adminLoginAttempts.fingerprint, fingerprint));
}

export async function writeAuditLog(input: {
  actor: string;
  action: string;
  entityType?: string;
  entityId?: number;
  detail?: string;
  fingerprint?: string;
  successful?: boolean;
}) {
  try {
    await db.insert(adminAuditLogs).values({
      actor: input.actor.slice(0, 120),
      action: input.action.slice(0, 80),
      entityType: input.entityType?.slice(0, 60) || null,
      entityId: input.entityId ?? null,
      detail: input.detail?.slice(0, 2000) || null,
      fingerprint: input.fingerprint?.slice(0, 80) || null,
      successful: input.successful ?? true,
    });
  } catch {
    // Audit writing must never break the primary admin action.
  }
}
