import Link from "next/link";
import { desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import AdminPageHeader from "@/components/admin/page-header";
import AdminSearch from "@/components/admin/search";
import StatusSelect from "@/components/admin/status-select";
import { EmptyState, StatusPill, fmtDateTime } from "@/components/admin/ui";
import { Icon, WhatsAppIcon } from "@/components/icons";
import { markAllMessagesRead, updateMessageStatus } from "@/app/admin/actions";
import { MESSAGE_STATUSES } from "@/lib/admin-constants";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "all" } = await searchParams;

  let rows: (typeof contactMessages.$inferSelect)[] = [];
  let unreadCount = 0;
  let failed = false;
  try {
    const filters = [sql`true`];
    if (status !== "all") filters.push(sql`${contactMessages.status} = ${status}`);
    if (q) {
      const like = `%${q.toLowerCase()}%`;
      filters.push(
        sql`(lower(${contactMessages.name}) like ${like}
          or ${contactMessages.phone} like ${like}
          or lower(${contactMessages.topic}) like ${like}
          or lower(${contactMessages.message}) like ${like})`,
      );
    }
    const [result, unread] = await Promise.all([
      db
        .select()
        .from(contactMessages)
        .where(sql.join(filters, sql` and `))
        .orderBy(desc(contactMessages.createdAt))
        .limit(200),
      db
        .select({ n: sql<number>`count(*)::int` })
        .from(contactMessages)
        .where(sql`${contactMessages.status} = 'unread'`),
    ]);
    rows = result;
    unreadCount = unread[0]?.n ?? 0;
  } catch {
    failed = true;
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Inbox"
        icon="inbox"
        title="Contact messages"
        subtitle={`${rows.length} message(s) shown · ${unreadCount} unread`}
        actions={
          unreadCount > 0 ? (
            <form action={markAllMessagesRead}>
              <button type="submit" className="admin-button">
                <Icon name="check" className="h-3.5 w-3.5" aria-hidden="true" />
                Mark all read
              </button>
            </form>
          ) : null
        }
      />

      <div className="admin-content">
        <div className="admin-filter-bar">
          <nav className="admin-filter-group" aria-label="Filter messages by status">
            {["all", ...MESSAGE_STATUSES].map((item) => {
              const active = status === item;
              const href =
                item === "all"
                  ? `/admin/messages${q ? `?q=${encodeURIComponent(q)}` : ""}`
                  : `/admin/messages?status=${item}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
              return (
                <Link
                  key={item}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`admin-filter ${active ? "admin-filter--active" : ""}`}
                >
                  {item}
                </Link>
              );
            })}
          </nav>
          <AdminSearch
            action="/admin/messages"
            defaultValue={q}
            placeholder="Search messages…"
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
            <EmptyState text="No messages match this filter." />
          </section>
        ) : (
          <section className="admin-two-column-grid" aria-label="Contact message records">
            {rows.map((message) => (
              <article
                key={message.id}
                className={`admin-record-card ${
                  message.status === "unread" ? "admin-record-card--unread" : ""
                }`}
                aria-labelledby={`message-${message.id}-name`}
              >
                {message.status === "unread" && (
                  <span className="admin-record-card__unread-dot" aria-hidden="true" />
                )}

                <div className="admin-record-card__header">
                  <div className="admin-record-card__identity">
                    <span className="admin-avatar" aria-hidden="true">
                      {message.name.charAt(0)}
                    </span>
                    <div>
                      <h2
                        id={`message-${message.id}-name`}
                        className="admin-record-card__name"
                      >
                        {message.name}
                      </h2>
                      <time
                        className="admin-record-card__meta"
                        dateTime={new Date(message.createdAt).toISOString()}
                      >
                        {fmtDateTime(message.createdAt)}
                      </time>
                    </div>
                  </div>
                  <StatusPill status={message.status} />
                </div>

                <div>
                  <span className="admin-tag">{message.topic}</span>
                </div>

                <p className="admin-message-body">{message.message}</p>

                <div className="admin-record-card__footer">
                  <div className="admin-contact-actions">
                    <a href={`tel:${message.phone}`} className="admin-button">
                      <Icon name="phone" className="h-3.5 w-3.5" aria-hidden="true" />
                      {message.phone}
                    </a>
                    <a
                      href={`https://wa.me/91${message.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-button"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      WhatsApp
                    </a>
                    {message.email && (
                      <a
                        href={`mailto:${message.email}`}
                        className="admin-icon-button"
                        aria-label={`Email ${message.name}`}
                      >
                        <Icon name="mail" className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  <StatusSelect
                    id={message.id}
                    status={message.status}
                    options={MESSAGE_STATUSES}
                    action={updateMessageStatus}
                  />
                </div>

                {message.handledAt && (
                  <p className="admin-audit-meta text-right">
                    Last handled {fmtDateTime(message.handledAt)}
                  </p>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </>
  );
}
