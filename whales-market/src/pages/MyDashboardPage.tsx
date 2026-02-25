// Figma node 38045:245592 — My Dashboard
// Layout: 1920x1588, bg=#0a0a0b
// Body: 1440px centered, padding T:16 R:32 B:16 L:32, gap:16px

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  mockOpenOrders,
  mockEndedOrders,
  TOKEN_DOT_COLORS,
  CHAIN_COLORS,
  OPEN_ORDERS_TOTAL,
  ENDED_ORDERS_TOTAL,
  ENDED_SETTLE_COUNT,
  ENDED_CANCEL_COUNT,
  ROWS_PER_PAGE,
  fmtAmount,
  fmtPrice,
  fmtDeposited,
  type SideType,
  type EndedStatusType,
  type ChainType,
} from '@/mock-data/dashboardData'

// ─── SVG Icons ───────────────────────────────────────────────────────────────

const BreadcrumbSep: React.FC = () => (
  <span className="w-4 h-4 flex items-center justify-center">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#B4B4BA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
)

const ExternalLinkIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CollapseIcon: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    {collapsed
      ? <path d="M4 8H12M8 4V12" stroke="#F9F9FA" strokeWidth="1.5" strokeLinecap="round"/>
      : <path d="M4 8H12" stroke="#F9F9FA" strokeWidth="1.5" strokeLinecap="round"/>
    }
  </svg>
)

const SearchIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke="#7A7A83" strokeWidth="1.2"/>
    <path d="M10.5 10.5L13 13" stroke="#7A7A83" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const ChevronDownIcon: React.FC<{ open?: boolean }> = ({ open }) => (
  <svg
    width="12" height="12" viewBox="0 0 12 12" fill="none"
    className={clsx('transition-transform duration-150', open && 'rotate-180')}
  >
    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PageLeftIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M7.5 2.5L4.5 6L7.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PageRightIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6L5 9L10 3" stroke="#5BD197" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const WalletIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="#7A7A83" strokeWidth="1.2"/>
    <path d="M13 10.5C13 11.328 13.672 12 14.5 12H18V9H14.5C13.672 9 13 9.672 13 10.5Z" stroke="#7A7A83" strokeWidth="1.2"/>
  </svg>
)

const CopyIcon: React.FC = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect x="4" y="4" width="6" height="6" rx="1" stroke="#7A7A83" strokeWidth="1"/>
    <path d="M8 2H3C2.448 2 2 2.448 2 3V8" stroke="#7A7A83" strokeWidth="1" strokeLinecap="round"/>
  </svg>
)

// Figma node 35281:21856 — TableSortIcon (synced across project)
const TableSortIcon: React.FC<{ field: string; sortKey: string; sortDir: 'asc' | 'desc' }> = ({
  field, sortKey, sortDir,
}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-0.5 inline-block">
    <path d="M6 3L8.5 7H3.5L6 3Z" fill={field === sortKey && sortDir === 'asc' ? '#F9F9FA' : '#7A7A83'} />
    <path d="M6 13L3.5 9H8.5L6 13Z" fill={field === sortKey && sortDir === 'desc' ? '#F9F9FA' : '#7A7A83'} />
  </svg>
)

// ─── FilterDropdown (Figma: filter button + dropdown panel) ─────────────────
// Click opens panel, click outside closes, selected state with accent tint
interface FilterOption {
  value: string
  label: string
  dotColor?: string   // colored side indicator
}

interface FilterDropdownProps {
  label: string
  options: FilterOption[]
  selected: string
  onChange: (value: string) => void
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedOpt = options.find(o => o.value === selected)
  const isFiltered = selected !== 'all'

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={clsx(
          'flex items-center gap-1.5 px-4 h-9 rounded-lg text-14 font-medium transition-colors',
          isFiltered
            ? 'bg-accent/10 border border-accent/30 text-text-primary'
            : 'bg-bg-surface text-text-muted hover:bg-bg-hover'
        )}
      >
        {isFiltered && selectedOpt?.dotColor && (
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selectedOpt.dotColor }} />
        )}
        {isFiltered ? selectedOpt?.label : label}
        <ChevronDownIcon open={open} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 min-w-[160px] z-50 bg-bg-surface border border-border-default rounded-lg shadow-lg animate-dropdown-in overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={clsx(
                'w-full flex items-center gap-2 px-3 h-9 text-14 transition-colors text-left',
                selected === opt.value
                  ? 'text-text-primary bg-bg-elevated'
                  : 'text-text-secondary hover:bg-bg-hover'
              )}
            >
              {opt.dotColor && (
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: opt.dotColor }} />
              )}
              {opt.label}
              {selected === opt.value && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Shared primitives ───────────────────────────────────────────────────────

const TabBadge: React.FC<{ count: number; active?: boolean }> = ({ count, active }) => (
  <span className={clsx(
    'ml-1.5 px-1.5 py-0.5 rounded-full text-10 font-medium',
    active ? 'bg-accent/20 text-text-primary' : 'bg-bg-elevated text-text-secondary'
  )}>
    {count}
  </span>
)

const SearchInput: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="flex items-center gap-2 h-9 px-2 rounded-lg bg-bg-surface w-[288px]">
    <SearchIcon />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search"
      className="flex-1 bg-transparent text-14 text-text-primary placeholder:text-text-muted focus:outline-none"
    />
    {value && (
      <button onClick={() => onChange('')} className="text-text-muted hover:text-text-secondary transition-colors text-12">✕</button>
    )}
  </div>
)

const TokenDot: React.FC<{ color: string; letter: string }> = ({ color, letter }) => (
  <div
    className="w-6 h-6 rounded-full flex items-center justify-center text-10 font-medium text-text-primary flex-shrink-0"
    style={{ backgroundColor: color }}
  >
    {letter}
  </div>
)

const ChainBadge: React.FC<{ chain: ChainType }> = ({ chain }) => (
  <span
    className="inline-flex items-center justify-center w-5 h-5 rounded-full text-10 font-bold text-white flex-shrink-0"
    style={{ backgroundColor: CHAIN_COLORS[chain], fontSize: '8px' }}
    title={chain}
  >
    {chain[0]}
  </span>
)

const SIDE_COLORS: Record<SideType, string> = {
  buy:    'text-success',
  sell:   'text-danger',
  resell: 'text-yellow-400',
}
const SIDE_LABELS: Record<SideType, string> = { buy: 'Buy', sell: 'Sell', resell: 'Resell' }

const BADGE_STYLES: Record<string, string> = {
  Full: 'bg-bg-elevated text-text-muted',
  RS:   'bg-yellow-400 text-text-inverse',
  DP:   'bg-warning text-text-inverse',
}

const STATUS_COLORS: Record<EndedStatusType, string> = {
  settled:  'text-success',
  canceled: 'text-text-muted',
  claimed:  'text-text-muted',
  closed:   'text-text-muted',
  resold:   'text-yellow-400',
}
const STATUS_LABELS: Record<EndedStatusType, string> = {
  settled:  'settled',
  canceled: 'canceled',
  claimed:  'CLAIMED',
  closed:   'CLOSED',
  resold:   'Resold',
}

// ─── Pagination ──────────────────────────────────────────────────────────────

const Pagination: React.FC<{
  showing: string
  total: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showGoTo?: boolean
}> = ({ showing, total, currentPage, totalPages, onPageChange, showGoTo }) => {
  const [goToVal, setGoToVal] = useState('')

  const getPages = (): (number | 'dots')[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | 'dots')[] = [1]
    if (currentPage > 3) pages.push('dots')
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p)
    }
    if (currentPage < totalPages - 2) pages.push('dots')
    pages.push(totalPages)
    return pages
  }

  const handleGoTo = () => {
    const p = parseInt(goToVal)
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p)
      setGoToVal('')
    }
  }

  return (
    <div className="flex items-center justify-between h-7">
      <span className="text-12 text-text-muted">
        {showing} of {total} items. Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-7 h-7 rounded-md bg-bg-surface flex items-center justify-center text-text-secondary hover:bg-bg-hover disabled:opacity-50 transition-colors"
        >
          <PageLeftIcon />
        </button>

        {getPages().map((p, idx) =>
          p === 'dots' ? (
            <span key={`dots-${idx}`} className="w-7 h-7 flex items-center justify-center text-12 text-text-muted">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={clsx(
                'w-7 h-7 rounded-md text-12 font-medium transition-colors',
                currentPage === p
                  ? 'bg-accent text-success'
                  : 'bg-bg-surface text-text-secondary hover:bg-bg-hover'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-7 h-7 rounded-md bg-bg-surface flex items-center justify-center text-text-secondary hover:bg-bg-hover disabled:opacity-50 transition-colors"
        >
          <PageRightIcon />
        </button>

        {showGoTo && (
          <>
            <div className="w-px h-4 bg-border-default mx-1" />
            <div className="flex items-center gap-1.5">
              <span className="text-12 text-text-muted">Go to page</span>
              <input
                type="text"
                value={goToVal}
                onChange={e => setGoToVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGoTo()}
                className="w-10 h-7 rounded-md bg-bg-surface border border-border-default text-12 text-text-primary text-center focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Breadcrumb (Figma 38045:245595) ─────────────────────────────────────────

const Breadcrumb: React.FC = () => (
  <div className="flex items-center justify-between h-4">
    <nav className="flex items-center">
      <Link to="/" className="text-12 text-text-secondary hover:text-text-primary transition-colors">
        Whales.Market
      </Link>
      <BreadcrumbSep />
      <Link to="/" className="text-12 text-text-secondary hover:text-text-primary transition-colors">
        Pre-market
      </Link>
      <BreadcrumbSep />
      <span className="text-12 text-text-primary">My Dashboard</span>
    </nav>
    <button className="flex items-center gap-1 text-12 font-medium text-success hover:text-success/80 transition-colors">
      <ExternalLinkIcon />
      Delivery Scenarios
    </button>
  </div>
)

// ─── Dashboard Header (Figma 43176:141877) ───────────────────────────────────
// 1344x96, py-24, border-bottom #1b1b1c
// Left: wallet icon + address + stats row   Right: "Link Wallet" button

const DashboardHeader: React.FC = () => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('GQ98...iA5Y').catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center justify-between py-6 border-b border-border-subtle">
      <div className="flex items-center gap-8">
        {/* Wallet icon + address */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-bg-elevated flex items-center justify-center">
            <WalletIcon />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-18 font-medium text-text-primary">GQ98...iA5Y</span>
              <button
                onClick={handleCopy}
                className="text-text-muted hover:text-text-secondary transition-colors relative"
                title="Copy address"
              >
                <CopyIcon />
                {copied && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-10 bg-bg-elevated text-text-primary whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            </div>
            <span className="text-12 text-text-muted">Open in Explorer</span>
          </div>
        </div>

        <div className="w-px h-8 bg-border-default" />

        {/* Stats */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-0.5">
            <span className="text-12 text-text-muted">Total Trading Vol.</span>
            <span className="text-12 text-text-primary">$18.72K</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-12 text-text-muted">Discount Tier</span>
            <span className="text-12 text-success">-0% Fee</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-12 text-text-muted">XWhales Holding</span>
            <span className="text-12 text-text-primary">0.00</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-12 text-text-muted">Linked Wallets</span>
            <div className="flex items-center gap-2">
              {['0x6...4cd', 'GQ9...A5Y', 'sei...2m6'].map(w => (
                <span key={w} className="px-1.5 py-0.5 rounded bg-bg-elevated text-12 text-text-primary">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button className="flex items-center justify-center px-4 h-9 rounded-lg bg-text-primary text-text-inverse text-14 font-medium hover:bg-neutral-200 transition-colors">
        Link Wallet
      </button>
    </div>
  )
}

// ─── Settlement Banners (Figma 38280:305862) ──────────────────────────────────

const SettleBanners: React.FC = () => (
  <div className="flex items-stretch gap-5">
    {/* Upcoming — blue (Figma 38248:363510) */}
    <div className="flex-1 h-[88px] rounded-xl bg-info-scale-500/20 border border-white/5 relative overflow-hidden flex flex-col justify-center px-6">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-info-scale-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 left-1/4 w-24 h-24 rounded-full bg-info-scale-500/10 blur-2xl pointer-events-none" />
      <span className="text-12 text-white/60 mb-2 relative z-10">Upcoming Settlements</span>
      <div className="flex items-center justify-between relative z-10">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-14 font-medium text-text-primary">
          No markets in upcoming settlements
        </span>
        <div className="flex items-center gap-2">
          <button className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-text-secondary hover:bg-white/20 transition-colors">
            <PageLeftIcon />
          </button>
          <button className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-text-secondary hover:bg-white/20 transition-colors">
            <PageRightIcon />
          </button>
        </div>
      </div>
    </div>

    {/* Current — green (Figma 38248:363650) */}
    <div className="flex-1 h-[88px] rounded-xl bg-accent/20 border border-white/5 relative overflow-hidden flex flex-col justify-center px-6">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-6 left-1/4 w-24 h-24 rounded-full bg-accent/10 blur-2xl pointer-events-none" />
      <span className="text-12 text-white/60 mb-2 relative z-10">Current Settlements</span>
      <div className="flex items-center justify-between relative z-10">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-14 font-medium text-text-primary">
          No markets in current settlements
        </span>
        <div className="flex items-center gap-2">
          <button className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-text-secondary hover:bg-white/20 transition-colors">
            <PageLeftIcon />
          </button>
          <button className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-text-secondary hover:bg-white/20 transition-colors">
            <PageRightIcon />
          </button>
        </div>
      </div>
    </div>
  </div>
)

// ─── InProgressSection (Figma 38064:304593) ──────────────────────────────────
// Open Orders / Filled Orders — filters, sort, search, pagination

const SIDE_OPTIONS: FilterOption[] = [
  { value: 'all',    label: 'All' },
  { value: 'buy',    label: 'Buy',    dotColor: '#5BD197' },
  { value: 'sell',   label: 'Sell',   dotColor: '#FD5E67' },
  { value: 'resell', label: 'Resell', dotColor: '#FACC15' },
]

const BADGE_OPTIONS: FilterOption[] = [
  { value: 'all',  label: 'All' },
  { value: 'Full', label: 'Full' },
  { value: 'RS',   label: 'RS' },
  { value: 'DP',   label: 'DP' },
]

const InProgressSection: React.FC = () => {
  const [activeTab,    setActiveTab]    = useState<'open' | 'filled'>('open')
  const [collapsed,    setCollapsed]    = useState(false)
  const [sideFilter,   setSideFilter]   = useState('all')
  const [badgeFilter,  setBadgeFilter]  = useState('all')
  const [search,       setSearch]       = useState('')
  const [sortKey,      setSortKey]      = useState('createdAt')
  const [sortDir,      setSortDir]      = useState<'asc' | 'desc'>('desc')
  const [currentPage,  setCurrentPage]  = useState(1)

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setCurrentPage(1)
  }, [sortKey])

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1) }, [sideFilter, badgeFilter, search, activeTab])

  const filtered = useMemo(() => {
    let rows = mockOpenOrders.filter(r => {
      if (sideFilter !== 'all' && r.side !== sideFilter) return false
      if (badgeFilter !== 'all' && r.badge !== badgeFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!r.pair.toLowerCase().includes(q)) return false
      }
      return true
    })

    rows = [...rows].sort((a, b) => {
      let av: number = 0, bv: number = 0
      if (sortKey === 'price')    { av = a.price;    bv = b.price }
      if (sortKey === 'amount')   { av = a.amount;   bv = b.amount }
      if (sortKey === 'progress') { av = a.progress; bv = b.progress }
      return sortDir === 'asc' ? av - bv : bv - av
    })

    return rows
  }, [sideFilter, badgeFilter, search, sortKey, sortDir])

  const totalFiltered  = filtered.length
  const totalPages     = Math.max(1, Math.ceil(totalFiltered / ROWS_PER_PAGE))
  const pageRows       = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE)
  const showingText    = totalFiltered === 0
    ? 'Showing 0'
    : `Showing ${(currentPage - 1) * ROWS_PER_PAGE + 1} - ${Math.min(currentPage * ROWS_PER_PAGE, totalFiltered)}`

  // Column definitions
  const columns = [
    { key: 'pair',       label: 'Pair',           width: '14%', align: 'left'  as const },
    { key: 'createdAt',  label: 'Created Time',   width: '11%', align: 'left'  as const },
    { key: 'side',       label: 'Side',           width: '7%',  align: 'left'  as const },
    { key: 'chain',      label: '',               width: '4%',  align: 'left'  as const },
    { key: 'price',      label: 'Price ($)',       width: '8%',  align: 'right' as const, sortable: true },
    { key: 'amount',     label: 'Amount',          width: '8%',  align: 'right' as const, sortable: true },
    { key: 'deposited',  label: 'Deposited',       width: '8%',  align: 'right' as const },
    { key: 'collateral', label: 'Org.Collateral',  width: '10%', align: 'right' as const },
    { key: 'received',   label: 'To be Received',  width: '10%', align: 'right' as const, green: true },
    { key: 'progress',   label: 'Progress',        width: '8%',  align: 'right' as const, sortable: true },
    { key: 'status',     label: 'Status',          width: '6%',  align: 'right' as const },
    { key: 'action',     label: 'Action',          width: '6%',  align: 'right' as const },
  ]

  return (
    <div className="flex flex-col gap-4 pt-4 pb-8">
      {/* Block title row */}
      <div className="flex items-center justify-between h-9">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(v => !v)}
            className="w-9 h-9 rounded-full bg-bg-surface flex items-center justify-center hover:bg-bg-hover transition-colors"
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
          <button
            onClick={() => setActiveTab('open')}
            className={clsx('text-20 font-medium transition-colors', activeTab === 'open' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary')}
          >
            Open Orders
            <TabBadge count={OPEN_ORDERS_TOTAL} active={activeTab === 'open'} />
          </button>
          <button
            onClick={() => setActiveTab('filled')}
            className={clsx('text-20 font-medium transition-colors ml-2', activeTab === 'filled' ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary')}
          >
            Filled Orders
            <TabBadge count={132} active={activeTab === 'filled'} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <FilterDropdown label="Side"   options={SIDE_OPTIONS}  selected={sideFilter}  onChange={setSideFilter} />
          <FilterDropdown label="Status" options={BADGE_OPTIONS}  selected={badgeFilter} onChange={setBadgeFilter} />
          <div className="w-px h-5 bg-border-default" />
          <SearchInput value={search} onChange={setSearch} />
        </div>
      </div>

      {/* Collapsible content */}
      {!collapsed && (
        <>
          <table className="w-full table-fixed">
            <colgroup>
              {columns.map(c => <col key={c.key} style={{ width: c.width }} />)}
            </colgroup>
            <thead>
              <tr className="border-b border-border-subtle">
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={clsx(
                      'h-9 px-2 text-12 font-normal whitespace-nowrap select-none',
                      col.align === 'left' ? 'text-left' : 'text-right',
                      col.green ? 'text-success' : 'text-text-muted',
                      col.sortable && 'cursor-pointer hover:text-text-secondary'
                    )}
                  >
                    {col.label}
                    {col.sortable && <TableSortIcon field={col.key} sortKey={sortKey} sortDir={sortDir} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-10 text-14 text-text-muted">
                    No orders match your filters
                  </td>
                </tr>
              ) : (
                pageRows.map(row => {
                  const dot = TOKEN_DOT_COLORS[row.pair] || { color: '#7A7A83', letter: '?' }
                  const isResell = row.side === 'resell'
                  return (
                    <tr key={row.id} className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors cursor-pointer h-[60px]">
                      {/* Pair */}
                      <td className="px-2">
                        <div className="flex items-center gap-2">
                          <TokenDot {...dot} />
                          <div className="flex flex-col">
                            <span className="text-14 font-medium text-text-primary">{row.pair}</span>
                            {row.badge && (
                              <span className={clsx('text-10 font-medium px-1 py-0.5 rounded w-fit', BADGE_STYLES[row.badge])}>
                                {row.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      {/* Created Time */}
                      <td className="px-2 text-left text-14 text-text-muted">{row.createdAt}</td>
                      {/* Side */}
                      <td className={clsx('px-2 text-left text-14 font-medium', SIDE_COLORS[row.side])}>
                        {SIDE_LABELS[row.side]}
                      </td>
                      {/* Chain badge */}
                      <td className="px-2 text-left">
                        <ChainBadge chain={row.chain} />
                      </td>
                      {/* Price */}
                      <td className={clsx('px-2 text-right text-14', isResell ? 'text-yellow-400' : 'text-text-primary')}>
                        {fmtPrice(row.price)}
                      </td>
                      {/* Amount */}
                      <td className="px-2 text-right text-14 text-text-primary">{fmtAmount(row.amount)}</td>
                      {/* Deposited */}
                      <td className="px-2 text-right text-14 text-text-primary">
                        {fmtDeposited(row.deposited, row.chain)}
                      </td>
                      {/* Org.Collateral */}
                      <td className={clsx('px-2 text-right text-14', isResell ? 'text-yellow-400' : 'text-text-primary')}>
                        {fmtDeposited(row.orgCollateral, row.chain)}
                      </td>
                      {/* To be Received */}
                      <td className="px-2 text-right text-14 text-text-primary">
                        {row.toReceive !== null ? fmtDeposited(row.toReceive, row.chain) : '—'}
                      </td>
                      {/* Progress */}
                      <td className="px-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-12 h-1 rounded-full bg-bg-elevated overflow-hidden">
                            <div className="h-full rounded-full bg-success" style={{ width: `${row.progress}%` }} />
                          </div>
                          <span className="text-12 text-text-muted">{row.progress.toFixed(1)}%</span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-2 text-right text-12 text-text-muted">—</td>
                      {/* Action */}
                      <td className="px-2 text-right">
                        <button className="text-12 font-medium text-text-primary hover:text-text-secondary transition-colors">
                          Close
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>

          <Pagination
            showing={showingText}
            total={totalFiltered}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

// ─── EndedSection (Figma 38064:304594) ───────────────────────────────────────

const ENDED_SIDE_OPTIONS: FilterOption[] = [
  { value: 'all',    label: 'All' },
  { value: 'buy',    label: 'Buy',    dotColor: '#5BD197' },
  { value: 'sell',   label: 'Sell',   dotColor: '#FD5E67' },
  { value: 'resell', label: 'Resell', dotColor: '#FACC15' },
]

const ENDED_STATUS_OPTIONS: FilterOption[] = [
  { value: 'all',      label: 'All' },
  { value: 'settled',  label: 'Settled',  dotColor: '#5BD197' },
  { value: 'canceled', label: 'Canceled', dotColor: '#7A7A83' },
  { value: 'claimed',  label: 'Claimed',  dotColor: '#7A7A83' },
  { value: 'closed',   label: 'Closed',   dotColor: '#7A7A83' },
  { value: 'resold',   label: 'Resold',   dotColor: '#FACC15' },
]

const EndedSection: React.FC = () => {
  const [collapsed,   setCollapsed]   = useState(false)
  const [subTab,      setSubTab]      = useState<'settle' | 'cancel'>('settle')
  const [sideFilter,  setSideFilter]  = useState('all')
  const [statusFilt,  setStatusFilt]  = useState('all')
  const [search,      setSearch]      = useState('')
  const [sortKey,     setSortKey]     = useState('time')
  const [sortDir,     setSortDir]     = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setCurrentPage(1)
  }, [sortKey])

  useEffect(() => { setCurrentPage(1) }, [subTab, sideFilter, statusFilt, search])

  const filtered = useMemo(() => {
    let rows = mockEndedOrders.filter(r => {
      if (r.settleType !== subTab) return false
      if (sideFilter !== 'all' && r.side !== sideFilter) return false
      if (statusFilt !== 'all' && r.status !== statusFilt) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!r.pair.toLowerCase().includes(q)) return false
      }
      return true
    })

    rows = [...rows].sort((a, b) => {
      let av = 0, bv = 0
      if (sortKey === 'price')  { av = a.price;  bv = b.price }
      if (sortKey === 'amount') { av = a.amount; bv = b.amount }
      return sortDir === 'asc' ? av - bv : bv - av
    })

    return rows
  }, [subTab, sideFilter, statusFilt, search, sortKey, sortDir])

  const totalFiltered = filtered.length
  // Use real total for the settle/cancel subtabs (from mock constants)
  const displayTotal  = subTab === 'settle' ? ENDED_ORDERS_TOTAL : ENDED_CANCEL_COUNT
  const totalPages    = Math.max(1, Math.ceil(totalFiltered / ROWS_PER_PAGE))
  const pageRows      = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE)
  const showingText   = totalFiltered === 0
    ? 'Showing 0'
    : `Showing ${(currentPage - 1) * ROWS_PER_PAGE + 1} - ${Math.min(currentPage * ROWS_PER_PAGE, totalFiltered)}`

  const columns = [
    { key: 'pair',      label: 'Pair',         width: '14%', align: 'left'  as const },
    { key: 'time',      label: 'Time',         width: '12%', align: 'left'  as const },
    { key: 'side',      label: 'Side',         width: '8%',  align: 'left'  as const },
    { key: 'price',     label: 'Price ($)',     width: '8%',  align: 'right' as const, sortable: true },
    { key: 'orgPrice',  label: 'Org.Price ($)', width: '8%',  align: 'right' as const },
    { key: 'amount',    label: 'Amount',        width: '8%',  align: 'right' as const, sortable: true },
    { key: 'deposited', label: 'Deposited',     width: '8%',  align: 'right' as const },
    { key: 'received',  label: 'Received',      width: '8%',  align: 'right' as const },
    { key: 'received2', label: 'Received',      width: '7%',  align: 'right' as const },
    { key: 'status',    label: 'Status',        width: '8%',  align: 'right' as const },
    { key: 'action',    label: 'Operation',     width: '11%', align: 'right' as const },
  ]

  return (
    <div className="flex flex-col gap-4 pt-4 pb-8">
      {/* Block title */}
      <div className="flex items-center justify-between h-9">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(v => !v)}
            className="w-9 h-9 rounded-full bg-bg-surface flex items-center justify-center hover:bg-bg-hover transition-colors"
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
          <span className="text-20 font-medium text-text-primary">
            Ended Settlement
            <TabBadge count={ENDED_ORDERS_TOTAL} active />
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FilterDropdown label="Side"   options={ENDED_SIDE_OPTIONS}   selected={sideFilter} onChange={setSideFilter} />
          <FilterDropdown label="Status" options={ENDED_STATUS_OPTIONS}  selected={statusFilt} onChange={setStatusFilt} />
          <div className="w-px h-5 bg-border-default" />
          <SearchInput value={search} onChange={setSearch} />
          <div className="w-px h-5 bg-border-default" />

          {/* Settle / Cancel sub-tabs (Figma 37906:10134) */}
          <div className="flex items-center rounded-lg border border-border-default bg-bg-base p-0.5">
            {(['settle', 'cancel'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={clsx(
                  'flex items-center gap-1 px-3 h-8 rounded-md text-12 font-medium transition-colors capitalize',
                  subTab === tab ? 'bg-bg-surface text-text-primary' : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className={clsx(
                  'px-1.5 py-0.5 rounded-full text-10 font-medium',
                  subTab === tab ? 'bg-accent/20 text-success' : 'bg-bg-elevated text-text-muted'
                )}>
                  {tab === 'settle' ? ENDED_SETTLE_COUNT : ENDED_CANCEL_COUNT}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {!collapsed && (
        <>
          <table className="w-full table-fixed">
            <colgroup>
              {columns.map(c => <col key={c.key} style={{ width: c.width }} />)}
            </colgroup>
            <thead>
              <tr className="border-b border-border-subtle">
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={clsx(
                      'h-9 px-2 text-12 font-normal whitespace-nowrap text-text-muted select-none',
                      col.align === 'left' ? 'text-left' : 'text-right',
                      col.sortable && 'cursor-pointer hover:text-text-secondary'
                    )}
                  >
                    {col.label}
                    {col.sortable && <TableSortIcon field={col.key} sortKey={sortKey} sortDir={sortDir} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-10 text-14 text-text-muted">
                    No orders match your filters
                  </td>
                </tr>
              ) : (
                pageRows.map(row => {
                  const dot = TOKEN_DOT_COLORS[row.pair] || { color: '#7A7A83', letter: '?' }
                  const isResell = row.side === 'resell'
                  return (
                    <tr key={row.id} className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors cursor-pointer h-[60px]">
                      <td className="px-2">
                        <div className="flex items-center gap-2">
                          <TokenDot {...dot} />
                          <div className="flex flex-col">
                            <span className="text-14 font-medium text-text-primary">{row.pair}</span>
                            {row.badge && (
                              <span className={clsx('text-10 font-medium px-1 py-0.5 rounded w-fit', BADGE_STYLES[row.badge])}>
                                {row.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 text-left text-14 text-text-muted truncate">{row.time}</td>
                      <td className={clsx('px-2 text-left text-14 font-medium', SIDE_COLORS[row.side])}>
                        {SIDE_LABELS[row.side]}
                      </td>
                      <td className={clsx('px-2 text-right text-14', isResell ? 'text-yellow-400' : 'text-text-primary')}>
                        {fmtPrice(row.price)}
                      </td>
                      <td className="px-2 text-right text-14 text-text-muted">
                        {row.orgPrice !== null ? fmtPrice(row.orgPrice) : '—'}
                      </td>
                      <td className="px-2 text-right text-14 text-text-primary">{fmtAmount(row.amount)}</td>
                      <td className={clsx('px-2 text-right text-14', isResell ? 'text-yellow-400' : 'text-text-primary')}>
                        {fmtAmount(row.deposited)}
                      </td>
                      <td className="px-2 text-right text-14 text-text-primary">{fmtAmount(row.received)}</td>
                      <td className="px-2 text-right text-14 text-text-muted">—</td>
                      <td className={clsx('px-2 text-right text-12 font-medium', STATUS_COLORS[row.status])}>
                        {STATUS_LABELS[row.status]}
                      </td>
                      <td className="px-2 text-right">
                        {row.hasAction ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-12 font-medium text-info">Ongoing</span>
                            <button className="text-text-muted hover:text-text-secondary transition-colors">
                              <PageRightIcon />
                            </button>
                          </div>
                        ) : (
                          <span className="text-12 text-text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>

          <Pagination
            showing={showingText}
            total={displayTotal}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showGoTo
          />
        </>
      )}
    </div>
  )
}

// ─── BottomStats (Figma 38045:245626) ────────────────────────────────────────

const BottomStats: React.FC = () => (
  <div className="flex items-center justify-between h-11 border-t border-border-subtle px-4">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-12 font-medium text-success">LIVE DATA</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-12 text-text-secondary">Total Vol</span>
        <span className="text-12 text-text-primary">$5,375,932.81</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-12 text-text-secondary">Vol 24h</span>
        <span className="text-12 text-text-primary">$832,750.55</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {['Docs', 'Dune', 'Link3'].map(link => (
        <span key={link} className="text-12 text-text-muted hover:text-text-secondary cursor-pointer transition-colors">
          {link}
        </span>
      ))}
    </div>
  </div>
)

// ─── Main Page (Figma 38045:245592) ──────────────────────────────────────────

export const MyDashboardPage: React.FC = () => (
  <div className="max-w-[1280px] mx-auto px-8 py-4 flex flex-col gap-4">
    {/* Breadcrumb — Figma 38045:245595 */}
    <Breadcrumb />

    {/* Dashboard Header — Figma 43176:141877 */}
    <DashboardHeader />

    {/* Dashboard Data — Figma 38045:245598, py-6, gap-4 */}
    <div className="py-6 flex flex-col gap-4">
      {/* Settle Banners — Figma 38280:305862 */}
      <SettleBanners />
      {/* In-Progress / Open Orders — Figma 38064:304593 */}
      <InProgressSection />
      {/* Ended Settlement — Figma 38064:304594 */}
      <EndedSection />
    </div>

    {/* Bottom Stats — Figma 38045:245626 */}
    <BottomStats />
  </div>
)
