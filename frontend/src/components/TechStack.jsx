import { motion } from 'framer-motion'
import { reveal } from '../styles/tokens'

const row1 = [
  { name: 'React',      color: '#61DAFB', bg: '#E8F9FD' },
  { name: 'TypeScript', color: '#3178C6', bg: '#EBF3FB' },
  { name: 'Node.js',    color: '#339933', bg: '#E8F5E9' },
  { name: 'Python',     color: '#3776AB', bg: '#EBF3FB' },
  { name: 'Next.js',    color: '#111827', bg: '#F3F4F6' },
  { name: 'PostgreSQL', color: '#336791', bg: '#EBF3FB' },
]

const row2 = [
  { name: 'Docker',     color: '#2496ED', bg: '#EBF7FF' },
  { name: 'AWS',        color: '#FF9900', bg: '#FFF8E7' },
  { name: 'MongoDB',    color: '#47A248', bg: '#E8F5E9' },
  { name: 'Redis',      color: '#DC382D', bg: '#FDECEA' },
  { name: 'GraphQL',    color: '#E10098', bg: '#FCE4F3' },
  { name: 'Linux',      color: '#D48806', bg: '#FFFBE6' },
]

function Badge({ name, color }) {
  return (
    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-neutral-soft shadow-sm whitespace-nowrap mx-3 flex-shrink-0">
      {/* Brand-colored dot stays; the chip surface is a theme token so the
          near-white label is readable in dark (hardcoded light bg was invisible). */}
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-sm font-semibold text-fg">{name}</span>
    </div>
  )
}

function MarqueeRow({ items, direction = 'left' }) {
  const doubled = [...items, ...items]
  const cls = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
  return (
    <div className="overflow-hidden">
      <div className={`flex ${cls}`}>
        {doubled.map((item, i) => (
          <Badge key={`${item.name}-${i}`} {...item} />
        ))}
      </div>
    </div>
  )
}

export default function TechStack() {
  return (
    <section aria-labelledby="techstack-heading" className="py-16 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
        <motion.div {...reveal}>
          <h2 id="techstack-heading" className="font-heading text-3xl lg:text-4xl font-bold text-fg">
            Technologies We Master
          </h2>
        </motion.div>
      </div>

      <div className="space-y-4">
        <MarqueeRow items={row1} direction="left" />
        <MarqueeRow items={row2} direction="right" />
      </div>
    </section>
  )
}
