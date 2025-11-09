"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function TrainingError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Formation" description="Impossible de charger le contenu de formation." />
}
