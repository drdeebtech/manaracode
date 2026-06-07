import { motion } from 'framer-motion'
import { Search, Map, Hammer, Rocket } from 'lucide-react'
import { reveal, revealStagger, revealItem } from '../styles/tokens'

const steps = [
  {
    Icon: Search,
    title: 'Discover',
    description:
      'We deeply understand your business, goals, and challenges through structured discovery sessions.',
  },
  {
    Icon: Map,
    title: 'Plan',
    description:
      'We design the architecture, roadmap, and technical specs before writing a single line of code.',
  },
  {
    Icon: Hammer,
    title: 'Build',
    description:
      'Our engineers develop, test, and iterate in tight sprints with full transparency at every step.',
  },
  {
    Icon: Rocket,
    title: 'Launch',
    description:
      'We deploy, monitor, and support your platform through launch and every milestone beyond.',
  },
]

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-heading" className="py-24 px-4 sm:px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div {...reveal} className="mb-16">
          <h2 id="process-heading" className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-5">
            Our Process
          </h2>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            A transparent, repeatable framework that consistently delivers exceptional results.
          </p>
        </motion.div>

        {/* Vertical timeline: a real ordered sequence (so the numbers earn their
            place). A rail runs through the node centers; steps stack naturally on
            every breakpoint. */}
        <div className="relative max-w-3xl">
          <div className="absolute left-8 top-8 bottom-8 w-px bg-border" aria-hidden="true" />
          <motion.ol
            variants={revealStagger()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-10"
          >
            {steps.map(({ Icon, title, description }, i) => (
              <motion.li
                key={title}
                variants={revealItem}
                className="relative flex items-start gap-6"
              >
                <div className="relative z-10 inline-flex shrink-0 items-center justify-center w-16 h-16 bg-surface border-2 border-border rounded-2xl shadow-sm">
                  <Icon className="w-7 h-7 text-accent" aria-hidden="true" />
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-accent text-on-accent text-xs font-bold rounded-full flex items-center justify-center font-heading">
                    {i + 1}
                  </span>
                </div>
                <div className="pt-2">
                  <h3 className="font-heading text-lg font-bold text-fg mb-2">{title}</h3>
                  <p className="text-muted text-sm leading-relaxed max-w-prose">{description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
