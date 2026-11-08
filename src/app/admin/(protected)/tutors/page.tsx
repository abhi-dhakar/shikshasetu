import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { tutorApplications } from "@/db/schema";
import AdminPageHeader from "@/components/admin/page-header";
import AdminSearch from "@/components/admin/search";
import StatusSelect from "@/components/admin/status-select";
import { EmptyState, StatusPill, fmtDateTime } from "@/components/admin/ui";
import { Icon } from "@/components/icons";
import { updateTutorStatus } from "@/app/admin/actions";
import { TUTOR_STATUSES } from "@/lib/admin-constants";

export const dynamic = "force-dynamic";

export default async function TutorApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "all" } = await searchParams;

  let rows: (typeof tutorApplications.$inferSelect)[] = [];
  let failed = false;
  try {
    const filters = [sql`true`];
    if (status !== "all") filters.push(sql`${tutorApplications.status} = ${status}`);
    if (q) {
      const like = `%${q.toLowerCase()}%`;
      filters.push(
        sql`(lower(${tutorApplications.fullName}) like ${like}
          or ${tutorApplications.phone} like ${like}
          or lower(${tutorApplications.subjects}) like ${like}
          or lower(${tutorApplications.area}) like ${like}
          or lower(${tutorApplications.qualification}) like ${like})`,
      );
    }
    rows = await db
      .select()
      .from(tutorApplications)
      .where(sql.join(filters, sql` and `))
      .orderBy(desc(tutorApplications.createdAt))
      .limit(200);
  } catch {
    failed = true;
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Panel"
        icon="tutor"
        title="Tutor applications"
        subtitle={`${rows.length} record(s) shown`}
      />

      <div className="admin-content">
        <div className="admin-filter-bar">
          <nav className="admin-filter-group" aria-label="Filter tutor applications by status">
            {["all", ...TUTOR_STATUSES].map((t) => {
              const active = status === t;
              const href =
                t === "all"
                  ? `/admin/tutors${q ? `?q=${encodeURIComponent(q)}` : ""}`
                  : `/admin/tutors?status=${t}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
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
            action="/admin/tutors"
            defaultValue={q}
            placeholder="Search name, subject, area…"
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
            <EmptyState text="No tutor applications match this filter." />
          </section>
        ) : (
          <section className="admin-card-grid" aria-label="Tutor application records">
            {rows.map((t) => (
              <article key={t.id} className="admin-record-card">
                <div className="admin-record-card__header">
                  <div className="admin-record-card__identity">
                    <span className="admin-avatar" aria-hidden="true">
                      {t.fullName.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <h2 className="admin-record-card__name">{t.fullName}</h2>
                      <p className="admin-record-card__meta">
                        SST-{2000 + t.id} · {fmtDateTime(t.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={t.status} />
                </div>

                <dl className="admin-meta-list">
                  <Row icon="qualification" label={`${t.qualification} · ${t.experience}`} />
                  <Row icon="kit" label={t.classes} />
                  <Row icon="location" label={`${t.area} · ${t.mode}`} />
                  <Row icon="school" label={`Boards: ${t.boards}`} />
                </dl>

                <div className="admin-tag-list" aria-label="Subjects">
                  {t.subjects.split(",").map((subject, index) => (
                    <span className="admin-tag" key={`${subject.trim()}-${index}`}>
                      {subject.trim()}
                    </span>
                  ))}
                </div>

                {t.about && <p className="admin-quote">“{t.about}”</p>}

                <div className="admin-record-card__footer">
                  <div className="admin-contact-actions">
                    <a href={`tel:${t.phone}`} className="admin-button">
                      <Icon name="phone" className="h-3.5 w-3.5" aria-hidden="true" />
                      {t.phone}
                    </a>
                    {t.email && (
                      <a
                        href={`mailto:${t.email}`}
                        aria-label={`Email ${t.fullName}`}
                        className="admin-icon-button"
                      >
                        <Icon name="mail" className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  <StatusSelect
                    id={t.id}
                    status={t.status}
                    options={TUTOR_STATUSES}
                    action={updateTutorStatus}
                  />
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </>
  );
}

function Row({
  icon,
  label,
}: {
  icon: "qualification" | "kit" | "location" | "school";
  label: string;
}) {
  return (
    <div className="admin-meta-list__row">
      <dt className="admin-visually-hidden">{label}</dt>
      <dd>
        <Icon name={icon} aria-hidden="true" />
        <span>{label}</span>
      </dd>
    </div>
  );
}
