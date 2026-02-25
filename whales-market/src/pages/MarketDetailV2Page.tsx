// Figma node 37222:132664 — Market Detail V2 (SKATE)
// Layout: 1920x2046, bg=#0a0a0b
// Body container: max-w-[1440px] centered
// market-detail: 1376px (px-4 = 16px each side), VERTICAL, gap between sections

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

// ─── Figma: token images ───
import skateImg from '@/assets/images/token-skate.png'
import chainSolanaImg from '@/assets/images/chain-solana.png'

// ─── Breadcrumb (Figma node 37222:132667) ───
// pathway: Whales.Market > Pre-market > SKATE
// delivery: "Delivery Scenarios" (green, #5BD197)
const Breadcrumb: React.FC = () => (
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
      <span className="text-12 text-text-primary">SKATE</span>
    </nav>
    <button className="flex items-center gap-1 text-12 font-medium text-status-success hover:text-status-success/80 transition-colors">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Delivery Scenarios
    </button>
  </div>
)

// ─── Market Header (Figma node 37222:132669) ───
// 1344x96, py-24, gap-16, HORIZONTAL, border-bottom #1b1b1c
// Left: token-info (696x48) = token(120) + price(75) + stats(365), gap-32
// Right: buttons (632x48)
const MarketHeader: React.FC = () => (
  <div className="flex items-center justify-between py-6 border-b border-border-subtle">
    {/* token-info: gap-32 */}
    <div className="flex items-center gap-8">
      {/* token: 120x48, gap-8 */}
      <div className="flex items-center gap-2">
        <div className="relative w-[44px] h-[44px]">
          <img src={skateImg} alt="SKATE" className="w-9 h-9 rounded-full" />
          <img
            src={chainSolanaImg}
            alt="Solana"
            className="absolute -bottom-0.5 -left-0.5 w-4 h-4 rounded border-2 border-bg-base"
          />
        </div>
        <div className="flex flex-col">
          {/* ticker: 18/500/#F9F9FA */}
          <span className="text-18 font-medium text-text-primary leading-7">SKATE</span>
          {/* subtitle: 12/400/#7A7A83 */}
          <span className="text-12 text-text-muted">Skate Chain</span>
        </div>
      </div>

      {/* price: 75x48 */}
      <div className="flex flex-col">
        <span className="text-18 font-medium text-text-primary leading-7">$0.0045</span>
        <span className="text-12 text-status-success">+0.13%</span>
      </div>

      {/* stats: gap-32 */}
      <div className="flex items-center gap-8">
        {/* stat-item: 24h Vol */}
        <div className="flex flex-col">
          <span className="text-12 text-text-muted leading-7">24h Vol.</span>
          <div className="flex items-center gap-1">
            <span className="text-12 text-text-primary">$16,389.76</span>
            <span className="text-12 text-status-success">+1,159.36%</span>
          </div>
        </div>
        {/* stat-item: Total Vol */}
        <div className="flex flex-col">
          <span className="text-12 text-text-muted leading-7">Total Vol.</span>
          <span className="text-12 text-text-primary">$38,581.28</span>
        </div>
        {/* stat-item: Countdown */}
        <div className="flex flex-col">
          <span className="text-12 text-text-muted leading-7">Countdown</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-status-info/20 text-10 font-medium text-status-info">
            not started
          </span>
        </div>
      </div>
    </div>

    {/* buttons: gap-12 */}
    <div className="flex items-center gap-3">
      {/* About Skate + dropdown icon */}
      <div className="flex items-center border border-border-default rounded-lg overflow-hidden">
        <button className="flex items-center gap-1.5 px-3 h-9 text-14 font-medium text-text-primary hover:bg-bg-hover transition-colors">
          About Skate
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M6 8L10 12L14 8" stroke="#7A7A83" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="flex items-center justify-center w-9 h-9 border-l border-border-default hover:bg-bg-hover transition-colors">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="#F9F9FA" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Airdrop Checker */}
      <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border-default text-14 font-medium text-text-primary hover:bg-bg-hover transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2C4.69 2 2 4.69 2 8C2 11.31 4.69 14 8 14C11.31 14 14 11.31 14 8" stroke="#F9F9FA" strokeWidth="1.2" strokeLinecap="round"/>
          <path d="M8 6V8.5L10 10" stroke="#F9F9FA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Airdrop Checker
      </button>

      {/* Earn 50% Fee */}
      <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg border border-border-default text-14 font-medium text-text-primary hover:bg-bg-hover transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 5.5C13 3.567 10.761 2 8 2C5.239 2 3 3.567 3 5.5C3 7.433 5.239 9 8 9C10.761 9 13 7.433 13 5.5Z" stroke="#F9F9FA" strokeWidth="1.2"/>
          <path d="M3 5.5V10.5C3 12.433 5.239 14 8 14C10.761 14 13 12.433 13 10.5V5.5" stroke="#F9F9FA" strokeWidth="1.2"/>
        </svg>
        Earn 50% Fee
      </button>

      {/* More icon */}
      <button className="flex items-center justify-center w-9 h-9 rounded-lg bg-bg-surface hover:bg-bg-hover transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="4" cy="8" r="1.5" fill="#F9F9FA"/>
          <circle cx="8" cy="8" r="1.5" fill="#F9F9FA"/>
          <circle cx="12" cy="8" r="1.5" fill="#F9F9FA"/>
        </svg>
      </button>

      {/* Divider */}
      <div className="w-px h-[18px] bg-border-default" />

      {/* Create Order — dark button with accent border */}
      <button className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-bg-base border border-border-default text-14 font-medium text-text-primary hover:bg-bg-hover transition-colors">
        Create Order
      </button>
    </div>
  </div>
)

// ─── Left Column: Trading Market (Figma node 37315:160537) ───
// 928x1826, py-16, gap-16, VERTICAL
// Contains: block-title (28h) + block-title (48h) + chart (424h) + market-detail (742h) + recent-trades (532h)
const LeftColumn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collateral' | 'fill' | 'order'>('collateral')
  const [chartPeriod, setChartPeriod] = useState<'2d' | '1w' | '1M' | 'All'>('All')

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4 py-4">
      {/* block-title: "Trading Market" + view toggle (Figma 37315:160538) */}
      <div className="flex items-center justify-between h-7">
        <span className="text-16 font-medium text-text-primary">Trading Market</span>
        <div className="flex items-center gap-2">
          <span className="text-12 text-text-muted">Block Event</span>
          <div className="w-8 h-4 rounded-full bg-bg-elevated relative cursor-pointer">
            <div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-text-muted transition-transform" />
          </div>
        </div>
      </div>

      {/* block-title row 2: tabs + period selector (Figma 37315:160544) */}
      <div className="flex items-center justify-between h-12">
        <div className="flex items-center gap-2">
          {(['Collateral', 'Fill Type', 'Order Type'] as const).map((tab) => {
            const key = tab.toLowerCase().replace(' ', '') as typeof activeTab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(key === 'fill type' ? 'fill' : key === 'order type' ? 'order' : 'collateral')}
                className={clsx(
                  'px-3 h-8 rounded-md text-12 font-medium transition-colors',
                  activeTab === (key === 'fill type' ? 'fill' : key === 'order type' ? 'order' : 'collateral')
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

      {/* Chart placeholder (Figma 37315:161696) — 928x424 */}
      <div className="w-full h-[424px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
        <span className="text-14 text-text-muted">Chart Area — 928 × 424</span>
      </div>

      {/* Market Detail / Order Book (Figma 37315:161694) — 928x742 */}
      <div className="w-full h-[742px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
        <span className="text-14 text-text-muted">Order Book Table — 928 × 742</span>
      </div>

      {/* Recent Trades (Figma 37315:189288) — 928x532 */}
      <div className="w-full flex flex-col gap-2 py-4">
        <h3 className="text-16 font-medium text-text-primary">Recent Trades</h3>
        <div className="w-full h-[480px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
          <span className="text-14 text-text-muted">Recent Trades Table — 928 × 532</span>
        </div>
      </div>
    </div>
  )
}

// ─── Right Column: Trade + Chart + My Orders (Figma 37222:132673) ───
// 384x1826, py-16, gap-16, VERTICAL
const RightColumn: React.FC = () => {
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy')
  const [ordersTab, setOrdersTab] = useState<'filled' | 'open'>('filled')

  return (
    <div className="w-[384px] flex-shrink-0 flex flex-col gap-4 py-4">
      {/* Trade Panel (Figma 37692:254729) — 384x456, pb-24 */}
      <div className="flex flex-col gap-4 pb-6 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <h3 className="text-16 font-medium text-text-primary">Trade SKATE</h3>
          <span className="text-12 text-text-muted">Price</span>
        </div>

        {/* Buy/Sell tab */}
        <div className="flex items-center gap-0 p-1 rounded-lg bg-bg-surface">
          <button
            onClick={() => setTradeTab('buy')}
            className={clsx(
              'flex-1 h-9 rounded-md text-14 font-medium transition-colors',
              tradeTab === 'buy'
                ? 'bg-status-success text-bg-base'
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
                ? 'bg-status-danger text-bg-base'
                : 'text-text-muted hover:text-text-secondary'
            )}
          >
            Sell
          </button>
        </div>

        {/* Illustration placeholder */}
        <div className="w-full h-[120px] rounded-lg bg-bg-elevated flex items-center justify-center">
          <span className="text-12 text-text-muted">Trade illustration</span>
        </div>

        {/* Trade button */}
        <button className={clsx(
          'w-full h-12 rounded-lg text-14 font-medium transition-colors',
          tradeTab === 'buy'
            ? 'bg-status-success text-bg-base hover:bg-status-success/90'
            : 'bg-status-danger text-bg-base hover:bg-status-danger/90'
        )}>
          Trade (Taker)
        </button>

        {/* Details */}
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

      {/* Chart + History (Figma 37222:132675) — 384x336 */}
      <div className="w-full h-[336px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
        <span className="text-14 text-text-muted">Price Chart — 384 × 336</span>
      </div>

      {/* My Orders (Figma 37225:131293) — 384x608 */}
      <div className="flex flex-col gap-4">
        {/* Tabs: My Filled Orders | My Open Orders */}
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

        {/* Orders list placeholder */}
        <div className="w-full h-[540px] rounded-lg bg-bg-surface border border-border-subtle flex items-center justify-center">
          <span className="text-14 text-text-muted">
            {ordersTab === 'filled' ? 'Filled Orders List' : 'Open Orders List'} — 384 × 608
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Bottom Stats (Figma 37222:132677) — reuse pattern from LandingPage ───
const BottomStats: React.FC = () => (
  <div className="flex items-center justify-between h-11 border-t border-border-subtle">
    <div className="flex items-center gap-6">
      {/* LIVE DATA indicator */}
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
        <span className="text-12 font-medium text-status-success">LIVE DATA</span>
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
  return (
    // Figma: body 1440px centered, market-detail 1376px (px-4 = 16px padding)
    <div className="max-w-[1440px] mx-auto px-8">
      {/* Breadcrumb — Figma 37222:132667, 1376x16 */}
      <div className="py-3">
        <Breadcrumb />
      </div>

      {/* market-detail container — Figma 37222:132668, 1376x1922, px-4, VERTICAL */}
      <div className="px-4">
        {/* Market Header — Figma 37222:132669, 1344x96 */}
        <MarketHeader />

        {/* 2-column layout — Figma 37222:132670, 1344x1826, gap-16, HORIZONTAL */}
        <div className="flex gap-4">
          {/* Left: market — Figma 37315:160537, ~928px, flex-1 */}
          <LeftColumn />

          {/* Divider — Figma 37222:132672 */}
          <div className="w-px bg-border-subtle self-stretch" />

          {/* Right: trade+chart — Figma 37222:132673, 384px */}
          <RightColumn />
        </div>
      </div>

      {/* Bottom Stats — Figma 37222:132677, 1376x44 */}
      <BottomStats />
    </div>
  )
}
