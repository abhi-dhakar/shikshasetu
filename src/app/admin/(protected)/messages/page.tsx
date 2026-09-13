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
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-brand-900/15 bg-white px-4 py-2 text-[0.76rem] font-bold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
              >
                <Icon name="check" className="h-3.5 w-3.5" />
                Mark all read
              </button>
            </form>
          ) : null
        }
      />

      <div className="space-y-5 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
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
                  className={`rounded-full border px-4 py-2 text-[0.76rem] font-bold uppercase tracking-[0.06em] transition-all duration-300 ${
                    active
                      ? "border-brand-900 bg-brand-900 text-white"
                      : "border-brand-900/12 bg-white text-ink/60 hover:-translate-y-0.5 hover:text-brand-900"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </div>
          <AdminSearch
            action="/admin/messages"
            defaultValue={q}
            placeholder="Search messages…"
            hidden={status !== "all" ? { status } : undefined}
          />
        </div>

        {failed ? (
          <div className="rounded-2xl border border-brand-900/10 bg-white">
            <EmptyState text="Database not ready. Run npx drizzle-kit push." icon="alert" />
          </div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-brand-900/10 bg-white">
            <EmptyState text="No messages match this filter." />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {rows.map((message) => (
              <article
                key={message.id}
                className={`card-hover relative rounded-2xl border bg-white p-5 ${
                  message.status === "unread"
                    ? "border-brand-400/45 shadow-[0_18px_50px_-32px_rgba(29,99,240,0.65)]"
                    : "border-brand-900/10"
                }`}
              >
                {message.status === "unread" && (
                  <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_0_4px_rgba(51,129,251,0.12)]" />
                )}
                <div className="flex items-start justify-between gap-3 pr-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-full font-display text-[0.95rem] ${
                        message.status === "unread"
                          ? "bg-brand-900 text-white"
                          : "bg-accent-100 text-accent-700"
                      }`}
                    >
                      {message.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-bold text-brand-900">{message.name}</p>
                      <p className="text-[0.73rem] text-ink/45">
                        {fmtDateTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                  <StatusPill status={message.status} />
                </div>

                <span className="mt-4 inline-flex rounded-full border border-brand-900/12 bg-sand px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.08em] text-ink/55">
                  {message.topic}
                </span>
                <p className="mt-3 whitespace-pre-line text-[0.87rem] leading-relaxed text-ink/70">
                  {message.message}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-brand-900/8 pt-4">
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`tel:${message.phone}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-brand-900/15 px-3 py-2 text-[0.76rem] font-bold text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
                    >
                      <Icon name="phone" className="h-3.5 w-3.5" />
                      {message.phone}
                    </a>
                    <a
                      href={`https://wa.me/91${message.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#25D366]/35 px-3 py-2 text-[0.76rem] font-bold text-[#128C4A] transition-colors hover:bg-[#25D366] hover:text-white"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                    {message.email && (
                      <a
                        href={`mailto:${message.email}`}
                        className="grid h-9 w-9 place-items-center rounded-lg border border-brand-900/15 text-brand-900 transition-colors hover:bg-brand-900 hover:text-white"
                        aria-label={`Email ${message.name}`}
                      >
                        <Icon name="mail" className="h-3.5 w-3.5" />
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
                  <p className="mt-2 text-right text-[0.67rem] text-ink/35">
                    Last handled {fmtDateTime(message.handledAt)}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
