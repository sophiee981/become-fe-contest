import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { clsx } from 'clsx'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { mockMarkets } from '@/mock-data/markets'
import type { SortField, SortDirection } from '@/types/filter'
import type { Market } from '@/types/market'

const formatUSD = (n: number) => {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

const formatPrice = (p: number) =>
  p < 0.001 ? p.toFixed(8) : p < 1 ? p.toFixed(4) : p.toFixed(2)

const PointsRow: React.FC<{ market: Market }> = ({ market }) => {
  const isPos = market.change24h >= 0
  return (
    <tr className="border-b border-border-subtle last:border-0 hover:bg-bg-hover transition-colors group">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-xl">
            {market.logo}
          </div>
          <div>
            <p className="text-14 font-semibold text-text-primary group-hover:text-accent transition-colors">{market.token}</p>
            <p className="text-12 text-text-muted">{market.name}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-14 font-medium text-text-primary text-right">
        ${formatPrice(market.price)}
      </td>
      <td className={clsx('px-4 py-4 text-14 font-medium text-right', isPos ? 'text-buy' : 'text-sell')}>
        {isPos ? '+' : ''}{market.change24h.toFixed(2)}%
      </td>
      <td className="px-4 py-4 text-14 text-text-secondary text-right">{formatUSD(market.volume24h)}</td>
      <td className="px-4 py-4 text-14 text-text-secondary text-right">{formatUSD(market.marketCap)}</td>
      <td className="px-4 py-4 text-right">
        <Link to={`/market/${market.id}`}>
          <Button variant="outline" size="sm">Trade</Button>
        </Link>
      </td>
    </tr>
  )
}

export const PointsPage: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('volume24h')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('desc') }
  }

  const markets = useMemo(() =>
    mockMarkets
      .filter(m => m.category === 'points')
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1
        return (a[sortField] > b[sortField] ? 1 : -1) * dir
      }),
    [sortField, sortDir]
  )

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-40 text-text-muted" />
    return sortDir === 'asc' ? <ArrowUp size={14} className="text-accent" /> : <ArrowDown size={14} className="text-accent" />
  }

  const sortableCol = (label: string, field: SortField) => (
    <th
      className="px-4 py-3 text-12 font-medium text-text-muted uppercase tracking-wide text-right cursor-pointer hover:text-text-secondary transition-colors select-none"
      onClick={() => handleSort(field)}
    >
      <div className="inline-flex items-center gap-1.5 flex-row-reverse">
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  )

  return (
    <div className="py-8">
      <PageWrapper>
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-28 font-bold text-text-primary">Points Market</h1>
          <Badge label="Points" variant="purple" size="md" />
        </div>
        <p className="text-14 text-text-secondary mb-6">
          Trade protocol points before they convert to tokens. {markets.length} markets active.
        </p>

        {/* Table */}
        {markets.length === 0 ? (
          <EmptyState title="No points markets" description="Check back later for new listings" />
        ) : (
          <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-default bg-bg-elevated">
                    <th className="px-4 py-3 text-12 font-medium text-text-muted uppercase tracking-wide text-left">Token</th>
                    {sortableCol('Price', 'price')}
                    {sortableCol('24h Change', 'change24h')}
                    {sortableCol('24h Volume', 'volume24h')}
                    {sortableCol('Market Cap', 'marketCap')}
                    <th className="px-4 py-3 text-12 font-medium text-text-muted uppercase tracking-wide text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {markets.map(market => (
                    <PointsRow key={market.id} market={market} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </PageWrapper>
    </div>
  )
}
