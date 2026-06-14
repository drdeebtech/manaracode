import { Suspense, lazy, useEffect, useState } from 'react'
import { Code2 } from 'lucide-react'
import { useWebGLSupport } from '../hooks/useWebGLSupport'
import { useReducedMotion } from '../hooks/useReducedMotion'

// The navbar brand chip. Renders a 3D WebGL "</>" mark when WebGL is available
// on a wide-enough viewport, and falls back to the flat Lucide icon otherwise.
// The 3D renderer is lazily imported so `three` stays out of the initial bundle
// (mirrors SceneCanvas).
const LogoMark3D = lazy(() => import('../three/LogoMark3D.jsx'))

// Match the shared 3D layer: skip WebGL (and the `three` download) on narrow
// viewports to save data + GPU (see SceneCanvas MIN_WIDTH).
const WIDE_QUERY = '(min-width: 768px)'

/** Reactive `min-width: 768px` check, SSR-safe (mirrors useReducedMotion). */
function useIsWide() {
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(WIDE_QUERY).matches,
  )
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const mql = window.matchMedia(WIDE_QUERY)
    setWide(mql.matches)
    const onChange = (e) => setWide(e.matches)
    // addEventListener is modern; fall back to addListener for Safari < 14.
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }
    mql.addListener(onChange)
    return () => mql.removeListener(onChange)
  }, [])
  return wide
}

function FallbackIcon() {
  return <Code2 className="w-4 h-4 text-white" aria-hidden="true" />
}

export default function BrandLogo() {
  const supported = useWebGLSupport()
  const reduced = useReducedMotion()
  const wide = useIsWide()

  return (
    <span className="relative w-8 h-8 flex-shrink-0 rounded-lg bg-accent flex items-center justify-center overflow-hidden">
      {supported === true && wide ? (
        // Even under reduced motion we still show a (static) 3D mark.
        <Suspense fallback={<FallbackIcon />}>
          <LogoMark3D animate={!reduced} fallback={<FallbackIcon />} />
        </Suspense>
      ) : (
        <FallbackIcon />
      )}
    </span>
  )
}
