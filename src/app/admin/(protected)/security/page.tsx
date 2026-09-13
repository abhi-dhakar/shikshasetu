import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { adminAuditLogs, adminLoginAttempts } from "@/db/schema";
import AdminPageHeader from "@/components/admin/page-header";
import AdminSearch from "@/components/admin/search";
import { EmptyState, StatCard, fmtDateTime } from "@/components/admin/ui";
import { Icon, type IconName } from "@/components/icons";
import PasswordForm from "@/components/admin/password-form";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  login_success: "Successful sign in",
  login_failed: "Failed sign in",
  login_locked: "Sign in locked",
  login_blocked: "Blocked sign-in attempt",
  logout: "Signed out",
  demo_status_updated: "Demo status changed",
  tutor_status_updated: "Tutor status changed",
  message_status_updated: "Message status changed",
  messages_bulk_read: "Messages marked read",
  password_changed: "Administrator password changed",
  password_change_failed: "Password change rejected",
};

function actionIcon(action: string): IconName {
  if (action === "login_success") return "success";
  if (action.includes("login") && action !== "login_success") return "alert";
  if (action === "logout") return "logout";
  if (action.startsWith("demo")) return "calendarCheck";
  if (action.startsWith("tutor")) return "tutor";
  if (action.startsWith("message")) return "inbox";
  return "shield";
}

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; result?: string }>;
}) {
  const { q = "", result = "all" } = await searchParams;
  let logs: (typeof adminAuditLogs.$inferSelect)[] = [];
  let activeBlocks = 0;
  let failed24h = 0;
  let successful24h = 0;
  let failed = false;

  try {
    const filters = [sql`true`];
    if (result === "successful") filters.push(sql`${adminAuditLogs.successful} = true`);
    if (result === "failed") filters.push(sql`${adminAuditLogs.successful} = false`);
    if (q) {
      const like = `%${q.toLowerCase()}%`;
      filters.push(
        sql`(lower(${adminAuditLogs.actor}) like ${like}
          or lower(${adminAuditLogs.action}) like ${like}
          or lower(coalesce(${adminAuditLogs.entityType}, '')) like ${like}
          or lower(coalesce(${adminAuditLogs.detail}, '')) like ${like})`,
      );
    }

    const [entries, blocks, failures, successes] = await Promise.all([
      db
        .select()
        .from(adminAuditLogs)
        .where(sql.join(filters, sql` and `))
        .orderBy(desc(adminAuditLogs.createdAt))
        .limit(250),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(adminLoginAttempts)
        .where(sql`${adminLoginAttempts.blockedUntil} > now()`),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(adminAuditLogs)
        .where(
          sql`${adminAuditLogs.successful} = false and ${adminAuditLogs.createdAt} > now() - interval '24 hours'`,
        ),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(adminAuditLogs)
        .where(
          sql`${adminAuditLogs.action} = 'login_success' and ${adminAuditLogs.createdAt} > now() - interval '24 hours'`,
        ),
    ]);
    logs = entries;
    activeBlocks = blocks[0]?.n ?? 0;
    failed24h = failures[0]?.n ?? 0;
    successful24h = successes[0]?.n ?? 0;
  } catch {
    failed = true;
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Security"
        icon="shield"
        title="Security & audit log"
        subtitle="Persistent record of authentication and administrative changes."
      />

      <div className="space-y-6 p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Successful logins"
            value={successful24h}
            hint="In the last 24 hours"
            icon="success"
            accent="emerald"
          />
          <StatCard
            label="Failed events"
            value={failed24h}
            hint="In the last 24 hours"
            icon="alert"
            accent="accent"
          />
          <StatCard
            label="Active lockouts"
            value={activeBlocks}
            hint="5 failures trigger 10 minutes"
            icon="lock"
            accent="violet"
          />
          <StatCard
            label="Session policy"
            value="8h"
            hint="HttpOnly · signed · SameSite"
            icon="key"
            accent="brand"
          />
        </div>

        <section className="grid gap-4 rounded-2xl border border-brand-900/10 bg-brand-950 p-5 text-white sm:grid-cols-3 sm:p-6">
          {[
            ["key", "PBKDF2-SHA256", "210,000 password derivation rounds"],
            ["shield", "HMAC-SHA256", "Signed session with random nonce"],
            ["lock", "Persistent throttling", "Fingerprint is hashed before storage"],
          ].map(([icon, title, detail]) => (
            <div key={title} className="flex gap-3 rounded-xl bg-white/6 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10 text-gold">
                <Icon name={icon as IconName} className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[0.82rem] font-bold">{title}</p>
                <p className="mt-1 text-[0.72rem] leading-snug text-white/50">{detail}</p>
              </div>
            </div>
          ))}
        </section>

        <PasswordForm />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {["all", "successful", "failed"].map((item) => {
              const active = result === item;
              const query = new URLSearchParams();
              if (item !== "all") query.set("result", item);
              if (q) query.set("q", q);
              return (
                <a
                  key={item}
                  href={`/admin/security${query.size ? `?${query}` : ""}`}
                  className={`rounded-full border px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.06em] transition-all ${
                    active
                      ? "border-brand-900 bg-brand-900 text-white"
                      : "border-brand-900/12 bg-white text-ink/60 hover:text-brand-900"
                  }`}
                >
                  {item}
                </a>
              );
            })}
          </div>
          <AdminSearch
            action="/admin/security"
            defaultValue={q}
            placeholder="Search actor, action, detail…"
            hidden={result !== "all" ? { result } : undefined}
          />
        </div>

        <section className="overflow-hidden rounded-2xl border border-brand-900/10 bg-white">
          <header className="border-b border-brand-900/8 px-5 py-4">
            <h2 className="font-display text-[1.08rem] text-brand-900">Audit events</h2>
            <p className="mt-0.5 text-[0.76rem] text-ink/45">
              Append-only activity history · {logs.length} event(s) shown
            </p>
          </header>
          {failed ? (
            <EmptyState text="Security tables are not available." icon="alert" />
          ) : logs.length === 0 ? (
            <EmptyState text="No security events match this filter." icon="shield" />
          ) : (
            <ul className="divide-y divide-brand-900/8">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="flex flex-wrap items-start gap-4 px-5 py-4 transition-colors hover:bg-sand/40"
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                      log.successful
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    <Icon name={actionIcon(log.action)} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="text-[0.88rem] font-bold text-brand-900">
                        {ACTION_LABELS[log.action] ?? log.action.replaceAll("_", " ")}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.64rem] font-bold uppercase tracking-[0.08em] ${
                          log.successful
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {log.successful ? "success" : "failed"}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.76rem] text-ink/50">
                      Actor: <strong className="text-ink/70">{log.actor}</strong>
                      {log.entityType && (
                        <>
                          {" "}· {log.entityType.replaceAll("_", " ")}
                          {log.entityId ? ` #${log.entityId}` : ""}
                        </>
                      )}
                    </p>
                    {log.detail && (
                      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink/65">
                        {log.detail}
                      </p>
                    )}
                    {log.fingerprint && (
                      <p className="mt-1 font-mono text-[0.65rem] text-ink/30">
                        fingerprint {log.fingerprint.slice(0, 12)}…
                      </p>
                    )}
                  </div>
                  <time className="whitespace-nowrap text-[0.7rem] text-ink/40">
                    {fmtDateTime(log.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
