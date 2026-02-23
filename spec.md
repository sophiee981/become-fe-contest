# spec.md — Product Specification: Whales Market (Become FE)

> Source of truth: **Figma design** (Whales Market).
> This spec defines scope, page structure, UI system, mock data schema, and build roadmap.
> Every requirement here maps directly to Figma frames.

---

## 1. Product Overview

**Whales Market** is a decentralized OTC (Over-The-Counter) trading platform that allows users to buy and sell pre-market tokens, points, and allocations — directly peer-to-peer without a centralized exchange.

### Core User Actions
1. Browse available markets (token listings)
2. View a specific market's order book and trading history
3. Place buy/sell orders (fill a form, confirm, submit)
4. View and manage their own open orders / trade history
5. Connect wallet (mock) / view portfolio

### Pages to Build (Priority Order)

| Priority | Page | Route | Description |
|----------|------|-------|-------------|
| P0 | Landing / Home | `/` | Hero, featured markets, stats |
| P0 | Market List | `/market` | All token markets, search, filter, sort |
| P0 | Market Detail | `/market/:id` | Order book, trade form, history |
| P1 | Portfolio | `/portfolio` | User's open orders + trade history |
| P1 | Points Market | `/points` | Points-specific market list |
| P2 | Profile | `/profile` | Wallet info, settings (mock) |
| P2 | 404 | `*` | Not found page |

---

## 2. UI Design System

> ⚠️ Values below are **placeholders**. Extract exact values from Figma via MCP before coding.
> Replace every `FIGMA:xxx` tag with the real value from Figma.

### 2.1 Color Tokens

Register all in `tailwind.config.ts → theme.extend.colors`:

```ts
colors: {
  // Backgrounds
  'bg-base':      'FIGMA:page-background',     // darkest bg, page canvas
  'bg-surface':   'FIGMA:card-background',     // card, panel bg
  'bg-elevated':  'FIGMA:elevated-background', // dropdown, tooltip bg
  'bg-hover':     'FIGMA:hover-state-bg',      // row hover, item hover

  // Brand / Accent
  'accent':       'FIGMA:primary-green',       // CTA buttons, links, active states
  'accent-dim':   'FIGMA:primary-green-10%',   // accent bg with low opacity

  // Semantic
  'buy':          'FIGMA:buy-color',           // green, buy orders
  'sell':         'FIGMA:sell-color',          // red, sell orders
  'success':      'FIGMA:success-color',
  'warning':      'FIGMA:warning-color',
  'danger':       'FIGMA:danger-color',

  // Text
  'text-primary':    'FIGMA:text-primary',     // main content
  'text-secondary':  'FIGMA:text-secondary',   // labels, subtitles
  'text-muted':      'FIGMA:text-muted',       // disabled, placeholder
  'text-inverse':    'FIGMA:text-on-accent',   // text on colored bg

  // Border
  'border-default':  'FIGMA:border-color',
  'border-active':   'FIGMA:border-active',    // focused input, selected card
}
```

### 2.2 Typography Scale

Register in `tailwind.config.ts → theme.extend.fontSize`:

```ts
// Extract from Figma. Common DeFi app scales:
fontSize: {
  'xs':  ['FIGMA:xs-size',  { lineHeight: 'FIGMA:xs-lh',  letterSpacing: 'FIGMA:xs-ls'  }],
  'sm':  ['FIGMA:sm-size',  { lineHeight: 'FIGMA:sm-lh'  }],
  'base':['FIGMA:base-size',{ lineHeight: 'FIGMA:base-lh'}],
  'lg':  ['FIGMA:lg-size',  { lineHeight: 'FIGMA:lg-lh'  }],
  'xl':  ['FIGMA:xl-size',  { lineHeight: 'FIGMA:xl-lh'  }],
  '2xl': ['FIGMA:2xl-size', { lineHeight: 'FIGMA:2xl-lh' }],
  '3xl': ['FIGMA:3xl-size', { lineHeight: 'FIGMA:3xl-lh' }],
}
fontFamily: {
  sans: ['FIGMA:primary-font', 'sans-serif'],
}
fontWeight: {
  regular:    '400',
  medium:     '500',
  semibold:   '600',
  bold:       '700',
}
```

### 2.3 Spacing Scale

```ts
spacing: {
  // Add all non-standard values found in Figma
  // e.g. if Figma uses 6px gap → add '1.5': '6px'
  // e.g. if Figma uses 18px padding → add '4.5': '18px'
}
```

### 2.4 Border Radius

```ts
borderRadius: {
  'sm':  'FIGMA:radius-sm',   // tags, badges
  'md':  'FIGMA:radius-md',   // inputs, buttons
  'lg':  'FIGMA:radius-lg',   // cards
  'xl':  'FIGMA:radius-xl',   // modals
  'full':'9999px',            // pills, avatars
}
```

### 2.5 Shadows

```ts
boxShadow: {
  'card':  'FIGMA:card-shadow',
  'modal': 'FIGMA:modal-shadow',
  'glow':  'FIGMA:accent-glow-shadow',
}
```

---

## 3. Page Specifications

---

### PAGE 1: Landing / Home (`/`)

**Goal:** First impression. Show the platform's value, drive to market page.

#### Sections (top to bottom)
1. **Navigation Bar** — logo, nav links, wallet connect button
2. **Hero Section** — headline, subtext, CTA buttons, maybe animated stats
3. **Stats Bar** — total volume, total trades, active markets (mock numbers)
4. **Featured Markets** — horizontal scroll cards or grid of top 4–6 markets
5. **How It Works** — 3-step explainer (mock content)
6. **Footer** — links, social icons

#### Components Required
- `<Navbar />` — logo, nav links (Market, Points, Portfolio), `<WalletButton />`
- `<HeroSection />` — headline + CTA
- `<StatCard />` — reusable: label + value
- `<MarketCard />` — token logo, name, price, 24h change, volume
- `<Footer />`

#### States & Interactions
- Nav links: hover state, active page highlight
- CTA button: hover + click → navigate to `/market`
- Wallet button: click → open mock wallet modal (show fake connected state)
- Market card: click → navigate to `/market/:id`

#### Mock Data Needed
```ts
// Landing page stats
{ totalVolume: '$124,500,000', totalTrades: '48,302', activeMarkets: 64 }

// Featured markets (reuse from market mock data — top 6)
```

---

### PAGE 2: Market List (`/market`)

**Goal:** Display all available trading markets. Allow search, filter, sort.

#### Sections
1. **Page Header** — title, total market count
2. **Filter/Sort Bar** — search input, category tabs (All / Pre-market / Points / Allocation), sort dropdown (Volume, Price, Change)
3. **Market Table / Grid** — list of all markets
4. **Pagination** — if more than 20 items

#### Components Required
- `<SearchInput />` — controlled, filters table on type
- `<CategoryTabs />` — All | Pre-market | Points | Allocation (tab switch)
- `<SortDropdown />` — sort by: Volume ↓, Price ↓, Change ↓
- `<MarketTable />` — table with columns (see below)
- `<MarketRow />` — single row component

#### Market Table Columns
| Column | Data | Sortable |
|--------|------|----------|
| # | rank | — |
| Token | logo + name + ticker | — |
| Price | current price USD | ✓ |
| 24h Change | % change, colored green/red | ✓ |
| 24h Volume | USD | ✓ |
| Market Cap | USD | ✓ |
| Action | "Trade" button | — |

#### States & Interactions
- Search: filter rows by token name or ticker as user types (debounce 300ms)
- Category tabs: filter rows by category
- Sort: click column header → toggle asc/desc → update sort icon
- "Trade" button: navigate to `/market/:id`
- Empty state: "No markets found" message when search returns 0 results
- Row hover: subtle background highlight

#### Mock Data
```ts
// src/mock-data/markets.ts
interface Market {
  id: string
  rank: number
  token: string           // 'WEN'
  name: string            // 'Wen'
  logo: string            // path or placeholder
  category: 'pre-market' | 'points' | 'allocation'
  price: number           // 0.0042
  change24h: number       // +12.5 (percent)
  volume24h: number       // 1240000
  marketCap: number       // 4200000
  status: 'active' | 'closed'
}
// Minimum 20 market entries
```

---

### PAGE 3: Market Detail (`/market/:id`)

**Goal:** The core trading page. Users see order book, place trades, view history.

#### Layout (3-column or 2-column based on Figma)
```
[Token Info Header]
[Order Book] | [Trade Form] | [Recent Trades]
[My Open Orders Table]
```

#### Sections

**3.1 Token Info Header**
- Token logo, name, ticker
- Current price, 24h change (green/red)
- Stats: 24h volume, total volume, total trades, floor price, market cap

**3.2 Order Book**
- Two columns: Buy orders (green) | Sell orders (red)
- Each row: Price | Amount | Total
- Headers with column labels
- "Spread" indicator between buy/sell
- Scrollable list (show 10-15 rows each side)

**3.3 Trade Form**
- Tab switch: [Buy] | [Sell]
- Fields: Price input, Amount input, Total (auto-calculated)
- "Max" button on Amount field
- Summary: fee, you receive/pay
- Submit button: "Place Buy Order" / "Place Sell Order"
- Validation: empty fields → show error, invalid numbers → show error

**3.4 Recent Trades**
- Table: Time | Price | Amount | Type (Buy/Sell)
- Auto-populated from mock data
- Buy rows: green text on price, Sell rows: red

**3.5 My Open Orders**
- Table: Token | Type | Price | Amount | Filled | Status | Action
- "Cancel" button per row → remove from list (optimistic update)
- Empty state if no orders: "No open orders"

#### States & Interactions

| Element | Behavior |
|---------|----------|
| Buy/Sell tab | Switch form color theme + button label |
| Price input | Numeric only, update Total on change |
| Amount input | Numeric only, update Total on change |
| "Max" button | Fill amount with max mock balance |
| Total field | Read-only, auto = price × amount |
| Submit button | Loading state 1.5s → success toast → add to My Orders |
| Cancel order | Confirmation? → remove row → success toast |
| Order book row click | Fill price input with clicked price |

#### Mock Data
```ts
// src/mock-data/orderBook.ts
interface OrderBookEntry {
  price: number
  amount: number
  total: number
  type: 'buy' | 'sell'
}

// src/mock-data/trades.ts
interface Trade {
  id: string
  price: number
  amount: number
  type: 'buy' | 'sell'
  timestamp: string
}

// src/mock-data/myOrders.ts
interface MyOrder {
  id: string
  marketId: string
  token: string
  type: 'buy' | 'sell'
  price: number
  amount: number
  filled: number        // 0–100 percent
  status: 'open' | 'partial' | 'filled' | 'cancelled'
  createdAt: string
}
```

---

### PAGE 4: Portfolio (`/portfolio`)

**Goal:** User's personal trading activity.

#### Sections
1. **Summary Stats** — Total Value, PnL, Active Orders, Completed Trades
2. **Tab Switch** — [Open Orders] | [Trade History]
3. **Open Orders Table** — same schema as market detail's My Orders
4. **Trade History Table** — completed trades

#### Trade History Columns
| Column | Data |
|--------|------|
| Date | formatted timestamp |
| Market | token name + logo |
| Type | Buy / Sell badge |
| Price | entry price |
| Amount | quantity |
| Total | USD value |
| PnL | profit/loss (green/red) |
| Status | Completed / Cancelled badge |

#### States & Interactions
- Tab switch: Open Orders ↔ Trade History
- Cancel order in Open Orders tab → remove row + update stats
- Sort by Date (default: newest first)
- Empty state for both tabs

---

### PAGE 5: Points Market (`/points`) — P1

**Goal:** Same structure as Market List but filtered to "Points" category markets.

- Reuse `<MarketTable />` and `<MarketRow />`
- Filter pre-applied: category = 'points'
- May have different columns or additional "Points" specific info (verify in Figma)

---

## 4. Shared Components

### 4.1 UI Primitives (`src/components/ui/`)

| Component | Props | States |
|-----------|-------|--------|
| `Button` | variant, size, loading, disabled, icon, onClick | default, hover, active, disabled, loading |
| `Input` | label, placeholder, value, onChange, error, prefix, suffix | default, focus, error, disabled |
| `Badge` | label, variant (success/danger/warning/info/neutral) | — |
| `Modal` | isOpen, onClose, title, children | open, closed, closing animation |
| `Tabs` | tabs[], activeTab, onChange | active, hover |
| `Dropdown` | options[], selected, onChange, placeholder | open, closed, option hover |
| `Toast` | message, type (success/error), duration | enter, visible, exit animation |
| `Spinner` | size | — |
| `Avatar` | src, size, fallback | — |
| `Tooltip` | content, children | show on hover |
| `Skeleton` | width, height | animated shimmer |

### 4.2 Layout Components (`src/components/layout/`)

| Component | Description |
|-----------|-------------|
| `Navbar` | Top navigation, wallet button, active link |
| `Footer` | Links, socials, copyright |
| `PageWrapper` | Max-width container, consistent padding |
| `WalletModal` | Mock wallet connect modal |

---

## 5. Mock Data Schemas

### Summary of all mock data files

```
src/mock-data/
├── markets.ts          # 20+ Market entries
├── orderBook.ts        # Buy/sell orders for each market
├── recentTrades.ts     # Last 20 trades per market
├── myOrders.ts         # 5-10 open orders (user)
├── tradeHistory.ts     # 10-20 completed trades (user)
├── portfolio.ts        # Portfolio summary stats
└── user.ts             # Mock user: wallet address, balance
```

### Mock User
```ts
// src/mock-data/user.ts
export const mockUser = {
  address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  displayAddress: '0x1a2b...9a0b',
  balance: {
    USDC: 10000,
    ETH: 2.5,
  },
  joined: '2024-01-01',
}
```

---

## 6. Build Roadmap

### Phase 0 — Setup (Day 1)
- [ ] Init Vite + React + TypeScript project
- [ ] Install and configure Tailwind CSS v3
- [ ] Extract design tokens from Figma (colors, fonts, spacing, radius)
- [ ] Configure `tailwind.config.ts` with all extracted tokens
- [ ] Install dependencies: `react-router-dom`, `lucide-react` (icons), `clsx`, `tailwind-merge`
- [ ] Setup folder structure as defined in Architecture section
- [ ] Create `PageWrapper`, `Navbar`, `Footer` shell
- [ ] Setup React Router with all page routes (render placeholder pages)
- [ ] Verify `npm run dev` → all routes navigable

### Phase 1 — Core Pages (Day 2)
- [ ] Build all mock data files (complete, typed)
- [ ] Build UI primitives: `Button`, `Badge`, `Input`, `Tabs`
- [ ] **Landing page** — all sections, real mock data, interactive cards
- [ ] **Market List page** — full table, search (working), category tabs (working), sort (working)
- [ ] **Market Detail page** — order book (populated), trade form (functional), recent trades
- [ ] Verify navigation between all pages works
- [ ] Push to GitHub: `"Day 2 - core pages done"`

### Phase 2 — Logic + Detail (Day 3 Morning)
- [ ] Trade form: full validation, loading state, submit → add to myOrders
- [ ] Order cancel: remove from list + toast feedback
- [ ] All table sorts working
- [ ] Search debounced correctly
- [ ] Wallet modal (mock connect/disconnect flow)
- [ ] `Modal` component with ESC close + overlay click close
- [ ] `Toast` notification system
- [ ] **Portfolio page** — open orders + trade history tabs, working cancel
- [ ] Empty states for all tables

### Phase 3 — Polish + Pixel (Day 3 Afternoon)
- [ ] Pixel audit: open Figma side-by-side, check every page
  - [ ] Colors match exactly (use color picker)
  - [ ] Font size, weight, line-height match
  - [ ] Spacing: padding, margin, gap match
  - [ ] Border radius matches
  - [ ] Shadows/effects match
- [ ] Add hover states to all interactive elements
- [ ] Add transitions: `transition-all duration-150` minimum
- [ ] Responsive: test at 375px mobile, 768px tablet, 1280px desktop
- [ ] Fix any overflow or layout break at small screens
- [ ] Remove all `console.log`
- [ ] Check for TypeScript errors: `tsc --noEmit`
- [ ] Check browser console: zero errors
- [ ] Push to GitHub: `"Day 3 - polish and interactions done"`

### Phase 4 — Demo Prep (Day 4)
- [ ] Full walkthrough of demo flow (practice 3x)
- [ ] Demo script:
  1. Landing → walk through hero + stats + featured markets
  2. Click market → Market List → demonstrate search + filter + sort
  3. Click trade → Market Detail → show order book, place order (form submit)
  4. Navigate to Portfolio → show order appeared, cancel it
  5. Show responsive: resize to mobile
- [ ] Figma side-by-side comparison ready
- [ ] AI Showcase screenshots ready (min 3–5)
- [ ] GitHub repo public, link confirmed

---

## 7. Pre-Launch Checklist

### Functional
- [ ] `npm run dev` starts with zero errors
- [ ] All 5+ routes navigable
- [ ] Zero dead buttons or links
- [ ] Search filters data correctly
- [ ] Category tabs filter data correctly
- [ ] Table sort works (asc/desc toggle)
- [ ] Trade form validates inputs
- [ ] Trade form submit → success state → order added
- [ ] Cancel order → order removed → toast shown
- [ ] Wallet connect modal opens and closes
- [ ] Modal closes on ESC and overlay click
- [ ] All mock data displayed (no empty screens)

### Design Fidelity
- [ ] Background colors match Figma on all pages
- [ ] Text colors match Figma (primary, secondary, muted)
- [ ] Button colors: accent/buy/sell match exactly
- [ ] Font family matches Figma
- [ ] Font sizes and weights match
- [ ] Card/panel padding match Figma
- [ ] Gap/spacing between elements match Figma
- [ ] Border colors and radius match Figma
- [ ] Icon sizes and colors match Figma
- [ ] Logo displayed correctly

### Quality
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] No console errors in browser
- [ ] No console warnings (or all are acknowledged)
- [ ] Responsive at 375px: no horizontal overflow, content readable
- [ ] Responsive at 768px: layout adapts correctly
- [ ] GitHub repo public with all commits pushed
- [ ] Commit history shows daily progress

---

## 8. Scope Cuts (if behind schedule)

If time is tight, cut in this order (lowest priority first):

1. ~~Profile page~~ — skip entirely
2. ~~Points Market page~~ — reuse Market page with pre-filter
3. ~~Pagination~~ — show all items, remove pagination
4. ~~Animations/transitions~~ — keep interactions, remove animations
5. ~~Responsive~~ — desktop-only is acceptable at minimum level
6. ~~Trade history PnL~~ — show 0 or static number

**Never cut:**
- ✅ Core 3 pages: Landing, Market List, Market Detail
- ✅ Working trade form (validation + submit)
- ✅ Working search and filter
- ✅ Pixel-accurate colors and typography

---

*Design is the spec. Figma is law. Ship it.*
