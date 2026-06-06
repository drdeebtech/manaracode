import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ArrowRight } from 'lucide-react'
import { Button } from './Button'

describe('Button', () => {
  it('renders a real button with the label as accessible name', () => {
    render(<Button>Start</Button>)
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('fires onClick when enabled', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    fireEvent.click(screen.getByRole('button', { name: /go/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('loading sets aria-busy, disables, and blocks onClick', () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Submit
      </Button>,
    )
    const btn = screen.getByRole('button', { name: /submit/i })
    expect(btn).toHaveAttribute('aria-busy', 'true')
    expect(btn).toBeDisabled()
    fireEvent.click(btn)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('disabled blocks onClick', () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    )
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('webgl variant still renders an accessible, clickable button (WebGL absent in jsdom)', () => {
    const onClick = vi.fn()
    render(
      <Button variant="webgl" onClick={onClick}>
        Spin me
      </Button>,
    )
    const btn = screen.getByRole('button', { name: /spin me/i })
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders an icon without breaking the accessible name', () => {
    render(
      <Button Icon={ArrowRight} iconPosition="right">
        Next
      </Button>,
    )
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('forwards type=submit', () => {
    render(<Button type="submit">Send</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
