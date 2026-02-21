import type { ThemeDefinition } from '../types'

/**
 * Gram — Instagram-inspired dark theme.
 * The iconic purple → magenta → orange → gold gradient
 * expressed through headings and atmosphere on a true dark base.
 * Built on Shiki's rose-pine-moon.
 */
const theme: ThemeDefinition = {
  shikiTheme: 'rose-pine-moon',
  label: 'Gram',
  colorScheme: 'dark',

  colors: {
    background: '#121212',
    foreground: '#F5F5F5',
    accent: '#E1306C',
    // The Instagram gradient as heading hierarchy
    heading1: '#833AB4',
    heading2: '#C13584',
    heading3: '#E1306C',
    heading4: '#F77737',
    heading5: '#FCAF45',
    heading6: '#8E8E8E',
    separator: '#262626',
    link: '#E1306C',
    list: '#C13584',
    italic: '#F5F5F5',
    note: '#833AB4',
    tip: '#FCAF45',
    important: '#C13584',
    caution: '#F77737',
    warning: '#FD1D1D',
    red: '#FD1D1D',
    green: '#FCAF45',
    yellow: '#F77737',
    blue: '#833AB4',
    magenta: '#C13584',
    cyan: '#E1306C',
  },

  kapsicum: {
    'bg-from': '#121212',
    'bg-to': '#0A0A0A',

    'surface-bg': 'rgba(225, 48, 108, 0.04)',
    'surface-blur': '0px',

    // Subtle warm edges
    'border-top': 'rgba(245, 245, 245, 0.06)',
    'border-left': 'rgba(245, 245, 245, 0.03)',
    'border-right': 'rgba(225, 48, 108, 0.10)',
    'border-bottom': 'rgba(0, 0, 0, 0.5)',

    'shadow-card':
      '0 2px 8px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)',
    'shadow-button':
      '0 2px 6px rgba(0, 0, 0, 0.4), 0 3px 10px rgba(225, 48, 108, 0.12)',

    'text-shadow-title': 'none',
    'text-secondary': 'rgba(245, 245, 245, 0.65)',
    'text-tertiary': 'rgba(245, 245, 245, 0.40)',
    'text-muted': 'rgba(245, 245, 245, 0.25)',

    // Gradient button — the Instagram action color
    'btn-gradient': 'linear-gradient(135deg, #833AB4 0%, #E1306C 50%, #F77737 100%)',
    'btn-hover-shadow':
      '0 4px 16px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(225, 48, 108, 0.25)',
    'btn-active-shadow': 'inset 0 2px 4px rgba(0, 0, 0, 0.4)',

    // Gradient atmosphere — purple, magenta, gold glow
    'orb-1':
      'radial-gradient(ellipse 600px 400px at 10% 15%, rgba(131, 58, 180, 0.06), transparent 70%)',
    'orb-2':
      'radial-gradient(ellipse 500px 500px at 90% 50%, rgba(225, 48, 108, 0.05), transparent 70%)',
    'orb-3':
      'radial-gradient(ellipse 400px 300px at 50% 85%, rgba(252, 175, 69, 0.04), transparent 70%)',
  },
}

export default theme
