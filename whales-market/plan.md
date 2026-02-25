# Plan: Merge 3 screens + smooth page transitions

## Goal
- Click market item in Live Market → navigate to MarketDetailV2 (`/market-v2/:id`)
- Click "Dashboard" in Navbar → navigate to MyDashboardPage (`/dashboard`)
- Add smooth page transition animations
- All on `localhost:5173`

## Changes

### 1. Navbar.tsx — Update navigation links
- `NAV_LINKS[1]` (Dashboard): change `href` from `/portfolio` to `/dashboard`, update `activePaths` to `['/dashboard']`
- `AVATAR_NAV_ITEMS[0]` (Dashboard): change `href` from `/portfolio` to `/dashboard`
- Also update `isActive` active paths for Pre-market to include `/market-v2`

### 2. LandingPage.tsx — Update market row navigation
- Line 557: change `navigate('/market/${listing.id}')` → `navigate('/market-v2/${listing.id}')` (Upcoming tab)
- Line 740: change `navigate('/market/${market.id}')` → `navigate('/market-v2/${market.id}')` (Ended tab)
- Line 1058: change `navigate('/market/${market.id}')` → `navigate('/market-v2/${market.id}')` (Live Market tab)

### 3. Page transition animation — CSS + wrapper component
- Add `@keyframes page-enter` (fade-in + slight slide-up) to `src/index.css`
- Create a `PageTransition` wrapper in `src/components/ui/PageTransition.tsx` that applies animation on mount using a key based on `useLocation().pathname`
- Wrap `<AppRouter />` in `App.tsx` with the transition wrapper
- Each page gets a smooth fade+slide on entry (~300ms ease-out)

### 4. Vite config — no changes needed
`127.0.0.1:5173` is accessible via `localhost:5173` in the browser.

## Files to modify
1. `src/components/layout/Navbar.tsx` — 4 line changes
2. `src/pages/LandingPage.tsx` — 3 line changes
3. `src/App.tsx` — add PageTransition wrapper
4. `src/index.css` — add keyframes animation
5. NEW: `src/components/ui/PageTransition.tsx` — transition wrapper component
