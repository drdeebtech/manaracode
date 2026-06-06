import { useEffect, useState } from 'react'

let cached = null

/**
 * Probe once whether the browser can give us a WebGL context. Result is cached
 * for the session. Returns null until the probe runs (treat as "not yet known"
 * → render the non-WebGL path), then a boolean.
 *
 * @returns {boolean|null}
 */
export function useWebGLSupport() {
  const [supported, setSupported] = useState(() => cached)

  useEffect(() => {
    if (cached === null) cached = probe()
    setSupported(cached)
  }, [])

  return supported
}

/** Test-only: clears the session probe cache so each test starts fresh. */
export function __resetWebGLSupportCache() {
  cached = null
}

function probe() {
  if (typeof document === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    return Boolean(gl)
  } catch {
    return false
  }
}
