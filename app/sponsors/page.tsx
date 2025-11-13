"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Handshake, Star, Building2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const sponsors = [
  {
    id: "1",
    name: "L3ziiizprod",
    tier: "Platinum",
    logo: "/la3ziz/LOGO SIMPLE 2.png",
    logoDark: "/la3ziz/LOGO SIMPLE 2.png",
    logoLight: "/la3ziz/LOGO SILHOUETTE.png",
    description: "Production audiovisuelle et création de contenu multimédia professionnelle",
    website: "https://www.instagram.com/l3ziiizprod",
  },
  {
    id: "2",
    name: "Info Tech IT Services",
    tier: "Platinum",
    logo: "/sponsors/infotech-logo.jpg",
    description: "Services informatiques et solutions IT pour entreprises",
    website: "https://infotech-services.tn",
  },
  {
    id: "3",
    name: "TechCorp Tunisia",
    tier: "Platinum",
    logo: "/sponsors/techcorp-logo.jpg",
    description: "Leader en solutions technologiques innovantes",
    website: "https://techcorp.tn",
  },
  {
    id: "4",
    name: "Digital Solutions",
    tier: "Gold",
    logo: "/sponsors/digital-solutions-logo.jpg",
    description: "Agence digitale spécialisée en transformation numérique",
    website: "https://digitalsolutions.tn",
  },
  {
    id: "5",
    name: "Innovation Hub",
    tier: "Gold",
    logo: "/sponsors/innovation-hub-logo.jpg",
    description: "Espace de coworking et d'innovation pour startups",
    website: "https://innovationhub.tn",
  },
  {
    id: "6",
    name: "Media Pro",
    tier: "Silver",
    logo: "/sponsors/media-pro-logo.jpg",
    description: "Production audiovisuelle et équipements professionnels",
    website: "https://mediapro.tn",
  },
  {
    id: "7",
    name: "Campus Store",
    tier: "Bronze",
    logo: "/sponsors/campus-store-logo.jpg",
    description: "Fournitures et équipements pour étudiants",
    website: "https://campusstore.tn",
  },
  {
    id: "8",
    name: "Food Corner",
    tier: "Bronze",
    logo: "/sponsors/food-corner-logo.jpg",
    description: "Restaurant et snack près du campus",
    website: "https://foodcorner.tn",
  },
]

const tierInfo = {
  Platinum: {
    color: "from-purple-500/20 to-blue-500/20 border-purple-500/30",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: "text-purple-400",
  },
  Gold: {
    color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    icon: "text-yellow-400",
  },
  Silver: {
    color: "from-gray-400/20 to-gray-500/20 border-gray-400/30",
    badge: "bg-gray-400/20 text-gray-300 border-gray-400/30",
    icon: "text-gray-300",
  },
  Bronze: {
    color: "from-orange-700/20 to-orange-800/20 border-orange-700/30",
    badge: "bg-orange-700/20 text-orange-400 border-orange-700/30",
    icon: "text-orange-400",
  },
}

export default function SponsorsPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <DashboardPageLayout
      header={{
        title: "Sponsors & Partenaires",
        description: "Nos partenaires qui nous soutiennent",
        icon: Handshake,
      }}
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-electric-blue/20 via-background to-signal-orange/10 border border-electric-blue/30 rounded-xl p-8 mb-6">
        <h2 className="text-3xl font-display font-bold mb-3">Devenez partenaire de Radio Istic</h2>
        <p className="text-muted-foreground mb-4">
          Rejoignez nos partenaires et soutenez les activités étudiantes de l'ISTIC. Plusieurs formules de partenariat
          disponibles.
        </p>
        <Button className="bg-electric-blue hover:bg-electric-blue/90 neon-glow-blue">
          <Building2 className="h-4 w-4 mr-2" />
          Devenir sponsor
        </Button>
      </div>

      {/* Sponsors by Tier */}
      {["Platinum", "Gold", "Silver", "Bronze"].map((tier) => {
        const tierSponsors = sponsors.filter((s) => s.tier === tier)
        if (tierSponsors.length === 0) return null

        return (
          <div key={tier} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Star className={`h-6 w-6 ${tierInfo[tier as keyof typeof tierInfo].icon}`} />
              <h3 className="text-2xl font-display font-bold">{tier} Sponsors</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tierSponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className={`bg-gradient-to-br ${tierInfo[tier as keyof typeof tierInfo].color} border rounded-xl p-6 hover:scale-105 transition-transform`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-3 w-20 h-20 flex items-center justify-center">
                      <img
                        src={
                          mounted && sponsor.logoLight && sponsor.logoDark
                            ? theme === "light"
                              ? sponsor.logoLight
                              : sponsor.logoDark
                            : sponsor.logo || "/placeholder.svg"
                        }
                        alt={sponsor.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <Badge className={tierInfo[tier as keyof typeof tierInfo].badge}>{sponsor.tier}</Badge>
                  </div>
                  <h4 className="text-xl font-display font-bold mb-2">{sponsor.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{sponsor.description}</p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                      Visiter le site
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Partnership Benefits */}
      <div className="bg-card border border-border rounded-xl p-6 mt-8">
        <h3 className="text-xl font-display font-bold mb-4">Avantages du partenariat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-electric-blue/20 flex items-center justify-center">
              <Star className="h-5 w-5 text-electric-blue" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Visibilité accrue</h4>
              <p className="text-sm text-muted-foreground">
                Logo affiché sur tous nos supports de communication et événements
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-neon-lime/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-neon-lime" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Accès aux talents</h4>
              <p className="text-sm text-muted-foreground">
                Rencontrez les meilleurs étudiants en informatique de l'ISTIC
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-signal-orange/20 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-signal-orange" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Événements dédiés</h4>
              <p className="text-sm text-muted-foreground">
                Organisez des workshops et présentations pour les étudiants
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Handshake className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Partenariat long terme</h4>
              <p className="text-sm text-muted-foreground">Construisez une relation durable avec notre communauté</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
