import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import { GhostButton, PageHero, PrimaryButton, SectionHeading } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";
import { AREAS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Service Areas in Surat",
  description:
    "ShikshaSetu provides home tuition across Vesu, Adajan, City Light, Pal, Athwa, Piplod, Althan, Varachha, Katargam, Dumas, Nanpura and Bhatar in Surat.",
};

const AREA_NOTES: Record<string, { blurb: string; schools: string }> = {
  Vesu: {
    blurb: "Our densest tutor cluster — same-week demo slots are almost always available.",
    schools: "DPS, Fountainhead, Bright Day",
  },
  Adajan: {
    blurb: "Strong GSEB and CBSE panel with Gujarati and English medium tutors.",
    schools: "L.P. Savani, Ryan International",
  },
  "City Light": {
    blurb: "Popular for Class 11–12 Science and Commerce specialists.",
    schools: "Lourdes Convent, S.D. Jain",
  },
  Pal: {
    blurb: "Evening slots from 5 PM onwards fill fastest here — book early.",
    schools: "Tapti Valley, Jeevan Bharti",
  },
  Athwa: {
    blurb: "Central location, so tutors reach on time even on weekdays.",
    schools: "The Galaxy School, Sarvajanik",
  },
  Piplod: {
    blurb: "Board-year students are our biggest group in this area.",
    schools: "Delhi Public School, Nalanda",
  },
  Althan: {
    blurb: "Great availability for Classes 1–8 foundation tutoring.",
    schools: "P.P. Savani, Aditya Birla",
  },
  Varachha: {
    blurb: "Large Gujarati-medium GSEB panel with strong Maths and Science tutors.",
    schools: "Shree Swaminarayan, J.H. Ambani",
  },
  Katargam: {
    blurb: "Affordable group-of-two home tuition also available on request.",
    schools: "Sanskardham, Vidyakunj",
  },
  Dumas: {
    blurb: "Slightly longer travel, so we prioritise tutors who live nearby.",
    schools: "Little Flower, Podar",
  },
  Nanpura: {
    blurb: "Heritage school belt — ICSE answer-writing specialists available.",
    schools: "St. Xavier's, Seventh Day",
  },
  Bhatar: {
    blurb: "Strong Commerce stream panel for Accounts and Statistics.",
    schools: "Shree Ram Krishna, Vidya Bharti",
  },
};

export default function AreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Service areas"
        title={
          <>
            Home tuition across <span className="text-gradient">12 Surat localities</span>
          </>
        }
        lead="We match tutors who live close to you. Short travel means punctual sessions, fewer cancellations and a teacher who understands your child's school."
      >
        <PrimaryButton href="/book-demo">Check availability in my area</PrimaryButton>
        <GhostButton href="/contact" tone="light">
          My area is not listed
        </GhostButton>
      </PageHero>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((area, i) => {
              const note = AREA_NOTES[area];
              return (
                <Reveal key={area} delay={i * 55}>
                  <article className="card-hover group relative h-full overflow-hidden rounded-[1.5rem] border border-brand-900/10 bg-white p-7">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-50 transition-transform duration-700 group-hover:scale-150" />
                    <div className="relative">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-900 text-gold">
                        <Icon name="location" className="h-5 w-5" />
                      </span>
                      <h2 className="mt-5 font-display text-[1.35rem] text-brand-900">
                        Tuition in {area}
                      </h2>
                      <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink/62">
                        {note.blurb}
                      </p>
                      <p className="mt-4 text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-ink/40">
                        Nearby schools
                      </p>
                      <p className="mt-1 text-[0.86rem] text-brand-800">{note.schools}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-sand py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Beyond Surat"
            title="Live online tuition, anywhere"
            lead="Same screened tutors, same learning plan, delivered one-to-one over video with a digital whiteboard and shared notes."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {([
              ["whiteboard", "Digital whiteboard", "Every derivation and solution is saved and shared after class."],
              ["video", "Recorded doubt sessions", "Revisit tricky explanations any time before a test."],
              ["signal", "Low-bandwidth friendly", "Audio-first mode keeps class running on a weak connection."],
            ] as [IconName, string, string][]).map(([icon, title, text], i) => (
              <Reveal key={title} delay={i * 80}>
                <div className="card-hover h-full rounded-[1.5rem] border border-brand-900/10 bg-white p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-[1.15rem] text-brand-900">{title}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink/62">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
