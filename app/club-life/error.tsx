"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function ClubLifeError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Vie du Club" description="Impossible de charger la vie du club." />
}
