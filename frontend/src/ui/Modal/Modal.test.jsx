import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Modal } from './Modal'

function Harness({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Book a call" description="15-minute intro">
      <button>Inside</button>
    </Modal>
  )
}

describe('Modal', () => {
  it('does not render when closed', () => {
    render(<Harness open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders an accessible dialog labelled by its title + description', () => {
    render(<Harness open onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleName('Book a call')
    expect(dialog).toHaveAccessibleDescription('15-minute intro')
  })

  it('closes on Escape', () => {
    const onClose = vi.fn()
    render(<Harness open onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('moves focus into the dialog when opened', () => {
    render(<Harness open onClose={() => {}} />)
    expect(screen.getByRole('button', { name: /inside/i })).toHaveFocus()
  })

  it('closes when the overlay is clicked', () => {
    const onClose = vi.fn()
    render(<Harness open onClose={onClose} />)
    // The overlay is the aria-hidden backdrop behind the dialog panel.
    const overlay = document.querySelector('[aria-hidden="true"]')
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
