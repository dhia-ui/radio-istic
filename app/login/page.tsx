"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import RadioIsticLogo from "@/components/radio-istic-logo"
import Link from "next/link"
import { Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {}
    
    // Email validation
    if (!email) {
      errors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email invalide"
    }
    
    // Password validation
    if (!password) {
      errors.password = "Le mot de passe est requis"
    } else if (password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)

    try {
      await login(email, password)
      toast({
        title: "Connexion réussie!",
        description: "Bienvenue sur Radio Istic",
      })
      router.push("/members")
    } catch (err) {
      const errorMessage = "Email ou mot de passe incorrect"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <div className="flex justify-center mb-8">
            <RadioIsticLogo width={200} height={60} />
          </div>

          <h1 className="text-2xl font-display font-bold text-center mb-2">Connexion</h1>
          <p className="text-center text-muted-foreground mb-6">Accédez au portail des membres</p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre.email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setFieldErrors({ ...fieldErrors, email: undefined })
                }}
                className={`bg-background ${fieldErrors.email ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setFieldErrors({ ...fieldErrors, password: undefined })
                }}
                className={`bg-background ${fieldErrors.password ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {fieldErrors.password && (
                <p className="text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-electric-blue hover:bg-electric-blue/90 neon-glow-blue"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-electric-blue hover:underline font-medium">
                S'inscrire
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
