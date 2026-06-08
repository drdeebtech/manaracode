import { useEffect } from 'react'

/**
 * Sets the document <title> and meta description for the current route, and
 * optionally scrolls to top on mount. A lightweight stand-in for react-helmet
 * until the site moves to prerendering/SSG (the proper SEO path for content
 * pages). The caller passes the full title string.
 */
export default function PageMeta({ title, description, scrollTop = false }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
    if (scrollTop) window.scrollTo(0, 0)
  }, [title, description, scrollTop])

  return null
}
