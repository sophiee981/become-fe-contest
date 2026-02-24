export interface User {
  address: string
  displayAddress: string
  username?: string
  joinedAt: string
  stats: {
    totalTrades: number
    totalVolume: number
  }
  balance: {
    USDC: number
    ETH?: number
    [token: string]: number | undefined
  }
}
