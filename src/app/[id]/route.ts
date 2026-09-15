import { redirect } from 'next/navigation'
import { type NextRequest, NextResponse } from 'next/server'
import { getUrlById } from '@/lib/dynamo'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const record = await getUrlById(id)
  if (!record) {
    redirect('/404')
  }
  return NextResponse.redirect(record.longUrl)
}
