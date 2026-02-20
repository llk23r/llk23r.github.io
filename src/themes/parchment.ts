import type { ThemeDefinition } from '../types'

/**
 * Clean Pin — light theme inspired by Pinterest's design language.
 * Pure white, the iconic red accent, dark text, minimal ornamentation.
 * Built on Shiki's rose-pine-dawn for light-mode syntax highlighting.
 */
const theme: ThemeDefinition = {
  shikiTheme: 'rose-pine-dawn',
  label: 'Light',
  colorScheme: 'light',

  colors: {
    background: '#FFFFFF',
    foreground: '#111111',
    accent: '#E60023',
    heading1: '#111111',
    heading2: '#1A1A1A',
    heading3: '#2A2A2A',
    heading4: '#3A3A3A',
    heading5: '#555555',
    heading6: '#767676',
    separator: '#EFEFEF',
    link: '#E60023',
    list: '#E60023',
    italic: '#333333',
    note: '#0076D3',
    tip: '#00857C',
    important: '#8E49A0',
    caution: '#BD5B00',
    warning: '#CC0000',
    red: '#E60023',
    green: '#00857C',
    yellow: '#BD5B00',
    blue: '#0076D3',
    magenta: '#8E49A0',
    cyan: '#00857C',
  },

  kapsicum: {
    'bg-from': '#FFFFFF',
    'bg-to': '#FAFAFA',
    'surface-bg': 'rgba(0, 0, 0, 0.02)',
    'surface-blur': '0px',
    'border-right': 'rgba(230, 0, 35, 0.12)',
    'border-bottom': 'rgba(0, 0, 0, 0.08)',
    'border-top': 'rgba(255, 255, 255, 0.9)',
    'border-left': 'rgba(255, 255, 255, 0.5)',
    'shadow-card':
      '0 1px 2px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
    'shadow-button':
      '0 1px 3px rgba(0,0,0,0.1), 0 2px 6px rgba(230,0,35,0.06)',
    'text-shadow-title': 'none',
    'text-secondary': 'rgba(17,17,17,0.6)',
    'text-tertiary': 'rgba(17,17,17,0.4)',
    'text-muted': 'rgba(17,17,17,0.25)',
    'btn-gradient': 'linear-gradient(135deg, #E60023 0%, #C4001D 100%)',
    'btn-hover-shadow':
      '0 2px 8px rgba(0,0,0,0.1), 0 4px 12px rgba(230,0,35,0.1)',
    'btn-active-shadow': 'inset 0 2px 3px rgba(0,0,0,0.15)',
    'orb-1':
      'radial-gradient(ellipse 600px 400px at 10% 15%, rgba(230,0,35,0.012), transparent 70%)',
    'orb-2':
      'radial-gradient(ellipse 500px 500px at 90% 50%, rgba(230,0,35,0.008), transparent 70%)',
    'orb-3':
      'radial-gradient(ellipse 400px 300px at 50% 85%, rgba(0,0,0,0.005), transparent 70%)',
  },
}

export default theme
