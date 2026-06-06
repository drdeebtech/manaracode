import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { ToastProvider, useToast } from './ToastProvider'

// Force reduced motion so framer-motion exit is instant (jsdom never completes
// real exit animations, which would otherwise leave the node mounted).
function forceReducedMotion() {
  globalThis.matchMedia = (query) => ({
    matches: query.includes('reduce'),
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  })
}
afterEach(() => {
  delete globalThis.matchMedia
})

function Trigger() {
  const { toast } = useToast()
  return (
    <button onClick={() => toast({ title: 'Saved', description: 'Your changes are live', tone: 'success' })}>
      Notify
    </button>
  )
}

describe('Toast', () => {
  it('exposes a polite live region', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    const region = screen.getByRole('region', { name: /notifications/i })
    expect(region).toHaveAttribute('aria-live', 'polite')
  })

  it('shows a toast when requested and dismisses it via the close button', async () => {
    forceReducedMotion()
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: /notify/i }))
    expect(screen.getByText('Saved')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /dismiss notification/i }))
    await waitForElementToBeRemoved(() => screen.queryByText('Saved'))
    expect(screen.queryByText('Saved')).not.toBeInTheDocument()
  })

  it('throws if useToast is used outside a provider', () => {
    function Bad() {
      useToast()
      return null
    }
    // Silence the expected React error boundary noise.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Bad />)).toThrow(/within a <ToastProvider>/)
    spy.mockRestore()
  })
})
