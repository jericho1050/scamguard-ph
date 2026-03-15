import { NextRequest, NextResponse } from 'next/server'
import { analyzeMessage } from '@/lib/analyze'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Walang message. Paste mo ang suspicious message.' },
        { status: 400 }
      )
    }

    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: 'Masyadong mahaba. Max 2000 characters lang.' },
        { status: 400 }
      )
    }

    const result = await analyzeMessage(body.message.trim())
    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'May error. Subukan mo ulit.' },
      { status: 500 }
    )
  }
}
