"use client"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Calendar, MapPin, Users, Clock, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import React, { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNotifications } from "@/hooks/use-notifications"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ProtectedRoute from "@/components/protected-route"
import { EventPhotoGallery } from "@/components/event-photo-gallery"
import Link from "next/link"

interface Event {
  _id: string
  title: string
  description: string
  startDate: string
  endDate?: string
  location: string
  category: string
  maxParticipants: number
  participants: string[]
  image?: string
  organizer?: {
    _id: string
    firstName: string
    lastName: string
    avatar?: string
  }
  status: string
  pointsReward?: number
  createdAt: string
}

const categoryColors: Record<string, string> = {
  Sport: "bg-neon-lime/20 text-neon-lime border-neon-lime/30",
  Podcast: "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
  Soirée: "bg-signal-orange/20 text-signal-orange border-signal-orange/30",
  Voyage: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Social: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

// Event photo galleries - organized by event type
const eventPhotos: Record<string, string[]> = {
  "football": [
    "/vibrant-football-tournament.png",
    "/logo/match.png",
  ],
  "podcast": [
    "/events/podcast-live-recording.jpg",
    "/podcast-studio-recording.jpg",
    "/podcast-microphone-neon.jpg",
    "/podcast-microphone-neon-lights.jpg",
  ],
  "voyage": [
    "/events/ain-draham-trip.jpg",
    "/ain-draham-nature-trip.jpg",
    "/ain-draham-nature-group.jpg",
    "/ain-draham-nature-group-photo.jpg",
  ],
  "ping-pong": [
    "/logo/Gemini_Generated_Image_fs6oy3fs6oy3fs6o.png",
    "/events/ping-pong-tournament.jpg",
    "/ping-pong-tournament.jpg",
    "/ping-pong-tournament-action.jpg",
  ],
  "cinema": [
    "/events/cinema-night.jpg",
    "/cinema-night-students.jpg",
  ],
  "matchy": [
    "/events/matchy-matchy.jpg",
    "/speed-dating-students.jpg",
  ],
  "soiree": [
    "/events/matchy-matchy.jpg",
    "/speed-dating-students.jpg",
    "/events/cinema-night.jpg",
  ],
  "default": [
    "/vibrant-football-tournament.png",
    "/logo/Gemini_Generated_Image_fs6oy3fs6oy3fs6o.png",
    "/events/podcast-live-recording.jpg",
    "/events/cinema-night.jpg",
    "/events/ain-draham-trip.jpg",
    "/events/matchy-matchy.jpg",
    "/events/ping-pong-tournament.jpg",
    "/logo/match.png",
  ],
}

export default function EventsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { scheduleReminder, getEventReminders } = useNotifications()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({})
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedEventGallery, setSelectedEventGallery] = useState<{ title: string; photos: string[] } | null>(null)

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.events.getAll({ upcoming: true })
        // Backend returns { success: true, events: [...] }
        setEvents(response.events || [])
      } catch (err: any) {
        console.error("Failed to fetch events:", err)
        setError(err.message || "Échec du chargement des événements")
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les événements. Veuillez réessayer.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [toast])

  const isUserRegistered = (event: Event) => {
    return user ? event.participants.includes(user.id) : false
  }

  async function toggleRsvp(eventId: string) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour vous inscrire.",
      })
      return
    }

    setRegisteringEventId(eventId)
    try {
      const event = events.find((e) => e._id === eventId)
      if (!event) return

      const isRegistered = isUserRegistered(event)

      if (isRegistered) {
        await api.events.unregister(eventId)
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e._id === eventId
              ? { ...e, participants: e.participants.filter((id) => id !== user.id) }
              : e
          )
        )
        toast({ title: "Inscription annulée" })
      } else {
        await api.events.register(eventId)
        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e._id === eventId ? { ...e, participants: [...e.participants, user.id] } : e
          )
        )
        toast({ title: "Inscription confirmée" })
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err.message || "Impossible de modifier l'inscription",
      })
    } finally {
      setRegisteringEventId(null)
    }
  }

  async function addReminder(eventId: string, when: string) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Connexion requise",
        description: "Vous devez être connecté pour programmer un rappel.",
      })
      return
    }

    const event = events.find((e) => e._id === eventId)
    if (!event) return

    const type = when === "1h" ? "1h" : "1d"
    await scheduleReminder(eventId, event.title, event.startDate, type)
  }

  async function submitComment(eventId: string) {
    const text = commentDraft[eventId]?.trim()
    if (!text) return
    // TODO: Implement comment functionality with backend
    toast({
      title: "Commentaire ajouté",
      description: "Votre commentaire a été publié.",
    })
    setCommentDraft((d) => ({ ...d, [eventId]: "" }))
  }

  function openGallery(event: Event) {
    // Get photos for this event based on keywords in title
    const title = event.title.toLowerCase()
    const description = event.description.toLowerCase()
    let photos = eventPhotos.default // Default gallery
    
    // Match specific event types
    if (title.includes("ping") || title.includes("pong")) {
      photos = eventPhotos["ping-pong"]
    } else if (title.includes("ain") || title.includes("draham") || title.includes("voyage") || title.includes("trip")) {
      photos = eventPhotos.voyage
    } else if (title.includes("football") || title.includes("foot") || title.includes("soccer")) {
      photos = eventPhotos.football
    } else if (title.includes("podcast") || title.includes("radio") || title.includes("enregistrement")) {
      photos = eventPhotos.podcast
    } else if (title.includes("cinema") || title.includes("ciné") || title.includes("film")) {
      photos = eventPhotos.cinema
    } else if (title.includes("matchy") || title.includes("speed dating") || title.includes("rencontre")) {
      photos = eventPhotos.matchy
    } else if (title.includes("soirée") || title.includes("soiree") || title.includes("gala")) {
      photos = eventPhotos.soiree
    }
    
    setSelectedEventGallery({ title: event.title, photos })
    setGalleryOpen(true)
  }

  return (
    <ProtectedRoute>
      <DashboardPageLayout
        header={{
          title: "Événements",
          description: isLoading
            ? "Chargement..."
            : `${events.length} événement${events.length > 1 ? "s" : ""} à venir`,
          icon: Calendar,
        }}
      >
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-electric-blue" />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-electric-blue/20 via-background to-signal-orange/10 border border-electric-blue/30 rounded-xl p-8 mb-6 glass card-3d-lift">
              <h2 className="text-3xl font-display font-bold mb-3">Ne manquez aucun événement</h2>
              <p className="text-muted-foreground mb-4">
                Tournois sportifs, podcasts, soirées, voyages et bien plus encore. Rejoignez-nous!
              </p>
              <Button
                asChild
                className="bg-electric-blue hover:bg-electric-blue/90 neon-glow-blue"
                aria-label="View full event calendar"
              >
                <Link href="/events/calendar">
                  <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                  Voir le calendrier complet
                </Link>
              </Button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => {
                const isRegistered = isUserRegistered(event)
                const isRegistering = registeringEventId === event._id
                const eventReminders = user ? getEventReminders(event._id) : []
                const has1hReminder = eventReminders.some(r => r.type === '1h')
                const has1dReminder = eventReminders.some(r => r.type === '1d')

                return (
                  <div
                    key={event._id}
                    className="bg-card border border-border rounded-xl overflow-hidden hover:border-electric-blue/50 transition-all group card-3d-lift"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image || "/events/default-event.jpg"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className={`absolute top-4 right-4 ${categoryColors[event.category]}`}>
                        {event.category}
                      </Badge>
                      {isRegistered && (
                        <Badge className="absolute top-4 left-4 bg-neon-lime text-black">
                          ✓ Inscrit
                        </Badge>
                      )}
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
                            {new Date(event.startDate).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-electric-blue" />
                          <span>
                            {new Date(event.startDate).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-electric-blue" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-electric-blue" />
                          <span>
                            {event.participants.length}/{event.maxParticipants} participants
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          className={`w-full ${isRegistered ? 'bg-neon-lime/20 text-neon-lime hover:bg-neon-lime/30 border border-neon-lime/30' : 'bg-electric-blue hover:bg-electric-blue/90'}`}
                          variant={isRegistered ? "outline" : "default"}
                          onClick={() => toggleRsvp(event._id)}
                          disabled={isRegistering}
                          aria-label={
                            isRegistered
                              ? `Cancel registration for ${event.title}`
                              : `Register for ${event.title}`
                          }
                        >
                          {isRegistering ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Chargement...
                            </>
                          ) : isRegistered ? (
                            <>
                              ✓ Inscrit • Annuler
                            </>
                          ) : (
                            "S'inscrire"
                        )}
                        </Button>
                        <div className="flex gap-2 text-xs">
                          <Button
                            size="sm"
                            variant={has1hReminder ? "default" : "outline"}
                            onClick={() => addReminder(event._id, "1h")}
                            className={has1hReminder ? "bg-signal-orange hover:bg-signal-orange/90 text-white" : ""}
                            aria-label={`Set 1 hour reminder for ${event.title}`}
                          >
                            {has1hReminder ? "🔔 Rappel 1h" : "Rappel 1h"}
                          </Button>
                          <Button
                            size="sm"
                            variant={has1dReminder ? "default" : "outline"}
                            onClick={() => addReminder(event._id, "1d")}
                            className={has1dReminder ? "bg-signal-orange hover:bg-signal-orange/90 text-white" : ""}
                            aria-label={`Set 1 day reminder for ${event.title}`}
                          >
                            {has1dReminder ? "🔔 Rappel 1j" : "Rappel 1j"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openGallery(event)}
                            className="flex-1"
                            aria-label={`View photo gallery for ${event.title}`}
                          >
                            <ImageIcon className="h-4 w-4 mr-1" />
                            Galerie
                          </Button>
                        </div>
                        <div className="mt-2 space-y-2">
                          <Textarea
                            placeholder="Commenter..."
                            value={commentDraft[event._id] || ""}
                            onChange={(e) =>
                              setCommentDraft((d) => ({ ...d, [event._id]: e.target.value }))
                            }
                            className="h-16 text-xs"
                            aria-label={`Write a comment for ${event.title}`}
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => submitComment(event._id)}
                            disabled={!commentDraft[event._id]?.trim()}
                            aria-label={`Submit comment for ${event.title}`}
                          >
                            Envoyer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {events.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun événement à venir</p>
              </div>
            )}
          </>
        )}
      </DashboardPageLayout>

      {/* Photo Gallery Modal */}
      {selectedEventGallery && (
        <EventPhotoGallery
          eventTitle={selectedEventGallery.title}
          photos={selectedEventGallery.photos}
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
        />
      )}
    </ProtectedRoute>
  )
}
