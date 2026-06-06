import { useEffect } from 'react'
import { registerElement, unregisterElement } from '../three/engine/registry'

/**
 * Registers a DOM element with the shared 3D scene so a decorative WebGL mesh
 * can track its position. The registry is three-free and cheap; the actual
 * engine reads it only if it mounts (WebGL present + motion allowed). When the
 * engine never mounts this is a harmless bookkeeping no-op — the element stays
 * a fully functional DOM control regardless.
 *
 * @param {import('react').RefObject<HTMLElement>|null} ref
 * @param {{ variant?: string }} [opts]
 * @returns {void}
 */
export function useThreeButton(ref, opts = {}) {
  const variant = opts.variant
  useEffect(() => {
    const el = ref && ref.current
    if (!el) return undefined
    const id = registerElement(el, { variant })
    return () => unregisterElement(id)
  }, [ref, variant])
}
