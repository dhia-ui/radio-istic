export type EventItem = {
  id: string
  title: string
  date: string
  time: string
  location: string
  category: string
  participants: number
  maxParticipants: number
  image: string
  description: string
}

export const upcomingEvents: EventItem[] = [
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
