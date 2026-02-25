# CONTEXT.md — Whales Market Session Handoff

> File for AI session continuity. Read this **before** touching any code.
> Last updated: **2026-02-25**

---

## 1. Project Overview

**Whales Market** is a cryptocurrency pre-market OTC trading platform.
This is a **frontend-only** project (no backend) — all data comes from typed mock files.

| Key | Value |
|-----|-------|
| Path | `/Users/sophie/Applications/whales-market` |
| Figma file key | `mrTOtq806N1EFg8NOnsj99` |
| Figma file name | WhalesMarket-v2--Sophie-code- |
| Stack | Vite 7 + React 19 + TypeScript (strict) + Tailwind CSS 3.4 |
| Router | React Router DOM v7 |
| Icons | lucide-react + hand-crafted SVG icons from Figma |
| Font | Inter Variable (via `@fontsource-variable/inter`) |
| Dev command | `npm run dev` |

---

## 2. Git History (chronological)

```
7c0cacb  Add files via upload
1a4e3c4  Day 1 - add CLAUDE.md and spec.md
0e0bc00  Merge branch 'main'
b96b7ef  Day 1 - project setup and design tokens
465b55b  Day 2 - Landing page, Navbar, design tokens, TopMetrics
da2bc93  Day 2 - Live Market table, network dropdown, avatar dropdown
7d905aa  Fix avatar dropdown UX + smooth animations for all floating panels
ce99757  Implement Connect Wallet modal (Figma 42670:317711)
d5dfc0a  Fix network filter dropdown (Figma 38214:311363)
2e8fe05  Rebuild Recent Trades section (Figma 42532:726450)
f4daa44  Add real token logo images to Live Market section
c2492f5  Demo tweaks: ZBT token, MMT Solana chain, NEW MARKET badge
891a8d1  Fix Recent Trades table: remove overflow-x-auto, use % column widths
87d2aa7  Clean up Recent Trades section
c386e8e  Rebuild BottomStats (Figma 42532:726513)
2d085d8  Add Upcoming tab with card grid, loading skeleton, tab transitions
c25339a  Update sort icon to Figma specs, rebuild Upcoming tab as table
```

---

## 3. Directory Structure

```
src/
├── App.tsx                     # BrowserRouter + ToastProvider + Navbar + AppRouter
├── main.tsx                    # Entry (imports @fontsource-variable/inter)
├── assets/images/              # All image assets
│   ├── logo.svg                # Brand logo (Navbar)
│   ├── avatar.png              # User avatar (Navbar dropdown)
│   ├── chain-ethereum.png      # Network badge logos
│   ├── chain-solana.png
│   ├── chain-bnb.png
│   ├── chain-monad.png         # Used as Hyperliquid logo
│   ├── token-skate.png         # Token logos
│   ├── token-era.png
│   ├── token-grass.png
│   ├── token-loud.png
│   ├── token-mmt.png
│   ├── token-zbt.png
│   ├── skate-logo.png          # Secondary SKATE logo
│   ├── solana-logo.png
│   ├── usdc-icon.png
│   └── fee-icon.png
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # (566 lines) Sticky nav, wallet btn, avatar dropdown
│   │   ├── Footer.tsx          # (71 lines) Footer links
│   │   ├── PageWrapper.tsx     # (12 lines) max-w-[1280px] mx-auto wrapper
│   │   └── WalletModal.tsx     # (388 lines) Connect wallet modal (MetaMask/Phantom/WalletConnect mock)
│   └── ui/
│       ├── Button.tsx          # Variants: primary/secondary/ghost/danger/buy/sell
│       ├── Badge.tsx           # Variants: success/danger/warning/info/neutral/buy/sell
│       ├── Input.tsx           # Label + error + prefix/suffix + hint
│       ├── Modal.tsx           # Backdrop blur, ESC close, overlay click close
│       ├── Tabs.tsx            # Line/pill variants with count badges
│       ├── Toast.tsx           # ToastProvider context + useToast hook
│       ├── Spinner.tsx         # Animated loading spinner
│       ├── Skeleton.tsx        # Shimmer loading placeholder
│       ├── EmptyState.tsx      # Empty list placeholder
│       └── icons/
│           └── DownFillIcon.tsx # Custom chevron-down SVG
├── pages/
│   ├── LandingPage.tsx         # (1350 lines) ★ MAIN PAGE — details in Section 5
│   ├── MarketListPage.tsx      # (210 lines) Market grid + search/filter
│   ├── MarketDetailPage.tsx    # (583 lines) Anchor page: order book + trade form + confirm modal
│   ├── PortfolioPage.tsx       # (228 lines) Stats cards + My Orders + Trade History tabs
│   ├── CreateListingPage.tsx   # (462 lines) Create order form + validation + preview modal
│   ├── ProfilePage.tsx         # (273 lines) User profile + editable username
│   ├── PointsPage.tsx          # (139 lines) Rewards stub
│   └── NotFoundPage.tsx        # (25 lines) 404
├── router/index.tsx            # Route definitions
├── mock-data/
│   ├── homeData.ts             # Landing page data (markets, trades, upcoming, stats, metrics)
│   ├── markets.ts              # 50+ market entries for MarketListPage
│   ├── orderBook.ts            # Buy/sell order book entries
│   ├── myOrders.ts             # User's active orders
│   ├── recentTrades.ts         # Recent trade entries
│   ├── tradeHistory.ts         # Full trade history with P&L
│   ├── portfolio.ts            # Portfolio summary stats
│   └── user.ts                 # Mock user profile + balances
├── types/
│   ├── market.ts               # Market interface
│   ├── order.ts                # OrderBookEntry, MyOrder, RecentTrade
│   ├── user.ts                 # User interface
│   ├── filter.ts               # MarketCategory, SortField, SortDirection, MarketFilter
│   └── portfolio.ts            # PortfolioStats, TradeHistoryEntry
├── hooks/
│   └── useToast.ts             # Toast notification state hook
└── utils/                      # (empty — reserved)
```

---

## 4. Route Map

| Route | Page | Status |
|-------|------|--------|
| `/` | LandingPage | ★ Most polished, 1350 lines |
| `/market` | MarketListPage | Functional |
| `/market/:id` | MarketDetailPage | Anchor page — order book + trade form |
| `/portfolio` | PortfolioPage | Functional |
| `/create` | CreateListingPage | Functional |
| `/profile` | ProfilePage | Functional |
| `/points` | PointsPage | Stub |
| `*` | NotFoundPage | Simple 404 |

---

## 5. LandingPage.tsx — Deep Breakdown

This is the largest and most complex file. It contains **everything inline** (no external feature components).

### Section Architecture (top to bottom)

| # | Component | Lines | Description |
|---|-----------|-------|-------------|
| 0 | Helpers | 1-55 | `fmtPrice()`, `fmtVol()`, `ChangeTag`, `getUTCTimeStr()` |
| 1 | Token/Chain maps | 56-85 | `TOKEN_LOGOS`, `CHAIN_LOGOS`, `CHAIN_BG_CLASS` |
| 2 | `NetworkBadge` | ~86-110 | 16x16 chain badge (absolute bottom-left of token logo) |
| 3 | `TabBadge` | ~111-130 | Green active / dark inactive count badges |
| 4 | `PremarketChart` | ~130-200 | SVG line chart with area gradient + draw animation |
| 5 | `FearGreedGauge` | ~200-280 | Semicircle gauge (pink->orange->green arc + white dot) |
| 6 | `TopMetrics` | ~280-420 | 4-card grid: Pre-market Vol, Fear & Greed, Altcoin Season, Next Settlement |
| 7 | `UpcomingSection` | ~420-465 | Featured upcoming carousel (2-col grid, chevron nav) |
| 8 | SVG Icons | ~430-470 | `Filter2FillIcon`, `MindMapFillIcon`, `TableSortIcon`, `SkeletonRow` |
| 9 | `UpcomingTabContent` | 470-638 | **Upcoming tab table** (5 cols — see Section 6) |
| 10 | `LiveMarketTable` | 640-995 | Tab bar (Live/Upcoming/Ended) + search + network filter + Live Market table |
| 11 | Custom icons | 1001-1070 | `LeftFillIcon`, `RightFillIcon`, `ArrowRightUpFillIcon`, `TokenDot`, `SharkIcon` |
| 12 | `RecentTradesTable` | 1071-1247 | 7-col trade table (Time, Side, Pair, Price, Amount, Collateral, Tx.ID) |
| 13 | `BottomStats` | 1249-1337 | LIVE DATA + Total Vol + Vol 24h + links (Docs/Dune/Link3) + social icons |
| 14 | `LandingPage` | 1339-1350 | Root: TopMetrics → LiveMarketTable → RecentTradesTable → BottomStats |

### TableSortIcon (Figma node 35281:21856)

Updated to exact Figma SVG. 16x16, two arrows (up y=3-7, down y=9-13):
- Inactive: `#7A7A83`
- Active: `#F9F9FA`
- Props: `{ field: string; sortKey: string; sortDir: 'asc' | 'desc' }`

This same icon is **synced across**: LandingPage, MarketListPage, PointsPage.

### LiveMarketTable tabs

The `LiveMarketTable` component manages 3 tabs:
- **Live Market** — shows `mockHomeMarkets` in a sortable table (6 cols: Token, Last Price, 24h Vol, Total Vol, Implied FDV, Settle Time)
- **Upcoming** — renders `<UpcomingTabContent />` (separate component, 5-col table)
- **Ended** — currently falls through to Live Market table (not separately implemented)

Tab switch triggers 600ms loading skeleton.

### Network Filter Dropdown (Figma 38214:311363)

5 options: All Networks, Solana, Ethereum, Hyperliquid, BNB Chain.
Custom dropdown with chain logos + check icon when selected.
Only visible on Live Market tab.

---

## 6. Upcoming Tab — Current State & Pending Work

### Table Structure (Figma node 42540-727391)

| Col | Width | Sortable | Content |
|-----|-------|----------|---------|
| Token | 42% | No | Logo (44x44) + NetworkBadge + ticker + name + optional NEW MARKET badge |
| Watchers | 14% | Yes | Formatted number |
| Investors & Backers | 15% | No | Avatar stack (20x20, -6px overlap) + overflow badge |
| Narrative | 14% | No | Pill badges (bg-[#1b1b1c], text 10px) |
| Moni Score | 15% | Yes | Progress bar (120x4px) + white dot + numeric score |

### Mock Data (`mockUpcomingListings` in homeData.ts)

6 entries: SKATE/SKATEON, SKATE/Skate Chain, ERA/Caldera, GRASS/Grass, LOUD/Loud, MMT/Momentum.

Interface:
```ts
export interface UpcomingListing {
  id: string; token: string; tokenName: string; logo: string;
  network: 'ethereum' | 'solana' | 'base' | 'bnb' | 'sui';
  isNew?: boolean; status: 'soon' | 'countdown';
  listingTime: string | null;
  countdown?: { days: string; hours: string; minutes: string };
  watchers: number;
  investorAvatars: string[];   // currently placeholder letters ['A','B','C','D','E']
  investorOverflow: number;    // "+24" badge count
  narratives: string[];        // e.g. ['gamefi', 'NFT']
  narrativeOverflow: number;   // "+N" overflow count
  moniScore: number;           // numeric score, e.g. 10844
  moniPct: number;             // 0-100 bar fill percentage
}
```

### PENDING WORK (user's latest request, NOT YET STARTED)

1. **Fix Moni Score** to match exact Figma component design
   - Current: 120px x 4px green bar + white dot + number
   - Need to verify against Figma screenshots and adjust

2. **Add investor avatar images** — 5 images uploaded by user:
   - `/Users/sophie/Downloads/investor1.png`
   - `/Users/sophie/Downloads/invest2.png`
   - `/Users/sophie/Downloads/invest3.png`
   - `/Users/sophie/Downloads/invest4.png`
   - `/Users/sophie/Downloads/invest5.png`
   - Need to: copy to `src/assets/images/`, import, use in `investorAvatars` mock data
   - Current investor avatars are **gradient placeholder circles**, not real images

3. **Update mock data** to match the Figma design exactly (values, token names, scores, etc.)

Figma reference for this section: `node-id=42540-727391`
URL: `https://www.figma.com/design/mrTOtq806N1EFg8NOnsj99/WhalesMarket-v2--Sophie-code-?node-id=42540-727391`

---

## 7. Design System (tailwind.config.ts — 272 lines)

### Color Tokens (key ones)

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-base` | `#0A0A0B` | Page background |
| `bg-surface` | `#1B1B1C` | Card/panel backgrounds |
| `bg-elevated` | `#252527` | Elevated elements, inputs |
| `bg-hover` | `#2E2E34` | Hover states |
| `accent` | `#16C284` | Primary brand (green) |
| `success` | `#5BD197` | Buy/positive/green text |
| `danger` | `#FD5E67` | Sell/negative/red text |
| `warning` | `#FB923C` | In-progress/orange |
| `info` | `#60A5FA` | Info/blue |
| `text-primary` | `#F9F9FA` | Main text (white) |
| `text-secondary` | `#B4B4BA` | Secondary text |
| `text-muted` | `#7A7A83` | Muted/tertiary text |
| `border-subtle` | `#1B1B1C` | Table row borders |
| `border-default` | `#2E2E34` | Default borders |

### Font Size Scale

`text-10` through `text-48`, each with explicit lineHeight. Most used: `text-12` (labels), `text-14` (body/table cells), `text-20` (headings).

### Animations

`shimmer`, `slide-in/out`, `fade-in`, `scale-in`, `dropdown-in`, `backdrop-in`, `modal-in` — all with custom keyframes and timing.

---

## 8. Key Inline Components (in LandingPage.tsx)

These are NOT in `src/components/` — they are defined inline at the top of LandingPage.tsx:

| Component | Description |
|-----------|-------------|
| `TOKEN_LOGOS` | `Record<string, string>` mapping ticker → imported image (SKATE, ERA, GRASS, LOUD, MMT, ZBT) |
| `CHAIN_LOGOS` | `Partial<Record<network, string>>` — chain badge images (ethereum, solana, bnb) |
| `CHAIN_BG_CLASS` | `Record<network, string>` — fallback bg colors for chains without logos (incl. `sui: 'bg-[#4DA2FF]'`) |
| `NetworkBadge` | 16x16 rounded chain indicator, absolute-positioned bottom-left of token logo |
| `ChangeTag` | Colored percentage change display (+green/-red) |
| `TokenDot` | Colored circle with first letter, used when no real token image exists |
| `SharkIcon` | Custom shark SVG icon for collateral column |
| `TableSortIcon` | Sort direction indicator (up/down arrows), synced to Figma node 35281:21856 |
| `TabBadge` | Active (green bg) / inactive (dark bg) counter badge |

---

## 9. Key Patterns & Conventions

### Imports
- Always use `@/` alias (configured in vite.config.ts + tsconfig.json)
- Never relative paths like `../../../`

### Image assets
- Token logos: `import tokenXxxImg from '@/assets/images/token-xxx.png'`
- Chain logos: `import chainXxxImg from '@/assets/images/chain-xxx.png'`
- Referenced via `TOKEN_LOGOS` / `CHAIN_LOGOS` maps

### Figma reference comments
- Every section has Figma node ID comments: `// Figma node 42532:726450`
- Specific measurements noted: `// 14px/500/#F9F9FA`

### Table pattern
- `table-fixed` with percentage-based `style={{ width }}` on `<th>` or `<colgroup>`
- Left-aligned first column (Token), right-aligned data columns
- Rows: `border-b border-border-subtle hover:bg-white/[0.02] cursor-pointer`
- Sort: `useState<SortKey>` + `useState<'asc'|'desc'>` + `useMemo` for sorted data

### No bare `/* */` comments inside JSX ternaries
- Babel/Vite parser is stricter than TypeScript
- Bare comments inside `? :` branches cause "Adjacent JSX elements" parse errors
- Always wrap in `<>...</>` or put comments outside the ternary

### Async simulation
- All submit actions: `setTimeout(resolve, 800-1500ms)` + loading state
- 10% random failure rate for realism

---

## 10. WalletModal Flow (Figma 42670:317711)

1. Navbar "Connect Wallet" button → opens modal
2. Select network tab (Solana default, also Ethereum + 4 others)
3. Choose wallet (Backpack, Phantom, Solflare, etc.)
4. 1000ms loading simulation → "Connected: 0x1a2b...9a0b"
5. Navbar shows truncated address + avatar
6. Click avatar → dropdown: Copy address, View on explorer, Disconnect

---

## 11. Other Pages (brief)

### MarketDetailPage (`/market/:id`)
- 2-column layout: Listing info (left 60%) + Action panel (right 40%)
- Order book with buy/sell sides
- Trade form: price, amount, total auto-calc, fee display
- Confirm modal → loading → success toast

### MarketListPage (`/market`)
- Grid of market cards with search input
- Filter dropdown for categories
- Cards link to `/market/:id`

### PortfolioPage (`/portfolio`)
- 4 stat cards (Total Value, Active Orders, Completed, P&L)
- Tabs: My Orders | Trade History
- Tables with status badges and P&L coloring

### CreateListingPage (`/create`)
- Form: token dropdown, buy/sell toggle, price, amount, expiry
- Auto-calculated total value
- Validation: inline errors on blur/submit
- Preview modal → confirm → toast → redirect to `/market`

### ProfilePage (`/profile`)
- Avatar + wallet address (copy button)
- Editable username (inline edit + save)
- Stats: total trades, total volume, member since

---

## 12. Known Technical Gotchas

1. **Babel JSX parse errors** — bare `/* */` comments inside ternary branches will crash Vite. Always remove or wrap them.

2. **Vite cached errors** — after fixing source, sometimes need to stop and restart the dev server for changes to take effect.

3. **TableSortIcon type flexibility** — uses `string` props (not union types) so it works across different sort key types (SortKey, UpcomingSortKey) without casting.

4. **Preview tool viewport** — defaults to narrow width. Must explicitly resize to 1440x900 for desktop verification.

5. **Preview screenshot** — sometimes fails with "Current display surface not available". Workaround: `preview_eval` with `window.location.replace()` then retry.

6. **Network type union** — any new network (e.g. `'sui'`) must be added to `HomeMarket['network']` union type in homeData.ts AND to `CHAIN_BG_CLASS` in LandingPage.tsx.

---

## 13. Assets Not Yet In Project

Investor avatar images uploaded by user (in Downloads, not yet copied):
- `/Users/sophie/Downloads/investor1.png`
- `/Users/sophie/Downloads/invest2.png`
- `/Users/sophie/Downloads/invest3.png`
- `/Users/sophie/Downloads/invest4.png`
- `/Users/sophie/Downloads/invest5.png`

These should be copied to `src/assets/images/` and used for the Investors & Backers column in the Upcoming tab.

---

## 14. Figma Quick Reference

| What | Figma Node |
|------|-----------|
| Live Market table | `42532:726327` |
| Upcoming tab table | `42540-727391` |
| Recent Trades | `42532:726450` |
| Bottom Stats | `42532:726513` |
| Network filter dropdown | `38214:311363` |
| Connect Wallet modal | `42670:317711` |
| Sort icon component | `35281:21856` |
| Foundation / Typography | `18610:2231` |
| Foundation / Radius | `31281:58553` |
| Foundation / Shadow | `31282:57431` |

Figma URL pattern: `https://www.figma.com/design/mrTOtq806N1EFg8NOnsj99/WhalesMarket-v2--Sophie-code-?node-id=XXXX-XXXXX`

---

## 15. How to Continue

1. Read this file + `CLAUDE.md` (project rules)
2. Run `npm run dev` to verify clean start
3. Check pending work in Section 6 (Upcoming Tab)
4. Use Figma MCP tools to fetch exact design specs when needed
5. Always reference Figma node IDs in code comments
6. Never use raw hex inline — register in `tailwind.config.ts` or use existing tokens
7. Test at 1440px desktop width via preview tool
