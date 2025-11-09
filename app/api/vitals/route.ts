import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimiter, getClientIdentifier } from '@/lib/auth/rate-limit'

interface Metric {
  name: string
  value: number
  rating: string
  delta: number
  id: string
  navigationType?: string
}

// In-memory storage (rotate frequently)
const vitals: Metric[] = []

export async function POST(request: NextRequest) {
  const clientId = getClientIdentifier(request)
  const limited = await apiRateLimiter(request, clientId)
  if (limited) return limited

  try {
    const body = await request.json() as Metric
    vitals.push(body)
    // Keep last 500
    if (vitals.length > 500) vitals.shift()
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid metric' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ vitals, count: vitals.length })
}
