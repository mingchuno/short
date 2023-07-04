import { Ratelimit } from '@upstash/ratelimit' // for deno: see above
import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

const ipCache = new Map() // must be outside of your serverless function handler
const globalCache = new Map()

const ratelimit = {
  ip: new Ratelimit({
    redis,
    analytics: false,
    prefix: 'short:ratelimit:ip',
    timeout: 1000, // 1 second
    ephemeralCache: ipCache,
    limiter: Ratelimit.slidingWindow(5, '10s'),
  }),
  global: new Ratelimit({
    redis,
    analytics: false,
    prefix: 'short:ratelimit:global',
    timeout: 1000, // 1 second
    ephemeralCache: globalCache,
    limiter: Ratelimit.slidingWindow(100, '10s'),
  }),
}

export default ratelimit
