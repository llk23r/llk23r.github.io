import type { SiteConfig } from './types'
import parchment from './themes/parchment'
import grayscale from './themes/grayscale'
import emberChamber from './themes/ember-chamber'

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
  // Theming — each theme is a self-contained file in src/themes/.
  // To add a theme: create a new file in src/themes/, import it here, and add to include[].
  themes: {
    mode: 'light-dark-auto',
    default: 'rose-pine-dawn',
    include: [parchment, grayscale, emberChamber],
  },
  // Social links to display in the footer.
  socialLinks: {
    github: 'https://github.com/llk23r',
    rss: true,
  },
}

export default config
