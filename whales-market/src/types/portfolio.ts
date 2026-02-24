export interface PortfolioStats {
  totalValue: number
  pnl: number
  pnlPercent: number
  activeOrders: number
  completedTrades: number
}

export interface TradeHistoryEntry {
  id: string
  marketId: string
  token: string
  tokenName: string
  logo: string
  type: 'buy' | 'sell'
  price: number
  amount: number
  total: number
  fee: number
  pnl: number
  status: 'completed' | 'cancelled' | 'failed'
  date: string
  counterparty: string
}
