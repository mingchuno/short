import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  createShortenUrl: vi.fn(),
  getUrlByLongUrl: vi.fn(),
  nanoid: vi.fn(() => 'test-id-1'),
}))

vi.mock('@/lib/config', () => ({ appDomain: 'https://sho.rt' }))
vi.mock('@/lib/dynamo', () => ({
  createShortenUrl: mocks.createShortenUrl,
  getUrlByLongUrl: mocks.getUrlByLongUrl,
}))
vi.mock('nanoid', () => ({ nanoid: mocks.nanoid }))

import { shortenUrl } from './shorten'

describe('shortenUrl', () => {
  beforeEach(() => {
    mocks.getUrlByLongUrl.mockReset()
    mocks.createShortenUrl.mockReset()
    mocks.nanoid.mockClear()
  })

  it('returns an existing short URL without writing a duplicate', async () => {
    const existing = {
      id: 'existing1',
      longUrl: 'https://example.com/article',
      link: 'https://sho.rt/existing1',
    }
    mocks.getUrlByLongUrl.mockResolvedValue(existing)

    await expect(shortenUrl(existing.longUrl)).resolves.toEqual(existing)
    expect(mocks.createShortenUrl).not.toHaveBeenCalled()
  })

  it('creates and returns a new short URL', async () => {
    mocks.getUrlByLongUrl.mockResolvedValue(undefined)
    mocks.createShortenUrl.mockResolvedValue(undefined)

    await expect(shortenUrl('https://example.com/new')).resolves.toEqual({
      id: 'test-id-1',
      longUrl: 'https://example.com/new',
      link: 'https://sho.rt/test-id-1',
    })
    expect(mocks.nanoid).toHaveBeenCalledWith(9)
    expect(mocks.createShortenUrl).toHaveBeenCalledWith({
      id: 'test-id-1',
      longUrl: 'https://example.com/new',
      link: 'https://sho.rt/test-id-1',
    })
  })
})
