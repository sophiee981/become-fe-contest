export interface Market {
  id: string
  rank: number
  token: string        // 'WEN'
  name: string         // 'Wen'
  logo: string         // '/icons/wen.svg' or emoji fallback
  category: 'pre-market' | 'points' | 'allocation'
  price: number        // USD
  change24h: number    // percent, e.g. 12.5 or -3.2
  volume24h: number    // USD
  marketCap: number    // USD
  totalVolume: number  // USD all time
  totalTrades: number
  floorPrice: number
  status: 'active' | 'closed'
}
