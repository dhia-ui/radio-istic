interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  action: string
  resource: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status: "success" | "failure"
}

// In-memory store (use database in production)
const auditLogs: AuditLogEntry[] = []

/**
 * Log an audit event
 */
export function logAuditEvent(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
  const logEntry: AuditLogEntry = {
    id: generateLogId(),
    timestamp: new Date().toISOString(),
    ...entry,
  }

  auditLogs.push(logEntry)

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[AUDIT]", {
      action: logEntry.action,
      user: logEntry.userId,
      resource: logEntry.resource,
      status: logEntry.status,
    })
  }

  // Keep only last 10000 entries in memory (prevents memory leak)
  if (auditLogs.length > 10000) {
    auditLogs.shift()
  }
}

/**
 * Get audit logs with filtering
 */
export function getAuditLogs(filters?: {
  userId?: string
  action?: string
  resource?: string
  status?: "success" | "failure"
  startDate?: string
  endDate?: string
  limit?: number
}): AuditLogEntry[] {
  let filtered = [...auditLogs]

  if (filters?.userId) {
    filtered = filtered.filter((log) => log.userId === filters.userId)
  }

  if (filters?.action) {
    filtered = filtered.filter((log) => log.action === filters.action)
  }

  if (filters?.resource) {
    filtered = filtered.filter((log) => log.resource === filters.resource)
  }

  if (filters?.status) {
    filtered = filtered.filter((log) => log.status === filters.status)
  }

  if (filters?.startDate) {
    filtered = filtered.filter((log) => log.timestamp >= filters.startDate!)
  }

  if (filters?.endDate) {
    filtered = filtered.filter((log) => log.timestamp <= filters.endDate!)
  }

  // Sort by timestamp descending (newest first)
  filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp))

  // Apply limit
  if (filters?.limit) {
    filtered = filtered.slice(0, filters.limit)
  }

  return filtered
}

/**
 * Get audit log statistics
 */
export function getAuditStats(): {
  total: number
  byAction: Record<string, number>
  byStatus: Record<string, number>
  recentFailures: AuditLogEntry[]
} {
  const byAction: Record<string, number> = {}
  const byStatus: Record<string, number> = {}

  for (const log of auditLogs) {
    byAction[log.action] = (byAction[log.action] || 0) + 1
    byStatus[log.status] = (byStatus[log.status] || 0) + 1
  }

  const recentFailures = auditLogs
    .filter((log) => log.status === "failure")
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10)

  return {
    total: auditLogs.length,
    byAction,
    byStatus,
    recentFailures,
  }
}

/**
 * Generate unique log ID
 */
function generateLogId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(7)}`
}

/**
 * Extract IP address from request
 */
export function extractIpAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const cfConnectingIp = request.headers.get("cf-connecting-ip")

  return cfConnectingIp || realIp || forwarded?.split(",")[0] || "unknown"
}

/**
 * Common audit actions
 */
export const AuditActions = {
  // Authentication
  LOGIN: "auth.login",
  LOGOUT: "auth.logout",
  LOGIN_FAILED: "auth.login_failed",
  TOKEN_REFRESH: "auth.token_refresh",
  PASSWORD_CHANGE: "auth.password_change",
  PASSWORD_RESET: "auth.password_reset",

  // User management
  USER_CREATE: "user.create",
  USER_UPDATE: "user.update",
  USER_DELETE: "user.delete",
  USER_ROLE_CHANGE: "user.role_change",

  // Data operations
  DATA_READ: "data.read",
  DATA_CREATE: "data.create",
  DATA_UPDATE: "data.update",
  DATA_DELETE: "data.delete",

  // Admin operations
  ADMIN_ACCESS: "admin.access",
  SETTINGS_CHANGE: "admin.settings_change",
  AUDIT_LOG_VIEW: "admin.audit_log_view",

  // Security events
  SECURITY_VIOLATION: "security.violation",
  RATE_LIMIT_EXCEEDED: "security.rate_limit_exceeded",
  CSRF_FAILURE: "security.csrf_failure",
  UNAUTHORIZED_ACCESS: "security.unauthorized_access",
} as const
