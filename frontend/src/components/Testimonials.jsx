import { motion } from 'framer-motion'
import { ShieldCheck, Workflow, Clock, KeyRound } from 'lucide-react'
import { reveal, revealStagger, revealItem } from '../styles/tokens'

// Honest "what you can expect" principles (true of every engagement) — replaces
// the previous placeholder client testimonials. Reinstate a real testimonials
// section here once there are verifiable client quotes to show.
const principles = [
  { Icon: ShieldCheck, title: 'Clean, tested code', desc: 'Typed, reviewed, and covered by tests before it ships.' },
  { Icon: Workflow, title: 'Transparent process', desc: 'Clear scope, regular check-ins, and no surprises.' },
  { Icon: Clock, title: 'Fast response', desc: 'We get back to you within 24 hours — every time.' },
  { Icon: KeyRound, title: 'No lock-in', desc: 'You own the code and the infrastructure, start to finish.' },
]

export default function Testimonials() {
  return (
    <section aria-labelledby="expect-heading" className="py-24 px-4 sm:px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div {...reveal} className="mb-16">
          <h2 id="expect-heading" className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-5">
            What you can expect
          </h2>
          <p className="text-lg text-muted max-w-xl">
            How we work with every client, on every project.
          </p>
        </motion.div>

        <motion.div
          variants={revealStagger()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {principles.map(({ Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={revealItem}
              className="bg-surface rounded-2xl p-8 shadow-sm border border-border"
            >
              <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center mb-6">
                <Icon className="w-6 h-6 text-accent" aria-hidden="true" />
              </div>
              <h3 className="font-heading text-lg font-bold text-fg mb-2">{title}</h3>
              <p className="text-muted text-base leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
