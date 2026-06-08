import { useEffect } from 'react'
import { SITE_URL, routeMeta } from '../seo/routeMeta'

/** Create-or-update a <meta> tag, keyed by name or property. */
function setMeta(attr, key, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/** Create-or-update the canonical <link>. */
function setCanonical(href) {
  if (!href) return
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

/**
 * Keeps the document <head> in sync with the active route on the client:
 * title, description, canonical, and the OG/Twitter title/description/url.
 * This mirrors what scripts/prerender.js bakes into the static per-route HTML,
 * so a JS-running crawler (Googlebot) and a client navigating between routes
 * both see the same meta the prerenderer ships to non-JS crawlers.
 *
 * Pass `path` to pull title/description from the shared routeMeta source of
 * truth; explicit `title`/`description` props override it (e.g. the 404 page,
 * which has no static route).
 */
export default function PageMeta({ path, title, description, scrollTop = false }) {
  const meta = (path && routeMeta[path]) || {}
  const finalTitle = title || meta.title
  const finalDescription = description || meta.description
  const url = path
    ? `${SITE_URL}${path === '/' ? '/' : path}`
    : typeof window !== 'undefined'
      ? `${SITE_URL}${window.location.pathname}`
      : SITE_URL

  useEffect(() => {
    if (finalTitle) {
      document.title = finalTitle
      setMeta('property', 'og:title', finalTitle)
      setMeta('name', 'twitter:title', finalTitle)
    }
    if (finalDescription) {
      setMeta('name', 'description', finalDescription)
      setMeta('property', 'og:description', finalDescription)
      setMeta('name', 'twitter:description', finalDescription)
    }
    setMeta('property', 'og:url', url)
    setCanonical(url)
    if (scrollTop) window.scrollTo(0, 0)
  }, [finalTitle, finalDescription, url, scrollTop])

  return null
}
