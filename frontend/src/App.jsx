import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import TechStack from './components/TechStack'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'
import { ErrorBoundary } from './ui'
import { SceneCanvas } from './three/SceneCanvas'

export default function App() {
  return (
    // reducedMotion="user" makes every framer-motion animation respect
    // prefers-reduced-motion automatically (entrances, whileInView, the blink).
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-fg focus:shadow-lg"
      >
        Skip to content
      </a>
      <div className="font-body">
        {/* Decorative WebGL layer — gated (WebGL + motion + ≥768px + idle), lazy,
            aria-hidden, behind content. A failure here never blanks the page. */}
        <ErrorBoundary fallback={null}>
          <SceneCanvas />
        </ErrorBoundary>
        <Navbar />
        <main id="main">
          <Hero />
          <Stats />
          <Services />
          <TechStack />
          <Process />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
