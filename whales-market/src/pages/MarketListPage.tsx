import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { mockMarkets } from '@/mock-data/markets'
import type { MarketCategory, SortField, SortDirection } from '@/types/filter'
import type { Market } from '@/types/market'

const CATEGORIES: { id: MarketCategory; label: string }[] = [
  { id: 'all',         label: 'All' },
  { id: 'pre-market',  label: 'Pre-Market' },
  { id: 'points',      label: 'Points' },
  { id: 'allocation',  label: 'Allocation' },
]

type ColumnKey = 'rank' | 'price' | 'change24h' | 'volume24h' | 'marketCap'

const COLUMNS: { key: ColumnKey; label: string; align: 'left' | 'right' }[] = [
  { key: 'rank',       label: '#',          align: 'left' },
  { key: 'price',      label: 'Price',      align: 'right' },
  { key: 'change24h',  label: '24h Change', align: 'right' },
  { key: 'volume24h',  label: '24h Volume', align: 'right' },
  { key: 'marketCap',  label: 'Market Cap', align: 'right' },
]

const formatUSD = (n: number) => {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000)     return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)         return `$${(n / 1_000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}

const SortIcon: React.FC<{ col: ColumnKey; active: SortField; dir: SortDirection }> = ({ col, active, dir }) => {
  if (col === 'rank') return null
  const field = col as SortField
  const isActive = active === field
  const upColor   = isActive && dir === 'asc'  ? '#F9F9FA' : '#7A7A83'
  const downColor = isActive && dir === 'desc' ? '#F9F9FA' : '#7A7A83'
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.44604 3.24253C7.59297 3.08724 7.79223 3 8 3C8.20777 3 8.40703 3.08724 8.55396 3.24253L10.7706 5.58598C10.8802 5.70188 10.9548 5.84954 10.985 6.01028C11.0152 6.17102 10.9996 6.33762 10.9402 6.48899C10.8808 6.64037 10.7803 6.76972 10.6514 6.86068C10.5224 6.95165 10.3709 7.00013 10.2158 7H5.78415C5.62914 7.00013 5.47758 6.95165 5.34864 6.86068C5.2197 6.76972 5.11917 6.64037 5.05978 6.48899C5.0004 6.33762 4.98481 6.17102 5.01501 6.01028C5.0452 5.84954 5.11982 5.70188 5.22941 5.58598L7.44604 3.24253Z" fill={upColor} />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.55396 12.7575C8.40703 12.9128 8.20777 13 8 13C7.79223 13 7.59297 12.9128 7.44604 12.7575L5.22941 10.414C5.11982 10.2981 5.0452 10.1505 5.01501 9.98972C4.98481 9.82898 5.0004 9.66238 5.05978 9.511C5.11917 9.35963 5.2197 9.23028 5.34864 9.13932C5.47758 9.04835 5.62914 8.99987 5.78415 9H10.2158C10.3709 8.99987 10.5224 9.04835 10.6514 9.13932C10.7803 9.23028 10.8808 9.35963 10.9402 9.511C10.9996 9.66238 11.0152 9.82898 10.985 9.98972C10.9548 10.1505 10.8802 10.2981 10.7706 10.414L8.55396 12.7575Z" fill={downColor} />
    </svg>
  )
}

const MarketRow: React.FC<{ market: Market; index: number }> = ({ market, index }) => {
  const isPos = market.change24h >= 0
  return (
    <tr className="border-b border-border-subtle hover:bg-bg-hover transition-colors group">
      <td className="px-4 py-3.5 text-14 text-text-muted w-8">{index + 1}</td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-lg shrink-0">
            {market.logo}
          </div>
          <div>
            <p className="text-14 font-semibold text-text-primary group-hover:text-accent transition-colors">{market.token}</p>
            <p className="text-12 text-text-muted">{market.name}</p>
          </div>
          <Badge
            label={market.category === 'pre-market' ? 'Pre-Market' : market.category === 'points' ? 'Points' : 'Alloc.'}
            variant={market.category === 'points' ? 'purple' : 'neutral'}
            size="sm"
          />
        </div>
      </td>
      <td className="px-4 py-3.5 text-14 font-medium text-text-primary text-right">
        ${market.price < 0.01 ? market.price.toFixed(7) : market.price < 1 ? market.price.toFixed(4) : market.price.toFixed(2)}
      </td>
      <td className={clsx('px-4 py-3.5 text-14 font-medium text-right', isPos ? 'text-buy' : 'text-sell')}>
        {isPos ? '+' : ''}{market.change24h.toFixed(2)}%
      </td>
      <td className="px-4 py-3.5 text-14 text-text-secondary text-right">{formatUSD(market.volume24h)}</td>
      <td className="px-4 py-3.5 text-14 text-text-secondary text-right">{market.marketCap ? formatUSD(market.marketCap) : '—'}</td>
      <td className="px-4 py-3.5 text-right">
        <Link to={`/market/${market.id}`}>
          <Button variant="outline" size="sm">Trade</Button>
        </Link>
      </td>
    </tr>
  )
}

export const MarketListPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<MarketCategory>('all')
  const [sortField, setSortField] = useState<SortField>('volume24h')
  const [sortDir, setSortDir] = useState<SortDirection>('desc')

  const handleSort = (col: ColumnKey) => {
    if (col === 'rank') return
    const field = col as SortField
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    return mockMarkets
      .filter(m => category === 'all' || m.category === category)
      .filter(m => {
        const q = search.toLowerCase()
        return m.token.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1
        return (a[sortField] > b[sortField] ? 1 : -1) * dir
      })
  }, [search, category, sortField, sortDir])

  return (
    <div className="py-8">
      <PageWrapper>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-28 font-bold text-text-primary">Markets</h1>
          <p className="text-14 text-text-secondary mt-1">{mockMarkets.length} markets available</p>
        </div>

        {/* Filter/Sort bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          {/* Search */}
          <div className="w-full sm:w-64">
            <Input
              type="search"
              placeholder="Search markets..."
              value={search}
              onChange={setSearch}
              prefix={<Search size={16} />}
            />
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-1 bg-bg-surface border border-border-default rounded-lg p-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-13 font-medium transition-all duration-150',
                  category === cat.id
                    ? 'bg-bg-elevated text-text-primary'
                    : 'text-text-muted hover:text-text-secondary',
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="ml-auto text-13 text-text-muted">
            Showing <span className="text-text-primary font-medium">{filtered.length}</span> of {mockMarkets.length}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<TrendingUp size={48} />}
            title="No markets found"
            description="Try adjusting your search or filter"
            action={{ label: 'Reset', onClick: () => { setSearch(''); setCategory('all') } }}
          />
        ) : (
          <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-default bg-bg-elevated">
                    {COLUMNS.map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className={clsx(
                          'px-4 py-3 text-12 font-medium text-text-muted uppercase tracking-wide select-none',
                          col.align === 'right' ? 'text-right' : 'text-left',
                          col.key !== 'rank' && 'cursor-pointer hover:text-text-secondary transition-colors',
                        )}
                      >
                        <div className={clsx('inline-flex items-center gap-1.5', col.align === 'right' && 'flex-row-reverse')}>
                          {col.label}
                          <SortIcon col={col.key} active={sortField} dir={sortDir} />
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-12 font-medium text-text-muted uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((market, i) => (
                    <MarketRow key={market.id} market={market} index={i} />
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
