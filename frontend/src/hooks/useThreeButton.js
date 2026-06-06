/**
 * Registers a DOM button with the shared 3D scene so a decorative WebGL mesh
 * can track its position. NO-OP until the Three.js layer ships (later phase):
 * the 3D is purely decorative, so the button is fully functional without it.
 *
 * @param {import('react').RefObject<HTMLElement>} _ref
 * @param {{ id?: string, hoverColor?: string }} [_opts]
 * @returns {void}
 */
export function useThreeButton(_ref, _opts) {
  // Intentionally empty. The 3D engine, when present, will consume the same
  // ref/opts contract to attach a mesh. Keeping the call here means the public
  // Button API is stable across phases.
}
