import { NextResponse } from 'next/server'

export async function GET() {
  // Simple health status; expand with DB/queue checks later
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
}
