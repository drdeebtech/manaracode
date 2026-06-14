import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { reveal, revealStagger, revealItem } from '../styles/tokens'
import { publicProjects } from '../content/projects'

// Proof-of-work teaser placed right before the contact ask: a visitor sees real,
// shipped products before being asked to start a conversation. The full set
// (including the confidential clinical work) lives at /work.
export default function WorkTeaser() {
  return (
    <section id="work" aria-labelledby="work-teaser-heading" className="py-24 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div {...reveal} className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <h2 id="work-teaser-heading" className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-5">
              Things we&rsquo;ve shipped
            </h2>
            <p className="text-lg text-muted max-w-xl leading-relaxed">
              Real products you can open right now. Clinical platforms stay under NDA.
            </p>
          </div>
          <Link
            to="/work"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-fg transition-opacity duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          >
            See all our work
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>

        <motion.div
          variants={revealStagger()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3"
        >
          {publicProjects.map(({ Icon, title, tags, body, href, linkLabel }) => (
            <motion.a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              variants={revealItem}
              whileHover={{ y: -6 }}
              className="group flex flex-col rounded-2xl border border-border bg-bg p-6 transition-opacity duration-300 hover:border-accent cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                    className="px-2.5 py-1 bg-surface text-muted text-xs font-medium rounded-full border border-border"
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
      </div>
    </section>
  )
}
