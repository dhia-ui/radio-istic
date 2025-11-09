"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function SettingsError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Paramètres" description="Impossible de charger la page des paramètres." />
}
