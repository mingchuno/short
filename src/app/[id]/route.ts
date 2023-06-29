import { getUrlById } from '@/lib/dynamo'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    const res = await getUrlById(id)
    return NextResponse.redirect(res.longUrl)
  } catch (error) {
    console.error(error)
    redirect('/404')
  }
}
