import type { ReactNode } from "react";
import Link from "next/link";
import Reveal from "./reveal";
import { Icon } from "./icons";

export function Eyebrow({
  children,
  tone = "dark",
}: {
  children: ReactNode;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] ${
        tone === "light"
          ? "border-white/20 bg-white/10 text-white/85"
          : "border-brand-900/12 bg-white text-brand-800"
      }`}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-500" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "dark",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  tone?: "dark" | "light";
}) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={90}>
        <h2
          className={`mt-5 text-balance font-display text-[2.1rem] leading-[1.08] sm:text-[2.7rem] lg:text-[3.15rem] ${
            tone === "light" ? "text-white" : "text-brand-900"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={170}>
          <p
            className={`mt-5 text-pretty text-[1.02rem] leading-relaxed ${
              tone === "light" ? "text-white/70" : "text-ink/65"
            }`}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export function PrimaryButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`btn-shine group inline-flex items-center gap-2.5 rounded-full bg-accent-500 px-7 py-3.5 text-[0.94rem] font-bold text-white shadow-[0_20px_40px_-20px_rgba(237,93,0,0.95)] transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
    >
      {children}
      <Icon
        name="arrowRight"
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}

export function GhostButton({
  href,
  children,
  tone = "dark",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-full border px-7 py-3.5 text-[0.94rem] font-bold transition-all duration-300 hover:-translate-y-0.5 ${
        tone === "light"
          ? "border-white/30 text-white hover:bg-white hover:text-brand-900"
          : "border-brand-900/20 text-brand-900 hover:border-brand-900 hover:bg-brand-900 hover:text-white"
      } ${className}`}
    >
      {children}
    </Link>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-950 pb-20 pt-20 text-white sm:pt-24">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35] invert" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 animate-blob bg-brand-700/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 animate-blob bg-accent-600/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <Eyebrow tone="light">{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-[2.4rem] leading-[1.05] sm:text-[3.2rem] lg:text-[3.9rem]">
            {title}
          </h1>
        </Reveal>
        {lead && (
          <Reveal delay={190}>
            <p className="mt-6 max-w-2xl text-pretty text-[1.05rem] leading-relaxed text-white/70">
              {lead}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={260}>
            <div className="mt-9 flex flex-wrap gap-3">{children}</div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
