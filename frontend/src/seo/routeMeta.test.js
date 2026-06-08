import { describe, test, expect } from 'vitest'
import { SITE_URL, routeMeta } from './routeMeta'
import { esc, renderRoute } from '../../scripts/prerender.js'

// A minimal stand-in for the built dist/index.html head — same tag shapes the
// real prerenderer rewrites, so the test exercises every replacement.
const TEMPLATE = `<!DOCTYPE html><html><head>
<title>Default</title>
<meta name="description" content="default desc" />
<link rel="canonical" href="https://manaracode.com/" />
<meta property="og:url" content="https://manaracode.com/" />
<meta property="og:title" content="default" />
<meta property="og:description" content="default" />
<meta name="twitter:title" content="default" />
<meta name="twitter:description" content="default" />
</head><body></body></html>`

describe('routeMeta', () => {
  test('covers every static route with non-empty, SEO-sane meta', () => {
    const paths = ['/', '/about', '/work', '/privacy', '/terms']
    for (const p of paths) {
      const m = routeMeta[p]
      expect(m, `routeMeta missing ${p}`).toBeTruthy()
      expect(m.title.length).toBeGreaterThan(0)
      expect(m.title.length).toBeLessThanOrEqual(65)
      expect(m.description.length).toBeGreaterThan(0)
      expect(m.description.length).toBeLessThanOrEqual(185)
    }
  })
})

describe('esc', () => {
  test('escapes HTML-significant characters', () => {
    expect(esc('a & b < c > d "e"')).toBe('a &amp; b &lt; c &gt; d &quot;e&quot;')
  })
})

describe('renderRoute', () => {
  test('injects the route title, description, and canonical URL', () => {
    const html = renderRoute(TEMPLATE, '/about', routeMeta['/about'])
    expect(html).toContain(`<title>${esc(routeMeta['/about'].title)}</title>`)
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/about" />`)
    expect(html).toContain(`content="${esc(routeMeta['/about'].description)}"`)
    expect(html).not.toContain('<title>Default</title>')
  })

  test('escapes ampersands in the Work title (HTML-safe)', () => {
    const html = renderRoute(TEMPLATE, '/work', routeMeta['/work'])
    expect(html).toContain('&amp;')
    expect(html).not.toMatch(/<title>[^<]*\s&\s[^<]*<\/title>/) // no raw " & " in <title>
  })

  test('root route canonical keeps the trailing slash', () => {
    const html = renderRoute(TEMPLATE, '/', routeMeta['/'])
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/" />`)
  })

  test('throws if an expected tag is missing from the template', () => {
    expect(() => renderRoute('<html><head></head></html>', '/about', routeMeta['/about'])).toThrow()
  })
})
