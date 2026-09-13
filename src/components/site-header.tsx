"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./logo";
import { SITE } from "@/lib/constants";
import { Icon, WhatsAppIcon } from "./icons";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Areas", href: "/areas" },
  { label: "For Tutors", href: "/tutors" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="relative z-[60] hidden bg-brand-950 text-white/80 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2 text-[0.76rem]">
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            Free demo lecture slots open for the new term — Classes 1 to 12, Surat.
          </p>
          <div className="flex items-center gap-5">
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-2 underline-swipe hover:text-white"
            >
              <Icon name="phone" className="h-3.5 w-3.5" />
              {SITE.phone}
            </a>
            <span className="h-3 w-px bg-white/20" />
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex items-center gap-2 underline-swipe hover:text-white"
            >
              <Icon name="mail" className="h-3.5 w-3.5" />
              {SITE.email}
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass border-b border-brand-900/10 shadow-[0_10px_40px_-30px_rgba(8,26,45,0.9)]"
            : "border-b border-transparent bg-cream/90 backdrop-blur-sm"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative rounded-full px-4 py-2 text-[0.88rem] font-semibold transition-colors duration-300 ${
                      active
                        ? "text-brand-900"
                        : "text-ink/65 hover:text-brand-900"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-accent-500 transition-transform duration-300 ${
                        active ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className="hidden items-center gap-2 rounded-full border border-brand-900/15 px-4 py-2.5 text-[0.84rem] font-semibold text-brand-900 transition-all duration-300 hover:border-brand-900/40 hover:bg-white sm:inline-flex"
            >
              <Icon name="phone" className="h-4 w-4" />
              Call now
            </a>
            <Link
              href="/book-demo"
              className="btn-shine hidden rounded-full bg-brand-900 px-5 py-2.5 text-[0.84rem] font-bold text-white shadow-[0_14px_30px_-16px_rgba(10,37,64,1)] transition-transform duration-300 hover:-translate-y-0.5 sm:inline-flex"
            >
              Book free demo
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-brand-900/15 bg-white/70 lg:hidden"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={`absolute inset-x-0 top-0 h-[2px] rounded bg-brand-900 transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-1.5 h-[2px] rounded bg-brand-900 transition-all duration-300 ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-3 h-[2px] rounded bg-brand-900 transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* mobile drawer */}
      <div
        className={`fixed inset-0 z-[55] lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-brand-950/50 backdrop-blur-sm transition-opacity duration-400 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col gap-6 bg-cream px-6 py-6 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center rounded-xl border border-brand-900/15 text-brand-900"
            >
              <Icon name="close" className="h-5 w-5" />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {NAV.map((item, i) => (
              <li
                key={item.href}
                className={open ? "animate-slide-in" : ""}
                style={{ animationDelay: `${70 + i * 55}ms` }}
              >
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-xl text-brand-900 transition-colors hover:bg-white"
                >
                  {item.label}
                  <Icon name="arrowRight" className="h-4 w-4 text-accent-500" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-auto space-y-3">
            <Link
              href="/book-demo"
              className="block rounded-2xl bg-brand-900 px-5 py-4 text-center font-bold text-white"
            >
              Book a free demo lecture
            </Link>
            <a
              href={SITE.whatsapp}
              className="flex items-center justify-center gap-2.5 rounded-2xl border border-brand-900/15 px-5 py-4 text-center font-semibold text-brand-900"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              WhatsApp us
            </a>
            <p className="pt-2 text-center text-xs text-ink/50">{SITE.address}</p>
          </div>
        </aside>
      </div>
    </>
  );
}
