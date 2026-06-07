import { motion } from 'framer-motion'
import { Lightbulb, Code2, Settings, ArrowRight } from 'lucide-react'
import { reveal, revealStagger, revealItem } from '../styles/tokens'

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
        <motion.div {...reveal} className="mb-16">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-5">
            Services That Drive Growth
          </h2>
          <p className="text-lg text-muted max-w-2xl leading-relaxed">
            From idea to production, we cover every layer of your technology stack with expertise and precision.
          </p>
        </motion.div>

        {/* Bento: the first service is featured (spans 2 cols + 2 rows on lg);
            the other two stack in the third column. Stacks to one column below lg. */}
        {/* Bento: first service is a full-width featured card with a horizontal
            interior (so it fills the width, no empty void); the other two sit
            below in two columns. Stacks to one column below lg. */}
        <motion.div
          variants={revealStagger()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {services.map(({ Icon, title, description, tags, bg, iconBg, iconColor }, i) => {
            const featured = i === 0
            return (
              <motion.a
                key={title}
                href="#contact"
                variants={revealItem}
                whileHover={{ y: -6 }}
                className={`${bg} flex flex-col p-8 group border border-transparent hover:border-border hover:shadow-lg hover:shadow-black/20 transition-opacity duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  featured ? 'rounded-3xl lg:col-span-2 lg:flex-row lg:items-center lg:gap-10' : 'rounded-2xl'
                }`}
              >
                <div className={featured ? 'lg:w-2/5 lg:shrink-0' : ''}>
                  <div className={`${featured ? 'w-14 h-14' : 'w-12 h-12'} ${iconBg} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className={`${featured ? 'w-7 h-7' : 'w-6 h-6'} ${iconColor}`} />
                  </div>
                  <h3 className={`font-heading font-bold text-fg mb-3 ${featured ? 'text-2xl lg:text-3xl lg:mb-0' : 'text-xl'}`}>
                    {title}
                  </h3>
                </div>
                <div className={featured ? 'lg:flex-1' : ''}>
                  <p className="text-muted leading-relaxed mb-6 text-base">{description}</p>
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
                </div>
              </motion.a>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
