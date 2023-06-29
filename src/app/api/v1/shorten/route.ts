import { ShortenPayload, type ShortenRespone } from '@/lib/model/shorten'
import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { createShortenUrl } from '@/lib/dynamo'
import { appDomain } from '@/lib/config'

export async function POST(request: Request) {
  const payload = await request.json()
  const result = ShortenPayload.safeParse(payload)
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  // gen id, save the document, return response
  const id = nanoid(9) // Start with 9 and we can increase later
  const document = {
    id: id,
    longUrl: result.data.longUrl,
    // TODO: move host to env config or get from header?
    link: `${appDomain}/${id}`,
  }
  // TODO: add retry if it failed?
  await createShortenUrl(document)
  return NextResponse.json<ShortenRespone>(document)
}
