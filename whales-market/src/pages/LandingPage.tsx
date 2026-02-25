import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ChevronLeft, ChevronRight,
  ArrowUpRight, Radio,
} from 'lucide-react'
import { DownFillIcon } from '@/components/ui/icons/DownFillIcon'
import skateLogoImg    from '@/assets/images/skate-logo.png'
import chainSolanaImg  from '@/assets/images/chain-solana.png'
import chainEthImg     from '@/assets/images/chain-ethereum.png'
import chainHlImg      from '@/assets/images/chain-monad.png'
import chainBnbImg     from '@/assets/images/chain-bnb.png'
import tokenSkateImg   from '@/assets/images/token-skate.png'
import tokenEraImg     from '@/assets/images/token-era.png'
import tokenGrassImg   from '@/assets/images/token-grass.png'
import tokenLoudImg    from '@/assets/images/token-loud.png'
import tokenMmtImg     from '@/assets/images/token-mmt.png'
import tokenZbtImg     from '@/assets/images/token-zbt.png'
import investor1Img    from '@/assets/images/investor1.png'
import investor2Img    from '@/assets/images/investor2.png'
import investor3Img    from '@/assets/images/investor3.png'
import investor4Img    from '@/assets/images/investor4.png'
import investor5Img    from '@/assets/images/investor5.png'
import { clsx } from 'clsx'
import { PageWrapper } from '@/components/layout/PageWrapper'
import {
  mockHomeMarkets, mockHomeRecentTrades, mockUpcomingListings, mockEndedMarkets,
  HOME_STATS, METRICS,
  type HomeMarket, type HomeRecentTrade, type UpcomingListing,
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

// Figma: change % — 14px/400/#5BD197 (positive) or #FD5E67 (negative)
// size='sm' keeps text-12 for non-table contexts (e.g. TopMetrics cards)
const ChangeTag: React.FC<{ value: number; size?: 'sm' | 'md' }> = ({ value, size = 'md' }) => {
  const pos = value >= 0
  return (
    <span className={clsx(
      'font-normal tabular-nums',   // Figma: weight=400 (normal) for change text
      size === 'sm' ? 'text-12' : 'text-14',
      pos ? 'text-success' : 'text-danger',   // semantic tokens: #5BD197 / #FD5E67
    )}>
      {pos ? '+' : ''}{value.toFixed(2)}%
    </span>
  )
}

// Figma: chain badge — 16×16, border-radius=4px (rounded-sm), 2px outside stroke #0A0A0B (ring-neutral-950)
// Position: absolute bottom-left of the 44×44 token image frame
const CHAIN_LOGOS: Partial<Record<HomeMarket['network'], string>> = {
  ethereum: chainEthImg,
  solana:   chainSolanaImg,
  bnb:      chainBnbImg,
}
const CHAIN_BG_CLASS: Record<HomeMarket['network'], string> = {
  ethereum: 'bg-chain-eth',
  solana:   'bg-chain-sol',
  base:     'bg-chain-base',
  bnb:      'bg-chain-bnb',
  sui:      'bg-[#4DA2FF]',
}

// Token logo images — keyed by ticker symbol
const TOKEN_LOGOS: Record<string, string> = {
  SKATE: tokenSkateImg,
  ERA:   tokenEraImg,
  GRASS: tokenGrassImg,
  LOUD:  tokenLoudImg,
  MMT:   tokenMmtImg,
  ZBT:   tokenZbtImg,
}

// Investor avatar images — cycle through for Upcoming tab Investors & Backers column
const INVESTOR_IMAGES = [investor1Img, investor2Img, investor3Img, investor4Img, investor5Img]
const NetworkBadge: React.FC<{ network: HomeMarket['network'] }> = ({ network }) => {
  const logo = CHAIN_LOGOS[network]
  return (
    <span className={clsx(
      // Figma: 16×16, radius=4px, 2px outside border = ring-2 ring-neutral-950
      'absolute -bottom-0.5 -left-0.5 w-4 h-4 rounded-sm overflow-hidden ring-2 ring-neutral-950 shrink-0',
      !logo && CHAIN_BG_CLASS[network],
    )}>
      {logo && (
        <img src={logo} alt={network} className="w-full h-full object-cover" />
      )}
    </span>
  )
}

// Derive "01:00 PM" UTC from an ISO datetime string
const getUTCTimeStr = (iso: string): string => {
  const d = new Date(iso)
  const h = d.getUTCHours()
  const m = d.getUTCMinutes()
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
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
          <div className="w-11 h-11 rounded-full bg-[#252527] flex items-center justify-center text-2xl shrink-0 overflow-hidden">
            {TOKEN_LOGOS[listing.token] ? (
              <img
                src={TOKEN_LOGOS[listing.token]}
                alt={listing.token}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              listing.logo
            )}
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-4">

      {/* ── Card 1: Pre-market 24h vol ── */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-[10px] pt-4 pb-5 px-5 flex flex-col">
        <p className="text-12 font-medium text-[#7a7a83]">Pre-market 24h vol.</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-24 font-medium text-[#f9f9fa]">{METRICS.premarket24Vol.value}</span>
          <ChangeTag value={12.5} size="sm" />
        </div>
        {/* mt-auto pushes chart to card bottom — aligns with other cards' bottom content */}
        <div className="mt-auto pt-3">
          <PremarketChart />
        </div>
      </div>

      {/* ── Card 2: Fear & Greed ── */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-[10px] pt-4 pb-5 px-5 flex flex-col">
        <p className="text-12 font-medium text-[#7a7a83]">Fear &amp; Greed</p>
        {/* mt-auto pushes gauge to card bottom */}
        <div className="mt-auto flex flex-col items-center">
          <FearGreedGauge score={METRICS.fearGreed.score} />
        </div>
      </div>

      {/* ── Card 3: Altcoin season ── */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-[10px] pt-4 pb-5 px-5 flex flex-col">
        <p className="text-12 font-medium text-[#7a7a83]">Altcoin season</p>
        <div className="flex items-baseline gap-0.5 mt-2">
          <span className="text-24 font-medium text-[#f9f9fa]">{METRICS.altcoinSeason.score}</span>
          <span className="text-24 font-medium text-[#7a7a83]">/100</span>
        </div>
        {/* mt-auto pushes labels + progress bar to card bottom */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="flex justify-between text-12 font-medium">
            <span className="text-[#f9f9fa]">Bitcoin</span>
            <span className="text-[#f9f9fa]">Altcoin</span>
          </div>
          {/* Gradient bar + dot 16×16 stroke=4px */}
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

      {/* ── Card 4: Next settlement ── */}
      <div className="bg-[rgba(255,255,255,0.03)] rounded-[10px] pt-4 pb-5 px-5 flex flex-col">
        <p className="text-12 font-medium text-[#7a7a83]">Next settlement</p>
        {/* Token + date row */}
        <div className="flex items-center gap-2 mt-2">
          <img src={skateLogoImg} alt="SKATE" className="w-9 h-9 rounded-full object-cover shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-14 font-medium text-[#f9f9fa]">{METRICS.nextSettlement.token}</span>
            <span className="text-12 text-[#7a7a83]">{METRICS.nextSettlement.date}</span>
          </div>
        </div>
        {/* mt-auto pushes countdown to card bottom — items-baseline aligns number+unit to text baseline */}
        <div className="mt-auto flex items-center gap-1.5">
          {[
            { val: pad(days), unit: 'd' },
            { val: pad(hrs),  unit: 'h' },
            { val: pad(mins), unit: 'm' },
            { val: pad(secs), unit: 's' },
          ].map(({ val, unit }) => (
            <div key={unit} className="flex items-baseline justify-center gap-0.5 bg-[#1b1b1c] rounded-lg px-2 py-1.5 flex-1">
              <span className="text-14 font-medium text-[#f9f9fa] tabular-nums">{val}</span>
              <span className="text-12 font-medium text-[#7a7a83]">{unit}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── 3. Live Market Table ─────────────────────────────────────────────────────

// filter_2_fill icon — Figma node 22283:7725
const Filter2FillIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M14 16.5C14.3852 16.5002 14.7556 16.6486 15.0344 16.9144C15.3132 17.1802 15.479 17.5431 15.4975 17.9279C15.516 18.3127 15.3858 18.6898 15.1338 18.9812C14.8818 19.2726 14.5274 19.4558 14.144 19.493L14 19.5H10C9.61478 19.4998 9.24441 19.3514 8.96561 19.0856C8.68682 18.8198 8.52099 18.4569 8.50248 18.0721C8.48396 17.6873 8.61419 17.3102 8.86618 17.0188C9.11816 16.7274 9.47258 16.5442 9.856 16.507L10 16.5H14ZM17 10.5C17.3978 10.5 17.7794 10.658 18.0607 10.9393C18.342 11.2206 18.5 11.6022 18.5 12C18.5 12.3978 18.342 12.7794 18.0607 13.0607C17.7794 13.342 17.3978 13.5 17 13.5H7C6.60218 13.5 6.22064 13.342 5.93934 13.0607C5.65804 12.7794 5.5 12.3978 5.5 12C5.5 11.6022 5.65804 11.2206 5.93934 10.9393C6.22064 10.658 6.60218 10.5 7 10.5H17ZM20 4.5C20.3978 4.5 20.7794 4.65804 21.0607 4.93934C21.342 5.22064 21.5 5.60218 21.5 6C21.5 6.39782 21.342 6.77936 21.0607 7.06066C20.7794 7.34196 20.3978 7.5 20 7.5H4C3.60218 7.5 3.22064 7.34196 2.93934 7.06066C2.65804 6.77936 2.5 6.39782 2.5 6C2.5 5.60218 2.65804 5.22064 2.93934 4.93934C3.22064 4.65804 3.60218 4.5 4 4.5H20Z" />
  </svg>
)

// mind_map_fill icon — Figma node 22283:7879 — used for "All Networks" option
const MindMapFillIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M11.0001 5C11.0002 4.40898 11.1749 3.83115 11.5022 3.33904C11.8295 2.84693 12.2949 2.46247 12.84 2.2339C13.385 2.00534 13.9854 1.94286 14.5658 2.05431C15.1463 2.16575 15.6808 2.44616 16.1025 2.86033C16.5241 3.27451 16.814 3.80399 16.9358 4.38233C17.0575 4.96067 17.0058 5.5621 16.787 6.11113C16.5682 6.66016 16.1921 7.13233 15.7059 7.46837C15.2197 7.80442 14.6451 7.98937 14.0541 8L13.8361 8.653C14.3516 8.96601 14.7989 9.37927 15.1517 9.8683C15.5045 10.3573 15.7556 10.9122 15.8901 11.5H17.2091C17.4389 10.9736 17.8429 10.5424 18.3532 10.2788C18.8635 10.0152 19.449 9.93539 20.0112 10.0527C20.5734 10.1701 21.0781 10.4774 21.4404 10.9231C21.8027 11.3688 22.0004 11.9257 22.0004 12.5C22.0004 13.0744 21.8027 13.6312 21.4404 14.0769C21.0781 14.5226 20.5734 14.8299 20.0112 14.9473C19.449 15.0646 18.8635 14.9848 18.3532 14.7212C17.8429 14.4576 17.4389 14.0264 17.2091 13.5H15.8891C15.7231 14.2296 15.3773 14.9061 14.8831 15.468L15.5871 16.172C16.1218 15.9622 16.7124 15.9429 17.2597 16.1173C17.8069 16.2918 18.2774 16.6493 18.592 17.1299C18.9066 17.6104 19.0461 18.1846 18.9872 18.7559C18.9282 19.3273 18.6743 19.8609 18.2681 20.267C17.862 20.6731 17.3284 20.927 16.7571 20.986C16.1857 21.045 15.6115 20.9054 15.131 20.5908C14.6505 20.2762 14.2929 19.8058 14.1185 19.2585C13.944 18.7113 13.9633 18.1207 14.1731 17.586L13.2391 16.652C12.6884 16.8826 12.0972 17.0009 11.5001 17C10.8129 17.0007 10.1348 16.8433 9.51814 16.54L8.64714 17.586C8.98046 18.2102 9.08242 18.9321 8.935 19.6242C8.78757 20.3163 8.40026 20.934 7.8415 21.3681C7.28273 21.8023 6.58849 22.0249 5.88144 21.9968C5.17439 21.9686 4.50006 21.6914 3.97759 21.2142C3.45513 20.737 3.11816 20.0905 3.02625 19.3889C2.93433 18.6872 3.09337 17.9757 3.47528 17.38C3.85718 16.7843 4.43736 16.3428 5.11329 16.1335C5.78922 15.9241 6.5174 15.9604 7.16914 16.236L7.96314 15.282C7.33792 14.4896 6.99859 13.5093 7.00014 12.5C7.00014 11.765 7.17614 11.071 7.48914 10.459L6.62114 9.735C6.1077 9.99262 5.52121 10.0656 4.96031 9.94154C4.39941 9.81754 3.89833 9.50415 3.54135 9.05409C3.18436 8.60404 2.99326 8.04478 3.00018 7.47038C3.0071 6.89597 3.21162 6.34148 3.57934 5.90016C3.94707 5.45883 4.45555 5.15761 5.01928 5.04715C5.583 4.93669 6.16757 5.02373 6.67465 5.29364C7.18174 5.56355 7.5804 5.99985 7.80359 6.52917C8.02678 7.05848 8.06087 7.64851 7.90014 8.2L8.76814 8.924C9.67181 8.23146 10.8052 7.90895 11.9381 8.022L12.1561 7.368C11.7957 7.08757 11.5041 6.7284 11.3037 6.31797C11.1034 5.90754 10.9995 5.45673 11.0001 5Z" />
  </svg>
)

// table-heading-sort icon — Figma component 35281:21856, 16×16
// Variants: default (both #7A7A83), up (#F9F9FA up / #7A7A83 down), down (vice-versa)
const TableSortIcon: React.FC<{ field: string; sortKey: string; sortDir: 'asc' | 'desc' }> = ({ field, sortKey, sortDir }) => {
  const isActive = field === sortKey
  const upColor   = isActive && sortDir === 'asc'  ? '#F9F9FA' : '#7A7A83'
  const downColor = isActive && sortDir === 'desc' ? '#F9F9FA' : '#7A7A83'
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.44604 3.24253C7.59297 3.08724 7.79223 3 8 3C8.20777 3 8.40703 3.08724 8.55396 3.24253L10.7706 5.58598C10.8802 5.70188 10.9548 5.84954 10.985 6.01028C11.0152 6.17102 10.9996 6.33762 10.9402 6.48899C10.8808 6.64037 10.7803 6.76972 10.6514 6.86068C10.5224 6.95165 10.3709 7.00013 10.2158 7H5.78415C5.62914 7.00013 5.47758 6.95165 5.34864 6.86068C5.2197 6.76972 5.11917 6.64037 5.05978 6.48899C5.0004 6.33762 4.98481 6.17102 5.01501 6.01028C5.0452 5.84954 5.11982 5.70188 5.22941 5.58598L7.44604 3.24253Z" fill={upColor} />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.55396 12.7575C8.40703 12.9128 8.20777 13 8 13C7.79223 13 7.59297 12.9128 7.44604 12.7575L5.22941 10.414C5.11982 10.2981 5.0452 10.1505 5.01501 9.98972C4.98481 9.82898 5.0004 9.66238 5.05978 9.511C5.11917 9.35963 5.2197 9.23028 5.34864 9.13932C5.47758 9.04835 5.62914 8.99987 5.78415 9H10.2158C10.3709 8.99987 10.5224 9.04835 10.6514 9.13932C10.7803 9.23028 10.8808 9.35963 10.9402 9.511C10.9996 9.66238 11.0152 9.82898 10.985 9.98972C10.9548 10.1505 10.8802 10.2981 10.7706 10.414L8.55396 12.7575Z" fill={downColor} />
    </svg>
  )
}

// Network chains — Figma: select-network dropdown, node 38214:311359
const NETWORKS = [
  { id: 'all',         label: 'All Networks',  logo: null,           color: '#7a7a83' },
  { id: 'solana',      label: 'Solana',         logo: chainSolanaImg, color: '#9945ff' },
  { id: 'ethereum',    label: 'Ethereum',       logo: chainEthImg,    color: '#627eea' },
  { id: 'hyperliquid', label: 'Hyperliquid',    logo: chainHlImg,     color: '#45d0d0' },
  { id: 'bnb',         label: 'BNB Chain',      logo: chainBnbImg,    color: '#f0b90b' },
] as const
type NetworkId = typeof NETWORKS[number]['id']

type SortKey = 'price' | 'vol24h' | 'totalVol' | 'fdv' | 'priceChange24h'

// ─── Skeleton loader for tab transitions ────────────────────────────────────
const SkeletonRow: React.FC = () => (
  <tr className="border-b border-border-subtle animate-pulse">
    <td className="pl-2 pr-2 py-4"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-[#252527]" /><div className="space-y-2"><div className="h-4 w-16 bg-[#252527] rounded" /><div className="h-3 w-24 bg-[#1b1b1c] rounded" /></div></div></td>
    <td className="px-3 py-4"><div className="h-4 w-12 bg-[#252527] rounded" /></td>
    <td className="px-3 py-4"><div className="flex gap-[-6px]">{[0,1,2].map(i => <div key={i} className="w-5 h-5 rounded-full bg-[#252527]" />)}</div></td>
    <td className="px-3 py-4"><div className="flex gap-1"><div className="h-5 w-14 bg-[#252527] rounded-full" /><div className="h-5 w-10 bg-[#252527] rounded-full" /></div></td>
    <td className="px-3 py-4"><div className="flex items-center gap-2"><div className="h-1 w-[120px] bg-[#252527] rounded-full" /><div className="h-4 w-12 bg-[#252527] rounded" /></div></td>
  </tr>
)

// ─── Upcoming Tab Content ───────────────────────────────────────────────────
// Figma node 42540-727391 — table layout matching Live Market structure
// 5 visible cols: Token(~42%) | Watchers(~14.3%) | Investors & Backers(~14.3%) | Narrative(~14.3%) | Moni Score(~14.3%)

type UpcomingSortKey = 'watchers' | 'moniScore'

const UpcomingTabContent: React.FC<{ loading: boolean }> = ({ loading }) => {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState<UpcomingSortKey>('moniScore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleUpcomingSort = (field: UpcomingSortKey) => {
    if (sortKey === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(field); setSortDir('desc') }
  }

  const sorted = useMemo(() =>
    [...mockUpcomingListings].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      return (a[sortKey] > b[sortKey] ? 1 : -1) * dir
    }),
    [sortKey, sortDir]
  )

  const fmtNum = (n: number) => n.toLocaleString('en-US')

  const UPCOMING_COLS: { label: string; field: UpcomingSortKey | null; w: string }[] = [
    { label: 'Token',                field: null,        w: '42%' },
    { label: 'Watchers',             field: 'watchers',  w: '14%' },
    { label: 'Investors & Backers',  field: null,        w: '15%' },
    { label: 'Narrative',            field: null,        w: '14%' },
    { label: 'Moni Score',           field: 'moniScore', w: '15%' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed min-w-[700px]">
        <thead>
          <tr className="border-b border-border-subtle">
            {UPCOMING_COLS.map((col, idx) => (
              <th
                key={col.label}
                style={{ width: col.w }}
                onClick={() => col.field && handleUpcomingSort(col.field)}
                className={clsx(
                  'py-2 pr-2 text-12 font-normal text-text-muted whitespace-nowrap',
                  idx === 0 ? 'pl-2 text-left' : 'pl-3 text-left',
                  col.field && 'cursor-pointer hover:text-text-primary transition-colors select-none',
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  {col.field && (
                    <TableSortIcon field={col.field} sortKey={sortKey} sortDir={sortDir} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
          ) : (
            sorted.map(listing => (
              <tr
                key={listing.id}
                onClick={() => navigate(`/market/${listing.id}`)}
                className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                {/* ── Token cell — logo(44×44) + chain badge(16×16) + name stack ── */}
                <td className="pl-2 pr-2 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-[#252527] flex items-center justify-center text-2xl overflow-hidden">
                        {TOKEN_LOGOS[listing.token] ? (
                          <img src={TOKEN_LOGOS[listing.token]} alt={listing.token} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          listing.logo
                        )}
                      </div>
                      <NetworkBadge network={listing.network} />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-14 font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                          {listing.token}
                        </span>
                        {listing.isNew && (
                          <span className="px-1.5 py-0.5 rounded-full text-10 font-medium bg-info-scale-400/10 text-info-scale-400 shrink-0 tracking-wide">
                            NEW MARKET
                          </span>
                        )}
                      </div>
                      <span className="text-14 font-normal text-text-muted truncate">{listing.tokenName}</span>
                    </div>
                  </div>
                </td>

                {/* ── Watchers ── */}
                <td className="pl-3 pr-2 py-4">
                  <span className="text-14 font-medium text-text-primary">{fmtNum(listing.watchers)}</span>
                </td>

                {/* ── Investors & Backers — avatar stack + overflow badge ── */}
                <td className="pl-3 pr-2 py-4">
                  {listing.investorAvatars.length > 0 ? (
                    <div className="flex items-center">
                      {listing.investorAvatars.slice(0, 5).map((_, i) => (
                        <img
                          key={i}
                          src={INVESTOR_IMAGES[i % INVESTOR_IMAGES.length]}
                          alt=""
                          className="w-5 h-5 rounded-full object-cover border-2 border-[#0a0a0b]"
                          style={{ marginLeft: i > 0 ? '-6px' : 0, zIndex: 5 - i, position: 'relative' }}
                        />
                      ))}
                      {listing.investorOverflow > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#1b1b1c] text-[10px] font-medium text-text-primary leading-none">
                          +{listing.investorOverflow}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-14 font-medium text-text-primary">-</span>
                  )}
                </td>

                {/* ── Narrative — pill badges, max 2 shown + overflow count ── */}
                <td className="pl-3 pr-2 py-4">
                  {listing.narratives.length > 0 ? (
                    <div className="flex items-center gap-1 flex-wrap">
                      {listing.narratives.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-[#1b1b1c] text-[10px] font-medium text-text-primary leading-none uppercase">
                          {tag}
                        </span>
                      ))}
                      {listing.narratives.length > 2 && (
                        <span className="px-2 py-1 rounded-full bg-[#1b1b1c] text-[10px] font-medium text-text-primary leading-none">
                          +{listing.narratives.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-14 font-medium text-text-primary">-</span>
                  )}
                </td>

                {/* ── Moni Score — gradient bar (same as Altcoin Season card) + number ── */}
                <td className="pl-3 pr-2 py-4">
                  <div className="flex items-center gap-2">
                    <div className="relative w-[120px] h-1 bg-[#252527] rounded-full shrink-0">
                      <div
                        className="absolute top-0 left-0 h-1 rounded-full"
                        style={{ width: `${listing.moniPct}%`, background: 'linear-gradient(to right, #F9F9FA 1%, #16C284 100%)' }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#f9f9fa] rounded-full"
                        style={{ left: `${listing.moniPct}%`, marginLeft: '-4px' }}
                      />
                    </div>
                    <span className="text-12 font-medium text-text-primary tabular-nums">{fmtNum(listing.moniScore)}</span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── Ended Tab Content ─────────────────────────────────────────────────────
// Figma node 42540-728736
// 6 columns: Token(fill ~30%) | Last Price(14.5%) | Total Vol(14.5%) | Collateral Token(12%) | Settle Starts(14.5%) | Settle Ends(14.5%)
// Row height: 76px | border-bottom 1px #1b1b1c

type EndedSortKey = 'price' | 'totalVol'

const EndedSkeletonRow: React.FC = () => (
  <tr className="border-b border-border-subtle animate-pulse">
    <td className="pl-2 pr-2 py-4"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-[#252527]" /><div className="space-y-2"><div className="h-4 w-16 bg-[#252527] rounded" /><div className="h-3 w-24 bg-[#1b1b1c] rounded" /></div></div></td>
    <td className="pl-4 pr-2 py-3 text-right"><div className="h-4 w-16 bg-[#252527] rounded ml-auto" /></td>
    <td className="pl-4 pr-2 py-3 text-right"><div className="h-4 w-16 bg-[#252527] rounded ml-auto" /></td>
    <td className="pl-4 pr-2 py-3"><div className="flex gap-1 justify-end">{[0,1,2].map(i => <div key={i} className="w-4 h-4 rounded-full bg-[#252527]" />)}</div></td>
    <td className="pl-4 pr-2 py-3 text-right"><div className="flex flex-col gap-1 items-end"><div className="h-4 w-16 bg-[#252527] rounded" /><div className="h-3 w-12 bg-[#1b1b1c] rounded" /></div></td>
    <td className="pl-4 pr-2 py-3 text-right"><div className="flex flex-col gap-1 items-end"><div className="h-4 w-16 bg-[#252527] rounded" /><div className="h-3 w-12 bg-[#1b1b1c] rounded" /></div></td>
  </tr>
)

// Collateral token colors — Figma: 16×16 circles inside 20×20 frames
const COLLATERAL_COLORS: Record<string, string> = {
  USDC: '#2775CA',
  USDT: '#26A17B',
  SOL:  '#9945FF',
}

const EndedTabContent: React.FC<{ loading: boolean }> = ({ loading }) => {
  const navigate = useNavigate()
  const [sortKey, setSortKey] = useState<EndedSortKey>('totalVol')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleEndedSort = (field: EndedSortKey) => {
    if (sortKey === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(field); setSortDir('desc') }
  }

  const sorted = useMemo(() =>
    [...mockEndedMarkets].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1
      return (a[sortKey] > b[sortKey] ? 1 : -1) * dir
    }),
    [sortKey, sortDir]
  )

  // Figma: Token=560px(fill) | Last Price=192px | Total Vol=192px | Collateral=160px | Settle Starts=192px | Settle Ends=192px
  // As %: Token ~30% (fill) | 14.5% | 14.5% | 12% | 14.5% | 14.5%
  const ENDED_COLS: { label: string; field: EndedSortKey | null; w: string }[] = [
    { label: 'Token',               field: null,       w: '30%' },
    { label: 'Last Price ($)',       field: 'price',    w: '14.5%' },
    { label: 'Total Vol. ($)',       field: 'totalVol', w: '14.5%' },
    { label: 'Collateral Token',     field: null,       w: '12%' },
    { label: 'Settle Starts (UTC)',  field: null,       w: '14.5%' },
    { label: 'Settle Ends (UTC)',    field: null,       w: '14.5%' },
  ]

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed min-w-[700px]">
        <thead>
          <tr className="border-b border-border-subtle">
            {ENDED_COLS.map((col, idx) => (
              <th
                key={col.label}
                style={{ width: col.w }}
                onClick={() => col.field && handleEndedSort(col.field)}
                className={clsx(
                  'py-2 pr-2 text-12 font-normal text-text-muted whitespace-nowrap',
                  idx === 0 ? 'pl-2 text-left' : 'pl-4 text-right',
                  col.field && 'cursor-pointer hover:text-text-primary transition-colors select-none',
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {col.label}
                  {col.field && (
                    <TableSortIcon field={col.field} sortKey={sortKey} sortDir={sortDir} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <EndedSkeletonRow key={i} />)
          ) : (
            sorted.map(market => (
              <tr
                key={market.id}
                onClick={() => navigate(`/market/${market.id}`)}
                className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                {/* ── Token — 44×44 image slot + chain badge + name stack ── */}
                <td className="pl-2 pr-2 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0 w-11 h-11 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-lg select-none overflow-hidden">
                        {TOKEN_LOGOS[market.token] ? (
                          <img src={TOKEN_LOGOS[market.token]} alt={market.token} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          market.logo
                        )}
                      </div>
                      <NetworkBadge network={market.network} />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-14 font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                        {market.token}
                      </span>
                      <span className="text-14 font-normal text-text-muted truncate">{market.tokenName}</span>
                    </div>
                  </div>
                </td>

                {/* ── Last Price ($) — Figma: 500/14px/#f9f9fa, right-aligned ── */}
                <td className="pl-4 pr-2 py-3 text-right">
                  <span className="text-14 font-medium text-text-primary tabular-nums">
                    ${fmtPrice(market.price)}
                  </span>
                </td>

                {/* ── Total Vol. ($) — Figma: 500/14px/#f9f9fa, right-aligned ── */}
                <td className="pl-4 pr-2 py-3 text-right">
                  <span className="text-14 font-medium text-text-primary tabular-nums">
                    {market.totalVol.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </td>

                {/* ── Collateral Token — Figma: 3 circular 16×16 icons inside 20×20 frames ── */}
                <td className="pl-4 pr-2 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    {(market.collateralTokens ?? [market.collateral]).map((tok) => (
                      <span
                        key={tok}
                        className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0"
                      >
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold select-none"
                          style={{ backgroundColor: COLLATERAL_COLORS[tok] ?? '#252527', fontSize: 7, lineHeight: '1' }}
                        >
                          {tok[0]}
                        </div>
                      </span>
                    ))}
                  </div>
                </td>

                {/* ── Settle Starts (UTC) — Figma: date 500/14px/#f9f9fa + time 400/14px/#7a7a83, or "TBA" ── */}
                <td className="pl-4 pr-2 py-3 text-right">
                  {market.settleStartDisplay && market.settleStartDisplay !== 'TBA' ? (
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-14 font-medium text-text-primary tabular-nums">
                        {market.settleStartDisplay}
                      </span>
                      {market.settleStartTime && (
                        <span className="text-14 font-normal text-text-muted tabular-nums">
                          {market.settleStartTime}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-14 font-normal text-text-muted">TBA</span>
                  )}
                </td>

                {/* ── Settle Ends (UTC) — Figma: date 500/14px/#f9f9fa + time/countdown, or "TBA"
                    Countdown text: 400/14px/#fb923c (orange) ── */}
                <td className="pl-4 pr-2 py-3 text-right">
                  {market.settleEndDisplay && market.settleEndDisplay !== 'TBA' ? (
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-14 font-medium text-text-primary tabular-nums">
                        {market.settleEndDisplay}
                      </span>
                      {market.settleEndCountdown ? (
                        <span className="text-14 font-normal text-[#fb923c] tabular-nums">
                          {market.settleEndCountdown}
                        </span>
                      ) : market.settleEndTime ? (
                        <span className="text-14 font-normal text-text-muted tabular-nums">
                          {market.settleEndTime}
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-14 font-normal text-text-muted">TBA</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

const LiveMarketTable: React.FC = () => {
  const navigate = useNavigate()
  const [tab, setTab]           = useState<'live' | 'upcoming' | 'ended'>('live')
  const [tabLoading, setTabLoading] = useState(false)
  const [search, setSearch]     = useState('')
  const [sortKey, setSortKey]   = useState<SortKey>('vol24h')
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('desc')
  const [network, setNetwork]   = useState<NetworkId>('all')
  const [netOpen, setNetOpen]   = useState(false)
  const netRef                  = useRef<HTMLDivElement>(null)

  // Simulate loading on tab switch
  const switchTab = (t: 'live' | 'upcoming' | 'ended') => {
    if (t === tab) return
    setTabLoading(true)
    setTab(t)
    setTimeout(() => setTabLoading(false), 600)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (netRef.current && !netRef.current.contains(e.target as Node)) setNetOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const markets = mockHomeMarkets
    .filter(m => {
      const q = search.toLowerCase()
      const matchSearch = m.token.toLowerCase().includes(q) || m.tokenName.toLowerCase().includes(q)
      const matchNet = network === 'all' || m.network === network
      return matchSearch && matchNet
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

  const activeNet = NETWORKS.find(n => n.id === network) ?? NETWORKS[0]

  return (
    <div className="mb-6">

      {/* Tab bar + controls — no bottom border (divider removed per Figma) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
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

        <div className={clsx('flex items-center gap-2 py-3 transition-opacity duration-200', tab !== 'live' && 'opacity-0 pointer-events-none')}>
          {/* Search — transparent bg, border only, fixed 256px */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#252527] focus-within:border-[#3a3a3f] transition-colors" style={{ width: 256 }}>
            <Search size={14} className="text-[#7a7a83] shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search"
              className="flex-1 bg-transparent text-14 text-[#f9f9fa] placeholder:text-[#7a7a83] focus:outline-none"
            />
          </div>

          {/* ── Network filter ────────────────────────────────────────────────
              Figma: node 38214:311363 — trigger button 126×36
              Padding=8px all | gap=6px | border=#252527 | r=8px
              Leading: filter_2_fill 20×20 (p=2→16×16) fill=#F9F9FA
              Label: "Network" 14px/w500/#F9F9FA
              Trailing: down_fill 20×20 (p=2→16×16) fill=#7A7A83
          ─────────────────────────────────────────────────────────────── */}
          <div className="relative" ref={netRef}>
            <button
              onClick={() => setNetOpen(o => !o)}
              className={clsx(
                'flex items-center gap-1.5 px-2 py-2 rounded-lg border transition-colors duration-150 text-[14px] font-[500] text-[#f9f9fa] whitespace-nowrap',
                netOpen
                  ? 'border-[#3a3a3f] bg-[#1b1b1c]'
                  : 'border-[#252527] bg-transparent hover:border-[#3a3a3f] hover:bg-[#1b1b1c]',
              )}
            >
              {/* filter_2_fill: 20×20 slot, p=2px → 16×16 icon, fill=#F9F9FA */}
              <span className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0">
                <Filter2FillIcon size={16} className="text-[#f9f9fa]" />
              </span>
              <span>{network === 'all' ? 'Network' : activeNet.label}</span>
              {/* down_fill: 20×20 slot, fill=#7A7A83, rotates 180° when open */}
              <span className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0">
                <DownFillIcon size={16} className={clsx('text-[#7a7a83] transition-transform duration-150', netOpen && 'rotate-180')} />
              </span>
            </button>

            {/* ── Dropdown panel ────────────────────────────────────────────
                Figma: select-network INSTANCE, node 38214:311371
                192×220px | bg=#1b1b1c | r=10px | shadow: 0 0 32px rgba(0,0,0,0.20)
                No border. Inner menu-item-group: p=8px | gap=4px
            ─────────────────────────────────────────────────────────────── */}
            {netOpen && (
              <div
                className="absolute right-0 top-[calc(100%+6px)] z-50 w-48 bg-[#1b1b1c] rounded-[10px] animate-dropdown-in"
                style={{ boxShadow: '0 0 32px rgba(0,0,0,0.20)' }}
              >
                {/* Inner group: p=8px all, gap=4px (gap-1) */}
                <div className="p-2 flex flex-col gap-1">

                  {/* Title: "Filter by Network" — 12px/w500/#7a7a83, py=4px px=8px */}
                  <div className="px-2 py-1">
                    <span className="text-[12px] font-[500] leading-[16px] text-[#7a7a83]">
                      Filter by Network
                    </span>
                  </div>

                  {/* Options — Figma: dropdown-option-time 176×32px each
                      r=8px | py=6px px=8px | gap=8px | 3 states: default / hover / selected */}
                  <div className="flex flex-col gap-1">
                    {NETWORKS.map(net => {
                      const isActive = network === net.id
                      return (
                        <button
                          key={net.id}
                          onClick={() => { setNetwork(net.id); setNetOpen(false) }}
                          className={clsx(
                            'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg',
                            'text-[14px] font-[500] leading-[20px] transition-colors duration-150',
                            isActive
                              ? 'bg-[#252527] text-[#f9f9fa]'
                              : 'text-[#f9f9fa] hover:bg-[#252527]',
                          )}
                        >
                          {/* Leading icon-slot: 20×20 outer, 2px padding → 16×16 inner */}
                          <span className="w-5 h-5 shrink-0 flex items-center justify-center p-0.5">
                            {net.logo ? (
                              <img src={net.logo} alt={net.label} className="w-4 h-4 rounded-[4px] object-cover" />
                            ) : (
                              <MindMapFillIcon size={16} className="text-[#f9f9fa]" />
                            )}
                          </span>

                          {/* Label: 14px/w500/#f9f9fa, flex-1 */}
                          <span className="flex-1 text-left">
                            {net.label}
                          </span>

                          {/* Trailing check_fill: 20×20 slot, fill=#5BD197, visible only when selected */}
                          <span className="w-5 h-5 shrink-0 flex items-center justify-center p-0.5">
                            {isActive && (
                              <svg width="16" height="16" viewBox="0 0 20 15" fill="#5BD197" aria-hidden="true">
                                <path d="M19.5499 0.43968C19.8311 0.720971 19.9891 1.10243 19.9891 1.50018C19.9891 1.89793 19.8311 2.27939 19.5499 2.56068L8.30693 13.8037C8.15835 13.9523 7.98196 14.0702 7.78781 14.1506C7.59367 14.231 7.38558 14.2724 7.17543 14.2724C6.96529 14.2724 6.7572 14.231 6.56305 14.1506C6.36891 14.0702 6.19251 13.9523 6.04393 13.8037L0.457932 8.21868C0.314667 8.08031 0.200394 7.91479 0.12178 7.73179C0.0431668 7.54878 0.00178736 7.35195 5.66349e-05 7.15278C-0.00167409 6.95361 0.0362786 6.75609 0.1117 6.57175C0.187121 6.3874 0.298501 6.21993 0.43934 6.07909C0.580179 5.93825 0.747657 5.82687 0.932001 5.75145C1.11635 5.67603 1.31387 5.63807 1.51303 5.6398C1.7122 5.64153 1.90903 5.68291 2.09204 5.76153C2.27505 5.84014 2.44056 5.95441 2.57893 6.09768L7.17493 10.6937L17.4279 0.43968C17.5672 0.30029 17.7326 0.189715 17.9147 0.114273C18.0967 0.0388304 18.2919 0 18.4889 0C18.686 0 18.8811 0.0388304 19.0632 0.114273C19.2452 0.189715 19.4106 0.30029 19.5499 0.43968Z" />
                              </svg>
                            )}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tab content ─────────────────────────────────────────────────────── */}
      {tab === 'upcoming' ? (
        <UpcomingTabContent loading={tabLoading} />
      ) : tab === 'ended' ? (
        <EndedTabContent loading={tabLoading} />
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full table-fixed min-w-[700px]">
          <thead>
            {/* Figma: table-heading row — h=36px, border-bottom #1B1B1C, text=12px/400/#7A7A83 */}
            <tr className="border-b border-border-subtle">
              {([
                { label: 'Token',            field: null,        w: '22%' },
                { label: 'Last Price ($)',    field: 'price',     w: '15%' },
                { label: '24h Vol. ($)',      field: 'vol24h',    w: '15%' },
                { label: 'Total Vol. ($)',    field: 'totalVol',  w: '16%' },
                { label: 'Implied FDV ($)',   field: 'fdv',       w: '16%' },
                { label: 'Settle Time (UTC)', field: null,        w: '16%' },
              ] as { label: string; field: SortKey | null; w: string }[]).map((col, idx) => (
                <th
                  key={col.label}
                  style={{ width: col.w }}
                  onClick={() => col.field && handleSort(col.field as SortKey)}
                  className={clsx(
                    // Token col → left-aligned; data cols → right-aligned
                    'py-2 pr-2 text-12 font-normal text-text-muted whitespace-nowrap',
                    idx === 0 ? 'pl-2 text-left' : 'pl-4 text-right',
                    col.field && 'cursor-pointer hover:text-text-primary transition-colors select-none',
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {col.label}
                    {col.field && (
                      <TableSortIcon field={col.field} sortKey={sortKey} sortDir={sortDir} />
                    )}
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
                // Figma: row border-bottom #1B1B1C (border-border-subtle), hover subtle lift
                className="border-b border-border-subtle hover:bg-white/[0.02] transition-colors cursor-pointer group"
              >
                {/* ── Cell 1: Token ─────────────────────────────────────────────────────
                    Figma: HORIZONTAL, pad top=16 bottom=16, gap=12 (between image slot and name)
                    Image slot: 44×44px (pad=4 inside) with 36×36 token circle + 16×16 chain badge
                    Name stack: VERTICAL gap=4, ticker 14/500/#F9F9FA, name 14/400/#7A7A83         */}
                <td className="pl-2 pr-2 py-4">
                  <div className="flex items-center gap-3">
                    {/* Image slot: 44×44 container → 36×36 circle token + 16×16 chain badge (bottom-left) */}
                    <div className="relative shrink-0 w-11 h-11 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-lg select-none overflow-hidden">
                        {TOKEN_LOGOS[market.token] ? (
                          <img
                            src={TOKEN_LOGOS[market.token]}
                            alt={market.token}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          market.logo
                        )}
                      </div>
                      <NetworkBadge network={market.network} />
                    </div>

                    {/* Name stack: gap=4px (gap-1), ticker 14/500, full-name 14/400 */}
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-14 font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                          {market.token}
                        </span>
                        {market.isNew && (
                          <span className="px-1.5 py-0.5 rounded-full text-10 font-medium bg-info-scale-400/10 text-info-scale-400 shrink-0 tracking-wide">
                            NEW MARKET
                          </span>
                        )}
                      </div>
                      {/* Figma: full name — 14px/400/#7A7A83 (NOT 12px!) */}
                      <span className="text-14 font-normal text-text-muted truncate">{market.tokenName}</span>
                    </div>
                  </div>
                </td>

                {/* ── Cell 2: Last Price ($) ─────────────────────────────────────────
                    text-right: value + change align to right edge of column            */}
                <td className="pl-4 pr-2 py-3 text-right">
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-14 font-medium text-text-primary tabular-nums">${fmtPrice(market.price)}</span>
                    <ChangeTag value={market.priceChange24h} />
                  </div>
                </td>

                {/* ── Cell 3: 24h Vol. ($) ──────────────────────────────────────────*/}
                <td className="pl-4 pr-2 py-3 text-right">
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-14 font-medium text-text-primary tabular-nums">{fmtVol(market.vol24h)}</span>
                    <ChangeTag value={market.vol24hChange} />
                  </div>
                </td>

                {/* ── Cell 4: Total Vol. ($) ────────────────────────────────────────*/}
                <td className="pl-4 pr-2 py-3 text-right">
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-14 font-medium text-text-primary tabular-nums">{fmtVol(market.totalVol)}</span>
                    <ChangeTag value={market.totalVolChange} />
                  </div>
                </td>

                {/* ── Cell 5: Implied FDV ($) ───────────────────────────────────────
                    align-top: value sits at top of row (no PnL below)
                    text-right: right-aligned within column                            */}
                <td className="pl-4 pr-2 py-3 text-right align-top">
                  <span className="text-14 font-medium text-text-primary tabular-nums">
                    {market.fdv.toFixed(2)}M
                  </span>
                </td>

                {/* ── Cell 6: Settle Time (UTC) ─────────────────────────────────────
                    Figma states:
                    • in-progress → orange countdown "3h:34m:59s" + "IN PROGRESS" pill
                    • upcoming    → green countdown "18h:36m:24s" + "Upcoming" pill
                    • active+date → white date "30/05/2025" + muted time "01:00 PM"
                    • TBA         → muted "TBA"                                        */}
                <td className="pl-4 pr-2 py-3 text-right">
                  {market.status === 'in-progress' && market.settleCountdown ? (
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-14 font-medium text-warning tabular-nums">
                        {market.settleCountdown}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-10 font-medium bg-warning/10 text-warning w-fit">
                        IN PROGRESS
                      </span>
                    </div>
                  ) : market.status === 'upcoming' && market.settleCountdown ? (
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-14 font-medium text-success tabular-nums">
                        {market.settleCountdown}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-10 font-medium bg-success/10 text-success w-fit">
                        UPCOMING
                      </span>
                    </div>
                  ) : market.settleDisplay === 'TBA' ? (
                    <span className="text-14 font-normal text-text-muted">TBA</span>
                  ) : (
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-14 font-medium text-text-primary tabular-nums">
                        {market.settleDisplay}
                      </span>
                      {market.settleTime && (
                        <span className="text-14 font-normal text-text-muted tabular-nums">
                          {getUTCTimeStr(market.settleTime)}
                        </span>
                      )}
                    </div>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  )
}

// ─── 4. Recent Trades Table ───────────────────────────────────────────────────
// Figma node 42532:726450 — recent-trades-update
// 7 cols: Time(128) | Side(128) | Pair(304) | Price(192) | Amount(192) | Collateral(192) | Tx.ID(192)

// left_fill — Figma: nav-arrow left icon, fill=currentColor
const LeftFillIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M13.5 17L6.5 10L13.5 3V17Z" />
  </svg>
)

// right_fill — Figma: nav-arrow right icon, fill=currentColor
const RightFillIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M6.5 3L13.5 10L6.5 17V3Z" />
  </svg>
)

// arrow_right_up_fill — Figma: Tx.ID external link icon, 12×12
const ArrowRightUpFillIcon: React.FC<{ size?: number; className?: string }> = ({ size = 12, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M9.5 1.5H3.5V3H6.94L1.5 8.44L2.56 9.5L8 4.06V7.5H9.5V1.5Z" />
  </svg>
)

// Token color map — for circular placeholder icons (no real images available)
const TOKEN_COLORS: Record<string, string> = {
  USDC:  '#2775CA',
  USDT:  '#26A17B',
  SOL:   '#9945FF',
  SKATE: '#FB923C',
  IKA:   '#60A5FA',
  PENGU: '#22D3EE',
  GRASS: '#22C55E',
  LOUD:  '#EAB308',
  MMT:   '#A855F7',
  BONK:  '#F97316',
  ERA:   '#F43F5E',
}

// Colored token circle — replaces real token images
const TokenDot: React.FC<{ token: string; size?: number }> = ({ token, size = 16 }) => (
  <div
    className="rounded-full flex items-center justify-center text-white font-bold select-none shrink-0"
    style={{
      width: size,
      height: size,
      backgroundColor: TOKEN_COLORS[token] ?? '#252527',
      fontSize: Math.floor(size * 0.44),
      lineHeight: '1',
    }}
  >
    {token[0]}
  </div>
)

// SharkIcon — Figma: primary fill=#0A71CD, eye=#0A0A0B, 16×16
const SharkIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {/* dorsal fin */}
    <path d="M8 2.5L10 5.5H6.5L8 2.5Z" fill="#0A71CD" stroke="#0A0A0B" strokeWidth="0.35" strokeLinejoin="round" />
    {/* body */}
    <ellipse cx="8" cy="9" rx="6.5" ry="3" fill="#0A71CD" />
    {/* tail fin */}
    <path d="M1.5 9Q1 11.5 3.5 12.5Q2 10 3 9" fill="#0A71CD" />
    {/* eye */}
    <circle cx="12.5" cy="8.5" r="0.75" fill="#0A0A0B" />
  </svg>
)

const RecentTradesTable: React.FC = () => (
  // Figma: recent-trades-update — VERTICAL layout, py=16px (py-4), gap=16px (gap-4)
  <div className="py-4 flex flex-col gap-4">

    {/* ── Block title (block-title) ──────────────────────────────────────────
        Figma: 1344×36 | HORIZONTAL | SPACE_BETWEEN | border-bottom 1px #1B1B1C
    ───────────────────────────────────────────────────────────────────────── */}
    <div className="flex items-center h-9">
      {/* "Recent Trades" 20px/500/#F9F9FA + green badge */}
      <span className="flex items-center gap-2 text-[20px] font-[500] leading-[28px] text-[#f9f9fa]">
        Recent Trades
        <TabBadge count={mockHomeRecentTrades.length} active={true} />
      </span>
    </div>

    {/* ── Table (open-offers-list) ───────────────────────────────────────────
        Figma: 1344×684 | table-heading(36) + recent-trade-list(600, 10×60px rows)
        Column ratios from Figma: Time(128) Side(128) Pair(304) Price(192) Amount(192) Collateral(192) Tx.ID(192)
        Total=1328 → converted to % so table always fits container with no horizontal scroll
    ───────────────────────────────────────────────────────────────────────── */}
    <table className="w-full table-fixed">
      <colgroup><col style={{ width: '9.64%' }} /><col style={{ width: '9.64%' }} /><col style={{ width: '22.89%' }} /><col style={{ width: '14.46%' }} /><col style={{ width: '14.46%' }} /><col style={{ width: '14.46%' }} /><col style={{ width: '14.46%' }} /></colgroup>

        {/* ── Table heading — Figma: 1344×36 | px=8 | border-bottom #1B1B1C ── */}
        <thead>
          <tr className="border-b border-[#1b1b1c]">
            {/* Left-aligned: Time, Side, Pair | Right-aligned: Price, Amount, Collateral, Tx.ID */}
            {[
              { label: 'Time',       align: 'left'  },
              { label: 'Side',       align: 'left'  },
              { label: 'Pair',       align: 'left'  },
              { label: 'Price ($)',  align: 'right' },
              { label: 'Amount',     align: 'right' },
              { label: 'Collateral', align: 'right' },
              { label: 'Tx.ID',      align: 'right' },
            ].map(col => (
              <th
                key={col.label}
                className={clsx(
                  'px-2 py-2 text-[12px] font-[400] leading-[16px] text-[#7a7a83] whitespace-nowrap',
                  col.align === 'right' ? 'text-right' : 'text-left',
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Trade rows — Figma: recent-trade-item 1344×60 each ────────────
            Row: px=8, py=16 per cell, border-bottom #1B1B1C
        ─────────────────────────────────────────────────────────────────── */}
        <tbody>
          {mockHomeRecentTrades.map((trade: HomeRecentTrade) => (
            <tr
              key={trade.id}
              className="border-b border-[#1b1b1c] hover:bg-[rgba(255,255,255,0.02)] transition-colors h-[60px]"
            >

              {/* ── Col 0: Time — 14px/400/#7A7A83 ── */}
              <td className="px-2 py-4">
                <span className="text-[14px] font-[400] leading-[20px] text-[#7a7a83] whitespace-nowrap">
                  {trade.timeAgo}
                </span>
              </td>

              {/* ── Col 1: Side — "Buy/Sell" 14px/500 + optional RS pill badge ── */}
              {/* Figma: RS badge 26×20, pill r=9999, bg=#EAB308, text=#0A0A0B, 10px/500 */}
              <td className="px-2 py-4">
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'text-[14px] font-[500] leading-[20px]',
                    trade.side === 'buy' ? 'text-[#5bd197]' : 'text-[#fd5e67]',
                  )}>
                    {trade.side === 'buy' ? 'Buy' : 'Sell'}
                  </span>
                  {trade.isRS && (
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full
                                     bg-[#eab308] text-[#0a0a0b] text-[10px] font-[500] leading-[12px] shrink-0
                                     whitespace-nowrap">
                      RS
                    </span>
                  )}
                </div>
              </td>

              {/* ── Col 2: Pair — 20×20 icon slot: real img from TOKEN_LOGOS or TokenDot fallback ── */}
              <td className="px-2 py-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    {TOKEN_LOGOS[trade.baseToken] ? (
                      <img
                        src={TOKEN_LOGOS[trade.baseToken]}
                        alt={trade.baseToken}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    ) : (
                      <TokenDot token={trade.baseToken} size={16} />
                    )}
                  </span>
                  <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] whitespace-nowrap">
                    {trade.pair}
                  </span>
                </div>
              </td>

              {/* ── Col 3: Price ($) — right-aligned, 14px/500/#F9F9FA ── */}
              <td className="px-2 py-4 text-right">
                <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums">
                  {fmtPrice(trade.price)}
                </span>
              </td>

              {/* ── Col 4: Amount — right-aligned, amount text + token circle 16×16 ── */}
              {/* Figma: HORIZONTAL, primaryAxisAlignItems=MAX, gap=8px */}
              <td className="px-2 py-4">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums whitespace-nowrap">
                    {trade.amount}
                  </span>
                  {/* image-slot 16×16, token image fill, radius=9999 */}
                  <TokenDot token={trade.amountToken} size={16} />
                </div>
              </td>

              {/* ── Col 5: Collateral — right-aligned, amount + token-slot + shark-slot ── */}
              {/* Figma: HORIZONTAL, primaryAxisAlignItems=MAX, gap=8px */}
              <td className="px-2 py-4">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums whitespace-nowrap">
                    {trade.collateral}
                  </span>
                  {/* collateral token icon-slot: 20×20, p=2 → 16×16 rounded-full */}
                  <span className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0">
                    <TokenDot token={trade.collateralToken} size={16} />
                  </span>
                  {/* shark icon-slot: 20×20, p=2 → 16×16, #0A71CD fill */}
                  <span className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0">
                    <SharkIcon size={16} />
                  </span>
                </div>
              </td>

              {/* ── Col 6: Tx.ID — right-aligned, external link button 52×28 r=6 ── */}
              {/* Figma: border #252527, r=6px, icon-slot 16×16 → arrow_right_up_fill 12×12, fill=#F9F9FA */}
              <td className="px-2 py-4">
                <div className="flex items-center justify-end">
                  <button
                    onClick={e => e.stopPropagation()}
                    className="w-[52px] h-7 border border-[#252527] rounded-[6px] flex items-center justify-center
                               text-[#f9f9fa] hover:border-[#3a3a3f] hover:bg-[#252527] active:bg-[#2e2e34]
                               transition-colors"
                    style={{ boxSizing: 'border-box' }}
                    aria-label="View transaction"
                  >
                    {/* icon-slot: 16×16, p=2px → 12×12 icon */}
                    <span className="w-4 h-4 flex items-center justify-center p-0.5">
                      <ArrowRightUpFillIcon size={12} />
                    </span>
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
    </table>
  </div>
)

// ─── 5. Bottom Stats Bar ──────────────────────────────────────────────────────
// Figma node 42532:726513 — bottom-stats
// Container: HORIZONTAL, 44px height, bg=#0A0A0B, gap=16px, no border, no radius
// Left (live-data): LIVE DATA badge | Total Vol | Vol 24h — gap=16px each
// Right (link+social): Docs/Dune/Link3 links | X + Discord icon buttons

// X (Twitter) icon — 12×12, fill=#F9F9FA
const XIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9.17 1H10.81L7.26 5.1L11.45 11H8.15L5.57 7.59L2.64 11H1L4.77 6.61L0.75 1H4.13L6.48 4.12L9.17 1ZM8.59 10.03H9.51L3.62 1.96H2.64L8.59 10.03Z" fill="#F9F9FA" />
  </svg>
)

// Discord icon — 12×12, fill=#F9F9FA
const DiscordIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M10.17 2.54A9.83 9.83 0 0 0 7.82 1.8a.07.07 0 0 0-.07.03c-.1.18-.2.4-.28.58a9.08 9.08 0 0 0-2.73 0 5.64 5.64 0 0 0-.28-.58.07.07 0 0 0-.07-.03A9.8 9.8 0 0 0 2.04 2.54a.06.06 0 0 0-.03.03C.78 4.8.37 6.99.57 9.15a.07.07 0 0 0 .03.05c.97.72 1.91 1.15 2.83 1.44a.07.07 0 0 0 .08-.03c.22-.3.41-.62.58-.95a.07.07 0 0 0-.04-.1 6.47 6.47 0 0 1-.92-.44.07.07 0 0 1-.01-.12c.06-.05.13-.1.19-.14a.07.07 0 0 1 .07-.01c1.93.88 4.02.88 5.93 0a.07.07 0 0 1 .07.01c.06.05.13.1.19.15a.07.07 0 0 1-.01.11c-.3.17-.6.32-.93.44a.07.07 0 0 0-.04.1c.17.33.37.65.58.95a.07.07 0 0 0 .08.03c.93-.29 1.87-.72 2.84-1.44a.07.07 0 0 0 .03-.05c.24-2.5-.4-4.67-1.68-6.6a.05.05 0 0 0-.03-.02ZM4.2 7.82c-.59 0-1.07-.54-1.07-1.2 0-.67.47-1.2 1.07-1.2.6 0 1.08.54 1.07 1.2 0 .66-.47 1.2-1.07 1.2Zm3.95 0c-.59 0-1.07-.54-1.07-1.2 0-.67.47-1.2 1.07-1.2.6 0 1.08.54 1.07 1.2 0 .66-.47 1.2-1.07 1.2Z" fill="#F9F9FA" />
  </svg>
)

const BottomStats: React.FC = () => (
  // Figma: HORIZONTAL, h=44px, bg=#0A0A0B, justify-between, no border, no border-radius
  <div className="flex items-center justify-between h-11 bg-[#0a0a0b]">

    {/* ── Left: live-data — HORIZONTAL gap=16px ─────────────────────────────── */}
    <div className="flex items-center gap-4">

      {/* LIVE DATA — icon-slot(20×20, p=2→16×16 green dot) + text 12px/500/#5BD197, gap=4px */}
      <div className="flex items-center gap-1">
        <span className="w-5 h-5 flex items-center justify-center p-0.5 shrink-0">
          {/* live dot — 16×16 filled green circle */}
          <span className="w-2 h-2 rounded-full bg-[#5bd197] animate-pulse" />
        </span>
        <span className="text-[12px] font-[500] leading-[16px] text-[#5bd197]">LIVE DATA</span>
      </div>

      {/* Total Vol — label(12/400/#B4B4BA) + value(12/400/#F9F9FA), gap=4px */}
      <div className="flex items-center gap-1">
        <span className="text-[12px] font-[400] leading-[16px] text-[#b4b4ba]">Total Vol</span>
        <span className="text-[12px] font-[400] leading-[16px] text-[#f9f9fa]">{HOME_STATS.totalVol}</span>
      </div>

      {/* Vol 24h — same pattern */}
      <div className="flex items-center gap-1">
        <span className="text-[12px] font-[400] leading-[16px] text-[#b4b4ba]">Vol 24h</span>
        <span className="text-[12px] font-[400] leading-[16px] text-[#f9f9fa]">{HOME_STATS.vol24h}</span>
      </div>
    </div>

    {/* ── Right: link+social — HORIZONTAL gap=16px ──────────────────────────── */}
    <div className="flex items-center gap-4">

      {/* Links — each: text 12px/400/#B4B4BA + arrow icon 12×12, gap=2px */}
      {(['Docs', 'Dune', 'Link3'] as const).map(link => (
        <button
          key={link}
          className="flex items-center gap-0.5 text-[12px] font-[400] leading-[16px] text-[#b4b4ba]
                     hover:text-[#f9f9fa] transition-colors"
        >
          {link}
          {/* icon-slot 16×16, p=2 → arrow_right_up_fill 12×12, color inherits */}
          <span className="w-4 h-4 flex items-center justify-center p-0.5 shrink-0">
            <ArrowRightUpFillIcon size={12} />
          </span>
        </button>
      ))}

      {/* Social buttons — each: 28×28, rounded-full (r=9999), bg=#1B1B1C, icon 12×12 #F9F9FA */}
      <div className="flex items-center gap-2">
        <button
          aria-label="Twitter / X"
          className="w-7 h-7 rounded-full bg-[#1b1b1c] flex items-center justify-center
                     hover:bg-[#252527] active:bg-[#2e2e34] transition-colors shrink-0"
          style={{ boxSizing: 'border-box' }}
        >
          <XIcon size={12} />
        </button>
        <button
          aria-label="Discord"
          className="w-7 h-7 rounded-full bg-[#1b1b1c] flex items-center justify-center
                     hover:bg-[#252527] active:bg-[#2e2e34] transition-colors shrink-0"
          style={{ boxSizing: 'border-box' }}
        >
          <DiscordIcon size={12} />
        </button>
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
