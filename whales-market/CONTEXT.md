# CONTEXT.md — Whales Market Session Handoff

> File for AI session continuity. Read this **before** touching any code.
> Last updated: **2026-02-26** (session 4: realtime simulation, TS build fix, Vercel deploy)

## 0. Live Deployment

| | |
|---|---|
| **Vercel URL** | **https://become-fe-contest.vercel.app/** |
| Auto-deploy | Every push to `main` triggers redeploy |

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
| Dev command | `npm run dev` → binds to `http://127.0.0.1:5173` |
| **Vercel** | **https://become-fe-contest.vercel.app/** |

---

## 2. Git History (chronological)

```
7c0cacb  Add files via upload
1a4e3c4  Day 1 - add CLAUDE.md and spec.md
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
74fde4f  Add Ended tab with 8 ended markets table, sort, skeleton loading
f242f1a  Fix Ended tab columns per Figma node 42540-728736
2b01478  Remove Collateral Token column from Ended tab
7c792ef  Add MarketDetailV2Page with route /market-v2/:id
2105485  Update CONTEXT.md with MarketDetailV2Page docs
533c539  Rewrite Connect Wallet modal per Figma node 38214-314593
e5e9da9  Remove back button from WalletModal header, keep only close button
161bfc0  Fix tab badges per Figma + update Ended tab mock data with real token images
6055c87  Recent Trades: remove amount token icon, add USDC/USDT + animal icons to collateral col
0fce26d  Market Detail V2 — market header pixel-perfect per Figma
2cc31c2  Add MyDashboard page and mock data
be1feec  Fix: bind Vite dev server to 127.0.0.1 to resolve connection refused
e1ec743  Landing: realtime chart + live trade stream simulation
79d5e9b  Fix TypeScript build errors for Vercel deploy
236525b  Add vercel.json for SPA routing (★ LIVE on Vercel)
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
│   ├── token-skate.png         # Token logos (Live Market)
│   ├── token-era.png
│   ├── token-grass.png
│   ├── token-loud.png
│   ├── token-mmt.png
│   ├── token-zbt.png
│   ├── token-tia.png           # Token logos (Ended tab)
│   ├── token-strk.png
│   ├── token-op.png
│   ├── token-arb.png
│   ├── token-render.png
│   ├── usdc-icon.png           # USDC logo (collateral col in Recent Trades)
│   ├── skate-logo.png
│   ├── solana-logo.png
│   ├── fee-icon.png
│   ├── investor1-5.png         # Investor avatar images (Upcoming tab backers col)
│   ├── logo-phantom.png        # Wallet logos (WalletModal)
│   ├── logo-solflare.png
│   ├── logo-aptos.png
│   ├── logo-evm.png
│   ├── logo-solana.png
│   ├── logo-starknet.png
│   ├── logo-sui.png
│   └── logo-ton.png
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav, wallet btn, avatar dropdown
│   │   ├── Footer.tsx
│   │   ├── PageWrapper.tsx     # max-w-[1280px] mx-auto wrapper
│   │   └── WalletModal.tsx     # Connect wallet modal — rewritten per Figma 38214:314593
│   └── ui/
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Tabs.tsx
│       ├── Toast.tsx           # ToastProvider context + useToast hook
│       ├── Spinner.tsx
│       ├── Skeleton.tsx
│       ├── EmptyState.tsx
│       └── icons/
│           └── DownFillIcon.tsx
├── pages/
│   ├── LandingPage.tsx         # (1587 lines) ★ MAIN PAGE — details in Section 5
│   ├── MarketListPage.tsx      # Market grid + search/filter
│   ├── MarketDetailPage.tsx    # OLD Market Detail (order book + trade form + confirm modal)
│   ├── MarketDetailV2Page.tsx  # (472 lines) ★ NEW Market Detail V2 — header pixel-perfect
│   ├── MyDashboardPage.tsx     # (1011 lines) ★ NEW Dashboard page at /dashboard
│   ├── PortfolioPage.tsx
│   ├── CreateListingPage.tsx
│   ├── ProfilePage.tsx
│   ├── PointsPage.tsx          # Stub
│   └── NotFoundPage.tsx
├── router/index.tsx            # Route definitions
├── mock-data/
│   ├── homeData.ts             # Landing page data (markets, trades, upcoming, stats, metrics)
│   ├── dashboardData.ts        # (153 lines) NEW — dashboard page mock data
│   ├── markets.ts
│   ├── orderBook.ts
│   ├── myOrders.ts
│   ├── recentTrades.ts
│   ├── tradeHistory.ts
│   ├── portfolio.ts
│   └── user.ts
├── constants/
│   └── ui.ts                   # MODAL_SHADOW = '0 0 32px rgba(0,0,0,0.2)'
├── types/
│   ├── market.ts
│   ├── order.ts
│   ├── user.ts
│   ├── filter.ts
│   └── portfolio.ts
├── hooks/
│   └── useToast.ts
└── utils/                      # (empty — reserved)
```

---

## 4. Route Map

| Route | Page | Status |
|-------|------|--------|
| `/` | LandingPage | ★ Most polished, 1587 lines |
| `/market` | MarketListPage | Functional |
| `/market/:id` | MarketDetailPage (OLD) | Functional |
| `/market-v2/:id` | MarketDetailV2Page | ★ Market header pixel-perfect, sections pending |
| `/dashboard` | MyDashboardPage | ★ NEW — skeleton done, needs polish |
| `/portfolio` | PortfolioPage | Functional |
| `/create` | CreateListingPage | Functional |
| `/profile` | ProfilePage | Functional |
| `/points` | PointsPage | Stub |
| `*` | NotFoundPage | Simple 404 |

---

## 5. LandingPage.tsx — Deep Breakdown (1587 lines)

### Section Architecture (top to bottom)

| # | Component | Description |
|---|-----------|-------------|
| 0 | Helpers | `fmtPrice()`, `fmtVol()`, `ChangeTag`, `getUTCTimeStr()` |
| 1 | Token/Chain maps | `TOKEN_LOGOS` (SKATE/ERA/GRASS/LOUD/MMT/ZBT + TIA/STRK/OP/ARB/RENDER), `CHAIN_LOGOS`, `CHAIN_BG_CLASS` |
| 2 | `NetworkBadge` | 16x16 chain badge, absolute bottom-left of token logo |
| 3 | `TabBadge` | **Fixed** per Figma: h=20px, px=8px, py=4px, 10px/500, active=#16C284, inactive=#252527 |
| 4 | `PremarketChart` | SVG line chart with area gradient + draw animation |
| 5 | `FearGreedGauge` | Semicircle gauge (pink→orange→green arc + white dot) |
| 6 | `TopMetrics` | 4-card grid: Pre-market Vol, Fear & Greed, Altcoin Season, Next Settlement |
| 7 | `UpcomingSection` | Featured upcoming carousel (hidden/unused) |
| 8 | SVG Icons | `Filter2FillIcon`, `MindMapFillIcon`, `TableSortIcon`, `SkeletonRow` |
| 9 | `UpcomingTabContent` | Upcoming tab table (5 cols) |
| 10 | `LiveMarketTable` | Tab bar (Live/Upcoming/Ended) + search + network filter + table |
| 11 | Animal + collateral icons | `SharkIcon`, `WhaleIcon`, `ShrimpIcon`, `UsdtIcon`, `CollateralTokenIcon`, `AnimalIcon`, `TokenDot`, `ArrowRightUpFillIcon` |
| 12 | `RecentTradesTable` | 7-col trade table — **Amount col: text only; Collateral col: token image + animal icon** |
| 13 | `BottomStats` | LIVE DATA + Total Vol + Vol 24h + links + social icons |
| 14 | `LandingPage` | Root: TopMetrics → LiveMarketTable → RecentTradesTable → BottomStats |

### Recent Trades — Current State (DONE ✅)

**Amount column**: text only, no token icon.

**Collateral column**: `[amount text] [CollateralTokenIcon] [AnimalIcon]`
- `CollateralTokenIcon`: USDC → `usdc-icon.png` image, USDT → inline SVG `UsdtIcon` (#26A17B), others → `TokenDot`
- `AnimalIcon`: shark → `SharkIcon` (#0A71CD blue + #0A0A0B eye), whale → `WhaleIcon` (#27C9D8 cyan), shrimp → `ShrimpIcon` (#FF8F3C orange)

**HomeRecentTrade interface** (in homeData.ts):
```ts
export interface HomeRecentTrade {
  id: string; timeAgo: string; side: 'buy' | 'sell'; isRS: boolean;
  pair: string; baseToken: string; price: number;
  amount: string; collateral: string;
  collateralToken: 'USDC' | 'USDT' | 'SOL';
  animal: 'shark' | 'whale' | 'shrimp';
  txId: string;
}
```

Animal assignments per Figma: rt-1=shark, rt-2=whale, rt-3→rt-8=shark, rt-9→rt-10=shrimp.

**⚠️ PENDING**: SVG path shapes for animal icons are approximations (hand-crafted). Reference screenshots of exact Figma shapes saved at `/tmp/figma_icons_scaled.png`. Colors are confirmed correct: shark=#0A71CD, whale=#27C9D8, shrimp=#FF8F3C.

### Ended Tab — Current State (DONE ✅)

4 items only (for demo): TIA (Celestia), STRK (Starknet), OP (Optimism), ARB (Arbitrum).
All with real token images from `src/assets/images/`.

### Tab Badges — Fixed ✅

```tsx
// Figma: h=20px | px=8px py=4px | r=9999 | 10px/500/lh-12px
active: bg-[#16c284] text-[#f9f9fa]
inactive: bg-[#252527] text-[#b4b4ba]
```

### LiveMarketTable tabs

- **Live Market** — `mockHomeMarkets` (6 items), sortable, network filter dropdown
- **Upcoming** — `<UpcomingTabContent />` (5-col table)
- **Ended** — `mockEndedMarkets` (4 items, TIA/STRK/OP/ARB)

---

## 6. Upcoming Tab — Current State

### Table Structure (Figma node 42540-727391)

| Col | Width | Content |
|-----|-------|---------|
| Token | 42% | Logo (44x44) + NetworkBadge + ticker + name + NEW MARKET badge |
| Watchers | 14% | Formatted number |
| Investors & Backers | 15% | Avatar stack (20x20, -6px overlap) + overflow badge |
| Narrative | 14% | Pill badges |
| Moni Score | 15% | Progress bar (120x4px) + white dot + numeric score |

### Investor Avatar Images ✅

Images are now in `src/assets/images/investor1.png` through `investor5.png`.
**Status**: images are in the project but may not yet be wired into `mockUpcomingListings` — verify in code.

### PENDING WORK

1. **Wire investor avatar images** into `mockUpcomingListings` in `homeData.ts`
2. **Fix Moni Score** to match exact Figma component (node 42540-727391)
3. **Update mock data** values to match Figma exactly

---

## 7. WalletModal — Rewritten ✅ (Figma 38214:314593)

Flow:
1. Navbar "Connect Wallet" → open modal (no back button, only X close)
2. Select network tab (Solana default, also Ethereum + 4 others)
3. Choose wallet (Backpack, Phantom, Solflare, etc. — real logos from assets)
4. 1000ms loading → "Connected: 0x1a2b...9a0b"
5. Navbar shows truncated address + avatar
6. Click avatar → dropdown: Copy address, View on explorer, Disconnect

---

## 8. MarketDetailV2Page — `/market-v2/:id` (472 lines)

### Layout Frame

Body container: `max-w-[1440px]` centered, inner `px-4` = 1376px content area.

### Section Status

| Section | Status |
|---------|--------|
| Breadcrumb | ✅ Built — Whales.Market > Pre-market > SKATE + "Delivery Scenarios" link |
| Market Header | ✅ Pixel-perfect — token info (SKATE, $0.0045, stats) + buttons |
| Left Column frame | ✅ Frame — placeholder blocks |
| Right Column frame | ✅ Frame — placeholder blocks |
| Bottom Stats | ✅ Built |

### Market Header Details

**Left — token-info:** Logo + chain badge + "SKATE" (18/500) + "Skate Chain" (12/400/#7A7A83) + price + change + stats (24h Vol, Total Vol, Countdown pill)

**Right — buttons:** "About Skate" dropdown | "Airdrop Checker" | "Earn 50% Fee" | More icon | Divider | "Create Order" (bg #000)

### PENDING WORK — Sections to Build (in order)

1. **Chart section** (Figma 37315:161696) — 928x424
2. **Order Book table** (Figma 37315:161694) — 928x742
3. **Recent Trades table** (Figma 37315:189288) — 928x532
4. **Trade Panel** (Figma 37692:254729) — 384x456, Buy/Sell form
5. **Price Chart** (Figma 37222:132675) — 384x336
6. **My Orders** (Figma 37225:131293) — 384x608, Filled/Open tabs
7. **Mock data** — order book, trades, user orders

---

## 9. MyDashboardPage — `/dashboard` (1011 lines) ★ NEW

New page added at `/dashboard`. Contains:
- Mock data in `src/mock-data/dashboardData.ts` (153 lines)
- Full page skeleton/structure added
- Needs design review against Figma

---

## 10. Design System (tailwind.config.ts)

### Color Tokens

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
| `text-primary` | `#F9F9FA` | Main text |
| `text-secondary` | `#B4B4BA` | Secondary text |
| `text-muted` | `#7A7A83` | Muted/tertiary text |
| `border-subtle` | `#1B1B1C` | Table row borders |
| `border-default` | `#2E2E34` | Default borders |

### Shared Constants (`src/constants/ui.ts`)

```ts
export const MODAL_SHADOW = '0 0 32px rgba(0,0,0,0.2)'
```

---

## 11. Key Patterns & Conventions

### Imports
- Always use `@/` alias (vite.config.ts + tsconfig.json)

### Image assets
- Token logos: `import tokenXxxImg from '@/assets/images/token-xxx.png'`
- Referenced via `TOKEN_LOGOS` / `CHAIN_LOGOS` maps in LandingPage.tsx

### Figma reference comments
- Every section has Figma node ID: `// Figma node 42532:726450`

### Table pattern
- `table-fixed` + percentage widths on `<th>` / `<colgroup>`
- Left-aligned first column, right-aligned data columns
- Rows: `border-b border-border-subtle hover:bg-white/[0.02] cursor-pointer`

### No bare `/* */` comments inside JSX ternaries
- Causes "Adjacent JSX elements" parse errors in Vite
- Always wrap in `<>...</>` or move outside ternary

### Async simulation
- All submit actions: `setTimeout(resolve, 800–1500ms)` + loading state
- 10% random failure rate

---

## 12. Known Technical Gotchas

1. **Babel JSX parse errors** — bare comments inside ternary branches crash Vite.

2. **Vite IPv6 binding** — macOS Node 18+ resolves `localhost` → `::1`. Fixed in `vite.config.ts` with `server: { host: '127.0.0.1', port: 5173 }`.

3. **TableSortIcon type flexibility** — uses `string` props (not union) so it works across different sort key types without casting.

4. **Preview tool viewport** — defaults narrow. Resize to 1440x900 for desktop verification.

5. **`@fontsource-variable/inter`** — Fixed via `src/vite-env.d.ts` declaring the module. Build now passes `tsc -b` cleanly.

6. **Network type union** — any new network must be added to `HomeMarket['network']` union AND to `CHAIN_BG_CLASS` in LandingPage.tsx.

7. **box-sizing on `<button>`** — macOS Safari/Chrome default `box-sizing: content-box` causes `w-full` + `px-N` to overflow. Always add `box-border` to button elements inside dropdowns.

---

## 13. Figma Quick Reference

| What | Figma Node |
|------|-----------|
| Live Market table (landing) | `42532:726327` |
| Upcoming tab table | `42540:727391` |
| Recent Trades (landing) | `42532:726450` |
| Bottom Stats (landing) | `42532:726513` |
| Network filter dropdown | `38214:311363` |
| Connect Wallet modal | `38214:314593` |
| Sort icon component | `35281:21856` |
| Tab badge component | `42540:728736` |
| Shark icon component | `36017:127255` |
| Whale icon component | `36017:127244` |
| Shrimp icon component | `36017:127247` |
| **Market Detail V2 (full page)** | **`37222:132664`** |
| V2 Market Header | `37222:132669` |
| V2 Left Column | `37315:160537` |
| V2 Right Column | `37222:132673` |
| V2 Trade Panel | `37692:254729` |
| V2 Chart | `37315:161696` |
| V2 Order Book | `37315:161694` |
| V2 Recent Trades | `37315:189288` |
| V2 My Orders | `37225:131293` |
| Foundation / Typography | `18610:2231` |

Figma URL pattern: `https://www.figma.com/design/mrTOtq806N1EFg8NOnsj99/WhalesMarket-v2--Sophie-code-?node-id=XXXX-XXXXX`

---

## 14. Pending Work (priority order)

1. **Animal icons shape fix** — shark/whale/shrimp SVG paths are hand-crafted approximations. Exact Figma screenshots at `/tmp/figma_icons_scaled.png`. Colors confirmed: shark=#0A71CD, whale=#27C9D8, shrimp=#FF8F3C. Node IDs: 36017:127255 / 36017:127244 / 36017:127247.

2. **Upcoming Tab — investor avatars** — images in assets (`investor1-5.png`), need to wire into `mockUpcomingListings.investorAvatars[]` in homeData.ts.

3. **MarketDetailV2Page** — 6 sections to build (Chart, Order Book, Recent Trades, Trade Panel, Price Chart, My Orders). See Section 8.

4. **MyDashboardPage** — needs Figma review and polish.

---

## 15. How to Continue

1. Read this file + `CLAUDE.md`
2. `npm run dev` → `http://127.0.0.1:5173`
3. Key test URLs:
   - `/` — Landing page (main demo page)
   - `/market-v2/skate-001` — Market Detail V2
   - `/dashboard` — My Dashboard
4. Use Figma MCP (configured in `~/.claude/settings.json`) to fetch exact specs
   - File key: `mrTOtq806N1EFg8NOnsj99`
   - Tools: `get_design_context`, `get_screenshot` (via Skill: figma:implement-design)
5. Never use raw hex inline — use existing tailwind tokens or register new ones
6. Test at 1440px desktop width
7. **Do NOT modify CONTEXT.md** during FE work — only update when explicitly requested
