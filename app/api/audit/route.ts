import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth/jwt"
import { getAuditLogs, getAuditStats, logAuditEvent, AuditActions, extractIpAddress } from "@/lib/auth/audit"
import { apiRateLimiter, getClientIdentifier } from "@/lib/auth/rate-limit"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = await apiRateLimiter(request, clientId)
    if (rateLimitResult) return rateLimitResult

    // Verify authentication
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const decoded = verifyAccessToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (decoded.role !== "admin") {
      await logAuditEvent({
        userId: decoded.userId,
        action: AuditActions.UNAUTHORIZED_ACCESS,
        resource: "/api/audit",
        status: "failure",
        ipAddress: extractIpAddress(request),
        details: { reason: "Insufficient permissions" },
      })

      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || undefined
    const action = searchParams.get("action") || undefined
    const resource = searchParams.get("resource") || undefined
    const status = (searchParams.get("status") as "success" | "failure") || undefined
    const startDate = searchParams.get("startDate") || undefined
    const endDate = searchParams.get("endDate") || undefined
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100
    const stats = searchParams.get("stats") === "true"

    // Log audit log access
    await logAuditEvent({
      userId: decoded.userId,
      action: AuditActions.AUDIT_LOG_VIEW,
      resource: "/api/audit",
      status: "success",
      ipAddress: extractIpAddress(request),
    })

    // Return logs or stats
    if (stats) {
      const statistics = getAuditStats()
      return NextResponse.json(statistics)
    }

    const logs = getAuditLogs({
      userId,
      action,
      resource,
      status,
      startDate,
      endDate,
      limit,
    })

    return NextResponse.json({
      logs,
      count: logs.length,
      filters: {
        userId,
        action,
        resource,
        status,
        startDate,
        endDate,
        limit,
      },
    })
  } catch (error) {
    console.error("Audit log retrieval error:", error)
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
