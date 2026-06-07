import { motion } from 'framer-motion'
import { revealStagger, revealItem } from '../styles/tokens'

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '30+', label: 'Happy Clients' },
  { value: '3+', label: 'Years of Experience' },
  { value: '99%', label: 'Client Satisfaction' },
]

export default function Stats() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={revealStagger()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={revealItem} className="text-center">
              <p className="font-heading text-5xl font-bold text-fg mb-2">{stat.value}</p>
              <p className="text-muted text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
