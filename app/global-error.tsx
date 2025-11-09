"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-lg space-y-6 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Erreur critique</h1>
              <p className="text-muted-foreground">
                L'application a rencontré une erreur critique. Veuillez rafraîchir la page.
              </p>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="bg-muted p-4 rounded-lg text-left">
                <p className="text-sm font-mono text-muted-foreground break-all">
                  {error.message || "Erreur inconnue"}
                </p>
              </div>
            )}
            <Button
              onClick={reset}
              className="w-full bg-electric-blue hover:bg-electric-blue/90"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Réessayer
            </Button>
          </div>
        </div>
      </body>
    </html>
  )
}
