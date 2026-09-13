"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminAccounts } from "@/db/schema";
import { verifyPasswordHash } from "@/lib/auth";
import {
  clearLoginAttempts,
  loginBlockedFor,
  registerFailedLogin,
  requestFingerprint,
  writeAuditLog,
} from "@/lib/admin-security";
import { startAdminSession } from "@/lib/admin-session";

export type LoginState = { error?: string; remaining?: number };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "local";
  const agent = headerList.get("user-agent") || "unknown";
  const fingerprint = await requestFingerprint(ip, agent);

  try {
    const blockedFor = await loginBlockedFor(fingerprint);
    if (blockedFor > 0) {
      await writeAuditLog({
        actor: username || "unknown",
        action: "login_blocked",
        fingerprint,
        successful: false,
        detail: `Attempted during active lockout (${blockedFor}s remaining)`,
      });
      return {
        error: `Too many failed attempts. Try again in ${Math.ceil(blockedFor / 60)} minute(s).`,
      };
    }
  } catch {
    return {
      error: "Secure login is temporarily unavailable. Please try again shortly.",
    };
  }

  if (!username || !password) {
    return { error: "Enter both username and password." };
  }

  let account: typeof adminAccounts.$inferSelect | undefined;
  try {
    [account] = await db
      .select()
      .from(adminAccounts)
      .where(eq(adminAccounts.username, username.toLowerCase()))
      .limit(1);
  } catch {
    return {
      error: "Secure login is temporarily unavailable. Please try again shortly.",
    };
  }

  // A valid dummy hash keeps the failure path comparable when a username is unknown.
  const dummyHash =
    "pbkdf2_sha256$210000$MDEyMzQ1Njc4OUFCQ0RFRg$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
  const passwordOk = await verifyPasswordHash(
    password,
    account?.passwordHash || dummyHash,
  );
  const credentialsOk = Boolean(account?.active && passwordOk);

  if (!credentialsOk) {
    const remaining = await registerFailedLogin(fingerprint);
    await writeAuditLog({
      actor: username || "unknown",
      action: remaining > 0 ? "login_failed" : "login_locked",
      fingerprint,
      successful: false,
      detail: remaining > 0 ? `${remaining} attempt(s) remaining` : "Locked for 10 minutes",
    });
    return {
      error:
        remaining > 0
          ? `Invalid credentials. ${remaining} attempt(s) left before a temporary lockout.`
          : "Invalid credentials. Sign in is locked for 10 minutes.",
      remaining,
    };
  }

  await clearLoginAttempts(fingerprint);
  await startAdminSession(account!.username);
  await writeAuditLog({
    actor: account!.username,
    action: "login_success",
    fingerprint,
    detail: "Secure admin session started",
  });

  const safeNext = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
  redirect(safeNext);
}
