import type { SiteConfig } from '~/types'

const config: SiteConfig = {
  // Absolute URL to the root of your published site, used for generating links and sitemaps.
  site: 'https://llk23r.github.io',
  // The name of your site, used in the title and for SEO.
  title: 'Code & Research Blog',
  // The description of your site, used for SEO and RSS feed.
  description:
    'A simple blog for sharing code, learnings, and research insights',
  // The author of the site, used in the footer, SEO, and RSS feed.
  author: 'llk23r',
  // Keywords for SEO, used in the meta tags.
  tags: ['Code', 'Programming', 'Learning', 'Research', 'Blog'],
  // Path to the image used for generating social media previews.
  // Needs to be a square JPEG file due to limitations of the social card generator.
  // Try https://squoosh.app/ to easily convert images to JPEG.
  socialCardAvatarImage: './src/content/avatar.jpg',
  // Font imported from @fontsource or elsewhere, used for the entire site.
  // To change this see src/styles/global.css and import a different font.
  font: 'JetBrains Mono Variable',
  // For pagination, the number of posts to display per page.
  // The homepage will display half this number in the "Latest Posts" section.
  pageSize: 6,
  // Whether Astro should resolve trailing slashes in URLs or not.
  // This value is used in the astro.config.mjs file and in the "Search" component to make sure pagefind links match this setting.
  // It is not recommended to change this, since most links existing in the site currently do not have trailing slashes.
  trailingSlashes: false,
  // The navigation links to display in the header.
  navLinks: [
    {
      name: 'Home',
      url: '/',
    },
    {
      name: 'About',
      url: '/about',
    },
    {
      name: 'Archive',
      url: '/posts',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/llk23r',
      external: true,
    },
  ],
  // The theming configuration for the site.
  themes: {
    mode: 'light-dark-auto',
    default: 'rose-pine-dawn',
    include: ['rose-pine-dawn', 'github-dark-dimmed', 'kanagawa-dragon'],
    overrides: {
      // Ember Chamber (dark) — ember to ash
      'kanagawa-dragon': {
        background: '#0C0804',
        foreground: '#F5EDE4',
        accent: '#E89050',
        heading1: '#F0A050',       // bright amber — the flame
        heading2: '#E08840',       // deep amber
        heading3: '#C87838',       // burnt sienna — the coal
        heading4: '#B06830',       // dark umber
        heading5: '#A08060',       // warm taupe — the ash
        heading6: '#907868',       // warm gray-brown
        separator: '#2A1C10',
        link: '#F0A050',
        list: '#E89050',
        note: '#6AACC4',          // warm steel blue
        tip: '#80A868',           // warm olive
        important: '#B888A8',     // warm mauve
        caution: '#E8C85A',       // golden ochre
        warning: '#D08050',       // burnt orange
        red: '#D08050',
        green: '#80A868',
        yellow: '#E8C85A',
        blue: '#6AACC4',
        magenta: '#B888A8',
        cyan: '#68B8A8',          // warm teal
      },
      // Grayscale (mid) — pure monochrome, no color anywhere
      // All values must clear 3:1 contrast against #2A2A2A bg (min ~#707070)
      'github-dark-dimmed': {
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
      // Warm Parchment (light) — hierarchy through contrast
      'rose-pine-dawn': {
        background: '#FAF6F1',
        foreground: '#2C1A0E',
        accent: '#B86020',
        heading1: '#8B4513',       // saddle brown — commanding
        heading2: '#A05520',       // burnt sienna
        heading3: '#B06830',       // lighter sienna
        heading4: '#9A7050',       // warm mid-brown
        heading5: '#887868',       // warm gray
        heading6: '#787070',       // warm charcoal
        separator: '#E0D0BC',
        link: '#9A5020',
        list: '#B86020',
        note: '#3A7098',          // deep warm steel
        tip: '#527A3A',           // dark olive
        important: '#7A5A72',     // warm plum
        caution: '#9A7A20',       // deep golden
        warning: '#B85830',       // warm brick
        red: '#B85830',
        green: '#527A3A',
        yellow: '#9A7A20',
        blue: '#3A7098',
        magenta: '#7A5A72',
        cyan: '#2A7A70',          // warm dark teal
      },
    },
  },
  // Social links to display in the footer.
  socialLinks: {
    github: 'https://github.com/llk23r',
    rss: true, // Set to true to include an RSS feed link in the footer
  },
  // Configuration for Giscus comments.
  // To set up Giscus, follow the instructions at https://giscus.app/
  // You'll need a GitHub repository with discussions enabled and the Giscus app installed.
  // Take the values from the generated script tag at https://giscus.app and fill them in here.
  // IMPORTANT: Update giscus.json in the root of the project with your own website URL
  // If you don't want to use Giscus, set this to undefined.
  giscus: undefined,
  // These are characters available for the character chat feature.
  // To add your own character, add an image file to the top-level `/public` directory
  // Make sure to compress the image to a web-friendly size (<100kb)
  // Try using the excellent https://squoosh.app web app for creating small webp files
  characters: {
    owl: '/owl.webp',
    unicorn: '/unicorn.webp',
    duck: '/duck.webp',
  },
}

export default config
