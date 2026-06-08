import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Code2 } from 'lucide-react'
import { EASE } from '../styles/tokens'

// Section links are rooted at "/" so they work from any route (e.g. /privacy):
// the browser navigates home and scrolls to the anchor. About is a real route
// (`route: true`), so it renders a client-side <Link> instead of an anchor.
const links = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/work', route: true },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/about', route: true },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE.out }}
      className={`fixed top-4 left-4 right-4 z-50 rounded-2xl transition-all duration-300 ${
        scrolled
          ? 'bg-surface backdrop-blur-md shadow-lg shadow-black/20 border border-border'
          : 'bg-surface backdrop-blur-sm border border-border'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-fg cursor-pointer">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Code2 className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-lg tracking-tight">manaracode</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) =>
            link.route ? (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-sm font-medium text-muted hover:text-fg transition-opacity duration-200 cursor-pointer"
                >
                  {link.label}
                </Link>
              </li>
            ) : (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-muted hover:text-fg transition-opacity duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            )
          )}
        </ul>

        <a
          href="/#contact"
          className="hidden md:inline-flex items-center px-5 py-2 min-h-[44px] bg-accent-warm text-on-accent text-sm font-semibold rounded-xl transition-opacity duration-200 hover:opacity-90 cursor-pointer"
        >
          Get Started
        </a>

        <button
          className="md:hidden inline-flex min-h-[44px] min-w-[44px] items-center justify-center -mr-2 text-muted cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border px-5 pb-5"
          >
            <div className="pt-4 flex flex-col gap-4">
              {links.map((link) =>
                link.route ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="flex min-h-[44px] items-center text-sm font-medium text-muted hover:text-fg cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex min-h-[44px] items-center text-sm font-medium text-muted hover:text-fg cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
              <a
                href="/#contact"
                className="w-full min-h-[44px] flex items-center justify-center bg-accent-warm text-on-accent text-sm font-semibold rounded-xl text-center transition-opacity duration-200 hover:opacity-90 cursor-pointer"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
