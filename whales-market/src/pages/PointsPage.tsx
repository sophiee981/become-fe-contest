import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
// Sort icon uses inline SVG from Figma component 35281:21856
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
    const isActive = sortField === field
    const upColor   = isActive && sortDir === 'asc'  ? '#F9F9FA' : '#7A7A83'
    const downColor = isActive && sortDir === 'desc' ? '#F9F9FA' : '#7A7A83'
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M7.44604 3.24253C7.59297 3.08724 7.79223 3 8 3C8.20777 3 8.40703 3.08724 8.55396 3.24253L10.7706 5.58598C10.8802 5.70188 10.9548 5.84954 10.985 6.01028C11.0152 6.17102 10.9996 6.33762 10.9402 6.48899C10.8808 6.64037 10.7803 6.76972 10.6514 6.86068C10.5224 6.95165 10.3709 7.00013 10.2158 7H5.78415C5.62914 7.00013 5.47758 6.95165 5.34864 6.86068C5.2197 6.76972 5.11917 6.64037 5.05978 6.48899C5.0004 6.33762 4.98481 6.17102 5.01501 6.01028C5.0452 5.84954 5.11982 5.70188 5.22941 5.58598L7.44604 3.24253Z" fill={upColor} />
        <path fillRule="evenodd" clipRule="evenodd" d="M8.55396 12.7575C8.40703 12.9128 8.20777 13 8 13C7.79223 13 7.59297 12.9128 7.44604 12.7575L5.22941 10.414C5.11982 10.2981 5.0452 10.1505 5.01501 9.98972C4.98481 9.82898 5.0004 9.66238 5.05978 9.511C5.11917 9.35963 5.2197 9.23028 5.34864 9.13932C5.47758 9.04835 5.62914 8.99987 5.78415 9H10.2158C10.3709 8.99987 10.5224 9.04835 10.6514 9.13932C10.7803 9.23028 10.8808 9.35963 10.9402 9.511C10.9996 9.66238 11.0152 9.82898 10.985 9.98972C10.9548 10.1505 10.8802 10.2981 10.7706 10.414L8.55396 12.7575Z" fill={downColor} />
      </svg>
    )
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
