import { motion } from 'framer-motion'
import { Search, Map, Hammer, Rocket } from 'lucide-react'

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
    <section id="process" className="py-24 px-4 sm:px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-5">
            Our Process
          </h2>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            A transparent, repeatable framework that consistently delivers exceptional results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-border" />

          {steps.map(({ Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative text-center"
            >
              <div className="relative inline-flex items-center justify-center w-16 h-16 bg-surface border-2 border-border rounded-2xl mb-6 shadow-sm">
                <Icon className="w-7 h-7 text-accent" />
                <span className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center font-heading">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-fg mb-3">{title}</h3>
              <p className="text-muted text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
