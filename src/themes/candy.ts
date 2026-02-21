import type { ThemeDefinition } from '../types'

/**
 * Candy — neobrutalist, Gumroad-school.
 * Warm peach field, white card slabs, thick black borders,
 * hard black offset shadows, hot pink accent, zero radius.
 * The brutalism is in the structure. The funk is in the color.
 */
const theme: ThemeDefinition = {
  shikiTheme: 'github-light-high-contrast',
  label: 'Candy',
  colorScheme: 'light',

  colors: {
    background: '#FFEEE2',
    foreground: '#1A1A1A',
    accent: '#E63980',
    heading1: '#1A1A1A',
    heading2: '#1A1A1A',
    heading3: '#1A1A1A',
    heading4: '#333333',
    heading5: '#555555',
    heading6: '#777777',
    separator: '#1A1A1A',
    link: '#E63980',
    list: '#E63980',
    italic: '#1A1A1A',
    note: '#3A5AFF',
    tip: '#0FA958',
    important: '#8B5CF6',
    caution: '#F59E0B',
    warning: '#EF4444',
    red: '#EF4444',
    green: '#0FA958',
    yellow: '#F59E0B',
    blue: '#3A5AFF',
    magenta: '#8B5CF6',
    cyan: '#06B6D4',
  },

  kapsicum: {
    'bg-from': '#FFEEE2',
    'bg-to': '#FFE4D4',

    'surface-bg': '#FFFFFF',
    'surface-blur': '0px',

    // Black. All of them. Unambiguous.
    'border-top': '#1A1A1A',
    'border-right': '#1A1A1A',
    'border-bottom': '#1A1A1A',
    'border-left': '#1A1A1A',

    // Hard black offset shadows — the neobrut signature
    'shadow-card': '4px 4px 0px #1A1A1A',
    'shadow-button': '3px 3px 0px #1A1A1A',

    'text-shadow-title': 'none',
    'text-secondary': 'rgba(26, 26, 26, 0.70)',
    'text-tertiary': 'rgba(26, 26, 26, 0.50)',
    'text-muted': 'rgba(26, 26, 26, 0.30)',

    'btn-gradient': 'linear-gradient(135deg, #E63980 0%, #E63980 100%)',
    'btn-hover-shadow': '6px 6px 0px #1A1A1A',
    'btn-active-shadow': '1px 1px 0px #1A1A1A',

    'orb-1': 'none',
    'orb-2': 'none',
    'orb-3': 'none',
  },

  extraCss: `
/* ═══════════════════════════════════════════════════════════════
   FUNK — Neobrutalist. Light bg, white cards, black structure.
   ═══════════════════════════════════════════════════════════════ */

:root[data-theme="github-light-high-contrast"] .kap-surface,
:root[data-theme="github-light-high-contrast"] .kap-surface-interactive {
  border-radius: 0 !important;
  border-width: 3px !important;
  border-style: solid !important;
}

:root[data-theme="github-light-high-contrast"] .kap-surface-interactive:hover {
  transform: translate(-2px, -2px) !important;
  box-shadow: 6px 6px 0px #1A1A1A !important;
}

:root[data-theme="github-light-high-contrast"] .kap-surface-interactive:active {
  transform: translate(1px, 1px) !important;
  box-shadow: 1px 1px 0px #1A1A1A !important;
}

:root[data-theme="github-light-high-contrast"] .header-mobile-nav,
:root[data-theme="github-light-high-contrast"] .theme-picker-dropdown,
:root[data-theme="github-light-high-contrast"] .theme-picker-option {
  border-radius: 0 !important;
}

:root[data-theme="github-light-high-contrast"] .prose div.expressive-code figure {
  border-radius: 0 !important;
  border: 3px solid #1A1A1A !important;
  box-shadow: 4px 4px 0px #1A1A1A;
}

:root[data-theme="github-light-high-contrast"] .prose blockquote,
:root[data-theme="github-light-high-contrast"] .prose aside {
  border-radius: 0 !important;
  border: 3px solid #1A1A1A !important;
  box-shadow: 3px 3px 0px #1A1A1A;
  background: #FFFFFF;
}

:root[data-theme="github-light-high-contrast"] [class*="rounded"] {
  border-radius: 0 !important;
}

:root[data-theme="github-light-high-contrast"] .scroll-up,
:root[data-theme="github-light-high-contrast"] .scroll-down,
:root[data-theme="github-light-high-contrast"] .toc-mobile-trigger {
  border-radius: 0 !important;
}

:root[data-theme="github-light-high-contrast"] article img {
  border: 3px solid #1A1A1A;
  border-radius: 0;
  box-shadow: 4px 4px 0px #1A1A1A;
}
`,
}

export default theme
