import type { Metadata } from "next";
import Image from "next/image";
import TutorForm from "@/components/tutor-form";
import Reveal from "@/components/reveal";
import { PageHero, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";
import { SCREENING } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Become a Tutor",
  description:
    "Register as a home or online tutor with ShikshaSetu Surat. Teach Classes 1–12 across GSEB, CBSE, ICSE and NCERT in your own locality.",
};

const PERKS = [
  {
    icon: "location" as const,
    title: "Assignments near you",
    text: "We match by locality first, so you spend time teaching instead of commuting across Surat.",
  },
  {
    icon: "wallet" as const,
    title: "Transparent payouts",
    text: "Fees agreed upfront per subject and per session. Monthly settlement, no surprise deductions.",
  },
  {
    icon: "kit" as const,
    title: "Ready teaching kit",
    text: "Syllabus maps, chapter tests and previous-year papers for GSEB, CBSE and ICSE.",
  },
  {
    icon: "schedule" as const,
    title: "Flexible schedule",
    text: "Tell us your available days and hours. We never assign outside your declared window.",
  },
];

export default function TutorsPage() {
  return (
    <>
      <PageHero
        eyebrow="For tutors"
        title={
          <>
            Teach one-to-one. Grow with{" "}
            <span className="text-gradient">ShikshaSetu Surat</span>.
          </>
        }
        lead="We are always looking for subject-strong, patient teachers for Classes 1–12 across Vesu, Adajan, City Light, Pal, Athwa, Piplod, Althan, Varachha, Katargam, Dumas, Nanpura and Bhatar."
      />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <article className="card-hover h-full rounded-[1.5rem] border border-brand-900/10 bg-white p-7">
                  <span className="grid h-13 w-13 place-items-center rounded-2xl bg-brand-50 text-brand-700">
                    <Icon name={p.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-[1.15rem] text-brand-900">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink/62">
                    {p.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20">
          <Reveal direction="left">
            <div className="overflow-hidden rounded-[2rem] border border-brand-900/10 shadow-[var(--shadow-soft)]">
              <Image
                src="/images/tutor-screening.png"
                alt="Tutor being interviewed by the ShikshaSetu academic team"
                width={900}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Screening process"
              title="What you will clear before your first assignment"
              lead="It takes about a week. Parents trust us because of it, and it is why our tutors get repeat referrals."
            />
            <div className="mt-8 space-y-4">
              {SCREENING.map((s, i) => (
                <Reveal key={s.title} delay={i * 90}>
                  <div className="flex gap-4 rounded-2xl border border-brand-900/10 bg-white p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-900 text-[0.8rem] font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-[1.05rem] text-brand-900">
                        {s.title}
                      </h3>
                      <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink/62">
                        {s.text}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" id="register">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            eyebrow="Tutor registration"
            title="Register in under three minutes"
            lead="Fill this once — we will call you to schedule the subject test and mock teaching round."
          />
          <Reveal delay={150} className="mt-12">
            <TutorForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
