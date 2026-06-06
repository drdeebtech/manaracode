import { useEffect, useRef } from 'react'
import { startEngine, stopEngine } from './engine/Engine'

// Lazy chunk entry. Everything reachable from here (Engine -> three, gsap, GLTF
// loaders) is excluded from the initial bundle. Mounts the single full-viewport
// canvas behind the DOM and boots the engine.

export default function Scene3D() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return undefined
    // Context loss must not blank the page; the DOM controls keep working.
    const onLost = (e) => e.preventDefault()
    canvas.addEventListener('webglcontextlost', onLost)
    try {
      startEngine(canvas)
    } catch {
      // WebGL init failed at runtime — leave the DOM untouched, no 3D.
    }
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost)
      stopEngine()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      style={{ zIndex: 'var(--z-canvas, -1)' }}
    />
  )
}
