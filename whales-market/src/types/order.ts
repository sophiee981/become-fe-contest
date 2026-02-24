export interface OrderBookEntry {
  price: number
  amount: number
  total: number
  type: 'buy' | 'sell'
  depth?: number  // 0–1, for depth visualization bar
}

export interface MyOrder {
  id: string
  marketId: string
  token: string
  tokenName: string
  type: 'buy' | 'sell'
  price: number
  amount: number
  filled: number   // 0–100 percent
  status: 'open' | 'partial' | 'filled' | 'cancelled'
  createdAt: string
}

export interface RecentTrade {
  id: string
  price: number
  amount: number
  type: 'buy' | 'sell'
  timestamp: string
}
