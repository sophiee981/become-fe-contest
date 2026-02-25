// ─── Home page mock data — extracted from Figma node 42532:726327 ───────────

export interface HomeMarket {
  id: string
  token: string
  tokenName: string
  logo: string
  network: 'ethereum' | 'solana' | 'base' | 'bnb' | 'sui'
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
    id: 'zbt',
    token: 'ZBT',
    tokenName: 'ZeroBase',
    logo: '⬡',
    network: 'ethereum',
    price: 0.0842,
    priceChange24h: 47.15,
    vol24h: 312.44,
    vol24hChange: 874.22,
    totalVol: 18540.30,
    totalVolChange: 11.74,
    fdv: 19.83,
    fdvChange: 4.21,
    collateral: 'USDC',
    settleTime: '2025-06-10T00:00:00Z',
    settleDisplay: '10/06/2025',
    status: 'upcoming',
    settleCountdown: '18h:36m:24s',
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
    network: 'solana',
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

// ─── Recent Trades — updated per Figma node 42532:726450 ─────────────────────
// 7 columns: Time | Side | Pair | Price ($) | Amount | Collateral | Tx.ID
// Side col: Buy=#5BD197 / Sell=#FD5E67 + optional RS badge (#EAB308)
// Amount col: formatted amount + quote token circle (right-aligned)
// Collateral col: formatted amount + collateral token circle + shark icon (right-aligned)

export interface HomeRecentTrade {
  id: string
  timeAgo: string
  side: 'buy' | 'sell'
  isRS: boolean           // show yellow "RS" pill badge in Side column
  pair: string            // e.g. 'SKATE/USDC'
  baseToken: string       // leading token, used for pair icon color
  price: number
  amount: string          // formatted: '3.64K', '100.00K'
  amountToken: string     // quote token for Amount col icon, e.g. 'USDC'
  collateral: string      // formatted: '200.00', '1.00K'
  collateralToken: string // collateral token for Collateral col icon, e.g. 'USDC'
  txId: string
}

export const mockHomeRecentTrades: HomeRecentTrade[] = [
  { id: 'rt-1',  timeAgo: '1m ago',  side: 'sell', isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0550, amount: '3.64K',   amountToken: 'USDC', collateral: '200.00',  collateralToken: 'USDC', txId: '0xa1b2...' },
  { id: 'rt-2',  timeAgo: '5m ago',  side: 'sell', isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0550, amount: '18.18K',  amountToken: 'USDC', collateral: '1.00K',   collateralToken: 'USDC', txId: '0xa2c3...' },
  { id: 'rt-3',  timeAgo: '9m ago',  side: 'buy',  isRS: true,  pair: 'IKA/USDT',   baseToken: 'IKA',   price: 0.1190, amount: '4.20K',   amountToken: 'USDT', collateral: '500.00',  collateralToken: 'USDT', txId: '0xb3d4...' },
  { id: 'rt-4',  timeAgo: '12m ago', side: 'buy',  isRS: true,  pair: 'PENGU/SOL',  baseToken: 'PENGU', price: 0.0050, amount: '85.35K',  amountToken: 'SOL',  collateral: '3.00',    collateralToken: 'SOL',  txId: '0xc4e5...' },
  { id: 'rt-5',  timeAgo: '14m ago', side: 'buy',  isRS: false, pair: 'GRASS/USDC', baseToken: 'GRASS', price: 0.0690, amount: '3.62K',   amountToken: 'USDC', collateral: '250.00',  collateralToken: 'USDC', txId: '0xd5f6...' },
  { id: 'rt-6',  timeAgo: '16m ago', side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0050, amount: '100.00K', amountToken: 'USDC', collateral: '500.00',  collateralToken: 'USDC', txId: '0xe6g7...' },
  { id: 'rt-7',  timeAgo: '38m ago', side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0050, amount: '40.00K',  amountToken: 'USDC', collateral: '200.00',  collateralToken: 'USDC', txId: '0xf7h8...' },
  { id: 'rt-8',  timeAgo: '42m ago', side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0050, amount: '100.00K', amountToken: 'USDC', collateral: '500.00',  collateralToken: 'USDC', txId: '0xg8i9...' },
  { id: 'rt-9',  timeAgo: '1h ago',  side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0613, amount: '3.62K',   amountToken: 'USDC', collateral: '0.08',    collateralToken: 'USDC', txId: '0xh9j0...' },
  { id: 'rt-10', timeAgo: '1h ago',  side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0055, amount: '1.82K',   amountToken: 'USDC', collateral: '100.00',  collateralToken: 'USDC', txId: '0xi0k1...' },
]

export interface UpcomingListing {
  id: string
  token: string
  tokenName: string
  logo: string
  network: 'ethereum' | 'solana' | 'base' | 'bnb' | 'sui'
  isNew?: boolean
  status: 'soon' | 'countdown'
  listingTime: string | null
  countdown?: { days: string; hours: string; minutes: string }
  watchers: number
  investorAvatars: string[]   // avatar placeholder URLs / initials
  investorOverflow: number    // "+24" badge count, 0 if none
  narratives: string[]        // e.g. ['gamefi', 'NFT']
  narrativeOverflow: number   // "+N" overflow count
  moniScore: number           // numeric score, e.g. 10844
  moniPct: number             // 0-100 bar fill percentage
}

export const mockUpcomingListings: UpcomingListing[] = [
  {
    id: 'skate-upcoming',
    token: 'SKATE',
    tokenName: 'SKATEON',
    logo: '🛹',
    network: 'solana',
    status: 'countdown',
    listingTime: null,
    countdown: { days: '07', hours: '12', minutes: '34' },
    watchers: 4572,
    investorAvatars: ['A', 'B', 'C', 'D', 'E'],
    investorOverflow: 24,
    narratives: ['gamefi', 'NFT'],
    narrativeOverflow: 24,
    moniScore: 10844,
    moniPct: 45,
  },
  {
    id: 'skate-chain',
    token: 'SKATE',
    tokenName: 'Skate Chain',
    logo: '🛹',
    network: 'solana',
    status: 'countdown',
    listingTime: null,
    countdown: { days: '03', hours: '08', minutes: '15' },
    watchers: 4572,
    investorAvatars: [],
    investorOverflow: 0,
    narratives: ['gamefi', 'NFT'],
    narrativeOverflow: 0,
    moniScore: 24396,
    moniPct: 78,
  },
  {
    id: 'era-upcoming',
    token: 'ERA',
    tokenName: 'Caldera',
    logo: '🌋',
    network: 'ethereum',
    status: 'countdown',
    listingTime: null,
    countdown: { days: '14', hours: '22', minutes: '08' },
    watchers: 4572,
    investorAvatars: ['A', 'B', 'C', 'D'],
    investorOverflow: 0,
    narratives: [],
    narrativeOverflow: 0,
    moniScore: 11732,
    moniPct: 48,
  },
  {
    id: 'grass-upcoming',
    token: 'GRASS',
    tokenName: 'Grass',
    logo: '🌿',
    network: 'solana',
    status: 'soon',
    listingTime: null,
    watchers: 4572,
    investorAvatars: ['A', 'B', 'C', 'D', 'E'],
    investorOverflow: 16,
    narratives: ['gamefi'],
    narrativeOverflow: 0,
    moniScore: 18283,
    moniPct: 62,
  },
  {
    id: 'loud-upcoming',
    token: 'LOUD',
    tokenName: 'Loud',
    logo: '📢',
    network: 'solana',
    status: 'soon',
    listingTime: null,
    watchers: 4572,
    investorAvatars: ['A', 'B', 'C', 'D', 'E'],
    investorOverflow: 27,
    narratives: ['gamefi', 'NFT'],
    narrativeOverflow: 0,
    moniScore: 32195,
    moniPct: 92,
  },
  {
    id: 'mmt-upcoming',
    token: 'MMT',
    tokenName: 'Momentum',
    logo: '⚡',
    network: 'sui',
    isNew: true,
    status: 'countdown',
    listingTime: null,
    countdown: { days: '21', hours: '05', minutes: '42' },
    watchers: 4572,
    investorAvatars: ['A', 'B', 'C'],
    investorOverflow: 0,
    narratives: ['gamefi', 'NFT'],
    narrativeOverflow: 0,
    moniScore: 14572,
    moniPct: 55,
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
