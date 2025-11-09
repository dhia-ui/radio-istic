"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function SignupError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      title="Erreur - Inscription"
      description="Impossible de charger la page d'inscription."
    />
  )
}
