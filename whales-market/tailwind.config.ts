import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ─── Extracted from whales.market CSS ───
        // Backgrounds
        'bg-base':      '#0A0A0B',   // darkest — page canvas
        'bg-surface':   '#1B1B1C',   // card, panel bg
        'bg-elevated':  '#252527',   // dropdown, tooltip, modal bg
        'bg-hover':     '#202022',   // row/item hover
        'bg-active':    '#2A2A2C',   // selected/active item

        // Brand / Accent — Whales Market green
        'accent':       '#16C284',
        'accent-dim':   'rgba(22,194,132,0.12)',

        // Semantic — buy/sell
        'buy':          '#16C284',   // green
        'sell':         '#FD5E67',   // red
        'success':      '#16C284',
        'warning':      '#EAB308',
        'danger':       '#FD5E67',
        'info':         '#3B82F6',
        'purple':       '#7C3AED',

        // Text
        'text-primary':    '#F9F9FA',  // main content
        'text-secondary':  '#A1A1AA',  // labels, subtitles
        'text-muted':      '#71717A',  // disabled, placeholder
        'text-inverse':    '#0A0A0B',  // text on accent bg

        // Border
        'border-default':  '#27272A',  // standard border
        'border-subtle':   '#1F1F21',  // very subtle separator
        'border-active':   '#16C284',  // focused input, selected card
        'border-danger':   '#FD5E67',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      fontSize: {
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
        '40': ['40px', { lineHeight: '48px' }],
        '48': ['48px', { lineHeight: '56px' }],
      },
      spacing: {
        '4.5': '18px',
        '13':  '52px',
        '15':  '60px',
        '18':  '72px',
      },
      borderRadius: {
        'sm':   '4px',
        'md':   '6px',
        'lg':   '8px',
        'xl':   '12px',
        '2xl':  '16px',
        'pill': '9999px',
      },
      boxShadow: {
        'card':  '0px 0px 32px 0px rgba(0,0,0,0.2)',
        'modal': '0 10px 15px -3px rgba(0,0,0,0.4), 0 4px 6px -4px rgba(0,0,0,0.3)',
        'glow':  '0 0 20px rgba(22,194,132,0.25)',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-in': {
          '0%':   { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-out': {
          '0%':   { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        shimmer:    'shimmer 2s infinite linear',
        'slide-in': 'slide-in 0.25s ease-out',
        'slide-out':'slide-out 0.2s ease-in',
        'fade-in':  'fade-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
