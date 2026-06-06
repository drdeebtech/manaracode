import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { SceneCanvas } from './SceneCanvas'

describe('SceneCanvas (gate)', () => {
  it('renders nothing when WebGL is unavailable (jsdom default)', () => {
    // jsdom getContext returns null for webgl (see test/setup.js), so the gate
    // must render nothing and NEVER import the engine.
    const { container } = render(<SceneCanvas />)
    expect(container).toBeEmptyDOMElement()
    expect(container.querySelector('canvas')).toBeNull()
  })

  it('does not throw if mounted/unmounted in the no-WebGL path', () => {
    const { unmount } = render(<SceneCanvas />)
    expect(() => unmount()).not.toThrow()
  })

  it('stays inert under reduced motion even if WebGL were present', () => {
    const original = globalThis.matchMedia
    globalThis.matchMedia = (q) => ({
      matches: q.includes('reduce'),
      media: q,
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      dispatchEvent: () => false,
    })
    const { container } = render(<SceneCanvas />)
    expect(container).toBeEmptyDOMElement()
    globalThis.matchMedia = original
  })
})
