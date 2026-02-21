import type { ThemeDefinition } from '../types'

/**
 * Newspaper — warm light theme evoking mid-20th-century broadsheet print.
 * Ivory newsprint, dense black ink, monochrome with a warm sepia accent.
 * Lora serif typeface for the joy of long-form reading.
 * Built on Shiki's min-light for austere, ink-like syntax highlighting.
 */
const theme: ThemeDefinition = {
  shikiTheme: 'min-light',
  label: 'Paper',
  colorScheme: 'light',
  font: 'Lora Variable',
  fontFallback: 'serif',

  colors: {
    background: '#F4EDE4',
    foreground: '#1C1917',
    accent: '#44362B',
    heading1: '#1C1917',
    heading2: '#292524',
    heading3: '#3B3633',
    heading4: '#4D4843',
    heading5: '#6B6560',
    heading6: '#8A8580',
    separator: '#D6CFC6',
    link: '#44362B',
    list: '#44362B',
    italic: '#3B3633',
    note: '#4A5568',
    tip: '#4A5D52',
    important: '#5C5068',
    caution: '#6B5B30',
    warning: '#6B4030',
    red: '#6B4030',
    green: '#4A5D52',
    yellow: '#6B5B30',
    blue: '#4A5568',
    magenta: '#5C5068',
    cyan: '#4A5D5D',
  },

  kapsicum: {
    'bg-from': '#F4EDE4',
    'bg-to': '#EDE5DB',

    // Opaque paper surfaces — no translucency, no glass
    'surface-bg': 'rgba(28, 25, 23, 0.03)',
    'surface-blur': '0px',

    // Subtle warm borders — like ink rules between columns
    'border-top': 'rgba(244, 237, 228, 0.8)',
    'border-left': 'rgba(244, 237, 228, 0.5)',
    'border-right': 'rgba(68, 54, 43, 0.10)',
    'border-bottom': 'rgba(28, 25, 23, 0.08)',

    // Paper depth — subtle, like one sheet resting on another
    'shadow-card':
      '0 1px 2px rgba(28, 25, 23, 0.06), 0 2px 6px rgba(28, 25, 23, 0.03)',
    'shadow-button':
      '0 1px 2px rgba(28, 25, 23, 0.08), 0 2px 4px rgba(68, 54, 43, 0.04)',

    'text-shadow-title': 'none',
    'text-secondary': 'rgba(28, 25, 23, 0.65)',
    'text-tertiary': 'rgba(28, 25, 23, 0.45)',
    'text-muted': 'rgba(28, 25, 23, 0.28)',

    'btn-gradient': 'linear-gradient(135deg, #44362B 0%, #352A22 100%)',
    'btn-hover-shadow':
      '0 2px 8px rgba(28, 25, 23, 0.10), 0 4px 12px rgba(68, 54, 43, 0.08)',
    'btn-active-shadow': 'inset 0 2px 3px rgba(28, 25, 23, 0.15)',

    // No atmosphere orbs — newspapers don't glow
    'orb-1': 'none',
    'orb-2': 'none',
    'orb-3': 'none',
  },
}

export default theme
