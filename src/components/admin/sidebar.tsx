"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { logoutAction } from "@/app/admin/actions";

const NAV: { label: string; href: string; icon: IconName }[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Demo requests", href: "/admin/demo-requests", icon: "calendarCheck" },
  { label: "Tutor applications", href: "/admin/tutors", icon: "tutor" },
  { label: "Messages", href: "/admin/messages", icon: "inbox" },
  { label: "Security log", href: "/admin/security", icon: "shield" },
];

export default function AdminSidebar({
  user,
  counts,
}: {
  user: string;
  counts: Record<string, number>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const count = counts[item.href];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-[0.88rem] font-semibold transition-all duration-300 ${
              active
                ? "bg-white/12 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
                : "text-white/55 hover:bg-white/6 hover:text-white"
            }`}
          >
            <span
              className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                active ? "bg-accent-500 text-white" : "bg-white/8 text-white/70"
              }`}
            >
              <Icon name={item.icon} className="h-4 w-4" />
            </span>
            <span className="flex-1">{item.label}</span>
            {typeof count === "number" && count > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[0.68rem] font-bold ${
                  active ? "bg-gold text-brand-900" : "bg-white/10 text-white/60"
                }`}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="space-y-3 border-t border-white/10 pt-5">
      <div className="flex items-center gap-3 rounded-xl bg-white/6 px-3.5 py-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-500 font-display text-sm text-white">
          {user.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.85rem] font-bold text-white">{user}</p>
          <p className="text-[0.7rem] text-white/45">Administrator</p>
        </div>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/15 px-4 py-2.5 text-[0.84rem] font-bold text-white/75 transition-colors hover:border-rose-400/40 hover:bg-rose-500/15 hover:text-white"
        >
          <Icon name="logout" className="h-4 w-4" />
          Sign out
        </button>
      </form>
      <Link
        href="/"
        className="flex items-center justify-center gap-2 text-[0.78rem] text-white/40 transition-colors hover:text-white"
      >
        <Icon name="arrowLeft" className="h-3.5 w-3.5" />
        View website
      </Link>
    </div>
  );

  const brand = (
    <Link href="/admin" className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <path d="M4 20 16 6l12 14-12 5z" fill="#ff7a18" />
          <path
            d="M9 21.5v4.2c0 .5.3.9.7 1.1 4 1.9 8.6 1.9 12.6 0 .4-.2.7-.6.7-1.1v-4.2L16 24.8z"
            fill="#ffc93c"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span className="block font-display text-[1.05rem] font-bold text-white">
          Shiksha<span className="text-accent-400">Setu</span>
        </span>
        <span className="mt-1 block text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/40">
          Admin desk
        </span>
      </span>
    </Link>
  );

  return (
    <>
      {/* mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-brand-950 px-4 py-3 lg:hidden">
        {brand}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 text-white"
        >
          <Icon name="menu" className="h-5 w-5" />
        </button>
      </div>

      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[17rem] shrink-0 flex-col gap-7 overflow-y-auto border-r border-white/8 bg-brand-950 px-5 py-6 lg:flex">
        {brand}
        {nav}
        {footer}
      </aside>

      {/* mobile drawer */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-[17rem] flex-col gap-6 bg-brand-950 px-5 py-6 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            {brand}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close admin menu"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
          {nav}
          {footer}
        </aside>
      </div>
    </>
  );
}
