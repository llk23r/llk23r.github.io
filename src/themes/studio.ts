import type { ThemeDefinition } from '../types'

/**
 * Studio — Logic Pro-inspired dark theme.
 * Deep blue-black panels, cool blue accent, refined Apple polish.
 * The feel of a late-night mixing session.
 * Built on Shiki's tokyo-night, colors harmonized.
 */
const theme: ThemeDefinition = {
  shikiTheme: 'tokyo-night',
  label: 'Studio',
  colorScheme: 'dark',

  colors: {
    background: '#1A1B26',
    foreground: '#A9B1D6',
    accent: '#7AA2F7',
    heading1: '#C0CAF5',
    heading2: '#B4BDE0',
    heading3: '#A9B1D6',
    heading4: '#9098C0',
    heading5: '#7880A8',
    heading6: '#636B90',
    separator: '#292E42',
    link: '#7AA2F7',
    list: '#7AA2F7',
    italic: '#A9B1D6',
    note: '#7AA2F7',
    tip: '#9ECE6A',
    important: '#BB9AF7',
    caution: '#E0AF68',
    warning: '#F7768E',
    red: '#F7768E',
    green: '#9ECE6A',
    yellow: '#E0AF68',
    blue: '#7AA2F7',
    magenta: '#BB9AF7',
    cyan: '#7DCFFF',
  },

  kapsicum: {
    'bg-from': '#1A1B26',
    'bg-to': '#16171F',

    'surface-bg': 'rgba(122, 162, 247, 0.04)',
    'surface-blur': '0px',

    // Panel edges — subtle, like channel strip dividers
    'border-top': 'rgba(169, 177, 214, 0.08)',
    'border-left': 'rgba(169, 177, 214, 0.04)',
    'border-right': 'rgba(122, 162, 247, 0.08)',
    'border-bottom': 'rgba(0, 0, 0, 0.4)',

    'shadow-card':
      '0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(10, 10, 30, 0.2)',
    'shadow-button':
      '0 2px 6px rgba(0, 0, 0, 0.3), 0 3px 10px rgba(122, 162, 247, 0.08)',

    'text-shadow-title': 'none',
    'text-secondary': 'rgba(169, 177, 214, 0.65)',
    'text-tertiary': 'rgba(169, 177, 214, 0.40)',
    'text-muted': 'rgba(169, 177, 214, 0.25)',

    'btn-gradient': 'linear-gradient(135deg, #7AA2F7 0%, #5A80D0 100%)',
    'btn-hover-shadow':
      '0 4px 16px rgba(0, 0, 0, 0.3), 0 6px 20px rgba(122, 162, 247, 0.15)',
    'btn-active-shadow': 'inset 0 2px 4px rgba(0, 0, 10, 0.3)',

    // Studio monitor glow — blue/purple atmosphere
    'orb-1':
      'radial-gradient(ellipse 600px 400px at 10% 15%, rgba(122, 162, 247, 0.05), transparent 70%)',
    'orb-2':
      'radial-gradient(ellipse 500px 500px at 90% 50%, rgba(187, 154, 247, 0.04), transparent 70%)',
    'orb-3':
      'radial-gradient(ellipse 400px 300px at 50% 85%, rgba(125, 207, 255, 0.03), transparent 70%)',
  },
}

export default theme
