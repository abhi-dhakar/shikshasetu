import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/reveal";
import { GhostButton, PageHero, PrimaryButton, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";
import { PROCESS, SCREENING } from "@/lib/constants";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From sharing your learning needs to the free demo class and your child's learning plan — here is exactly how ShikshaSetu Surat matches tutors.",
};

const MATCH_FACTORS = [
  ["Subject strength", "The tutor must have cleared our subject test for that exact class and board."],
  ["Locality", "We prefer tutors within 4–5 km so sessions actually start on time."],
  ["Teaching style", "Patient and slow-paced, or fast and challenge-driven — we ask you first."],
  ["Language comfort", "English, Gujarati or Hindi medium explanation, whichever your child follows."],
  ["Timing fit", "Matched against your fixed school, sport and coaching schedule."],
  ["Gender preference", "If you have one, we respect it — no questions asked."],
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Our process"
        title={
          <>
            Four honest steps from enquiry to{" "}
            <span className="text-gradient">real improvement</span>
          </>
        }
        lead="No pushy sales calls, no lock-in packages before you have seen a tutor teach. Here is exactly what happens after you submit the form."
      >
        <PrimaryButton href="/book-demo">Start step one</PrimaryButton>
        <GhostButton href="/contact" tone="light">
          Ask a question first
        </GhostButton>
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative space-y-6">
            <div className="pointer-events-none absolute bottom-10 left-[2.15rem] top-10 hidden w-px bg-[linear-gradient(180deg,transparent,rgba(10,37,64,0.18),transparent)] sm:block" />
            {PROCESS.map((step, i) => (
              <Reveal key={step.step} delay={i * 90}>
                <article className="card-hover relative flex flex-col gap-5 rounded-[1.6rem] border border-brand-900/10 bg-white p-7 sm:flex-row sm:items-start sm:gap-7 sm:p-8">
                  <span className="grid h-[4.3rem] w-[4.3rem] shrink-0 place-items-center rounded-2xl bg-brand-900 text-gold">
                    <Icon name={step.icon} className="h-8 w-8" />
                  </span>
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-accent-600">
                      Step {step.step}
                    </p>
                    <h2 className="mt-2 font-display text-[1.45rem] text-brand-900">
                      {step.title}
                    </h2>
                    <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink/65">
                      {step.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Matching logic"
            title="Six things we weigh before suggesting a tutor"
            lead="Tutor matching is the part most agencies rush. It is the part we spend the most time on."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MATCH_FACTORS.map(([title, text], i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="card-hover h-full rounded-[1.5rem] border border-brand-900/10 bg-white p-7">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-100 text-[0.8rem] font-bold text-accent-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 font-display text-[1.1rem] text-brand-900">{title}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink/62">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Tutor screening"
              title="Every tutor clears four checks"
              lead="Identity, qualification, subject knowledge and communication — in that order, before they are ever matched."
            />
            <div className="mt-8 space-y-4">
              {SCREENING.map((s, i) => (
                <Reveal key={s.title} delay={i * 90}>
                  <div className="flex gap-4 rounded-2xl border border-brand-900/10 bg-white p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-[1.05rem] text-brand-900">{s.title}</h3>
                      <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink/62">
                        {s.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal direction="right">
            <div className="overflow-hidden rounded-[2rem] border border-brand-900/10 shadow-[var(--shadow-soft)]">
              <Image
                src="/images/online-class.png"
                alt="Student in a live one-to-one online tuition session"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-900 py-20 text-center text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,122,24,0.3),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(51,129,251,0.35),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="text-balance font-display text-[2.1rem] leading-tight sm:text-[2.8rem]">
              Ready to see a tutor in action?
            </h2>
          </Reveal>
          <Reveal delay={130}>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Book a free demo lecture and judge for yourself — before you commit to
              anything.
            </p>
          </Reveal>
          <Reveal delay={200} className="mt-8">
            <PrimaryButton href="/book-demo">Book my free demo</PrimaryButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
