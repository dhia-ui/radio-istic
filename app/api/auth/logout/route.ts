import { NextRequest, NextResponse } from "next/server"
import { verifyAccessToken } from "@/lib/auth/jwt"
import { logAuditEvent, AuditActions, extractIpAddress } from "@/lib/auth/audit"
import * as cookie from "cookie"

export async function POST(request: NextRequest) {
  try {
    // Get access token from Authorization header
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    let userId = "anonymous"
    
    if (token) {
      const decoded = verifyAccessToken(token)
      if (decoded) {
        userId = decoded.userId
      }
    }

    // Log logout
    await logAuditEvent({
      userId,
      action: AuditActions.LOGOUT,
      resource: "/api/auth/logout",
      status: "success",
      ipAddress: extractIpAddress(request),
      userAgent: request.headers.get("user-agent") || undefined,
    })

    // Clear cookies
    const response = NextResponse.json({ message: "Logged out successfully" })

    // Clear refresh token
    response.headers.set(
      "Set-Cookie",
      cookie.serialize("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
      })
    )

    // Clear CSRF token
    response.headers.append(
      "Set-Cookie",
      cookie.serialize("csrf_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0, // Expire immediately
      })
    )

    return response
  } catch (error) {
    console.error("Logout error:", error)
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
