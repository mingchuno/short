import { type ShortenRespone } from '@/lib/model/shorten'
import { nanoid } from 'nanoid'
import { createShortenUrl } from '@/lib/dynamo'
import { appDomain } from '@/lib/config'

export async function shortenUrl(longUrl: string): Promise<ShortenRespone> {
  // gen id, save the document, return response
  const id = nanoid(9) // Start with 9 and we can increase later
  const document = {
    id: id,
    longUrl: longUrl,
    // TODO: move host to env config or get from header?
    link: `${appDomain}/${id}`,
  }
  // TODO: add retry if it failed?
  await createShortenUrl(document)
  return document
}
