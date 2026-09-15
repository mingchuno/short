import { type NextFetchEvent, NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/ratelimit', () => ({ default: { ip: { limit: vi.fn() } } }))

import ratelimit from '@/lib/ratelimit'
import proxy from './proxy'

describe('shortening rate limit', () => {
  const pending = Promise.resolve()
  const waitUntil = vi.fn()
  const event = { waitUntil } as unknown as NextFetchEvent

  beforeEach(() => {
    vi.mocked(ratelimit.ip.limit).mockReset()
    vi.mocked(ratelimit.ip.limit).mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: 123456,
      pending,
    })
  })

  it.each([
    [
      { 'x-forwarded-for': ' 203.0.113.1 , 203.0.113.2', 'x-real-ip': '203.0.113.3' },
      '203.0.113.1',
    ],
    [{ 'x-real-ip': '203.0.113.3' }, '203.0.113.3'],
    [{}, '127.0.0.1'],
  ])('uses the client IP from %j', async (headers, ip) => {
    await proxy(new NextRequest('https://sho.rt/api/v1/shorten', { headers }), event)
    expect(ratelimit.ip.limit).toHaveBeenCalledExactlyOnceWith(`ratelimit_middleware_${ip}`)
  })

  it.each([true, false])('reports quota headers when success is %s', async (success) => {
    vi.mocked(ratelimit.ip.limit).mockResolvedValue({
      success,
      limit: 5,
      remaining: success ? 4 : 0,
      reset: 123456,
      pending,
    })

    const response = await proxy(new NextRequest('https://sho.rt/api/v1/shorten'), event)

    expect(response?.status).toBe(success ? 200 : 429)
    expect(response?.headers.get('X-RateLimit-Limit')).toBe('5')
    expect(response?.headers.get('X-RateLimit-Remaining')).toBe(success ? '4' : '0')
    expect(response?.headers.get('X-RateLimit-Reset')).toBe('123456')
    expect(waitUntil).toHaveBeenCalledExactlyOnceWith(pending)
    if (success) {
      expect(response?.headers.get('x-middleware-next')).toBe('1')
    } else {
      expect(await response?.json()).toEqual({ error: 'Too Many Requests' })
      expect(response?.headers.has('x-middleware-next')).toBe(false)
    }
  })

  it('propagates rate limiter failures', async () => {
    const error = new Error('rate limiter unavailable')
    vi.mocked(ratelimit.ip.limit).mockRejectedValue(error)

    await expect(proxy(new NextRequest('https://sho.rt/api/v1/shorten'), event)).rejects.toBe(error)
    expect(waitUntil).not.toHaveBeenCalled()
  })
})
