import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Without Vitest globals, React Testing Library does not auto-register its
// afterEach cleanup, so unmount rendered trees between tests explicitly.
afterEach(() => {
  cleanup()
})

// jsdom does not implement IntersectionObserver, which framer-motion's
// `whileInView` relies on. Provide a no-op stub so components render in tests.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}

globalThis.IntersectionObserver = globalThis.IntersectionObserver || IntersectionObserverStub

// jsdom lacks ResizeObserver (used by the 3D registry to track DOM rects).
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = globalThis.ResizeObserver || ResizeObserverStub

// jsdom lacks matchMedia; default to "no preference" so useReducedMotion()
// resolves false. Tests can override globalThis.matchMedia per case.
if (!globalThis.matchMedia) {
  globalThis.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false
    },
  })
}

// Idle-callback shims (the 3D layer defers loading to idle).
globalThis.requestIdleCallback =
  globalThis.requestIdleCallback || ((cb) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 0))
globalThis.cancelIdleCallback = globalThis.cancelIdleCallback || ((id) => clearTimeout(id))

// jsdom has no WebGL: getContext returns null by default so useWebGLSupport()
// resolves false and components render their non-WebGL path. Tests that need
// the "supported" branch can override getContext.
if (typeof HTMLCanvasElement !== 'undefined') {
  const originalGetContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function getContext(type, ...rest) {
    if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
      return null
    }
    return originalGetContext ? originalGetContext.call(this, type, ...rest) : null
  }
}
