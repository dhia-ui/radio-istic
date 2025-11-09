"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function LoginError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Connexion" description="Impossible de charger la page de connexion." />
}
