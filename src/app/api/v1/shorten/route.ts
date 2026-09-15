import { NextResponse } from 'next/server'
import { ShortenPayload } from '@/lib/model/shorten'
import { shortenUrl } from '@/lib/service/shorten'

export async function POST(request: Request) {
  const payload = await request.json()
  const result = ShortenPayload.safeParse(payload)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  const response = await shortenUrl(result.data.longUrl)
  return NextResponse.json(response)
}
