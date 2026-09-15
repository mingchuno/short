import { redirect } from 'next/navigation'
import { type NextRequest, NextResponse } from 'next/server'
import { getUrlById } from '@/lib/dynamo'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const res = await getUrlById(id)
    return NextResponse.redirect(res.longUrl)
  } catch (error) {
    console.error(error)
    redirect('/404')
  }
}
