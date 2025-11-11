"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import RadioIsticLogo from "@/components/radio-istic-logo"
import Link from "next/link"
import { Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [field, setField] = useState("")
  const [year, setYear] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    confirmPassword?: string
    field?: string
    year?: string
  }>({})
  const { signup } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    const errors: {
      firstName?: string
      lastName?: string
      email?: string
      password?: string
      confirmPassword?: string
      field?: string
      year?: string
    } = {}

    // First name validation
    if (!firstName) {
      errors.firstName = "Le prénom est requis"
    } else if (firstName.length < 2) {
      errors.firstName = "Le prénom doit contenir au moins 2 caractères"
    }

    // Last name validation
    if (!lastName) {
      errors.lastName = "Le nom est requis"
    } else if (lastName.length < 2) {
      errors.lastName = "Le nom doit contenir au moins 2 caractères"
    }

    // Email validation
    if (!email) {
      errors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Email invalide"
    }

    // Field validation
    if (!field) {
      errors.field = "La filière est requise"
    }

    // Year validation
    if (!year) {
      errors.year = "L'année est requise"
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
      await signup(firstName, lastName, email, password, field, parseInt(year), phone || undefined)
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Votre prénom"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                    setFieldErrors({ ...fieldErrors, firstName: undefined })
                  }}
                  className={`bg-background ${fieldErrors.firstName ? "border-destructive" : ""}`}
                  disabled={isLoading}
                />
                {fieldErrors.firstName && (
                  <p className="text-sm text-destructive">{fieldErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Votre nom"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                    setFieldErrors({ ...fieldErrors, lastName: undefined })
                  }}
                  className={`bg-background ${fieldErrors.lastName ? "border-destructive" : ""}`}
                  disabled={isLoading}
                />
                {fieldErrors.lastName && (
                  <p className="text-sm text-destructive">{fieldErrors.lastName}</p>
                )}
              </div>
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
              <Label htmlFor="phone">Téléphone (optionnel)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+216 XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-background"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field">Filière</Label>
                <Select value={field} onValueChange={(value) => {
                  setField(value)
                  setFieldErrors({ ...fieldErrors, field: undefined })
                }} disabled={isLoading}>
                  <SelectTrigger className={`bg-background ${fieldErrors.field ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GLSI">GLSI</SelectItem>
                    <SelectItem value="IRS">IRS</SelectItem>
                    <SelectItem value="LISI">LISI</SelectItem>
                    <SelectItem value="LAI">LAI</SelectItem>
                    <SelectItem value="IOT">IOT</SelectItem>
                    <SelectItem value="LT">LT</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.field && (
                  <p className="text-sm text-destructive">{fieldErrors.field}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Année</Label>
                <Select value={year} onValueChange={(value) => {
                  setYear(value)
                  setFieldErrors({ ...fieldErrors, year: undefined })
                }} disabled={isLoading}>
                  <SelectTrigger className={`bg-background ${fieldErrors.year ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1ère année</SelectItem>
                    <SelectItem value="2">2ème année</SelectItem>
                    <SelectItem value="3">3ème année</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.year && (
                  <p className="text-sm text-destructive">{fieldErrors.year}</p>
                )}
              </div>
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
