import crypto from "crypto"

/**
 * Generate a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

/**
 * Validate CSRF token from request against stored token
 */
export function validateCsrfToken(requestToken: string | null, storedToken: string | null): boolean {
  if (!requestToken || !storedToken) {
    return false
  }

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(requestToken),
      Buffer.from(storedToken)
    )
  } catch {
    return false
  }
}

/**
 * Extract CSRF token from request headers or body
 */
export function extractCsrfToken(headers: Headers, body?: any): string | null {
  // Try header first (preferred for AJAX requests)
  const headerToken = headers.get("x-csrf-token")
  if (headerToken) return headerToken

  // Fallback to body (for form submissions)
  if (body && typeof body === "object" && "_csrf" in body) {
    return body._csrf
  }

  return null
}

/**
 * CSRF token cookie options
 */
export const CSRF_COOKIE_OPTIONS = {
  name: "csrf_token",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 60 * 60 * 24, // 24 hours
}

/**
 * State-changing HTTP methods that require CSRF protection
 */
export const PROTECTED_METHODS = ["POST", "PUT", "DELETE", "PATCH"]

/**
 * Check if request method requires CSRF protection
 */
export function requiresCsrfProtection(method: string): boolean {
  return PROTECTED_METHODS.includes(method.toUpperCase())
}
