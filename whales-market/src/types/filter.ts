export type MarketCategory = 'all' | 'pre-market' | 'points' | 'allocation'
export type SortField = 'price' | 'volume24h' | 'change24h' | 'marketCap' | 'rank'
export type SortDirection = 'asc' | 'desc'

export interface MarketFilter {
  search: string
  category: MarketCategory
  sortField: SortField
  sortDirection: SortDirection
}
