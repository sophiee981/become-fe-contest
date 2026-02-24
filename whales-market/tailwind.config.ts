import type { Config } from 'tailwindcss'

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens — sourced directly from Figma (WhalesMarket-v2)
// Figma file: ievx5gIqlhh6fUQoaOp5rH
// Foundation pages: Color, Typography, Radius, Shadow, Border
// Last synced: 2026-02-24 (via Figma REST API node fetch)
//
// FONT: Figma typography uses "Funnel Sans" throughout all text styles.
//       Loaded via Google Fonts (variable font, wght 300–800).
// ─────────────────────────────────────────────────────────────────────────────

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Primitive: Neutral scale ─────────────────────────────────────────
        // Figma: color/neutral/neutral-*
        neutral: {
          50:  '#F9F9FA',
          100: '#EFEFF1',
          200: '#D6D6DB',
          300: '#B4B4BA',
          400: '#97979E',
          500: '#7A7A83',
          600: '#44444B',
          700: '#2E2E34',
          800: '#252527',
          900: '#1B1B1C',
          950: '#0A0A0B',
        },

        // ── Primitive: Primary / Green ───────────────────────────────────────
        // Figma: color/semantic/primary/primary-*
        primary: {
          300: '#86DDB1',
          400: '#5BD197',
          500: '#16C284',
          600: '#15AF77',
          700: '#139B6B',
        },

        // ── Primitive: Danger / Red ──────────────────────────────────────────
        // Figma: color/semantic/danger/danger-*
        'danger-scale': {
          300: '#FC8389',
          400: '#FD5E67',
          500: '#FF3B46',
          600: '#F91A27',
          700: '#D50B17',
        },

        // ── Primitive: Warning / Orange ──────────────────────────────────────
        // Figma: color/semantic/warning/warning-*
        'warning-scale': {
          200: '#FDC7A2',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },

        // ── Primitive: Info / Blue ───────────────────────────────────────────
        // Figma: color/semantic/info/info-*
        'info-scale': {
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },

        // ── Extended palette ─────────────────────────────────────────────────
        // Figma: color/custom/*
        teal:   { 400: '#2DD4BF', 500: '#14B8A6', 600: '#0D9488' },
        lime:   { 400: '#A3E635', 500: '#87CC16', 600: '#537C0F' },
        indigo: { 400: '#818CF8', 500: '#6366F1', 600: '#7C3AED' },
        pink:   { 400: '#F472B6', 500: '#EC4899', 600: '#DB2777' },
        yellow: { 400: '#FACC15', 500: '#EAB308', 600: '#CA8A04' },

        // ── Semantic: Backgrounds (dark mode) ────────────────────────────────
        // Figma design token: bg-neutral-01 → bg-neutral-04 (dark theme resolved)
        'bg-base':     '#0A0A0B',   // bg-neutral-01 dark → neutral-950
        'bg-surface':  '#1B1B1C',   // bg-neutral-02 dark → neutral-900
        'bg-elevated': '#252527',   // bg-neutral-03 dark → neutral-800
        'bg-hover':    '#2E2E34',   // bg-neutral-04 dark → neutral-700
        'bg-active':   '#44444B',   // bg-neutral-04 pressed → neutral-600

        // ── Semantic: Brand / Accent ─────────────────────────────────────────
        // Figma: bg-primary dark = primary-500
        'accent':      '#16C284',               // bg-primary dark
        'accent-dim':  'rgba(22,194,132,0.12)', // 12% opacity overlay

        // ── Semantic: Trade direction ────────────────────────────────────────
        // buy  = bg-success dark = primary-500
        // sell = bg-danger dark  = danger-500
        'buy':      '#16C284',   // bg-primary dark → primary-500
        'sell':     '#FF3B46',   // bg-danger dark  → danger-500
        'buy-text': '#5BD197',   // text-success dark → primary-400
        'sell-text':'#FD5E67',   // text-danger dark  → danger-400

        // ── Semantic: Status (text/icon level) ───────────────────────────────
        // Figma: text-* dark-theme resolved values
        'success': '#5BD197',   // text-success dark  → primary-400
        'danger':  '#FD5E67',   // text-danger dark   → danger-400
        'warning': '#FB923C',   // text-warning dark  → warning-400
        'info':    '#60A5FA',   // text-info dark     → info-400

        // ── Semantic: Text ────────────────────────────────────────────────────
        // Figma: text-neutral-* dark-theme resolved values
        'text-primary':    '#F9F9FA',  // text-neutral-primary dark   → neutral-50
        'text-secondary':  '#B4B4BA',  // text-neutral-secondary dark → neutral-300
        'text-muted':      '#7A7A83',  // text-neutral-tertiary dark  → neutral-500
        'text-inverse':    '#0A0A0B',  // text-neutral-inverse dark   → neutral-950
        'text-on-color':   '#F9F9FA',  // text-neutral-on-color       → neutral-50

        // ── Semantic: Border ─────────────────────────────────────────────────
        // Figma: border-neutral-* dark-theme resolved values
        'border-subtle':  '#1B1B1C',  // border-neutral-01 dark → neutral-900
        'border-default': '#2E2E34',  // border-neutral-03 dark → neutral-700
        'border-strong':  '#44444B',  // border-neutral-04 dark → neutral-600
        'border-active':  '#5BD197',  // border-primary dark    → primary-400
        'border-danger':  '#FD5E67',  // border-danger dark     → danger-400

        // ── Overlay / Social ─────────────────────────────────────────────────
        // Figma: color/overlay/social-*
        'social-discord':  '#5865F2',
        'social-telegram': '#229ED9',
        'social-twitter':  '#1D9BF0',
        'social-github':   '#24292E',
      },

      fontFamily: {
        // Figma typography: fontFamily = "Inter Variable" (variable font)
        // Loaded via @fontsource-variable/inter (imported in main.tsx)
        sans: ['"Inter Variable"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },

      fontSize: {
        // ── Figma Typography Scale ────────────────────────────────────────────
        // Source: Foundation > Typography page (node 18610:2231)
        // Family: Funnel Sans | All weights via variable font

        // [Label] text-label-2xs: 10/Medium/12 — uppercase usage
        '10': ['10px', { lineHeight: '12px' }],
        // [Label/Body] text-label-xs / text-body-xs: 12/*/16
        '12': ['12px', { lineHeight: '16px' }],
        // [Label/Body] text-label-sm / text-body-sm: 14/*/20
        '14': ['14px', { lineHeight: '20px' }],
        // [Label/Body] text-label-md / text-body-md: 16/*/24
        '16': ['16px', { lineHeight: '24px' }],
        // [Label/Body] text-label-lg / text-body-lg: 18/*/28
        '18': ['18px', { lineHeight: '28px' }],
        // [Heading] text-heading-sm: 20/Medium/28
        '20': ['20px', { lineHeight: '28px' }],
        // [Heading] text-heading-md: 24/Medium/32
        '24': ['24px', { lineHeight: '32px' }],
        // [Heading] text-heading-lg: 28/Medium/36
        '28': ['28px', { lineHeight: '36px' }],
        // [Display] text-display-md: 36/Medium/44
        '36': ['36px', { lineHeight: '44px' }],
        // [Display] text-display-lg: 48/Medium/56
        '48': ['48px', { lineHeight: '56px' }],

        // Additional sizes used in layouts (not in typography page, used inline)
        '11': ['11px', { lineHeight: '16px' }],
        '13': ['13px', { lineHeight: '20px' }],
        '32': ['32px', { lineHeight: '40px' }],
        '40': ['40px', { lineHeight: '48px' }],
      },

      spacing: {
        // Non-standard Figma layout spacing values
        '4.5': '18px',
        '13':  '52px',
        '15':  '60px',
        '18':  '72px',
      },

      borderRadius: {
        // ── Figma Radius Scale ────────────────────────────────────────────────
        // Source: Foundation > Base Tokens > Radius (node 31281:58553)
        'none': '0px',
        'xs':   '2px',
        'sm':   '4px',
        'md':   '6px',
        'lg':   '8px',
        'xl':   '10px',
        '2xl':  '12px',
        '3xl':  '16px',
        'full': '9999px',
      },

      boxShadow: {
        // ── Figma Shadow Scale ────────────────────────────────────────────────
        // Source: Foundation > Base Tokens > Shadow (node 31282:57431)
        'xs':      '0 1px 2px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.10)',
        'sm':      '0 1px 2px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05)',
        'md':      '0 4px 6px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)',
        'lg':      '0 10px 15px rgba(0,0,0,0.10), 0 10px 10px rgba(0,0,0,0.05)',
        'xl':      '0 20px 25px rgba(0,0,0,0.10)',
        '2xl':     '0 25px 50px rgba(0,0,0,0.20)',
        'modal':   '0 25px 50px rgba(0,0,0,0.20), 0 0 0 1px rgba(255,255,255,0.05)',
        'tooltip': '0 0 8px rgba(0,0,0,0.10)',
        'glow':    '0 0 20px rgba(22,194,132,0.25)',
        'card':    '0 4px 6px rgba(0,0,0,0.10), 0 4px 6px rgba(0,0,0,0.05)',
      },

      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-in': {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'slide-out': {
          '0%':   { transform: 'translateX(0)',    opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
      },
      animation: {
        shimmer:     'shimmer 2s infinite linear',
        'slide-in':  'slide-in 0.25s ease-out',
        'slide-out': 'slide-out 0.2s ease-in',
        'fade-in':   'fade-in 0.15s ease-out',
        'scale-in':  'scale-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
