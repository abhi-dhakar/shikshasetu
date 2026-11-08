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

      <div className="admin-content">
        <div className="admin-filter-bar">
          <nav className="admin-filter-group" aria-label="Filter demo requests by status">
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
                  aria-current={active ? "page" : undefined}
                  className={`admin-filter ${active ? "admin-filter--active" : ""}`}
                >
                  {t}
                </Link>
              );
            })}
          </nav>
          <AdminSearch
            action="/admin/demo-requests"
            defaultValue={q}
            placeholder="Search name, phone, school…"
            hidden={status !== "all" ? { status } : undefined}
          />
        </div>

        {failed ? (
          <section className="admin-panel">
            <div className="admin-panel__body">
              <p className="admin-alert admin-alert--danger" role="alert">
                <Icon name="alert" className="h-4 w-4" aria-hidden="true" />
                Database not ready. Run <code>npx drizzle-kit push</code>.
              </p>
            </div>
          </section>
        ) : rows.length === 0 ? (
          <section className="admin-panel">
            <EmptyState text="No demo requests match this filter." />
          </section>
        ) : (
          <section className="admin-panel" aria-labelledby="demo-table-title">
            <div className="admin-panel__header">
              <div>
                <h2 id="demo-table-title" className="admin-panel__title">
                  Request records
                </h2>
                <p className="admin-panel__subtitle">
                  Newest first · up to 200 records
                </p>
              </div>
              <span className="admin-status admin-status--neutral">
                {rows.length} shown
              </span>
            </div>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <caption className="admin-visually-hidden">
                  Demo lecture requests and their contact, scheduling, and status details
                </caption>
                <thead>
                  <tr>
                    {[
                      "Ref",
                      "Student",
                      "Parent & contact",
                      "Slot",
                      "Mode / Address",
                      "Status",
                      "Received",
                    ].map((h) => (
                      <th key={h} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((d) => (
                    <tr key={d.id}>
                      <th scope="row" className="admin-table__row-head">
                        SSD-{1000 + d.id}
                      </th>
                      <td>
                        <p className="admin-table__primary">
                          {d.childFirstName} {d.childLastName}
                        </p>
                        <p className="admin-table__secondary">
                          {d.standard} · {d.board}
                        </p>
                        {d.schoolName && (
                          <p className="admin-table__secondary flex items-center gap-1.5">
                            <Icon name="school" className="h-3 w-3" aria-hidden="true" />
                            {d.schoolName}
                          </p>
                        )}
                      </td>
                      <td>
                        <p className="admin-table__primary">
                          {d.parentFirstName} {d.parentLastName}
                        </p>
                        <a
                          href={`tel:${d.phone}`}
                          className="admin-table__secondary flex items-center gap-1.5"
                        >
                          <Icon name="phone" className="h-3 w-3" aria-hidden="true" />
                          {d.phone}
                        </a>
                        {d.email && (
                          <a
                            href={`mailto:${d.email}`}
                            className="admin-table__secondary flex items-center gap-1.5"
                          >
                            <Icon name="mail" className="h-3 w-3" aria-hidden="true" />
                            {d.email}
                          </a>
                        )}
                      </td>
                      <td className="whitespace-nowrap">
                        <p className="admin-table__primary">
                          {fmtDate(d.preferredDate)}
                        </p>
                        <p className="admin-table__secondary tabular-nums">
                          {d.preferredSlot}
                        </p>
                        {d.altDate && (
                          <p className="admin-table__secondary">
                            alt: {d.altDate} {d.altTime}
                          </p>
                        )}
                      </td>
                      <td className="max-w-[15rem]">
                        <p className="admin-table__primary">{d.mode}</p>
                        <p className="admin-table__secondary">
                          {d.addressLine1}
                          {d.addressLine2 ? `, ${d.addressLine2}` : ""}, {d.city} –{" "}
                          {d.postalCode}
                        </p>
                        {d.comments && (
                          <p className="admin-cell-note">“{d.comments}”</p>
                        )}
                      </td>
                      <td className="whitespace-nowrap">
                        <div className="admin-contact-actions">
                          <StatusPill status={d.status} />
                          <StatusSelect
                            id={d.id}
                            status={d.status}
                            options={DEMO_STATUSES}
                            action={updateDemoStatus}
                          />
                        </div>
                      </td>
                      <td className="admin-meta-text whitespace-nowrap">
                        {fmtDateTime(d.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
