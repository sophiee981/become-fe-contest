import { Link } from 'react-router-dom'
import { Twitter, Github, MessageCircle } from 'lucide-react'

const FOOTER_LINKS = [
  { label: 'Market',    href: '/market' },
  { label: 'Points',    href: '/points' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Docs',      href: '#' },
]

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-default bg-bg-base mt-16">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🐋</span>
            <span className="text-16 font-bold text-text-primary">
              Whales<span className="text-accent">Market</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center gap-6 justify-center">
            {FOOTER_LINKS.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className="text-14 text-text-muted hover:text-text-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
              aria-label="Discord"
            >
              <MessageCircle size={18} />
            </a>
            <a
              href="#"
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle text-center">
          <p className="text-13 text-text-muted">
            © {new Date().getFullYear()} WhalesMarket. All rights reserved. Trade at your own risk.
          </p>
        </div>
      </div>
    </footer>
  )
}
