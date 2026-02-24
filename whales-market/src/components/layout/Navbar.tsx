import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, LogOut, Copy } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import { WalletModal } from './WalletModal'

const NAV_LINKS = [
  { label: 'Market',    href: '/market' },
  { label: 'Points',    href: '/points' },
  { label: 'Portfolio', href: '/portfolio' },
]

interface NavbarProps {
  walletAddress: string | null
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ walletAddress, onConnect, onDisconnect }) => {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)
  const [walletDropOpen, setWalletDropOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const displayAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  const copyAddress = () => {
    if (!walletAddress) return
    void navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border-default bg-bg-base/90 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl">🐋</span>
              <span className="text-16 font-bold text-text-primary tracking-tight">
                Whales<span className="text-accent">Market</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={clsx(
                    'px-4 py-2 rounded-lg text-14 font-medium transition-colors duration-150',
                    pathname.startsWith(link.href)
                      ? 'text-text-primary bg-bg-hover'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-3">
              {walletAddress ? (
                <div className="relative">
                  <button
                    onClick={() => setWalletDropOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border-default bg-bg-surface hover:border-border-active transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-13 font-medium text-text-primary">{displayAddress}</span>
                    <ChevronDown size={14} className={clsx('text-text-muted transition-transform', walletDropOpen && 'rotate-180')} />
                  </button>

                  {walletDropOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border-default rounded-xl shadow-modal py-1 z-50">
                      <button
                        onClick={() => { copyAddress(); setWalletDropOpen(false) }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-14 text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                      >
                        <Copy size={14} />
                        {copied ? 'Copied!' : 'Copy Address'}
                      </button>
                      <button
                        onClick={() => { onDisconnect(); setWalletDropOpen(false) }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-14 text-danger hover:bg-bg-hover transition-colors"
                      >
                        <LogOut size={14} />
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setWalletOpen(true)}
                >
                  Connect Wallet
                </Button>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border-default bg-bg-base">
            <nav className="flex flex-col p-4 gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'px-4 py-3 rounded-lg text-14 font-medium transition-colors',
                    pathname.startsWith(link.href)
                      ? 'text-text-primary bg-bg-hover'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <WalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
        onConnect={(addr) => { onConnect(addr); setWalletOpen(false) }}
      />
    </>
  )
}
