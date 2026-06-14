import { motion } from 'framer-motion'
import { revealStagger, revealItem } from '../styles/tokens'

// Honest capability band (no fabricated metrics) — what Manaracode builds.
const capabilities = [
  { title: 'Web', desc: 'Apps, dashboards & sites' },
  { title: 'Mobile', desc: 'iOS, Android & cross-platform' },
  { title: 'APIs', desc: 'Services & integrations' },
  { title: 'Cloud', desc: 'DevOps, hosting & scaling' },
]

export default function Stats() {
  // Capability band: a tight lead-in to Services (same surface), so the two read
  // as one "what we build" block rather than two sections with a gap between.
  return (
    <section id="about" aria-label="What Manaracode builds" className="pt-24 pb-8 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={revealStagger()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4"
        >
          {capabilities.map((c) => (
            <motion.div key={c.title} variants={revealItem} className="text-center">
              <p className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-2">{c.title}</p>
              <p className="text-muted text-sm font-medium">{c.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
