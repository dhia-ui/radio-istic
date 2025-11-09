"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function MembersError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Membres" description="Impossible de charger les membres." />
}
