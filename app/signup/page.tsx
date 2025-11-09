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

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const { signup } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const errors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    // Name validation
    if (!name) {
      errors.name = "Le nom est requis"
    } else if (name.length < 2) {
      errors.name = "Le nom doit contenir au moins 2 caractères"
    }

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

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Veuillez confirmer le mot de passe"
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Les mots de passe ne correspondent pas"
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
      await signup(name, email, password)
      toast({
        title: "Inscription réussie!",
        description: "Bienvenue sur Radio Istic",
      })
      router.push("/members")
    } catch (err) {
      const errorMessage = "Erreur lors de l'inscription. Veuillez réessayer."
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
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

          <h1 className="text-2xl font-display font-bold text-center mb-2">Inscription</h1>
          <p className="text-center text-muted-foreground mb-6">Rejoignez la communauté Radio Istic</p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setFieldErrors({ ...fieldErrors, name: undefined })
                }}
                className={`bg-background ${fieldErrors.name ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {fieldErrors.name && (
                <p className="text-sm text-destructive">{fieldErrors.name}</p>
              )}
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setFieldErrors({ ...fieldErrors, confirmPassword: undefined })
                }}
                className={`bg-background ${fieldErrors.confirmPassword ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>
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
                  Inscription...
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-electric-blue hover:underline font-medium">
                Se connecter
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
