import { Code2, Github, Twitter, Linkedin } from 'lucide-react'

const footerLinks = {
  Services: [
    { label: 'Tech Solutions', href: '#services' },
    { label: 'Code Development', href: '#services' },
    { label: 'Platform Management', href: '#services' },
  ],
  Company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Process', href: '#process' },
    { label: 'Contact', href: '#contact' },
  ],
}

const socials = [
  { Icon: Github, href: '#', label: 'GitHub' },
  { Icon: Twitter, href: '#', label: 'Twitter' },
  { Icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-surface text-muted py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Code2 className="w-4 h-4 text-white" />
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
                  className="w-9 h-9 bg-surface border border-border hover:opacity-90 rounded-lg flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-fg mb-4">{title}</h4>
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
          <p className="text-sm text-muted">© 2025 Manaracode. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-muted">
            <a href="#" className="hover:text-fg transition-opacity cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-fg transition-opacity cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
