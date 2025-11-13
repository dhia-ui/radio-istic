"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Info, Users, Target, Heart, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import RadioIsticLogo from "@/components/radio-istic-logo"
import { api, getAvatarUrl } from "@/lib/api"
import type { Member } from "@/types/member"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"

export default function AboutPage() {
  const { toast } = useToast()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [bureauMembers, setBureauMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch bureau members from API
  useEffect(() => {
    const fetchBureauMembers = async () => {
      try {
        const response = await api.members.getAll({})
        // Backend returns { success: true, members: [...] }
        const membersArray = response.members || []
        const transformedMembers: Member[] = membersArray
          .filter((u: any) => u.role && u.role !== "Member" && u.role !== "member")
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
            projects: typeof u.projects === 'string' ? u.projects : (u.projects?.join(", ") || ""),
            skills: typeof u.skills === 'string' ? u.skills : (u.skills?.join(", ") || ""),
            status: u.status || "offline",
            avatar: u.avatar || u.photo || `/avatars/${u.firstName.toLowerCase()}-${u.lastName.toLowerCase()}.png`,
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
          <RadioIsticLogo width={380} height={120} />
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
                    <AvatarImage src={getAvatarUrl(member.avatar)} alt={member.name} />
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

      {/* Radio ISTIC Products */}
      <div className="bg-gradient-to-br from-signal-orange/10 via-card to-electric-blue/10 border border-signal-orange/30 rounded-xl p-6">
        <h3 className="text-2xl font-display font-bold mb-4 text-center">
          <span className="bg-gradient-to-r from-signal-orange via-electric-blue to-neon-lime bg-clip-text text-transparent">
            Nos Produits Radio ISTIC
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Product Image */}
          <div className="col-span-full flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-signal-orange via-electric-blue to-neon-lime rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <img 
                src="/logo/produit radio.png" 
                alt="Produits Radio ISTIC" 
                className="relative w-full max-w-4xl rounded-xl shadow-2xl border border-border"
              />
            </div>
          </div>
          
          {/* Product Features */}
          <div className="bg-card/50 backdrop-blur border border-electric-blue/30 rounded-xl p-4">
            <div className="text-4xl mb-3 text-center">🎧</div>
            <h4 className="font-display font-bold text-lg mb-2 text-center">Goodies & Merch</h4>
            <p className="text-sm text-muted-foreground text-center">
              T-shirts, casquettes, stickers et accessoires aux couleurs de Radio ISTIC
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur border border-neon-lime/30 rounded-xl p-4">
            <div className="text-4xl mb-3 text-center">📻</div>
            <h4 className="font-display font-bold text-lg mb-2 text-center">Production Audio</h4>
            <p className="text-sm text-muted-foreground text-center">
              Équipement professionnel pour podcasts et enregistrements de qualité studio
            </p>
          </div>
          
          <div className="bg-card/50 backdrop-blur border border-signal-orange/30 rounded-xl p-4">
            <div className="text-4xl mb-3 text-center">🎨</div>
            <h4 className="font-display font-bold text-lg mb-2 text-center">Design & Créations</h4>
            <p className="text-sm text-muted-foreground text-center">
              Supports visuels personnalisés, affiches, et contenus graphiques sur mesure
            </p>
          </div>
        </div>
      </div>

      {/* L3ziiizprod Partnership */}
      <div className="mt-8 bg-gradient-to-br from-purple-500/10 via-card to-pink-500/10 border border-purple-500/30 rounded-xl p-8">
        <h3 className="text-2xl font-display font-bold mb-6 text-center">
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            En Partenariat Avec
          </span>
        </h3>
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-xl p-8 border border-purple-500/30">
              <img 
                src={mounted ? (theme === "light" ? "/la3ziz/LOGO SILHOUETTE.png" : "/la3ziz/LOGO SIMPLE 2.png") : "/la3ziz/LOGO SIMPLE 2.png"}
                alt="L3ziiizprod Logo" 
                className="w-64 h-auto"
              />
            </div>
          </div>
          <div className="text-center max-w-2xl">
            <h4 className="text-xl font-display font-bold mb-2">L3ziiizprod</h4>
            <p className="text-muted-foreground mb-4">
              Production audiovisuelle et création de contenu multimédia professionnelle
            </p>
            <a 
              href="https://www.instagram.com/l3ziiizprod" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Suivez-nous sur Instagram
            </a>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
