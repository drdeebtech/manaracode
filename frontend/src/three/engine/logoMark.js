import * as THREE from 'three'

// The manaracode "</>" brand mark, built as extruded 3D geometry centered in a
// ~2-unit-wide box (x:[-1,1], y:[-0.85,0.85]). three-only (no React) so it is
// shared by BOTH WebGL paths: the decorative hero object in the shared Engine
// and the small foreground canvas in the navbar (LogoMark3D). Matches the flat
// favicon mark (public/favicon.svg): two chevrons + a center slash.

// Depth/bevel for every bar — a chiseled metallic edge that catches the lights.
const EXTRUDE = {
  depth: 0.34,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelSegments: 2,
  curveSegments: 10,
}

// Total Z extent including both bevel lips, used to recenter the geometry on Z
// so the mark spins about its own middle rather than its front face.
const Z_CENTER = (EXTRUDE.depth + EXTRUDE.bevelThickness * 2) / 2

/**
 * A rounded-capsule outline: a `length`-long bar of the given `thickness` with
 * semicircular end caps. Centered at the origin, running along +X.
 * @param {number} length total length including the two caps
 * @param {number} thickness bar height (cap diameter)
 * @returns {THREE.Shape}
 */
function barShape(length, thickness) {
  const r = thickness / 2
  const half = Math.max(length / 2 - r, 0.0001) // straight-section half-length
  const s = new THREE.Shape()
  s.moveTo(-half, -r)
  s.lineTo(half, -r)
  s.absarc(half, 0, r, -Math.PI / 2, Math.PI / 2, false) // right cap
  s.lineTo(-half, r)
  s.absarc(-half, 0, r, Math.PI / 2, (3 * Math.PI) / 2, false) // left cap
  return s
}

/**
 * A single extruded bar running from p1 to p2. The cap radius extends the bar by
 * `thickness` so adjacent bars overlap at their joints (clean chevron corners).
 * @param {[number, number]} p1
 * @param {[number, number]} p2
 * @param {number} thickness
 * @param {THREE.Material} material
 * @returns {THREE.Mesh}
 */
function makeBar(p1, p2, thickness, material) {
  const dx = p2[0] - p1[0]
  const dy = p2[1] - p1[1]
  const len = Math.hypot(dx, dy) + thickness
  const geo = new THREE.ExtrudeGeometry(barShape(len, thickness), EXTRUDE)
  geo.translate(0, 0, -Z_CENTER) // center depth so it spins about its middle
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, 0)
  mesh.rotation.z = Math.atan2(dy, dx)
  return mesh
}

/**
 * Build the "</>" mark as a THREE.Group of five beveled bars: the left chevron
 * and right chevron in `primary`, the center slash in `secondary`. Metallic with
 * a faint emissive lift (same family as the hero material). Materials are stashed
 * on `group.userData.materials` for disposal via {@link disposeLogoMark}.
 *
 * @param {object} [opts]
 * @param {string|number} [opts.primary='#60a5fa'] chevron color
 * @param {string|number} [opts.secondary='#7c3aed'] slash color
 * @param {number} [opts.metalness=0.7]
 * @param {number} [opts.roughness=0.28]
 * @param {number} [opts.emissiveIntensity=0.18]
 * @returns {THREE.Group}
 */
export function createLogoMark({
  primary = '#60a5fa',
  secondary = '#7c3aed',
  metalness = 0.7,
  roughness = 0.28,
  emissiveIntensity = 0.18,
} = {}) {
  const group = new THREE.Group()
  const matMain = new THREE.MeshStandardMaterial({
    color: primary,
    metalness,
    roughness,
    emissive: primary,
    emissiveIntensity,
  })
  const matSlash = new THREE.MeshStandardMaterial({
    color: secondary,
    metalness,
    roughness,
    emissive: secondary,
    emissiveIntensity: emissiveIntensity + 0.04,
  })
  const t = 0.34 // bar thickness

  // Left chevron "<" — tip at the left, arms opening to the right.
  group.add(makeBar([-0.95, 0], [-0.3, 0.62], t, matMain))
  group.add(makeBar([-0.95, 0], [-0.3, -0.62], t, matMain))
  // Right chevron ">" — tip at the right, arms opening to the left.
  group.add(makeBar([0.95, 0], [0.3, 0.62], t, matMain))
  group.add(makeBar([0.95, 0], [0.3, -0.62], t, matMain))
  // Center slash "/" — bottom-left to top-right.
  group.add(makeBar([-0.28, -0.7], [0.28, 0.7], t, matSlash))

  group.userData.materials = [matMain, matSlash]
  return group
}

/**
 * Dispose every geometry and material of a mark built by {@link createLogoMark}.
 * @param {THREE.Group} group
 */
export function disposeLogoMark(group) {
  group.traverse((o) => {
    if (o.isMesh) o.geometry.dispose()
  })
  for (const m of group.userData.materials || []) m.dispose()
}
