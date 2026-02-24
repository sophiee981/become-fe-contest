import type { OrderBookEntry } from '@/types/order'

// Generate order book for a market
// Buy orders (descending price), Sell orders (ascending price)
export const mockBuyOrders: OrderBookEntry[] = [
  { price: 0.000086, amount: 2_500_000, total: 215.0,  type: 'buy', depth: 0.95 },
  { price: 0.000085, amount: 1_800_000, total: 153.0,  type: 'buy', depth: 0.82 },
  { price: 0.000084, amount: 3_200_000, total: 268.8,  type: 'buy', depth: 0.78 },
  { price: 0.000083, amount: 4_100_000, total: 340.3,  type: 'buy', depth: 0.65 },
  { price: 0.000082, amount: 1_500_000, total: 123.0,  type: 'buy', depth: 0.58 },
  { price: 0.000081, amount: 6_200_000, total: 502.2,  type: 'buy', depth: 0.48 },
  { price: 0.000080, amount: 2_900_000, total: 232.0,  type: 'buy', depth: 0.38 },
  { price: 0.000079, amount: 5_100_000, total: 402.9,  type: 'buy', depth: 0.32 },
  { price: 0.000078, amount: 1_200_000, total: 93.6,   type: 'buy', depth: 0.22 },
  { price: 0.000077, amount: 8_400_000, total: 646.8,  type: 'buy', depth: 0.15 },
  { price: 0.000076, amount: 3_700_000, total: 281.2,  type: 'buy', depth: 0.10 },
  { price: 0.000075, amount: 2_100_000, total: 157.5,  type: 'buy', depth: 0.06 },
]

export const mockSellOrders: OrderBookEntry[] = [
  { price: 0.000088, amount: 1_900_000, total: 167.2,  type: 'sell', depth: 0.90 },
  { price: 0.000089, amount: 3_400_000, total: 302.6,  type: 'sell', depth: 0.78 },
  { price: 0.000090, amount: 2_100_000, total: 189.0,  type: 'sell', depth: 0.68 },
  { price: 0.000091, amount: 4_800_000, total: 436.8,  type: 'sell', depth: 0.58 },
  { price: 0.000092, amount: 1_600_000, total: 147.2,  type: 'sell', depth: 0.50 },
  { price: 0.000093, amount: 5_200_000, total: 483.6,  type: 'sell', depth: 0.42 },
  { price: 0.000094, amount: 2_800_000, total: 263.2,  type: 'sell', depth: 0.32 },
  { price: 0.000095, amount: 1_100_000, total: 104.5,  type: 'sell', depth: 0.24 },
  { price: 0.000096, amount: 3_900_000, total: 374.4,  type: 'sell', depth: 0.16 },
  { price: 0.000097, amount: 2_300_000, total: 223.1,  type: 'sell', depth: 0.10 },
  { price: 0.000098, amount: 1_700_000, total: 166.6,  type: 'sell', depth: 0.06 },
  { price: 0.000099, amount: 4_600_000, total: 455.4,  type: 'sell', depth: 0.03 },
]
