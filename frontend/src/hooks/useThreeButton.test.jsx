import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { useRef } from 'react'
import { useThreeButton } from './useThreeButton'
import { getEntries } from '../three/engine/registry'

function Probe({ variant }) {
  const ref = useRef(null)
  useThreeButton(ref, { variant })
  return <button ref={ref}>x</button>
}

describe('useThreeButton', () => {
  it('registers the element on mount and unregisters on unmount', () => {
    const before = getEntries().size
    const { unmount } = render(<Probe variant="webgl" />)
    expect(getEntries().size).toBe(before + 1)
    unmount()
    expect(getEntries().size).toBe(before)
  })

  it('is a harmless no-op when ref is null', () => {
    function NullRef() {
      useThreeButton(null, {})
      return null
    }
    const before = getEntries().size
    const { unmount } = render(<NullRef />)
    expect(getEntries().size).toBe(before)
    unmount()
  })
})
