// Figma node 38045:245592 — My Dashboard mock data
// Open Orders + Ended Settlement data

export type SideType = 'buy' | 'sell' | 'resell'
export type BadgeType = 'Full' | 'RS' | 'DP' | ''
export type ChainType = 'SOL' | 'USDC' | 'ETH'
export type EndedStatusType = 'settled' | 'canceled' | 'claimed' | 'closed' | 'resold'
export type SettleTabType = 'settle' | 'cancel'

export interface OpenOrder {
  id: string
  pair: string
  chain: ChainType
  badge: BadgeType
  createdAt: string       // display string e.g. "1 min ago"
  side: SideType
  price: number           // per token in USD
  amount: number          // token quantity
  deposited: number       // SOL/USDC deposited as collateral
  orgCollateral: number   // original collateral (tokens for RS, SOL for Full)
  toReceive: number | null
  progress: number        // 0-100 fill percentage
}

export interface EndedOrder {
  id: string
  pair: string
  badge: BadgeType
  time: string
  side: SideType
  price: number
  orgPrice: number | null
  amount: number
  deposited: number
  received: number
  status: EndedStatusType
  hasAction: boolean
  settleType: SettleTabType
}

// ─── Open Orders (28 total) ───
export const mockOpenOrders: OpenOrder[] = [
  // SKATE/SOL
  { id: 'o01', pair: 'SKATE/SOL', chain: 'SOL', badge: 'Full', createdAt: '1 min ago',   side: 'buy',    price: 0.0050, amount: 1000,  deposited: 1.50,  orgCollateral: 1000,  toReceive: null, progress: 76.9 },
  { id: 'o02', pair: 'SKATE/SOL', chain: 'SOL', badge: 'Full', createdAt: '2 days ago',  side: 'sell',   price: 0.0050, amount: 1000,  deposited: 1.50,  orgCollateral: 1.50,  toReceive: null, progress: 0 },
  { id: 'o03', pair: 'SKATE/SOL', chain: 'SOL', badge: 'Full', createdAt: '2 days ago',  side: 'sell',   price: 0.0050, amount: 1000,  deposited: 1.50,  orgCollateral: 1.50,  toReceive: null, progress: 0 },
  { id: 'o04', pair: 'SKATE/SOL', chain: 'SOL', badge: 'RS',   createdAt: '1 week ago',  side: 'resell', price: 0.0100, amount: 1000,  deposited: 1.00,  orgCollateral: 2.00,  toReceive: 1.50, progress: 0 },
  { id: 'o05', pair: 'SKATE/SOL', chain: 'SOL', badge: 'Full', createdAt: '3 hrs ago',   side: 'buy',    price: 0.0048, amount: 2500,  deposited: 3.00,  orgCollateral: 2500,  toReceive: null, progress: 35.0 },
  { id: 'o06', pair: 'SKATE/SOL', chain: 'SOL', badge: 'Full', createdAt: '5 hrs ago',   side: 'buy',    price: 0.0045, amount: 5000,  deposited: 5.62,  orgCollateral: 5000,  toReceive: null, progress: 100 },
  { id: 'o07', pair: 'SKATE/SOL', chain: 'SOL', badge: 'Full', createdAt: '1 day ago',   side: 'sell',   price: 0.0052, amount: 1500,  deposited: 2.00,  orgCollateral: 2.00,  toReceive: null, progress: 55.0 },
  { id: 'o08', pair: 'SKATE/SOL', chain: 'SOL', badge: 'RS',   createdAt: '3 days ago',  side: 'resell', price: 0.0090, amount: 800,   deposited: 0.90,  orgCollateral: 1.80,  toReceive: 1.20, progress: 20.0 },
  { id: 'o09', pair: 'SKATE/SOL', chain: 'SOL', badge: 'DP',   createdAt: '4 days ago',  side: 'buy',    price: 0.0055, amount: 3000,  deposited: 4.12,  orgCollateral: 3000,  toReceive: null, progress: 0 },
  { id: 'o10', pair: 'SKATE/SOL', chain: 'SOL', badge: 'Full', createdAt: '1 week ago',  side: 'buy',    price: 0.0042, amount: 8000,  deposited: 8.40,  orgCollateral: 8000,  toReceive: null, progress: 90.0 },
  { id: 'o11', pair: 'SKATE/SOL', chain: 'SOL', badge: 'Full', createdAt: '2 weeks ago', side: 'sell',   price: 0.0060, amount: 600,   deposited: 0.90,  orgCollateral: 0.90,  toReceive: null, progress: 0 },
  { id: 'o12', pair: 'SKATE/SOL', chain: 'SOL', badge: 'RS',   createdAt: '3 weeks ago', side: 'resell', price: 0.0080, amount: 2000,  deposited: 2.00,  orgCollateral: 4.00,  toReceive: 2.50, progress: 50.0 },
  // XPL/USDC
  { id: 'o13', pair: 'XPL/USDC',  chain: 'USDC',badge: 'Full', createdAt: '1 min ago',   side: 'buy',    price: 0.2900, amount: 15500, deposited: 4500,  orgCollateral: 15500, toReceive: null, progress: 0 },
  { id: 'o14', pair: 'XPL/USDC',  chain: 'USDC',badge: 'Full', createdAt: '6 hrs ago',   side: 'sell',   price: 0.3100, amount: 10000, deposited: 3100,  orgCollateral: 3100,  toReceive: null, progress: 0 },
  { id: 'o15', pair: 'XPL/USDC',  chain: 'USDC',badge: 'Full', createdAt: '1 day ago',   side: 'buy',    price: 0.2750, amount: 20000, deposited: 5500,  orgCollateral: 20000, toReceive: null, progress: 45.0 },
  { id: 'o16', pair: 'XPL/USDC',  chain: 'USDC',badge: 'RS',   createdAt: '2 days ago',  side: 'resell', price: 0.3200, amount: 5000,  deposited: 1600,  orgCollateral: 3200,  toReceive: 1500, progress: 0 },
  { id: 'o17', pair: 'XPL/USDC',  chain: 'USDC',badge: 'Full', createdAt: '5 days ago',  side: 'buy',    price: 0.2650, amount: 30000, deposited: 7950,  orgCollateral: 30000, toReceive: null, progress: 0 },
  { id: 'o18', pair: 'XPL/USDC',  chain: 'USDC',badge: 'DP',   createdAt: '1 week ago',  side: 'sell',   price: 0.3400, amount: 8000,  deposited: 2720,  orgCollateral: 2720,  toReceive: null, progress: 0 },
  // PTB/SOL
  { id: 'o19', pair: 'PTB/SOL',   chain: 'SOL', badge: 'RS',   createdAt: '1 week ago',  side: 'resell', price: 0.0100, amount: 7000,  deposited: 2.10,  orgCollateral: 4.20,  toReceive: 1.50, progress: 0 },
  { id: 'o20', pair: 'PTB/SOL',   chain: 'SOL', badge: 'Full', createdAt: '2 days ago',  side: 'buy',    price: 0.0090, amount: 5000,  deposited: 1.12,  orgCollateral: 5000,  toReceive: null, progress: 0 },
  { id: 'o21', pair: 'PTB/SOL',   chain: 'SOL', badge: 'Full', createdAt: '3 days ago',  side: 'sell',   price: 0.0110, amount: 3000,  deposited: 0.82,  orgCollateral: 0.82,  toReceive: null, progress: 0 },
  { id: 'o22', pair: 'PTB/SOL',   chain: 'SOL', badge: 'RS',   createdAt: '2 weeks ago', side: 'resell', price: 0.0120, amount: 4000,  deposited: 1.20,  orgCollateral: 2.40,  toReceive: 0.80, progress: 30.0 },
  { id: 'o23', pair: 'PTB/SOL',   chain: 'SOL', badge: 'Full', createdAt: '1 month ago', side: 'buy',    price: 0.0085, amount: 10000, deposited: 2.12,  orgCollateral: 10000, toReceive: null, progress: 0 },
  // ZBT/USDC
  { id: 'o24', pair: 'ZBT/USDC',  chain: 'USDC',badge: 'Full', createdAt: '4 hrs ago',   side: 'buy',    price: 0.0842, amount: 50000, deposited: 4210,  orgCollateral: 50000, toReceive: null, progress: 0 },
  { id: 'o25', pair: 'ZBT/USDC',  chain: 'USDC',badge: 'Full', createdAt: '8 hrs ago',   side: 'sell',   price: 0.0900, amount: 25000, deposited: 2250,  orgCollateral: 2250,  toReceive: null, progress: 15.0 },
  { id: 'o26', pair: 'ZBT/USDC',  chain: 'USDC',badge: 'Full', createdAt: '2 days ago',  side: 'buy',    price: 0.0820, amount: 100000,deposited: 8200,  orgCollateral: 100000,toReceive: null, progress: 0 },
  // ERA/SOL
  { id: 'o27', pair: 'ERA/SOL',   chain: 'SOL', badge: 'Full', createdAt: '1 day ago',   side: 'buy',    price: 0.0464, amount: 3000,  deposited: 3.48,  orgCollateral: 3000,  toReceive: null, progress: 0 },
  { id: 'o28', pair: 'ERA/SOL',   chain: 'SOL', badge: 'Full', createdAt: '3 days ago',  side: 'sell',   price: 0.0500, amount: 2000,  deposited: 2.50,  orgCollateral: 2.50,  toReceive: null, progress: 0 },
]

// ─── Ended Settlement (22 displayed, total 132) ───
export const mockEndedOrders: EndedOrder[] = [
  // PENGU/SOL
  { id: 'e01', pair: 'PENGU/SOL', badge: '',   time: '2 weeks ago',           side: 'buy',    price: 0.0050, orgPrice: null,   amount: 1000,  deposited: 1.50, received: 1000,  status: 'settled',  hasAction: true,  settleType: 'settle' },
  { id: 'e02', pair: 'PENGU/SOL', badge: '',   time: '23/02/2024 15:33:15',   side: 'buy',    price: 0.0050, orgPrice: null,   amount: 1000,  deposited: 1.50, received: 1.50,  status: 'canceled', hasAction: true,  settleType: 'cancel' },
  { id: 'e03', pair: 'PENGU/SOL', badge: '',   time: '3 months ago',          side: 'buy',    price: 0.0050, orgPrice: null,   amount: 1000,  deposited: 1.50, received: 0.50,  status: 'closed',   hasAction: true,  settleType: 'settle' },
  { id: 'e04', pair: 'PENGU/SOL', badge: 'RS', time: '23/02/2024 15:00:00',   side: 'resell', price: 0.0050, orgPrice: 0.0050, amount: 1000,  deposited: 1.50, received: 1.50,  status: 'canceled', hasAction: false, settleType: 'cancel' },
  { id: 'e05', pair: 'PENGU/SOL', badge: 'RS', time: '1 year ago',            side: 'buy',    price: 0.0050, orgPrice: 0.0050, amount: 1000,  deposited: 1.50, received: 1000,  status: 'settled',  hasAction: false, settleType: 'settle' },
  { id: 'e06', pair: 'PENGU/SOL', badge: 'RS', time: '1 year ago',            side: 'resell', price: 0.0050, orgPrice: 0.0050, amount: 1000,  deposited: 1.50, received: 0.00,  status: 'claimed',  hasAction: false, settleType: 'settle' },
  { id: 'e07', pair: 'PENGU/SOL', badge: '',   time: '1 year ago',            side: 'sell',   price: 0.0050, orgPrice: null,   amount: 1000,  deposited: 1.50, received: 3.00,  status: 'settled',  hasAction: true,  settleType: 'settle' },
  { id: 'e08', pair: 'PENGU/SOL', badge: '',   time: '23/02/2024 16:00:00',   side: 'sell',   price: 0.0050, orgPrice: null,   amount: 1000,  deposited: 1.50, received: 0.00,  status: 'claimed',  hasAction: true,  settleType: 'settle' },
  { id: 'e09', pair: 'PENGU/SOL', badge: '',   time: '1 year ago',            side: 'sell',   price: 0.0050, orgPrice: null,   amount: 1000,  deposited: 1.50, received: 0.50,  status: 'closed',   hasAction: true,  settleType: 'settle' },
  // ME/SOL
  { id: 'e10', pair: 'ME/SOL',    badge: '',   time: '3 months ago',          side: 'buy',    price: 0.0050, orgPrice: null,   amount: 1000,  deposited: 1.50, received: 3.00,  status: 'claimed',  hasAction: true,  settleType: 'settle' },
  { id: 'e11', pair: 'ME/SOL',    badge: '',   time: '4 months ago',          side: 'sell',   price: 0.0060, orgPrice: null,   amount: 2000,  deposited: 3.00, received: 2.80,  status: 'settled',  hasAction: true,  settleType: 'settle' },
  { id: 'e12', pair: 'ME/SOL',    badge: '',   time: '6 months ago',          side: 'buy',    price: 0.0045, orgPrice: null,   amount: 5000,  deposited: 5.62, received: 0.00,  status: 'closed',   hasAction: true,  settleType: 'settle' },
  { id: 'e13', pair: 'ME/SOL',    badge: 'RS', time: '8 months ago',          side: 'resell', price: 0.0055, orgPrice: 0.0050, amount: 3000,  deposited: 4.12, received: 4.12,  status: 'resold',   hasAction: false, settleType: 'settle' },
  // MERL/SOL
  { id: 'e14', pair: 'MERL/SOL',  badge: 'RS', time: '1 year ago',            side: 'resell', price: 0.0050, orgPrice: 0.0050, amount: 1000,  deposited: 1.50, received: 1.50,  status: 'resold',   hasAction: false, settleType: 'settle' },
  { id: 'e15', pair: 'MERL/SOL',  badge: '',   time: '10 months ago',         side: 'buy',    price: 0.0040, orgPrice: null,   amount: 2000,  deposited: 2.00, received: 1.80,  status: 'settled',  hasAction: true,  settleType: 'settle' },
  { id: 'e16', pair: 'MERL/SOL',  badge: '',   time: '11 months ago',         side: 'sell',   price: 0.0045, orgPrice: null,   amount: 1500,  deposited: 1.68, received: 0.00,  status: 'canceled', hasAction: true,  settleType: 'cancel' },
  { id: 'e17', pair: 'MERL/SOL',  badge: 'RS', time: '1 year ago',            side: 'resell', price: 0.0060, orgPrice: 0.0048, amount: 4000,  deposited: 6.00, received: 0.00,  status: 'canceled', hasAction: false, settleType: 'cancel' },
  // SKATE/SOL
  { id: 'e18', pair: 'SKATE/SOL', badge: '',   time: '2 months ago',          side: 'buy',    price: 0.0048, orgPrice: null,   amount: 5000,  deposited: 6.00, received: 5000,  status: 'settled',  hasAction: true,  settleType: 'settle' },
  { id: 'e19', pair: 'SKATE/SOL', badge: '',   time: '3 months ago',          side: 'sell',   price: 0.0052, orgPrice: null,   amount: 3000,  deposited: 3.90, received: 0.00,  status: 'claimed',  hasAction: true,  settleType: 'settle' },
  { id: 'e20', pair: 'SKATE/SOL', badge: 'RS', time: '6 months ago',          side: 'resell', price: 0.0065, orgPrice: 0.0050, amount: 2000,  deposited: 2.50, received: 2.50,  status: 'resold',   hasAction: false, settleType: 'settle' },
  // PTB/SOL
  { id: 'e21', pair: 'PTB/SOL',   badge: '',   time: '1 month ago',           side: 'buy',    price: 0.0095, orgPrice: null,   amount: 4000,  deposited: 1.00, received: 4000,  status: 'settled',  hasAction: true,  settleType: 'settle' },
  { id: 'e22', pair: 'ZBT/USDC',  badge: '',   time: '5 months ago',          side: 'buy',    price: 0.0800, orgPrice: null,   amount: 20000, deposited: 1600, received: 0.00,  status: 'closed',   hasAction: true,  settleType: 'settle' },
]

// ─── Display helpers ───

export const fmtAmount = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(2)}K`
  return n.toFixed(2)
}

export const fmtPrice = (n: number): string => {
  if (n < 0.001) return n.toFixed(6)
  if (n < 0.01)  return n.toFixed(4)
  if (n < 1)     return n.toFixed(4)
  return n.toFixed(2)
}

export const fmtDeposited = (n: number, chain: ChainType): string => {
  if (chain === 'USDC') return fmtAmount(n)
  return n.toFixed(2)
}

// ─── Token meta ───
export const TOKEN_DOT_COLORS: Record<string, { color: string; letter: string }> = {
  'SKATE/SOL': { color: '#9945FF', letter: 'S' },
  'XPL/USDC':  { color: '#3B82F6', letter: 'X' },
  'PTB/SOL':   { color: '#F97316', letter: 'P' },
  'ZBT/USDC':  { color: '#FB923C', letter: 'Z' },
  'ERA/SOL':   { color: '#16C284', letter: 'E' },
  'PENGU/SOL': { color: '#F97316', letter: 'P' },
  'ME/SOL':    { color: '#3B82F6', letter: 'M' },
  'MERL/SOL':  { color: '#8B5CF6', letter: 'M' },
}

export const CHAIN_COLORS: Record<ChainType, string> = {
  SOL:  '#9945FF',
  USDC: '#2775CA',
  ETH:  '#627EEA',
}

// Total counts for display (simulating larger backend dataset)
export const OPEN_ORDERS_TOTAL = 28
export const ENDED_ORDERS_TOTAL = 132
export const ENDED_SETTLE_COUNT = 13
export const ENDED_CANCEL_COUNT = 0

export const ROWS_PER_PAGE = 6
