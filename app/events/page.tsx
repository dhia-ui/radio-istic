"use client"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Calendar, MapPin, Users, Clock, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import React, { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ProtectedRoute from "@/components/protected-route"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  maxParticipants: number
  participants: string[]
  image?: string
  createdBy: string
  createdAt: string
}

const categoryColors: Record<string, string> = {
  Sport: "bg-neon-lime/20 text-neon-lime border-neon-lime/30",
  Podcast: "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
  Soirée: "bg-signal-orange/20 text-signal-orange border-signal-orange/30",
  Voyage: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Social: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

export default function EventsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({})
  const [registeringEventId, setRegisteringEventId] = useState<string | null>(null)

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.events.getAll({ upcoming: true })
        setEvents(response)
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
    // TODO: Implement reminder functionality with backend
    toast({
      title: "Rappel programmé",
      description: `Notification ${when} avant l'événement.`,
    })
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
                className="bg-electric-blue hover:bg-electric-blue/90 neon-glow-blue"
                aria-label="View full event calendar"
              >
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                Voir le calendrier complet
              </Button>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event) => {
                const isRegistered = isUserRegistered(event)
                const isRegistering = registeringEventId === event._id

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
                            {event.participants.length}/{event.maxParticipants} participants
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          className="w-full bg-electric-blue hover:bg-electric-blue/90"
                          variant={isRegistered ? "secondary" : "default"}
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
                            "Annuler l'inscription"
                          ) : (
                            "S'inscrire"
                          )}
                        </Button>
                        <div className="flex gap-2 text-xs">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addReminder(event._id, "1h")}
                            aria-label={`Set 1 hour reminder for ${event.title}`}
                          >
                            Rappel 1h
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addReminder(event._id, "1d")}
                            aria-label={`Set 1 day reminder for ${event.title}`}
                          >
                            Rappel 1j
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
    </ProtectedRoute>
  )
}
