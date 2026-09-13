"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  adminAccounts,
  contactMessages,
  demoRequests,
  tutorApplications,
} from "@/db/schema";
import { endAdminSession, getAdminSession } from "@/lib/admin-session";
import {
  DEMO_STATUSES,
  MESSAGE_STATUSES,
  TUTOR_STATUSES,
  type DemoStatus,
  type MessageStatus,
  type TutorStatus,
} from "@/lib/admin-constants";
import { requestFingerprint, writeAuditLog } from "@/lib/admin-security";
import { hashPassword, verifyPasswordHash } from "@/lib/auth";

export type PasswordState = { ok?: boolean; error?: string };

async function authenticatedContext() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const list = await headers();
  const ip =
    list.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    list.get("x-real-ip") ||
    "local";
  const fingerprint = await requestFingerprint(ip, list.get("user-agent") || "unknown");
  return { session, fingerprint };
}

export async function logoutAction() {
  const session = await getAdminSession();
  if (session) {
    await writeAuditLog({
      actor: session.user,
      action: "logout",
      detail: "Admin session ended",
    });
  }
  await endAdminSession();
  redirect("/admin/login");
}

export async function updateDemoStatus(formData: FormData) {
  const { session, fingerprint } = await authenticatedContext();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!id || !DEMO_STATUSES.includes(status as DemoStatus)) return;

  const [previous] = await db
    .select({ status: demoRequests.status })
    .from(demoRequests)
    .where(eq(demoRequests.id, id))
    .limit(1);
  if (!previous || previous.status === status) return;

  await db.update(demoRequests).set({ status }).where(eq(demoRequests.id, id));
  await writeAuditLog({
    actor: session.user,
    action: "demo_status_updated",
    entityType: "demo_request",
    entityId: id,
    detail: `${previous.status} → ${status}`,
    fingerprint,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/demo-requests");
  revalidatePath("/admin/security");
}

export async function updateTutorStatus(formData: FormData) {
  const { session, fingerprint } = await authenticatedContext();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!id || !TUTOR_STATUSES.includes(status as TutorStatus)) return;

  const [previous] = await db
    .select({ status: tutorApplications.status })
    .from(tutorApplications)
    .where(eq(tutorApplications.id, id))
    .limit(1);
  if (!previous || previous.status === status) return;

  await db
    .update(tutorApplications)
    .set({ status })
    .where(eq(tutorApplications.id, id));
  await writeAuditLog({
    actor: session.user,
    action: "tutor_status_updated",
    entityType: "tutor_application",
    entityId: id,
    detail: `${previous.status} → ${status}`,
    fingerprint,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/tutors");
  revalidatePath("/admin/security");
}

export async function updateMessageStatus(formData: FormData) {
  const { session, fingerprint } = await authenticatedContext();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!id || !MESSAGE_STATUSES.includes(status as MessageStatus)) return;

  const [previous] = await db
    .select({ status: contactMessages.status })
    .from(contactMessages)
    .where(eq(contactMessages.id, id))
    .limit(1);
  if (!previous || previous.status === status) return;

  await db
    .update(contactMessages)
    .set({
      status,
      handledAt: status === "unread" ? null : new Date(),
    })
    .where(eq(contactMessages.id, id));
  await writeAuditLog({
    actor: session.user,
    action: "message_status_updated",
    entityType: "contact_message",
    entityId: id,
    detail: `${previous.status} → ${status}`,
    fingerprint,
  });
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/security");
}

export async function changePasswordAction(
  _previous: PasswordState,
  formData: FormData,
): Promise<PasswordState> {
  const { session, fingerprint } = await authenticatedContext();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (!currentPassword || !newPassword || !confirmation) {
    return { error: "Complete all three password fields." };
  }
  if (newPassword !== confirmation) {
    return { error: "The new passwords do not match." };
  }
  if (newPassword.length < 14) {
    return { error: "Use at least 14 characters." };
  }
  if (
    !/[a-z]/.test(newPassword) ||
    !/[A-Z]/.test(newPassword) ||
    !/[0-9]/.test(newPassword) ||
    !/[^a-zA-Z0-9]/.test(newPassword)
  ) {
    return { error: "Include uppercase, lowercase, a number and a symbol." };
  }

  const [account] = await db
    .select()
    .from(adminAccounts)
    .where(eq(adminAccounts.username, session.user))
    .limit(1);
  if (!account || !(await verifyPasswordHash(currentPassword, account.passwordHash))) {
    await writeAuditLog({
      actor: session.user,
      action: "password_change_failed",
      fingerprint,
      successful: false,
      detail: "Current password did not match",
    });
    return { error: "Your current password is incorrect." };
  }
  if (await verifyPasswordHash(newPassword, account.passwordHash)) {
    return { error: "Choose a password different from the current one." };
  }

  const nextHash = await hashPassword(newPassword);
  await db
    .update(adminAccounts)
    .set({ passwordHash: nextHash, passwordChangedAt: new Date() })
    .where(eq(adminAccounts.id, account.id));
  await writeAuditLog({
    actor: session.user,
    action: "password_changed",
    fingerprint,
    detail: "Password changed; all existing sessions invalidated",
  });
  await endAdminSession();
  redirect("/admin/login?changed=1");
}

export async function markAllMessagesRead() {
  const { session, fingerprint } = await authenticatedContext();
  const changed = await db
    .update(contactMessages)
    .set({ status: "read", handledAt: new Date() })
    .where(eq(contactMessages.status, "unread"))
    .returning({ id: contactMessages.id });

  if (changed.length > 0) {
    await writeAuditLog({
      actor: session.user,
      action: "messages_bulk_read",
      entityType: "contact_message",
      detail: `${changed.length} message(s) marked read`,
      fingerprint,
    });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/security");
}
