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
