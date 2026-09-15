import { describe, expect, it } from 'vitest'
import { ShortenPayload } from './shorten'

describe('ShortenPayload', () => {
  it('accepts an absolute URL', () => {
    expect(ShortenPayload.parse({ longUrl: 'https://example.com/a?b=c' })).toEqual({
      longUrl: 'https://example.com/a?b=c',
    })
  })

  it.each(['example.com', '', 'not a url'])('rejects invalid URL %j', (longUrl) => {
    expect(ShortenPayload.safeParse({ longUrl }).success).toBe(false)
  })
})
