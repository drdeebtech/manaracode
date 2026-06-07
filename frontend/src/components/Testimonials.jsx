import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  {
    quote:
      'Manaracode transformed our legacy platform into a modern, scalable system in just 3 months. Their attention to clean architecture is unmatched — every decision was deliberate and well-documented.',
    name: 'Ahmed Al-Rashid',
    role: 'CTO',
    company: 'FinanceFlow',
    initials: 'AA',
    color: 'bg-accent',
  },
  {
    quote:
      'The team delivered our e-commerce platform on time and within budget. They handled everything from architecture to deployment and kept us informed every step of the way.',
    name: 'Sarah Kim',
    role: 'Founder',
    company: 'ShopLux',
    initials: 'SK',
    color: 'bg-accent',
  },
  {
    quote:
      'Their DevOps expertise was a game-changer for us. Our deployment pipeline went from hours of manual work to a fully automated flow in under two weeks. Incredible team.',
    name: 'Marcus Johnson',
    role: 'VP Engineering',
    company: 'CloudOps',
    initials: 'MJ',
    color: 'bg-accent-warm',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-fg mb-5">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted max-w-xl">
            We measure success by the impact we create for the businesses we work with.
          </p>
        </motion.div>

        {/* Bento: the first testimonial is a full-width featured pull-quote with
            a horizontal interior (quote beside the author block, so it fills the
            width with no empty void); the other two sit below in two columns.
            Stacks to one column below lg. */}
        <div className="grid gap-6 lg:grid-cols-2">
          {testimonials.map(({ quote, name, role, company, initials, color }, i) => {
            const featured = i === 0
            return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`bg-surface rounded-2xl p-8 shadow-sm border border-border flex flex-col ${
                featured ? 'lg:col-span-2 lg:flex-row lg:items-center lg:gap-10' : ''
              }`}
            >
              <div className={featured ? 'lg:flex-1' : ''}>
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p
                  className={`leading-relaxed flex-1 ${
                    featured ? 'text-fg text-xl lg:text-2xl font-medium text-balance mb-0' : 'text-muted text-sm mb-6'
                  }`}
                >
                  "{quote}"
                </p>
              </div>

              {/* Author */}
              <div className={`flex items-center gap-3 ${featured ? 'lg:w-1/4 lg:shrink-0 mt-6 lg:mt-0' : ''}`}>
                <div className={`${featured ? 'w-12 h-12' : 'w-10 h-10'} ${color} rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-fg text-sm">{name}</p>
                  <p className="text-muted text-xs">{role}, {company}</p>
                </div>
              </div>
            </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
