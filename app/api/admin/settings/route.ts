import { NextRequest, NextResponse } from "next/server"
import { withAuthAndCsrf } from "@/lib/auth/middleware"
import { strictRateLimiter, getClientIdentifier } from "@/lib/auth/rate-limit"
import { logAuditEvent, AuditActions, extractIpAddress } from "@/lib/auth/audit"

/**
 * Example: Protected admin-only endpoint with full security
 * - JWT authentication
 * - CSRF protection
 * - Rate limiting
 * - Audit logging
 */
export async function POST(request: NextRequest) {
  return withAuthAndCsrf(request, async (req, userId, userPayload) => {
    try {
      // Rate limiting for sensitive operations
      const clientId = getClientIdentifier(req, userId)
      const rateLimitResult = await strictRateLimiter(req, clientId)
      if (rateLimitResult) return rateLimitResult

      // Check admin role
      if (userPayload.role !== "admin") {
        await logAuditEvent({
          userId,
          action: AuditActions.UNAUTHORIZED_ACCESS,
          resource: "/api/admin/settings",
          status: "failure",
          ipAddress: extractIpAddress(req),
          details: { reason: "Insufficient permissions" },
        })

        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        )
      }

      const body = await req.json()
      
      // Perform sensitive operation
      // ... your admin logic here ...

      // Log successful operation
      await logAuditEvent({
        userId,
        action: AuditActions.SETTINGS_CHANGE,
        resource: "/api/admin/settings",
        status: "success",
        ipAddress: extractIpAddress(req),
        userAgent: req.headers.get("user-agent") || undefined,
        details: { changes: body },
      })

      return NextResponse.json({
        message: "Settings updated successfully",
        updatedBy: userId,
      })
    } catch (error) {
      console.error("Admin settings error:", error)
      
      await logAuditEvent({
        userId,
        action: AuditActions.SETTINGS_CHANGE,
        resource: "/api/admin/settings",
        status: "failure",
        ipAddress: extractIpAddress(request),
        details: { error: String(error) },
      })

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  })
}

export async function GET(request: NextRequest) {
  return withAuthAndCsrf(request, async (req, userId, userPayload) => {
    try {
      // Rate limiting
      const clientId = getClientIdentifier(req, userId)
      const rateLimitResult = await strictRateLimiter(req, clientId)
      if (rateLimitResult) return rateLimitResult

      // Check admin role
      if (userPayload.role !== "admin") {
        return NextResponse.json(
          { error: "Admin access required" },
          { status: 403 }
        )
      }

      // Log access
      await logAuditEvent({
        userId,
        action: AuditActions.ADMIN_ACCESS,
        resource: "/api/admin/settings",
        status: "success",
        ipAddress: extractIpAddress(req),
      })

      // Return admin settings
      return NextResponse.json({
        settings: {
          // ... your settings here ...
        },
      })
    } catch (error) {
      console.error("Admin settings retrieval error:", error)
      
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      )
    }
  })
}
