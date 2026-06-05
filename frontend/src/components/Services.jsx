import { motion } from 'framer-motion'
import { Lightbulb, Code2, Settings, ArrowRight } from 'lucide-react'

const services = [
  {
    Icon: Lightbulb,
    title: 'Tech Solutions',
    description:
      'Strategic technology consulting and end-to-end implementation tailored to your business goals. We solve complex problems with scalable, future-proof tech.',
    tags: ['Consulting', 'Architecture', 'Strategy'],
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    Icon: Code2,
    title: 'Code Development',
    description:
      'Custom web applications, mobile apps, and APIs built with modern stacks. Clean code, fully tested, and shipped on time — every time.',
    tags: ['Web Apps', 'Mobile', 'APIs'],
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    Icon: Settings,
    title: 'Platform Management',
    description:
      'Full-cycle platform operations — deployment, monitoring, scaling, and ongoing support. We keep your systems running at peak performance.',
    tags: ['DevOps', 'Monitoring', 'Support'],
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-blue-500 tracking-widest uppercase mb-3 block">
            What We Do
          </span>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-blue-900 mb-5">
            Services That Drive Growth
          </h2>
          <p className="text-lg text-blue-700/70 max-w-2xl mx-auto leading-relaxed">
            From idea to production, we cover every layer of your technology stack with expertise and precision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map(({ Icon, title, description, tags, bg, iconBg, iconColor }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`${bg} rounded-2xl p-8 group border border-transparent hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer`}
            >
              <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-6`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="font-heading text-xl font-bold text-blue-900 mb-3">{title}</h3>
              <p className="text-blue-700/70 leading-relaxed mb-6 text-sm">{description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-white/80 text-blue-700 text-xs font-medium rounded-full border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all duration-200">
                Learn more <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
