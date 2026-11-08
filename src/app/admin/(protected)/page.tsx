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
  const chartSummary = last7
    .map((day) => `${day.iso}: ${day.n} request${day.n === 1 ? "" : "s"}`)
    .join(", ");

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        icon="dashboard"
        title="Enquiry dashboard"
        subtitle="Live snapshot of demo bookings, tutor applications and messages."
      />

      <div className="admin-content">
        {!data.ok && (
          <p className="admin-alert admin-alert--danger" role="alert">
            <Icon name="alert" className="h-4 w-4" aria-hidden="true" />
            Database tables are not ready. Run <code>npx drizzle-kit push</code>.
          </p>
        )}

        <section className="admin-kpi-grid" aria-label="Enquiry key metrics">
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
        </section>

        <div className="admin-split-grid">
          <Panel
            title="Demo requests · last 7 days"
            subtitle="Bookings received per day"
            padded
          >
            <div className="admin-chart" role="img" aria-label={chartSummary}>
              {last7.map((d) => (
                <div key={d.iso} className="admin-chart__column">
                  <span className="admin-chart__value">{d.n}</span>
                  <div
                    className="admin-chart__bar"
                    style={{ height: `${Math.max((d.n / maxDay) * 100, 4)}%` }}
                  />
                  <span className="admin-chart__label">{d.label}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Pipeline by status" subtitle="All demo requests" padded>
            {data.byStatus.length === 0 ? (
              <EmptyState text="No demo requests yet." icon="chart" />
            ) : (
              <ul className="admin-progress-list">
                {data.byStatus
                  .slice()
                  .sort((a, b) => b.n - a.n)
                  .map((s) => {
                    const pct = data.totalDemos
                      ? Math.round((s.n / data.totalDemos) * 100)
                      : 0;
                    return (
                      <li key={s.status} className="admin-progress-row">
                        <div className="admin-progress-row__header">
                          <StatusPill status={s.status} />
                          <span className="admin-progress-row__value">
                            {s.n}{" "}
                            <span className="admin-progress-row__percent">
                              ({pct}%)
                            </span>
                          </span>
                        </div>
                        <div className="admin-progress-track">
                          <div
                            className="admin-progress-fill"
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

        <div className="admin-split-grid">
          <Panel
            title="Recent demo requests"
            subtitle="Newest first"
            action={
              <Link href="/admin/demo-requests" className="admin-button">
                View all
                <Icon name="arrowRight" className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            }
          >
            {data.recentDemos.length === 0 ? (
              <EmptyState text="No demo requests yet." />
            ) : (
              <ul className="admin-list">
                {data.recentDemos.map((d) => (
                  <li key={d.id} className="admin-row-between">
                    <div className="min-w-0">
                      <p className="admin-list__primary">
                        {d.childFirstName} {d.childLastName}
                        <span className="admin-inline-meta">
                          {d.standard} · {d.board}
                        </span>
                      </p>
                      <p className="admin-list__secondary">
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

          <div className="admin-stack">
            <Panel title="Popular demo slots" subtitle="All time" padded>
              <ul className="admin-progress-list">
                {TIME_SLOTS.map((slot) => {
                  const n = data.bySlot.find((s) => s.slot === slot)?.n ?? 0;
                  return (
                    <li key={slot} className="admin-slot-row">
                      <span className="admin-slot-row__label">{slot}</span>
                      <div className="admin-progress-track">
                        <div
                          className="admin-progress-fill"
                          style={{ width: `${Math.max((n / maxSlot) * 100, 3)}%` }}
                        />
                      </div>
                      <span className="admin-slot-row__value">{n}</span>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            <Panel
              title="Latest messages"
              action={
                <Link href="/admin/messages" className="admin-button">
                  All
                  <Icon name="arrowRight" className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              }
            >
              {data.recentMessages.length === 0 ? (
                <EmptyState text="No messages yet." />
              ) : (
                <ul className="admin-list">
                  {data.recentMessages.map((m) => (
                    <li key={m.id}>
                      <div className="admin-row-between">
                        <p className="admin-list__primary">{m.name}</p>
                        <span className="admin-meta-text">
                          {fmtDateTime(m.createdAt)}
                        </span>
                      </div>
                      <p className="admin-list__secondary line-clamp-2">
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
