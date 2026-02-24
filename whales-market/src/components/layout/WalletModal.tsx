import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { CheckCircle } from 'lucide-react'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
  onConnect: (address: string) => void
}

const WALLETS = [
  { id: 'metamask',      name: 'MetaMask',      icon: '🦊', address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b' },
  { id: 'phantom',       name: 'Phantom',        icon: '👻', address: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b' },
  { id: 'walletconnect', name: 'WalletConnect',  icon: '🔗', address: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e' },
]

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [connected, setConnected] = useState<string | null>(null)

  const handleSelect = async (wallet: typeof WALLETS[number]) => {
    setConnecting(wallet.id)
    await new Promise(r => setTimeout(r, 1000))
    setConnecting(null)
    setConnected(wallet.id)
    await new Promise(r => setTimeout(r, 800))
    onConnect(wallet.address)
    onClose()
    setConnected(null)
  }

  const handleClose = () => {
    setConnecting(null)
    setConnected(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Connect Wallet" size="sm">
      <div className="flex flex-col gap-2 py-2">
        {WALLETS.map(wallet => (
          <button
            key={wallet.id}
            onClick={() => handleSelect(wallet)}
            disabled={connecting !== null}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border-default bg-bg-elevated hover:border-accent hover:bg-bg-hover transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">{wallet.icon}</span>
            <span className="flex-1 text-left text-14 font-medium text-text-primary">{wallet.name}</span>
            {connecting === wallet.id && <Spinner size="sm" />}
            {connected === wallet.id && <CheckCircle size={18} className="text-success" />}
          </button>
        ))}
      </div>
      <p className="mt-3 text-12 text-text-muted text-center">
        By connecting, you agree to our Terms of Service
      </p>
    </Modal>
  )
}
