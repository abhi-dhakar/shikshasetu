import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { adminAuditLogs, adminLoginAttempts } from "@/db/schema";
import AdminPageHeader from "@/components/admin/page-header";
import AdminSearch from "@/components/admin/search";
import { EmptyState, Panel, StatCard, fmtDateTime } from "@/components/admin/ui";
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

const SECURITY_FEATURES: { icon: IconName; title: string; detail: string }[] = [
  ["key", "PBKDF2-SHA256", "210,000 password derivation rounds"],
  ["shield", "HMAC-SHA256", "Signed session with random nonce"],
  ["lock", "Persistent throttling", "Fingerprint is hashed before storage"],
].map(([icon, title, detail]) => ({
  icon: icon as IconName,
  title,
  detail,
}));

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

      <div className="admin-content">
        <section className="admin-kpi-grid" aria-label="Security key metrics">
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
        </section>

        <section className="admin-security-features" aria-label="Security controls">
          {SECURITY_FEATURES.map((feature) => (
            <div className="admin-security-feature" key={feature.title}>
              <span className="admin-security-feature__icon" aria-hidden="true">
                <Icon name={feature.icon} className="h-4 w-4" />
              </span>
              <div>
                <strong>{feature.title}</strong>
                <span>{feature.detail}</span>
              </div>
            </div>
          ))}
        </section>

        <PasswordForm />

        <div className="admin-filter-bar">
          <nav className="admin-filter-group" aria-label="Filter audit events by result">
            {["all", "successful", "failed"].map((item) => {
              const active = result === item;
              const query = new URLSearchParams();
              if (item !== "all") query.set("result", item);
              if (q) query.set("q", q);
              return (
                <a
                  key={item}
                  href={`/admin/security${query.size ? `?${query}` : ""}`}
                  aria-current={active ? "page" : undefined}
                  className={`admin-filter ${active ? "admin-filter--active" : ""}`}
                >
                  {item}
                </a>
              );
            })}
          </nav>
          <AdminSearch
            action="/admin/security"
            defaultValue={q}
            placeholder="Search actor, action, detail…"
            hidden={result !== "all" ? { result } : undefined}
          />
        </div>

        {failed ? (
          <section className="admin-panel">
            <div className="admin-panel__body">
              <p className="admin-alert admin-alert--danger" role="alert">
                <Icon name="alert" className="h-4 w-4" aria-hidden="true" />
                Security tables are not available. Run{" "}
                <code>npx drizzle-kit push</code>.
              </p>
            </div>
          </section>
        ) : (
          <Panel
            title="Audit events"
            subtitle={`Append-only activity history · ${logs.length} event(s) shown`}
          >
            {logs.length === 0 ? (
              <EmptyState
                text="No security events match this filter."
                icon="shield"
              />
            ) : (
              <ul className="admin-list admin-audit-list">
                {logs.map((log) => (
                  <li key={log.id}>
                    <span
                      className={`admin-audit-icon ${
                        log.successful
                          ? "admin-audit-icon--success"
                          : "admin-audit-icon--danger"
                      }`}
                      aria-hidden="true"
                    >
                      <Icon name={actionIcon(log.action)} className="h-4 w-4" />
                    </span>
                    <div className="admin-audit-content">
                      <div className="admin-audit-title">
                        <span>
                          {ACTION_LABELS[log.action] ??
                            log.action.replaceAll("_", " ")}
                        </span>
                        <span
                          className={`admin-status ${
                            log.successful
                              ? "admin-status--success"
                              : "admin-status--danger"
                          }`}
                        >
                          {log.successful ? "success" : "failed"}
                        </span>
                      </div>
                      <p className="admin-audit-meta">
                        Actor: <strong>{log.actor}</strong>
                        {log.entityType && (
                          <>
                            {" "}· {log.entityType.replaceAll("_", " ")}
                            {log.entityId ? ` #${log.entityId}` : ""}
                          </>
                        )}
                      </p>
                      {log.detail && (
                        <p className="admin-audit-detail">{log.detail}</p>
                      )}
                      {log.fingerprint && (
                        <p className="admin-audit-fingerprint">
                          fingerprint {log.fingerprint.slice(0, 12)}…
                        </p>
                      )}
                    </div>
                    <time
                      className="admin-audit-time"
                      dateTime={new Date(log.createdAt).toISOString()}
                    >
                      {fmtDateTime(log.createdAt)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        )}
      </div>
    </>
  );
}
