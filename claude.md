# CLAUDE.md — Whales Market (Become FE)

> **This file is the single source of truth for Claude when building this project.**
> Rule #1: Figma is law. When in doubt — read Figma via MCP first, then code.
> Rule #2: No dead UI. Every clickable element must produce visible state change.
> Rule #3: Anchor Page first. Do not scatter. One page done perfectly > five pages done halfway.

---

## 1. Tech Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Framework | React 18 + TypeScript (strict) | No `any`. Ever. |
| Styling | Tailwind CSS v3 | `tailwind.config.ts` is the design system |
| Routing | React Router DOM v6 | `<Link>` only, never `<a href>` |
| State | useState / useContext | No Redux unless 5+ pages share complex state |
| Mock data | `.ts` files in `src/mock-data/` | Typed exports, no inline hardcode in JSX |
| Build | Vite | `npm run dev` must always start clean |

### Setup Commands

```bash
npm create vite@latest whales-market -- --template react-ts
cd whales-market
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom lucide-react clsx tailwind-merge
npm run dev
```

### `tailwind.config.ts` base structure

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ─── EXTRACT FROM FIGMA — replace all FIGMA: values ───
        'bg-base':         'FIGMA:page-background',
        'bg-surface':      'FIGMA:card-background',
        'bg-elevated':     'FIGMA:elevated-bg',
        'bg-hover':        'FIGMA:hover-bg',
        'accent':          'FIGMA:primary-accent',
        'accent-muted':    'FIGMA:accent-10pct-opacity',
        'buy':             'FIGMA:buy-green',
        'sell':            'FIGMA:sell-red',
        'text-primary':    'FIGMA:text-primary',
        'text-secondary':  'FIGMA:text-secondary',
        'text-muted':      'FIGMA:text-muted',
        'border-default':  'FIGMA:border',
        'border-active':   'FIGMA:border-focus',
        'status-success':  'FIGMA:success',
        'status-warning':  'FIGMA:warning',
        'status-danger':   'FIGMA:danger',
        'status-info':     'FIGMA:info',
      },
      fontFamily: {
        sans: ['FIGMA:primary-font', 'Inter', 'sans-serif'],
        mono: ['FIGMA:mono-font', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Extract ALL from Figma type styles
        '10': ['10px', { lineHeight: '14px' }],
        '11': ['11px', { lineHeight: '16px' }],
        '12': ['12px', { lineHeight: '18px' }],
        '13': ['13px', { lineHeight: '20px' }],
        '14': ['14px', { lineHeight: '22px' }],
        '16': ['16px', { lineHeight: '24px' }],
        '18': ['18px', { lineHeight: '28px' }],
        '20': ['20px', { lineHeight: '30px' }],
        '24': ['24px', { lineHeight: '32px' }],
        '28': ['28px', { lineHeight: '36px' }],
        '32': ['32px', { lineHeight: '40px' }],
      },
      spacing: {
        // Add all non-standard Figma spacing values here
        '4.5': '18px',
        '13':  '52px',
        '15':  '60px',
        '18':  '72px',
      },
      borderRadius: {
        'sm':   'FIGMA:radius-sm',
        'md':   'FIGMA:radius-md',
        'lg':   'FIGMA:radius-lg',
        'xl':   'FIGMA:radius-xl',
        'pill': '9999px',
      },
      boxShadow: {
        'card':  'FIGMA:card-shadow',
        'modal': 'FIGMA:modal-shadow',
        'glow':  'FIGMA:accent-glow',
      },
    },
  },
  plugins: [],
}

export default config
```

> ⚠️ **Never** use raw hex inline (`text-[#00C896]`). Always use semantic token names (`text-accent`).
> ⚠️ **Never** approximate (`bg-gray-900` when Figma says `#0D0F14`). Register exact values.

---

## 2. Project Structure

```
src/
├── assets/
│   ├── icons/            # SVG icons extracted from Figma
│   └── images/           # Logos, token images
├── components/
│   ├── ui/               # Primitives: Button, Badge, Input, Modal, Tabs, etc.
│   ├── layout/           # Navbar, Footer, PageWrapper, Sidebar
│   └── [feature]/        # Feature components: market/, trading/, portfolio/
├── pages/                # One file per route
├── mock-data/            # Typed mock data files
├── hooks/                # Custom React hooks
├── types/                # TypeScript interfaces
├── utils/                # Pure helper functions
├── router/               # Route config
└── App.tsx
```

---

## 3. Build Strategy — Anchor Page First

> This strategy prevents scattered half-finished work. Judges see depth, not breadth of half-done pages.

### Phase order

```
Phase 0 — Foundation (Day 1)
  → Project setup, design tokens in tailwind.config, folder structure, routing shell, Navbar/Footer

Phase 1 — Anchor Page (Day 2 morning)
  → Pick the most complex/important page (Market Detail or Marketplace)
  → Build it 100%: pixel-accurate, all interactions, all states, mock data working
  → DO NOT touch other pages until anchor is complete and verified against Figma

Phase 2 — Remaining Pages (Day 2 afternoon → Day 3 morning)
  → Landing → Marketplace → Portfolio → Create Listing → Profile
  → Reuse components built in anchor phase — velocity increases

Phase 3 — Polish + Responsive (Day 3 afternoon)
  → Pixel audit side-by-side with Figma on every page
  → Add hover states, transitions, animations
  → Test responsive: 375px, 768px, 1280px

Phase 4 — Demo Prep (Day 4)
  → Practice demo flow 3x
  → Prepare AI Showcase screenshots
  → Final push to GitHub
```

### Anchor Page is DONE when:
- [ ] Every pixel matches Figma (use color picker to verify)
- [ ] All interactive elements have visible state changes
- [ ] No dead buttons or links
- [ ] Mock data populates all lists/tables
- [ ] Works on mobile (375px minimum)

---

## 4. Pages Specification

### Route Map

| Priority | Route | Page | Description |
|----------|-------|------|-------------|
| P0 | `/` | Landing | Hero, stats, featured markets |
| P0 | `/marketplace` | Marketplace | All listings, search, filter, sort |
| P0 | `/listing/:id` | Listing Detail | Trade form, confirm modal |
| P1 | `/portfolio` | Portfolio | My listings + trade history |
| P2 | `/create` | Create Listing | Form + validation + preview modal |
| P2 | `/profile` | Profile | Wallet info + stats |
| — | `*` | 404 | Not found |

---

### PAGE: Landing (`/`)

**Sections (top → bottom):**

1. **Navbar** — logo, nav links, wallet connect button
2. **Hero** — headline, subtext, primary CTA "Go to Marketplace", secondary CTA "Create Listing"
3. **Stats Bar** — Total Volume / Active Listings / Total Traders (hardcoded mock)
4. **Featured Listings** — grid 3–4 cards from mock data
5. **How It Works** — 3-step explainer (icon + title + description)
6. **Footer** — nav links, social icons, copyright

**Interactions:**
- CTA "Go to Marketplace" → navigate `/marketplace`
- CTA "Create Listing" → navigate `/create`
- Listing card click → navigate `/listing/:id`
- Wallet button → open `<WalletModal />`

---

### PAGE: Marketplace (`/marketplace`)

**Layout:** Sidebar filter (left, 260px) + listing grid/table (right, flex-1)

**Filter Sidebar:**
- Type: All / Buy / Sell (radio group)
- Token: multi-select dropdown (ETH, BTC, SOL, WEN, BONK...)
- Price range: min + max number inputs
- Status: Active / Completed / Pending (checkboxes)
- "Reset Filters" button

**Listing Grid:**
- Sort bar: "Showing X of Y listings" + sort dropdown (Price / Volume / Date / Change)
- Grid: 3 cols desktop, 2 cols tablet, 1 col mobile
- Each card: token logo + name, price, amount, type badge, status badge, "View Detail" button
- Pagination: 20 items per page OR "Load More" button

**Interactions:**
- Filter change → instant re-filter on mock data array
- Sort change → re-sort array, update display
- Reset → restore full list
- Card click / "View Detail" → navigate `/listing/:id`
- Empty state when 0 results: `<EmptyState message="No listings match your filters" />`

---

### PAGE: Listing Detail (`/listing/:id`) ← ANCHOR PAGE candidate

**Layout:** 2-column — Listing Info (left, 60%) + Action Panel (right, 40%)

**Listing Info (left):**
- Breadcrumb: Marketplace > [Token Name]
- Token logo + name + ticker + network badge
- Price (large, prominent), 24h change (colored), USD value
- Stats row: Amount | Total Value | Status badge
- Seller: truncated address (0x1234...abcd) + copy button
- Created at / Expires at
- Description / notes (if any)
- Recent trades table (last 10)

**Action Panel (right, sticky):**
- Tab: [Buy] | [Sell]
- Price input (number, pre-filled from listing)
- Amount input (number, with "Max" button)
- Total (readonly, auto-calculated: price × amount)
- Fee display (mock: 0.5%)
- You pay / You receive summary line
- Submit button: "Buy Now" or "Sell to This Order" (color changes per tab)
- Validation: empty fields, amount > available → inline error

**Confirm Modal (after submit):**
- Title: "Confirm Transaction"
- Summary table: Token / Amount / Price / Total / Fee
- Two buttons: "Cancel" (close) + "Confirm" (loading → success)
- On confirm: 1200ms loading → toast "Transaction submitted!" → modal closes → status updates

**Interactions:**
- Tab switch Buy/Sell → swap button label + color
- Price input change → recalculate Total
- Amount input change → recalculate Total
- "Max" button → fill max amount from mock balance
- Copy address button → copy to clipboard + "Copied!" tooltip 2s
- Submit → open Confirm Modal
- Confirm → loading state → success toast → listing status → "Pending"

---

### PAGE: Portfolio (`/portfolio`)

**Top stats (4 cards):**
- Total Value (USD), Active Listings, Completed Trades, P&L (+/- colored)

**Tabs:** [My Listings] | [Transaction History]

**My Listings tab:**
- Table: Token | Type | Price | Amount | Status | Created | Action
- Filter tabs above table: All / Active / Pending / Completed / Cancelled
- Action per row: "View" → navigate to `/listing/:id`, "Cancel" (if Active) → confirm modal → status → Cancelled
- Empty state if no listings

**Transaction History tab:**
- Table: Date | Token | Type | Amount | Price | Total | P&L | Status
- Sorted newest first by default
- P&L cell: green if profit, red if loss
- Empty state if no history

---

### PAGE: Create Listing (`/create`)

**Form fields:**
- Token: searchable dropdown (ETH, BTC, SOL, WEN, BONK, SEI...)
- Type: Buy / Sell toggle (large, prominent, color-coded)
- Price per unit: number input + "USD" suffix
- Amount: number input + token ticker suffix
- Total Value: readonly (price × amount, auto-updated)
- Min fill amount: number input, optional
- Expiry date: date picker (cannot be past)
- Notes: textarea, optional, max 500 chars

**Validation rules:**
- Price: required, > 0, max 2 decimal places
- Amount: required, > 0
- Expiry: required, must be future date
- Show error inline below each field on blur or submit attempt

**Submit flow:**
```
Fill form → [Create Listing] → validate
  → if errors: highlight fields + error messages
  → if valid: open Preview Modal
    → show listing summary
    → [Confirm & Submit] → 1500ms loading
    → toast "Listing created!" → navigate /marketplace
    → new listing appears first in list (prepend to mock data)
```

---

### PAGE: Profile (`/profile`)

**Sections:**
- Avatar (placeholder circle with initials) + wallet address (truncated + copy)
- Stats row: Total Trades / Total Volume / Member Since
- Edit section: username (editable inline) + save button
- Connected wallet info (mock)

**Interactions:**
- Edit username → inline `<input>` replaces text → Save → update local state → show "Saved!" feedback
- Copy wallet address → clipboard + tooltip

---

## 5. Shared Components

### `Button`

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'buy' | 'sell'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  onClick?: () => void
  children: React.ReactNode
}
```

States: default → hover → active → loading (spinner replaces content) → disabled (opacity, no pointer)

---

### `Badge`

```tsx
interface BadgeProps {
  label: string
  variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'buy' | 'sell'
  size?: 'sm' | 'md'
  dot?: boolean   // show colored dot prefix
}
```

---

### `Input`

```tsx
interface InputProps {
  label?: string
  placeholder?: string
  value: string | number
  onChange: (value: string) => void
  type?: 'text' | 'number' | 'date' | 'search'
  prefix?: React.ReactNode   // e.g. "$" symbol
  suffix?: React.ReactNode   // e.g. "ETH" ticker
  error?: string             // shows red border + error text below
  hint?: string              // gray hint text below
  disabled?: boolean
  readOnly?: boolean
  rightAction?: React.ReactNode  // e.g. "Max" button
}
```

States: default → focus (border-active) → error (border-danger + error message) → disabled → readonly

---

### `Modal`

```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  footer?: React.ReactNode  // optional custom footer buttons
}
```

Behavior: backdrop blur overlay → close on overlay click → close on ESC key → focus trap inside

---

### `Tabs`

```tsx
interface Tab {
  id: string
  label: string
  count?: number   // optional badge count
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'line' | 'pill'  // two visual variants
}
```

---

### `Dropdown`

```tsx
interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  selected: string | string[]  // string[] for multi-select
  onChange: (value: string | string[]) => void
  placeholder?: string
  searchable?: boolean
  multiSelect?: boolean
  disabled?: boolean
}
```

---

### `Toast` (notification system)

```tsx
interface ToastOptions {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number   // ms, default 3000
}

// Usage via hook:
const { showToast } = useToast()
showToast({ message: 'Transaction submitted!', type: 'success' })
```

---

### `EmptyState`

```tsx
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}
```

---

### `Skeleton`

```tsx
interface SkeletonProps {
  width?: string | number
  height?: string | number
  rounded?: boolean   // pill shape
  className?: string
}
// Animated shimmer — use when simulating data load
```

---

### `Navbar`

- Logo (left) → click → navigate `/`
- Nav links: Home / Marketplace / Portfolio / Create (active route highlighted)
- Right: `<WalletButton />` — click → `<WalletModal />`
- Mobile: hamburger → slide-in drawer menu
- Sticky top, `z-50`, backdrop blur

---

## 6. TypeScript Interfaces

```ts
// src/types/listing.ts
export interface Listing {
  id: string
  token: string            // 'ETH'
  tokenName: string        // 'Ethereum'
  tokenIcon: string        // '/icons/eth.svg' or URL
  network: string          // 'Ethereum'
  type: 'buy' | 'sell'
  price: number            // price per unit in USD
  amount: number           // quantity
  totalValue: number       // price * amount
  minFillAmount?: number
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'expired'
  seller: string           // '0xAbCd...1234' (truncated)
  sellerFull: string       // full address
  createdAt: string        // ISO 8601
  expiresAt: string        // ISO 8601
  description?: string
  change24h: number        // percent, e.g. 12.5 or -3.2
  volume24h: number
}

// src/types/transaction.ts
export interface Transaction {
  id: string
  listingId: string
  token: string
  tokenName: string
  type: 'buy' | 'sell'
  amount: number
  price: number
  total: number
  fee: number
  pnl?: number             // profit/loss in USD
  status: 'completed' | 'pending' | 'failed'
  date: string             // ISO 8601
  counterparty: string     // truncated address
}

// src/types/portfolio.ts
export interface PortfolioStats {
  totalValue: number
  activeListings: number
  completedTrades: number
  pnl: number
  pnlPercent: number
}

// src/types/user.ts
export interface User {
  address: string          // full address
  displayAddress: string   // truncated: '0x1a2b...9a0b'
  username?: string
  joinedAt: string         // ISO 8601
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

// src/types/filter.ts
export type ListingType = 'all' | 'buy' | 'sell'
export type ListingStatus = 'all' | 'active' | 'pending' | 'completed' | 'cancelled'
export type SortField = 'price' | 'volume24h' | 'createdAt' | 'change24h'
export type SortDirection = 'asc' | 'desc'

export interface MarketFilter {
  type: ListingType
  tokens: string[]
  priceMin?: number
  priceMax?: number
  status: ListingStatus
  sortField: SortField
  sortDirection: SortDirection
}
```

---

## 7. Mock Data

### `src/mock-data/listings.ts`

```ts
import { Listing } from '@/types/listing'

export const mockListings: Listing[] = [
  {
    id: 'lst-001',
    token: 'WEN',
    tokenName: 'Wen',
    tokenIcon: '/icons/wen.svg',
    network: 'Solana',
    type: 'sell',
    price: 0.000087,
    amount: 5000000,
    totalValue: 435,
    status: 'active',
    seller: '0x1a2b...3c4d',
    sellerFull: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    createdAt: '2024-01-15T10:30:00Z',
    expiresAt: '2024-02-15T10:30:00Z',
    change24h: 12.5,
    volume24h: 124000,
    description: 'Pre-market allocation, verified seller',
  },
  // ... 19 more entries with varied token/type/status/price
]
```

> Required: minimum 20 entries. Mix of:
> - Tokens: WEN, BONK, PYTH, JTO, SEI, TIA, BLUR, ARB, OP, MANTA
> - Types: ~50% buy, ~50% sell
> - Status: ~60% active, ~20% completed, ~10% pending, ~10% cancelled
> - Prices: realistic per token (WEN: $0.00005–0.0002, ETH: $2000–3000)

### `src/mock-data/transactions.ts`

```ts
import { Transaction } from '@/types/transaction'

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    listingId: 'lst-003',
    token: 'BONK',
    tokenName: 'Bonk',
    type: 'buy',
    amount: 10000000,
    price: 0.0000142,
    total: 142,
    fee: 0.71,
    pnl: 18.5,
    status: 'completed',
    date: '2024-01-16T14:30:00Z',
    counterparty: '0x9f8e...7d6c',
  },
  // ... 14 more entries
]
```

### `src/mock-data/portfolio.ts`

```ts
import { PortfolioStats } from '@/types/portfolio'

export const mockPortfolioStats: PortfolioStats = {
  totalValue: 45230.50,
  activeListings: 3,
  completedTrades: 12,
  pnl: 1842.30,
  pnlPercent: 4.25,
}
```

### `src/mock-data/user.ts`

```ts
import { User } from '@/types/user'

export const mockUser: User = {
  address: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
  displayAddress: '0x1a2b...9a0b',
  username: 'WhaleTrader',
  joinedAt: '2023-09-01T00:00:00Z',
  stats: {
    totalTrades: 47,
    totalVolume: 128400,
  },
  balance: {
    USDC: 8420,
    ETH: 1.25,
  },
}
```

---

## 8. User Flows

### Flow 1 — Buy a listing

```
/ → [Featured card click] → /listing/:id
  → [Tab: Buy] → enter amount → [Buy Now]
  → Confirm Modal opens
  → [Confirm] → button loading 1200ms
  → Toast "Transaction submitted! ✓"
  → Modal closes → listing status → "Pending"
  → /portfolio shows new pending transaction
```

### Flow 2 — Create a listing

```
Navbar [+ Create] → /create
  → Fill form (token, type, price, amount)
  → Total auto-calculates on input change
  → [Create Listing] → validation runs
  → if errors: inline error messages appear under fields
  → if valid: Preview Modal opens
  → [Confirm & Submit] → loading 1500ms
  → Toast "Listing created! ✓"
  → Redirect /marketplace
  → New listing prepended to list
```

### Flow 3 — Filter marketplace

```
/marketplace
  → Sidebar: select Token = "WEN" → grid filters instantly
  → Sidebar: select Type = "Sell" → grid filters further
  → Sort: "Price ↑" → list re-sorts
  → Counter updates: "Showing 4 of 20 listings"
  → [Reset Filters] → full list restored
```

### Flow 4 — Cancel a listing

```
/portfolio → tab [My Listings]
  → find active listing → [Cancel]
  → Confirm modal: "Cancel this listing?"
  → [Yes, Cancel] → loading 800ms
  → Row status → "Cancelled" (immediate update)
  → Toast "Listing cancelled"
  → Active count in stats decrements by 1
```

### Flow 5 — Connect wallet (mock)

```
Navbar [Connect Wallet]
  → WalletModal opens
  → Show 3 options: MetaMask / Phantom / WalletConnect (mock icons)
  → [Click any] → 1000ms loading
  → Modal shows "Connected: 0x1a2b...9a0b ✓"
  → Navbar wallet button → shows truncated address + green dot
  → [Click address] → dropdown: "Disconnect" option
```

---

## 9. Interaction Requirements

### Every component must implement all applicable states:

| State | Visual indicator | Implementation |
|-------|-----------------|----------------|
| `default` | Base Figma style | — |
| `hover` | Background or border shift | `hover:` Tailwind classes |
| `active` | Pressed/darker | `active:` classes |
| `focus` | Border accent color | `focus:ring focus:outline-none` |
| `loading` | Spinner + disable click | `useState` loading bool + `<Spinner />` |
| `success` | Green / checkmark | State update + Toast |
| `error` | Red border + message | Error string in state |
| `disabled` | Opacity 50%, no pointer | `disabled:opacity-50 cursor-not-allowed` |
| `empty` | `<EmptyState />` component | Conditional render |

### Async simulation rules

```ts
// Simulate loading for ALL submit/action operations
const handleSubmit = async () => {
  setLoading(true)
  await new Promise(resolve => setTimeout(resolve, 1200)) // 800–1500ms range

  // Simulate occasional failure (10% rate) for realism
  if (Math.random() < 0.1) {
    setLoading(false)
    showToast({ message: 'Transaction failed. Try again.', type: 'error' })
    return
  }

  // Success path
  setLoading(false)
  showToast({ message: 'Done!', type: 'success' })
  onClose()
}
```

### Interactions checklist per element

| Element | Required behaviors |
|---------|-------------------|
| Button | hover + active + loading + disabled |
| Input | focus border + error state + label |
| Table row | hover background highlight |
| Table header | click → toggle asc/desc + sort indicator icon |
| Card | hover elevation/border shift + pointer cursor |
| Tab | active underline/bg + hover |
| Modal | open animation + close on ESC + close on overlay click |
| Dropdown | open/close + option hover + keyboard nav |
| Copy button | click → 2s "Copied!" state → revert to original icon |
| Toast | slide-in animation + auto-dismiss after 3s |
| Form submit | loading state → success/error toast → state update |

---

## 10. Responsive Design

| Breakpoint | Width | Layout changes |
|------------|-------|---------------|
| Mobile | < 768px | 1 col, hamburger menu, hidden filter sidebar |
| Tablet | 768–1279px | 2 col grid, collapsible sidebar |
| Desktop | ≥ 1280px | Full layout as Figma |

```tsx
// Page wrapper — always use this
<div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
```

Priority: **Desktop first** → then mobile. Test at 375px and 1280px minimum.

---

## 11. Code Conventions

### Naming
- Components: `PascalCase` (`ListingCard.tsx`)
- Hooks: `camelCase` with `use` prefix (`useListingFilter.ts`)
- Types: `PascalCase` (`Listing`, `Transaction`)
- Constants: `SCREAMING_SNAKE` (`MAX_LISTINGS_PER_PAGE`)
- Mock data exports: `mockXxx` (`mockListings`, `mockUser`)

### Component file template

```tsx
// src/components/ui/Button.tsx
import { clsx } from 'clsx'

interface ButtonProps {
  // ... all props typed, no `any`
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-accent/50',
        variant === 'primary' && 'bg-accent text-text-primary hover:bg-accent/90 active:bg-accent/80',
        variant === 'danger'  && 'bg-status-danger text-text-primary hover:bg-status-danger/90',
        size === 'sm' && 'px-3 py-1.5 text-12 rounded-sm',
        size === 'md' && 'px-4 py-2 text-14 rounded-md',
        size === 'lg' && 'px-6 py-3 text-16 rounded-lg',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
      )}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  )
}
```

### Filter hook pattern

```tsx
// src/hooks/useListingFilter.ts
export const useListingFilter = (listings: Listing[]) => {
  const [filter, setFilter] = useState<MarketFilter>({
    type: 'all',
    tokens: [],
    status: 'all',
    sortField: 'createdAt',
    sortDirection: 'desc',
  })

  const filtered = useMemo(() => {
    return listings
      .filter(l => filter.type === 'all' || l.type === filter.type)
      .filter(l => filter.tokens.length === 0 || filter.tokens.includes(l.token))
      .filter(l => filter.status === 'all' || l.status === filter.status)
      .filter(l => !filter.priceMin || l.price >= filter.priceMin)
      .filter(l => !filter.priceMax || l.price <= filter.priceMax)
      .sort((a, b) => {
        const dir = filter.sortDirection === 'asc' ? 1 : -1
        return (a[filter.sortField] > b[filter.sortField] ? 1 : -1) * dir
      })
  }, [listings, filter])

  const reset = () => setFilter({
    type: 'all', tokens: [], status: 'all',
    sortField: 'createdAt', sortDirection: 'desc',
  })

  return { filtered, filter, setFilter, reset }
}
```

### Import alias — configure in `vite.config.ts` and `tsconfig.json`

```ts
// Always use @/ — never relative paths like '../../../'
import { Button } from '@/components/ui/Button'
import { mockListings } from '@/mock-data/listings'
import type { Listing } from '@/types/listing'
```

---

## 12. Absolute Prohibitions

- ❌ `any` type — define the interface or use `unknown` + type guard
- ❌ Raw hex in className — always use design token (`text-accent` not `text-[#00C896]`)
- ❌ `style={{ color: '#fff' }}` — use Tailwind classes only
- ❌ `<div onClick={...}>` — use `<button>` for actions, `<a>`/`<Link>` for navigation
- ❌ Button without `onClick` — every button does something visible
- ❌ Data hardcoded in JSX — always import from `src/mock-data/`
- ❌ `TODO` in committed code — finish it or cut the feature
- ❌ `console.log` in committed code
- ❌ `@ts-ignore` — fix the error, not the symptom
- ❌ Empty screen when no data — always render `<EmptyState />`
- ❌ Instant response on submit actions — always simulate async delay (800–1500ms)
- ❌ Lorem ipsum / placeholder text — use realistic crypto data
- ❌ Approximate Figma colors — extract exact hex, register in config

---

## 13. Pre-Commit Checklist

**Technical:**
- [ ] `npm run dev` starts with zero errors
- [ ] `tsc --noEmit` passes
- [ ] Zero console errors/warnings in browser
- [ ] All routes navigable

**Design fidelity:**
- [ ] Colors verified with color picker (exact match to Figma)
- [ ] Font family, size, weight, line-height match Figma
- [ ] Padding, margin, gap match Figma (px values)
- [ ] Border radius and shadows match
- [ ] Icons sized correctly per Figma

**Functionality:**
- [ ] All buttons have click handlers with visible feedback
- [ ] All forms have validation (inline errors)
- [ ] All async actions have loading states
- [ ] Success/error toasts fire after actions
- [ ] Modals close on ESC + overlay click
- [ ] Tables sort on header click
- [ ] Filters update results instantly

**Responsive:**
- [ ] 375px: no horizontal overflow
- [ ] 1280px: matches Figma desktop

**Data:**
- [ ] All lists populated with mock data
- [ ] No empty placeholders visible
- [ ] All wallet addresses formatted (`0x1234...abcd`)

---

## 14. Git Convention

```bash
git commit -m "Day 1 - project setup and design tokens"
git commit -m "Day 2 - listing detail anchor page complete"
git commit -m "Day 2 - marketplace and landing pages"
git commit -m "Day 3 - FE logic, filter, sort, modals"
git commit -m "Day 3 - responsive and pixel polish"
```

Push at end of every day. Even if incomplete — judges track progress via commit history.
