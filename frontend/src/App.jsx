import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    // reducedMotion="user" makes every framer-motion animation respect
    // prefers-reduced-motion automatically (entrances, whileInView, the blink).
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-fg focus:shadow-lg cursor-pointer"
        >
          Skip to content
        </a>
        <div className="font-body">
          {/* Navbar + Footer are shared chrome on every route; each page renders its
              own <main id="main"> so the skip link works everywhere. */}
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </MotionConfig>
    </BrowserRouter>
  )
}
