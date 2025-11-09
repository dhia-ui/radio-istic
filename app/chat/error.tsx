"use client"
import { ErrorFallback } from "@/components/ui/error-fallback"

export default function ChatError({ error, reset }: { error: Error; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} title="Erreur - Chat" description="Impossible de charger le chat." />
}
