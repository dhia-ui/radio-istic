import jwt from "jsonwebtoken"

// Environment variables with secure defaults
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key-change-in-production"
const ACCESS_TOKEN_EXPIRY = "15m" // Short-lived access tokens
const REFRESH_TOKEN_EXPIRY = "7d" // Longer-lived refresh tokens

export interface TokenPayload {
  userId: string
  email: string
  role?: string
  iat?: number
  exp?: number
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

/**
 * Generate access and refresh token pair
 */
export function generateTokenPair(payload: Omit<TokenPayload, "iat" | "exp">): TokenPair {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: "radio-istic",
    audience: "radio-istic-dashboard",
  })

  const refreshToken = jwt.sign(
    { userId: payload.userId },
    JWT_REFRESH_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      issuer: "radio-istic",
      audience: "radio-istic-dashboard",
    }
  )

  return { accessToken, refreshToken }
}

/**
 * Verify and decode access token
 */
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "radio-istic",
      audience: "radio-istic-dashboard",
    }) as TokenPayload
    return decoded
  } catch (error) {
    console.error("Access token verification failed:", error)
    return null
  }
}

/**
 * Verify and decode refresh token
 */
export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: "radio-istic",
      audience: "radio-istic-dashboard",
    }) as { userId: string }
    return decoded
  } catch (error) {
    console.error("Refresh token verification failed:", error)
    return null
  }
}

/**
 * Generate a new access token using a valid refresh token
 */
export function rotateTokens(refreshToken: string, userPayload: Omit<TokenPayload, "iat" | "exp">): TokenPair | null {
  const decoded = verifyRefreshToken(refreshToken)
  
  if (!decoded || decoded.userId !== userPayload.userId) {
    return null
  }

  return generateTokenPair(userPayload)
}

/**
 * Decode token without verification (useful for expired token inspection)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload
  } catch {
    return null
  }
}

/**
 * Check if token is expired (without verification)
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  
  return Date.now() >= decoded.exp * 1000
}
