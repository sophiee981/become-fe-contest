// ─── Home page mock data — extracted from Figma node 42532:726327 ───────────

export interface HomeMarket {
  id: string
  token: string
  tokenName: string
  logo: string
  network: 'ethereum' | 'solana' | 'base' | 'bnb'
  isNew?: boolean
  price: number
  priceChange24h: number
  vol24h: number
  vol24hChange: number
  totalVol: number
  totalVolChange: number
  fdv: number
  fdvChange: number
  collateral: 'USDC' | 'SOL' | 'USDT'
  settleTime: string | null     // ISO or null for TBA
  settleDisplay: string         // e.g. '10/06/2025' | 'TBA'
  status: 'in-progress' | 'upcoming' | 'active' | 'ended'
  settleCountdown?: string      // '3h:34m:59s' for in-progress
}

export const mockHomeMarkets: HomeMarket[] = [
  {
    id: 'skate-progress',
    token: 'SKATE',
    tokenName: 'SKATEON',
    logo: '🛹',
    network: 'ethereum',
    price: 0.0550,
    priceChange24h: 162.18,
    vol24h: 7375.62,
    vol24hChange: -16.18,
    totalVol: 25197.18,
    totalVolChange: 6.38,
    fdv: 32.67,
    fdvChange: 6.38,
    collateral: 'USDC',
    settleTime: null,
    settleDisplay: '3h:34m:59s',
    status: 'in-progress',
    settleCountdown: '3h:34m:59s',
  },
  {
    id: 'skate-chain',
    token: 'SKATE',
    tokenName: 'Skate Chain',
    logo: '⛸️',
    network: 'ethereum',
    price: 0.119,
    priceChange24h: 63.8,
    vol24h: 445.86,
    vol24hChange: 1159.36,
    totalVol: 21904.26,
    totalVolChange: 19.12,
    fdv: 27.96,
    fdvChange: 6.38,
    collateral: 'USDC',
    settleTime: '2025-06-10T00:00:00Z',
    settleDisplay: '10/06/2025',
    status: 'upcoming',
  },
  {
    id: 'era',
    token: 'ERA',
    tokenName: 'Caldera',
    logo: '🌋',
    network: 'ethereum',
    price: 0.0464,
    priceChange24h: 98.31,
    vol24h: 418326.12,
    vol24hChange: -32.16,
    totalVol: 7483875.48,
    totalVolChange: 9.18,
    fdv: 24.35,
    fdvChange: 6.38,
    collateral: 'USDC',
    settleTime: '2025-05-30T13:00:00Z',
    settleDisplay: '30/05/2025',
    status: 'active',
  },
  {
    id: 'grass',
    token: 'GRASS',
    tokenName: 'Grass',
    logo: '🌿',
    network: 'solana',
    price: 0.11,
    priceChange24h: 124.52,
    vol24h: 10418.71,
    vol24hChange: 228.25,
    totalVol: 64110.29,
    totalVolChange: 0.81,
    fdv: 21.49,
    fdvChange: 6.38,
    collateral: 'USDC',
    settleTime: null,
    settleDisplay: 'TBA',
    status: 'active',
  },
  {
    id: 'loud',
    token: 'LOUD',
    tokenName: 'Loud',
    logo: '📢',
    network: 'ethereum',
    price: 0.9638,
    priceChange24h: 22.60,
    vol24h: 18312.61,
    vol24hChange: 49.13,
    totalVol: 628875.43,
    totalVolChange: 8.42,
    fdv: 18.56,
    fdvChange: 6.38,
    collateral: 'USDC',
    settleTime: null,
    settleDisplay: 'TBA',
    status: 'active',
  },
  {
    id: 'mmt',
    token: 'MMT',
    tokenName: 'Momentum',
    logo: '⚡',
    network: 'base',
    isNew: true,
    price: 0.65,
    priceChange24h: 48.32,
    vol24h: 0,
    vol24hChange: -100,
    totalVol: 7244.16,
    totalVolChange: 0,
    fdv: 12.92,
    fdvChange: 6.38,
    collateral: 'USDC',
    settleTime: null,
    settleDisplay: 'TBA',
    status: 'active',
  },
]

export interface HomeRecentTrade {
  id: string
  timeAgo: string
  side: 'buy' | 'sell'
  userAvatar: string
  marketType: 'Pre-market' | 'Points' | 'Allocation'
  pair: string
  price: number
  amount: string      // formatted: '3.64K'
  collateral: number  // USDC
  txId: string
  discount: number    // e.g. -8.5 (%)
}

export const mockHomeRecentTrades: HomeRecentTrade[] = [
  { id: 'rt-1',  timeAgo: '1m ago',  side: 'sell', userAvatar: 'RS', marketType: 'Pre-market', pair: 'SKATE/USDC', price: 0.0550, amount: '3.64K',  collateral: 250, txId: '0xa1b2...', discount: -8.5 },
  { id: 'rt-2',  timeAgo: '5m ago',  side: 'sell', userAvatar: 'RS', marketType: 'Pre-market', pair: 'SKATE/USDC', price: 0.0550, amount: '18.18K', collateral: 250, txId: '0xa2c3...', discount: -8.5 },
  { id: 'rt-3',  timeAgo: '9m ago',  side: 'buy',  userAvatar: 'RS', marketType: 'Pre-market', pair: 'IKA/USDT',   price: 0.1190, amount: '4.20K',  collateral: 250, txId: '0xb3d4...', discount: -8.5 },
  { id: 'rt-4',  timeAgo: '12m ago', side: 'buy',  userAvatar: 'RS', marketType: 'Pre-market', pair: 'PENGU/SOL',  price: 0.0050, amount: '85.35K', collateral: 250, txId: '0xc4e5...', discount: -8.5 },
  { id: 'rt-5',  timeAgo: '14m ago', side: 'sell', userAvatar: 'MK', marketType: 'Pre-market', pair: 'GRASS/USDC', price: 0.1100, amount: '9.09K',  collateral: 500, txId: '0xd5f6...', discount: -5.2 },
  { id: 'rt-6',  timeAgo: '18m ago', side: 'buy',  userAvatar: 'TW', marketType: 'Pre-market', pair: 'LOUD/USDC',  price: 0.9638, amount: '1.04K', collateral: 1000, txId: '0xe6g7...', discount: -3.1 },
  { id: 'rt-7',  timeAgo: '22m ago', side: 'buy',  userAvatar: 'AL', marketType: 'Points',      pair: 'ERA/USDC',   price: 0.0464, amount: '21.5K', collateral: 250, txId: '0xf7h8...', discount: -6.8 },
  { id: 'rt-8',  timeAgo: '25m ago', side: 'sell', userAvatar: 'BN', marketType: 'Pre-market', pair: 'MMT/USDC',   price: 0.6500, amount: '384',   collateral: 250, txId: '0xg8i9...', discount: -12.0 },
  { id: 'rt-9',  timeAgo: '31m ago', side: 'buy',  userAvatar: 'RS', marketType: 'Pre-market', pair: 'SKATE/USDC', price: 0.0550, amount: '4.55K',  collateral: 500, txId: '0xh9j0...', discount: -8.5 },
  { id: 'rt-10', timeAgo: '35m ago', side: 'sell', userAvatar: 'ZK', marketType: 'Pre-market', pair: 'IKA/USDT',   price: 0.1190, amount: '2.10K',  collateral: 250, txId: '0xi0k1...', discount: -9.3 },
]

export interface UpcomingListing {
  id: string
  token: string
  tokenName: string
  logo: string
  network: string
  status: 'soon' | 'countdown'
  listingTime: string | null
  countdown?: { days: string; hours: string; minutes: string }
}

export const mockUpcomingListings: UpcomingListing[] = [
  {
    id: 'sea',
    token: 'SEA',
    tokenName: 'OpenSea',
    logo: '🌊',
    network: 'Ethereum',
    status: 'soon',
    listingTime: null,
  },
  {
    id: 'sea2',
    token: 'SEA',
    tokenName: 'OpenSea',
    logo: '🌊',
    network: 'Ethereum',
    status: 'countdown',
    listingTime: null,
    countdown: { days: '07', hours: '07', minutes: '07' },
  },
]

export const HOME_STATS = {
  totalVol: '$5,375,932.81',
  vol24h: '$832,750.55',
  liveMarketCount: 6,
  upcomingCount: 6,
  endedCount: 128,
}

export const METRICS = {
  premarket24Vol: { value: '$4.2M', change: '+12.5%', positive: true },
  fearGreed: { score: 43, label: 'Neutral' },
  altcoinSeason: { score: 70, max: 100, bitcoinPct: 30, altcoinPct: 70 },
  nextSettlement: {
    token: 'SKATE',
    date: '09/06/2025 14:00 (UTC)',
    countdown: { days: '0', hours: '2', minutes: '33', seconds: '12' },
    displayDate: '09 Sep 2025',
  },
}
