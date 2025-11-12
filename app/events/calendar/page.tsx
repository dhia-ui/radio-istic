"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import ProtectedRoute from "@/components/protected-route"

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
  status: string
}

const categoryColors: Record<string, string> = {
  Sport: "bg-neon-lime/20 text-neon-lime border-neon-lime/30",
  Podcast: "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
  Soirée: "bg-signal-orange/20 text-signal-orange border-signal-orange/30",
  Voyage: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Social: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

export default function EventCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { toast } = useToast()

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      try {
        const response = await api.events.getAll({ upcoming: true })
        setEvents(response.events || [])
      } catch (err: any) {
        console.error("Failed to fetch events:", err)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les événements",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [toast])

  // Get events for selected date
  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return []
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((event) => {
      const eventDate = new Date(event.startDate).toISOString().split("T")[0]
      return eventDate === dateStr
    })
  }

  // Get dates that have events
  const getEventDates = () => {
    return events.map((event) => new Date(event.startDate))
  }

  const selectedDateEvents = getEventsForDate(date)
  const eventDates = getEventDates()

  // Navigate months
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentMonth(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentMonth(newDate)
  }

  return (
    <ProtectedRoute>
      <DashboardPageLayout
        header={{
          title: "Calendrier des événements",
          description: `${events.length} événement${events.length > 1 ? "s" : ""} programmé${events.length > 1 ? "s" : ""}`,
          icon: CalendarIcon,
        }}
      >
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/events">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Retour aux événements
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 card-3d-lift">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold">
                  {currentMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPreviousMonth}
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextMonth}
                    aria-label="Next month"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calendar Component */}
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: eventDates,
                  }}
                  modifiersStyles={{
                    hasEvent: {
                      backgroundColor: "oklch(0.45 0.18 250 / 0.2)",
                      fontWeight: "bold",
                      color: "oklch(0.45 0.18 250)",
                    },
                  }}
                />
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-electric-blue/20 border border-electric-blue/30"></div>
                  <span>Jours avec événements</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Events */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 card-3d-lift sticky top-6">
              <h3 className="text-xl font-display font-bold mb-4">
                {date
                  ? date.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                  : "Sélectionnez une date"}
              </h3>

              {selectedDateEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event._id}
                      className="bg-background border border-border rounded-lg p-4 hover:border-electric-blue/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <Badge className={`text-xs ${categoryColors[event.category]}`}>
                          {event.category}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(event.startDate).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>
                            {event.participants.length}/{event.maxParticipants}
                          </span>
                        </div>
                      </div>
                      <Button asChild size="sm" className="w-full mt-3" variant="outline">
                        <Link href="/events">Voir détails</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    {date ? "Aucun événement ce jour" : "Sélectionnez une date"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Events Timeline */}
        <div className="mt-8">
          <h3 className="text-2xl font-display font-bold mb-6">Tous les événements à venir</h3>
          <div className="space-y-4">
            {events
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .map((event, index) => (
                <div
                  key={event._id}
                  className="bg-card border border-border rounded-lg p-6 hover:border-electric-blue/50 transition-all group card-3d"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-electric-blue/20 rounded-lg flex flex-col items-center justify-center border border-electric-blue/30">
                      <span className="text-2xl font-bold text-electric-blue">
                        {new Date(event.startDate).getDate()}
                      </span>
                      <span className="text-xs text-electric-blue uppercase">
                        {new Date(event.startDate).toLocaleDateString("fr-FR", { month: "short" })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-display font-bold text-lg group-hover:text-electric-blue transition-colors">
                            {event.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        </div>
                        <Badge className={`ml-4 ${categoryColors[event.category]}`}>
                          {event.category}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(event.startDate).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>
                            {event.participants.length}/{event.maxParticipants} inscrits
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </DashboardPageLayout>
    </ProtectedRoute>
  )
}
