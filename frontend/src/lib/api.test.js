import { afterEach, describe, expect, it, vi } from 'vitest'
import { API_BASE, postContact } from './api'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('postContact', () => {
  it('defaults API_BASE to /api', () => {
    expect(API_BASE).toBe('/api')
  })

  it('POSTs JSON to the contact endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const form = { name: 'Jo', email: 'jo@example.com', message: 'hi' }
    await postContact(form, 'tok-123')

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, opts] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(opts.method).toBe('POST')
    expect(opts.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(opts.body)).toEqual({ ...form, turnstile_token: 'tok-123' })
  })

  it('defaults the turnstile token to an empty string when omitted', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await postContact({ name: 'Jo', email: 'jo@example.com', message: 'hi' })

    const body = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(body.turnstile_token).toBe('')
  })

  it('returns the raw Response so callers can branch on status', async () => {
    const res = new Response('', { status: 429 })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(res))

    const out = await postContact({ name: 'a', email: 'a@b.com', message: 'm' })
    expect(out.status).toBe(429)
  })

  it('propagates network errors (rejects)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('network down')))
    await expect(postContact({ name: 'a', email: 'a@b.com', message: 'm' })).rejects.toThrow('network down')
  })
})
