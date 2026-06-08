import { Link } from 'react-router-dom'
import { Code2, Github } from 'lucide-react'

// Section links are rooted at "/" so they work from any route (e.g. /privacy).
const footerLinks = {
  Services: [
    { label: 'Tech Solutions', href: '/#services' },
    { label: 'Code Development', href: '/#services' },
    { label: 'Platform Management', href: '/#services' },
  ],
  Company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Our Process', href: '/#process' },
    { label: 'Contact', href: '/#contact' },
  ],
}

// Only real, working profiles here. Add Twitter/LinkedIn back with real URLs
// when available (dead href="#" links were removed).
const socials = [
  { Icon: Github, href: 'https://github.com/drdeebtech', label: 'GitHub' },
]

export default function Footer() {
  return (
    <footer className="bg-surface text-muted pt-16 pb-28 md:pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Code2 className="w-4 h-4 text-white" aria-hidden="true" />
              </div>
              <span className="font-heading font-bold text-fg text-lg tracking-tight">manaracode</span>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs mb-5">
              Tech solutions, code development, and platform management for businesses that want to scale.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 bg-surface border border-border hover:opacity-90 rounded-lg flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading font-semibold text-fg mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-muted hover:text-fg transition-opacity duration-200 cursor-pointer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">© 2026 Manaracode. All rights reserved.</p>
          <nav aria-label="Legal" className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-muted hover:text-fg transition-opacity duration-200 cursor-pointer">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted hover:text-fg transition-opacity duration-200 cursor-pointer">
              Terms of Use
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
