import { motion } from 'framer-motion'
import { ShieldCheck, Workflow, Clock, KeyRound } from 'lucide-react'
import { reveal, revealStagger, revealItem } from '../styles/tokens'

// Honest "what you can expect" principles (true of every engagement) — replaces
// the previous placeholder client testimonials. Reinstate a real testimonials
// section here once there are verifiable client quotes to show.
const principles = [
  { Icon: ShieldCheck, title: 'Clean, tested code', desc: 'Typed, reviewed, and covered by tests before it ships.' },
  { Icon: Workflow, title: 'Transparent process', desc: 'Clear scope, regular check-ins, and no surprises.' },
  { Icon: Clock, title: 'Fast response', desc: 'We reply to every enquiry within 24 hours.' },
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

        {/* Editorial 2-up list, not a four-card clone grid: a hairline top rule
            sets the rhythm and the icon sits inline with the title, so this row
            reads distinctly from the filled Services bento above it. */}
        <motion.div
          variants={revealStagger()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-x-12 gap-y-10 sm:grid-cols-2"
        >
          {principles.map(({ Icon, title, desc }) => (
            <motion.div key={title} variants={revealItem} className="pt-6 border-t border-border">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                <h3 className="font-heading text-xl font-bold text-fg">{title}</h3>
              </div>
              <p className="text-muted text-base leading-relaxed max-w-md">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
