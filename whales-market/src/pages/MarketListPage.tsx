import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowUpDown, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react'
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
  if (active !== col) return <ArrowUpDown size={14} className="text-text-muted opacity-40" />
  return dir === 'asc'
    ? <ArrowUp size={14} className="text-accent" />
    : <ArrowDown size={14} className="text-accent" />
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
