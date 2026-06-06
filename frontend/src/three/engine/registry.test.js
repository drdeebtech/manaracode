import { describe, expect, it } from 'vitest'
import { registerElement, unregisterElement, getEntries, subscribe } from './registry'

describe('registry', () => {
  it('registers and unregisters elements, notifying subscribers', () => {
    let notifications = 0
    const unsub = subscribe(() => {
      notifications += 1
    })

    const el = document.createElement('button')
    const id = registerElement(el, { variant: 'webgl' })
    expect(getEntries().get(id)).toEqual({ el, opts: { variant: 'webgl' } })
    expect(notifications).toBe(1)

    unregisterElement(id)
    expect(getEntries().has(id)).toBe(false)
    expect(notifications).toBe(2)

    unsub()
  })

  it('hands out unique ids', () => {
    const a = registerElement(document.createElement('button'))
    const b = registerElement(document.createElement('button'))
    expect(a).not.toBe(b)
    unregisterElement(a)
    unregisterElement(b)
  })
})
