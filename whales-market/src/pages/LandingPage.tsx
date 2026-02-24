import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Users, BarChart2, Shield, Zap, Globe } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { mockMarkets, LANDING_STATS } from '@/mock-data/markets'
import type { Market } from '@/types/market'

// ─── Market Card ─────────────────────────────────────────────────────────────

const MarketCard: React.FC<{ market: Market }> = ({ market }) => {
  const isPositive = market.change24h >= 0
  return (
    <Link
      to={`/market/${market.id}`}
      className="block bg-bg-surface border border-border-default rounded-xl p-4 hover:border-border-active hover:bg-bg-hover transition-all duration-150 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-bg-elevated flex items-center justify-center text-xl">
            {market.logo}
          </div>
          <div>
            <p className="text-14 font-semibold text-text-primary group-hover:text-accent transition-colors">{market.token}</p>
            <p className="text-12 text-text-muted">{market.name}</p>
          </div>
        </div>
        <Badge
          label={market.category === 'pre-market' ? 'Pre-Market' : market.category === 'points' ? 'Points' : 'Allocation'}
          variant={market.category === 'points' ? 'purple' : 'neutral'}
          size="sm"
        />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-18 font-bold text-text-primary">
            ${market.price < 0.01 ? market.price.toFixed(7) : market.price.toFixed(4)}
          </p>
          <p className="text-12 text-text-muted mt-0.5">
            Vol: ${(market.volume24h / 1_000_000).toFixed(2)}M
          </p>
        </div>
        <span className={`text-14 font-semibold ${isPositive ? 'text-buy' : 'text-sell'}`}>
          {isPositive ? '+' : ''}{market.change24h.toFixed(2)}%
        </span>
      </div>
    </Link>
  )
}

// ─── How It Works Steps ───────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    icon: <Shield size={24} />,
    step: '01',
    title: 'Connect Your Wallet',
    description: 'Connect MetaMask, Phantom, or WalletConnect to get started. No KYC required.',
  },
  {
    icon: <TrendingUp size={24} />,
    step: '02',
    title: 'Browse Markets',
    description: 'Explore pre-market tokens, points, and allocations with live price discovery.',
  },
  {
    icon: <Zap size={24} />,
    step: '03',
    title: 'Place Your Order',
    description: 'Submit buy or sell orders. Trades settle peer-to-peer with minimal fees.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export const LandingPage: React.FC = () => {
  const featured = mockMarkets.slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24">
        {/* Bg glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <PageWrapper className="relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-12 font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Now live — trade pre-market tokens OTC
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-text-primary leading-tight mb-4">
            Trade Pre-Market Tokens
            <br />
            <span className="text-accent">Before They Launch</span>
          </h1>

          <p className="text-16 text-text-secondary max-w-xl mx-auto mb-8">
            The premier OTC marketplace for pre-market tokens, points, and allocations.
            Peer-to-peer trading with no intermediaries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/market">
              <Button variant="primary" size="lg" icon={<ArrowRight size={18} />} iconPosition="right">
                Go to Marketplace
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="secondary" size="lg">
                View Portfolio
              </Button>
            </Link>
          </div>
        </PageWrapper>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border-default bg-bg-surface py-5">
        <PageWrapper>
          <div className="grid grid-cols-3 divide-x divide-border-default">
            {[
              { icon: <BarChart2 size={16} />, label: 'Total Volume', value: LANDING_STATS.totalVolume },
              { icon: <TrendingUp size={16} />, label: 'Total Trades', value: LANDING_STATS.totalTrades },
              { icon: <Globe size={16} />, label: 'Active Markets', value: String(LANDING_STATS.activeMarkets) },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-1 py-1">
                <div className="flex items-center gap-1.5 text-text-muted text-12">
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
                <p className="text-20 font-bold text-text-primary">{stat.value}</p>
              </div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* Featured markets */}
      <section className="py-16">
        <PageWrapper>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-24 font-bold text-text-primary">Featured Markets</h2>
            <Link to="/market" className="flex items-center gap-1 text-14 text-accent hover:text-accent/80 transition-colors">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map(market => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-border-default">
        <PageWrapper>
          <div className="text-center mb-10">
            <h2 className="text-24 font-bold text-text-primary mb-2">How It Works</h2>
            <p className="text-14 text-text-secondary">Start trading in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="bg-bg-surface border border-border-default rounded-xl p-6 hover:border-border-active transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-12 font-mono text-text-muted">{item.step}</span>
                </div>
                <h3 className="text-16 font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-14 text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </PageWrapper>
      </section>

      {/* CTA section */}
      <section className="py-16">
        <PageWrapper>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8 md:p-12 text-center">
            <h2 className="text-28 font-bold text-text-primary mb-3">Ready to start trading?</h2>
            <p className="text-16 text-text-secondary mb-6">
              Join thousands of traders in the premier pre-market OTC platform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/market">
                <Button variant="primary" size="lg">
                  Browse Markets
                </Button>
              </Link>
            </div>
          </div>
        </PageWrapper>
      </section>

      <div className="flex items-center justify-center gap-6 pb-12 text-13 text-text-muted">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-accent" />
          <span>Non-custodial</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-accent" />
          <span>Instant settlement</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} className="text-accent" />
          <span>Peer-to-peer</span>
        </div>
      </div>
    </div>
  )
}
