import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Inbox } from 'lucide-react'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="No messages" description="You're all caught up." />)
    expect(screen.getByText('No messages')).toBeInTheDocument()
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument()
  })

  it('uses role=status for non-error tones', () => {
    render(<EmptyState tone="success" title="Sent" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('uses role=alert for the error tone', () => {
    render(<EmptyState tone="error" title="Failed" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders an action and a decorative icon', () => {
    const { container } = render(
      <EmptyState Icon={Inbox} title="Empty" action={<button>Refresh</button>} />,
    )
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
    // The Lucide icon renders an SVG and is decorative (aria-hidden).
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
