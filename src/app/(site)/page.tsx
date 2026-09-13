import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/hero";
import Reveal from "@/components/reveal";
import Counter from "@/components/counter";
import Testimonials from "@/components/testimonials";
import Faq from "@/components/faq";
import { Eyebrow, GhostButton, PrimaryButton, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";
import { AREAS, PROCESS, PROGRAMS, SCREENING, STATS } from "@/lib/constants";

const WHY = [
  {
    icon: "focus" as const,
    title: "One student, one tutor",
    text: "No crowded batches. The entire session is built around your child's pace, gaps and goals.",
  },
  {
    icon: "shield" as const,
    title: "Four-stage tutor screening",
    text: "Identity, qualification, subject knowledge and communication checks before any tutor meets your child.",
  },
  {
    icon: "gift" as const,
    title: "Genuinely free demo",
    text: "Watch a real chapter being taught before you pay anything. Not the right fit? We rematch, free.",
  },
  {
    icon: "location" as const,
    title: "Tutors from your locality",
    text: "We match within your part of Surat so sessions start on time and never get cancelled by traffic.",
  },
  {
    icon: "growth" as const,
    title: "Written learning plan",
    text: "A syllabus roadmap, monthly test schedule and progress report shared with parents on WhatsApp.",
  },
  {
    icon: "laptop" as const,
    title: "Home, online or either",
    text: "Switch between home visits and live online sessions with the same tutor whenever you need to.",
  },
];

const MARQUEE = [
  "GSEB",
  "CBSE",
  "ICSE",
  "NCERT",
  "Classes 1–12",
  "Science Stream",
  "Commerce Stream",
  "Humanities",
  "Board Exam Prep",
  "Home Tuition",
  "Online Tuition",
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* marquee */}
      <div className="marquee-wrap relative overflow-hidden border-y border-brand-900/10 bg-white py-4">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {MARQUEE.map((m) => (
                <span
                  key={`${dup}-${m}`}
                  className="flex items-center gap-6 whitespace-nowrap px-6 text-[0.8rem] font-bold uppercase tracking-[0.22em] text-brand-900/55"
                >
                  {m}
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-500/70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* intro */}
      <section className="relative overflow-hidden py-20 sm:py-28" id="about">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="left" className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-900/10 shadow-[var(--shadow-soft)]">
              <Image
                src="/images/hero-tutor.png"
                alt="ShikshaSetu tutor teaching a student at home in Surat"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="animate-float absolute -bottom-7 -right-3 w-56 rounded-2xl border border-brand-900/10 bg-white p-5 shadow-[var(--shadow-lift)] sm:-right-8">
              <p className="font-display text-3xl text-brand-900">
                <Counter value={96} suffix="%" />
              </p>
              <p className="mt-1 text-[0.78rem] leading-snug text-ink/55">
                of parents continue with us after the first term
              </p>
            </div>
            <div className="pointer-events-none absolute -left-8 -top-8 -z-10 h-40 w-40 animate-blob bg-accent-200/70" />
          </Reveal>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Surat's tuition bridge"
              title={
                <>
                  Surat&apos;s most careful{" "}
                  <span className="text-gradient">tutor matching</span> service
                </>
              }
              lead="ShikshaSetu means a bridge to learning. We are a Surat-based home and online tuition service that connects parents and students of Classes 1 to 12 with tutors who are screened, local and genuinely good at explaining."
            />
            <Reveal delay={220}>
              <ul className="mt-8 space-y-4">
                {[
                  "Tell us the class, board, subjects and preferred timing.",
                  "We shortlist screened tutors from your area of Surat.",
                  "You attend a free demo lecture before deciding anything.",
                ].map((line, i) => (
                  <li key={line} className="flex items-start gap-4">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-900 text-[0.72rem] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-[0.97rem] leading-relaxed text-ink/70">{line}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap gap-3">
                <PrimaryButton href="/book-demo">Book a free demo</PrimaryButton>
                <GhostButton href="/about">Know more about us</GhostButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* why */}
      <section className="relative bg-sand py-20 sm:py-28" id="why">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Why ShikshaSetu"
            title="Everything a worried parent wants, handled"
            lead="Personalised tuition tailored to each student's needs and capabilities, delivered by tutors we have personally verified."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((card, i) => (
              <Reveal key={card.title} delay={i * 70}>
                <article className="card-hover group h-full rounded-[1.6rem] border border-brand-900/10 bg-white p-7">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                    <Icon name={card.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-display text-xl text-brand-900">{card.title}</h3>
                  <p className="mt-3 text-[0.94rem] leading-relaxed text-ink/62">{card.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* programs */}
      <section className="relative overflow-hidden py-20 sm:py-28" id="programs">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Programs & exam categories"
            title="Pick the stage your child is in"
            lead="ShikshaSetu prepares students across every school exam category. Scroll to find the one you are preparing for."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {PROGRAMS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 90} direction={i % 2 ? "right" : "left"}>
                <article className="card-hover group relative h-full overflow-hidden rounded-[1.75rem] border border-brand-900/10 bg-white p-8">
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${p.accent} opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20`}
                  />
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-900 text-gold">
                        <Icon name={p.icon} className="h-6 w-6" />
                      </span>
                      <span className="rounded-full border border-brand-900/12 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-ink/55">
                        {p.eyebrow}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-[1.65rem] text-brand-900">{p.title}</h3>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/65">{p.blurb}</p>
                    <ul className="mt-6 space-y-2.5">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-[0.9rem] text-ink/70">
                          <span className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/book-demo"
                      className="mt-7 inline-flex items-center gap-2 text-[0.88rem] font-bold text-brand-900 underline-swipe"
                    >
                      Book a demo for this program
                      <Icon name="arrowRight" className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* stats band */}
      <section className="relative overflow-hidden bg-brand-950 py-16 text-white">
        <div className="dotted pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[90px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <p className="text-center font-display text-2xl sm:text-3xl">
              Trusted by students &amp; parents across Surat
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="text-center">
                <p className="font-display text-[2.6rem] leading-none text-gold sm:text-[3.2rem]">
                  <Counter value={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-[0.82rem] uppercase tracking-[0.14em] text-white/55">
                  {s.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="relative py-20 sm:py-28" id="process">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="How it works"
            title="Four steps from enquiry to improvement"
            lead="No pushy sales calls. A clear, parent-friendly process that starts with your child's needs and ends with a learning plan."
          />
          <div className="relative mt-16">
            <div className="pointer-events-none absolute left-0 right-0 top-[3.25rem] hidden h-px bg-[linear-gradient(90deg,transparent,rgba(10,37,64,0.18)_12%,rgba(10,37,64,0.18)_88%,transparent)] lg:block" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {PROCESS.map((step, i) => (
                <Reveal key={step.step} delay={i * 110}>
                  <article className="card-hover group relative h-full rounded-[1.6rem] border border-brand-900/10 bg-white p-7">
                    <div className="flex items-center justify-between">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-900 text-gold transition-transform duration-500 group-hover:scale-105">
                        <Icon name={step.icon} className="h-6 w-6" />
                      </span>
                      <span className="font-display text-3xl text-brand-100">{step.step}</span>
                    </div>
                    <h3 className="mt-6 font-display text-[1.22rem] text-brand-900">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[0.92rem] leading-relaxed text-ink/62">{step.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={200} className="mt-12 text-center">
            <PrimaryButton href="/book-demo">Start with step one</PrimaryButton>
          </Reveal>
        </div>
      </section>

      {/* screening */}
      <section className="relative overflow-hidden bg-sand py-20 sm:py-28" id="screening">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Tutor screening"
              title={
                <>
                  We check four things before a tutor{" "}
                  <span className="text-gradient">enters your home</span>
                </>
              }
              lead="Roughly one in six applicants makes it onto the ShikshaSetu panel. Here is exactly what every tutor clears."
            />
            <div className="mt-9 space-y-4">
              {SCREENING.map((s, i) => (
                <Reveal key={s.title} delay={i * 90}>
                  <div className="card-hover flex gap-4 rounded-2xl border border-brand-900/10 bg-white p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-[1.08rem] text-brand-900">{s.title}</h3>
                      <p className="mt-1.5 text-[0.9rem] leading-relaxed text-ink/62">{s.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal direction="right" className="relative">
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-900/10 shadow-[var(--shadow-soft)]">
              <Image
                src="/images/tutor-screening.png"
                alt="ShikshaSetu academic team interviewing a tutor applicant"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="animate-float-slow absolute -left-4 bottom-8 w-60 rounded-2xl border border-brand-900/10 bg-brand-900 p-5 text-white shadow-[var(--shadow-lift)]">
              <p className="font-display text-2xl">1 in 6</p>
              <p className="mt-1 text-[0.78rem] leading-snug text-white/65">
                applicants clear all four screening stages
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* areas */}
      <section className="relative overflow-hidden py-20 sm:py-28" id="areas">
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Service areas"
            title="Home tuition across 12 Surat localities"
            lead="Our tutors travel short distances, which means punctual sessions and fewer cancellations. Online tuition is available anywhere in India."
          />
          <div className="mt-14 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {AREAS.map((area, i) => (
              <Reveal key={area} delay={i * 45}>
                <Link
                  href="/areas"
                  className="card-hover group flex items-center justify-between gap-3 rounded-2xl border border-brand-900/10 bg-white px-5 py-4"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon name="location" className="h-4 w-4" />
                    </span>
                    <span className="font-semibold text-brand-900">{area}</span>
                  </span>
                  <Icon
                    name="arrowRight"
                    className="h-4 w-4 text-accent-500 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="relative bg-brand-950 py-20 sm:py-28">
        <div className="dotted pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -left-24 bottom-10 h-72 w-72 animate-blob bg-accent-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6">
          <SectionHeading
            tone="light"
            eyebrow="Parent & student voices"
            title="Hear it from families in Surat"
            lead="Don't just take our word for it — these are real notes from parents and students across the city."
          />
          <div className="mx-auto mt-14 max-w-3xl">
            <Testimonials />
          </div>
        </div>
      </section>

      {/* tutor CTA */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-900/10 bg-gradient-to-br from-white via-brand-50 to-accent-100 p-9 sm:p-14">
              <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 animate-spin-slow rounded-full border-[18px] border-dashed border-accent-300/40" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_auto]">
                <div>
                  <Eyebrow>For tutors</Eyebrow>
                  <h2 className="mt-5 max-w-2xl text-balance font-display text-[2rem] leading-tight text-brand-900 sm:text-[2.6rem]">
                    Teach with us. Get matched to students near you.
                  </h2>
                  <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-ink/65">
                    Register once, clear our four-stage screening, and receive one-to-one
                    home and online assignments in your locality, subject and class range.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <PrimaryButton href="/tutors">Register as a tutor</PrimaryButton>
                  <GhostButton href="/how-it-works">See how matching works</GhostButton>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* faq */}
      <section className="relative bg-sand py-20 sm:py-28" id="faq">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            eyebrow="Questions parents ask"
            title="Frequently asked questions"
            lead="Still unsure? Call us and speak to an academic coordinator, not a call-centre agent."
          />
          <Reveal delay={150} className="mt-12">
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* final CTA */}
      <section className="relative overflow-hidden bg-brand-900 py-20 text-white sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,122,24,0.32),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(51,129,251,0.35),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <Eyebrow tone="light">Free demo lecture</Eyebrow>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 text-balance font-display text-[2.2rem] leading-tight sm:text-[3rem]">
              Book a free demo lecture with us
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto mt-5 max-w-2xl text-[1.02rem] leading-relaxed text-white/70">
              Fill out a short form about your child&apos;s needs, pick a date and time that
              suits you, and meet a screened tutor — with zero obligation.
            </p>
          </Reveal>
          <Reveal delay={250}>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <PrimaryButton href="/book-demo">Book my free demo</PrimaryButton>
              <GhostButton href="/contact" tone="light">
                Talk to a coordinator
              </GhostButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
