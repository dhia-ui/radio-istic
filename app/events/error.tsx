"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function EventsError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Événements" description="Impossible de charger les événements." />
}
