import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ChevronLeft, ChevronRight, Filter,
  ArrowUpDown, ArrowUp, ArrowDown, ArrowUpRight, Radio,
} from 'lucide-react'
import { DownFillIcon } from '@/components/ui/icons/DownFillIcon'
import skateLogoImg from '@/assets/images/skate-logo.png'
import { clsx } from 'clsx'
import { PageWrapper } from '@/components/layout/PageWrapper'
import {
  mockHomeMarkets, mockHomeRecentTrades, mockUpcomingListings,
  HOME_STATS, METRICS,
  type HomeMarket, type HomeRecentTrade,
} from '@/mock-data/homeData'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtPrice = (p: number) => {
  if (p === 0) return '0.00'
  if (p < 0.001) return p.toFixed(8)
  if (p < 1) return p.toFixed(4)
  return p.toFixed(4)
}

const fmtVol = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`
  return n.toFixed(2)
}

const ChangeTag: React.FC<{ value: number; size?: 'sm' | 'md' }> = ({ value, size = 'md' }) => {
  const pos = value >= 0
  return (
    <span className={clsx(
      'font-medium tabular-nums',
      size === 'sm' ? 'text-12' : 'text-14',
      pos ? 'text-[#5bd197]' : 'text-[#fd5e67]',
    )}>
      {pos ? '+' : ''}{value.toFixed(2)}%
    </span>
  )
}

const NetworkBadge: React.FC<{ network: HomeMarket['network'] }> = ({ network }) => {
  const colors: Record<string, string> = {
    ethereum: '#627eea',
    solana:   '#9945ff',
    base:     '#0052ff',
    bnb:      '#f0b90b',
  }
  return (
    <span
      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0a0a0b]"
      style={{ background: colors[network] ?? '#888' }}
    />
  )
}

// ─── Tab Badge ────────────────────────────────────────────────────────────────

const TabBadge: React.FC<{ count: number; active: boolean }> = ({ count, active }) => (
  <span className={clsx(
    'inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-10 font-semibold tabular-nums leading-none',
    active ? 'bg-[#16c284] text-white' : 'bg-[#1b1b1c] text-[#b4b4ba]',
  )}>
    {count}
  </span>
)

// ─── 1. Upcoming Section ──────────────────────────────────────────────────────

const UpcomingSection: React.FC = () => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-4 flex-wrap">
        <h2 className="text-20 font-semibold text-[#f9f9fa]">Upcoming</h2>
        <div className="flex items-center gap-1">
          <span className="text-14 text-[#7a7a83]">Trade pre-TGE token allocations.</span>
          <button className="text-14 text-[#7a7a83] hover:text-[#f9f9fa] transition-colors underline underline-offset-2 ml-1">
            How it works?
          </button>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        {([ChevronLeft, ChevronRight] as const).map((Icon, i) => (
          <button
            key={i}
            className="w-9 h-9 rounded-full border border-[#252527] flex items-center justify-center text-[#7a7a83] hover:text-[#f9f9fa] hover:border-[#3a3a3f] active:bg-[#252527] transition-colors"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mockUpcomingListings.map((listing, idx) => (
        <div
          key={idx}
          className="flex items-center gap-4 p-5 rounded-[12px] bg-[rgba(255,255,255,0.03)] border border-[#252527] hover:border-[#3a3a3f] hover:bg-[rgba(255,255,255,0.05)] transition-all cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-full bg-[#252527] flex items-center justify-center text-2xl shrink-0">
            {listing.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-16 font-semibold text-[#f9f9fa]">{listing.token}</span>
              <span className="px-1.5 py-0.5 rounded-full text-10 font-semibold bg-[#5bd197]/10 text-[#5bd197]">SOON</span>
            </div>
            <span className="text-14 text-[#7a7a83]">{listing.tokenName}</span>
          </div>

          <div className="text-right shrink-0">
            {listing.status === 'countdown' && listing.countdown ? (
              <div className="flex items-baseline gap-0.5">
                {[
                  { v: listing.countdown.days,    u: 'd' },
                  { v: listing.countdown.hours,   u: 'h' },
                  { v: listing.countdown.minutes, u: 'm' },
                ].map(({ v, u }) => (
                  <span key={u} className="flex items-baseline">
                    <span className="text-16 font-semibold text-[#f9f9fa]">{v}</span>
                    <span className="text-14 text-[#7a7a83]">{u}</span>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-14 text-[#7a7a83]">To be announced</span>
            )}
            <p className="text-10 text-[#7a7a83] text-right mt-0.5">listing time</p>
          </div>

          <Link
            to="/market"
            className="shrink-0 px-4 py-2 rounded-xl bg-white text-14 font-semibold text-[#0a0a0b] hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
          >
            See details
          </Link>
        </div>
      ))}
    </div>
  </div>
)

// ─── 2. Top Metrics ───────────────────────────────────────────────────────────

// Pre-market line chart — SVG with draw animation on mount
// Grid lines removed per Figma — only line + subtle area gradient
const VOL_PTS = [28, 40, 34, 52, 38, 58, 48, 68, 55, 72, 62, 80]

const PremarketChart: React.FC = () => {
  const lineRef = useRef<SVGPathElement>(null)
  const [pathLen, setPathLen] = useState(0)
  const [animated, setAnimated] = useState(false)

  const W = 284, H = 48
  const pts = VOL_PTS.map((v, i) => ({
    x: (i / (VOL_PTS.length - 1)) * W,
    y: H - (v / 100) * H,
  }))
  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const areaPath = linePath + ` L ${W} ${H} L 0 ${H} Z`

  useEffect(() => {
    if (lineRef.current) {
      const len = lineRef.current.getTotalLength()
      setPathLen(len)
      requestAnimationFrame(() => setTimeout(() => setAnimated(true), 30))
    }
  }, [])

  const dash = pathLen || 800

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        {/* Figma: area gradient subtle — stopOpacity 0.12 at top, 0 at bottom */}
        <linearGradient id="volAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#16C284" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#16C284" stopOpacity="0"    />
        </linearGradient>
      </defs>
      {/* Area fill — fades in after line draws */}
      <path
        d={areaPath}
        fill="url(#volAreaGrad)"
        style={{ opacity: animated ? 1 : 0, transition: 'opacity 0.5s ease 0.7s' }}
      />
      {/* Line — animates left → right on mount */}
      <path
        ref={lineRef}
        d={linePath}
        fill="none"
        stroke="#16C284"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: dash,
          strokeDashoffset: animated ? 0 : dash,
          transition: pathLen ? 'stroke-dashoffset 0.9s ease' : 'none',
        }}
      />
    </svg>
  )
}

// Fear & Greed — semicircle gauge with pink→orange→green gradient arc + dot indicator
const FearGreedGauge: React.FC<{ score: number }> = ({ score }) => {
  const cx = 58, cy = 58, R = 50
  const angleRad = Math.PI - (score / 100) * Math.PI
  const dotX = cx + R * Math.cos(angleRad)
  const dotY = cy - R * Math.sin(angleRad)

  const label =
    score < 25 ? 'Extreme Fear'
    : score < 45 ? 'Fear'
    : score < 55 ? 'Neutral'
    : score < 75 ? 'Greed'
    : 'Extreme Greed'

  return (
    <div className="flex flex-col items-center">
      <svg width="116" height="64" viewBox="0 0 116 64" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="fgArcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#EC4899" />
            <stop offset="50%"  stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#16C284" />
          </linearGradient>
        </defs>
        <path
          d="M 8 58 A 50 50 0 0 1 108 58"
          fill="none"
          stroke="url(#fgArcGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <text x="58" y="52" textAnchor="middle" fill="#f9f9fa"
          fontSize="28" fontWeight="500" fontFamily="Inter Variable, sans-serif">
          {score}
        </text>
        {/* Dot: r=8 (16px dia) | fill=#f9f9fa | stroke=#1b1b1c 4px */}
        <circle cx={dotX} cy={dotY} r="8" fill="#f9f9fa" stroke="#1b1b1c" strokeWidth="4" />
      </svg>
      <span className="text-12 text-[#7a7a83] -mt-1">{label}</span>
    </div>
  )
}

const TopMetrics: React.FC = () => {
  const [secs, setSecs] = useState(12)
  const [mins, setMins] = useState(33)
  const [hrs,  setHrs]  = useState(2)
  const [days, setDays] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setSecs(s => {
        if (s > 0) return s - 1
        setMins(m => {
          if (m > 0) return m - 1
          setHrs(h => {
            if (h > 0) return h - 1
            setDays(d => (d > 0 ? d - 1 : 0))
            return h > 0 ? 23 : 0
          })
          return m > 0 ? 59 : 0
        })
        return 59
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      {/* ── Card 1: Pre-market 24h vol — NO border per Figma ── */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-[10px] pt-4 pb-5 px-5 flex flex-col gap-3">
        <p className="text-12 font-medium text-[#7a7a83]">Pre-market 24h vol.</p>
        <div className="flex items-baseline gap-2">
          <span className="text-24 font-medium text-[#f9f9fa]">{METRICS.premarket24Vol.value}</span>
          <ChangeTag value={12.5} size="sm" />
        </div>
        <PremarketChart />
      </div>

      {/* ── Card 2: Fear & Greed — NO border ── */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-[10px] pt-4 pb-5 px-5 flex flex-col gap-2">
        <p className="text-12 font-medium text-[#7a7a83]">Fear &amp; Greed</p>
        <div className="flex flex-col items-center justify-center flex-1 pt-2">
          <FearGreedGauge score={METRICS.fearGreed.score} />
        </div>
      </div>

      {/* ── Card 3: Altcoin season — NO border, NO % labels ── */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-[10px] pt-4 pb-5 px-5 flex flex-col gap-2">
        <p className="text-12 font-medium text-[#7a7a83]">Altcoin season</p>
        <div className="flex items-baseline gap-0.5">
          <span className="text-24 font-medium text-[#f9f9fa]">{METRICS.altcoinSeason.score}</span>
          <span className="text-24 font-medium text-[#7a7a83]">/100</span>
        </div>
        <div className="flex flex-col gap-2 flex-1 justify-end">
          <div className="flex justify-between text-12 font-medium">
            <span className="text-[#f9f9fa]">Bitcoin</span>
            <span className="text-[#f9f9fa]">Altcoin</span>
          </div>
          {/* Gradient bar + dot: 16×16 r=8 stroke=4px — 30%/70% labels removed per Figma */}
          <div className="relative h-2 w-full">
            <div
              className="h-2 w-full rounded-full"
              style={{ background: 'linear-gradient(to right, #F9F9FA 1%, #16C284 100%)' }}
            />
            <div
              className="absolute top-1/2 w-4 h-4 rounded-full bg-[#f9f9fa] border-[4px] border-[#1b1b1c]"
              style={{ left: `${METRICS.altcoinSeason.altcoinPct}%`, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>
      </div>

      {/* ── Card 4: Next settlement — NO border ── */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-[10px] pt-4 pb-5 px-5 flex flex-col gap-4">
        <p className="text-12 font-medium text-[#7a7a83]">Next settlement</p>
        {/* Token + date row */}
        <div className="flex items-center gap-2">
          <img src={skateLogoImg} alt="SKATE" className="w-9 h-9 rounded-full object-cover shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-14 font-medium text-[#f9f9fa]">{METRICS.nextSettlement.token}</span>
            {/* Date format: 09/06/2025 14:00 (UTC) per user spec */}
            <span className="text-12 text-[#7a7a83]">{METRICS.nextSettlement.date}</span>
          </div>
        </div>
        {/* Countdown tiles — number 14px/500, unit 12px/500, inline same row */}
        <div className="flex items-center gap-1.5">
          {[
            { val: pad(days), unit: 'd' },
            { val: pad(hrs),  unit: 'h' },
            { val: pad(mins), unit: 'm' },
            { val: pad(secs), unit: 's' },
          ].map(({ val, unit }) => (
            <div key={unit} className="flex items-center justify-center gap-0.5 bg-[#1b1b1c] rounded-lg px-2 py-1.5 flex-1">
              <span className="text-14 font-medium text-[#f9f9fa] tabular-nums leading-none">{val}</span>
              <span className="text-12 font-medium text-[#7a7a83] leading-none">{unit}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── 3. Live Market Table ─────────────────────────────────────────────────────

type SortKey = 'price' | 'vol24h' | 'totalVol' | 'fdv' | 'priceChange24h'

const LiveMarketTable: React.FC = () => {
  const navigate = useNavigate()
  const [tab, setTab]       = useState<'live' | 'upcoming' | 'ended'>('live')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('vol24h')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SIcon: React.FC<{ field: SortKey }> = ({ field }) => {
    if (field !== sortKey) return <ArrowUpDown size={12} className="opacity-30" />
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="text-[#16c284]" />
      : <ArrowDown size={12} className="text-[#16c284]" />
  }

  const markets = mockHomeMarkets
    .filter(m => {
      const q = search.toLowerCase()
      return m.token.toLowerCase().includes(q) || m.tokenName.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      return (a[sortKey] > b[sortKey] ? 1 : -1) * dir
    })

  const TABS = [
    { id: 'live',     label: 'Live Market', count: HOME_STATS.liveMarketCount },
    { id: 'upcoming', label: 'Upcoming',    count: HOME_STATS.upcomingCount },
    { id: 'ended',    label: 'Ended',       count: HOME_STATS.endedCount },
  ] as const

  return (
    <div className="mb-6">

      {/* Tab bar + controls */}
      <div className="flex items-center justify-between border-b border-[#1b1b1c]">
        <div className="flex items-center gap-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                'flex items-center gap-2 py-3 text-20 font-medium transition-all whitespace-nowrap',
                tab === t.id
                  ? 'text-[#f9f9fa]'
                  : 'text-[#7a7a83] hover:text-[#b4b4ba]',
              )}
            >
              {t.label}
              <TabBadge count={t.count} active={tab === t.id} />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 py-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1b1b1c] border border-[#1b1b1c] focus-within:border-[#2e2e34] transition-colors w-56">
            <Search size={14} className="text-[#7a7a83] shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent text-14 text-[#f9f9fa] placeholder:text-[#7a7a83] focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1b1b1c] border border-[#1b1b1c] hover:border-[#2e2e34] active:bg-[#252527] transition-colors text-14 font-semibold text-[#f9f9fa] whitespace-nowrap">
            <Filter size={14} className="text-[#7a7a83]" />
            <span>Network</span>
            <DownFillIcon size={14} className="text-[#7a7a83]" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 1120 }}>
          <thead>
            <tr className="border-b border-[#1b1b1c]">
              {([
                { label: 'Token',              field: null,           w: 368 },
                { label: 'Last Price ($)',      field: 'price',        w: 192 },
                { label: '24h Vol. ($)',         field: 'vol24h',       w: 192 },
                { label: 'Total Vol. ($)',       field: 'totalVol',     w: 192 },
                { label: 'Implied FDV ($)',      field: 'fdv',          w: 192 },
                { label: 'Collateral Token',    field: null,           w: 160 },
                { label: 'Settle Time (UTC)',   field: null,           w: 192 },
                { label: 'Status',              field: null,           w: 180 },
              ] as { label: string; field: SortKey | null; w: number }[]).map(col => (
                <th
                  key={col.label}
                  style={{ width: col.w, minWidth: col.w }}
                  onClick={() => col.field && handleSort(col.field as SortKey)}
                  className={clsx(
                    'py-2 pl-4 pr-0 text-12 font-medium text-[#7a7a83] text-left whitespace-nowrap',
                    col.field && 'cursor-pointer hover:text-[#f9f9fa] transition-colors select-none',
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.field && <SIcon field={col.field as SortKey} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {markets.map(market => (
              <tr
                key={market.id}
                onClick={() => navigate(`/market/${market.id}`)}
                className="border-b border-[#1b1b1c] hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer group"
              >

                  {/* Token */}
                  <td className="pl-4 pr-0 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0 w-11 h-11 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-[#252527] flex items-center justify-center text-lg">
                          {market.logo}
                        </div>
                        <NetworkBadge network={market.network} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-14 font-semibold text-[#f9f9fa] group-hover:text-[#16c284] transition-colors">
                            {market.token}
                          </span>
                          {market.isNew && (
                            <span className="px-1.5 py-0.5 rounded-full text-10 font-semibold bg-blue-500/10 text-[#60a5fa]">
                              New
                            </span>
                          )}
                        </div>
                        <span className="text-14 font-normal text-[#7a7a83]">{market.tokenName}</span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="pl-4 pr-0 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-14 font-semibold text-[#f9f9fa] tabular-nums">${fmtPrice(market.price)}</span>
                      <ChangeTag value={market.priceChange24h} size="sm" />
                    </div>
                  </td>

                  {/* 24h Vol */}
                  <td className="pl-4 pr-0 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-14 font-semibold text-[#f9f9fa] tabular-nums">{fmtVol(market.vol24h)}</span>
                      <ChangeTag value={market.vol24hChange} size="sm" />
                    </div>
                  </td>

                  {/* Total Vol */}
                  <td className="pl-4 pr-0 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-14 font-semibold text-[#f9f9fa] tabular-nums">{fmtVol(market.totalVol)}</span>
                      <ChangeTag value={market.totalVolChange} size="sm" />
                    </div>
                  </td>

                  {/* FDV */}
                  <td className="pl-4 pr-0 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-14 font-semibold text-[#f9f9fa] tabular-nums">{market.fdv.toFixed(2)}M</span>
                      <ChangeTag value={market.fdvChange} size="sm" />
                    </div>
                  </td>

                  {/* Collateral */}
                  <td className="pl-4 pr-0 py-4">
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#252527]">
                      <span className="text-12 font-semibold text-[#f9f9fa]">{market.collateral}</span>
                    </div>
                  </td>

                  {/* Settle Time */}
                  <td className="pl-4 pr-0 py-4">
                    {market.status === 'in-progress' ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-14 font-semibold text-[#fb923c] tabular-nums">
                          {market.settleCountdown}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-10 font-semibold bg-[#f97316]/10 text-[#fb923c] w-fit">
                          IN PROGRESS
                        </span>
                      </div>
                    ) : market.settleDisplay === 'TBA' ? (
                      <span className="text-14 font-normal text-[#7a7a83]">TBA</span>
                    ) : (
                      <span className="text-14 font-medium text-[#f9f9fa]">{market.settleDisplay}</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="pl-4 pr-0 py-4">
                    {market.status === 'upcoming' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-10 font-semibold bg-[#5bd197]/10 text-[#5bd197]">
                        Upcoming
                      </span>
                    )}
                    {market.status === 'active' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-10 font-semibold bg-[#16c284]/10 text-[#16c284]">
                        Active
                      </span>
                    )}
                  </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── 4. Recent Trades Table ───────────────────────────────────────────────────

const RecentTradesTable: React.FC = () => {

  return (
    <div className="mb-6">

      {/* Tab bar + controls */}
      <div className="flex items-center justify-between border-b border-[#1b1b1c]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 py-3 text-20 font-medium text-[#f9f9fa] whitespace-nowrap">
            Recent Trades
            <TabBadge count={mockHomeRecentTrades.length} active={true} />
          </span>
        </div>

        <div className="flex items-center gap-2 py-3">
          <button className="px-4 py-1.5 rounded-full border border-[#252527] text-14 font-semibold text-[#f9f9fa] hover:border-[#3a3a3f] active:bg-[#252527] transition-colors whitespace-nowrap">
            Show All
          </button>
          {([ChevronLeft, ChevronRight] as const).map((Icon, i) => (
            <button
              key={i}
              className="w-9 h-9 rounded-full border border-[#252527] flex items-center justify-center text-[#7a7a83] hover:text-[#f9f9fa] hover:border-[#3a3a3f] active:bg-[#252527] transition-colors"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: 1120 }}>
          <thead>
            <tr className="border-b border-[#1b1b1c]">
              {[
                { label: 'Time',        w: 128 },
                { label: 'Side',        w: 128 },
                { label: 'Market Type', w: 182 },
                { label: 'Pair',        w: 304 },
                { label: 'Price ($)',   w: 192 },
                { label: 'Amount',      w: 192 },
                { label: 'Collateral',  w: 192 },
                { label: 'Tx.ID',       w: 192 },
              ].map(col => (
                <th
                  key={col.label}
                  style={{ width: col.w, minWidth: col.w }}
                  className="py-2 pl-4 pr-0 text-12 font-medium text-[#7a7a83] text-left whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockHomeRecentTrades.map((trade: HomeRecentTrade) => (
              <tr
                key={trade.id}
                className="border-b border-[#1b1b1c] hover:bg-[rgba(255,255,255,0.02)] transition-colors group h-[60px]"
              >
                {/* Time */}
                <td className="pl-4 pr-0 py-4">
                  <span className="text-14 font-normal text-[#7a7a83] whitespace-nowrap">{trade.timeAgo}</span>
                </td>

                {/* Side */}
                <td className="pl-4 pr-0 py-4">
                  <div className="flex items-center gap-2">
                    <span className={clsx(
                      'text-14 font-semibold',
                      trade.side === 'buy' ? 'text-[#5bd197]' : 'text-[#fd5e67]',
                    )}>
                      {trade.side === 'buy' ? 'Buy' : 'Sell'}
                    </span>
                    <span className="w-[22px] h-[22px] rounded-full bg-[#eab308]/10 inline-flex items-center justify-center text-10 font-semibold text-[#eab308] shrink-0">
                      {trade.userAvatar}
                    </span>
                  </div>
                </td>

                {/* Market Type */}
                <td className="pl-4 pr-0 py-4">
                  <span className="text-14 font-semibold text-[#f9f9fa]">{trade.marketType}</span>
                </td>

                {/* Pair */}
                <td className="pl-4 pr-0 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#252527] flex items-center justify-center shrink-0">
                      <span className="text-[9px] font-semibold text-[#7a7a83]">◆</span>
                    </div>
                    <span className="text-14 font-semibold text-[#f9f9fa]">{trade.pair}</span>
                  </div>
                </td>

                {/* Price */}
                <td className="pl-4 pr-0 py-4">
                  <span className="text-14 font-semibold text-[#f9f9fa] tabular-nums">
                    {fmtPrice(trade.price)}
                  </span>
                </td>

                {/* Amount */}
                <td className="pl-4 pr-0 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-14 font-semibold text-[#f9f9fa] tabular-nums">{trade.amount}</span>
                      <span className="text-12 font-semibold text-[#5bd197] tabular-nums">{trade.collateral.toFixed(2)}</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#252527] flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-[#f9f9fa]">$</span>
                    </div>
                  </div>
                </td>

                {/* Collateral */}
                <td className="pl-4 pr-0 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-14 font-semibold text-[#f9f9fa] tabular-nums">{trade.collateral.toFixed(2)}</span>
                      <span className={clsx(
                        'text-12 font-semibold tabular-nums',
                        trade.discount >= 0 ? 'text-[#5bd197]' : 'text-[#5bd197]',
                      )}>
                        {trade.discount > 0 ? '+' : ''}{trade.discount.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#252527] flex items-center justify-center shrink-0">
                      <span className="text-[8px] font-bold text-[#f9f9fa]">$</span>
                    </div>
                    <span className="text-14 shrink-0">🦈</span>
                  </div>
                </td>

                {/* Tx.ID */}
                <td className="pl-4 pr-0 py-4">
                  <button
                    onClick={e => e.stopPropagation()}
                    className="w-[52px] h-7 border border-[#252527] rounded-md flex items-center justify-center text-[#7a7a83] hover:text-[#f9f9fa] hover:border-[#3a3a3f] active:bg-[#252527] transition-colors"
                    aria-label="View transaction"
                  >
                    <ArrowUpRight size={14} />
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// ─── 5. Bottom Stats Bar ──────────────────────────────────────────────────────

const BottomStats: React.FC = () => (
  <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 rounded-xl border border-[#1b1b1c] bg-[#0a0a0b]">
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex items-center gap-2">
        <Radio size={14} className="text-[#5bd197]" />
        <span className="text-12 font-semibold text-[#5bd197] tracking-wider">LIVE DATA</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-12 text-[#7a7a83]">Total Vol</span>
        <span className="text-12 font-medium text-[#f9f9fa]">{HOME_STATS.totalVol}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-12 text-[#7a7a83]">Vol 24h</span>
        <span className="text-12 font-medium text-[#f9f9fa]">{HOME_STATS.vol24h}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-12 text-[#7a7a83]">Live Markets</span>
        <span className="text-12 font-medium text-[#f9f9fa]">{HOME_STATS.liveMarketCount}</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      {['Docs', 'Dune', 'Link3'].map(link => (
        <button
          key={link}
          className="text-12 text-[#7a7a83] hover:text-[#f9f9fa] flex items-center gap-1 transition-colors"
        >
          {link}
          <ArrowUpRight size={10} />
        </button>
      ))}
      <div className="flex items-center gap-2">
        {[{ icon: '𝕏', label: 'Twitter' }, { icon: '💬', label: 'Discord' }].map(({ icon, label }) => (
          <button
            key={label}
            aria-label={label}
            className="w-7 h-7 rounded-lg bg-[#1b1b1c] flex items-center justify-center text-[#7a7a83] hover:text-[#f9f9fa] hover:bg-[#252527] active:bg-[#2e2e34] transition-colors"
          >
            <span className="text-11">{icon}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
)

// ─── Page ─────────────────────────────────────────────────────────────────────

export const LandingPage: React.FC = () => (
  <div className="py-4">
    <PageWrapper>
      <TopMetrics />
      <LiveMarketTable />
      <RecentTradesTable />
      <BottomStats />
    </PageWrapper>
  </div>
)
