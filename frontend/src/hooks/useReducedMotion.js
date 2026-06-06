import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Reports whether the user has requested reduced motion. SSR-safe (returns
 * false until mounted) and updates live if the OS preference changes.
 *
 * @returns {boolean}
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches,
  )

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(QUERY)
    setReduced(mql.matches)
    const onChange = (e) => setReduced(e.matches)
    // addEventListener is modern; fall back to addListener for Safari < 14.
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }
    mql.addListener(onChange)
    return () => mql.removeListener(onChange)
  }, [])

  return reduced
}
