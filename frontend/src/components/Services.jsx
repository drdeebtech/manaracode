import { motion } from 'framer-motion'
import { Lightbulb, Code2, Settings, ArrowRight } from 'lucide-react'

const services = [
  {
    Icon: Lightbulb,
    title: 'Tech Solutions',
    description:
      'Strategic technology consulting and end-to-end implementation tailored to your business goals. We solve complex problems with scalable, future-proof tech.',
    tags: ['Consulting', 'Architecture', 'Strategy'],
    bg: 'bg-bg',
    iconBg: 'bg-accent-soft',
    iconColor: 'text-accent',
  },
  {
    Icon: Code2,
    title: 'Code Development',
    description:
      'Custom web applications, mobile apps, and APIs built with modern stacks. Clean code, fully tested, and shipped on time — every time.',
    tags: ['Web Apps', 'Mobile', 'APIs'],
    bg: 'bg-bg',
    iconBg: 'bg-accent-soft',
    iconColor: 'text-accent',
  },
  {
    Icon: Settings,
    title: 'Platform Management',
    description:
      'Full-cycle platform operations — deployment, monitoring, scaling, and ongoing support. We keep your systems running at peak performance.',
    tags: ['DevOps', 'Monitoring', 'Support'],
    bg: 'bg-success-soft',
    iconBg: 'bg-success-soft',
    iconColor: 'text-success',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-5">
            Services That Drive Growth
          </h2>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            From idea to production, we cover every layer of your technology stack with expertise and precision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map(({ Icon, title, description, tags, bg, iconBg, iconColor }, i) => (
            <motion.a
              key={title}
              href="#contact"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`${bg} block rounded-2xl p-8 group border border-transparent hover:border-border hover:shadow-lg hover:shadow-black/20 transition-opacity duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
            >
              <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-6`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="font-heading text-xl font-bold text-fg mb-3">{title}</h3>
              <p className="text-muted leading-relaxed mb-6 text-sm">{description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-surface text-muted text-xs font-medium rounded-full border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-accent">
                Learn more
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
