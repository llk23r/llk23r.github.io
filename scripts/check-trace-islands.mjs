import { readFile } from 'node:fs/promises'
import path from 'node:path'

const traceSlugs = [
  'trace-clock',
  'trace-electromagnetism',
  'trace-sockets',
  'trace-llm-scale',
]

let totalIslands = 0

for (const slug of traceSlugs) {
  const outputPath = path.join('dist', 'posts', slug, 'index.html')
  const html = await readFile(outputPath, 'utf8')
  const islands = html.match(/<astro-island\b[\s\S]*?<\/astro-island>/g) ?? []
  const visibleIslands = html.match(/<astro-island\b[^>]*\bclient="visible"/g) ?? []
  const emptyIslands = html.match(/<astro-island\b[^>]*>\s*<\/astro-island>/g) ?? []

  if (islands.length === 0) {
    throw new Error(`${slug}: production output contains no Astro islands`)
  }
  if (visibleIslands.length !== islands.length) {
    throw new Error(
      `${slug}: expected ${islands.length} client:visible islands, found ${visibleIslands.length}`,
    )
  }
  if (emptyIslands.length > 0) {
    throw new Error(
      `${slug}: found ${emptyIslands.length} islands without server-rendered content`,
    )
  }

  const cssUrls = [...html.matchAll(/href="([^"?]+\.css)(?:\?[^\"]*)?"/g)].map(
    (match) => match[1],
  )
  const css = (
    await Promise.all(
      cssUrls.map((url) =>
        readFile(path.join('dist', decodeURIComponent(url).replace(/^\//, '')), 'utf8'),
      ),
    )
  ).join('\n')
  const scopeClasses = new Set(
    [...islands.join('\n').matchAll(/\bsvelte-[a-z0-9-]+\b/g)].map((match) => match[0]),
  )
  const missingStyles = [...scopeClasses].filter(
    (className) => !css.includes(`.${className}`),
  )

  if (scopeClasses.size === 0) {
    throw new Error(`${slug}: server-rendered islands contain no Svelte scope classes`)
  }
  if (missingStyles.length > 0) {
    throw new Error(`${slug}: missing extracted CSS for ${missingStyles.join(', ')}`)
  }

  totalIslands += islands.length
  console.log(`${slug}: ${islands.length} styled, server-rendered islands`)
}

console.log(`TRACE island check passed: ${totalIslands} islands`)
