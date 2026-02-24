import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Copy, Check, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import { clsx } from 'clsx'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { mockMarkets } from '@/mock-data/markets'
import { mockBuyOrders, mockSellOrders } from '@/mock-data/orderBook'
import { mockRecentTrades } from '@/mock-data/recentTrades'
import { mockMyOrders } from '@/mock-data/myOrders'
import type { MyOrder, OrderBookEntry } from '@/types/order'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (p: number) =>
  p < 0.001 ? p.toFixed(8) : p < 1 ? p.toFixed(4) : p.toFixed(2)

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

// ─── Order Book Row ───────────────────────────────────────────────────────────

const OrderBookRow: React.FC<{
  entry: OrderBookEntry
  onPriceClick: (p: number) => void
}> = ({ entry, onPriceClick }) => {
  return (
    <button
      className="w-full flex items-center text-12 py-0.5 px-2 hover:bg-bg-hover transition-colors relative overflow-hidden group"
      onClick={() => onPriceClick(entry.price)}
    >
      {/* Depth bar */}
      <div
        className={clsx(
          'absolute right-0 top-0 bottom-0 opacity-15',
          entry.type === 'buy' ? 'bg-buy' : 'bg-sell',
        )}
        style={{ width: `${(entry.depth ?? 0) * 100}%` }}
      />
      <span className={clsx('flex-1 text-left font-medium', entry.type === 'buy' ? 'text-buy' : 'text-sell')}>
        {formatPrice(entry.price)}
      </span>
      <span className="text-text-secondary w-24 text-right">
        {(entry.amount / 1_000_000).toFixed(2)}M
      </span>
      <span className="text-text-muted w-20 text-right">
        ${entry.total.toFixed(0)}
      </span>
    </button>
  )
}

// ─── Trade Form ───────────────────────────────────────────────────────────────

const TRADE_FEE_RATE = 0.005

interface TradeFormProps {
  activeTab: 'buy' | 'sell'
  onTabChange: (t: 'buy' | 'sell') => void
  price: string
  setPrice: (v: string) => void
  amount: string
  setAmount: (v: string) => void
  maxBalance: number
  token: string
  onSubmit: () => void
}

const TradeForm: React.FC<TradeFormProps> = ({
  activeTab, onTabChange, price, setPrice, amount, setAmount, maxBalance, token, onSubmit,
}) => {
  const [priceErr, setPriceErr] = useState('')
  const [amountErr, setAmountErr] = useState('')

  const numPrice  = parseFloat(price)  || 0
  const numAmount = parseFloat(amount) || 0
  const total     = numPrice * numAmount
  const fee       = total * TRADE_FEE_RATE
  const youPay    = total + fee
  const youGet    = total - fee

  const validate = () => {
    let ok = true
    if (!price || numPrice <= 0)  { setPriceErr('Enter a valid price');  ok = false } else setPriceErr('')
    if (!amount || numAmount <= 0) { setAmountErr('Enter a valid amount'); ok = false } else setAmountErr('')
    if (ok) onSubmit()
  }

  const fillMax = () => {
    const maxTokens = maxBalance / numPrice
    setAmount(numPrice > 0 ? maxTokens.toFixed(0) : '0')
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-xl p-5">
      {/* Buy/Sell tabs */}
      <div className="flex gap-1 bg-bg-base rounded-lg p-1 mb-5">
        {(['buy', 'sell'] as const).map(t => (
          <button
            key={t}
            onClick={() => onTabChange(t)}
            className={clsx(
              'flex-1 py-2 rounded-md text-14 font-semibold transition-all duration-150',
              activeTab === t
                ? t === 'buy' ? 'bg-buy text-text-inverse' : 'bg-sell text-white'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            {t === 'buy' ? 'Buy' : 'Sell'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <Input
          label="Price (USDC)"
          type="number"
          value={price}
          onChange={setPrice}
          placeholder="0.00"
          error={priceErr}
          suffix="USDC"
        />
        <Input
          label={`Amount (${token})`}
          type="number"
          value={amount}
          onChange={setAmount}
          placeholder="0"
          error={amountErr}
          suffix={token}
          rightAction={
            <button
              onClick={fillMax}
              className="px-2 py-0.5 text-12 text-accent hover:bg-accent/10 rounded-md transition-colors font-medium"
            >
              Max
            </button>
          }
        />
        <Input
          label="Total (USDC)"
          type="number"
          value={total > 0 ? total.toFixed(4) : ''}
          onChange={() => {}}
          placeholder="0.00"
          readOnly
          suffix="USDC"
        />
      </div>

      {/* Fee summary */}
      {total > 0 && (
        <div className="mt-4 p-3 bg-bg-base rounded-lg space-y-1.5">
          <div className="flex justify-between text-13">
            <span className="text-text-muted">Fee (0.5%)</span>
            <span className="text-text-secondary">${fee.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-13 font-medium">
            <span className="text-text-muted">{activeTab === 'buy' ? 'You pay' : 'You receive'}</span>
            <span className="text-text-primary">${(activeTab === 'buy' ? youPay : youGet).toFixed(4)}</span>
          </div>
        </div>
      )}

      <Button
        variant={activeTab === 'buy' ? 'buy' : 'sell'}
        size="lg"
        fullWidth
        className="mt-4"
        onClick={validate}
      >
        {activeTab === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
      </Button>

      <p className="mt-2 text-12 text-text-muted text-center">
        Available: ${maxBalance.toLocaleString()} USDC
      </p>
    </div>
  )
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading: boolean
  type: 'buy' | 'sell'
  price: number
  amount: number
  token: string
  total: number
  fee: number
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen, onClose, onConfirm, loading, type, price, amount, token, total, fee,
}) => {
  const rows = [
    { label: 'Token',  value: token },
    { label: 'Type',   value: <Badge label={type === 'buy' ? 'Buy' : 'Sell'} variant={type === 'buy' ? 'buy' : 'sell'} /> },
    { label: 'Price',  value: `$${formatPrice(price)} USDC` },
    { label: 'Amount', value: `${amount.toLocaleString()} ${token}` },
    { label: 'Total',  value: `$${total.toFixed(4)} USDC` },
    { label: 'Fee',    value: `$${fee.toFixed(4)} USDC` },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Transaction"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            variant={type === 'buy' ? 'buy' : 'sell'}
            fullWidth
            loading={loading}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      }
    >
      <div className="divide-y divide-border-default">
        {rows.map(row => (
          <div key={row.label} className="flex items-center justify-between py-3">
            <span className="text-14 text-text-muted">{row.label}</span>
            <span className="text-14 font-medium text-text-primary">{row.value}</span>
          </div>
        ))}
      </div>
    </Modal>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export const MarketDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { showToast } = useToast()

  const market = mockMarkets.find(m => m.id === id)

  // Trade form state
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy')
  const [price, setPrice]   = useState('')
  const [amount, setAmount] = useState('')

  // Confirm modal
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirming, setConfirming]   = useState(false)

  // My orders (local state so cancel works)
  const [myOrders, setMyOrders] = useState<MyOrder[]>(
    mockMyOrders.filter(o => o.marketId === id),
  )
  const [ordersTab, setOrdersTab] = useState('open')

  // Copy address state
  const [copied, setCopied] = useState(false)

  const SELLER_ADDR = '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b'
  const SELLER_DISPLAY = `${SELLER_ADDR.slice(0, 6)}...${SELLER_ADDR.slice(-4)}`

  const numPrice  = parseFloat(price)  || 0
  const numAmount = parseFloat(amount) || 0
  const total     = numPrice * numAmount
  const fee       = total * TRADE_FEE_RATE

  const handleSubmit = () => setConfirmOpen(true)

  const handleConfirm = async () => {
    setConfirming(true)
    await new Promise(r => setTimeout(r, 1200))

    if (Math.random() < 0.1) {
      setConfirming(false)
      showToast({ message: 'Transaction failed. Please try again.', type: 'error' })
      return
    }

    // Add to my orders
    const newOrder: MyOrder = {
      id: `ord-${Date.now()}`,
      marketId: id ?? '',
      token: market?.token ?? '',
      tokenName: market?.name ?? '',
      type: tradeTab,
      price: numPrice,
      amount: numAmount,
      filled: 0,
      status: 'open',
      createdAt: new Date().toISOString(),
    }
    setMyOrders(prev => [newOrder, ...prev])
    setConfirming(false)
    setConfirmOpen(false)
    setPrice('')
    setAmount('')
    showToast({ message: 'Order placed successfully!', type: 'success' })
  }

  const handleCancelOrder = (orderId: string) => {
    setMyOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o))
    showToast({ message: 'Order cancelled.', type: 'info' })
  }

  const handlePriceClick = (p: number) => setPrice(String(p))

  const copyAddress = () => {
    void navigator.clipboard.writeText(SELLER_ADDR)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const visibleOrders = useMemo(() =>
    myOrders.filter(o => ordersTab === 'open' ? o.status === 'open' || o.status === 'partial' : o.status === 'cancelled' || o.status === 'filled'),
    [myOrders, ordersTab]
  )

  if (!market) {
    return (
      <div className="py-8">
        <PageWrapper>
          <EmptyState
            icon={<TrendingDown size={48} />}
            title="Market not found"
            description="The market you're looking for doesn't exist."
            action={{ label: 'Browse Markets', onClick: () => {} }}
          />
        </PageWrapper>
      </div>
    )
  }

  const isPos = market.change24h >= 0

  return (
    <div className="py-6">
      <PageWrapper>
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-13 text-text-muted mb-5">
          <Link to="/market" className="flex items-center gap-1 hover:text-text-secondary transition-colors">
            <ArrowLeft size={14} />
            Markets
          </Link>
          <span>/</span>
          <span className="text-text-secondary">{market.token}</span>
        </div>

        {/* Token header */}
        <div className="bg-bg-surface border border-border-default rounded-xl p-5 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-bg-elevated flex items-center justify-center text-2xl">
                {market.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-20 font-bold text-text-primary">{market.name}</h1>
                  <Badge
                    label={market.category === 'pre-market' ? 'Pre-Market' : market.category === 'points' ? 'Points' : 'Allocation'}
                    variant={market.category === 'points' ? 'purple' : 'neutral'}
                  />
                </div>
                <p className="text-14 text-text-muted">{market.token} · {market.category}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { label: '24h Volume', value: `$${(market.volume24h / 1_000_000).toFixed(2)}M` },
                { label: 'Total Trades', value: market.totalTrades.toLocaleString() },
                { label: 'Floor Price', value: `$${formatPrice(market.floorPrice)}` },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-12 text-text-muted">{s.label}</p>
                  <p className="text-14 font-semibold text-text-primary">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price row */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-32 font-bold text-text-primary">
              ${formatPrice(market.price)}
            </span>
            <span className={clsx('flex items-center gap-1 text-16 font-semibold', isPos ? 'text-buy' : 'text-sell')}>
              {isPos ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              {isPos ? '+' : ''}{market.change24h.toFixed(2)}%
              <span className="text-13 font-normal text-text-muted ml-1">24h</span>
            </span>
          </div>
        </div>

        {/* 3-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-5 mb-5">
          {/* Order book */}
          <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border-default">
              <h3 className="text-14 font-semibold text-text-primary">Order Book</h3>
            </div>

            {/* Column headers */}
            <div className="flex px-2 py-1.5 border-b border-border-subtle">
              <span className="flex-1 text-11 text-text-muted uppercase tracking-wide">Price (USDC)</span>
              <span className="w-24 text-right text-11 text-text-muted uppercase tracking-wide">Amount</span>
              <span className="w-20 text-right text-11 text-text-muted uppercase tracking-wide">Total</span>
            </div>

            {/* Sell orders (reversed — highest at top) */}
            <div className="max-h-[240px] overflow-y-auto scrollbar-thin">
              {[...mockSellOrders].reverse().map((entry, i) => (
                <OrderBookRow key={`sell-${i}`} entry={entry} onPriceClick={handlePriceClick} />
              ))}
            </div>

            {/* Spread */}
            <div className="px-2 py-2 bg-bg-base border-y border-border-default text-center">
              <span className="text-12 text-text-muted">Spread: </span>
              <span className="text-12 font-medium text-text-primary">
                ${(mockSellOrders[0].price - mockBuyOrders[0].price).toFixed(8)}
              </span>
            </div>

            {/* Buy orders */}
            <div className="max-h-[240px] overflow-y-auto scrollbar-thin">
              {mockBuyOrders.map((entry, i) => (
                <OrderBookRow key={`buy-${i}`} entry={entry} onPriceClick={handlePriceClick} />
              ))}
            </div>
          </div>

          {/* Recent trades */}
          <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border-default">
              <h3 className="text-14 font-semibold text-text-primary">Recent Trades</h3>
            </div>
            <div className="flex px-4 py-2 border-b border-border-subtle">
              <span className="flex-1 text-11 text-text-muted uppercase tracking-wide">Time</span>
              <span className="w-28 text-right text-11 text-text-muted uppercase tracking-wide">Price</span>
              <span className="w-28 text-right text-11 text-text-muted uppercase tracking-wide">Amount</span>
            </div>
            <div className="max-h-[540px] overflow-y-auto">
              {mockRecentTrades.map(trade => (
                <div key={trade.id} className="flex items-center px-4 py-2 hover:bg-bg-hover transition-colors border-b border-border-subtle last:border-0">
                  <span className="flex-1 text-12 text-text-muted">{formatTime(trade.timestamp)}</span>
                  <span className={clsx('w-28 text-right text-12 font-medium', trade.type === 'buy' ? 'text-buy' : 'text-sell')}>
                    ${formatPrice(trade.price)}
                  </span>
                  <span className="w-28 text-right text-12 text-text-secondary">
                    {(trade.amount / 1_000_000).toFixed(2)}M
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Trade form */}
          <div>
            <TradeForm
              activeTab={tradeTab}
              onTabChange={setTradeTab}
              price={price}
              setPrice={setPrice}
              amount={amount}
              setAmount={setAmount}
              maxBalance={8420}
              token={market.token}
              onSubmit={handleSubmit}
            />

            {/* Seller info */}
            <div className="mt-4 bg-bg-surface border border-border-default rounded-xl p-4">
              <p className="text-12 text-text-muted mb-2">Seller</p>
              <div className="flex items-center gap-2">
                <span className="text-14 font-mono text-text-primary">{SELLER_DISPLAY}</span>
                <button
                  onClick={copyAddress}
                  className="p-1 rounded-md text-text-muted hover:text-text-primary transition-colors"
                  aria-label="Copy address"
                >
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
                {copied && <span className="text-12 text-success">Copied!</span>}
              </div>
            </div>
          </div>
        </div>

        {/* My Orders table */}
        <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border-default">
            <h3 className="text-14 font-semibold text-text-primary">My Orders</h3>
            <Tabs
              tabs={[
                { id: 'open', label: 'Open', count: myOrders.filter(o => o.status === 'open' || o.status === 'partial').length },
                { id: 'history', label: 'History' },
              ]}
              activeTab={ordersTab}
              onChange={setOrdersTab}
              variant="pill"
            />
          </div>

          {visibleOrders.length === 0 ? (
            <EmptyState title="No open orders" description="Place an order to see it here" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-default bg-bg-elevated">
                    {['Type', 'Price', 'Amount', 'Filled', 'Status', 'Date', 'Action'].map(col => (
                      <th key={col} className="px-4 py-3 text-12 font-medium text-text-muted uppercase tracking-wide text-left">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map(order => (
                    <tr key={order.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-hover transition-colors">
                      <td className="px-4 py-3">
                        <Badge label={order.type === 'buy' ? 'Buy' : 'Sell'} variant={order.type === 'buy' ? 'buy' : 'sell'} dot />
                      </td>
                      <td className="px-4 py-3 text-14 font-mono text-text-primary">${formatPrice(order.price)}</td>
                      <td className="px-4 py-3 text-14 text-text-secondary">{order.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-14 text-text-secondary">{order.filled}%</td>
                      <td className="px-4 py-3">
                        <Badge
                          label={order.status}
                          variant={order.status === 'open' ? 'info' : order.status === 'partial' ? 'warning' : order.status === 'filled' ? 'success' : 'neutral'}
                          dot
                        />
                      </td>
                      <td className="px-4 py-3 text-13 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {(order.status === 'open' || order.status === 'partial') && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageWrapper>

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        loading={confirming}
        type={tradeTab}
        price={numPrice}
        amount={numAmount}
        token={market.token}
        total={total}
        fee={fee}
      />
    </div>
  )
}
