import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { adminAccounts } from "@/db/schema";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  verifySessionToken,
  type AdminSession,
} from "./auth";

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const session = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  try {
    const [account] = await db
      .select({
        active: adminAccounts.active,
        passwordChangedAt: adminAccounts.passwordChangedAt,
      })
      .from(adminAccounts)
      .where(eq(adminAccounts.username, session.user))
      .limit(1);

    if (!account?.active) return null;
    // Password changes invalidate every token issued before the change.
    if (account.passwordChangedAt.getTime() > session.iat * 1000 + 1_000) return null;
    return session;
  } catch {
    return null;
  }
}

/** Authoritative server-side guard for admin layouts, actions and APIs. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function startAdminSession(user: string) {
  const token = await createSessionToken(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endAdminSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}
