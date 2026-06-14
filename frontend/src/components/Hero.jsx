import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui'
import { revealStagger, revealItem } from '../styles/tokens'

const codeLines = [
  { text: '$ manaracode init project', color: 'text-green-400' },
  { text: '✓ Analyzing requirements...', color: 'text-blue-300' },
  { text: '✓ Setting up architecture...', color: 'text-blue-300' },
  { text: '✓ Writing clean code...', color: 'text-blue-300' },
  { text: '✓ Running tests (100%)...', color: 'text-blue-300' },
  { text: '✓ Deploying to production!', color: 'text-green-400' },
  { text: '> Project ready 🚀', color: 'text-yellow-300' },
]

const scrollTo = (id) => () => {
  // Honor reduced-motion: the explicit `behavior:'smooth'` would otherwise
  // override the CSS `scroll-behavior:auto` reduced-motion guard.
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.querySelector(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
}

export default function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left ── one orchestrated reveal: the parent staggers its
              children instead of each element carrying a hand-tuned delay. */}
          <motion.div variants={revealStagger(0.1)} initial="hidden" animate="show">
            <motion.div
              variants={revealItem}
              className="inline-flex items-center gap-2 px-4 py-2 bg-success-soft border border-success rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-success rounded-full animate-pulse motion-reduce:animate-none" />
              <span className="text-sm font-medium text-success">Available for Projects</span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              variants={revealItem}
              className="font-heading font-bold text-fg tracking-tight leading-[1.04] text-balance mb-6 text-[clamp(2.75rem,1.2rem+5vw,5rem)]"
            >
              We build it.
              <br />
              We ship it.
              <br />
              <span className="text-accent">We run it.</span>
            </motion.h1>

            <motion.p
              variants={revealItem}
              className="text-lg text-muted leading-relaxed mb-8 max-w-lg text-pretty"
            >
              Web, mobile, APIs, and the cloud infrastructure they sit on, owned from the
              first commit through every release after launch.
            </motion.p>

            <motion.div variants={revealItem} className="flex flex-wrap gap-4 mb-10">
              <Button variant="webgl" size="lg" Icon={ArrowRight} onClick={scrollTo('#contact')}>
                Start Your Project
              </Button>
              <Button variant="secondary" size="lg" onClick={scrollTo('#services')}>
                Our Services
              </Button>
            </motion.div>

            <motion.div
              variants={revealItem}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted"
            >
              <span className="font-semibold text-fg">Full-stack delivery</span>
              <span aria-hidden="true">·</span>
              <span>web, mobile, APIs &amp; cloud</span>
            </motion.div>
          </motion.div>

          {/* ── Right: Terminal + floating cards (anchors the 3D hero) ── */}
          <div className="relative h-[480px] hidden lg:block">
            {/* Anchor for the decorative WebGL hero object (Engine reads its rect). */}
            <div data-three-hero aria-hidden="true" className="absolute inset-0 -z-10" />

            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute top-0 left-4 right-4 bg-terminal-bg rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-3 bg-terminal-bar">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-white/50 font-mono">manaracode — terminal</span>
              </div>
              <div className="px-5 py-5 font-mono text-sm space-y-1.5">
                {codeLines.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + i * 0.15 }}
                    className={line.color}
                  >
                    {line.text}
                  </motion.p>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle"
                />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
