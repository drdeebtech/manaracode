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
    <footer className="bg-blue-950 text-blue-200 py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-white text-lg tracking-tight">manaracode</span>
            </div>
            <p className="text-sm text-blue-300 leading-relaxed max-w-xs mb-5">
              Tech solutions, code development, and platform management for businesses that want to scale.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-blue-900 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-blue-300 hover:text-white transition-colors duration-200 cursor-pointer"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-blue-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-400">© 2025 Manaracode. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-blue-400">
            <a href="#" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
