import * as Sentry from "@sentry/nextjs"

if (process.env.NEXT_RUNTIME === "edge" || typeof window !== 'undefined') {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0.05,
      replaysOnErrorSampleRate: 1.0,
      integrations: [
        Sentry.replayIntegration(),
      ],
    })
  }
}
