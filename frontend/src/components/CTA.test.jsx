import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import CTA from './CTA'
import { postContact } from '../lib/api'

vi.mock('../lib/api', () => ({
  postContact: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText(/your name/i), { target: { value: 'Jo' } })
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jo@example.com' } })
  fireEvent.change(screen.getByLabelText(/about your project/i), { target: { value: 'Hello' } })
  fireEvent.click(screen.getByRole('button', { name: /send message/i }))
}

describe('CTA contact form', () => {
  it('shows the success state on a 200 response', async () => {
    postContact.mockResolvedValue(new Response('{"status":"ok"}', { status: 200 }))
    render(<CTA />)
    fillAndSubmit()

    expect(await screen.findByText(/message sent/i)).toBeInTheDocument()
    expect(postContact).toHaveBeenCalledWith({ name: 'Jo', email: 'jo@example.com', message: 'Hello' })
  })

  it('shows a rate-limit message on 429', async () => {
    postContact.mockResolvedValue(new Response('', { status: 429 }))
    render(<CTA />)
    fillAndSubmit()

    expect(await screen.findByText(/too many requests/i)).toBeInTheDocument()
    expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument()
  })

  it('shows a generic error on a non-ok response', async () => {
    postContact.mockResolvedValue(new Response('', { status: 500 }))
    render(<CTA />)
    fillAndSubmit()

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('shows a network-error message when the request rejects', async () => {
    postContact.mockRejectedValue(new TypeError('offline'))
    render(<CTA />)
    fillAndSubmit()

    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })

  it('re-enables the submit button after a failed attempt', async () => {
    postContact.mockResolvedValue(new Response('', { status: 500 }))
    render(<CTA />)
    fillAndSubmit()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled()
    })
  })
})
