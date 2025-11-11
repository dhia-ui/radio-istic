"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Info, Users, Target, Heart, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import RadioIsticLogo from "@/components/radio-istic-logo"
import { api } from "@/lib/api"
import type { Member } from "@/types/member"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function AboutPage() {
  const { toast } = useToast()
  const [bureauMembers, setBureauMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch bureau members from API
  useEffect(() => {
    const fetchBureauMembers = async () => {
      try {
        const response = await api.members.getAll({})
        const transformedMembers: Member[] = response
          .filter((u: any) => u.role && u.role !== "Member")
          .map((u: any) => ({
            id: u._id,
            name: `${u.firstName} ${u.lastName}`,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phone: u.phone || "",
            field: u.field,
            year: u.year,
            motivation: u.motivation || "",
            projects: u.projects?.join(", ") || "",
            skills: u.skills?.join(", ") || "",
            status: u.status || "offline",
            avatar: u.photo || `/avatars/${u.firstName.toLowerCase()}-${u.lastName.toLowerCase()}.png`,
            points: u.points || 0,
            role: u.role,
            isBureau: u.isBureau,
          }))
        setBureauMembers(transformedMembers)
      } catch (error) {
        console.error("Failed to fetch bureau members:", error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les membres du bureau",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBureauMembers()
  }, [toast])

  if (isLoading) {
    return (
      <DashboardPageLayout
        header={{
          title: "À propos",
          description: "Découvrez Radio Istic",
          icon: Info,
        }}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-electric-blue" />
        </div>
      </DashboardPageLayout>
    )
  }
  return (
    <DashboardPageLayout
      header={{
        title: "À propos",
        description: "Découvrez Radio Istic",
        icon: Info,
      }}
    >
      {/* Hero Section with Logo */}
      <div className="bg-gradient-to-br from-electric-blue/20 via-background to-neon-lime/10 border border-electric-blue/30 rounded-xl p-8 mb-6 text-center">
        <div className="flex justify-center mb-6">
          <RadioIsticLogo width={300} height={100} />
        </div>
        <h2 className="text-3xl font-display font-bold mb-3">Le club officiel de l'ISTIC Borj Cédria</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Radio Istic est bien plus qu'un simple club étudiant. C'est une communauté dynamique qui rassemble les
          passionnés de médias, de technologie et de créativité pour créer des expériences inoubliables.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="w-12 h-12 rounded-lg bg-electric-blue/20 flex items-center justify-center mb-4">
            <Target className="h-6 w-6 text-electric-blue" />
          </div>
          <h3 className="text-xl font-display font-bold mb-3">Notre Mission</h3>
          <p className="text-muted-foreground">
            Enrichir la vie étudiante à l'ISTIC en proposant des événements, des formations et des contenus médias de
            qualité créés par et pour les étudiants.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="w-12 h-12 rounded-lg bg-neon-lime/20 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-neon-lime" />
          </div>
          <h3 className="text-xl font-display font-bold mb-3">Notre Communauté</h3>
          <p className="text-muted-foreground">
            Plus de 50 membres actifs de toutes les filières qui partagent leur passion pour les médias, le sport, la
            culture et l'innovation.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="w-12 h-12 rounded-lg bg-signal-orange/20 flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-signal-orange" />
          </div>
          <h3 className="text-xl font-display font-bold mb-3">Nos Valeurs</h3>
          <p className="text-muted-foreground">
            Créativité, collaboration, authenticité et inclusion. Nous croyons que chaque étudiant a quelque chose
            d'unique à apporter.
          </p>
        </div>
      </div>

      {/* Bureau Members */}
      <div className="mb-8">
        <h3 className="text-2xl font-display font-bold mb-6">Notre Bureau</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bureauMembers.map((member) => (
            <div
              key={member.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-electric-blue/50 transition-all relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-neon-lime/5 pointer-events-none" />
              <div className="relative">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-16 w-16 ring-2 ring-electric-blue/50">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="bg-electric-blue/20 text-electric-blue font-bold text-xl">
                      {member.firstName[0]}
                      {member.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-display font-bold text-lg mb-1">{member.name}</h4>
                    <Badge className="bg-electric-blue/20 text-electric-blue border-electric-blue/30">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{member.motivation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-display font-bold mb-4">Nos Activités</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2 text-electric-blue">Événements</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Tournois sportifs (Ping-Pong, Football, Basketball)</li>
              <li>• Soirées thématiques et projections</li>
              <li>• Voyages et sorties découverte</li>
              <li>• Matchy Matchy et événements sociaux</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-neon-lime">Médias</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Podcasts hebdomadaires</li>
              <li>• Production vidéo et vlogs</li>
              <li>• Couverture photo des événements</li>
              <li>• Gestion des réseaux sociaux</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-signal-orange">Formation</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Ateliers Photoshop et Illustrator</li>
              <li>• Formation montage vidéo</li>
              <li>• Cours de design graphique</li>
              <li>• Production de podcasts</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-purple-400">Communauté</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Réseau de 50+ membres actifs</li>
              <li>• Système de gamification et badges</li>
              <li>• Chat et messagerie interne</li>
              <li>• Opportunités de collaboration</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
