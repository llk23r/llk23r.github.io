import type { ThemeDefinition } from '../types'

/**
 * Ember Chamber — dark theme with firelight amber atmosphere.
 * Built on Shiki's kanagawa-dragon, fully overridden.
 */
const theme: ThemeDefinition = {
  shikiTheme: 'kanagawa-dragon',
  label: 'Dark',
  colorScheme: 'dark',

  colors: {
    background: '#0C0804',
    foreground: '#F5EDE4',
    accent: '#E89050',
    heading1: '#F0A050',
    heading2: '#E08840',
    heading3: '#C87838',
    heading4: '#B06830',
    heading5: '#A08060',
    heading6: '#907868',
    separator: '#2A1C10',
    link: '#F0A050',
    list: '#E89050',
    italic: '#E89050',
    note: '#6AACC4',
    tip: '#80A868',
    important: '#B888A8',
    caution: '#E8C85A',
    warning: '#D08050',
    red: '#D08050',
    green: '#80A868',
    yellow: '#E8C85A',
    blue: '#6AACC4',
    magenta: '#B888A8',
    cyan: '#68B8A8',
  },

  kapsicum: {
    'bg-to': '#14100A',
    'surface-bg': 'rgba(224, 136, 64, 0.035)',
    'border-right': 'rgba(224, 136, 64, 0.3)',
    'border-bottom': 'rgba(40, 24, 10, 0.7)',
    'border-top': 'rgba(245, 237, 228, 0.06)',
    'border-left': 'rgba(245, 237, 228, 0.03)',
    'shadow-button':
      '0 2px 8px rgba(12,8,4,0.6), 0 4px 12px rgba(224,136,64,0.12)',
    'btn-gradient': 'linear-gradient(135deg, #E89050 0%, #C07030 100%)',
    'btn-hover-shadow':
      '0 4px 16px rgba(12,8,4,0.5), 0 8px 24px rgba(224,136,64,0.2)',
    'orb-1':
      'radial-gradient(ellipse 600px 400px at 10% 15%, rgba(224,136,64,0.05), transparent 70%)',
    'orb-2':
      'radial-gradient(ellipse 500px 500px at 90% 50%, rgba(200,152,80,0.035), transparent 70%)',
    'orb-3':
      'radial-gradient(ellipse 400px 300px at 50% 85%, rgba(184,96,32,0.03), transparent 70%)',
  },
}

export default theme
