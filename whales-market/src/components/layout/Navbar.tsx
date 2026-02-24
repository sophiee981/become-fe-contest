import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Copy, User } from 'lucide-react'
import { clsx } from 'clsx'
import { WalletModal } from './WalletModal'
import { DownFillIcon } from '@/components/ui/icons/DownFillIcon'
import logoSvg      from '@/assets/images/logo.svg'
import avatarImg    from '@/assets/images/avatar.png'
import feeIconImg   from '@/assets/images/fee-icon.png'
import solanaImg    from '@/assets/images/solana-logo.png'
import usdcIconImg  from '@/assets/images/usdc-icon.png'

// ─── Nav links ────────────────────────────────────────────────────────────────

interface NavLink {
  label: string
  href: string
  activePaths: string[]
  hasDropdown?: boolean
}

const NAV_LINKS: NavLink[] = [
  { label: 'Pre-market', href: '/',          activePaths: ['/', '/market', '/listing'] },
  { label: 'Dashboard',  href: '/portfolio', activePaths: ['/portfolio'] },
  { label: 'Earn',       href: '/points',    activePaths: ['/points'],  hasDropdown: true },
  { label: 'About',      href: '#',          activePaths: ['/about'],   hasDropdown: false },
]

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_BALANCE   = '18.32'
const MOCK_FEE_LABEL = '-0% FEE'   // Figma: "FEE" in uppercase

// ─── Chain selector ────────────────────────────────────────────────────────────
// Figma: 62×36px | p=8 | gap=6 | border=#252527 | r=8
// Solana icon: 16×16 rounded-[4px] | chevron slot: 20×20

const ChainButton: React.FC = () => (
  <button
    className="flex items-center gap-1.5 h-9 px-2 rounded-lg border border-[#252527]
               hover:bg-[#1b1b1c] active:bg-[#252527] transition-colors duration-150"
    aria-label="Select chain"
  >
    {/* Solana logo 16×16 r=4 */}
    <div className="w-5 h-5 flex items-center justify-center shrink-0">
      <img
        src={solanaImg}
        alt="Solana"
        className="w-4 h-4 rounded-[4px] object-cover shrink-0"
      />
    </div>
    {/* down_fill icon 16×16 — #7a7a83 */}
    <div className="w-5 h-5 flex items-center justify-center shrink-0">
      <DownFillIcon size={16} className="text-[#7a7a83]" />
    </div>
  </button>
)

// ─── Fee button ────────────────────────────────────────────────────────────────
// Figma: ~139×36px | p=8 | gap=6 | border=#252527 | r=8
// fee-icon: 16×16 | balance text: 14px w500 | badge: 10px w500 pill

const FeeButton: React.FC = () => (
  <button
    className="flex items-center gap-1.5 h-9 px-2 rounded-lg border border-[#252527]
               hover:bg-[#1b1b1c] active:bg-[#252527] transition-colors duration-150 whitespace-nowrap"
    aria-label="Fee info"
  >
    {/* Fee icon 16×16 from Figma */}
    <div className="w-5 h-5 flex items-center justify-center shrink-0">
      <img
        src={feeIconImg}
        alt="Fee"
        className="w-4 h-4 object-contain shrink-0"
      />
    </div>
    {/* Balance — 14px w500 (font-weight: 500 per Figma spec) */}
    <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums">
      0.00
    </span>
    {/* "FEE" badge — 10px w500 pill | bg=#16c284/10 | text=#5bd197 */}
    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-[500] leading-[12px] text-[#5bd197] bg-[#16c284]/10">
      {MOCK_FEE_LABEL}
    </span>
  </button>
)

// ─── Balance button ────────────────────────────────────────────────────────────
// Figma: 87×36px | pl=8 pr=12 | gap=6 | border=#252527 | r=8

const BalanceButton: React.FC = () => (
  <button
    className="flex items-center gap-1.5 h-9 pl-2 pr-3 rounded-lg border border-[#252527]
               hover:bg-[#1b1b1c] active:bg-[#252527] transition-colors duration-150"
    aria-label="Balance"
  >
    {/* USDC icon 16×16 from Figma */}
    <div className="w-5 h-5 flex items-center justify-center shrink-0">
      <img
        src={usdcIconImg}
        alt="USDC"
        className="w-4 h-4 object-contain shrink-0"
      />
    </div>
    {/* Balance — 14px w500 (font-weight: 500 per Figma spec) */}
    <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums">
      {MOCK_BALANCE}
    </span>
  </button>
)

// ─── Main Navbar ───────────────────────────────────────────────────────────────

interface NavbarProps {
  walletAddress: string | null
  onConnect: (address: string) => void
  onDisconnect: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ walletAddress, onConnect, onDisconnect }) => {
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [copied, setCopied]         = useState(false)
  const avatarRef = useRef<HTMLDivElement>(null)

  // Close avatar dropdown on outside click
  useEffect(() => {
    if (!avatarOpen) return
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [avatarOpen])

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const isActive = (link: NavLink): boolean => {
    if (link.href === '#') return false
    if (link.href === '/') {
      return pathname === '/' || link.activePaths.some(p => p !== '/' && pathname.startsWith(p))
    }
    return link.activePaths.some(p => pathname.startsWith(p))
  }

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
      {/* ───────────────────────────────────────────────────────────────────────
          Header — Figma: bg=#0a0a0b | border-bottom 1px #1b1b1c | h=60px
      ─────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a0a0b] border-b border-[#1b1b1c]">

        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 flex items-center h-[60px] w-full">

          {/* ── Left: Logo + Nav ─────────────────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center shrink-0 opacity-100 hover:opacity-80 active:opacity-60 transition-opacity duration-150"
            >
              <img src={logoSvg} alt="WhalesMarket" className="h-7 w-auto" />
            </Link>

            {/* Desktop Nav — Figma: p=8 r=8 gap=6 text-14 w500 */}
            <nav className="hidden md:flex items-center" aria-label="Main navigation">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={clsx(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-14 font-medium',
                    'transition-all duration-150 select-none whitespace-nowrap',
                    isActive(link)
                      ? 'text-[#5bd197]'
                      : 'text-[#f9f9fa] hover:bg-[#1b1b1c] active:bg-[#252527]',
                  )}
                >
                  {link.label}
                  {link.hasDropdown && (
                    // down_fill icon — Figma icon system
                    <DownFillIcon
                      size={14}
                      className={clsx(
                        'shrink-0 transition-colors',
                        isActive(link) ? 'text-[#5bd197]' : 'text-[#7a7a83]',
                      )}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* ── Spacer ────────────────────────────────────────────────────── */}
          <div className="flex-1" />

          {/* ── Right: Header Functions (connected) or Connect Wallet ──────
              Figma: chain(62×36) + fee(~139×36) + balance(87×36) + avatar(36×36)
              All bordered: border=#252527 r=8, gap=8
          ─────────────────────────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2">
            {walletAddress ? (
              <>
                <ChainButton />
                <FeeButton />
                <BalanceButton />

                {/* Avatar — 36×36 outer | inner 32×32 full circle */}
                <div className="relative" ref={avatarRef}>
                  <button
                    onClick={() => setAvatarOpen(v => !v)}
                    className="w-9 h-9 p-0.5 flex items-center justify-center
                               hover:opacity-80 active:opacity-60 transition-opacity duration-150"
                    aria-label="Account menu"
                    aria-expanded={avatarOpen}
                  >
                    {/* Avatar image — green bg + yellow head from Figma */}
                    <img
                      src={avatarImg}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                  </button>

                  {/* Dropdown */}
                  {avatarOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 bg-[#1b1b1c] border border-[#252527] rounded-xl py-1 z-50"
                      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                    >
                      <div className="px-4 py-2.5 border-b border-[#252527]">
                        <p className="text-12 text-[#7a7a83]">Connected</p>
                        <p className="text-14 font-medium text-[#f9f9fa] font-mono">{displayAddress}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setAvatarOpen(false)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-14 text-[#b4b4ba]
                                   hover:text-[#f9f9fa] hover:bg-[#252527] transition-colors"
                      >
                        <User size={14} />
                        Profile
                      </Link>
                      <button
                        onClick={() => { copyAddress(); setAvatarOpen(false) }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-14 text-[#b4b4ba]
                                   hover:text-[#f9f9fa] hover:bg-[#252527] transition-colors"
                      >
                        <Copy size={14} />
                        {copied ? 'Copied!' : 'Copy Address'}
                      </button>
                      <div className="my-1 border-t border-[#252527]" />
                      <button
                        onClick={() => { onDisconnect(); setAvatarOpen(false) }}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-14 text-[#fd5e67]
                                   hover:bg-[#252527] transition-colors"
                      >
                        <LogOut size={14} />
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Connect Wallet — Figma disconnected state: #f9f9fa bg, #0a0a0b text */
              <button
                onClick={() => setWalletOpen(true)}
                className="inline-flex items-center justify-center h-9 px-4 rounded-lg
                           bg-[#16c284] text-14 font-medium text-[#0a0a0b] leading-none
                           hover:bg-[#16c284]/90 active:bg-[#16c284]/80
                           transition-colors duration-150 whitespace-nowrap"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-2 p-2 rounded-lg text-[#7a7a83]
                       hover:text-[#f9f9fa] hover:bg-[#1b1b1c]
                       active:bg-[#252527] transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile drawer ───────────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0a0a0b] border-t border-[#1b1b1c]">
            <nav className="flex flex-col p-4 gap-0.5 max-w-[1440px] mx-auto">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-3 rounded-lg text-14 font-medium transition-colors',
                    isActive(link)
                      ? 'text-[#5bd197] bg-[#16c284]/10'
                      : 'text-[#f9f9fa] hover:bg-[#1b1b1c] active:bg-[#252527]',
                  )}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <DownFillIcon size={14} className="text-[#7a7a83] opacity-60 shrink-0" />
                  )}
                </Link>
              ))}
              <div className="border-t border-[#252527] my-2" />
              {!walletAddress ? (
                <button
                  onClick={() => { setMobileOpen(false); setWalletOpen(true) }}
                  className="w-full h-10 rounded-lg bg-[#16c284] text-14 font-medium text-[#0a0a0b]
                             hover:bg-[#16c284]/90 active:bg-[#16c284]/80 transition-colors"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex flex-col gap-0.5">
                  <div className="px-3 py-2">
                    <p className="text-12 text-[#7a7a83]">Connected</p>
                    <p className="text-14 font-medium text-[#f9f9fa]">{displayAddress}</p>
                  </div>
                  <button
                    onClick={() => { copyAddress(); setMobileOpen(false) }}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-14 text-[#b4b4ba]
                               hover:text-[#f9f9fa] hover:bg-[#1b1b1c] transition-colors"
                  >
                    <Copy size={14} />
                    {copied ? 'Copied!' : 'Copy Address'}
                  </button>
                  <button
                    onClick={() => { onDisconnect(); setMobileOpen(false) }}
                    className="flex items-center gap-2 px-3 py-3 rounded-lg text-14 text-[#fd5e67]
                               hover:bg-[#1b1b1c] transition-colors"
                  >
                    <LogOut size={14} />
                    Disconnect
                  </button>
                </div>
              )}
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
