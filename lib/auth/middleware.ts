import { NextRequest, NextResponse } from "next/server"
import { validateCsrfToken, extractCsrfToken, requiresCsrfProtection } from "@/lib/auth/csrf"
import { verifyAccessToken } from "@/lib/auth/jwt"
import { logAuditEvent, AuditActions, extractIpAddress } from "@/lib/auth/audit"
import * as cookie from "cookie"

/**
 * Middleware to protect API routes with CSRF validation
 */
export async function withCsrfProtection(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  // Skip CSRF check for safe methods (GET, HEAD, OPTIONS)
  if (!requiresCsrfProtection(request.method)) {
    return handler(request)
  }

  // Get stored CSRF token from cookie
  const cookies = cookie.parse(request.headers.get("cookie") || "")
  const storedToken = cookies.csrf_token || null

  // Get CSRF token from request (header or body)
  let requestToken: string | null = null
  
  try {
    const body = await request.clone().json()
    requestToken = extractCsrfToken(request.headers, body)
  } catch {
    requestToken = extractCsrfToken(request.headers)
  }

  // Validate CSRF token
  const isValid = validateCsrfToken(requestToken, storedToken)

  if (!isValid) {
    // Get user ID for logging if available
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    const decoded = token ? verifyAccessToken(token) : null

    await logAuditEvent({
      userId: decoded?.userId || "anonymous",
      action: AuditActions.CSRF_FAILURE,
      resource: request.url,
      status: "failure",
      ipAddress: extractIpAddress(request),
      details: {
        method: request.method,
        hasRequestToken: !!requestToken,
        hasStoredToken: !!storedToken,
      },
    })

    return NextResponse.json(
      { error: "CSRF token validation failed" },
      { status: 403 }
    )
  }

  return handler(request)
}

/**
 * Middleware to verify JWT token and add user to request
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, userId: string, userPayload: any) => Promise<NextResponse>
): Promise<NextResponse> {
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

  return handler(request, decoded.userId, decoded)
}

/**
 * Combined middleware: Auth + CSRF
 */
export async function withAuthAndCsrf(
  request: NextRequest,
  handler: (request: NextRequest, userId: string, userPayload: any) => Promise<NextResponse>
): Promise<NextResponse> {
  return withCsrfProtection(request, (req) => withAuth(req, handler))
}
