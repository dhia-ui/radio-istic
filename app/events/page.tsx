import DashboardPageLayout from "@/components/dashboard/layout"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const upcomingEvents = [
  {
    id: "1",
    title: "Tournoi de Ping-Pong",
    date: "2025-02-15",
    time: "14:00",
    location: "Salle de sport ISTIC, Ben Arous",
    category: "Sport",
    participants: 24,
    maxParticipants: 32,
    image: "/events/ping-pong-tournament.jpg",
    description: "Tournoi de ping-pong ouvert à tous les niveaux. Inscriptions limitées!",
  },
  {
    id: "2",
    title: "Podcast Live: Tech & Innovation",
    date: "2025-02-20",
    time: "16:00",
    location: "Studio Radio Istic, ISTIC Ben Arous",
    category: "Podcast",
    participants: 45,
    maxParticipants: 50,
    image: "/events/podcast-live-recording.jpg",
    description: "Enregistrement en direct avec des invités du monde tech tunisien.",
  },
  {
    id: "3",
    title: "Tournoi de Football",
    date: "2025-02-25",
    time: "10:00",
    location: "Terrain ISTIC, Ben Arous",
    category: "Sport",
    participants: 64,
    maxParticipants: 80,
    image: "/events/football-tournament.jpg",
    description: "Grand tournoi de football inter-filières. Formez vos équipes!",
  },
  {
    id: "4",
    title: "Soirée Cinéma",
    date: "2025-03-01",
    time: "19:00",
    location: "Amphithéâtre ISTIC, Ben Arous",
    category: "Soirée",
    participants: 120,
    maxParticipants: 150,
    image: "/events/cinema-night.jpg",
    description: "Projection de film suivie d'un débat. Entrée gratuite pour les membres.",
  },
  {
    id: "5",
    title: "Voyage à Ain Draham",
    date: "2025-03-10",
    time: "07:00",
    location: "Départ ISTIC Ben Arous → Ain Draham",
    category: "Voyage",
    participants: 35,
    maxParticipants: 40,
    image: "/events/ain-draham-trip.jpg",
    description: "Week-end découverte à Ain Draham. Transport et hébergement inclus.",
  },
  {
    id: "6",
    title: "Matchy Matchy",
    date: "2025-03-15",
    time: "15:00",
    location: "Cafétéria ISTIC, Ben Arous",
    category: "Social",
    participants: 28,
    maxParticipants: 30,
    image: "/events/matchy-matchy.jpg",
    description: "Rencontres amicales entre étudiants. Inscriptions anonymes.",
  },
]

const categoryColors: Record<string, string> = {
  Sport: "bg-neon-lime/20 text-neon-lime border-neon-lime/30",
  Podcast: "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
  Soirée: "bg-signal-orange/20 text-signal-orange border-signal-orange/30",
  Voyage: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Social: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

export default function EventsPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Événements",
        description: "Découvrez nos prochains événements",
        icon: Calendar,
      }}
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-electric-blue/20 via-background to-signal-orange/10 border border-electric-blue/30 rounded-xl p-8 mb-6 glass card-3d-lift">
        <h2 className="text-3xl font-display font-bold mb-3">Ne manquez aucun événement</h2>
        <p className="text-muted-foreground mb-4">
          Tournois sportifs, podcasts, soirées, voyages et bien plus encore. Rejoignez-nous!
        </p>
        <Button className="bg-electric-blue hover:bg-electric-blue/90 neon-glow-blue">
          <Calendar className="h-4 w-4 mr-2" />
          Voir le calendrier complet
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:border-electric-blue/50 transition-all group card-3d-lift"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <Badge className={`absolute top-4 right-4 ${categoryColors[event.category]}`}>{event.category}</Badge>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-bold mb-3 group-hover:text-electric-blue transition-colors">
                {event.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">{event.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-electric-blue" />
                  <span>
                    {new Date(event.date).toLocaleDateString("fr-TN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "Africa/Tunis",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-electric-blue" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-electric-blue" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-electric-blue" />
                  <span>
                    {event.participants}/{event.maxParticipants} participants
                  </span>
                </div>
              </div>

              <Button className="w-full bg-electric-blue hover:bg-electric-blue/90">S'inscrire</Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardPageLayout>
  )
}
