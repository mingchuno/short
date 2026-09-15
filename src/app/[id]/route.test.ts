import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/dynamo', () => ({ getUrlById: vi.fn() }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('redirect to /404')
  }),
}))

import { redirect } from 'next/navigation'
import { getUrlById } from '@/lib/dynamo'
import { GET } from './route'

function resolveLink() {
  return GET(new NextRequest('https://sho.rt/abcdefghi'), {
    params: Promise.resolve({ id: 'abcdefghi' }),
  })
}

describe('GET /[id]', () => {
  beforeEach(() => {
    vi.mocked(getUrlById).mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())

  it('redirects to the stored destination including its query and fragment', async () => {
    const longUrl = 'https://example.com/article?q=hello%20world#section'
    vi.mocked(getUrlById).mockResolvedValue({
      id: 'abcdefghi',
      longUrl,
      link: 'https://sho.rt/abcdefghi',
    })

    const response = await resolveLink()

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(longUrl)
    expect(getUrlById).toHaveBeenCalledExactlyOnceWith('abcdefghi')
    expect(redirect).not.toHaveBeenCalled()
  })

  it('redirects missing records to /404', async () => {
    // DynamoDB returns no Item for missing keys despite the declared return type.
    vi.mocked(getUrlById).mockImplementation(async () => undefined as never)

    await expect(resolveLink()).rejects.toThrow('redirect to /404')
    expect(redirect).toHaveBeenCalledExactlyOnceWith('/404')
  })

  it('currently redirects database failures to /404 too', async () => {
    const error = new Error('database unavailable')
    vi.mocked(getUrlById).mockRejectedValue(error)

    await expect(resolveLink()).rejects.toThrow('redirect to /404')
    expect(redirect).toHaveBeenCalledExactlyOnceWith('/404')
    expect(console.error).toHaveBeenCalledWith(error)
  })
})
