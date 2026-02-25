import React, { useState, useEffect, useRef } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import { clsx } from 'clsx'
import { Spinner } from '@/components/ui/Spinner'

// ─── Network logo imports ───────────────────────────────────────────────────
import logoEvmImg      from '@/assets/images/logo-evm.png'
import logoSolanaImg   from '@/assets/images/logo-solana.png'
import logoStarknetImg from '@/assets/images/logo-starknet.png'
import logoTonImg      from '@/assets/images/logo-ton.png'
import logoSuiImg      from '@/assets/images/logo-sui.png'
import logoAptosImg    from '@/assets/images/logo-aptos.png'

// ─── Wallet logo imports ────────────────────────────────────────────────────
import logoPhantomImg  from '@/assets/images/logo-phantom.png'
import logoSolflareImg from '@/assets/images/logo-solflare.png'
import { MODAL_SHADOW } from '@/constants/ui'

// ─── Types ──────────────────────────────────────────────────────────────────

interface Network {
  id:    string
  label: string
  img:   string
}

interface WalletOption {
  id:      string
  name:    string
  img?:    string
  color:   string
  address: string
}

// ─── Config ─────────────────────────────────────────────────────────────────
// Figma node 38214-314593 — connect-select-network
// Network selector: 624×52, pad=4, r=10, border=#252527
// Each tab: r=8, pad=T12/R24/B12/L12, gap=8, icon=20×20, text=14px/w500

const NETWORKS: Network[] = [
  { id: 'evm',      label: 'EVM',      img: logoEvmImg },
  { id: 'solana',   label: 'Solana',   img: logoSolanaImg },
  { id: 'starknet', label: 'Starknet', img: logoStarknetImg },
  { id: 'ton',      label: 'Ton',      img: logoTonImg },
  { id: 'sui',      label: 'Sui',      img: logoSuiImg },
  { id: 'aptos',    label: 'Aptos',    img: logoAptosImg },
]

// Wallet options per network — realistic mock addresses
// Figma: wallet card 304×68, pad=16, gap=16, r=12, stroke=#252527
// Wallet name: 16px/w500/#f9f9fa | Install btn: 62×28, r=6, bg=#252527

const WALLETS_BY_NETWORK: Record<string, WalletOption[]> = {
  evm: [
    {
      id:      'metamask',
      name:    'MetaMask',
      color:   '#F6851B',
      address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    },
    {
      id:      'rabby',
      name:    'Rabby',
      color:   '#7C4DFF',
      address: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
    },
  ],
  solana: [
    {
      id:      'phantom',
      name:    'Phantom',
      img:     logoPhantomImg,
      color:   '#AB9FF2',
      address: 'GQ98sFvxbK3mNQJkPdwaiA5Y1Lmfzc7PxqE8nBtRCd2',
    },
    {
      id:      'solflare',
      name:    'Solflare',
      img:     logoSolflareImg,
      color:   '#FC7227',
      address: 'Hs7KpQZRm1vBx9Dk4fNeLtJyWuAcPgE2MnXoVs6iCq8',
    },
  ],
  starknet: [
    {
      id:      'braavos',
      name:    'Braavos',
      color:   '#FF875B',
      address: '0x0abcd1234ef567890abcdef1234567890abcdef12345',
    },
    {
      id:      'argentx',
      name:    'ArgentX',
      color:   '#F4A261',
      address: '0x01234abcdef567890abcdef1234567890abcdef1234',
    },
  ],
  ton: [
    {
      id:      'tonkeeper',
      name:    'Tonkeeper',
      color:   '#0098EA',
      address: 'UQC8xK9mNfTpQz2vLrJhYbWdEsAiGcBnDlMoPqRtSuVw',
    },
    {
      id:      'openmask',
      name:    'OpenMask',
      color:   '#45AEF5',
      address: 'EQD5P3xRkLmNqJfHvCbWtYgEsAiGnDlMoPqRtSuVwXyz',
    },
  ],
  sui: [
    {
      id:      'sui-wallet',
      name:    'Sui Wallet',
      color:   '#4CA2FF',
      address: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c',
    },
    {
      id:      'ethos',
      name:    'Ethos',
      color:   '#6366F1',
      address: '0x7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a',
    },
  ],
  aptos: [
    {
      id:      'petra',
      name:    'Petra',
      color:   '#00D4AA',
      address: '0xfed1234abcdef567890abcdef1234567890abc12345678',
    },
    {
      id:      'martian',
      name:    'Martian',
      color:   '#F97316',
      address: '0xcba4567890abcdef1234567890abcdef123456789abc',
    },
  ],
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface WalletModalProps {
  isOpen:    boolean
  onClose:   () => void
  onConnect: (address: string) => void
}

// ─── Component ──────────────────────────────────────────────────────────────
// Figma node 38214-314593 — connect-select-network
// Container: 672×288px | bg=#1B1B1C | r=24 | pad=24 | gap=24

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [activeNetwork, setActiveNetwork] = useState('solana')
  const [connecting,    setConnecting]    = useState<string | null>(null)

  // Track ongoing connection to cancel on network switch / close
  const connectingRef = useRef<string | null>(null)

  // Reset state every time modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveNetwork('solana')
      setConnecting(null)
      connectingRef.current = null
    }
  }, [isOpen])

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleClose = () => {
    connectingRef.current = null
    setConnecting(null)
    onClose()
  }

  const handleNetworkSwitch = (networkId: string) => {
    connectingRef.current = null
    setConnecting(null)
    setActiveNetwork(networkId)
  }

  const handleWalletSelect = async (wallet: WalletOption) => {
    if (connecting) return
    setConnecting(wallet.id)
    connectingRef.current = wallet.id

    await new Promise<void>(r => setTimeout(r, 1000))

    // Only connect if not cancelled (modal not closed / network not switched)
    if (connectingRef.current === wallet.id) {
      onConnect(wallet.address)
      onClose()
      setConnecting(null)
      connectingRef.current = null
    }
  }

  if (!isOpen) return null

  const wallets = WALLETS_BY_NETWORK[activeNetwork] ?? []

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-label="Connect Wallet"
    >
      {/* ── Backdrop ── Figma: #000 80% + blur 4px ───────────────────────── */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-[4px] animate-backdrop-in"
        onClick={handleClose}
      />

      {/* ── Modal panel ──────────────────────────────────────────────────── */}
      {/* Figma: 672×288 | bg=#1B1B1C | r=24 | pad=24 | gap=24 | shadow blur=32 */}
      <div
        className="relative flex flex-col w-full max-w-[672px] p-6 gap-6 bg-[#1b1b1c] rounded-[24px] animate-modal-in"
        style={{ boxShadow: MODAL_SHADOW }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header ─────────────────────────────────────────────────────
            Figma: 624×36 | horizontal | space-between
            Back btn: 36×36 | r=9999 | bg=#252527 | arrow_left 16×16/#f9f9fa
            Title: 18px/w500/#f9f9fa (centered)
            Close btn: 36×36 | r=9999 | bg=#252527 | close 16×16/#f9f9fa
        ─────────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between" style={{ minHeight: '36px' }}>
          {/* Back button */}
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[#252527] flex items-center justify-center
                       text-[#f9f9fa] hover:bg-[#2e2e34] active:bg-[#3a3a3a]
                       transition-colors duration-150 shrink-0"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Title — centered */}
          <h2 className="text-[18px] font-[500] leading-[28px] text-[#f9f9fa] absolute left-1/2 -translate-x-1/2">
            Connect Wallet
          </h2>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-[#252527] flex items-center justify-center
                       text-[#f9f9fa] hover:bg-[#2e2e34] active:bg-[#3a3a3a]
                       transition-colors duration-150 shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────
            Figma: 624 × auto | vertical | gap=24
        ─────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* ── Network tabs (select-network) ──────────────────────────
              Figma: 624×52 | pad=4 | r=10 | stroke=#252527
              Each tab: r=8 | pad=T12/R24/B12/L12 | gap=8
              Active: bg=#2E2E34 | Default: bg=transparent
              NO horizontal scroll — all 6 must be visible
          ─────────────────────────────────────────────────────────── */}
          <div className="flex items-center p-1 rounded-[10px] border border-[#252527]">
            {NETWORKS.map(net => (
              <button
                key={net.id}
                onClick={() => handleNetworkSwitch(net.id)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 rounded-lg',
                  'py-3 pl-3 pr-6',
                  'text-[14px] font-[500] leading-[20px] text-[#f9f9fa]',
                  'transition-colors duration-150 whitespace-nowrap',
                  activeNetwork === net.id
                    ? 'bg-[#2e2e34]'
                    : 'hover:bg-[#252527]/50',
                )}
              >
                {/* Network icon — 20×20 r=4 */}
                <img
                  src={net.img}
                  alt={net.label}
                  className="w-5 h-5 rounded-[4px] object-cover shrink-0"
                />
                {net.label}
              </button>
            ))}
          </div>

          {/* ── Wallet chooser (select-wallet) ─────────────────────────
              Figma: 624×104 | vertical | gap=16
              Label: "Choose Wallet" 14px/w500/#7a7a83
              wallet-items: 624×68 | horizontal | gap=16
              Each card: 304×68 | pad=16 | gap=16 | r=12 | stroke=#252527
          ─────────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-[500] leading-[20px] text-[#7a7a83]">
              Choose Wallet
            </span>

            <div className="flex gap-4">
              {wallets.map(wallet => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet)}
                  disabled={connecting !== null}
                  className={clsx(
                    'group flex-1 flex items-center gap-4 p-4 rounded-[12px]',
                    'border border-[#252527] transition-all duration-150',
                    connecting === null
                      ? 'hover:bg-[#252527] cursor-pointer'
                      : connecting === wallet.id
                        ? 'bg-[#252527]'
                        : 'opacity-40 cursor-not-allowed',
                  )}
                >
                  {/* Wallet logo — 36×36 r=8 */}
                  {wallet.img ? (
                    <img
                      src={wallet.img}
                      alt={wallet.name}
                      className="w-9 h-9 rounded-[8px] object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-[8px] flex items-center justify-center
                                 text-white text-[18px] font-[700] shrink-0 select-none"
                      style={{ backgroundColor: wallet.color }}
                    >
                      {wallet.name[0]}
                    </div>
                  )}

                  {/* Wallet name — 16px/w500/#f9f9fa */}
                  <span className="flex-1 text-left text-[16px] font-[500] leading-[24px] text-[#f9f9fa]">
                    {wallet.name}
                  </span>

                  {/* Install button / Spinner
                      Figma: 62×28 | r=6 | bg=#252527 | text 12px/w500/#7a7a83
                      Hover (group): bg=#2e2e34 | text=#f9f9fa */}
                  {connecting === wallet.id ? (
                    <div className="w-[62px] h-7 flex items-center justify-center rounded-[6px] bg-[#2e2e34]">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <div
                      className={clsx(
                        'w-[62px] h-7 flex items-center justify-center rounded-[6px]',
                        'bg-[#252527] transition-colors duration-150',
                        connecting === null && 'group-hover:bg-[#2e2e34]',
                      )}
                    >
                      <span
                        className={clsx(
                          'text-[12px] font-[500] leading-[16px] text-[#7a7a83]',
                          'transition-colors duration-150',
                          connecting === null && 'group-hover:text-[#f9f9fa]',
                        )}
                      >
                        Install
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
