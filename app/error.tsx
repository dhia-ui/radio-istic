"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md glass">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Oups! Une erreur s'est produite</CardTitle>
          <CardDescription className="text-base mt-2">
            Quelque chose s'est mal passé. Ne vous inquiétez pas, ce n'est pas de votre faute.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === "development" && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-mono text-muted-foreground break-all">
                {error.message || "Une erreur inconnue s'est produite"}
              </p>
              {error.digest && (
                <p className="text-xs text-muted-foreground mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button
            onClick={reset}
            variant="default"
            className="flex-1 bg-electric-blue hover:bg-electric-blue/90"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
