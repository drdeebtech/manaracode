import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ScanLine,
  CalendarClock,
  Video,
  ArrowUpRight,
  ArrowRight,
  Lock,
} from 'lucide-react'
import PageMeta from '../components/PageMeta'
import { publicProjects } from '../content/projects'
import { reveal, revealStagger, revealItem } from '../styles/tokens'

// Clinical engagements are confidential — described by capability only, never by
// client, institution, or patient. No names, no metrics, nothing identifying.
const healthcareWork = [
  {
    Icon: ScanLine,
    title: 'Clinical imaging & diagnostics',
    body: 'Imaging and diagnostic-support tools that bring the right data together at the point of decision.',
  },
  {
    Icon: CalendarClock,
    title: 'Scheduling & operations',
    body: 'Scheduling and operational tooling shaped around real surgical and clinic workflows.',
  },
  {
    Icon: Video,
    title: 'Telemedicine',
    body: 'Patient-facing telemedicine experiences, built around how clinicians actually work.',
  },
]

export default function Work() {
  return (
    <>
      <PageMeta path="/work" scrollTop />
      <main id="main" className="min-h-screen pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">

          {/* ── Lede ── */}
          <motion.header variants={revealStagger(0.1)} initial="hidden" animate="show" className="mb-20">
            <motion.p variants={revealItem} className="text-sm font-semibold text-accent mb-5">
              Our work
            </motion.p>
            <motion.h1
              variants={revealItem}
              className="font-heading font-bold text-fg tracking-tight leading-[1.05] text-balance mb-6 text-[clamp(2.5rem,1.1rem+5vw,4.5rem)]"
            >
              Things we&rsquo;ve shipped.
            </motion.h1>
            <motion.p variants={revealItem} className="text-lg text-muted leading-relaxed max-w-2xl">
              Some of our work you can open right now. The rest is clinical, and stays
              confidential — so we describe it by what it does, not who it is for.
            </motion.p>
          </motion.header>

          {/* ── Public projects ── named, real, linkable. */}
          <motion.section {...reveal} aria-labelledby="public-heading" className="mb-24">
            <h2 id="public-heading" className="font-heading text-2xl lg:text-3xl font-bold text-fg mb-2">
              Open to the public
            </h2>
            <p className="text-muted leading-relaxed max-w-2xl mb-10">
              Products and tools anyone can try — the quickest way to see how we build.
            </p>
            <motion.div
              variants={revealStagger()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {publicProjects.map(({ Icon, title, tags, body, href, linkLabel }) => (
                <motion.a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={revealItem}
                  whileHover={{ y: -6 }}
                  className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-opacity duration-300 hover:border-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-accent-soft mb-5">
                    <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-lg font-bold text-fg mb-2">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed mb-5 flex-1">{body}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-bg text-muted text-xs font-medium rounded-full border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
                    {linkLabel}
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </motion.a>
              ))}
            </motion.div>
          </motion.section>

          {/* ── Healthcare (confidential) ── anonymized capability, no clients. */}
          <motion.section {...reveal} aria-labelledby="healthcare-heading" className="mb-24">
            <div className="flex items-center gap-3 mb-2">
              <h2 id="healthcare-heading" className="font-heading text-2xl lg:text-3xl font-bold text-fg">
                Healthcare, under NDA
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-soft border border-border text-xs font-medium text-muted">
                <Lock className="w-3 h-3" aria-hidden="true" />
                Confidential
              </span>
            </div>
            <p className="text-muted leading-relaxed max-w-2xl mb-10">
              A growing share of our work is clinical. These engagements are confidential, so we
              describe them by capability — never by client, institution, or patient.
            </p>
            <motion.div
              variants={revealStagger()}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {healthcareWork.map(({ Icon, title, body }) => (
                <motion.div
                  key={title}
                  variants={revealItem}
                  className="flex flex-col rounded-2xl border border-border bg-surface p-6"
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

          {/* ── CTA ── */}
          <motion.section
            {...reveal}
            aria-labelledby="work-cta-heading"
            className="rounded-3xl border border-border bg-bg p-8 sm:p-12 text-center"
          >
            <h2 id="work-cta-heading" className="font-heading text-2xl lg:text-3xl font-bold text-fg mb-3">
              Want to see what we&rsquo;d build for you?
            </h2>
            <p className="text-muted leading-relaxed max-w-xl mx-auto mb-8">
              Tell us about your project — public product or clinical platform — and we will tell
              you how we would approach it.
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
