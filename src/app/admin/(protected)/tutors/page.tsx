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

      <div className="space-y-5 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
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
            action="/admin/tutors"
            defaultValue={q}
            placeholder="Search name, subject, area…"
            hidden={status !== "all" ? { status } : undefined}
          />
        </div>

        {failed ? (
          <div className="rounded-2xl border border-brand-900/10 bg-white">
            <EmptyState text="Database not ready. Run npx drizzle-kit push." icon="alert" />
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-brand-900/10 bg-white">
            <EmptyState text="No tutor applications match this filter." />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {rows.map((t) => (
              <article
                key={t.id}
                className="card-hover flex flex-col rounded-2xl border border-brand-900/10 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-900 font-display text-lg text-white">
                      {t.fullName.charAt(0)}
                    </span>
                    <div>
                      <p className="font-bold text-brand-900">{t.fullName}</p>
                      <p className="text-[0.74rem] text-ink/45">
                        SST-{2000 + t.id} · {fmtDateTime(t.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={t.status} />
                </div>

                <dl className="mt-4 space-y-2 text-[0.82rem]">
                  <Row icon="qualification" label={`${t.qualification} · ${t.experience}`} />
                  <Row icon="kit" label={t.classes} />
                  <Row icon="location" label={`${t.area} · ${t.mode}`} />
                  <Row icon="school" label={`Boards: ${t.boards}`} />
                </dl>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.subjects.split(",").map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-brand-50 px-2.5 py-1 text-[0.72rem] font-semibold text-brand-700"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>

                {t.about && (
                  <p className="mt-3 rounded-xl bg-sand px-3 py-2.5 text-[0.78rem] italic leading-snug text-ink/55">
                    “{t.about}”
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand-900/8 pt-4">
                  <div className="flex gap-2">
                    <a
                      href={`tel:${t.phone}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-brand-900/15 px-3 py-2 text-[0.76rem] font-bold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
                    >
                      <Icon name="phone" className="h-3.5 w-3.5" />
                      {t.phone}
                    </a>
                    {t.email && (
                      <a
                        href={`mailto:${t.email}`}
                        aria-label={`Email ${t.fullName}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-brand-900/15 text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
                      >
                        <Icon name="mail" className="h-3.5 w-3.5" />
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
          </div>
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
    <div className="flex items-start gap-2.5 text-ink/60">
      <Icon name={icon} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" />
      <span>{label}</span>
    </div>
  );
}
