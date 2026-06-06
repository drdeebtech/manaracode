import { useId as useReactId } from 'react'

/**
 * Stable id for wiring labels/aria attributes. Returns the caller-supplied id
 * when provided, otherwise a generated one (React 18 useId).
 *
 * @param {string} [provided]
 * @returns {string}
 */
export function useId(provided) {
  const generated = useReactId()
  return provided || generated
}
