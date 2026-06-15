import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Stethoscope, Code2, Layers, ShieldCheck, ArrowRight } from 'lucide-react'
import PageMeta from '../components/PageMeta'
import StructuredData from '../components/StructuredData'
import { reveal, revealStagger, revealItem } from '../styles/tokens'

// ── Founder ────────────────────────────────────────────────────────────────
// The studio is founded and led by a practising physician. The founder's public
// name and portrait are intentionally left blank until the owner confirms them —
// nothing here is invented. Set `name` (and optionally `photo`) to render the
// byline + portrait; the page reads cleanly without them in the meantime.
const FOUNDER = Object.freeze({
  name: null, // e.g. 'Dr. Firstname Lastname'
  role: 'Founder & lead engineer · practising physician',
  photo: null, // e.g. '/founder.jpg' placed in frontend/public
})

// Engineering-first principles — how the studio actually works.
const principles = [
  {
    Icon: Code2,
    title: 'Engineering first',
    body: 'We are a software studio. Architecture, clean code, tests, and a production deploy you can rely on come before anything else, in every project we take.',
  },
  {
    Icon: Stethoscope,
    title: 'Clinical fluency',
    body: 'Our founder practises medicine. We read a clinical workflow the way a doctor lives it, so healthcare software fits the work instead of fighting it.',
  },
  {
    Icon: ShieldCheck,
    title: 'Built to be trusted',
    body: 'Security and privacy are designed in from the first commit: validated inputs, least-privilege access, and data handling that respects the people behind it.',
  },
]

// Healthcare capability described in the abstract — what we can build, not a
// roster of named clients, institutions, or patients.
const healthcareWork = [
  'Imaging and diagnostic-support tooling',
  'Scheduling and operations for clinics',
  'Patient-facing telemedicine experiences',
  'Privacy-aware handling of sensitive records',
]

export default function About() {
  return (
    <>
      <PageMeta path="/about" scrollTop />
      <StructuredData path="/about" />
      <main id="main" className="min-h-screen pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* ── Lede ── the one thesis, stated plainly. */}
          <motion.header variants={revealStagger(0.1)} initial="hidden" animate="show" className="mb-20">
            <motion.p variants={revealItem} className="text-sm font-semibold text-accent mb-5">
              About manaracode
            </motion.p>
            <motion.h1
              variants={revealItem}
              className="font-heading font-bold text-fg tracking-tight leading-[1.05] text-balance mb-6 text-[clamp(2.5rem,1.1rem+5vw,4.5rem)]"
            >
              A software studio.
              <br />
              <span className="text-accent">Healthcare is our edge.</span>
            </motion.h1>
            <motion.p variants={revealItem} className="text-lg text-muted leading-relaxed max-w-2xl">
              manaracode builds production web, mobile, and cloud platforms across industries.
              We are founded and led by a practising physician — so when the work is medical,
              we understand it from the inside, not from a brief.
            </motion.p>
          </motion.header>

          {/* ── The studio ── generalist first, so the healthcare edge reads as
              depth rather than a niche. */}
          <motion.section {...reveal} aria-labelledby="studio-heading" className="mb-20 max-w-3xl">
            <h2 id="studio-heading" className="font-heading text-3xl lg:text-4xl font-bold text-fg mb-5">
              Generalists who go deep
            </h2>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                Most of what we ship is ordinary, in the best sense: dashboards, APIs, mobile
                apps, and the cloud infrastructure underneath them. We work across industries
                because good engineering travels — the same rigour that keeps a fintech ledger
                honest keeps a clinic&rsquo;s records safe.
              </p>
              <p>
                What sets us apart is where that rigour meets medicine. One founder writes the
                code and sees patients, which is a rare pair of lenses to point at the same
                problem. It is why healthcare is the work we do best.
              </p>
            </div>
          </motion.section>

          {/* ── The healthcare edge ── featured panel, the differentiator. */}
          <motion.section
            {...reveal}
            aria-labelledby="edge-heading"
            className="mb-20 rounded-3xl border border-border bg-surface p-8 sm:p-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-2xl bg-accent-soft">
                <Stethoscope className="w-6 h-6 text-accent" aria-hidden="true" />
              </span>
              <h2 id="edge-heading" className="font-heading text-2xl lg:text-3xl font-bold text-fg">
                The healthcare edge
              </h2>
            </div>
            <p className="text-muted leading-relaxed max-w-2xl mb-8">
              Clinical software fails when it is built for the chart instead of the clinician.
              Because our founder lives both roles, we design for the realities of a shift:
              interruptions, handovers, and the cost of one more click. We build, among other
              things:
            </p>
            <motion.ul
              variants={revealStagger()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {healthcareWork.map((item) => (
                <motion.li
                  key={item}
                  variants={revealItem}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-bg p-4"
                >
                  <Layers className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-fg text-sm font-medium leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            <p className="text-sm text-muted leading-relaxed mt-6">
              We describe this work in the abstract on purpose: clinical engagements stay
              confidential, and patient data never leaves the systems it belongs to.
            </p>
          </motion.section>

          {/* ── Principles ── how we work. */}
          <motion.section {...reveal} aria-labelledby="principles-heading" className="mb-20">
            <h2 id="principles-heading" className="font-heading text-3xl lg:text-4xl font-bold text-fg mb-10">
              How we work
            </h2>
            <motion.div
              variants={revealStagger()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {principles.map(({ Icon, title, body }) => (
                <motion.div
                  key={title}
                  variants={revealItem}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-accent-soft mb-5">
                    <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-lg font-bold text-fg mb-2">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{body}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* ── Founder ── narrative reads cleanly with no name; byline + portrait
              render only once FOUNDER.name / FOUNDER.photo are filled in. */}
          <motion.section
            {...reveal}
            aria-labelledby="founder-heading"
            className="mb-20 rounded-3xl border border-border bg-surface p-8 sm:p-12"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-8">
              {FOUNDER.photo && (
                <img
                  src={FOUNDER.photo}
                  loading="lazy"
                  alt={FOUNDER.name ? `${FOUNDER.name}, ${FOUNDER.role}` : 'Founder of manaracode'}
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-full object-cover border border-border shrink-0"
                />
              )}
              <div>
                <h2 id="founder-heading" className="font-heading text-2xl lg:text-3xl font-bold text-fg mb-3">
                  The person behind it
                </h2>
                <p className="text-muted leading-relaxed max-w-2xl mb-4">
                  manaracode is led by a software engineer who is also a practising physician.
                  That double career is not a footnote — it is the reason the studio exists, and
                  the lens we bring to every brief, medical or not.
                </p>
                {FOUNDER.name ? (
                  <p className="text-sm text-fg font-semibold">
                    {FOUNDER.name}
                    <span className="block text-muted font-normal">{FOUNDER.role}</span>
                  </p>
                ) : (
                  <p className="text-sm text-muted">{FOUNDER.role}</p>
                )}
              </div>
            </div>
          </motion.section>

          {/* ── CTA ── back into the funnel. */}
          <motion.section
            {...reveal}
            aria-labelledby="about-cta-heading"
            className="rounded-3xl border border-border bg-bg p-8 sm:p-12 text-center"
          >
            <h2 id="about-cta-heading" className="font-heading text-2xl lg:text-3xl font-bold text-fg mb-3">
              Have a project in mind?
            </h2>
            <p className="text-muted leading-relaxed max-w-xl mx-auto mb-8">
              Whether it is a clinical platform or something with nothing to do with medicine,
              tell us what you are building and we will tell you how we would approach it.
            </p>
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] bg-accent-warm text-on-accent text-sm font-semibold rounded-xl transition-opacity duration-200 hover:opacity-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Start a conversation
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.section>

        </div>
      </main>
    </>
  )
}
