# Security Implementation Guide

## Overview
This document describes the security features implemented in the Radio Istic Dashboard.

## Features Implemented

### 1. JWT Authentication with Token Rotation
**Location:** `lib/auth/jwt.ts`

- **Access Tokens**: Short-lived (15 minutes) JWT tokens for API authentication
- **Refresh Tokens**: Long-lived (7 days) tokens stored in httpOnly cookies
- **Token Rotation**: Automatic token refresh without re-authentication
- **Secure Signing**: Separate secrets for access and refresh tokens

**Usage Example:**
```typescript
import { generateTokenPair, verifyAccessToken } from "@/lib/auth/jwt"

// Login: Generate token pair
const tokens = generateTokenPair({
  userId: "user-123",
  email: "user@example.com",
  role: "admin"
})

// Verify token on protected routes
const payload = verifyAccessToken(token)
if (!payload) {
  // Token invalid or expired
}
```

**Environment Variables Required:**
```
JWT_SECRET=your-access-token-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars
```

### 2. Password Security
**Location:** `lib/auth/password.ts`

- **Bcrypt Hashing**: Industry-standard password hashing with 12 rounds
- **Password Validation**: Enforces strong password requirements
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

**Usage Example:**
```typescript
import { hashPassword, verifyPassword, validatePasswordStrength } from "@/lib/auth/password"

// During registration
const validation = validatePasswordStrength(password)
if (!validation.valid) {
  return { errors: validation.errors }
}
const hash = await hashPassword(password)

// During login
const isValid = await verifyPassword(password, storedHash)
```

### 3. CSRF Protection
**Location:** `lib/auth/csrf.ts`

- **Token Generation**: Cryptographically secure random tokens
- **Timing-Safe Comparison**: Prevents timing attacks
- **Method Protection**: Automatically protects POST, PUT, DELETE, PATCH
- **Cookie Storage**: httpOnly cookies for server-side validation

**Usage Example:**
```typescript
import { generateCsrfToken, validateCsrfToken } from "@/lib/auth/csrf"

// Set token on login
const csrfToken = generateCsrfToken()
// Store in cookie and send to client

// Validate on state-changing requests
const isValid = validateCsrfToken(requestToken, storedToken)
```

**Client-Side Usage:**
```typescript
// Include CSRF token in request headers
fetch('/api/protected', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(data)
})
```

### 4. Rate Limiting
**Location:** `lib/auth/rate-limit.ts`

- **In-Memory Store**: Fast rate limiting (use Redis for production)
- **Configurable Limits**: Different limits per endpoint type
- **429 Responses**: Standard HTTP rate limit exceeded responses
- **Rate Limit Headers**: X-RateLimit-* headers for client information

**Predefined Limiters:**
- `authRateLimiter`: 5 requests / 15 minutes (login, registration)
- `apiRateLimiter`: 100 requests / minute (general API)
- `readOnlyRateLimiter`: 200 requests / minute (GET endpoints)
- `strictRateLimiter`: 3 requests / hour (sensitive operations)

**Usage Example:**
```typescript
import { authRateLimiter, getClientIdentifier } from "@/lib/auth/rate-limit"

export async function POST(request: NextRequest) {
  const clientId = getClientIdentifier(request)
  const rateLimitResult = await authRateLimiter(request, clientId)
  
  if (rateLimitResult) {
    return rateLimitResult // Returns 429 response
  }
  
  // Continue with request handling
}
```

### 5. Audit Logging
**Location:** `lib/auth/audit.ts`

- **Comprehensive Logging**: Tracks all security-relevant events
- **Structured Data**: Timestamp, user, action, resource, IP, user agent
- **Status Tracking**: Success/failure status for all operations
- **Query Interface**: Filter and search audit logs
- **Statistics**: Aggregated metrics and recent failures

**Predefined Actions:**
```typescript
const AuditActions = {
  // Authentication
  LOGIN: "auth.login",
  LOGOUT: "auth.logout",
  LOGIN_FAILED: "auth.login_failed",
  TOKEN_REFRESH: "auth.token_refresh",
  PASSWORD_CHANGE: "auth.password_change",
  
  // Security events
  SECURITY_VIOLATION: "security.violation",
  RATE_LIMIT_EXCEEDED: "security.rate_limit_exceeded",
  CSRF_FAILURE: "security.csrf_failure",
  UNAUTHORIZED_ACCESS: "security.unauthorized_access",
}
```

**Usage Example:**
```typescript
import { logAuditEvent, AuditActions, extractIpAddress } from "@/lib/auth/audit"

// Log successful operation
await logAuditEvent({
  userId: "user-123",
  action: AuditActions.LOGIN,
  resource: "/api/auth/login",
  status: "success",
  ipAddress: extractIpAddress(request),
  userAgent: request.headers.get("user-agent") || undefined,
  details: { method: "password" }
})

// View audit logs (admin only)
const logs = getAuditLogs({
  userId: "user-123",
  action: AuditActions.LOGIN_FAILED,
  limit: 100
})
```

### 6. Security Middleware
**Location:** `lib/auth/middleware.ts`

- **withAuth**: JWT authentication wrapper
- **withCsrfProtection**: CSRF validation wrapper
- **withAuthAndCsrf**: Combined authentication and CSRF protection

**Usage Example:**
```typescript
import { withAuthAndCsrf } from "@/lib/auth/middleware"

export async function POST(request: NextRequest) {
  return withAuthAndCsrf(request, async (req, userId, userPayload) => {
    // Request is authenticated and CSRF-protected
    // userId and userPayload available
    
    // Your route logic here
    return NextResponse.json({ success: true })
  })
}
```

## API Endpoints

### POST /api/auth/login
Authenticate user and receive tokens.

**Request:**
```json
{
  "email": "user@radioistic.tn",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-1",
    "email": "user@radioistic.tn",
    "name": "User Name",
    "role": "admin"
  },
  "accessToken": "eyJhbGci...",
  "csrfToken": "abc123..."
}
```

**Cookies Set:**
- `refreshToken` (httpOnly, secure, sameSite=strict)
- `csrf_token` (httpOnly, secure, sameSite=strict)

### POST /api/auth/refresh
Rotate tokens using refresh token.

**Response:**
```json
{
  "accessToken": "eyJhbGci..."
}
```

### POST /api/auth/logout
Logout and clear cookies.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### GET /api/audit (Admin Only)
View audit logs.

**Query Parameters:**
- `userId`: Filter by user ID
- `action`: Filter by action type
- `resource`: Filter by resource
- `status`: Filter by status (success/failure)
- `startDate`: Filter from date (ISO string)
- `endDate`: Filter to date (ISO string)
- `limit`: Max results (default: 100)
- `stats`: Return statistics instead of logs (true/false)

**Headers Required:**
```
Authorization: Bearer <access_token>
```

## Mock Credentials

For testing purposes:

**Admin User:**
- Email: `admin@radioistic.tn`
- Password: `Admin123!`
- Role: admin

**Regular User:**
- Email: `user@radioistic.tn`
- Password: `User123!`
- Role: user

## Production Checklist

### Before Deployment:

1. **Environment Variables:**
   - [ ] Set strong, unique `JWT_SECRET` (min 32 characters)
   - [ ] Set strong, unique `JWT_REFRESH_SECRET` (min 32 characters)
   - [ ] Set `NODE_ENV=production`

2. **Database:**
   - [ ] Replace in-memory stores with database (PostgreSQL, MongoDB)
   - [ ] Store audit logs in database with indexes
   - [ ] Implement token blacklist in database

3. **Rate Limiting:**
   - [ ] Replace in-memory rate limit store with Redis
   - [ ] Configure rate limits based on traffic patterns
   - [ ] Set up distributed rate limiting for multiple servers

4. **Security Headers:**
   - [ ] Add helmet.js for security headers
   - [ ] Configure Content Security Policy (CSP)
   - [ ] Enable HSTS in production

5. **Monitoring:**
   - [ ] Set up alerts for failed login attempts
   - [ ] Monitor rate limit violations
   - [ ] Track CSRF failures
   - [ ] Regular audit log reviews

6. **Password Policy:**
   - [ ] Implement password history (prevent reuse)
   - [ ] Add password expiration policy
   - [ ] Implement account lockout after failed attempts

7. **Session Management:**
   - [ ] Implement token revocation
   - [ ] Add concurrent session limits
   - [ ] Implement "logout all devices" feature

## Security Best Practices

1. **Never commit secrets to version control**
2. **Use environment variables for configuration**
3. **Enable HTTPS in production (required for secure cookies)**
4. **Regularly rotate JWT secrets**
5. **Review audit logs periodically**
6. **Keep dependencies updated**
7. **Implement proper error handling (don't leak info)**
8. **Use parameterized queries (prevent SQL injection)**
9. **Validate and sanitize all inputs**
10. **Implement proper CORS policies**

## Testing

See `lib/auth/__tests__/` for security unit tests.

Run security tests:
```bash
npm test -- --grep "security"
```

## Support

For security issues, contact: security@radioistic.tn
