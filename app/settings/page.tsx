"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Lock } from "lucide-react"
import { AvatarPicker } from "@/components/avatar-picker"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/api"

export default function SettingsPage() {
  const { user, updateUser, refreshUser } = useAuth()
  const { toast } = useToast()
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false)
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || "")
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [field, setField] = useState(user?.field || "")
  const [year, setYear] = useState(user?.year?.toString() || "")
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  
  // Notifications state (local optimistic)
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifMessages, setNotifMessages] = useState(true)
  const [notifEvents, setNotifEvents] = useState(true)

  // Debug user data
  console.log('Settings page - user data:', user)
  console.log('User photo:', user?.photo)
  console.log('User avatar:', user?.avatar)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  const handleAvatarChange = async (avatarUrl: string) => {
    console.log('handleAvatarChange called with:', avatarUrl)
    
    try {
      // Save avatar to database via API
      const token = localStorage.getItem("radio-istic-token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar: avatarUrl }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local user state with data from server
        if (updateUser) {
          updateUser({ ...user, photo: avatarUrl, avatar: avatarUrl })
        }
        
        // Refresh user data from server
        if (refreshUser) {
          await refreshUser()
        }
        
        toast({
          title: "Avatar mis à jour",
          description: "Votre photo de profil a été sauvegardée avec succès.",
        })
      } else {
        throw new Error(data.message || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error('Error updating avatar:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder l'avatar",
      })
    }
  }

  const handleSaveProfile = async () => {
    setIsSavingProfile(true)
    
    try {
      const token = localStorage.getItem("radio-istic-token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          field,
          year: parseInt(year),
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Update local user state with data from server
        if (updateUser) {
          updateUser(data.user)
        }
        
        // Refresh user data from server to ensure sync
        if (refreshUser) {
          await refreshUser()
        }
        
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été sauvegardées avec succès.",
        })
      } else {
        throw new Error(data.message || "Erreur lors de la mise à jour")
      }
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder les modifications",
      })
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleToggle = (key: "email" | "messages" | "events") => {
    if (key === "email") {
      setNotifEmail((prev) => {
        const next = !prev
        toast({
          title: next ? "Notifications email activées" : "Notifications email désactivées",
          description: next
            ? "Vous recevrez des emails pour les événements importants."
            : "Vous ne recevrez plus d'emails.",
        })
        return next
      })
    }
    if (key === "messages") {
      setNotifMessages((prev) => {
        const next = !prev
        toast({
          title: next ? "Notifications messages activées" : "Notifications messages désactivées",
          description: next
            ? "Vous serez notifié des nouveaux messages."
            : "Vous ne serez plus notifié des messages.",
        })
        return next
      })
    }
    if (key === "events") {
      setNotifEvents((prev) => {
        const next = !prev
        toast({
          title: next ? "Rappels d'événements activés" : "Rappels d'événements désactivés",
          description: next
            ? "Vous recevrez des rappels pour les événements à venir."
            : "Vous ne recevrez plus de rappels.",
        })
        return next
      })
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ variant: "destructive", title: "Champs manquants", description: "Veuillez remplir tous les champs." })
      return
    }
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Mot de passe trop court",
        description: "Le nouveau mot de passe doit contenir au moins 6 caractères.",
      })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Mots de passe différents", description: "Les mots de passe ne correspondent pas." })
      return
    }

    setIsSavingPassword(true)
    try {
      // Call real API to change password
      await api.auth.changePassword(currentPassword, newPassword)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast({ title: "Mot de passe changé", description: "Votre mot de passe a été mis à jour avec succès." })
    } catch (e: any) {
      toast({ 
        variant: "destructive", 
        title: "Erreur", 
        description: e.message || "Impossible de changer le mot de passe. Vérifiez votre mot de passe actuel."
      })
    } finally {
      setIsSavingPassword(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-balance bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Paramètres
            </h1>
            <p className="text-muted-foreground mt-2">Gérez vos préférences et informations de compte</p>
          </div>

          {/* Profile Section */}
          <Card className="border-primary/20 bg-card/50 backdrop-blur card-3d-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profil
              </CardTitle>
              <CardDescription>Vos informations personnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20 avatar-ring-3d">
                  <AvatarImage 
                    src={user?.photo || user?.avatar || "/placeholder.svg"} 
                    alt={user?.name}
                    onError={(e) => {
                      console.log('Avatar image failed to load:', user?.photo || user?.avatar)
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                  <AvatarFallback className="text-2xl">
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAvatarPickerOpen(true)}
                    className="neon-glow-blue"
                  >
                    Changer la photo
                  </Button>
                  <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Max 5MB.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="field">Filière</Label>
                    <select
                      id="field"
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Sélectionner</option>
                      <option value="GLSI">GLSI</option>
                      <option value="IRS">IRS</option>
                      <option value="LISI">LISI</option>
                      <option value="LAI">LAI</option>
                      <option value="IOT">IOT</option>
                      <option value="LT">LT</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Année</Label>
                    <select
                      id="year"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Sélectionner</option>
                      <option value="1">1ère année</option>
                      <option value="2">2ème année</option>
                      <option value="3">3ème année</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Rôle</Label>
                  <div className="flex items-center gap-2">
                    <Input id="role" value={user?.role} disabled />
                    <Badge variant="outline" className="border-primary/30">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full neon-glow-blue" 
                onClick={handleSaveProfile}
                disabled={isSavingProfile}
              >
                {isSavingProfile ? "Sauvegarde..." : "Sauvegarder les modifications"}
              </Button>
            </CardContent>
          </Card>

          {/* Avatar Picker Modal */}
          <AvatarPicker
            currentAvatar={user?.photo || "/placeholder.svg"}
            open={isAvatarPickerOpen}
            onOpenChange={setIsAvatarPickerOpen}
            onAvatarChange={handleAvatarChange}
          />

          {/* Notifications Section */}
          <Card className="border-secondary/20 bg-card/50 backdrop-blur card-3d-lift glass-light">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-secondary" />
                Notifications
              </CardTitle>
              <CardDescription>Gérez vos préférences de notification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-muted-foreground">Recevoir des emails pour les événements importants</p>
                </div>
                <Button variant={notifEmail ? "outline" : "default"} size="sm" onClick={() => handleToggle("email")}>
                  {notifEmail ? "Activé" : "Désactivé"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouveaux messages</p>
                  <p className="text-sm text-muted-foreground">Notifications pour les nouveaux messages</p>
                </div>
                <Button variant={notifMessages ? "outline" : "default"} size="sm" onClick={() => handleToggle("messages")}>
                  {notifMessages ? "Activé" : "Désactivé"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Événements</p>
                  <p className="text-sm text-muted-foreground">Rappels pour les événements à venir</p>
                </div>
                <Button variant={notifEvents ? "outline" : "default"} size="sm" onClick={() => handleToggle("events")}>
                  {notifEvents ? "Activé" : "Désactivé"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="border-accent/20 bg-card/50 backdrop-blur card-3d-lift glass-light">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" />
                Sécurité
              </CardTitle>
              <CardDescription>Gérez votre mot de passe et sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleChangePassword} disabled={isSavingPassword}>
                {isSavingPassword ? "Changement..." : "Changer le mot de passe"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
