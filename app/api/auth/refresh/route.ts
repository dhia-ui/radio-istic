import { NextRequest, NextResponse } from "next/server"
import { rotateTokens, verifyRefreshToken } from "@/lib/auth/jwt"
import { apiRateLimiter, getClientIdentifier } from "@/lib/auth/rate-limit"
import { logAuditEvent, AuditActions, extractIpAddress } from "@/lib/auth/audit"
import * as cookie from "cookie"

// Mock user lookup (replace with real database)
const MOCK_USERS = [
  {
    id: "user-1",
    email: "admin@radioistic.tn",
    role: "admin",
    name: "Admin User",
  },
  {
    id: "user-2",
    email: "user@radioistic.tn",
    role: "user",
    name: "Regular User",
  },
]

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = await apiRateLimiter(request, clientId)
    if (rateLimitResult) return rateLimitResult

    // Get refresh token from cookie
    const cookies = cookie.parse(request.headers.get("cookie") || "")
    const refreshToken = cookies.refreshToken

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      )
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken)
    if (!decoded) {
      await logAuditEvent({
        userId: "anonymous",
        action: AuditActions.TOKEN_REFRESH,
        resource: "/api/auth/refresh",
        status: "failure",
        ipAddress: extractIpAddress(request),
        details: { reason: "Invalid refresh token" },
      })

      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      )
    }

    // Get user data
    const user = MOCK_USERS.find((u) => u.id === decoded.userId)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Generate new token pair
    const tokens = rotateTokens(refreshToken, {
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    if (!tokens) {
      return NextResponse.json(
        { error: "Failed to rotate tokens" },
        { status: 401 }
      )
    }

    // Log successful token refresh
    await logAuditEvent({
      userId: user.id,
      action: AuditActions.TOKEN_REFRESH,
      resource: "/api/auth/refresh",
      status: "success",
      ipAddress: extractIpAddress(request),
    })

    // Set new refresh token cookie
    const response = NextResponse.json({
      accessToken: tokens.accessToken,
    })

    response.headers.set(
      "Set-Cookie",
      cookie.serialize("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })
    )

    return response
  } catch (error) {
    console.error("Token refresh error:", error)
    
    await logAuditEvent({
      userId: "anonymous",
      action: AuditActions.TOKEN_REFRESH,
      resource: "/api/auth/refresh",
      status: "failure",
      ipAddress: extractIpAddress(request),
      details: { error: String(error) },
    })

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
