import * as THREE from 'three'

// A soft radial-gradient texture used as an additive glow behind buttons.
// Generated on a 2D canvas and cached PER COLOR so different accent colors get
// their own texture (a single global cache would return the first color forever).

const glowTextures = new Map() // color -> THREE.CanvasTexture

/**
 * @param {string} [color='#60a5fa'] center color of the glow
 * @returns {THREE.Texture}
 */
export function getGlowTexture(color = '#60a5fa') {
  const cached = glowTextures.get(color)
  if (cached) return cached
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, color)
  grad.addColorStop(0.5, color)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.globalAlpha = 1
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  glowTextures.set(color, texture)
  return texture
}

/** Dispose every cached glow texture and clear the cache (call on engine teardown). */
export function disposeGlowTextures() {
  for (const texture of glowTextures.values()) texture.dispose()
  glowTextures.clear()
}

/**
 * A unit plane (1x1) glow sprite, scaled per-frame to the button size.
 * Additive blending so it reads as light, transparent and depth-write-free so
 * it never occludes.
 * @returns {THREE.Mesh}
 */
export function createGlowMesh(color = '#60a5fa') {
  const geometry = new THREE.PlaneGeometry(1, 1)
  const material = new THREE.MeshBasicMaterial({
    map: getGlowTexture(color),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  })
  return new THREE.Mesh(geometry, material)
}
