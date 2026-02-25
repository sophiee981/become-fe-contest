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
    <button className="flex items-center gap-1 text-12 font-medium text-success hover:text-success/80 transition-colors">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Delivery Scenarios
    </button>
  </div>
)

// ─── Market Header (Figma node 37222:132669) ───
// 1344x96, HORIZONTAL, gap-16, py-24, border-bottom 1px #1B1B1C
// Left: token-info (flex-1, 696x48, gap-32) = token(120) + price(75) + stats(365)
// Right: buttons (632x48, gap-16) = social(489x36, gap-8) + divider + CTA(119x36)
const MarketHeader: React.FC = () => (
  <div className="flex items-center gap-4 py-6 border-b border-border-subtle">
    {/* token-info: flex-1, gap-32 */}
    <div className="flex-1 flex items-center gap-8">
      {/* token: 120x48, gap-8 — icon 36x36 circle + chain badge 16x16 */}
      <div className="flex items-center gap-2">
        <div className="relative w-[44px] h-[44px] flex items-center justify-center">
          <img src={skateImg} alt="SKATE" className="w-9 h-9 rounded-full" />
          <img
            src={chainSolanaImg}
            alt="Solana"
            className="absolute bottom-0 left-0 w-4 h-4 rounded-sm border-2 border-bg-base"
          />
        </div>
        <div className="flex flex-col">
          {/* ticker: Inter 18/500/28px #F9F9FA */}
          <span className="text-18 font-medium text-text-primary">SKATE</span>
          {/* subtitle: Inter 12/400/16px #7A7A83, wrapped py-0.5 */}
          <div className="py-0.5">
            <span className="text-12 text-text-muted whitespace-nowrap">Skate Chain</span>
          </div>
        </div>
      </div>

      {/* price: 75x48 */}
      <div className="flex flex-col">
        {/* price value: Inter 18/500/28px #F9F9FA */}
        <span className="text-18 font-medium text-text-primary">$0.0045</span>
        {/* change: Inter 12/400/16px #5BD197 */}
        <div className="py-0.5">
          <span className="text-12 text-success">+0.13%</span>
        </div>
      </div>

      {/* stats: gap-32 — 3 stat items */}
      <div className="flex items-center gap-8">
        {/* stat-item: 24h Vol — 146x48 */}
        <div className="flex flex-col">
          <div className="py-1.5">
            <span className="text-12 text-text-muted border-b border-dashed border-border-default pb-px cursor-help">
              24h Vol.
            </span>
          </div>
          <div className="flex items-center gap-1 py-0.5">
            <span className="text-12 text-text-primary">$16,389.76</span>
            <span className="text-12 text-success">+1,159.36%</span>
          </div>
        </div>

        {/* stat-item: Total Vol — 69x48 */}
        <div className="flex flex-col">
          <div className="py-1.5">
            <span className="text-12 text-text-muted border-b border-dashed border-border-default pb-px cursor-help">
              Total Vol.
            </span>
          </div>
          <div className="py-0.5">
            <span className="text-12 text-text-primary">$38,581.28</span>
          </div>
        </div>

        {/* stat-item: Countdown — 86x48 */}
        <div className="flex flex-col">
          <div className="py-1.5">
            <span className="text-12 text-text-muted border-b border-dashed border-border-default pb-px cursor-help">
              Countdown
            </span>
          </div>
          {/* whales-badge: pill, bg info-500@10%, text info-400, 10/500/12px, UPPERCASE */}
          <span className="inline-flex items-center self-start px-2 py-1 rounded-full bg-info-scale-500/10 text-10 font-medium text-info uppercase">
            not started
          </span>
        </div>
      </div>
    </div>

    {/* buttons: gap-16 → social(gap-8) + divider + CTA, flex-shrink-0 prevents squeezing */}
    <div className="flex items-center gap-4 flex-shrink-0">
      {/* social action buttons: 489x36, gap-8 */}
      <div className="flex items-center gap-2">
        {/* About Skate group: 168x36, border #252527, radius 8 */}
        <div className="flex items-center border border-neutral-800 rounded-lg overflow-hidden">
          {/* Button A: "About Skate" + arrow_right_up icon — 132x36, pl-16 pr-8 py-8, gap-6 */}
          <button className="flex items-center gap-1.5 h-9 pl-4 pr-2 text-14 font-medium text-text-primary hover:bg-bg-hover transition-colors whitespace-nowrap">
            About Skate
            <span className="w-5 h-5 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4H12V10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
          {/* Divider inside group */}
          <div className="w-px self-stretch bg-neutral-800" />
          {/* Button B: chevron down — 36x36, p-8 */}
          <button className="flex items-center justify-center w-9 h-9 hover:bg-bg-hover transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="#F9F9FA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Airdrop Checker: 160x36, gradient border #86ddb1→#15af77, pl-8 pr-16 py-8, gap-6 */}
        {/* Gradient border technique: p-[1px] wrapper + inner button with bg-bg-base */}
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

        {/* Earn 50% Fee: 145x36, gradient border #cdba35→#ef9632, pl-8 pr-16 py-8, gap-6 */}
        {/* Gradient border technique: p-[1px] wrapper + inner button with bg-bg-base */}
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

        {/* More: 36x36, bg #1B1B1C, radius 8 */}
        <button className="flex items-center justify-center w-9 h-9 rounded-lg bg-bg-surface hover:bg-bg-hover transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="4" cy="8" r="1.25" fill="#F9F9FA"/>
            <circle cx="8" cy="8" r="1.25" fill="#F9F9FA"/>
            <circle cx="12" cy="8" r="1.25" fill="#F9F9FA"/>
          </svg>
        </button>
      </div>

      {/* Vertical divider: 0x18, stroke 1px #252527 */}
      <div className="w-px h-[18px] bg-neutral-800" />

      {/* Create Order CTA: 119x36, bg #F9F9FA, text #0A0A0B, radius 8 */}
      <button className="flex items-center h-9 px-4 rounded-lg bg-neutral-50 text-14 font-medium text-text-inverse hover:bg-neutral-200 transition-colors whitespace-nowrap">
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

        {/* Illustration placeholder */}
        <div className="w-full h-[120px] rounded-lg bg-bg-elevated flex items-center justify-center">
          <span className="text-12 text-text-muted">Trade illustration</span>
        </div>

        {/* Trade button */}
        <button className={clsx(
          'w-full h-12 rounded-lg text-14 font-medium transition-colors',
          tradeTab === 'buy'
            ? 'bg-buy text-bg-base hover:bg-buy/90'
            : 'bg-sell text-bg-base hover:bg-sell/90'
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
  return (
    // Aligned with Navbar: max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
      {/* Breadcrumb — Figma 37222:132667, 1376x16 */}
      <div className="py-3">
        <Breadcrumb />
      </div>

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

      {/* Bottom Stats — Figma 37222:132677, 1376x44 */}
      <BottomStats />
    </div>
  )
}
