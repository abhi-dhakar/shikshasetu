import type { Metadata } from "next";
import Image from "next/image";
import Counter from "@/components/counter";
import Reveal from "@/components/reveal";
import Testimonials from "@/components/testimonials";
import { GhostButton, PageHero, PrimaryButton, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";
import { STATS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "ShikshaSetu Surat is a home and online tuition service connecting parents and students of Classes 1–12 with screened, local tutors across Surat, Gujarat.",
};

const VALUES = [
  {
    icon: "verify" as const,
    title: "Verify before we promise ok",
    text: "We would rather tell a parent we have no tutor this week than send an unverified one.",
  },
  {
    icon: "compass" as const,
    title: "The child sets the pace",
    text: "Plans are built around where the student actually is, not where the syllabus says they should be.",
  },
  {
    icon: "feedback" as const,
    title: "Parents stay informed",
    text: "Monthly reports, test scores and honest feedback — including when things are not improving.",
  },
  {
    icon: "fair" as const,
    title: "Fair to tutors too",
    text: "Clear payouts and respect for teachers' time is what keeps good tutors on our panel.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About ShikshaSetu"
        title={
          <>
            A bridge between good teachers and{" "}
            <span className="text-gradient">the students who need them</span>
          </>
        }
        lead="ShikshaSetu means 'a bridge to learning'. We started in Surat because parents kept asking the same question — where do I find a tutor I can actually trust with my child?"
      >
        <PrimaryButton href="/book-demo">Book a free demo</PrimaryButton>
        <GhostButton href="/tutors" tone="light">
          Teach with us
        </GhostButton>
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="left">
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-900/10 shadow-[var(--shadow-soft)]">
              <Image
                src="/images/students-success.png"
                alt="Students in Surat celebrating their exam results"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our story"
              title="Built in Surat, for Surat families"
              lead="We are a home and online tuition service for Classes 1 to 12 across GSEB, CBSE, ICSE and NCERT syllabi — with a tutor panel we screen ourselves."
            />
            <Reveal delay={200}>
              <div className="mt-7 space-y-4 text-[0.97rem] leading-relaxed text-ink/68">
                <p>
                  Most tuition hunts in Surat still happen over society WhatsApp groups.
                  Parents get a phone number, no verification, no trial, and no way to
                  compare. When it does not work out, three months are already gone.
                </p>
                <p>
                  ShikshaSetu changes that with one simple rule: you should never pay for a
                  tutor you have not seen teach. Every family gets a free demo lecture with
                  a tutor who has cleared identity, qualification, subject knowledge and
                  communication checks.
                </p>
                <p>
                  Today we serve twelve localities across the city — Vesu, Adajan, City
                  Light, Pal, Athwa, Piplod, Althan, Varachha, Katargam, Dumas, Nanpura and
                  Bhatar — plus live online tuition anywhere.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-brand-950 py-16 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="text-center">
              <p className="font-display text-[2.4rem] leading-none text-gold sm:text-[3rem]">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-[0.8rem] uppercase tracking-[0.14em] text-white/55">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four things we refuse to compromise on"
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="card-hover h-full rounded-[1.5rem] border border-brand-900/10 bg-white p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={v.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.12rem] text-brand-900">
                    {v.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink/62">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading eyebrow="Parent voices" title="What Surat families say" />
          <div className="mt-12">
            <Testimonials />
          </div>
        </div>
      </section>
    </>
  );
}
