// src/components/market/RecentTradesTable.tsx
// Shared Recent Trades table — used in LandingPage and MarketDetailV2Page
// Figma nodes: 42532:726450 (Landing) / 37315:189288 (Market Detail V2)

import { useState, useMemo } from 'react'
import { clsx } from 'clsx'
import usdcIconImg   from '@/assets/images/usdc-icon.png'
import sharkIconSrc  from '@/assets/images/shark-icon.svg'
import whaleIconSrc  from '@/assets/images/whale-icon.svg'
import shrimpIconSrc from '@/assets/images/shrimp-icon.svg'
import tokenSkateImg from '@/assets/images/token-skate.png'
import tokenEraImg   from '@/assets/images/token-era.png'
import tokenGrassImg from '@/assets/images/token-grass.png'
import tokenLoudImg  from '@/assets/images/token-loud.png'
import tokenMmtImg   from '@/assets/images/token-mmt.png'
import tokenZbtImg   from '@/assets/images/token-zbt.png'
import tokenTiaImg   from '@/assets/images/token-tia.png'
import tokenStrkImg  from '@/assets/images/token-strk.png'
import tokenOpImg    from '@/assets/images/token-op.png'
import tokenArbImg   from '@/assets/images/token-arb.png'
import { type HomeRecentTrade } from '@/mock-data/homeData'

// ─── Token logo map ───────────────────────────────────────────────────────────
const TOKEN_LOGOS: Record<string, string> = {
  SKATE: tokenSkateImg,
  ERA:   tokenEraImg,
  GRASS: tokenGrassImg,
  LOUD:  tokenLoudImg,
  MMT:   tokenMmtImg,
  ZBT:   tokenZbtImg,
  TIA:   tokenTiaImg,
  STRK:  tokenStrkImg,
  OP:    tokenOpImg,
  ARB:   tokenArbImg,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export type TradeSortKey = 'time' | 'price' | 'amount' | 'collateral' | 'txId'

export function parseTradeNum(s: string): number {
  const c = s.replace(/,/g, '')
  if (c.endsWith('K')) return parseFloat(c) * 1_000
  if (c.endsWith('M')) return parseFloat(c) * 1_000_000
  return parseFloat(c) || 0
}

const fmtPrice = (p: number): string => {
  if (p === 0) return '0.00'
  if (p < 0.001) return p.toFixed(8)
  if (p < 1) return p.toFixed(4)
  return p.toFixed(4)
}

// ─── Token color map — for circular placeholder icons ─────────────────────────
const TOKEN_COLORS: Record<string, string> = {
  USDC:  '#2775CA',
  USDT:  '#26A17B',
  SOL:   '#9945FF',
  SKATE: '#FB923C',
  IKA:   '#60A5FA',
  PENGU: '#22D3EE',
  GRASS: '#22C55E',
  LOUD:  '#EAB308',
  MMT:   '#A855F7',
  BONK:  '#F97316',
  ERA:   '#F43F5E',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TokenDot: React.FC<{ token: string; size?: number }> = ({ token, size = 16 }) => (
  <div
    className="rounded-full flex items-center justify-center text-white font-bold select-none shrink-0"
    style={{
      width: size, height: size,
      backgroundColor: TOKEN_COLORS[token] ?? '#252527',
      fontSize: Math.floor(size * 0.44),
      lineHeight: '1',
    }}
  >
    {token[0]}
  </div>
)

// Animal icon — real Figma SVG exports (nodes: shark=36017:127255, whale=36017:127244, shrimp=36017:127247)
const AnimalIcon: React.FC<{ animal: 'shark' | 'whale' | 'shrimp'; size?: number }> = ({ animal, size = 16 }) => {
  const src = animal === 'whale' ? whaleIconSrc : animal === 'shrimp' ? shrimpIconSrc : sharkIconSrc
  return <img src={src} alt={animal} width={size} height={size} className="shrink-0" aria-hidden="true" />
}

// UsdtIcon — circle with T-bar, Tether coin logo
const UsdtIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="8" cy="8" r="8" fill="#26A17B" />
    <rect x="3.5" y="4.5" width="9" height="1.6" rx="0.5" fill="white" />
    <rect x="6.7" y="6.1" width="2.6" height="3.8" rx="0.5" fill="white" />
    <rect x="3.5" y="10.2" width="9" height="1.1" rx="0.5" fill="white" />
  </svg>
)

// Collateral token icon — USDC image, USDT SVG, others → TokenDot
const CollateralTokenIcon: React.FC<{ token: string; size?: number }> = ({ token, size = 16 }) => {
  if (token === 'USDC') return (
    <img src={usdcIconImg} alt="USDC"
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }} />
  )
  if (token === 'USDT') return <UsdtIcon size={size} />
  return <TokenDot token={token} size={size} />
}

// Arrow icon for Tx.ID button
const ArrowRightUpIcon: React.FC<{ size?: number }> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="currentColor"
    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9.5 1.5H3.5V3H6.94L1.5 8.44L2.56 9.5L8 4.06V7.5H9.5V1.5Z" />
  </svg>
)

// Sort icon — matches Figma node 35281:21856
const TableSortIcon: React.FC<{ field: string; sortKey: string; sortDir: 'asc' | 'desc' }> = ({ field, sortKey, sortDir }) => {
  const isActive = field === sortKey
  const upColor   = isActive && sortDir === 'asc'  ? '#F9F9FA' : '#7A7A83'
  const downColor = isActive && sortDir === 'desc' ? '#F9F9FA' : '#7A7A83'
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.44604 3.24253C7.59297 3.08724 7.79223 3 8 3C8.20777 3 8.40703 3.08724 8.55396 3.24253L10.7706 5.58598C10.8802 5.70188 10.9548 5.84954 10.985 6.01028C11.0152 6.17102 10.9996 6.33762 10.9402 6.48899C10.8808 6.64037 10.7803 6.76972 10.6514 6.86068C10.5224 6.95165 10.3709 7.00013 10.2158 7H5.78415C5.62914 7.00013 5.47758 6.95165 5.34864 6.86068C5.2197 6.76972 5.11917 6.64037 5.05978 6.48899C5.0004 6.33762 4.98481 6.17102 5.01501 6.01028C5.0452 5.84954 5.11982 5.70188 5.22941 5.58598L7.44604 3.24253Z" fill={upColor} />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.55396 12.7575C8.40703 12.9128 8.20777 13 8 13C7.79223 13 7.59297 12.9128 7.44604 12.7575L5.22941 10.414C5.11982 10.2981 5.0452 10.1505 5.01501 9.98972C4.98481 9.82898 5.0004 9.66238 5.05978 9.511C5.11917 9.35963 5.2197 9.23028 5.34864 9.13932C5.47758 9.04835 5.62914 8.99987 5.78415 9H10.2158C10.3709 8.99987 10.5224 9.04835 10.6514 9.13932C10.7803 9.23028 10.8808 9.35963 10.9402 9.511C10.9996 9.66238 11.0152 9.82898 10.985 9.98972C10.9548 10.1505 10.8802 10.2981 10.7706 10.414L8.55396 12.7575Z" fill={downColor} />
    </svg>
  )
}

// Tab badge — active/inactive pill
const TabBadge: React.FC<{ count: number; active?: boolean }> = ({ count, active = true }) => (
  <span className={clsx(
    'inline-flex items-center justify-center px-2 py-1 rounded-full text-[10px] font-medium tabular-nums leading-[12px]',
    active ? 'bg-[#16c284] text-[#f9f9fa]' : 'bg-[#252527] text-[#b4b4ba]',
  )}>
    {count}
  </span>
)

// ─── Column config ─────────────────────────────────────────────────────────────
const TRADE_COLS: { label: string; field: TradeSortKey | null; align: 'left' | 'right' }[] = [
  { label: 'Time',       field: 'time',       align: 'left'  },
  { label: 'Side',       field: null,         align: 'left'  },
  { label: 'Pair',       field: null,         align: 'left'  },
  { label: 'Price ($)',  field: 'price',      align: 'right' },
  { label: 'Amount',     field: 'amount',     align: 'right' },
  { label: 'Collateral', field: 'collateral', align: 'right' },
  { label: 'Tx.ID',      field: 'txId',       align: 'right' },
]

// ─── Main Component ───────────────────────────────────────────────────────────

interface RecentTradesTableProps {
  trades: HomeRecentTrade[]
  newId: string | null
  showHeader?: boolean  // show "Recent Trades" section title (default: true)
}

export const RecentTradesTable: React.FC<RecentTradesTableProps> = ({
  trades,
  newId,
  showHeader = true,
}) => {
  const [sortKey, setSortKey] = useState<TradeSortKey>('time')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (field: TradeSortKey) => {
    if (sortKey === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(field); setSortDir('desc') }
  }

  const sorted = useMemo(() => {
    return [...trades].sort((a, b) => {
      const ai = trades.indexOf(a)
      const bi = trades.indexOf(b)
      let av: number | string
      let bv: number | string
      switch (sortKey) {
        case 'time':       av = ai;                           bv = bi;                           break
        case 'price':      av = a.price;                      bv = b.price;                      break
        case 'amount':     av = parseTradeNum(a.amount);      bv = parseTradeNum(b.amount);      break
        case 'collateral': av = parseTradeNum(a.collateral);  bv = parseTradeNum(b.collateral);  break
        case 'txId':       av = a.txId;                       bv = b.txId;                       break
        default:           av = ai;                           bv = bi;
      }
      const dir = sortDir === 'asc' ? 1 : -1
      if (av < bv) return -1 * dir
      if (av > bv) return  1 * dir
      return 0
    })
  }, [trades, sortKey, sortDir])

  return (
    <div className="py-4 flex flex-col gap-4">
      {showHeader && (
        <div className="flex items-center h-9">
          <span className="flex items-center gap-2 text-[20px] font-[500] leading-[28px] text-[#f9f9fa]">
            Recent Trades
            <TabBadge count={trades.length} active={true} />
          </span>
        </div>
      )}

      <table className="w-full table-fixed">
        <colgroup>
          <col style={{ width: '9.64%' }} />
          <col style={{ width: '9.64%' }} />
          <col style={{ width: '22.89%' }} />
          <col style={{ width: '14.46%' }} />
          <col style={{ width: '14.46%' }} />
          <col style={{ width: '14.46%' }} />
          <col style={{ width: '14.46%' }} />
        </colgroup>

        <thead>
          <tr className="border-b border-[#1b1b1c]">
            {TRADE_COLS.map(col => (
              <th
                key={col.label}
                className={clsx(
                  'px-2 py-2 text-[12px] font-[400] leading-[16px] text-[#7a7a83] whitespace-nowrap select-none',
                  col.align === 'right' ? 'text-right' : 'text-left',
                  col.field && 'cursor-pointer hover:text-[#b4b4ba] transition-colors',
                )}
                onClick={() => col.field && handleSort(col.field)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.field && (
                    <TableSortIcon field={col.field} sortKey={sortKey} sortDir={sortDir} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sorted.map((trade: HomeRecentTrade) => (
            <tr
              key={trade.id}
              className={clsx(
                'border-b border-[#1b1b1c] hover:bg-[rgba(255,255,255,0.02)] transition-colors h-[60px]',
                trade.id === newId && 'animate-trade-in',
              )}
            >
              {/* Col 0: Time */}
              <td className="px-2 py-4">
                <span className="text-[14px] font-[400] leading-[20px] text-[#7a7a83] whitespace-nowrap">
                  {trade.timeAgo}
                </span>
              </td>

              {/* Col 1: Side */}
              <td className="px-2 py-4">
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'text-[14px] font-[500] leading-[20px]',
                    trade.side === 'buy' ? 'text-[#5bd197]' : 'text-[#fd5e67]',
                  )}>
                    {trade.side === 'buy' ? 'Buy' : 'Sell'}
                  </span>
                  {trade.isRS && (
                    <span className="inline-flex items-center justify-center px-2 py-1 rounded-full
                                     bg-[#eab308] text-[#0a0a0b] text-[10px] font-[500] leading-[12px] shrink-0 whitespace-nowrap">
                      RS
                    </span>
                  )}
                </div>
              </td>

              {/* Col 2: Pair */}
              <td className="px-2 py-4">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    {TOKEN_LOGOS[trade.baseToken] ? (
                      <img src={TOKEN_LOGOS[trade.baseToken]} alt={trade.baseToken}
                        className="w-4 h-4 rounded-full object-cover" />
                    ) : (
                      <TokenDot token={trade.baseToken} size={16} />
                    )}
                  </span>
                  <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] whitespace-nowrap">
                    {trade.pair}
                  </span>
                </div>
              </td>

              {/* Col 3: Price ($) */}
              <td className="px-2 py-4 text-right">
                <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums">
                  {fmtPrice(trade.price)}
                </span>
              </td>

              {/* Col 4: Amount */}
              <td className="px-2 py-4 text-right">
                <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums whitespace-nowrap">
                  {trade.amount}
                </span>
              </td>

              {/* Col 5: Collateral — amount + token logo + animal icon */}
              <td className="px-2 py-4">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-[14px] font-[500] leading-[20px] text-[#f9f9fa] tabular-nums whitespace-nowrap">
                    {trade.collateral}
                  </span>
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    <CollateralTokenIcon token={trade.collateralToken} size={16} />
                  </span>
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    <AnimalIcon animal={trade.animal} size={16} />
                  </span>
                </div>
              </td>

              {/* Col 6: Tx.ID */}
              <td className="px-2 py-4">
                <div className="flex items-center justify-end">
                  <button
                    onClick={e => e.stopPropagation()}
                    className="w-[52px] h-7 border border-[#252527] rounded-[6px] flex items-center justify-center
                               text-[#f9f9fa] hover:border-[#3a3a3f] hover:bg-[#252527] active:bg-[#2e2e34] transition-colors"
                    style={{ boxSizing: 'border-box' }}
                    aria-label="View transaction"
                  >
                    <span className="w-4 h-4 flex items-center justify-center p-0.5">
                      <ArrowRightUpIcon size={12} />
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
