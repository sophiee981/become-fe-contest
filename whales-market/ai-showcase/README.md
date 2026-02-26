# AI Showcase — Whales Market OTC Pre-Market Trading Platform

## Project Overview

**Whales Market** is a pixel-perfect OTC pre-market trading platform built entirely with AI assistance using **Claude Code (Anthropic)**. The project replicates a production-grade crypto trading interface with real-time data simulation, interactive charts, order books, and multi-page routing.

**Tech Stack:** React 18 + TypeScript (strict) + Tailwind CSS v3 + Vite + React Router v6

**Live URL:** `http://localhost:5173/`

---

## Screenshots

### 1. Landing Page — Live Market Table
![Landing Page](./screenshots/01-landing-page.jpg)

Full landing page with:
- Top metrics bar (24h Vol, Fear & Greed Index, Altcoin Season, Next Settlement countdown)
- Live Market / Upcoming / Ended tabs with real token data
- Sortable table with token logos, chain badges, price changes, volume, FDV
- Live Recent Trades feed with real-time trade simulation

### 2. Market Detail — Dynamic Token Page (ERA)
![Market Detail ERA](./screenshots/02-market-detail-era.jpg)

Clicking any market row navigates to its detail page showing:
- Dynamic breadcrumb (Whales.Market > Pre-market > ERA)
- Token header with logo, chain badge, price, 24h change, volume stats
- Interactive SVG price chart with hover tooltip, period selector (1d/7d/30d/All)
- Two-column Order Book (Ask/Bid) with depth bars
- Trade panel (Buy/Sell) with limit/market orders, fee calculation
- My Orders section (Filled/Open)

### 3. Dashboard — User Portfolio
![Dashboard](./screenshots/03-dashboard.jpg)

Dashboard page accessible via navbar:
- User wallet info (address, trading volume, discount tier)
- Upcoming/Current settlements cards
- Open Orders (28) and Filled Orders (132) with pagination
- Sortable columns, status badges, progress bars

---

## AI Workflow Screenshots

### 4. Claude Code — Merge 3 Screens Planning
![AI Workflow - Planning](./screenshots/04-ai-workflow-planning.jpg)

Showing Claude Code planning the merge of 3 separate screens (Landing, Market Detail, Dashboard) into a single SPA with smooth page transitions.

### 5. Claude Code — Dynamic Token Data Implementation
![AI Workflow - Dynamic Data](./screenshots/05-ai-workflow-dynamic-data.jpg)

Claude Code implementing dynamic token routing — clicking any market item shows the correct token name, logo, price, and stats on the Market Detail page.

### 6. Claude Code — Page Transition Animation
![AI Workflow - Animation](./screenshots/06-ai-workflow-animation.jpg)

Implementation of smooth fade+slide page transitions (280ms enter, 180ms exit) using CSS keyframes and React Router location tracking.

### 7. Claude Code — Verification & Testing
![AI Workflow - Testing](./screenshots/07-ai-workflow-testing.jpg)

AI-driven verification workflow: taking screenshots, checking console errors, testing navigation flows across all 3 screens.

### 8. Claude Code — Full Market Detail Build
![AI Workflow - Market Detail](./screenshots/08-ai-workflow-market-detail.jpg)

Building the complete Market Detail page with interactive price chart, order book, trade panel, and recent trades — all with live data simulation.

---

## Key Features Built with AI

| Feature | Description |
|---------|-------------|
| **Pixel-Perfect UI** | Extracted exact colors, spacing, typography from Figma design system |
| **Dynamic Routing** | Click any token in Live Market -> navigates to `/market-v2/:id` with correct data |
| **Interactive Price Chart** | SVG-based line chart with hover tooltips, gradient fill, volume bars |
| **Order Book** | Two-column Ask/Bid layout with depth visualization bars |
| **Trade Panel** | Buy/Sell toggle, limit/market orders, fee calc, loading states |
| **Live Trade Feed** | Real-time trade simulation with 2.5s interval, animated row insertion |
| **Page Transitions** | Smooth fade+slide animations on route change (CSS keyframes) |
| **Responsive Navbar** | Desktop nav links + mobile hamburger drawer |
| **Wallet Connection** | Mock wallet modal with MetaMask/Phantom/WalletConnect options |
| **Toast System** | Success/error notifications with auto-dismiss |

## Architecture

```
src/
  pages/
    LandingPage.tsx          # 1587 lines — full landing with live data
    MarketDetailV2Page.tsx   # 1100+ lines — dynamic market detail
    MyDashboardPage.tsx      # 1011 lines — portfolio dashboard
  components/
    layout/Navbar.tsx        # 567 lines — responsive navbar
    market/RecentTradesTable.tsx  # Shared recent trades component
    ui/PageTransition.tsx    # Route transition animations
    ui/Toast.tsx             # Notification system
  mock-data/
    homeData.ts              # Markets, trades, upcoming, ended
    orderBook.ts             # Buy/sell order book data
    myOrders.ts              # User's filled/open orders
    dashboardData.ts         # Dashboard stats and orders
```

## AI Tools Used

- **Claude Code (Anthropic)** — Primary AI coding assistant
- **Claude Preview MCP** — Live browser preview, screenshots, DOM inspection
- **Figma MCP** — Design token extraction (attempted)

## Time Breakdown

| Phase | Duration | Output |
|-------|----------|--------|
| Foundation + Design Tokens | Day 1 | Tailwind config, folder structure, routing |
| Landing Page (Anchor) | Day 2 | 1587-line pixel-perfect landing with live data |
| Market Detail V2 | Day 2-3 | Chart, Order Book, Trade Panel, Recent Trades |
| Dashboard | Day 3 | Open/Filled orders, pagination, user stats |
| Merge + Transitions | Day 3 | SPA routing, page animations, dynamic tokens |

---

*Built with Claude Code by Anthropic*
