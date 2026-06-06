import { Suspense, lazy, useEffect, useState } from 'react'
import { useWebGLSupport } from '../hooks/useWebGLSupport'
import { useReducedMotion } from '../hooks/useReducedMotion'

// The static import() reference makes the bundler emit Scene3D (and the whole
// three/gsap graph) as a SEPARATE lazy chunk — it is never in the initial
// bundle even though SceneCanvas itself is.
const Scene3D = lazy(() => import('./Scene3D.lazy.jsx'))

const MIN_WIDTH = 768 // skip the WebGL layer on narrow/mobile to save data + GPU

/**
 * Gate for the decorative 3D layer. Mounts the engine only when WebGL is
 * available, motion is allowed, and the viewport is wide enough — and only
 * after first idle, so it never competes with initial render. When the gate
 * fails it renders nothing and three.js is never downloaded; the DOM controls
 * look and behave exactly the same.
 */
export function SceneCanvas() {
  const supported = useWebGLSupport()
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (supported !== true || reduced) return undefined
    if (typeof window === 'undefined' || window.innerWidth < MIN_WIDTH) return undefined
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setReady(true))
      : window.setTimeout(() => setReady(true), 200)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [supported, reduced])

  if (!ready) return null
  return (
    <Suspense fallback={null}>
      <Scene3D />
    </Suspense>
  )
}
