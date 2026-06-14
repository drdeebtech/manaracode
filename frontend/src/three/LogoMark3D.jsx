import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { clampDpr } from './engine/mapping'
import { createLogoMark, disposeLogoMark } from './engine/logoMark'

// A small, SELF-CONTAINED foreground WebGL canvas for the navbar brand mark.
//
// Why a second context instead of the shared Engine: that engine's canvas lives
// behind the DOM (z-index: -1), and the navbar header is bg-surface +
// backdrop-blur, so a mark drawn there would be hidden/blurred. The navbar needs
// a crisp FOREGROUND mark, so it gets its own tiny renderer. Two contexts total
// is far under the browser cap and they are genuinely different layers.
//
// Decorative only (aria-hidden) — the "</>" wordmark + link own the semantics.

/**
 * @param {object} props
 * @param {boolean} [props.animate=true] when false (reduced motion) render a
 *   single static 3D frame with no spin loop.
 * @param {React.ReactNode} [props.fallback=null] rendered if WebGL init throws.
 */
export default function LogoMark3D({ animate = true, fallback = null }) {
  const canvasRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    let renderer
    let raf = 0
    const pointer = { x: 0, y: 0, hover: false }
    const onLost = (e) => e.preventDefault()
    canvas.addEventListener('webglcontextlost', onLost)

    // Hoisted so both the normal cleanup and the catch block can tear them down
    // regardless of where init fails.
    let mark
    let scene
    let ro = null
    let onMove
    let onEnter
    let onLeave
    let onVisibility

    const teardownListeners = () => {
      ro?.disconnect()
      if (onMove) window.removeEventListener('pointermove', onMove)
      if (onEnter) canvas.removeEventListener('pointerenter', onEnter)
      if (onLeave) canvas.removeEventListener('pointerleave', onLeave)
      if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onLost)
    }

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(clampDpr(window.devicePixelRatio))

      scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
      camera.position.set(0, 0, 4.2)

      // Light, near-white mark so it reads on the accent chip (like the favicon).
      mark = createLogoMark({
        primary: '#f3f7ff',
        secondary: '#dbe6ff',
        metalness: 0.55,
        roughness: 0.35,
        emissiveIntensity: 0.08,
      })
      mark.scale.setScalar(1.18)
      scene.add(mark)

      scene.add(new THREE.AmbientLight(0xffffff, 0.7))
      const key = new THREE.DirectionalLight(0xffffff, 1.6)
      key.position.set(2, 3, 4)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0x9ec5ff, 0.9)
      rim.position.set(-3, -1, 2)
      scene.add(rim)

      const size = () => {
        const rect = canvas.getBoundingClientRect()
        const w = Math.max(rect.width, 1)
        const h = Math.max(rect.height, 1)
        renderer.setPixelRatio(clampDpr(window.devicePixelRatio))
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        // A resize invalidates the framebuffer; the static (reduced-motion)
        // frame has no RAF loop to repaint it, so redraw it here.
        if (!animate) renderer.render(scene, camera)
      }
      size()

      ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(size) : null
      ro?.observe(canvas)

      onMove = (e) => {
        const rect = canvas.getBoundingClientRect()
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1
      }
      onEnter = () => {
        pointer.hover = true
      }
      onLeave = () => {
        pointer.hover = false
        pointer.x = 0
        pointer.y = 0
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      canvas.addEventListener('pointerenter', onEnter)
      canvas.addEventListener('pointerleave', onLeave)

      let last = performance.now()
      const renderOnce = () => renderer.render(scene, camera)

      if (!animate) {
        // Static 3D frame: a fixed, pleasing three-quarter pose, no loop.
        mark.rotation.set(-0.18, 0.5, 0)
        renderOnce()
      } else {
        const tick = (now) => {
          raf = requestAnimationFrame(tick)
          const dt = Math.min((now - last) / 1000, 0.1)
          last = now
          // Continuous gentle spin, faster on hover; pointer eases the tilt.
          mark.rotation.y += dt * (pointer.hover ? 1.1 : 0.45)
          const k = Math.min(dt * 5, 1)
          mark.rotation.x += (pointer.y * 0.35 - mark.rotation.x) * k
          renderOnce()
        }
        // Pause the loop while the tab is hidden so this foreground canvas
        // doesn't burn GPU on every desktop page (mirrors Engine.onVisibility).
        onVisibility = () => {
          if (document.hidden) {
            if (raf) cancelAnimationFrame(raf)
            raf = 0
          } else if (!raf) {
            last = performance.now()
            raf = requestAnimationFrame(tick)
          }
        }
        document.addEventListener('visibilitychange', onVisibility)
        if (!document.hidden) raf = requestAnimationFrame(tick)
      }

      return () => {
        if (raf) cancelAnimationFrame(raf)
        teardownListeners()
        disposeLogoMark(mark)
        renderer.dispose()
      }
    } catch {
      // WebGL init failed at runtime — show the DOM fallback instead.
      setFailed(true)
      teardownListeners()
      try {
        if (mark) disposeLogoMark(mark)
        renderer?.dispose()
      } catch {
        /* nothing more to clean up */
      }
      return undefined
    }
  }, [animate])

  if (failed) return fallback
  return <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />
}
