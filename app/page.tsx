import DashboardPageLayout from "@/components/dashboard/layout"
import { Radio, Users, Calendar, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Bienvenue sur Radio Istic",
        description: "Le club officiel de l'ISTIC Borj Cédria",
        icon: Radio,
      }}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-electric-blue/20 via-background to-neon-lime/10 p-8 mb-6 border border-electric-blue/30 card-3d-lift glass">
        <div className="relative z-10">
          <h2 className="text-4xl font-display font-bold mb-4 text-balance">Rejoignez la communauté Radio Istic</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl text-pretty">
            Découvrez nos événements, podcasts, formations et bien plus encore. Une communauté dynamique pour les
            étudiants de l'ISTIC.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-electric-blue hover:bg-electric-blue/90 neon-glow-blue">
              <Link href="/login">Accéder au portail</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/events">Nos événements</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-6 hover:border-electric-blue/50 transition-colors card-3d floating">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-electric-blue" />
            <span className="text-sm text-muted-foreground">Membres</span>
          </div>
          <p className="text-3xl font-display font-bold">50+</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 hover:border-neon-lime/50 transition-colors card-3d floating" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-neon-lime" />
            <span className="text-sm text-muted-foreground">Événements</span>
          </div>
          <p className="text-3xl font-display font-bold">25+</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 hover:border-signal-orange/50 transition-colors card-3d floating" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-2">
            <Radio className="h-5 w-5 text-signal-orange" />
            <span className="text-sm text-muted-foreground">Podcasts</span>
          </div>
          <p className="text-3xl font-display font-bold">15+</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 hover:border-electric-blue/50 transition-colors card-3d floating" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-electric-blue" />
            <span className="text-sm text-muted-foreground">Formations</span>
          </div>
          <p className="text-3xl font-display font-bold">10+</p>
        </div>
      </div>

      {/* Featured Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 card-3d-lift glass-light">
          <h3 className="text-xl font-display font-bold mb-4">Prochains événements</h3>
          <p className="text-muted-foreground mb-4">
            Découvrez nos prochains événements : tournois, soirées, voyages et bien plus encore.
          </p>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/events">Voir tous les événements</Link>
          </Button>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 card-3d-lift glass-light">
          <h3 className="text-xl font-display font-bold mb-4">Derniers podcasts</h3>
          <p className="text-muted-foreground mb-4">
            Écoutez nos derniers épisodes de podcasts avec des invités passionnants.
          </p>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/media">Écouter les podcasts</Link>
          </Button>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
