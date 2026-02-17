import { getUrlById } from '@/lib/dynamo'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

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
