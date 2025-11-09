import { NextRequest, NextResponse } from "next/server"
import { generateTokenPair } from "@/lib/auth/jwt"
import { verifyPassword } from "@/lib/auth/password"
import { generateCsrfToken } from "@/lib/auth/csrf"
import { authRateLimiter, getClientIdentifier } from "@/lib/auth/rate-limit"
import { logAuditEvent, AuditActions, extractIpAddress } from "@/lib/auth/audit"
import * as cookie from "cookie"

// Mock user database (replace with real database in production)
const MOCK_USERS = [
  {
    id: "user-1",
    email: "admin@radioistic.tn",
    // Password: Admin123!
    passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeshwqOmfscdyXP9HGvP1p9yG",
    role: "admin",
    name: "Admin User",
  },
  {
    id: "user-2",
    email: "user@radioistic.tn",
    // Password: User123!
    passwordHash: "$2a$12$8mKKd3QWzKKd3QWzKKd3Q.zKKd3QWzKKd3QWzKKd3QWzKKd3QWzK",
    role: "user",
    name: "Regular User",
  },
]

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request)
    const rateLimitResult = await authRateLimiter(request, clientId)
    if (rateLimitResult) {
      await logAuditEvent({
        userId: "anonymous",
        action: AuditActions.RATE_LIMIT_EXCEEDED,
        resource: "/api/auth/login",
        status: "failure",
        ipAddress: extractIpAddress(request),
        details: { reason: "Rate limit exceeded" },
      })
      return rateLimitResult
    }

    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user
    const user = MOCK_USERS.find((u) => u.email === email)
    if (!user) {
      await logAuditEvent({
        userId: email,
        action: AuditActions.LOGIN_FAILED,
        resource: "/api/auth/login",
        status: "failure",
        ipAddress: extractIpAddress(request),
        userAgent: request.headers.get("user-agent") || undefined,
        details: { reason: "User not found" },
      })

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      await logAuditEvent({
        userId: user.id,
        action: AuditActions.LOGIN_FAILED,
        resource: "/api/auth/login",
        status: "failure",
        ipAddress: extractIpAddress(request),
        userAgent: request.headers.get("user-agent") || undefined,
        details: { reason: "Invalid password" },
      })

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // Generate CSRF token
    const csrfToken = generateCsrfToken()

    // Log successful login
    await logAuditEvent({
      userId: user.id,
      action: AuditActions.LOGIN,
      resource: "/api/auth/login",
      status: "success",
      ipAddress: extractIpAddress(request),
      userAgent: request.headers.get("user-agent") || undefined,
    })

    // Set cookies
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      csrfToken,
    })

    // Set refresh token as httpOnly cookie
    response.headers.set(
      "Set-Cookie",
      cookie.serialize("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })
    )

    // Set CSRF token as cookie
    response.headers.append(
      "Set-Cookie",
      cookie.serialize("csrf_token", csrfToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 24 * 60 * 60, // 24 hours
      })
    )

    return response
  } catch (error) {
    console.error("Login error:", error)
    
    await logAuditEvent({
      userId: "anonymous",
      action: AuditActions.LOGIN_FAILED,
      resource: "/api/auth/login",
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
