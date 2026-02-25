// Figma node 37222:132664 — Market Detail V2 (dynamic per token)
// Layout: 1920x2046, bg=#0a0a0b
// Body container: max-w-[1440px] centered
// market-detail: 1376px (px-4 = 16px each side), VERTICAL, gap between sections

import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  mockHomeMarkets, mockUpcomingListings, mockEndedMarkets,
  type HomeMarket,
} from '@/mock-data/homeData'

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

  // Try exact match first
  const exact = allMarkets.find(m => m.id === id)
  if (exact) return exact

  // Try matching by token ticker (case-insensitive) — e.g. route id "skate" → token "SKATE"
  const byToken = allMarkets.find(m => m.token.toLowerCase() === id.toLowerCase())
  if (byToken) return byToken

  // Try matching by id prefix — e.g. route id "skate-progress" matches
  return allMarkets.find(m => m.id.startsWith(id.toLowerCase()))
}

// ─── Breadcrumb (Figma node 37222:132667) ───
const Breadcrumb: React.FC<{ token: string }> = ({ token }) => (
  <div className="flex items-center justify-between h-4">
    <nav className="flex items-center gap-0">
      <Link to="/" className="text-12 text-text-secondary hover:text-text-primary transition-colors">
        Whales.Market
      </Link>
      <span className="w-4 h-4 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#B4B4BA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <Link to="/" className="text-12 text-text-secondary hover:text-text-primary transition-colors">
        Pre-market
      </Link>
      <span className="w-4 h-4 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#B4B4BA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <span className="text-12 text-text-primary">{token}</span>
    </nav>
    <button className="flex items-center gap-1 text-12 font-medium text-success hover:text-success/80 transition-colors">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Delivery Scenarios
    </button>
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
      <div className="flex-1 flex items-center gap-8">
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

        {/* price */}
        <div className="flex flex-col">
          <span className="text-18 font-medium text-text-primary">${fmtPrice(market.price)}</span>
          <div className="py-0.5">
            <span className={clsx('text-12', market.priceChange24h >= 0 ? 'text-success' : 'text-danger')}>
              {market.priceChange24h >= 0 ? '+' : ''}{market.priceChange24h.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* stats: 3 items */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <div className="py-1.5">
              <span className="text-12 text-text-muted border-b border-dashed border-border-default pb-px cursor-help">
                24h Vol.
              </span>
            </div>
            <div className="flex items-center gap-1 py-0.5">
              <span className="text-12 text-text-primary">{fmtVol(market.vol24h)}</span>
              <span className={clsx('text-12', market.vol24hChange >= 0 ? 'text-success' : 'text-danger')}>
                {fmtVolChange(market.vol24hChange)}
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="py-1.5">
              <span className="text-12 text-text-muted border-b border-dashed border-border-default pb-px cursor-help">
                Total Vol.
              </span>
            </div>
            <div className="py-0.5">
              <span className="text-12 text-text-primary">{fmtVol(market.totalVol)}</span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="py-1.5">
              <span className="text-12 text-text-muted border-b border-dashed border-border-default pb-px cursor-help">
                Countdown
              </span>
            </div>
            <span className={clsx(
              'inline-flex items-center self-start px-2 py-1 rounded-full text-10 font-medium uppercase',
              countdownVariant,
            )}>
              {countdownLabel}
            </span>
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

          {/* More */}
          <button className="flex items-center justify-center w-9 h-9 rounded-lg bg-bg-surface hover:bg-bg-hover transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="4" cy="8" r="1.25" fill="#F9F9FA"/>
              <circle cx="8" cy="8" r="1.25" fill="#F9F9FA"/>
              <circle cx="12" cy="8" r="1.25" fill="#F9F9FA"/>
            </svg>
          </button>
        </div>

        <div className="w-px h-[18px] bg-neutral-800" />

        <button className="flex items-center h-9 px-4 rounded-lg bg-neutral-50 text-14 font-medium text-text-inverse hover:bg-neutral-200 transition-colors whitespace-nowrap">
          Create Order
        </button>
      </div>
    </div>
  )
}

// ─── Left Column: Trading Market ───
const LeftColumn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collateral' | 'fill' | 'order'>('collateral')
  const [chartPeriod, setChartPeriod] = useState<'2d' | '1w' | '1M' | 'All'>('All')

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between h-7">
        <span className="text-16 font-medium text-text-primary">Trading Market</span>
        <div className="flex items-center gap-2">
          <span className="text-12 text-text-muted">Block Event</span>
          <div className="w-8 h-4 rounded-full bg-bg-elevated relative cursor-pointer">
            <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-text-muted transition-transform" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between h-12">
        <div className="flex items-center gap-2">
          {(['Collateral', 'Fill Type', 'Order Type'] as const).map((tab) => {
            const tabKey: typeof activeTab = tab === 'Fill Type' ? 'fill' : tab === 'Order Type' ? 'order' : 'collateral'
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tabKey)}
                className={clsx(
                  'px-3 h-8 rounded-md text-12 font-medium transition-colors',
                  activeTab === tabKey
                    ? 'bg-bg-elevated text-text-primary'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {tab}
                <svg className="inline-block ml-1" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                </svg>
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-1">
          {(['2d', '1w', '1M', 'All'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setChartPeriod(p)}
              className={clsx(
                'px-2 h-7 rounded text-12 font-medium transition-colors',
                chartPeriod === p
                  ? 'bg-bg-elevated text-text-primary'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-[424px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
        <span className="text-14 text-text-muted">Chart Area — 928 × 424</span>
      </div>

      <div className="w-full h-[742px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
        <span className="text-14 text-text-muted">Order Book Table — 928 × 742</span>
      </div>

      <div className="w-full flex flex-col gap-2 py-4">
        <h3 className="text-16 font-medium text-text-primary">Recent Trades</h3>
        <div className="w-full h-[480px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
          <span className="text-14 text-text-muted">Recent Trades Table — 928 × 532</span>
        </div>
      </div>
    </div>
  )
}

// ─── Right Column: Trade + Chart + My Orders ───
const RightColumn: React.FC<{ token: string }> = ({ token }) => {
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy')
  const [ordersTab, setOrdersTab] = useState<'filled' | 'open'>('filled')

  return (
    <div className="w-[384px] flex-shrink-0 flex flex-col gap-4 py-4">
      {/* Trade Panel */}
      <div className="flex flex-col gap-4 pb-6 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <h3 className="text-16 font-medium text-text-primary">Trade {token}</h3>
          <span className="text-12 text-text-muted">Price</span>
        </div>

        <div className="flex items-center gap-0 p-1 rounded-lg bg-bg-surface">
          <button
            onClick={() => setTradeTab('buy')}
            className={clsx(
              'flex-1 h-9 rounded-md text-14 font-medium transition-colors',
              tradeTab === 'buy'
                ? 'bg-buy text-bg-base'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setTradeTab('sell')}
            className={clsx(
              'flex-1 h-9 rounded-md text-14 font-medium transition-colors',
              tradeTab === 'sell'
                ? 'bg-sell text-bg-base'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            Sell
          </button>
        </div>

        <div className="w-full h-[120px] rounded-lg bg-bg-elevated flex items-center justify-center">
          <span className="text-12 text-text-muted">Trade illustration</span>
        </div>

        <button className={clsx(
          'w-full h-12 rounded-lg text-14 font-medium transition-colors',
          tradeTab === 'buy'
            ? 'bg-buy text-bg-base hover:bg-buy/90'
            : 'bg-sell text-bg-base hover:bg-sell/90'
        )}>
          Trade (Taker)
        </button>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-12">
            <span className="text-text-muted">Fees</span>
            <span className="text-text-primary">-</span>
          </div>
          <div className="flex items-center justify-between text-12">
            <span className="text-text-muted">Amount (Collateral)</span>
            <span className="text-text-primary">-</span>
          </div>
          <div className="flex items-center justify-between text-12">
            <span className="text-text-muted">Est. Received</span>
            <span className="text-text-primary">-</span>
          </div>
        </div>
      </div>

      <div className="w-full h-[336px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
        <span className="text-14 text-text-muted">Price Chart — 384 × 336</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-0">
          <button
            onClick={() => setOrdersTab('filled')}
            className={clsx(
              'px-3 h-8 text-14 font-medium transition-colors border-b-2',
              ordersTab === 'filled'
                ? 'text-text-primary border-accent'
                : 'text-text-muted border-transparent hover:text-text-secondary'
            )}
          >
            My Filled Orders
            <span className={clsx(
              'ml-1.5 px-1.5 py-0.5 rounded-full text-10 font-medium',
              ordersTab === 'filled' ? 'bg-accent/20 text-accent' : 'bg-bg-elevated text-text-muted'
            )}>
              10
            </span>
          </button>
          <button
            onClick={() => setOrdersTab('open')}
            className={clsx(
              'px-3 h-8 text-14 font-medium transition-colors border-b-2',
              ordersTab === 'open'
                ? 'text-text-primary border-accent'
                : 'text-text-muted border-transparent hover:text-text-secondary'
            )}
          >
            My Open Orders
            <span className={clsx(
              'ml-1.5 px-1.5 py-0.5 rounded-full text-10 font-medium',
              ordersTab === 'open' ? 'bg-accent/20 text-accent' : 'bg-bg-elevated text-text-muted'
            )}>
              10
            </span>
          </button>
        </div>

        <div className="w-full h-[540px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
          <span className="text-14 text-text-muted">
            {ordersTab === 'filled' ? 'Filled Orders List' : 'Open Orders List'} — 384 × 608
          </span>
        </div>
      </div>
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
      <div className="py-3">
        <Breadcrumb token={market.token} />
      </div>

      <MarketHeader market={market} />

      <div className="flex gap-4">
        <LeftColumn />
        <div className="w-px bg-border-subtle self-stretch" />
        <RightColumn token={market.token} />
      </div>

      <BottomStats />
    </div>
  )
}
