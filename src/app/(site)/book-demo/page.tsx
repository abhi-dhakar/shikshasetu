import type { Metadata } from "next";
import DemoForm from "@/components/demo-form";
import Reveal from "@/components/reveal";
import { Eyebrow } from "@/components/ui";
import { Icon } from "@/components/icons";
import { WhatsAppIcon } from "@/components/icons";
import { SITE, TIME_SLOTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Book a Free Demo Lecture",
  description:
    "Book a free one-to-one demo lecture with a screened ShikshaSetu tutor in Surat. Classes 1–12, GSEB / CBSE / ICSE / NCERT, home or online.",
};

const ASSURANCES = [
  { icon: "gift" as const, title: "100% free", text: "No card, no advance, no obligation to continue." },
  { icon: "clock" as const, title: "45–60 minutes", text: "A real chapter taught, not a sales pitch." },
  { icon: "refresh" as const, title: "Free rematch", text: "Not the right fit? We send another tutor." },
  { icon: "location" as const, title: "At home or online", text: "Whatever works for your family's routine." },
];

export default function BookDemoPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-950 pb-28 pt-16 text-white sm:pt-20">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-30 invert" />
        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 animate-blob bg-brand-700/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-80 w-80 animate-blob bg-accent-600/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <Eyebrow tone="light">Free demo lecture</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-[2.4rem] leading-[1.05] sm:text-[3.2rem]">
              Meet your tutor before you decide anything
            </h1>
          </Reveal>
          <Reveal delay={170}>
            <p className="mt-5 max-w-2xl text-[1.03rem] leading-relaxed text-white/70">
              Share your child&apos;s learning needs, choose a slot that suits your routine,
              and we will arrange a free one-to-one demo lecture with a screened tutor in
              Surat.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {ASSURANCES.map((a) => (
                <div
                  key={a.title}
                  className="rounded-2xl border border-white/12 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-gold">
                    <Icon name={a.icon} className="h-5 w-5" />
                  </span>
                  <p className="mt-2 text-[0.92rem] font-bold text-white">{a.title}</p>
                  <p className="mt-1 text-[0.78rem] leading-snug text-white/55">{a.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative -mt-16 pb-20 sm:pb-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.55fr_1fr]">
          <Reveal>
            <DemoForm />
          </Reveal>

          <div className="space-y-5 lg:pt-6">
            <Reveal delay={120}>
              <aside className="rounded-[1.5rem] border border-brand-900/10 bg-white p-7 shadow-[var(--shadow-soft)]">
                <h3 className="font-display text-xl text-brand-900">
                  Prefer to just talk?
                </h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink/62">
                  Our academic coordinators answer calls between 9 AM and 8 PM, all seven
                  days. No call centre, no scripts.
                </p>
                <a
                  href={SITE.phoneHref}
                  className="mt-5 flex items-center justify-between rounded-xl bg-brand-900 px-5 py-4 font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  {SITE.phone}
                  <Icon name="phone" className="h-4 w-4" />
                </a>
                <a
                  href={SITE.whatsapp}
                  className="mt-3 flex items-center justify-between rounded-xl border border-brand-900/15 px-5 py-4 font-bold text-brand-900 transition-colors hover:bg-sand"
                >
                  Chat on WhatsApp
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                </a>
              </aside>
            </Reveal>

            <Reveal delay={200}>
              <aside className="rounded-[1.5rem] border border-brand-900/10 bg-sand p-7">
                <h3 className="font-display text-xl text-brand-900">
                  Daily demo slots ({SITE.timezone})
                </h3>
                <ul className="mt-4 space-y-2">
                  {TIME_SLOTS.map((t) => (
                    <li
                      key={t}
                      className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5 text-[0.88rem] font-semibold text-brand-900"
                    >
                      <span className="tabular-nums">{t}</span>
                      <span className="text-[0.72rem] font-medium text-ink/45">
                        45–60 min
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.8rem] leading-relaxed text-ink/55">
                  Each slot holds a limited number of demos so tutors are never rushed.
                  Slots that fill up are marked automatically.
                </p>
              </aside>
            </Reveal>

            <Reveal delay={270}>
              <aside className="rounded-[1.5rem] border border-brand-900/10 bg-white p-7">
                <h3 className="font-display text-xl text-brand-900">What happens next</h3>
                <ol className="mt-4 space-y-4">
                  {[
                    "We call to confirm the requirement and slot.",
                    "You receive the tutor's profile on WhatsApp.",
                    "The demo lecture happens at your chosen time.",
                    "You decide — continue, rematch or stop. No pressure.",
                  ].map((s, i) => (
                    <li key={s} className="flex gap-3 text-[0.9rem] text-ink/65">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-100 text-[0.7rem] font-bold text-accent-700">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
