import { ArrowRight } from 'lucide-react'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Services from '../components/Services'
import TechStack from '../components/TechStack'
import Process from '../components/Process'
import Testimonials from '../components/Testimonials'
import WorkTeaser from '../components/WorkTeaser'
import CTA from '../components/CTA'
import PageMeta from '../components/PageMeta'
import StructuredData from '../components/StructuredData'
import { ErrorBoundary } from '../ui'
import { SceneCanvas } from '../three/SceneCanvas'

// Ordered main sections; each is wrapped in its own ErrorBoundary below. Keys are
// explicit (not Component.name, which minifies) so React reconciliation is stable.
const sections = [
  ['hero', Hero],
  ['stats', Stats],
  ['services', Services],
  ['techstack', TechStack],
  ['process', Process],
  ['testimonials', Testimonials],
  ['work', WorkTeaser],
  ['cta', CTA],
]

export default function Home() {
  return (
    <>
      <PageMeta path="/" />
      <StructuredData path="/" />
      {/* Decorative WebGL layer — gated (WebGL + motion + ≥768px + idle), lazy,
          aria-hidden, behind content. A failure here never blanks the page. */}
      <ErrorBoundary fallback={null}>
        <SceneCanvas />
      </ErrorBoundary>
      <main id="main">
        {/* Each section is isolated in its own ErrorBoundary: a render-time crash
            in one section degrades to nothing (fallback={null}) instead of
            blanking the whole page. Defense-in-depth alongside the App smoke test. */}
        {sections.map(([key, Section]) => (
          <ErrorBoundary key={key} fallback={null}>
            <Section />
          </ErrorBoundary>
        ))}
      </main>
      {/* Thumb-zone primary CTA, mobile only. On md+ the navbar + hero CTAs are
          already reachable; here the hero CTA scrolls off, so keep one fixed. */}
      <a
        href="#contact"
        className="md:hidden fixed bottom-4 left-4 right-4 z-[var(--z-overlay)] inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-accent-warm text-on-accent font-semibold shadow-lg shadow-black/30 transition-opacity duration-200 hover:opacity-90 cursor-pointer"
      >
        Start Your Project
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </a>
    </>
  )
}
