// DOM-element registry shared between React (via useThreeButton) and the WebGL
// engine. Intentionally three-free so it stays in the main bundle while the
// engine code is lazy-loaded. Registering when no engine is mounted is a
// harmless no-op — the engine reads whatever is here when (and if) it boots.

let counter = 0
const entries = new Map() // id -> { el, opts }
const listeners = new Set()

/**
 * @param {HTMLElement} el
 * @param {{ variant?: string }} [opts]
 * @returns {string} registration id
 */
export function registerElement(el, opts = {}) {
  counter += 1
  const id = `three-${counter}`
  entries.set(id, { el, opts })
  emit()
  return id
}

/** @param {string} id */
export function unregisterElement(id) {
  if (entries.delete(id)) emit()
}

/** @returns {Map<string, {el: HTMLElement, opts: object}>} */
export function getEntries() {
  return entries
}

/**
 * Subscribe to add/remove changes. Returns an unsubscribe fn.
 * @param {() => void} fn
 */
export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function emit() {
  listeners.forEach((fn) => fn())
}
