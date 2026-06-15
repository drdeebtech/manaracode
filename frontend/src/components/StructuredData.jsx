import { useEffect } from 'react'

/**
 * StructuredData — injects per-route JSON-LD into the document head.
 *
 * Currently emits a BreadcrumbList for non-home routes (helps search engines
 * render breadcrumb trails in results). The site-wide Organization schema lives
 * statically in index.html. Mirrors the imperative head-management pattern used
 * by PageMeta so SSR/prerender stays untouched.
 *
 * NOTE: Service/offer schema was intentionally omitted — describing it correctly
 * needs Organization + hasOfferCatalog/OfferCatalog (not LocalBusiness, which
 * requires a physical address). Add it as a focused follow-up if desired.
 */

const SITE_URL = 'https://manaracode.com'

/** Breadcrumb trails per route (home is the implicit root, so it has none). */
const breadcrumbs = {
  '/about': [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'About', url: `${SITE_URL}/about` },
  ],
  '/work': [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Work', url: `${SITE_URL}/work` },
  ],
  '/privacy': [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Privacy Policy', url: `${SITE_URL}/privacy` },
  ],
  '/terms': [
    { name: 'Home', url: `${SITE_URL}/` },
    { name: 'Terms of Use', url: `${SITE_URL}/terms` },
  ],
}

/**
 * Build a BreadcrumbList schema for a path, or null when none is defined.
 * @param {string} path - route path (e.g. '/about')
 * @returns {object|null}
 */
function getBreadcrumbSchema(path) {
  const crumbs = breadcrumbs[path]
  if (!crumbs) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

/**
 * Inject, update, or remove a JSON-LD <script> keyed by data-schema-id so
 * multiple schemas can coexist without clobbering each other.
 * @param {string} dataId
 * @param {object|null} schema
 */
function setStructuredDataSchema(dataId, schema) {
  const existing = document.head.querySelector(`script[data-schema-id="${dataId}"]`)

  if (!schema) {
    if (existing) existing.remove()
    return
  }

  const tag = existing ?? document.createElement('script')
  if (!existing) {
    tag.setAttribute('type', 'application/ld+json')
    tag.setAttribute('data-schema-id', dataId)
    document.head.appendChild(tag)
  }
  tag.textContent = JSON.stringify(schema)
}

/**
 * Injects per-route structured data. Renders nothing.
 * @param {{ path: string }} props
 */
export default function StructuredData({ path }) {
  useEffect(() => {
    setStructuredDataSchema('breadcrumb', getBreadcrumbSchema(path))
  }, [path])

  return null
}
