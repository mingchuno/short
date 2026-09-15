import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/service/shorten', () => ({ shortenUrl: vi.fn() }))

import { shortenUrl } from '@/lib/service/shorten'
import { POST } from './route'

function request(payload: unknown) {
  return new Request('https://sho.rt/api/v1/shorten', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('POST /api/v1/shorten', () => {
  beforeEach(() => {
    vi.mocked(shortenUrl).mockReset()
  })

  it('returns the stored record from the service', async () => {
    const record = {
      id: 'existing1',
      longUrl: 'https://example.com/a?b=c#section',
      link: 'https://sho.rt/existing1',
    }
    vi.mocked(shortenUrl).mockResolvedValue(record)

    const response = await POST(request({ longUrl: record.longUrl, id: 'ignored' }))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(record)
    expect(shortenUrl).toHaveBeenCalledExactlyOnceWith(record.longUrl)
  })

  it.each([
    null,
    [],
    {},
    { longUrl: null },
    { longUrl: 42 },
    { longUrl: '' },
    { longUrl: '/relative' },
    { longUrl: 'not a url' },
  ])('rejects invalid payload %j before calling the service', async (payload) => {
    const response = await POST(request(payload))

    expect(response.status).toBe(400)
    expect(await response.json()).toHaveProperty('error')
    expect(shortenUrl).not.toHaveBeenCalled()
  })

  it('currently propagates malformed JSON errors', async () => {
    const malformed = new Request('https://sho.rt/api/v1/shorten', {
      method: 'POST',
      body: '{',
    })

    await expect(POST(malformed)).rejects.toBeInstanceOf(SyntaxError)
    expect(shortenUrl).not.toHaveBeenCalled()
  })

  it('propagates service failures instead of returning success', async () => {
    const error = new Error('database unavailable')
    vi.mocked(shortenUrl).mockRejectedValue(error)

    await expect(POST(request({ longUrl: 'https://example.com' }))).rejects.toBe(error)
  })
})
