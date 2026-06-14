import * as THREE from 'three'
import { getEntries, subscribe } from './registry'
import { rectToPlacement, orthoFrustum, clampDpr } from './mapping'
import { createGlowMesh, disposeGlowTextures } from './glow'
import { createLogoMark, disposeLogoMark } from './logoMark'
import { getGsap } from './gsapHooks'

// THE single WebGL context for the whole app. One renderer, one scene, one
// orthographic camera (CSS-pixel space), one RAF loop. "WebGL buttons
// everywhere" are glow meshes in THIS scene tracked to DOM rects — never N
// canvases (browsers cap ~16 live contexts). Decorative only: the real DOM
// controls own all interaction; this layer is aria-hidden.

const GLOW_PAD = 1.6 // glow extends beyond the button

// Resolve a CSS custom property (e.g. an oklch token) to an rgb/hex string the
// renderer understands — so the 3D layer matches the active theme accent.
// getComputedStyle returns the color in its authored model, and modern browsers
// keep oklch() as oklch(); three.js can't parse that, so we round-trip through a
// canvas 2D context, whose fillStyle getter always serializes to #rrggbb/rgba().
function cssVarColor(varName, fallback) {
  try {
    if (!document.body) return fallback
    const probe = document.createElement('span')
    probe.style.color = `var(${varName}, ${fallback})`
    probe.style.display = 'none'
    document.body.appendChild(probe)
    const computed = getComputedStyle(probe).color
    document.body.removeChild(probe)
    // Rasterize one pixel and read its sRGB bytes back: getImageData always
    // returns 0-255 rgb regardless of the input model (oklch, color(), etc.),
    // so three.js gets a model it can parse.
    const ctx = document.createElement('canvas').getContext('2d')
    ctx.fillStyle = computed || fallback
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    return `rgb(${r}, ${g}, ${b})`
  } catch {
    return fallback
  }
}

export class Engine {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(clampDpr(window.devicePixelRatio))
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera()
    this.glows = new Map() // registry id -> THREE.Mesh
    this.hero = null
    this.running = false
    this.lastTime = 0
    this.pointer = { x: 0, y: 0 }
    this.accent = cssVarColor('--color-accent', '#60a5fa') // matches the active theme
    this.accent2 = cssVarColor('--color-accent-2', '#7c3aed') // secondary hue for the wireframe shell
    // SceneCanvas already gates the whole layer off under reduced-motion; this is
    // defense-in-depth for a mid-session toggle (the RAF spin/tilt below run
    // outside framer-motion's MotionConfig, so they need their own guard).
    this.reduceMotion =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false

    this.resize = this.resize.bind(this)
    this.onVisibility = this.onVisibility.bind(this)
    this.onPointer = this.onPointer.bind(this)
    this.tick = this.tick.bind(this)

    this.resize()
    this.buildHero()
    this.unsubscribe = subscribe(() => this.syncGlows())
    this.syncGlows()

    window.addEventListener('resize', this.resize)
    document.addEventListener('visibilitychange', this.onVisibility)
    window.addEventListener('pointermove', this.onPointer, { passive: true })
  }

  start() {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.raf = requestAnimationFrame(this.tick)
  }

  stop() {
    this.running = false
    if (this.raf) cancelAnimationFrame(this.raf)
  }

  resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setPixelRatio(clampDpr(window.devicePixelRatio))
    this.renderer.setSize(w, h, false)
    const f = orthoFrustum(w, h)
    Object.assign(this.camera, f)
    this.camera.updateProjectionMatrix()
    this.camera.position.z = 100
  }

  onVisibility() {
    if (document.hidden) this.stop()
    else this.start()
  }

  onPointer(e) {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    this.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  }

  buildHero() {
    const anchor = document.querySelector('[data-three-hero]')
    if (!anchor) return
    const group = new THREE.Group()
    // The hero object IS the brand mark: a two-tone, metallic, extruded "</>"
    // (accent chevrons, secondary-hue slash) that pops in and slowly spins.
    const mesh = createLogoMark({ primary: this.accent, secondary: this.accent2 })
    group.add(mesh)
    group.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dir = new THREE.DirectionalLight(0xffffff, 1.1)
    dir.position.set(2, 3, 4)
    group.add(dir)
    group.userData.anchor = anchor
    group.userData.mesh = mesh
    group.scale.setScalar(0.001)
    this.scene.add(group)
    this.hero = group
    // GSAP owns the 3D entrance + continuous spin (role split: GSAP=timelines).
    // Skip the continuous spin under reduced-motion (the entrance pop is a one-off
    // and stays); pointer tilt is also gated in tick().
    getGsap().then(({ gsap }) => {
      gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'expo.out' })
      if (!this.reduceMotion) {
        gsap.to(mesh.rotation, { y: Math.PI * 2, duration: 18, ease: 'none', repeat: -1 })
      }
    })
  }

  syncGlows() {
    const entries = getEntries()
    // Remove glows whose element is gone.
    for (const [id, mesh] of this.glows) {
      if (!entries.has(id)) {
        this.scene.remove(mesh)
        mesh.material.dispose()
        mesh.geometry.dispose()
        this.glows.delete(id)
      }
    }
    // Add glows for new registrations.
    for (const [id] of entries) {
      if (!this.glows.has(id)) {
        const mesh = createGlowMesh(this.accent)
        this.scene.add(mesh)
        this.glows.set(id, mesh)
      }
    }
  }

  tick(now) {
    if (!this.running) return
    this.raf = requestAnimationFrame(this.tick)
    const dt = Math.min((now - this.lastTime) / 1000, 0.1)
    this.lastTime = now

    const entries = getEntries()
    for (const [id, mesh] of this.glows) {
      const entry = entries.get(id)
      if (!entry || !entry.el.isConnected) {
        mesh.visible = false
        continue
      }
      const p = rectToPlacement(entry.el.getBoundingClientRect())
      mesh.visible = true
      mesh.position.set(p.x, p.y, 0)
      mesh.scale.set(p.width * GLOW_PAD, p.height * GLOW_PAD, 1)
      const hovered = entry.el.matches(':hover')
      const target = hovered ? 0.6 : 0.12 // faint at rest so the glow is a designed presence
      mesh.material.opacity += (target - mesh.material.opacity) * Math.min(dt * 10, 1)
    }

    if (this.hero) {
      const p = rectToPlacement(this.hero.userData.anchor.getBoundingClientRect())
      const r = Math.min(this.hero.userData.anchor.clientWidth, this.hero.userData.anchor.clientHeight) * 0.42
      this.hero.position.set(p.x, p.y, 1)
      this.hero.userData.mesh.scale.setScalar(r)
      // Real pointer reactivity on both axes, eased toward target so it glides
      // rather than snaps (transform-only, cheap). GSAP owns the continuous
      // y-spin of the mesh, so pointer-x drives the parent group instead.
      if (!this.reduceMotion) {
        const mesh = this.hero.userData.mesh
        const k = Math.min(dt * 4, 1)
        mesh.rotation.x += (this.pointer.y * 0.3 - mesh.rotation.x) * k
        this.hero.rotation.y += (this.pointer.x * 0.25 - this.hero.rotation.y) * k
      }
    }

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.stop()
    this.unsubscribe?.()
    window.removeEventListener('resize', this.resize)
    document.removeEventListener('visibilitychange', this.onVisibility)
    window.removeEventListener('pointermove', this.onPointer)
    for (const mesh of this.glows.values()) {
      mesh.material.dispose()
      mesh.geometry.dispose()
    }
    this.glows.clear()
    if (this.hero) {
      // Dispose the logo mark's bar geometries + materials (lights need none).
      disposeLogoMark(this.hero.userData.mesh)
    }
    disposeGlowTextures() // free the per-color cached glow textures
    this.renderer.dispose()
  }
}

let engine = null

/** Boot the singleton engine onto a canvas. Idempotent. */
export function startEngine(canvas) {
  if (engine) return engine
  engine = new Engine(canvas)
  engine.start()
  return engine
}

/** Tear down the singleton engine. */
export function stopEngine() {
  if (!engine) return
  engine.dispose()
  engine = null
}
