import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from './Input'

describe('Input', () => {
  it('associates the label with the control', () => {
    render(<Input label="Email address" name="email" />)
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  })

  it('error sets aria-invalid and wires aria-describedby to the message', () => {
    render(<Input label="Email" name="email" error="Required" />)
    const field = screen.getByLabelText(/email/i)
    expect(field).toHaveAttribute('aria-invalid', 'true')
    const msg = screen.getByText('Required')
    expect(field.getAttribute('aria-describedby')).toContain(msg.id)
  })

  it('hint is referenced via aria-describedby', () => {
    render(<Input label="Name" name="name" hint="As it appears on invoices" />)
    const field = screen.getByLabelText(/name/i)
    const hint = screen.getByText(/as it appears/i)
    expect(field.getAttribute('aria-describedby')).toContain(hint.id)
  })

  it('passes dir through (LTR email on an RTL page)', () => {
    render(<Input label="Email" name="email" dir="ltr" />)
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('dir', 'ltr')
  })

  it('marks required on the control', () => {
    render(<Input label="Email" name="email" required />)
    expect(screen.getByLabelText(/email/i)).toBeRequired()
  })
})
