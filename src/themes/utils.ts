import type { ColorStyles, KapsicumVars } from '../types'

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [0, 0, 0]
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

function shiftBrightness(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v + amount)))
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  )
}

/**
 * Auto-derive sensible Kapsicum visual language defaults from base colors.
 * New themes only need to define 25 base colors — this generates all the
 * surface, border, shadow, text, button, and atmosphere vars automatically.
 * Override specific values via ThemeDefinition.kapsicum for fine-tuning.
 */
export function deriveKapsicumDefaults(
  colors: ColorStyles,
  colorScheme: 'light' | 'dark',
): KapsicumVars {
  const isDark = colorScheme === 'dark'
  const { background: bg, foreground: fg, accent: acc } = colors

  return {
    'bg-from': bg,
    'bg-to': shiftBrightness(bg, isDark ? 8 : -8),

    'surface-bg': rgba(acc, 0.035),
    'surface-blur': isDark ? '8px' : '0px',

    'border-right': rgba(acc, isDark ? 0.25 : 0.18),
    'border-bottom': rgba(isDark ? bg : fg, isDark ? 0.6 : 0.1),
    'border-top': rgba(isDark ? fg : bg, isDark ? 0.06 : 0.7),
    'border-left': rgba(isDark ? fg : bg, isDark ? 0.03 : 0.4),

    'shadow-card': isDark
      ? '0 1px 3px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.35)'
      : `0 1px 2px ${rgba(fg, 0.06)}, 0 2px 8px ${rgba(fg, 0.04)}`,
    'shadow-button': isDark
      ? `0 2px 8px ${rgba(bg, 0.6)}, 0 4px 12px ${rgba(acc, 0.12)}`
      : `0 1px 3px ${rgba(fg, 0.12)}, 0 2px 6px ${rgba(acc, 0.08)}`,

    'text-shadow-title': isDark ? '1px 1px 2px rgba(0,0,0,0.7)' : 'none',
    'text-secondary': rgba(fg, isDark ? 0.7 : 0.65),
    'text-tertiary': rgba(fg, isDark ? 0.5 : 0.45),
    'text-muted': rgba(fg, 0.3),

    'btn-gradient': `linear-gradient(135deg, ${acc} 0%, ${shiftBrightness(acc, isDark ? -30 : -20)} 100%)`,
    'btn-hover-shadow': isDark
      ? `0 4px 16px ${rgba(bg, 0.5)}, 0 8px 24px ${rgba(acc, 0.2)}`
      : `0 2px 8px ${rgba(fg, 0.12)}, 0 4px 12px ${rgba(acc, 0.12)}`,
    'btn-active-shadow': isDark
      ? 'inset 0 2px 4px rgba(0,0,0,0.5)'
      : `inset 0 2px 3px ${rgba(fg, 0.2)}`,

    'orb-1': `radial-gradient(ellipse 600px 400px at 10% 15%, ${rgba(acc, isDark ? 0.05 : 0.025)}, transparent 70%)`,
    'orb-2': `radial-gradient(ellipse 500px 500px at 90% 50%, ${rgba(acc, isDark ? 0.035 : 0.02)}, transparent 70%)`,
    'orb-3': `radial-gradient(ellipse 400px 300px at 50% 85%, ${rgba(acc, isDark ? 0.03 : 0.015)}, transparent 70%)`,
  }
}

/**
 * Merge auto-derived defaults with explicit theme overrides.
 * Returns all Kapsicum CSS var entries ready for injection.
 */
export function resolveKapsicum(
  colors: ColorStyles,
  colorScheme: 'light' | 'dark',
  overrides?: Partial<KapsicumVars>,
): KapsicumVars {
  return { ...deriveKapsicumDefaults(colors, colorScheme), ...overrides }
}
