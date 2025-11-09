"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function SponsorsError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Sponsors" description="Impossible de charger les sponsors." />
}
