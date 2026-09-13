import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { demoRequests } from "@/db/schema";
import AdminPageHeader from "@/components/admin/page-header";
import StatusSelect from "@/components/admin/status-select";
import { EmptyState, StatusPill, fmtDate, fmtDateTime } from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { updateDemoStatus } from "@/app/admin/actions";
import { DEMO_STATUSES } from "@/lib/admin-constants";
import AdminSearch from "@/components/admin/search";

export const dynamic = "force-dynamic";

export default async function DemoRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "all" } = await searchParams;

  let rows: (typeof demoRequests.$inferSelect)[] = [];
  let failed = false;
  try {
    const filters = [sql`true`];
    if (status !== "all") filters.push(sql`${demoRequests.status} = ${status}`);
    if (q) {
      const like = `%${q.toLowerCase()}%`;
      filters.push(
        sql`(lower(${demoRequests.parentFirstName} || ' ' || ${demoRequests.parentLastName}) like ${like}
          or lower(${demoRequests.childFirstName} || ' ' || ${demoRequests.childLastName}) like ${like}
          or ${demoRequests.phone} like ${like}
          or lower(coalesce(${demoRequests.schoolName}, '')) like ${like}
          or lower(${demoRequests.addressLine1}) like ${like}
          or lower(${demoRequests.standard}) like ${like}
          or lower(${demoRequests.city}) like ${like})`,
      );
    }
    rows = await db
      .select()
      .from(demoRequests)
      .where(sql.join(filters, sql` and `))
      .orderBy(desc(demoRequests.createdAt))
      .limit(200);
  } catch {
    failed = true;
  }

  const tabs = ["all", ...DEMO_STATUSES];

  return (
    <>
      <AdminPageHeader
        eyebrow="Bookings"
        icon="calendarCheck"
        title="Demo lecture requests"
        subtitle={`${rows.length} record(s) shown`}
      />

      <div className="space-y-5 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => {
              const active = status === t;
              const href =
                t === "all"
                  ? `/admin/demo-requests${q ? `?q=${encodeURIComponent(q)}` : ""}`
                  : `/admin/demo-requests?status=${t}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
              return (
                <Link
                  key={t}
                  href={href}
                  className={`rounded-full border px-4 py-2 text-[0.78rem] font-bold uppercase tracking-[0.06em] transition-all duration-300 ${
                    active
                      ? "border-brand-900 bg-brand-900 text-white"
                      : "border-brand-900/12 bg-white text-ink/60 hover:-translate-y-0.5 hover:text-brand-900"
                  }`}
                >
                  {t}
                </Link>
              );
            })}
          </div>
          <AdminSearch
            action="/admin/demo-requests"
            defaultValue={q}
            placeholder="Search name, phone, school…"
            hidden={status !== "all" ? { status } : undefined}
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-brand-900/10 bg-white">
          {failed ? (
            <EmptyState text="Database not ready. Run npx drizzle-kit push." icon="alert" />
          ) : rows.length === 0 ? (
            <EmptyState text="No demo requests match this filter." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[68rem] text-left text-[0.84rem]">
                <thead>
                  <tr className="border-b border-brand-900/8 bg-sand/60">
                    {[
                      "Ref",
                      "Student",
                      "Parent & contact",
                      "Slot",
                      "Mode / Address",
                      "Status",
                      "Received",
                    ].map((h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-5 py-3 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-ink/45"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-900/8">
                  {rows.map((d) => (
                    <tr key={d.id} className="align-top transition-colors hover:bg-sand/40">
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-brand-900">
                        SSD-{1000 + d.id}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-brand-900">
                          {d.childFirstName} {d.childLastName}
                        </p>
                        <p className="mt-0.5 text-[0.78rem] text-ink/55">
                          {d.standard} · {d.board}
                        </p>
                        {d.schoolName && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-[0.74rem] text-ink/40">
                            <Icon name="school" className="h-3 w-3" />
                            {d.schoolName}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-brand-900">
                          {d.parentFirstName} {d.parentLastName}
                        </p>
                        <a
                          href={`tel:${d.phone}`}
                          className="mt-0.5 flex items-center gap-1.5 text-[0.78rem] text-brand-700 hover:underline"
                        >
                          <Icon name="phone" className="h-3 w-3" />
                          {d.phone}
                        </a>
                        {d.email && (
                          <a
                            href={`mailto:${d.email}`}
                            className="mt-0.5 flex items-center gap-1.5 text-[0.74rem] text-ink/45 hover:underline"
                          >
                            <Icon name="mail" className="h-3 w-3" />
                            {d.email}
                          </a>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <p className="font-semibold text-brand-900">
                          {fmtDate(d.preferredDate)}
                        </p>
                        <p className="mt-0.5 text-[0.78rem] tabular-nums text-ink/55">
                          {d.preferredSlot}
                        </p>
                        {d.altDate && (
                          <p className="mt-0.5 text-[0.72rem] text-ink/40">
                            alt: {d.altDate} {d.altTime}
                          </p>
                        )}
                      </td>
                      <td className="max-w-[15rem] px-5 py-4">
                        <p className="font-semibold text-brand-900">{d.mode}</p>
                        <p className="mt-0.5 text-[0.76rem] leading-snug text-ink/50">
                          {d.addressLine1}
                          {d.addressLine2 ? `, ${d.addressLine2}` : ""}, {d.city} –{" "}
                          {d.postalCode}
                        </p>
                        {d.comments && (
                          <p className="mt-1.5 rounded-lg bg-sand px-2.5 py-1.5 text-[0.73rem] italic leading-snug text-ink/55">
                            “{d.comments}”
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex flex-col items-start gap-2">
                          <StatusPill status={d.status} />
                          <StatusSelect
                            id={d.id}
                            status={d.status}
                            options={DEMO_STATUSES}
                            action={updateDemoStatus}
                          />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-[0.76rem] text-ink/45">
                        {fmtDateTime(d.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
