// Build-time prerenderer: bakes per-route <head> metadata into static HTML.
//
// Vite emits a single dist/index.html for this SPA, so every route ships the
// homepage's title/description/canonical/OG tags in its initial HTML. Crawlers
// that don't run JS (Twitter, Slack, LinkedIn, WhatsApp, Facebook, and SERP
// snippet generation) therefore see the wrong meta for /about, /work, etc.
//
// This script runs after `vite build`. It reads the built dist/index.html as a
// template and writes one HTML file per route in routeMeta with the correct
// title, description, canonical, and OG/Twitter tags injected. nginx serves
// dist/<route>/index.html for `/<route>` automatically via `try_files $uri
// $uri/ /index.html` — no server change needed. Asset URLs in the template are
// absolute (/assets/…), so the copies in subdirectories load correctly.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { SITE_URL, routeMeta } from '../src/seo/routeMeta.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const templatePath = join(distDir, 'index.html')

/** Escape a value for safe insertion into HTML text and attributes. */
export const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/**
 * Replace the value inside a tag matched by `pattern` (two capture groups: the
 * prefix up to the value, and the suffix after it). Throws if the tag is
 * missing so a template change can never silently ship stale meta.
 */
function replaceAttr(html, pattern, label, value) {
  if (!pattern.test(html)) {
    throw new Error(`prerender: expected to find ${label} in index.html template`)
  }
  return html.replace(pattern, (_m, pre, post) => `${pre}${esc(value)}${post}`)
}

/** Produce the HTML for one route from the template. */
export function renderRoute(template, path, meta) {
  const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
  let html = template

  // <title> is text content, not an attribute.
  if (!/<title>[\s\S]*?<\/title>/.test(html)) {
    throw new Error('prerender: expected to find <title> in index.html template')
  }
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)

  // In each pattern the old value sits between the two capture groups (matched
  // by [^"]* and discarded); replaceAttr stitches prefix + new value + closing
  // quote back together.
  html = replaceAttr(html, /(<meta name="description" content=")[^"]*(")/, 'meta description', meta.description)
  html = replaceAttr(html, /(<link rel="canonical" href=")[^"]*(")/, 'canonical link', url)
  html = replaceAttr(html, /(<meta property="og:url" content=")[^"]*(")/, 'og:url', url)
  html = replaceAttr(html, /(<meta property="og:title" content=")[^"]*(")/, 'og:title', meta.title)
  html = replaceAttr(html, /(<meta property="og:description" content=")[^"]*(")/, 'og:description', meta.description)
  html = replaceAttr(html, /(<meta name="twitter:title" content=")[^"]*(")/, 'twitter:title', meta.title)
  html = replaceAttr(html, /(<meta name="twitter:description" content=")[^"]*(")/, 'twitter:description', meta.description)

  return html
}

async function main() {
  const template = await readFile(templatePath, 'utf8')

  for (const [path, meta] of Object.entries(routeMeta)) {
    const html = renderRoute(template, path, meta)
    if (path === '/') {
      // Overwrite the root template so the homepage's served meta matches too.
      await writeFile(templatePath, html, 'utf8')
    } else {
      const outDir = join(distDir, path.replace(/^\//, ''))
      await mkdir(outDir, { recursive: true })
      await writeFile(join(outDir, 'index.html'), html, 'utf8')
    }
    console.log(`prerendered ${path} -> ${path === '/' ? 'dist/index.html' : `dist${path}/index.html`}`)
  }
}

// Only run the build step when invoked directly (node scripts/prerender.js),
// not when imported by a test.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
