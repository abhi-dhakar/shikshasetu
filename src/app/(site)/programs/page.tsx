import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/reveal";
import Faq from "@/components/faq";
import { GhostButton, PageHero, PrimaryButton, SectionHeading } from "@/components/ui";
import { Icon } from "@/components/icons";
import { BOARDS, PROGRAMS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Programs — Classes 1 to 12",
  description:
    "Home and online tuition programs for Classes 1–8, 9–10 and 11–12 Science, Commerce and Humanities across GSEB, CBSE, ICSE and NCERT in Surat.",
};

const BOARD_NOTES: Record<string, string> = {
  GSEB: "Gujarat board pattern, Gujarati and English medium, with GSEB blueprint-based paper practice.",
  CBSE: "NCERT-aligned teaching with competency-based questions, case studies and sample paper drills.",
  ICSE: "Detailed answer writing, project support and ICSE-specific reference books.",
  "NCERT Based": "Chapter-by-chapter NCERT coverage with back-exercise mastery and exemplar problems.",
  Other: "IB, IGCSE and state boards handled case by case — tell us your syllabus and we will match a specialist.",
};

const SUBJECTS_BY_STAGE = [
  {
    stage: "Classes 1 – 5",
    subjects: ["Maths", "EVS", "English", "Gujarati", "Hindi", "Reading & handwriting"],
  },
  {
    stage: "Classes 6 – 8",
    subjects: ["Maths", "Science", "Social Science", "English", "Gujarati", "Sanskrit"],
  },
  {
    stage: "Classes 9 – 10",
    subjects: ["Maths", "Science", "Social Science", "English", "Gujarati", "Sanskrit"],
  },
  {
    stage: "Classes 11 – 12 Science",
    subjects: ["Physics", "Chemistry", "Biology", "Maths", "English", "Computer Science"],
  },
  {
    stage: "Classes 11 – 12 Commerce",
    subjects: ["Accountancy", "Business Admin", "Economics", "Statistics", "English"],
  },
  {
    stage: "Classes 11 – 12 Humanities",
    subjects: ["History", "Political Science", "Geography", "Psychology", "Sociology", "English"],
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs & exam categories"
        title={
          <>
            One-to-one programs for every stage from{" "}
            <span className="text-gradient">Class 1 to Class 12</span>
          </>
        }
        lead="Whatever board your child follows and whichever stream they choose, we build the plan around the syllabus they are actually being tested on."
      >
        <PrimaryButton href="/book-demo">Book a free demo</PrimaryButton>
        <GhostButton href="/contact" tone="light">
          Ask about fees
        </GhostButton>
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {PROGRAMS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <article className="card-hover group relative h-full overflow-hidden rounded-[1.75rem] border border-brand-900/10 bg-white p-8">
                  <div
                    className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-to-br ${p.accent} opacity-10 transition-transform duration-700 group-hover:scale-150`}
                  />
                  <div className="relative">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-900 text-gold">
                      <Icon name={p.icon} className="h-6 w-6" />
                    </span>
                    <p className="mt-5 text-[0.66rem] font-bold uppercase tracking-[0.2em] text-ink/45">
                      {p.eyebrow}
                    </p>
                    <h2 className="mt-2 font-display text-[1.7rem] text-brand-900">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/65">
                      {p.blurb}
                    </p>
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
                      className="underline-swipe mt-7 inline-flex items-center gap-2 text-[0.88rem] font-bold text-brand-900"
                    >
                      Request this program <Icon name="arrowRight" className="h-4 w-4" />
                    </Link>
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
            eyebrow="Subjects covered"
            title="Subject-wise coverage by stage"
            lead="Need a single subject or the full set? Both work — you only pay for what you take."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SUBJECTS_BY_STAGE.map((s, i) => (
              <Reveal key={s.stage} delay={i * 70}>
                <div className="card-hover h-full rounded-[1.5rem] border border-brand-900/10 bg-white p-7">
                  <h3 className="font-display text-[1.15rem] text-brand-900">{s.stage}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.subjects.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-full bg-brand-50 px-3 py-1.5 text-[0.8rem] font-semibold text-brand-800"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Boards supported"
            title="GSEB, CBSE, ICSE and NCERT — handled properly"
            lead="Different boards need different answer styles. Our tutors teach to the board your child will actually be examined on."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BOARDS.map((b, i) => (
              <Reveal key={b} delay={i * 70}>
                <div className="card-hover flex h-full flex-col rounded-[1.5rem] border border-brand-900/10 bg-white p-7">
                  <span className="inline-flex w-fit rounded-full bg-brand-900 px-4 py-1.5 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-white">
                    {b}
                  </span>
                  <p className="mt-5 text-[0.92rem] leading-relaxed text-ink/62">
                    {BOARD_NOTES[b]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading eyebrow="Good to know" title="Program questions" />
          <Reveal delay={130} className="mt-12">
            <Faq />
          </Reveal>
        </div>
      </section>
    </>
  );
}
