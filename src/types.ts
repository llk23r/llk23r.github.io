import type { CollectionEntry, DataEntryMap } from 'astro:content'

export interface FrontmatterImage {
  alt: string
  src: {
    height: number
    src: string
    width: number
    format: 'avif' | 'png' | 'webp' | 'jpeg' | 'jpg' | 'svg' | 'tiff' | 'gif'
  }
}

export interface Collation<CollectionType extends keyof DataEntryMap> {
  title: string
  url: string
  titleSlug: string
  entries: CollectionEntry<CollectionType>[]
}

export interface CollationGroup<CollectionType extends keyof DataEntryMap> {
  title: string
  url: string
  collations: Collation<CollectionType>[]
  // Return this.collations to allow chaining
  sortCollationsAlpha(): Collation<CollectionType>[]
  sortCollationsMostRecent(): Collation<CollectionType>[]
  sortCollationsLargest(): Collation<CollectionType>[]
  add(item: CollectionEntry<CollectionType>, rawKey: string): void
  match(title: string): Collation<CollectionType> | undefined
  matchMany(titles: string[]): Collation<CollectionType>[] | undefined
}

export type NavLink = {
  name: string
  url: string
  external?: boolean
}

export type AdmonitionType = 'tip' | 'note' | 'important' | 'caution' | 'warning'

export const themeKeys = [
  'foreground',
  'background',
  'accent',
  // Markdown styles
  'heading1',
  'heading2',
  'heading3',
  'heading4',
  'heading5',
  'heading6',
  'list',
  'separator',
  'italic',
  'link',
  // For admonition styling
  'note',
  'tip',
  'important',
  'caution',
  'warning',
  // Terminal colors
  'blue',
  'green',
  'red',
  'yellow',
  'magenta',
  'cyan',
] as const

export type ThemeKey = (typeof themeKeys)[number]

export type TextmateStyles = {
  [key in ThemeKey]: string[]
}

export type ColorStyles = {
  [key in ThemeKey]: string
}

export interface KapsicumVars {
  'bg-from': string
  'bg-to': string
  'surface-bg': string
  'surface-blur': string
  'border-right': string
  'border-bottom': string
  'border-top': string
  'border-left': string
  'shadow-card': string
  'shadow-button': string
  'text-shadow-title': string
  'text-secondary': string
  'text-tertiary': string
  'text-muted': string
  'btn-gradient': string
  'btn-hover-shadow': string
  'btn-active-shadow': string
  'orb-1': string
  'orb-2': string
  'orb-3': string
}

export interface ThemeDefinition {
  /** Shiki bundled theme name for code syntax highlighting */
  shikiTheme: string
  /** Human-readable label shown in theme picker */
  label: string
  /** Color scheme: 'light' or 'dark' */
  colorScheme: 'light' | 'dark'
  /** 25 base semantic colors (become --theme-* CSS vars) */
  colors: ColorStyles
  /** Override the site-wide font for this theme (e.g., 'Lora Variable').
   *  Omit to use siteConfig.font. */
  font?: string
  /** CSS font-family fallback stack for this theme (e.g., 'serif').
   *  Omit to use 'monospace'. */
  fontFallback?: string
  /** Kapsicum visual language overrides (become --kap-* CSS vars).
   *  Omitted values are auto-derived from colors + colorScheme. */
  kapsicum?: Partial<KapsicumVars>
  /** Extra CSS custom properties (e.g., --theme-orange for special use) */
  extraVars?: Record<string, string>
  /** Extra CSS rules injected after the theme block (e.g., grayscale filters) */
  extraCss?: string
}

export interface ThemesConfig {
  default: string
  mode: 'single' | 'light-dark-auto' | 'select'
  include: ThemeDefinition[]
}

export type SocialLinks = {
  github?: string
  twitter?: string
  mastodon?: string
  bluesky?: string
  linkedin?: string
  email?: string
  rss?: boolean
}

export interface SiteConfig {
  site: string
  font: string
  title: string
  description: string
  author: string
  socialCardAvatarImage: string
  tags: string[]
  pageSize: number
  trailingSlashes: boolean
  themes: ThemesConfig
  socialLinks: SocialLinks
  navLinks: NavLink[]
}
