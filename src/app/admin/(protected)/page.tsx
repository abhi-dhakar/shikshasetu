import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages, demoRequests, tutorApplications } from "@/db/schema";
import AdminPageHeader from "@/components/admin/page-header";
import { EmptyState, Panel, StatCard, StatusPill, fmtDate, fmtDateTime } from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { TIME_SLOTS } from "@/lib/constants";
import { toIsoDate } from "@/lib/validation";

export const dynamic = "force-dynamic";

type Overview = {
  totalDemos: number;
  weekDemos: number;
  pending: number;
  totalTutors: number;
  approvedTutors: number;
  totalMessages: number;
  byStatus: { status: string; n: number }[];
  bySlot: { slot: string; n: number }[];
  byDay: { day: string; n: number }[];
  recentDemos: (typeof demoRequests.$inferSelect)[];
  recentMessages: (typeof contactMessages.$inferSelect)[];
  ok: boolean;
};

async function loadOverview(): Promise<Overview> {
  const empty: Overview = {
    totalDemos: 0,
    weekDemos: 0,
    pending: 0,
    totalTutors: 0,
    approvedTutors: 0,
    totalMessages: 0,
    byStatus: [],
    bySlot: [],
    byDay: [],
    recentDemos: [],
    recentMessages: [],
    ok: false,
  };

  try {
    const [
      demoTotal,
      weekTotal,
      pendingTotal,
      tutorTotal,
      tutorApproved,
      msgTotal,
      byStatus,
      bySlot,
      byDay,
      recentDemos,
      recentMessages,
    ] = await Promise.all([
      db.select({ n: sql<number>`count(*)::int` }).from(demoRequests),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(demoRequests)
        .where(sql`${demoRequests.createdAt} > now() - interval '7 days'`),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(demoRequests)
        .where(sql`${demoRequests.status} in ('new','contacted')`),
      db.select({ n: sql<number>`count(*)::int` }).from(tutorApplications),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(tutorApplications)
        .where(sql`${tutorApplications.status} = 'approved'`),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(contactMessages)
        .where(sql`${contactMessages.status} = 'unread'`),
      db
        .select({ status: demoRequests.status, n: sql<number>`count(*)::int` })
        .from(demoRequests)
        .groupBy(demoRequests.status),
      db
        .select({ slot: demoRequests.preferredSlot, n: sql<number>`count(*)::int` })
        .from(demoRequests)
        .groupBy(demoRequests.preferredSlot),
      db
        .select({
          day: sql<string>`to_char(${demoRequests.createdAt}::date, 'YYYY-MM-DD')`,
          n: sql<number>`count(*)::int`,
        })
        .from(demoRequests)
        .where(sql`${demoRequests.createdAt} > now() - interval '7 days'`)
        .groupBy(sql`${demoRequests.createdAt}::date`),
      db.select().from(demoRequests).orderBy(desc(demoRequests.createdAt)).limit(6),
      db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(4),
    ]);

    return {
      totalDemos: demoTotal[0]?.n ?? 0,
      weekDemos: weekTotal[0]?.n ?? 0,
      pending: pendingTotal[0]?.n ?? 0,
      totalTutors: tutorTotal[0]?.n ?? 0,
      approvedTutors: tutorApproved[0]?.n ?? 0,
      totalMessages: msgTotal[0]?.n ?? 0,
      byStatus,
      bySlot,
      byDay,
      recentDemos,
      recentMessages,
      ok: true,
    };
  } catch {
    return empty;
  }
}

export default async function AdminDashboard() {
  const data = await loadOverview();

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = toIsoDate(d);
    return {
      iso,
      label: d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 1),
      n: data.byDay.find((x) => x.day === iso)?.n ?? 0,
    };
  });
  const maxDay = Math.max(...last7.map((d) => d.n), 1);
  const maxSlot = Math.max(...data.bySlot.map((s) => s.n), 1);

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        icon="dashboard"
        title="Enquiry dashboard"
        subtitle="Live snapshot of demo bookings, tutor applications and messages."
      />

      <div className="space-y-6 p-5 sm:p-8">
        {!data.ok && (
          <p className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
            <Icon name="alert" className="h-4 w-4" />
            Database tables are not ready. Run <code>npx drizzle-kit push</code>.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Demo requests"
            value={data.totalDemos}
            hint={`${data.weekDemos} in the last 7 days`}
            icon="calendarCheck"
            accent="brand"
          />
          <StatCard
            label="Needs follow-up"
            value={data.pending}
            hint="Status is new or contacted"
            icon="alert"
            accent="accent"
          />
          <StatCard
            label="Tutor applications"
            value={data.totalTutors}
            hint={`${data.approvedTutors} approved on panel`}
            icon="tutor"
            accent="violet"
          />
          <StatCard
            label="Unread messages"
            value={data.totalMessages}
            hint="Waiting for a response"
            icon="inbox"
            accent="emerald"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <Panel
            title="Demo requests · last 7 days"
            subtitle="Bookings received per day"
            padded
          >
            <div className="flex h-52 items-end justify-between gap-3">
              {last7.map((d) => (
                <div key={d.iso} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[0.72rem] font-bold text-brand-900">{d.n}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-brand-700 to-brand-400 transition-all duration-700"
                    style={{ height: `${Math.max((d.n / maxDay) * 100, 4)}%` }}
                  />
                  <span className="text-[0.7rem] font-semibold uppercase text-ink/40">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Pipeline by status" subtitle="All demo requests" padded>
            {data.byStatus.length === 0 ? (
              <EmptyState text="No demo requests yet." icon="chart" />
            ) : (
              <ul className="space-y-3.5">
                {data.byStatus
                  .slice()
                  .sort((a, b) => b.n - a.n)
                  .map((s) => {
                    const pct = data.totalDemos
                      ? Math.round((s.n / data.totalDemos) * 100)
                      : 0;
                    return (
                      <li key={s.status}>
                        <div className="mb-1.5 flex items-center justify-between gap-3">
                          <StatusPill status={s.status} />
                          <span className="text-[0.8rem] font-bold text-brand-900">
                            {s.n}{" "}
                            <span className="font-medium text-ink/40">({pct}%)</span>
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-sand">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-accent-500 to-gold transition-all duration-700"
                            style={{ width: `${Math.max(pct, 2)}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <Panel
            title="Recent demo requests"
            subtitle="Newest first"
            action={
              <Link
                href="/admin/demo-requests"
                className="inline-flex items-center gap-2 rounded-full border border-brand-900/15 px-4 py-2 text-[0.78rem] font-bold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
              >
                View all
                <Icon name="arrowRight" className="h-3.5 w-3.5" />
              </Link>
            }
          >
            {data.recentDemos.length === 0 ? (
              <EmptyState text="No demo requests yet." />
            ) : (
              <ul className="divide-y divide-brand-900/8">
                {data.recentDemos.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-sand/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[0.9rem] font-bold text-brand-900">
                        {d.childFirstName} {d.childLastName}
                        <span className="ml-2 text-[0.76rem] font-medium text-ink/45">
                          {d.standard} · {d.board}
                        </span>
                      </p>
                      <p className="mt-0.5 text-[0.76rem] text-ink/50">
                        {fmtDate(d.preferredDate)} at {d.preferredSlot} · {d.mode} ·{" "}
                        {d.phone}
                      </p>
                    </div>
                    <StatusPill status={d.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <div className="space-y-6">
            <Panel title="Popular demo slots" subtitle="All time" padded>
              <ul className="space-y-3">
                {TIME_SLOTS.map((slot) => {
                  const n = data.bySlot.find((s) => s.slot === slot)?.n ?? 0;
                  return (
                    <li key={slot} className="flex items-center gap-3">
                      <span className="w-12 shrink-0 text-[0.8rem] font-bold tabular-nums text-brand-900">
                        {slot}
                      </span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-sand">
                        <div
                          className="h-full rounded-full bg-brand-700 transition-all duration-700"
                          style={{ width: `${Math.max((n / maxSlot) * 100, 3)}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-[0.78rem] font-bold text-ink/55">
                        {n}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel
              title="Latest messages"
              action={
                <Link
                  href="/admin/messages"
                  className="inline-flex items-center gap-2 text-[0.78rem] font-bold text-brand-900 underline-swipe"
                >
                  All
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </Link>
              }
            >
              {data.recentMessages.length === 0 ? (
                <EmptyState text="No messages yet." />
              ) : (
                <ul className="divide-y divide-brand-900/8">
                  {data.recentMessages.map((m) => (
                    <li key={m.id} className="px-5 py-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[0.86rem] font-bold text-brand-900">{m.name}</p>
                        <span className="text-[0.7rem] text-ink/40">
                          {fmtDateTime(m.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[0.8rem] text-ink/55">
                        {m.topic} — {m.message}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
