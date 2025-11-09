"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function AboutError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - À propos" description="Impossible de charger la page à propos." />
}
