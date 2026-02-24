import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Check, Edit2, Check as CheckIcon, X, ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { mockUser } from '@/mock-data/user'
import { mockMyOrders } from '@/mock-data/myOrders'
import { mockTradeHistory } from '@/mock-data/tradeHistory'
import { mockPortfolioStats } from '@/mock-data/portfolio'

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: string; sub?: string }> = ({ label, value, sub }) => (
  <div className="bg-bg-surface border border-border-default rounded-xl p-5">
    <p className="text-13 text-text-muted mb-1">{label}</p>
    <p className="text-20 font-bold text-text-primary">{value}</p>
    {sub && <p className="text-12 text-text-muted mt-0.5">{sub}</p>}
  </div>
)

// ─── Balance Row ──────────────────────────────────────────────────────────────

const BalanceRow: React.FC<{ token: string; amount: number | undefined }> = ({ token, amount }) => {
  if (amount === undefined || amount === 0) return null
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
    return n.toLocaleString()
  }
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
      <span className="text-14 font-medium text-text-primary">{token}</span>
      <span className="text-14 text-text-secondary font-mono">{fmt(amount)}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const ProfilePage: React.FC = () => {
  const { showToast } = useToast()
  const user = mockUser

  const [username, setUsername]   = useState(user.username ?? '')
  const [editing, setEditing]     = useState(false)
  const [editVal, setEditVal]     = useState(username)
  const [copied, setCopied]       = useState(false)
  const [savedFeedback, setSavedFeedback] = useState(false)

  const openOrders   = mockMyOrders.filter(o => o.status === 'open' || o.status === 'partial')
  const stats        = mockPortfolioStats

  // Initials for avatar
  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : user.displayAddress.slice(2, 4).toUpperCase()

  const copyAddress = () => {
    void navigator.clipboard.writeText(user.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const startEdit = () => {
    setEditVal(username)
    setEditing(true)
  }

  const saveUsername = () => {
    const trimmed = editVal.trim()
    if (!trimmed) return
    setUsername(trimmed)
    setEditing(false)
    setSavedFeedback(true)
    showToast({ message: 'Username updated!', type: 'success' })
    setTimeout(() => setSavedFeedback(false), 2000)
  }

  const cancelEdit = () => {
    setEditVal(username)
    setEditing(false)
  }

  const joinedDate = new Date(user.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

  return (
    <div className="py-8">
      <PageWrapper>
        <div className="max-w-3xl mx-auto space-y-6">

          {/* ── Profile card ── */}
          <div className="bg-bg-surface border border-border-default rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">

              {/* Avatar */}
              <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center shrink-0">
                <span className="text-20 font-bold text-accent">{initials}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Username */}
                <div className="flex items-center gap-2 mb-1">
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveUsername(); if (e.key === 'Escape') cancelEdit() }}
                        maxLength={30}
                        className="bg-bg-base border border-border-active rounded-lg px-3 py-1.5 text-16 font-bold text-text-primary focus:outline-none w-48"
                      />
                      <button
                        onClick={saveUsername}
                        className="p-1.5 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                        aria-label="Save"
                      >
                        <CheckIcon size={16} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-1.5 rounded-md text-text-muted hover:bg-bg-hover hover:text-text-primary transition-colors"
                        aria-label="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-20 font-bold text-text-primary">{username || 'Anonymous'}</h1>
                      <button
                        onClick={startEdit}
                        className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors"
                        aria-label="Edit username"
                      >
                        <Edit2 size={14} />
                      </button>
                      {savedFeedback && (
                        <span className="text-12 text-success flex items-center gap-1">
                          <CheckIcon size={12} /> Saved!
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Wallet address */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-14 font-mono text-text-secondary">{user.displayAddress}</span>
                  <button
                    onClick={copyAddress}
                    className="p-1 rounded-md text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Copy address"
                  >
                    {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                  {copied && <span className="text-12 text-success">Copied!</span>}
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge label="Verified Trader" variant="success" dot />
                  <span className="text-13 text-text-muted">Member since {joinedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Trades"
              value={user.stats.totalTrades.toLocaleString()}
            />
            <StatCard
              label="Total Volume"
              value={`$${(user.stats.totalVolume / 1000).toFixed(1)}K`}
              sub="All time"
            />
            <StatCard
              label="Active Orders"
              value={String(openOrders.length)}
            />
            <StatCard
              label="P&L"
              value={`+$${stats.pnl.toFixed(0)}`}
              sub={`+${stats.pnlPercent.toFixed(2)}%`}
            />
          </div>

          {/* ── Balances ── */}
          <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
              <h2 className="text-14 font-semibold text-text-primary">Wallet Balances</h2>
              <Badge label="Mock" variant="neutral" size="sm" />
            </div>
            <div className="px-5 py-1">
              {Object.entries(user.balance).map(([token, amount]) => (
                <BalanceRow key={token} token={token} amount={amount} />
              ))}
            </div>
          </div>

          {/* ── Recent activity ── */}
          <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
              <h2 className="text-14 font-semibold text-text-primary">Recent Trades</h2>
              <Link
                to="/portfolio"
                className="flex items-center gap-1 text-13 text-accent hover:text-accent/80 transition-colors"
              >
                View all <ExternalLink size={12} />
              </Link>
            </div>
            {mockTradeHistory.length === 0 ? (
              <p className="px-5 py-6 text-14 text-text-muted text-center">No trades yet</p>
            ) : (
              <div className="divide-y divide-border-subtle">
                {mockTradeHistory.slice(0, 5).map(trade => {
                  const isPos = trade.pnl >= 0
                  return (
                    <div key={trade.id} className="flex items-center px-5 py-3 hover:bg-bg-hover transition-colors">
                      <span className="text-xl mr-3">{trade.logo}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-14 font-medium text-text-primary">{trade.token}</p>
                        <p className="text-12 text-text-muted">
                          {new Date(trade.date).toLocaleDateString()} · {trade.type.toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-14 font-medium text-text-primary">${trade.total.toFixed(2)}</p>
                        <p className={clsx('text-12 font-medium', isPos ? 'text-buy' : 'text-sell')}>
                          {isPos ? '+' : ''}${trade.pnl.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Connected wallet ── */}
          <div className="bg-bg-surface border border-border-default rounded-xl p-5">
            <h2 className="text-14 font-semibold text-text-primary mb-4">Connected Wallet</h2>
            <div className="flex items-center justify-between py-3 border-b border-border-subtle">
              <span className="text-14 text-text-muted">Address</span>
              <div className="flex items-center gap-2">
                <span className="text-14 font-mono text-text-secondary">{user.displayAddress}</span>
                <button onClick={copyAddress} className="text-text-muted hover:text-text-primary transition-colors">
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border-subtle">
              <span className="text-14 text-text-muted">Network</span>
              <span className="text-14 text-text-secondary">Ethereum Mainnet</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-14 text-text-muted">Status</span>
              <Badge label="Connected" variant="success" dot />
            </div>
          </div>

        </div>
      </PageWrapper>
    </div>
  )
}
