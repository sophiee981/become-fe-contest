import type { User } from '@/types/user'

export const mockUser: User = {
  address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  displayAddress: '0x1a2b...9a0b',
  username: 'WhaleTrader',
  joinedAt: '2023-09-01T00:00:00Z',
  stats: {
    totalTrades: 47,
    totalVolume: 128_400,
  },
  balance: {
    USDC: 8_420,
    ETH: 1.25,
    WEN: 12_000_000,
    BONK: 50_000_000,
  },
}
