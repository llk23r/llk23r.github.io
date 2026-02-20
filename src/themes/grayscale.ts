import type { ThemeDefinition } from '../types'

/**
 * Grayscale — pure monochrome mid-tone theme. No color anywhere.
 * Built on Shiki's github-dark-dimmed, fully overridden to neutral gray.
 * Applies grayscale filter to visualizations and code blocks.
 */
const theme: ThemeDefinition = {
  shikiTheme: 'github-dark-dimmed',
  label: 'Gray',
  colorScheme: 'dark',

  colors: {
    background: '#2A2A2A',
    foreground: '#D8D8D8',
    accent: '#B0B0B0',
    heading1: '#E8E8E8',
    heading2: '#D8D8D8',
    heading3: '#C8C8C8',
    heading4: '#B8B8B8',
    heading5: '#A8A8A8',
    heading6: '#989898',
    separator: '#707070',
    link: '#D0D0D0',
    list: '#B0B0B0',
    italic: '#B0B0B0',
    note: '#A0A0A0',
    tip: '#A8A8A8',
    important: '#B0B0B0',
    caution: '#989898',
    warning: '#909090',
    red: '#D0D0D0',
    green: '#A8A8A8',
    yellow: '#C0C0C0',
    blue: '#909090',
    magenta: '#B8B8B8',
    cyan: '#A0A0A0',
  },

  kapsicum: {
    'bg-from': '#2A2A2A',
    'bg-to': '#252525',
    'surface-bg': 'rgba(255, 255, 255, 0.03)',
    'border-right': 'rgba(255, 255, 255, 0.15)',
    'border-bottom': 'rgba(0, 0, 0, 0.45)',
    'border-top': 'rgba(255, 255, 255, 0.08)',
    'border-left': 'rgba(255, 255, 255, 0.04)',
    'shadow-card': '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.25)',
    'shadow-button': '0 2px 8px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.15)',
    'text-shadow-title': '1px 1px 2px rgba(0,0,0,0.5)',
    'text-secondary': 'rgba(216,216,216,0.7)',
    'text-tertiary': 'rgba(216,216,216,0.5)',
    'text-muted': 'rgba(216,216,216,0.3)',
    'btn-gradient': 'linear-gradient(135deg, #808080 0%, #606060 100%)',
    'btn-hover-shadow':
      '0 4px 16px rgba(0,0,0,0.4), 0 8px 24px rgba(255,255,255,0.05)',
    'orb-1':
      'radial-gradient(ellipse 600px 400px at 10% 15%, rgba(255,255,255,0.015), transparent 70%)',
    'orb-2':
      'radial-gradient(ellipse 500px 500px at 90% 50%, rgba(255,255,255,0.01), transparent 70%)',
    'orb-3':
      'radial-gradient(ellipse 400px 300px at 50% 85%, rgba(255,255,255,0.008), transparent 70%)',
  },

  extraVars: {
    '--theme-orange': '#C8C8C8',
    '--theme-pink': '#B0B0B0',
  },

  extraCss: `
:root[data-theme="github-dark-dimmed"] .trace-viz:not([data-preserves-color]),
:root[data-theme="github-dark-dimmed"] .prose div.expressive-code {
  filter: grayscale(1);
}
:root[data-theme="github-dark-dimmed"] .trace-viz {
  --viz-grid: #3D3D3D;
  --viz-axis: #909090;
  --viz-bg: #2A2A2A;
  --viz-text: #D8D8D8;
  --viz-text-muted: #A0A0A0;
  --viz-curve-planck: #E8E8E8;
  --viz-curve-classical: #909090;
  --viz-wien: #C8C8C8;
  --viz-catastrophe: #E0E0E0;
  --viz-positive: #E0E0E0;
  --viz-negative: #808080;
  --viz-coil: #D0D0D0;
  --viz-field: #808080;
  --viz-voltage: #B8B8B8;
  --viz-propagation: #C0C0C0;
  --viz-wire: #C8C8C8;
  --viz-electron: #A0A0A0;
  --viz-waveform: #E0E0E0;
  --viz-na: #D8D8D8;
  --viz-k: #888888;
  --viz-resting: #C0C0C0;
  --viz-threshold: #A8A8A8;
  --viz-refractory: #909090;
  --viz-accent: #B0B0B0;
  --viz-purple: #B0B0B0;
  --viz-yellow: #D0D0D0;
  --viz-orange: #C0C0C0;
  --viz-cyan: #A0A0A0;
  --viz-blue: #888888;
  --viz-red: #D8D8D8;
  --viz-green: #B8B8B8;
  --viz-pink: #A8A8A8;
  --viz-reject: #B0B0B0;
  --viz-accept: #A0A0A0;
  --viz-electron-fill: #909090;
}`,
}

export default theme
