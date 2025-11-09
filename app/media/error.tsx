"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function MediaError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Médias" description="Impossible de charger les médias." />
}
