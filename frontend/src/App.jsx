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
    <div className="font-body">
      {/* Decorative WebGL layer — gated (WebGL + motion + wide + idle), lazy,
          aria-hidden, behind content. A failure here never blanks the page. */}
      <ErrorBoundary fallback={null}>
        <SceneCanvas />
      </ErrorBoundary>
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <TechStack />
      <Process />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}
