import type { ThemeDefinition } from '../types'

/**
 * Liquid Glass — translucent frosted-glass theme inspired by iOS/visionOS.
 *
 * Design hierarchy (readability-first):
 *   Chrome (header, cards, ToC, buttons) → full glass: low opacity, inset highlights, Fresnel edge
 *   Prose containers (blockquotes, asides, code) → readable glass: higher opacity, no Fresnel
 *   Prose body text → zero effects, sits directly on the gradient background
 *   Atmosphere (caustics, specular) → subtle, behind everything
 */
const theme: ThemeDefinition = {
  shikiTheme: 'catppuccin-latte',
  label: 'Glass',
  colorScheme: 'light',

  colors: {
    background: '#F0F2F8',
    foreground: '#1C1C1E',
    accent: '#007AFF',
    heading1: '#1C1C1E',
    heading2: '#2C2C2E',
    heading3: '#3A3A3C',
    heading4: '#48484A',
    heading5: '#636366',
    heading6: '#8E8E93',
    separator: '#C6C6CC',
    link: '#007AFF',
    list: '#007AFF',
    italic: '#3A3A3C',
    note: '#5856D6',
    tip: '#34C759',
    important: '#AF52DE',
    caution: '#FF9500',
    warning: '#FF3B30',
    red: '#FF3B30',
    green: '#34C759',
    yellow: '#FF9500',
    blue: '#5856D6',
    magenta: '#AF52DE',
    cyan: '#5AC8FA',
  },

  kapsicum: {
    'bg-from': '#ECF0F8',
    'bg-to': '#E0E4F0',

    // Chrome surfaces: translucent enough to show glass, but not content-bearing
    'surface-bg': 'rgba(255, 255, 255, 0.18)',
    'surface-blur': '16px',

    // Specular edge highlights — bright top/left (light source), subtle bottom/right (shadow)
    'border-top': 'rgba(255, 255, 255, 0.85)',
    'border-left': 'rgba(255, 255, 255, 0.4)',
    'border-right': 'rgba(255, 255, 255, 0.25)',
    'border-bottom': 'rgba(0, 10, 60, 0.06)',

    // Material depth: outer diffusion + inner directional light (bright top, dark bottom)
    'shadow-card': [
      '0 4px 20px rgba(31, 38, 135, 0.10)',
      '0 1px 3px rgba(0, 0, 0, 0.05)',
      'inset 0 1px 0 rgba(255, 255, 255, 0.70)',
      'inset 0 -1px 2px rgba(0, 0, 0, 0.03)',
    ].join(', '),
    'shadow-button': [
      '0 2px 8px rgba(0, 20, 60, 0.08)',
      '0 4px 12px rgba(0, 122, 255, 0.06)',
      'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    ].join(', '),

    'text-shadow-title': 'none',
    'text-secondary': 'rgba(28, 28, 30, 0.6)',
    'text-tertiary': 'rgba(28, 28, 30, 0.4)',
    'text-muted': 'rgba(28, 28, 30, 0.25)',

    'btn-gradient': 'linear-gradient(135deg, #007AFF 0%, #0055CC 100%)',
    'btn-hover-shadow': [
      '0 4px 16px rgba(0, 20, 60, 0.1)',
      '0 8px 24px rgba(0, 122, 255, 0.15)',
      'inset 0 1px 0 rgba(255, 255, 255, 0.4)',
    ].join(', '),
    'btn-active-shadow': 'inset 0 2px 4px rgba(0, 20, 60, 0.15)',

    // Ambient color orbs — visible through frosted chrome
    'orb-1':
      'radial-gradient(ellipse 700px 500px at 8% 12%, rgba(0, 122, 255, 0.08), transparent 70%)',
    'orb-2':
      'radial-gradient(ellipse 600px 500px at 92% 40%, rgba(175, 82, 222, 0.06), transparent 70%)',
    'orb-3':
      'radial-gradient(ellipse 500px 400px at 45% 90%, rgba(90, 200, 250, 0.05), transparent 70%)',
  },

  extraCss: `
/* ═══════════════════════════════════════════════════════════════
   CHROME SURFACES — Full liquid glass treatment
   Header, cards, ToC, scroll buttons, theme picker, banners.
   ═══════════════════════════════════════════════════════════════ */

:root[data-theme="catppuccin-latte"] .kap-surface,
:root[data-theme="catppuccin-latte"] .kap-surface-interactive {
  /* Layered background: Fresnel directional light + translucent fill */
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.30) 0%,
      rgba(255, 255, 255, 0.05) 45%,
      transparent 55%,
      rgba(0, 0, 0, 0.015) 100%
    ),
    rgba(255, 255, 255, 0.18);
  /* The blur recipe: brightness prevents muddiness, saturate keeps colors vivid */
  backdrop-filter: blur(16px) brightness(1.08) saturate(150%);
  -webkit-backdrop-filter: blur(16px) brightness(1.08) saturate(150%);
}

/* Theme picker dropdown */
:root[data-theme="catppuccin-latte"] .theme-picker-dropdown {
  background:
    linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.10) 50%, transparent 100%),
    rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(20px) brightness(1.08) saturate(150%);
  -webkit-backdrop-filter: blur(20px) brightness(1.08) saturate(150%);
}

/* ToC mobile drawer */
:root[data-theme="catppuccin-latte"] .toc-mobile-drawer > div {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%),
    rgba(240, 242, 248, 0.75) !important;
  backdrop-filter: blur(20px) brightness(1.05) saturate(140%);
  -webkit-backdrop-filter: blur(20px) brightness(1.05) saturate(140%);
}

/* Resume reading banner */
:root[data-theme="catppuccin-latte"] .resume-reading-banner {
  background:
    linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%),
    rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(20px) brightness(1.08) saturate(150%);
  -webkit-backdrop-filter: blur(20px) brightness(1.08) saturate(150%);
}

/* ═══════════════════════════════════════════════════════════════
   PROSE CONTAINERS — Readable glass (higher opacity, no Fresnel)
   These contain text. Readability > aesthetics.
   ═══════════════════════════════════════════════════════════════ */

:root[data-theme="catppuccin-latte"] .prose blockquote,
:root[data-theme="catppuccin-latte"] .prose aside {
  background: rgba(255, 255, 255, 0.50);
  backdrop-filter: blur(12px) brightness(1.05) saturate(130%);
  -webkit-backdrop-filter: blur(12px) brightness(1.05) saturate(130%);
}

:root[data-theme="catppuccin-latte"] .prose table {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px) brightness(1.05) saturate(130%);
  -webkit-backdrop-filter: blur(12px) brightness(1.05) saturate(130%);
}

/* Code blocks: slightly frosted, high enough contrast for syntax colors */
:root[data-theme="catppuccin-latte"] .prose div.expressive-code figure {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(12px) brightness(1.05) saturate(130%) !important;
  -webkit-backdrop-filter: blur(12px) brightness(1.05) saturate(130%) !important;
}

:root[data-theme="catppuccin-latte"] .prose div.expressive-code figure > pre {
  background: transparent !important;
}

/* ═══════════════════════════════════════════════════════════════
   IMAGES — Soft glass frame
   ═══════════════════════════════════════════════════════════════ */

:root[data-theme="catppuccin-latte"] article img {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow:
    0 2px 8px rgba(0, 20, 60, 0.06),
    0 8px 24px rgba(0, 20, 60, 0.04);
}

/* ═══════════════════════════════════════════════════════════════
   RAY TRACING — Caustics & Specular Highlights
   Atmosphere layer only (z-index: -1, pointer-events: none).
   Gentle enough to not distract from reading.
   ═══════════════════════════════════════════════════════════════ */

/* Caustic light mesh — slow-drifting color concentrations */
:root[data-theme="catppuccin-latte"] .kap-atmosphere::before {
  content: '';
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  background:
    radial-gradient(ellipse 500px 350px at 20% 25%, rgba(0, 122, 255, 0.05), transparent 60%),
    radial-gradient(ellipse 400px 400px at 75% 55%, rgba(175, 82, 222, 0.04), transparent 60%),
    radial-gradient(ellipse 450px 300px at 55% 80%, rgba(90, 200, 250, 0.04), transparent 60%),
    radial-gradient(ellipse 350px 350px at 40% 15%, rgba(52, 199, 89, 0.025), transparent 60%);
  animation: caustic-drift 35s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes caustic-drift {
  0%   { transform: translate(0%, 0%) rotate(0deg) scale(1); }
  33%  { transform: translate(3%, -2%) rotate(1.5deg) scale(1.03); }
  66%  { transform: translate(-2%, 3%) rotate(-1deg) scale(0.98); }
  100% { transform: translate(1.5%, -1.5%) rotate(0.5deg) scale(1.01); }
}

/* Specular highlight — moves with scroll to simulate viewpoint-dependent reflection */
:root[data-theme="catppuccin-latte"] .kap-atmosphere::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 350px 220px at 50% 30%,
    rgba(255, 255, 255, 0.08),
    transparent 70%
  );
  animation: specular-sweep 28s ease-in-out infinite alternate;
  will-change: transform;
}

/* Scroll-driven specular: moves with your scroll position like light on glass */
@supports (animation-timeline: scroll()) {
  :root[data-theme="catppuccin-latte"] .kap-atmosphere::after {
    animation: specular-scroll linear forwards;
    animation-timeline: scroll(root);
  }

  @keyframes specular-scroll {
    0%   { transform: translate(-18%, -12%) scale(1.1); opacity: 0.5; }
    50%  { transform: translate(12%, 8%) scale(0.9); opacity: 0.9; }
    100% { transform: translate(-8%, 22%) scale(1.05); opacity: 0.6; }
  }
}

/* Fallback: gentle time-based sweep */
@keyframes specular-sweep {
  0%   { transform: translate(-12%, -8%); opacity: 0.5; }
  50%  { transform: translate(12%, 8%); opacity: 0.9; }
  100% { transform: translate(-8%, 15%); opacity: 0.6; }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root[data-theme="catppuccin-latte"] .kap-atmosphere::before,
  :root[data-theme="catppuccin-latte"] .kap-atmosphere::after {
    animation: none !important;
  }
}
`,
}

export default theme
