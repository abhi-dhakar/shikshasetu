"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/icons";
import { logoutAction } from "@/app/admin/actions";

type NavItem = { label: string; href: string; icon: IconName };

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [{ label: "Dashboard", href: "/admin", icon: "dashboard" }],
  },
  {
    label: "Pipeline",
    items: [
      { label: "Demo requests", href: "/admin/demo-requests", icon: "calendarCheck" },
      { label: "Tutor applications", href: "/admin/tutors", icon: "tutor" },
      { label: "Messages", href: "/admin/messages", icon: "inbox" },
    ],
  },
  {
    label: "Governance",
    items: [{ label: "Security log", href: "/admin/security", icon: "shield" }],
  },
];

function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M4 20 16 6l12 14-12 5z" fill="#fafafa" />
      <path
        d="M9 21.5v4.2c0 .5.3.9.7 1.1 4 1.9 8.6 1.9 12.6 0 .4-.2.7-.6.7-1.1v-4.2L16 24.8z"
        fill="#f59e0b"
      />
    </svg>
  );
}

export default function AdminSidebar({
  user,
  counts,
}: {
  user: string;
  counts: Record<string, number>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [open]);

  const brand = (
    <Link href="/admin" className="admin-brand" onClick={() => setOpen(false)}>
      <span className="admin-brand__mark">
        <BrandMark />
      </span>
      <span>
        <span className="admin-brand__name">
          Shiksha<span>Setu</span>
        </span>
        <span className="admin-brand__caption">Admin console</span>
      </span>
    </Link>
  );

  const nav = (
    <nav className="admin-nav" aria-label="Admin sections">
      {NAV_GROUPS.map((group) => (
        <div className="admin-nav__group" key={group.label}>
          <p className="admin-nav__label">{group.label}</p>
          <ul className="admin-nav__list">
            {group.items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const count = counts[item.href];
              const hasCount = typeof count === "number" && count > 0;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    aria-label={hasCount ? `${item.label}, ${count} need attention` : undefined}
                    className="admin-nav__link"
                  >
                    <span className="admin-nav__icon" aria-hidden="true">
                      <Icon name={item.icon} className="h-4 w-4" />
                    </span>
                    <span className="admin-nav__text">{item.label}</span>
                    {hasCount && (
                      <span className="admin-nav__count" aria-hidden="true">
                        {count}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const systemCard = (
    <div className="admin-system-card">
      <span className="admin-system-card__icon" aria-hidden="true">
        <Icon name="shield" className="h-4 w-4" />
      </span>
      <div>
        <strong>Session protected</strong>
        <span>8-hour signed sessions</span>
      </div>
    </div>
  );

  const footer = (
    <div className="admin-sidebar__footer">
      <div className="admin-user-card">
        <span className="admin-user-card__avatar" aria-hidden="true">
          {user.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="admin-user-card__name">{user}</p>
          <p className="admin-user-card__role">Administrator</p>
        </div>
      </div>
      <form action={logoutAction} className="admin-sidebar__form">
        <button type="submit" className="admin-button admin-button--ghost w-full">
          <Icon name="logout" className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </form>
      <Link href="/" className="admin-sidebar__link">
        <Icon name="arrowLeft" className="h-3.5 w-3.5" aria-hidden="true" />
        View website
      </Link>
    </div>
  );

  const drawer: ReactNode = open ? (
    <div className="admin-drawer-backdrop">
      <div
        className="admin-drawer__scrim"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <aside
        ref={drawerRef}
        id="admin-mobile-drawer"
        className="admin-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-drawer-title"
      >
        <h2 id="admin-drawer-title" className="admin-visually-hidden">
          Admin navigation
        </h2>
        <div className="admin-drawer__header">
          {brand}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
            className="admin-icon-button"
          >
            <Icon name="close" className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {nav}
        {systemCard}
        {footer}
      </aside>
    </div>
  ) : null;

  return (
    <>
      <div className="admin-mobile-bar">
        {brand}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-haspopup="dialog"
          aria-controls="admin-mobile-drawer"
          aria-expanded={open}
          className="admin-icon-button"
        >
          <Icon name="menu" className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <aside className="admin-sidebar">
        {brand}
        {nav}
        {systemCard}
        {footer}
      </aside>

      {drawer}
    </>
  );
}
