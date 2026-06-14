import { Suspense, lazy, useEffect, useState } from 'react'
import { Code2 } from 'lucide-react'
import { useWebGLSupport } from '../hooks/useWebGLSupport'
import { useReducedMotion } from '../hooks/useReducedMotion'
import ErrorBoundary from './ErrorBoundary'

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
  const [ready, setReady] = useState(false)

  // Defer the `three` chunk to first idle so it never races initial paint
  // (mirrors SceneCanvas) — the FallbackIcon shows until then.
  useEffect(() => {
    if (supported !== true || !wide) {
      setReady(false) // re-defer to idle if gating turns back on later
      return undefined
    }
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReady(true))
      : window.setTimeout(() => setReady(true), 200)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [supported, wide])

  const show3d = supported === true && wide && ready

  return (
    <span className="relative w-8 h-8 flex-shrink-0 rounded-lg bg-accent flex items-center justify-center overflow-hidden">
      {show3d ? (
        // Even under reduced motion we still show a (static) 3D mark. The error
        // boundary catches a failed lazy-chunk download → flat icon, no crash.
        <ErrorBoundary fallback={<FallbackIcon />}>
          <Suspense fallback={<FallbackIcon />}>
            <LogoMark3D animate={!reduced} fallback={<FallbackIcon />} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <FallbackIcon />
      )}
    </span>
  )
}
