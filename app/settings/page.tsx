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

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  const handleAvatarChange = (avatarUrl: string) => {
    if (updateUser) {
      updateUser({ ...user, photo: avatarUrl })
      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été mise à jour avec succès.",
      })
    }
  }

  const handleSaveProfile = () => {
    if (updateUser) {
      updateUser({ ...user, name, email })
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      })
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
                  <AvatarImage src={user?.photo || "/placeholder.svg"} alt={user?.name} />
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
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
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
              >
                Sauvegarder les modifications
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
                <Button variant="outline" size="sm">
                  Activé
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouveaux messages</p>
                  <p className="text-sm text-muted-foreground">Notifications pour les nouveaux messages</p>
                </div>
                <Button variant="outline" size="sm">
                  Activé
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Événements</p>
                  <p className="text-sm text-muted-foreground">Rappels pour les événements à venir</p>
                </div>
                <Button variant="outline" size="sm">
                  Activé
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
                <Input id="current-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="w-full">Changer le mot de passe</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
