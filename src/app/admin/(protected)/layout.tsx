import type { Metadata } from "next";
import type { ReactNode } from "react";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages, demoRequests, tutorApplications } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-session";
import AdminSidebar from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin Desk",
  description: "Restricted internal enquiry desk.",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

async function pendingCounts(): Promise<Record<string, number>> {
  try {
    const [demos, tutors, messages] = await Promise.all([
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(demoRequests)
        .where(sql`${demoRequests.status} in ('new','contacted')`),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(tutorApplications)
        .where(sql`${tutorApplications.status} in ('received','screening')`),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(contactMessages)
        .where(sql`${contactMessages.status} = 'unread'`),
    ]);
    return {
      "/admin/demo-requests": demos[0]?.n ?? 0,
      "/admin/tutors": tutors[0]?.n ?? 0,
      "/admin/messages": messages[0]?.n ?? 0,
    };
  } catch {
    return {};
  }
}

export default async function AdminProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireAdmin();
  const counts = await pendingCounts();

  return (
    <div className="min-h-screen bg-[#f6f4ef] lg:flex">
      <AdminSidebar user={session.user} counts={counts} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
