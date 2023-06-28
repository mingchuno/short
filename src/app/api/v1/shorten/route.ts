import { ShortenPayload, type ShortenRespone } from "@/types/shorten";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = ShortenPayload.safeParse(payload);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  // gen id, save the document, return response
  const id = nanoid(9); // Start with 9 and we can increase later
  // TODO: add retry if it failed?
  return NextResponse.json<ShortenRespone>({
    longUrl: result.data.longUrl,
    // TODO: move host to env config or get from header?
    link: `https://s.mcor.dev/${id}`,
    id: id,
  });
}
