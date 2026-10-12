import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mundane Design Tokens
        'concrete-paper': '#F2EFE7',
        'graphite': '#343B38',
        'oxide': '#B96649',
        'weathered-stone': '#A6A89C',
        'dust': '#D4C6AD',
        'patina': '#728B83',
        'error-red': '#A33B32',
        // Semantic aliases
        background: '#F2EFE7',
        surface: '#FFFFFF',
        'surface-secondary': '#F8F6F1',
        border: '#D4C6AD',
        'border-subtle': '#E8E4DB',
        text: '#343B38',
        'text-muted': '#A6A89C',
        primary: '#B96649',
        'primary-hover': '#A55840',
        accent: '#728B83',
        error: '#A33B32',
      },
      fontFamily: {
        heading: ['Newsreader', 'Georgia', 'serif'],
        instrument: ['"Instrument Serif"', 'Newsreader', 'Georgia', 'serif'],
        handwritten: ['Caveat', 'cursive'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'sm': '6px',
        DEFAULT: '10px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(52, 59, 56, 0.06), 0 1px 2px rgba(52, 59, 56, 0.04)',
        'card-hover': '0 4px 12px rgba(52, 59, 56, 0.1), 0 2px 4px rgba(52, 59, 56, 0.06)',
        'panel': '0 2px 8px rgba(52, 59, 56, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}

export default config
