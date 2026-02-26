// Figma node 37222:132664 — Market Detail V2 (dynamic per token)
// Layout: 1920x2046, bg=#0a0a0b
// Body container: max-w-[1440px] centered
// market-detail: 1376px (px-4 = 16px each side), VERTICAL, gap between sections

import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  mockHomeMarkets, mockUpcomingListings, mockEndedMarkets, mockHomeRecentTrades,
  type HomeMarket, type HomeRecentTrade,
} from '@/mock-data/homeData'
import { mockBuyOrders, mockSellOrders } from '@/mock-data/orderBook'
import { mockMyOrders } from '@/mock-data/myOrders'
import { RecentTradesTable } from '@/components/market/RecentTradesTable'

// ─── Token image imports ───
import tokenSkateImg  from '@/assets/images/token-skate.png'
import tokenEraImg    from '@/assets/images/token-era.png'
import tokenGrassImg  from '@/assets/images/token-grass.png'
import tokenLoudImg   from '@/assets/images/token-loud.png'
import tokenMmtImg    from '@/assets/images/token-mmt.png'
import tokenZbtImg    from '@/assets/images/token-zbt.png'
import tokenTiaImg    from '@/assets/images/token-tia.png'
import tokenStrkImg   from '@/assets/images/token-strk.png'
import tokenOpImg     from '@/assets/images/token-op.png'
import tokenArbImg    from '@/assets/images/token-arb.png'

// ─── Chain image imports ───
import chainSolanaImg   from '@/assets/images/chain-solana.png'
import chainEthImg      from '@/assets/images/chain-ethereum.png'
import chainBnbImg      from '@/assets/images/chain-bnb.png'

// ─── Image maps ───
const TOKEN_LOGOS: Record<string, string> = {
  SKATE: tokenSkateImg,
  ERA:   tokenEraImg,
  GRASS: tokenGrassImg,
  LOUD:  tokenLoudImg,
  MMT:   tokenMmtImg,
  ZBT:   tokenZbtImg,
  TIA:   tokenTiaImg,
  STRK:  tokenStrkImg,
  OP:    tokenOpImg,
  ARB:   tokenArbImg,
}

const CHAIN_LOGOS: Partial<Record<HomeMarket['network'], string>> = {
  ethereum: chainEthImg,
  solana:   chainSolanaImg,
  bnb:      chainBnbImg,
}

// ─── Helpers ───
const fmtPrice = (p: number) => {
  if (p === 0) return '0.00'
  if (p < 0.001) return p.toFixed(8)
  if (p < 1) return p.toFixed(4)
  return p.toFixed(4)
}

const fmtVol = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}

const fmtVolChange = (v: number) => `${v >= 0 ? '+' : ''}${v.toFixed(2)}%`

const fmtAmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`
  return n.toFixed(2)
}

// ─── Find market by route id across all data sources ───
function findMarketById(id: string): HomeMarket | undefined {
  const allMarkets = [...mockHomeMarkets, ...mockUpcomingListings.map(u => ({
    ...u,
    price: 0,
    priceChange24h: 0,
    vol24h: 0,
    vol24hChange: 0,
    totalVol: 0,
    totalVolChange: 0,
    fdv: 0,
    fdvChange: 0,
    collateral: 'USDC' as const,
    settleTime: null,
    settleDisplay: 'TBA',
    status: 'upcoming' as const,
  })), ...mockEndedMarkets]

  const exact = allMarkets.find(m => m.id === id)
  if (exact) return exact
  const byToken = allMarkets.find(m => m.token.toLowerCase() === id.toLowerCase())
  if (byToken) return byToken
  return allMarkets.find(m => m.id.startsWith(id.toLowerCase()))
}

// ─── Live trade simulation (same as LandingPage) ──────────────────────────────
const LIVE_PAIRS = [
  { pair: 'SKATE/USDC',  baseToken: 'SKATE', price: 0.0550, collateralToken: 'USDC' as const },
  { pair: 'ERA/USDC',    baseToken: 'ERA',   price: 0.0464, collateralToken: 'USDC' as const },
  { pair: 'GRASS/USDC',  baseToken: 'GRASS', price: 0.1100, collateralToken: 'USDC' as const },
  { pair: 'ZBT/USDT',   baseToken: 'ZBT',   price: 0.0842, collateralToken: 'USDT' as const },
]
const LIVE_ANIMALS: Array<'shark' | 'whale' | 'shrimp'> = ['shark', 'shark', 'shark', 'whale', 'shrimp']
const TIME_LABELS = ['just now', '1s ago', '2s ago', '5s ago', '10s ago', '15s ago', '20s ago', '30s ago', '45s ago', '1m ago']
let _tradeCounter = 200

function makeLiveTrade(): HomeRecentTrade {
  const p      = LIVE_PAIRS[Math.floor(Math.random() * LIVE_PAIRS.length)]
  const side   = Math.random() > 0.48 ? 'buy' : 'sell'
  const animal = LIVE_ANIMALS[Math.floor(Math.random() * LIVE_ANIMALS.length)]
  const isRS   = Math.random() > 0.75
  const price  = parseFloat((p.price * (0.95 + Math.random() * 0.10)).toFixed(4))
  const amtRaw = Math.floor(1000 + Math.random() * 199000)
  const amount = amtRaw >= 1000 ? `${(amtRaw / 1000).toFixed(2)}K` : `${amtRaw}`
  const colRaw = Math.floor(10 + Math.random() * 1990)
  const collateral = colRaw >= 1000 ? `${(colRaw / 1000).toFixed(2)}K` : `${colRaw}.00`
  const id = `v2live-${++_tradeCounter}`
  return {
    id, timeAgo: 'just now',
    side, isRS,
    pair: p.pair, baseToken: p.baseToken,
    price, amount, collateral, collateralToken: p.collateralToken, animal,
    txId: `0x${Math.random().toString(16).slice(2, 8)}...`,
  }
}

function ageTradeList(trades: HomeRecentTrade[]): HomeRecentTrade[] {
  return trades.map((t, i) => ({ ...t, timeAgo: TIME_LABELS[Math.min(i, TIME_LABELS.length - 1)] }))
}

// ─── Mock price chart data ─────────────────────────────────────────────────────
// Simulates SKATE going from ~0.021 → 0.055 (+162.18%)
const CHART_DATA_ALL = [
  { t: '00:00', p: 2.1, v: 120 }, { t: '01:00', p: 1.9, v: 95 },
  { t: '02:00', p: 2.2, v: 180 }, { t: '03:00', p: 2.5, v: 210 },
  { t: '04:00', p: 2.4, v: 155 }, { t: '05:00', p: 2.8, v: 240 },
  { t: '06:00', p: 3.1, v: 320 }, { t: '07:00', p: 3.0, v: 280 },
  { t: '08:00', p: 3.5, v: 350 }, { t: '09:00', p: 3.8, v: 420 },
  { t: '10:00', p: 4.2, v: 480 }, { t: '11:00', p: 4.1, v: 410 },
  { t: '12:00', p: 4.4, v: 520 }, { t: '13:00', p: 4.7, v: 610 },
  { t: '14:00', p: 5.0, v: 750 }, { t: '15:00', p: 5.5, v: 840 },
  { t: '16:00', p: 5.2, v: 620 }, { t: '17:00', p: 5.6, v: 700 },
  { t: '18:00', p: 5.8, v: 780 }, { t: '19:00', p: 5.4, v: 590 },
  { t: '20:00', p: 5.7, v: 660 }, { t: '21:00', p: 6.0, v: 820 },
  { t: '22:00', p: 5.9, v: 710 }, { t: '23:00', p: 5.5, v: 530 },
]

// ─── Breadcrumb (Figma node 37222:132667) ───
// pathway+delivery: 1376×16px, horizontal, gap=16px
// pathway sub-frame: horizontal, gap=4px between items
// icon-slot: 16×16px with 2px inset → chevron 12×12, color #7a7a83
// text: 12px/400/lh-16px — inactive=#b4b4ba, active=#f9f9fa
// Delivery Scenarios removed per user request
const Breadcrumb: React.FC<{ token: string }> = ({ token }) => (
  <div className="flex items-center h-4">
    <nav className="flex items-center gap-1">
      <Link
        to="/"
        className="text-[12px] font-[400] leading-[16px] text-[#b4b4ba] hover:text-[#f9f9fa] transition-colors whitespace-nowrap"
      >
        Whales.Market
      </Link>
      {/* icon-slot 16×16 → chevron 12×12, color #7a7a83 */}
      <span className="w-4 h-4 flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#7a7a83" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <Link
        to="/"
        className="text-[12px] font-[400] leading-[16px] text-[#b4b4ba] hover:text-[#f9f9fa] transition-colors whitespace-nowrap"
      >
        Pre-market
      </Link>
      <span className="w-4 h-4 flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#7a7a83" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <span className="text-[12px] font-[400] leading-[16px] text-[#f9f9fa] whitespace-nowrap">
        {token}
      </span>
    </nav>
  </div>
)

// ─── Market Header (Figma node 37222:132669) ───
const MarketHeader: React.FC<{ market: HomeMarket }> = ({ market }) => {
  const tokenImg = TOKEN_LOGOS[market.token]
  const chainImg = CHAIN_LOGOS[market.network]

  const countdownLabel = market.settleCountdown
    ? market.settleCountdown
    : market.status === 'ended'
      ? 'ENDED'
      : 'NOT STARTED'

  const countdownVariant = market.settleCountdown
    ? market.status === 'in-progress'
      ? 'text-warning bg-warning/10'
      : 'text-info bg-info-scale-500/10'
    : market.status === 'ended'
      ? 'text-danger bg-danger/10'
      : 'text-info bg-info-scale-500/10'

  return (
    <div className="flex items-center gap-4 py-6 border-b border-border-subtle">
      {/* token-info: flex-1, gap-32 */}
      <div className="flex-1 flex items-start gap-8">
        {/* token: icon + name */}
        <div className="flex items-center gap-2">
          <div className="relative w-[44px] h-[44px] flex items-center justify-center">
            {tokenImg ? (
              <img src={tokenImg} alt={market.token} className="w-9 h-9 rounded-full" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-16">
                {market.logo}
              </div>
            )}
            {chainImg ? (
              <img
                src={chainImg}
                alt={market.network}
                className="absolute bottom-0 left-0 w-4 h-4 rounded-sm border-2 border-bg-base"
              />
            ) : (
              <span className="absolute bottom-0 left-0 w-4 h-4 rounded-sm bg-bg-elevated border-2 border-bg-base flex items-center justify-center text-[8px] text-text-muted uppercase">
                {market.network.slice(0, 2)}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-18 font-medium text-text-primary">{market.token}</span>
            <div className="py-0.5">
              <span className="text-12 text-text-muted whitespace-nowrap">{market.tokenName}</span>
            </div>
          </div>
        </div>

        {/* price + stats wrapped in items-end so all values bottom-align with % change */}
        <div className="flex items-end gap-8">

          {/* price — gap-1 (4px) between price and % change */}
          <div className="flex flex-col gap-1">
            <span className="text-18 font-medium text-text-primary">${fmtPrice(market.price)}</span>
            <span className={clsx('text-12', market.priceChange24h >= 0 ? 'text-success' : 'text-danger')}>
              {market.priceChange24h >= 0 ? '+' : ''}{market.priceChange24h.toFixed(2)}%
            </span>
          </div>

          {/* stats: 3 items — items-end aligns all value rows with price % change */}
          <div className="flex items-end gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-12 text-text-muted border-b border-dashed border-border-default pb-px cursor-help whitespace-nowrap">
                24h Vol.
              </span>
              <div className="flex items-center gap-1">
                <span className="text-12 text-text-primary whitespace-nowrap">{fmtVol(market.vol24h)}</span>
                <span className={clsx('text-12 whitespace-nowrap', market.vol24hChange >= 0 ? 'text-success' : 'text-danger')}>
                  {fmtVolChange(market.vol24hChange)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-12 text-text-muted border-b border-dashed border-border-default pb-px cursor-help whitespace-nowrap">
                Total Vol.
              </span>
              <span className="text-12 text-text-primary whitespace-nowrap">{fmtVol(market.totalVol)}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-12 text-text-muted border-b border-dashed border-border-default pb-px cursor-help whitespace-nowrap">
                Countdown
              </span>
              <span className={clsx(
                'inline-flex items-center self-start px-2 py-0.5 rounded-full text-10 font-medium uppercase whitespace-nowrap',
                countdownVariant,
              )}>
                {countdownLabel}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* buttons */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          {/* About token group */}
          <div className="flex items-center border border-neutral-800 rounded-lg overflow-hidden">
            <button className="flex items-center gap-1.5 h-9 pl-4 pr-2 text-14 font-medium text-text-primary hover:bg-bg-hover transition-colors whitespace-nowrap">
              About {market.token}
              <span className="w-5 h-5 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 4H12V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div className="w-px self-stretch bg-neutral-800" />
            <button className="flex items-center justify-center w-9 h-9 hover:bg-bg-hover transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="#F9F9FA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Airdrop Checker */}
          <div className="h-9 p-[1px] rounded-lg bg-gradient-to-r from-[#86ddb1] to-[#15af77] flex-shrink-0">
            <button className="flex items-center gap-1.5 h-full pl-2 pr-4 rounded-[7px] bg-bg-base text-14 font-medium hover:bg-bg-hover transition-colors">
              <span className="w-5 h-5 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2C4.69 2 2 5.13 2 9H6M8 2C11.31 2 14 5.13 14 9H10M8 2V9M8 14C6.9 14 6 13.1 6 12V9" stroke="#5BD197" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent whitespace-nowrap">
                Airdrop Checker
              </span>
            </button>
          </div>

          {/* Earn 50% Fee */}
          <div className="h-9 p-[1px] rounded-lg bg-gradient-to-r from-[#cdba35] to-[#ef9632] flex-shrink-0">
            <button className="flex items-center gap-1.5 h-full pl-2 pr-4 rounded-[7px] bg-bg-base text-14 font-medium hover:bg-bg-hover transition-colors">
              <span className="w-5 h-5 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 5.5C13 3.567 10.761 2 8 2C5.239 2 3 3.567 3 5.5C3 7.433 5.239 9 8 9C10.761 9 13 7.433 13 5.5Z" stroke="#D2B535" strokeWidth="1.2"/>
                  <path d="M3 5.5V10.5C3 12.433 5.239 14 8 14C10.761 14 13 12.433 13 10.5V5.5" stroke="#D2B535" strokeWidth="1.2"/>
                </svg>
              </span>
              <span className="bg-gradient-to-r from-[#ff8731] to-[#bfc736] bg-clip-text text-transparent whitespace-nowrap">
                Earn 50% Fee
              </span>
            </button>
          </div>

        </div>

        <div className="w-px h-[18px] bg-neutral-800" />

        <button className="flex items-center h-9 px-4 rounded-lg bg-neutral-50 text-14 font-medium text-text-inverse hover:bg-neutral-200 transition-colors whitespace-nowrap">
          Create Order
        </button>
      </div>
    </div>
  )
}

// ─── Price Line Chart (Figma 37315:161696) ────────────────────────────────────
type ChartPeriod = '1d' | '7d' | '30d' | 'All'
type ChartType   = 'Price' | 'FDV'

interface ChartPoint { t: string; p: number; v: number }

const PriceLineChart: React.FC<{ market: HomeMarket }> = ({ market }) => {
  const [period, setPeriod] = useState<ChartPeriod>('All')
  const [chartType, setChartType] = useState<ChartType>('Price')
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  // slice data by period
  const data: ChartPoint[] = useMemo(() => {
    const slices: Record<ChartPeriod, number> = { '1d': 8, '7d': 12, '30d': 18, All: 24 }
    return CHART_DATA_ALL.slice(-slices[period])
  }, [period])

  // scale — use p values (multiply by 0.01 to get real price)
  const W = 900; const H_CHART = 280; const H_VOL = 60; const H_TOTAL = H_CHART + H_VOL + 20
  const minP = Math.min(...data.map(d => d.p))
  const maxP = Math.max(...data.map(d => d.p))
  const padP = (maxP - minP) * 0.1
  const domainMin = minP - padP
  const domainMax = maxP + padP
  const maxV = Math.max(...data.map(d => d.v))

  const xStep = W / (data.length - 1)
  const yPrice = (p: number) => H_CHART - ((p - domainMin) / (domainMax - domainMin)) * (H_CHART - 20) - 10
  const yVol   = (v: number) => H_VOL - (v / maxV) * (H_VOL - 4)

  // Build SVG path for price line
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${yPrice(d.p)}`).join(' ')
  const areaPath = `${linePath} L ${(data.length - 1) * xStep} ${H_CHART} L 0 ${H_CHART} Z`

  const hoveredData = hoverIdx !== null ? data[hoverIdx] : data[data.length - 1]
  const isUp = data[data.length - 1].p >= data[0].p

  return (
    <div className="flex flex-col gap-0 border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border-subtle">
        <div className="flex items-center gap-1">
          {(['1d', '7d', '30d', 'All'] as ChartPeriod[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx(
                'px-3 h-7 rounded text-12 font-medium transition-colors',
                period === p
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-bg-elevated rounded-lg">
          {(['Price', 'FDV'] as ChartType[]).map(t => (
            <button
              key={t}
              onClick={() => setChartType(t)}
              className={clsx(
                'px-3 h-7 rounded-md text-12 font-medium transition-colors',
                chartType === t
                  ? 'bg-bg-base text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Price info row */}
      <div className="flex items-center gap-4 px-4 pt-3 pb-2">
        <span className="text-20 font-medium text-text-primary tabular-nums">
          ${(hoveredData.p * 0.01).toFixed(4)}
        </span>
        <span className={clsx('text-12', isUp ? 'text-success' : 'text-danger')}>
          {isUp ? '+' : ''}{(((data[data.length-1].p - data[0].p) / data[0].p) * 100).toFixed(2)}%
        </span>
        {hoverIdx !== null && (
          <span className="text-12 text-text-muted ml-auto">{hoveredData.t}</span>
        )}
      </div>

      {/* SVG chart */}
      <div className="px-2 pb-0">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H_TOTAL}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: 330 }}
          onMouseLeave={() => setHoverIdx(null)}
          onMouseMove={e => {
            const rect = (e.currentTarget as SVGElement).getBoundingClientRect()
            const x = ((e.clientX - rect.left) / rect.width) * W
            const idx = Math.round(x / xStep)
            setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)))
          }}
        >
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isUp ? '#5BD197' : '#FD5E67'} stopOpacity="0.18" />
              <stop offset="100%" stopColor={isUp ? '#5BD197' : '#FD5E67'} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(frac => {
            const y = 10 + frac * (H_CHART - 20)
            const price = domainMax - frac * (domainMax - domainMin)
            return (
              <g key={frac}>
                <line x1="0" y1={y} x2={W} y2={y} stroke="#1B1B1C" strokeWidth="1" />
                <text x="4" y={y - 3} fill="#7A7A83" fontSize="10" fontFamily="Inter">
                  ${(price * 0.01).toFixed(4)}
                </text>
              </g>
            )
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#chartGrad)" />

          {/* Price line */}
          <path
            d={linePath}
            fill="none"
            stroke={isUp ? '#5BD197' : '#FD5E67'}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Hover vertical line */}
          {hoverIdx !== null && (
            <>
              <line
                x1={hoverIdx * xStep}
                y1={0}
                x2={hoverIdx * xStep}
                y2={H_CHART}
                stroke="#2E2E34"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={hoverIdx * xStep}
                cy={yPrice(data[hoverIdx].p)}
                r="4"
                fill={isUp ? '#5BD197' : '#FD5E67'}
                stroke="#0A0A0B"
                strokeWidth="1.5"
              />
            </>
          )}

          {/* Volume bars — in bottom H_VOL px offset by H_CHART+gap */}
          {data.map((d, i) => {
            const barW = Math.max(1, xStep * 0.6)
            const barH = (d.v / maxV) * (H_VOL - 4)
            const x = i * xStep - barW / 2
            const y = H_CHART + 20 + (H_VOL - 4) - barH
            const isHighlight = hoverIdx === i
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width={barW}
                height={barH}
                fill={d.v > maxV * 0.6 ? (isUp ? '#5BD197' : '#FD5E67') : '#252527'}
                opacity={isHighlight ? 1 : 0.6}
                rx="1"
              />
            )
          })}

          {/* X-axis time labels */}
          {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, i, arr) => {
            const origIdx = data.indexOf(d)
            return (
              <text
                key={i}
                x={origIdx * xStep}
                y={H_TOTAL - 2}
                fill="#7A7A83"
                fontSize="10"
                fontFamily="Inter"
                textAnchor={origIdx === 0 ? 'start' : origIdx === data.length - 1 ? 'end' : 'middle'}
              >
                {d.t}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// ─── Order Book (Figma 37315:161694) ─────────────────────────────────────────
// Side-by-side: Ask (sell) on left, Bid (buy) on right
const OrderBook: React.FC = () => {
  const [precision, setPrecision] = useState<'0.00001' | '0.0001' | '0.001'>('0.00001')
  const midPrice = ((mockBuyOrders[0].price + mockSellOrders[0].price) / 2)
  const spread    = mockSellOrders[0].price - mockBuyOrders[0].price
  const spreadPct = ((spread / midPrice) * 100).toFixed(3)

  const maxDepthSell = Math.max(...mockSellOrders.map(o => o.depth ?? 0))
  const maxDepthBuy  = Math.max(...mockBuyOrders.map(o => o.depth ?? 0))

  return (
    <div className="border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 h-11 border-b border-border-subtle">
        <span className="text-14 font-medium text-text-primary">Order Book</span>
        <div className="flex items-center gap-1">
          {(['0.00001', '0.0001', '0.001'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPrecision(p)}
              className={clsx(
                'px-2 h-6 rounded text-11 font-medium transition-colors',
                precision === p
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column order book */}
      <div className="flex divide-x divide-border-subtle">
        {/* SELL side (Ask) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center h-8 px-3 border-b border-border-subtle">
            <span className="flex-1 text-11 font-medium text-text-muted text-left">Total</span>
            <span className="flex-1 text-11 font-medium text-text-muted text-right">Amount</span>
            <span className="w-24 text-11 font-medium text-danger text-right">Price ($)</span>
          </div>
          <div className="flex flex-col">
            {mockSellOrders.map((order, i) => {
              const depthPct = ((order.depth ?? 0) / maxDepthSell) * 100
              return (
                <div
                  key={i}
                  className="relative flex items-center h-9 px-3 hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  {/* depth bar — from right */}
                  <div
                    className="absolute right-0 top-0 h-full bg-danger/10 transition-all"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="relative flex-1 text-12 text-text-secondary tabular-nums text-left">
                    {order.total.toFixed(1)}
                  </span>
                  <span className="relative flex-1 text-12 text-text-secondary tabular-nums text-right">
                    {fmtAmt(order.amount)}
                  </span>
                  <span className="relative w-24 text-12 font-medium text-danger tabular-nums text-right">
                    {order.price.toFixed(6)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* BUY side (Bid) */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center h-8 px-3 border-b border-border-subtle">
            <span className="w-24 text-11 font-medium text-success text-left">Price ($)</span>
            <span className="flex-1 text-11 font-medium text-text-muted text-left">Amount</span>
            <span className="flex-1 text-11 font-medium text-text-muted text-right">Total</span>
          </div>
          <div className="flex flex-col">
            {mockBuyOrders.map((order, i) => {
              const depthPct = ((order.depth ?? 0) / maxDepthBuy) * 100
              return (
                <div
                  key={i}
                  className="relative flex items-center h-9 px-3 hover:bg-white/[0.02] cursor-pointer transition-colors group"
                >
                  {/* depth bar — from left */}
                  <div
                    className="absolute left-0 top-0 h-full bg-success/10 transition-all"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="relative w-24 text-12 font-medium text-success tabular-nums text-left">
                    {order.price.toFixed(6)}
                  </span>
                  <span className="relative flex-1 text-12 text-text-secondary tabular-nums text-left pl-3">
                    {fmtAmt(order.amount)}
                  </span>
                  <span className="relative flex-1 text-12 text-text-secondary tabular-nums text-right">
                    {order.total.toFixed(1)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mid price + spread row */}
      <div className="flex items-center justify-center gap-4 h-10 border-t border-border-subtle bg-bg-elevated/50">
        <span className="text-14 font-medium text-text-primary tabular-nums">
          ${midPrice.toFixed(6)}
        </span>
        <span className="text-12 text-text-muted">
          Spread: {spread.toFixed(6)} ({spreadPct}%)
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-border-subtle">
        <button className="flex-1 h-8 rounded-md bg-success/10 text-12 font-medium text-success hover:bg-success/20 transition-colors">
          Buy Order
        </button>
        <button className="flex-1 h-8 rounded-md bg-danger/10 text-12 font-medium text-danger hover:bg-danger/20 transition-colors">
          Sell Order
        </button>
      </div>
    </div>
  )
}

// ─── Left Column ─────────────────────────────────────────────────────────────
const LeftColumn: React.FC<{ market: HomeMarket }> = ({ market }) => {
  const [activeTab, setActiveTab] = useState<'collateral' | 'fill' | 'order'>('collateral')

  // Live trade simulation
  const [liveTradesRaw, setLiveTradesRaw] = useState<HomeRecentTrade[]>(
    () => [...mockHomeRecentTrades],
  )
  const [newId, setNewId] = useState<string | null>(null)

  useEffect(() => {
    const t = setInterval(() => {
      const trade = makeLiveTrade()
      setNewId(trade.id)
      setLiveTradesRaw(prev => {
        const aged = ageTradeList([trade, ...prev])
        return aged.slice(0, 10)
      })
      setTimeout(() => setNewId(null), 400)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4 py-4">
      {/* Trading Market header — Figma 37315:160544, h=48, SPACE_BETWEEN */}
      <div className="flex items-center justify-between h-12">
        {/* Left: title + "How it work?" */}
        <div className="flex flex-col gap-1">
          <span className="text-18 font-medium text-text-primary">Trading Market</span>
          <button className="flex items-center gap-0.5 text-12 text-text-muted hover:text-text-secondary transition-colors">
            How it work?
            <span className="w-4 h-4 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4.5 3H9V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 3L3 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>

        {/* Right: Collateral / Fill Type / Order Type dropdowns + chart icon */}
        <div className="flex items-center gap-2">
          {(['Collateral', 'Fill Type', 'Order Type'] as const).map((tab) => {
            const tabKey: typeof activeTab = tab === 'Fill Type' ? 'fill' : tab === 'Order Type' ? 'order' : 'collateral'
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabKey)}
                className={clsx(
                  'flex items-center gap-1.5 h-9 pl-4 pr-2 rounded-lg bg-bg-surface text-14 font-medium text-text-primary transition-colors hover:bg-bg-elevated',
                  activeTab === tabKey && 'ring-1 ring-border-active',
                )}
              >
                {tab === 'Collateral' ? market.collateral : tab}
                <span className="w-4 h-4 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="#7A7A83" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </button>
            )
          })}

          {/* Chart icon button — chart_line_fill, #5BD197 */}
          <button className="flex items-center justify-center w-9 h-9 rounded-lg bg-bg-surface hover:bg-bg-elevated transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 11L6.5 6L9.5 9.5L13 4" stroke="#5BD197" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.5 4H13V6.5" stroke="#5BD197" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Chart (Figma 37315:161696) */}
      <PriceLineChart market={market} />

      {/* Order Book (Figma 37315:161694) */}
      <OrderBook />

      {/* Recent Trades (Figma 37315:189288) */}
      <RecentTradesTable trades={liveTradesRaw} newId={newId} />
    </div>
  )
}

// ─── Mini Price Chart for right column ───────────────────────────────────────
const MiniPriceChart: React.FC<{ isUp?: boolean }> = ({ isUp = true }) => {
  const W = 360; const H = 260
  const data = CHART_DATA_ALL.slice(-12)
  const minP = Math.min(...data.map(d => d.p))
  const maxP = Math.max(...data.map(d => d.p))
  const padP = (maxP - minP) * 0.15
  const domainMin = minP - padP
  const domainMax = maxP + padP
  const xStep = W / (data.length - 1)
  const yP = (p: number) => H - ((p - domainMin) / (domainMax - domainMin)) * (H - 20) - 10
  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${yP(d.p)}`).join(' ')
  const areaPath = `${linePath} L ${(data.length - 1) * xStep} ${H} L 0 ${H} Z`
  const color = isUp ? '#5BD197' : '#FD5E67'

  return (
    <div className="border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 h-11 border-b border-border-subtle">
        <span className="text-14 font-medium text-text-primary">Price Chart</span>
        <div className="flex items-center gap-1">
          {['1d', '7d', '30d'].map(p => (
            <button key={p} className="px-2 h-6 rounded text-11 text-text-muted hover:text-text-secondary transition-colors">
              {p}
            </button>
          ))}
        </div>
      </div>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ height: 220, display: 'block' }}
      >
        <defs>
          <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#miniGrad)" />
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

// ─── My Orders (Figma 37225:131293) ───────────────────────────────────────────
const MyOrdersSection: React.FC<{ token: string }> = ({ token }) => {
  const [tab, setTab] = useState<'filled' | 'open'>('filled')

  const filledOrders = mockMyOrders.filter(o => o.status === 'filled')
  const openOrders   = mockMyOrders.filter(o => o.status === 'open' || o.status === 'partial')
  const displayed    = tab === 'filled' ? filledOrders : openOrders

  return (
    <div className="flex flex-col border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
      {/* Tab header */}
      <div className="flex items-center border-b border-border-subtle px-1">
        <button
          onClick={() => setTab('filled')}
          className={clsx(
            'flex items-center gap-1.5 px-3 h-11 text-13 font-medium transition-colors border-b-2 -mb-px',
            tab === 'filled'
              ? 'text-text-primary border-accent'
              : 'text-text-muted border-transparent hover:text-text-secondary',
          )}
        >
          My Filled Orders
          <span className={clsx(
            'px-1.5 py-0.5 rounded-full text-10 font-medium',
            tab === 'filled' ? 'bg-accent/20 text-accent' : 'bg-bg-elevated text-text-muted',
          )}>
            {filledOrders.length}
          </span>
        </button>
        <button
          onClick={() => setTab('open')}
          className={clsx(
            'flex items-center gap-1.5 px-3 h-11 text-13 font-medium transition-colors border-b-2 -mb-px',
            tab === 'open'
              ? 'text-text-primary border-accent'
              : 'text-text-muted border-transparent hover:text-text-secondary',
          )}
        >
          My Open Orders
          <span className={clsx(
            'px-1.5 py-0.5 rounded-full text-10 font-medium',
            tab === 'open' ? 'bg-accent/20 text-accent' : 'bg-bg-elevated text-text-muted',
          )}>
            {openOrders.length}
          </span>
        </button>
      </div>

      {/* Column header */}
      <div className="grid grid-cols-4 px-4 py-2 border-b border-border-subtle">
        <span className="text-11 text-text-muted">Side / Pair</span>
        <span className="text-11 text-text-muted text-right">Price ($)</span>
        <span className="text-11 text-text-muted text-right">Amount</span>
        <span className="text-11 text-text-muted text-right">
          {tab === 'filled' ? 'Total' : 'Filled'}
        </span>
      </div>

      {/* Rows */}
      <div className="flex flex-col overflow-y-auto max-h-[480px]">
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-text-muted">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="text-13 text-text-muted">No {tab} orders</span>
          </div>
        ) : (
          displayed.map(order => (
            <div
              key={order.id}
              className="grid grid-cols-4 items-center px-4 py-3 border-b border-border-subtle hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className={clsx(
                  'text-12 font-medium',
                  order.type === 'buy' ? 'text-success' : 'text-danger',
                )}>
                  {order.type === 'buy' ? 'Buy' : 'Sell'}
                </span>
                <span className="text-11 text-text-muted">{order.token}/USDC</span>
              </div>
              <span className="text-12 text-text-primary tabular-nums text-right">
                ${fmtPrice(order.price)}
              </span>
              <span className="text-12 text-text-secondary tabular-nums text-right">
                {fmtAmt(order.amount)}
              </span>
              {tab === 'filled' ? (
                <span className="text-12 text-text-primary tabular-nums text-right">
                  ${(order.price * order.amount).toFixed(2)}
                </span>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <span className="text-12 text-text-secondary tabular-nums">
                    {order.filled}%
                  </span>
                  <div className="w-16 h-1 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full', order.type === 'buy' ? 'bg-success' : 'bg-danger')}
                      style={{ width: `${order.filled}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer — cancel all */}
      {tab === 'open' && openOrders.length > 0 && (
        <div className="px-4 py-3 border-t border-border-subtle">
          <button className="w-full h-8 rounded-md border border-danger/40 text-12 font-medium text-danger hover:bg-danger/10 transition-colors">
            Cancel All Orders
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Trade Panel (Figma 37692:254729) ────────────────────────────────────────
const TradePanel: React.FC<{ market: HomeMarket }> = ({ market }) => {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy')
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit')
  const [price, setPrice] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const total = useMemo(() => {
    const p = parseFloat(price) || 0
    const a = parseFloat(amount) || 0
    return (p * a).toFixed(2)
  }, [price, amount])

  const feeAmt = useMemo(() => {
    const t = parseFloat(total)
    return isNaN(t) ? '0.00' : (t * 0.003).toFixed(4)
  }, [total])

  const handleTrade = async () => {
    if (!price || !amount) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    if (Math.random() < 0.1) {
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    setPrice('')
    setAmount('')
  }

  const isBuy = tab === 'buy'

  return (
    <div className="flex flex-col gap-0 border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
      {/* Buy/Sell toggle */}
      <div className="flex p-1 gap-1">
        <button
          onClick={() => setTab('buy')}
          className={clsx(
            'flex-1 h-9 rounded-md text-14 font-medium transition-colors',
            isBuy
              ? 'bg-success text-bg-base'
              : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated',
          )}
        >
          Buy
        </button>
        <button
          onClick={() => setTab('sell')}
          className={clsx(
            'flex-1 h-9 rounded-md text-14 font-medium transition-colors',
            !isBuy
              ? 'bg-danger text-bg-base'
              : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated',
          )}
        >
          Sell
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        {/* Order type */}
        <div className="flex items-center gap-1 p-0.5 bg-bg-elevated rounded-lg">
          {(['limit', 'market'] as const).map(t => (
            <button
              key={t}
              onClick={() => setOrderType(t)}
              className={clsx(
                'flex-1 h-7 rounded-md text-12 font-medium capitalize transition-colors',
                orderType === t
                  ? 'bg-bg-base text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-secondary',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Price input */}
        <div className="flex flex-col gap-1">
          <label className="text-12 text-text-muted">Price</label>
          <div className="flex items-center gap-2 h-10 px-3 bg-bg-elevated rounded-lg border border-transparent
                          focus-within:border-accent/50 transition-colors">
            <input
              type="number"
              placeholder={`${fmtPrice(market.price)}`}
              value={price}
              onChange={e => setPrice(e.target.value)}
              disabled={orderType === 'market'}
              className="flex-1 bg-transparent text-13 text-text-primary placeholder:text-text-muted outline-none tabular-nums disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="text-12 text-text-muted shrink-0">USDC</span>
          </div>
        </div>

        {/* Amount input */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-12 text-text-muted">Amount</label>
            <span className="text-11 text-text-muted">Balance: 8,420 USDC</span>
          </div>
          <div className="flex items-center gap-2 h-10 px-3 bg-bg-elevated rounded-lg border border-transparent
                          focus-within:border-accent/50 transition-colors">
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-13 text-text-primary placeholder:text-text-muted outline-none tabular-nums"
            />
            <button
              onClick={() => setAmount('100000')}
              className="text-11 font-medium text-accent hover:text-accent/80 transition-colors shrink-0"
            >
              Max
            </button>
            <span className="text-12 text-text-muted shrink-0">{market.token}</span>
          </div>
        </div>

        {/* Percentage quick-select */}
        <div className="flex items-center gap-1">
          {[25, 50, 75, 100].map(pct => (
            <button
              key={pct}
              onClick={() => setAmount(String(Math.floor(8420 / (parseFloat(price) || market.price) * pct / 100)))}
              className="flex-1 h-7 rounded-md text-11 font-medium text-text-muted bg-bg-elevated hover:text-text-secondary hover:bg-bg-hover transition-colors"
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between text-12">
            <span className="text-text-muted">Total</span>
            <span className="text-text-primary tabular-nums">{total} USDC</span>
          </div>
          <div className="flex items-center justify-between text-12">
            <span className="text-text-muted">Fee (0.3%)</span>
            <span className="text-text-secondary tabular-nums">{feeAmt} USDC</span>
          </div>
          <div className="flex items-center justify-between text-12">
            <span className="text-text-muted">Est. Received</span>
            <span className={clsx('tabular-nums', isBuy ? 'text-success' : 'text-danger')}>
              {amount ? `${parseFloat(amount).toLocaleString()} ${market.token}` : '—'}
            </span>
          </div>
        </div>

        {/* Trade button */}
        <button
          onClick={handleTrade}
          disabled={isLoading || !price || !amount}
          className={clsx(
            'w-full h-11 rounded-lg text-14 font-medium transition-colors',
            isBuy
              ? 'bg-success text-bg-base hover:bg-success/90 disabled:opacity-50'
              : 'bg-danger text-bg-base hover:bg-danger/90 disabled:opacity-50',
            (isLoading || !price || !amount) && 'cursor-not-allowed',
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            `Trade (Taker) — ${isBuy ? 'Buy' : 'Sell'} ${market.token}`
          )}
        </button>

        {/* Collateral info */}
        <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-12">
          <span className="text-text-muted flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#7A7A83" strokeWidth="1"/>
              <path d="M6 5v4M6 3.5v.5" stroke="#7A7A83" strokeLinecap="round"/>
            </svg>
            Collateral: {market.collateral}
          </span>
          <span className="text-text-secondary">Fill Type: Partial</span>
        </div>
      </div>
    </div>
  )
}

// ─── Right Column ─────────────────────────────────────────────────────────────
const RightColumn: React.FC<{ market: HomeMarket }> = ({ market }) => {
  const isUp = market.priceChange24h >= 0
  return (
    <div className="w-[384px] flex-shrink-0 flex flex-col gap-4 py-4">
      {/* Trade Panel (Figma 37692:254729) */}
      <TradePanel market={market} />

      {/* Price Chart (Figma 37222:132675) — 384×336 */}
      <MiniPriceChart isUp={isUp} />

      {/* My Orders (Figma 37225:131293) — 384×608 */}
      <MyOrdersSection token={market.token} />
    </div>
  )
}

// ─── Bottom Stats ───
const BottomStats: React.FC = () => (
  <div className="flex items-center justify-between h-11 border-t border-border-subtle">
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-buy animate-pulse" />
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
      <span className="text-12 text-text-muted hover:text-text-secondary cursor-pointer">Docs</span>
      <span className="text-12 text-text-muted hover:text-text-secondary cursor-pointer">Dune</span>
      <span className="text-12 text-text-muted hover:text-text-secondary cursor-pointer">Link3</span>
    </div>
  </div>
)

// ─── Main Page Component ───
export const MarketDetailV2Page: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const market = useMemo(() => findMarketById(id ?? ''), [id])

  if (!market) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-24 font-medium text-text-primary mb-2">Market not found</h2>
        <p className="text-14 text-text-muted mb-6">The market &ldquo;{id}&rdquo; does not exist.</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 rounded-lg bg-accent text-14 font-medium text-bg-base hover:bg-accent/90 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
      {/* pathway+delivery wrapper: Figma body gap=16px top, gap=16px before market-header */}
      <div className="pt-4 pb-4">
        <Breadcrumb token={market.token} />
      </div>

      <MarketHeader market={market} />

      <div className="flex gap-4">
        <LeftColumn market={market} />
        <div className="w-px bg-border-subtle self-stretch" />
        <RightColumn market={market} />
      </div>

      <BottomStats />
    </div>
  )
}
