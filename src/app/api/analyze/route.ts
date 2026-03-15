import { NextRequest, NextResponse } from 'next/server'
import { analyzeMessage } from '@/lib/analyze'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const MAX_REQUESTS = 10
const WINDOW_MS = 60_000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (record.count >= MAX_REQUESTS) return false
  record.count++
  return true
}

// Clean up stale entries every 5 minutes
if (typeof globalThis !== 'undefined') {
  const cleanup = () => {
    const now = Date.now()
    for (const [ip, record] of rateLimitMap) {
      if (now > record.resetAt) rateLimitMap.delete(ip)
    }
  }
  setInterval(cleanup, 300_000)
}

// Sanitize input — strip control characters, null bytes
function sanitize(input: string): string {
  return input
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // control chars
    .trim()
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Sobrang dami ng requests. Subukan mo ulit after 1 minute.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: 'Walang message. Paste mo ang suspicious message.' },
        { status: 400 }
      )
    }

    const message = sanitize(body.message)

    if (message.length === 0) {
      return NextResponse.json(
        { error: 'Walang ma-analyze. Paste mo ang suspicious message.' },
        { status: 400 }
      )
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Masyadong mahaba. Max 2000 characters lang.' },
        { status: 400 }
      )
    }

    const result = await analyzeMessage(message)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'May error. Subukan mo ulit.' },
      { status: 500 }
    )
  }
}
