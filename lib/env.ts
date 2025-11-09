import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters").optional(),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters").optional(),
  SENTRY_DSN: z.string().url().optional(),
})

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  SENTRY_DSN: process.env.SENTRY_DSN,
})

if (!parsed.success) {
  console.warn("[env] Validation warnings:")
  parsed.error.issues.forEach(i => console.warn(` - ${i.path.join('.')}: ${i.message}`))
}

const data = parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>)

export const env = {
  ...data,
  // Fallback dev secrets (must be overridden in production)
  JWT_SECRET: data.JWT_SECRET || "dev-secret-access-token-key-change-me-123456789",
  JWT_REFRESH_SECRET: data.JWT_REFRESH_SECRET || "dev-secret-refresh-token-key-change-me-987654321",
}
