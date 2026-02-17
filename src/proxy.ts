import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server'
import ratelimit from '@/lib/ratelimit'

export default async function proxy(
  request: NextRequest,
  event: NextFetchEvent
): Promise<Response | undefined> {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? '127.0.0.1'

  const { success, pending, limit, reset, remaining } = await ratelimit.ip.limit(
    `ratelimit_middleware_${ip}`
  )
  event.waitUntil(pending)

  const res = success
    ? NextResponse.next()
    : NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })

  res.headers.set('X-RateLimit-Limit', limit.toString())
  res.headers.set('X-RateLimit-Remaining', remaining.toString())
  res.headers.set('X-RateLimit-Reset', reset.toString())
  return res
}

export const config = {
  matcher: '/api/v1/shorten',
}
