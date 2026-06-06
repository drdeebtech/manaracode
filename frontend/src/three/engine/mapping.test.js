import { describe, expect, it } from 'vitest'
import { rectToPlacement, orthoFrustum, clampDpr } from './mapping'

describe('mapping', () => {
  it('rectToPlacement centers and negates Y (screen -> world)', () => {
    const p = rectToPlacement({ left: 100, top: 40, width: 200, height: 60 })
    expect(p).toEqual({ x: 200, y: -70, width: 200, height: 60 })
  })

  it('rectToPlacement clamps negative dimensions to 0', () => {
    const p = rectToPlacement({ left: 0, top: 0, width: -10, height: -5 })
    expect(p.width).toBe(0)
    expect(p.height).toBe(0)
  })

  it('orthoFrustum maps the viewport into CSS-pixel space, Y down', () => {
    expect(orthoFrustum(1280, 720)).toEqual({ left: 0, right: 1280, top: 0, bottom: -720, near: -1000, far: 1000 })
  })

  it('clampDpr clamps to [1, max] and defaults bad input to 1', () => {
    expect(clampDpr(3)).toBe(2)
    expect(clampDpr(1.5)).toBe(1.5)
    expect(clampDpr(0)).toBe(1)
    expect(clampDpr(undefined)).toBe(1)
    expect(clampDpr(3, 3)).toBe(3)
  })
})
