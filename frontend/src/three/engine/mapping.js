// Pure DOM-rect <-> orthographic-world mapping. CSS-pixel space with a Y-down
// convention (world Y is negated screen Y) so a mesh lines up 1:1 with a DOM
// element. No three.js import here — keeps this unit-testable and out of the
// WebGL chunk.

/**
 * Center of a DOMRect mapped into world space (origin at top-left, Y down).
 * @param {{left:number,top:number,width:number,height:number}} rect
 * @returns {{x:number,y:number,width:number,height:number}}
 */
export function rectToPlacement(rect) {
  return {
    x: rect.left + rect.width / 2,
    y: -(rect.top + rect.height / 2),
    width: Math.max(rect.width, 0),
    height: Math.max(rect.height, 0),
  }
}

/**
 * Orthographic camera frustum for a viewport, in CSS-pixel units.
 * @param {number} width
 * @param {number} height
 * @returns {{left:number,right:number,top:number,bottom:number,near:number,far:number}}
 */
export function orthoFrustum(width, height) {
  return { left: 0, right: width, top: 0, bottom: -height, near: -1000, far: 1000 }
}

/**
 * Clamp device pixel ratio to protect fill-rate on high-DPI screens.
 * @param {number} dpr
 * @param {number} [max=2]
 * @returns {number}
 */
export function clampDpr(dpr, max = 2) {
  const n = Number.isFinite(dpr) && dpr > 0 ? dpr : 1
  return Math.min(n, max)
}
