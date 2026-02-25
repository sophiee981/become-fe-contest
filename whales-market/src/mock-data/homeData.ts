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
  // ─── Ended tab fields (Figma node 42540-728736) ───
  collateralTokens?: string[]          // e.g. ['USDC', 'SOL'] — circular icons in Collateral Token column
  settleStartDisplay?: string          // '30/05/2025' or 'TBA'
  settleStartTime?: string | null      // '02:00 PM' or null
  settleEndDisplay?: string            // '30/05/2025' or 'TBA'
  settleEndTime?: string | null        // '06:00 PM' or null
  settleEndCountdown?: string | null   // '03h:18m:26s' (orange) or null
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
  isRS: boolean                          // show yellow "RS" pill badge in Side column
  pair: string                           // e.g. 'SKATE/USDC'
  baseToken: string                      // leading token, used for pair icon
  price: number
  amount: string                         // formatted: '3.64K', '100.00K'
  collateral: string                     // formatted: '200.00', '1.00K'
  collateralToken: 'USDC' | 'USDT' | 'SOL'  // collateral token for icon
  animal: 'shark' | 'whale' | 'shrimp'  // Figma: shark/whale/shrimp icon
  txId: string
}

// Mock data per Figma node 42540:728736 — Recent Trades 10 rows
export const mockHomeRecentTrades: HomeRecentTrade[] = [
  { id: 'rt-1',  timeAgo: '1m ago',  side: 'sell', isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0550, amount: '3.64K',   collateral: '200.00',  collateralToken: 'USDC', animal: 'shark',  txId: '0xa1b2...' },
  { id: 'rt-2',  timeAgo: '5m ago',  side: 'sell', isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0550, amount: '18.18K',  collateral: '1.00K',   collateralToken: 'USDC', animal: 'whale',  txId: '0xa2c3...' },
  { id: 'rt-3',  timeAgo: '9m ago',  side: 'buy',  isRS: true,  pair: 'IKA/USDT',   baseToken: 'IKA',   price: 0.1190, amount: '4.20K',   collateral: '500.00',  collateralToken: 'USDT', animal: 'shark',  txId: '0xb3d4...' },
  { id: 'rt-4',  timeAgo: '12m ago', side: 'buy',  isRS: true,  pair: 'PENGU/SOL',  baseToken: 'PENGU', price: 0.0050, amount: '85.35K',  collateral: '3.00',    collateralToken: 'SOL',  animal: 'shark',  txId: '0xc4e5...' },
  { id: 'rt-5',  timeAgo: '14m ago', side: 'buy',  isRS: false, pair: 'GRASS/USDC', baseToken: 'GRASS', price: 0.0690, amount: '3.62K',   collateral: '250.00',  collateralToken: 'USDC', animal: 'shark',  txId: '0xd5f6...' },
  { id: 'rt-6',  timeAgo: '16m ago', side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0050, amount: '100.00K', collateral: '500.00',  collateralToken: 'USDC', animal: 'shark',  txId: '0xe6g7...' },
  { id: 'rt-7',  timeAgo: '38m ago', side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0050, amount: '40.00K',  collateral: '200.00',  collateralToken: 'USDC', animal: 'shark',  txId: '0xf7h8...' },
  { id: 'rt-8',  timeAgo: '42m ago', side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0050, amount: '100.00K', collateral: '500.00',  collateralToken: 'USDC', animal: 'shark',  txId: '0xg8i9...' },
  { id: 'rt-9',  timeAgo: '1h ago',  side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0613, amount: '3.62K',   collateral: '0.08',    collateralToken: 'USDC', animal: 'shrimp', txId: '0xh9j0...' },
  { id: 'rt-10', timeAgo: '1h ago',  side: 'buy',  isRS: false, pair: 'SKATE/USDC', baseToken: 'SKATE', price: 0.0055, amount: '1.82K',   collateral: '100.00',  collateralToken: 'USDC', animal: 'shrimp', txId: '0xi0k1...' },
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
    narratives: ['gamefi', 'NFT', 'DePIN', 'AI'],
    narrativeOverflow: 0,
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
    narratives: ['L2', 'Infra', 'Modular'],
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
    narratives: ['DePIN', 'AI'],
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
    narratives: ['gamefi', 'NFT', 'SocialFi'],
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

// ─── Ended Markets — Figma node 42540:728736 ────────────────────────────────
// Columns: Token | Last Price ($) | Total Vol. ($) | Collateral Token | Settle Starts (UTC) | Settle Ends (UTC)
// Reuses HomeMarket shape + ended-specific fields: collateralTokens, settleStart/End

export const mockEndedMarkets: HomeMarket[] = [
  {
    id: 'tia-ended',
    token: 'TIA',
    tokenName: 'Celestia',
    logo: 'TIA',
    network: 'ethereum',
    price: 8.4200,
    priceChange24h: 34.12,
    vol24h: 0,
    vol24hChange: 0,
    totalVol: 18432580.50,
    totalVolChange: 0,
    fdv: 1642.80,
    fdvChange: 0,
    collateral: 'USDC',
    settleTime: '2024-10-31T14:00:00Z',
    settleDisplay: '31/10/2024',
    status: 'ended',
    settleStartDisplay: '17/10/2024',
    settleStartTime: '02:00 PM',
    settleEndDisplay: '31/10/2024',
    settleEndTime: '02:00 PM',
  },
  {
    id: 'strk-ended',
    token: 'STRK',
    tokenName: 'Starknet',
    logo: 'STRK',
    network: 'ethereum',
    price: 1.4380,
    priceChange24h: -3.21,
    vol24h: 0,
    vol24hChange: 0,
    totalVol: 12840312.65,
    totalVolChange: 0,
    fdv: 1438.00,
    fdvChange: 0,
    collateral: 'USDC',
    settleTime: '2024-02-20T14:00:00Z',
    settleDisplay: '20/02/2024',
    status: 'ended',
    settleStartDisplay: '06/02/2024',
    settleStartTime: '02:00 PM',
    settleEndDisplay: '20/02/2024',
    settleEndTime: '02:00 PM',
  },
  {
    id: 'op-ended',
    token: 'OP',
    tokenName: 'Optimism',
    logo: 'OP',
    network: 'ethereum',
    price: 2.1840,
    priceChange24h: 18.47,
    vol24h: 0,
    vol24hChange: 0,
    totalVol: 9312740.30,
    totalVolChange: 0,
    fdv: 2184.00,
    fdvChange: 0,
    collateral: 'USDC',
    settleTime: '2024-01-24T14:00:00Z',
    settleDisplay: '24/01/2024',
    status: 'ended',
    settleStartDisplay: '10/01/2024',
    settleStartTime: '02:00 PM',
    settleEndDisplay: '24/01/2024',
    settleEndTime: '02:00 PM',
  },
  {
    id: 'arb-ended',
    token: 'ARB',
    tokenName: 'Arbitrum',
    logo: 'ARB',
    network: 'ethereum',
    price: 1.2640,
    priceChange24h: -6.83,
    vol24h: 0,
    vol24hChange: 0,
    totalVol: 7218940.88,
    totalVolChange: 0,
    fdv: 1264.00,
    fdvChange: 0,
    collateral: 'USDC',
    settleTime: '2023-03-23T14:00:00Z',
    settleDisplay: '23/03/2023',
    status: 'ended',
    settleStartDisplay: '09/03/2023',
    settleStartTime: '02:00 PM',
    settleEndDisplay: '23/03/2023',
    settleEndTime: '02:00 PM',
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
