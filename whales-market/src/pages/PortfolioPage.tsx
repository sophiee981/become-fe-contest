import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, BarChart2, Clock } from 'lucide-react'
import { clsx } from 'clsx'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Tabs } from '@/components/ui/Tabs'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { mockPortfolioStats } from '@/mock-data/portfolio'
import { mockMyOrders } from '@/mock-data/myOrders'
import { mockTradeHistory } from '@/mock-data/tradeHistory'
import type { MyOrder } from '@/types/order'
import type { TradeHistoryEntry } from '@/types/portfolio'

const formatPrice = (p: number) =>
  p < 0.001 ? p.toFixed(8) : p < 1 ? p.toFixed(4) : p.toFixed(2)

export const PortfolioPage: React.FC = () => {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState<MyOrder[]>(mockMyOrders)

  const handleCancel = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' as const } : o))
    showToast({ message: 'Order cancelled.', type: 'info' })
  }

  const openOrders  = orders.filter(o => o.status === 'open' || o.status === 'partial')
  const stats = mockPortfolioStats
  const isPosTotal = stats.pnl >= 0

  return (
    <div className="py-8">
      <PageWrapper>
        <h1 className="text-28 font-bold text-text-primary mb-6">Portfolio</h1>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Total Value',
              value: `$${stats.totalValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
              icon: <BarChart2 size={18} />,
              accent: false,
            },
            {
              label: 'P&L',
              value: `${isPosTotal ? '+' : ''}$${Math.abs(stats.pnl).toFixed(2)}`,
              sub: `${isPosTotal ? '+' : ''}${stats.pnlPercent.toFixed(2)}%`,
              icon: isPosTotal ? <TrendingUp size={18} /> : <TrendingDown size={18} />,
              accent: isPosTotal,
              positive: isPosTotal,
            },
            {
              label: 'Active Orders',
              value: String(openOrders.length),
              icon: <Clock size={18} />,
              accent: false,
            },
            {
              label: 'Completed Trades',
              value: String(stats.completedTrades),
              icon: <BarChart2 size={18} />,
              accent: false,
            },
          ].map(card => (
            <div key={card.label} className="bg-bg-surface border border-border-default rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-13 text-text-muted">{card.label}</p>
                <div className={clsx('text-text-muted', card.accent && (card.positive ? 'text-buy' : 'text-sell'))}>
                  {card.icon}
                </div>
              </div>
              <p className={clsx(
                'text-24 font-bold',
                'positive' in card ? (card.positive ? 'text-buy' : 'text-sell') : 'text-text-primary',
              )}>
                {card.value}
              </p>
              {'sub' in card && card.sub && (
                <p className={clsx('text-13 mt-0.5', isPosTotal ? 'text-buy' : 'text-sell')}>{card.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
          <div className="border-b border-border-default px-5 pt-4">
            <Tabs
              tabs={[
                { id: 'orders',  label: 'Open Orders',     count: openOrders.length },
                { id: 'history', label: 'Trade History',   count: mockTradeHistory.length },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
              variant="line"
            />
          </div>

          {activeTab === 'orders' ? (
            openOrders.length === 0 ? (
              <EmptyState
                icon={<Clock size={40} />}
                title="No open orders"
                description="Go to a market to place your first order"
                action={{ label: 'Browse Markets', onClick: () => navigate('/market') }}
              />
            ) : (
              <OpenOrdersTable orders={openOrders} onCancel={handleCancel} />
            )
          ) : (
            mockTradeHistory.length === 0 ? (
              <EmptyState title="No trade history" description="Completed trades will appear here" />
            ) : (
              <TradeHistoryTable trades={mockTradeHistory} />
            )
          )}
        </div>
      </PageWrapper>
    </div>
  )
}

// ─── Open Orders Table ────────────────────────────────────────────────────────

const OpenOrdersTable: React.FC<{ orders: MyOrder[]; onCancel: (id: string) => void }> = ({ orders, onCancel }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border-default bg-bg-elevated">
          {['Token', 'Type', 'Price', 'Amount', 'Filled', 'Status', 'Date', 'Action'].map(col => (
            <th key={col} className="px-4 py-3 text-12 font-medium text-text-muted uppercase tracking-wide text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {orders.map(order => (
          <tr key={order.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-hover transition-colors">
            <td className="px-4 py-3">
              <Link to={`/market/${order.marketId}`} className="text-14 font-medium text-text-primary hover:text-accent transition-colors">
                {order.token}
              </Link>
            </td>
            <td className="px-4 py-3">
              <Badge label={order.type} variant={order.type === 'buy' ? 'buy' : 'sell'} dot />
            </td>
            <td className="px-4 py-3 text-14 font-mono text-text-primary">${formatPrice(order.price)}</td>
            <td className="px-4 py-3 text-14 text-text-secondary">{order.amount.toLocaleString()}</td>
            <td className="px-4 py-3 text-14 text-text-secondary">{order.filled}%</td>
            <td className="px-4 py-3">
              <Badge
                label={order.status}
                variant={order.status === 'open' ? 'info' : 'warning'}
                dot
              />
            </td>
            <td className="px-4 py-3 text-13 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
            <td className="px-4 py-3">
              {(order.status === 'open' || order.status === 'partial') && (
                <Button variant="danger" size="sm" onClick={() => onCancel(order.id)}>Cancel</Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// ─── Trade History Table ──────────────────────────────────────────────────────

const TradeHistoryTable: React.FC<{ trades: TradeHistoryEntry[] }> = ({ trades }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border-default bg-bg-elevated">
          {['Date', 'Market', 'Type', 'Price', 'Amount', 'Total', 'P&L', 'Status'].map(col => (
            <th key={col} className="px-4 py-3 text-12 font-medium text-text-muted uppercase tracking-wide text-left">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {trades.map(trade => {
          const isPos = trade.pnl >= 0
          return (
            <tr key={trade.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-hover transition-colors">
              <td className="px-4 py-3 text-13 text-text-muted">{new Date(trade.date).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{trade.logo}</span>
                  <div>
                    <p className="text-14 font-medium text-text-primary">{trade.token}</p>
                    <p className="text-12 text-text-muted">{trade.tokenName}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge label={trade.type} variant={trade.type === 'buy' ? 'buy' : 'sell'} dot />
              </td>
              <td className="px-4 py-3 text-14 font-mono text-text-primary">${formatPrice(trade.price)}</td>
              <td className="px-4 py-3 text-14 text-text-secondary">{trade.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-14 text-text-primary">${trade.total.toFixed(2)}</td>
              <td className={clsx('px-4 py-3 text-14 font-semibold', isPos ? 'text-buy' : 'text-sell')}>
                {isPos ? '+' : ''}${trade.pnl.toFixed(2)}
              </td>
              <td className="px-4 py-3">
                <Badge
                  label={trade.status}
                  variant={trade.status === 'completed' ? 'success' : trade.status === 'cancelled' ? 'neutral' : 'danger'}
                  dot
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)
