import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Zap } from 'lucide-react'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  },
})

const codeLines = [
  { text: '$ manaracode init project', color: 'text-green-400' },
  { text: '✓ Analyzing requirements...', color: 'text-blue-300' },
  { text: '✓ Setting up architecture...', color: 'text-blue-300' },
  { text: '✓ Writing clean code...', color: 'text-blue-300' },
  { text: '✓ Running tests (100%)...', color: 'text-blue-300' },
  { text: '✓ Deploying to production!', color: 'text-green-400' },
  { text: '> Project ready 🚀', color: 'text-yellow-300' },
]

const avatarColors = ['bg-blue-400', 'bg-blue-600', 'bg-indigo-500', 'bg-blue-800']

export default function Hero() {
  return (
    <section className="min-h-screen pt-28 pb-20 px-4 sm:px-6 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left ── */}
          <div>
            <motion.div
              variants={fadeUp(0)}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-6"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-700">Available for Projects</span>
            </motion.div>

            <motion.h1
              variants={fadeUp(0.1)}
              initial="hidden"
              animate="show"
              className="font-heading text-5xl lg:text-6xl font-bold text-blue-900 leading-tight mb-6"
            >
              Build Smarter.
              <br />
              <span className="text-blue-500">Scale Faster.</span>
              <br />
              Deliver Better.
            </motion.h1>

            <motion.p
              variants={fadeUp(0.2)}
              initial="hidden"
              animate="show"
              className="text-lg text-blue-700/80 leading-relaxed mb-8 max-w-lg"
            >
              Manaracode delivers end-to-end tech solutions — from custom software development
              to full platform management — so your business stays ahead of the curve.
            </motion.p>

            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-4 mb-10"
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
              >
                Start Your Project
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-blue-200 text-blue-800 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
              >
                Our Services
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp(0.4)}
              initial="hidden"
              animate="show"
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {avatarColors.map((color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-blue-700">
                Trusted by <span className="font-semibold">30+ clients</span> worldwide
              </p>
            </motion.div>
          </div>

          {/* ── Right: Terminal + floating cards ── */}
          <div className="relative h-[480px] hidden lg:block">

            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute top-0 left-4 right-4 bg-gray-900 rounded-2xl shadow-2xl shadow-blue-900/20 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-5 py-3 bg-gray-800/80">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400 font-mono">manaracode — terminal</span>
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

            {/* Floating card: Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6 }}
              className="absolute bottom-12 -left-4 bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-blue-50 px-5 py-4 flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading text-blue-900 leading-none">50+</p>
                <p className="text-xs text-blue-500 mt-0.5">Projects Delivered</p>
              </div>
            </motion.div>

            {/* Floating card: Satisfaction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              className="absolute bottom-0 right-4 bg-white rounded-2xl shadow-xl shadow-blue-900/10 border border-blue-50 px-5 py-4 flex items-center gap-3 z-10"
            >
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold font-heading text-blue-900 leading-none">99%</p>
                <p className="text-xs text-blue-500 mt-0.5">Client Satisfaction</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  )
}
