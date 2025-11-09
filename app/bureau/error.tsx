"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function BureauError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Bureau" description="Impossible de charger la page du bureau." />
}
