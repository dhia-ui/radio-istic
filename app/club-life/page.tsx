"use client"

import { useState, useEffect } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Calendar, ThumbsUp, ThumbsDown, MessageSquare, Users, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { api } from "@/lib/api"
import Image from "next/image"

interface ApiEvent {
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

type Event = {
  id: string
  title: string
  description: string
  date: string
  location: string
  organizer: string
  image: string
  likes: number
  dislikes: number
  comments: Comment[]
  userVote?: "like" | "dislike"
  category: string
}

type Comment = {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
}

// Map event titles/categories to their corresponding images
const getEventImage = (event: ApiEvent): string => {
  const title = event.title.toLowerCase()
  const category = event.category.toLowerCase()
  
  // Ping-pong events
  if (title.includes("ping") || title.includes("pong")) {
    return "/events/ping-pong-tournament.jpg"
  }
  
  // Football events
  if (title.includes("football") || title.includes("foot") || title.includes("soccer")) {
    return "/vibrant-football-tournament.png"
  }
  
  // Cinema events
  if (title.includes("cinéma") || title.includes("cinema") || title.includes("film")) {
    return "/events/cinema-night.jpg"
  }
  
  // Matchy Matchy / Speed Dating - Speed dating students image
  if (title.includes("matchy") || title.includes("speed dating") || title.includes("rencontre")) {
    return "/events/matchy-matchy.jpg"
  }
  
  // Soirée events / Musical events
  if (title.includes("soirée") || title.includes("soiree") || title.includes("concert") || title.includes("musical")) {
    return "/events/soiree-event.jpg"
  }
  
  // Podcast events / Workshop
  if (title.includes("podcast") || title.includes("radio") || title.includes("enregistrement") || title.includes("workshop")) {
    return "/podcast-studio-recording.jpg"
  }
  
  // Welcome / Freshman events
  if (title.includes("welcome") || title.includes("freshman") || title.includes("bienvenue")) {
    return "/student-life-vlog-campus.jpg"
  }
  
  // Voyage / Trip events
  if (title.includes("voyage") || title.includes("ain") || title.includes("draham") || title.includes("trip")) {
    return "/events/ain-draham-trip.jpg"
  }
  
  // Default based on category
  if (category.includes("sport")) {
    return "/vibrant-football-tournament.png"
  }
  if (category.includes("social")) {
    return "/events/soiree-event.jpg"
  }
  if (category.includes("podcast")) {
    return "/podcast-studio-recording.jpg"
  }
  
  // Generic default
  return "/events/default-event.jpg"
}

export default function ClubLifePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({})

  // Load events from API on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true)
        const response = await api.events.getAll()
        
        if (response.success && response.events) {
          // Get saved votes and comments from localStorage
          const savedData = localStorage.getItem('radio-istic-club-life-data')
          let savedVotes: { [key: string]: "like" | "dislike" } = {}
          let savedComments: { [key: string]: Comment[] } = {}
          let savedLikes: { [key: string]: number } = {}
          let savedDislikes: { [key: string]: number } = {}
          
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData)
              savedVotes = parsed.votes || {}
              savedComments = parsed.comments || {}
              savedLikes = parsed.likes || {}
              savedDislikes = parsed.dislikes || {}
            } catch (error) {
              console.error('Failed to parse saved data:', error)
            }
          }

          // Transform API events to club life format
          const transformedEvents: Event[] = response.events.map((event: ApiEvent) => {
            const eventId = event._id
            const organizerName = event.organizer 
              ? `${event.organizer.firstName} ${event.organizer.lastName}`
              : "Radio ISTIC"
            
            return {
              id: eventId,
              title: event.title,
              description: event.description,
              date: event.startDate,
              location: event.location,
              organizer: organizerName,
              image: getEventImage(event),
              category: event.category,
              likes: savedLikes[eventId] || 0,
              dislikes: savedDislikes[eventId] || 0,
              comments: savedComments[eventId] || [],
              userVote: savedVotes[eventId],
            }
          })
          
          setEvents(transformedEvents)
        }
      } catch (error) {
        console.error('Failed to load events:', error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les événements",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      loadEvents()
    }
  }, [user, toast])

  // Save votes and comments to localStorage whenever events change
  useEffect(() => {
    if (typeof window !== 'undefined' && events.length > 0) {
      const dataToSave = {
        votes: events.reduce((acc, event) => {
          if (event.userVote) {
            acc[event.id] = event.userVote
          }
          return acc
        }, {} as { [key: string]: "like" | "dislike" }),
        comments: events.reduce((acc, event) => {
          if (event.comments.length > 0) {
            acc[event.id] = event.comments
          }
          return acc
        }, {} as { [key: string]: Comment[] }),
        likes: events.reduce((acc, event) => {
          acc[event.id] = event.likes
          return acc
        }, {} as { [key: string]: number }),
        dislikes: events.reduce((acc, event) => {
          acc[event.id] = event.dislikes
          return acc
        }, {} as { [key: string]: number }),
      }
      localStorage.setItem('radio-istic-club-life-data', JSON.stringify(dataToSave))
    }
  }, [events])

  const handleVote = async (eventId: string, voteType: "like" | "dislike") => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id !== eventId) return event

        const currentVote = event.userVote
        let newLikes = event.likes
        let newDislikes = event.dislikes
        let newVote: "like" | "dislike" | undefined = voteType

        // Remove previous vote
        if (currentVote === "like") newLikes--
        if (currentVote === "dislike") newDislikes--

        // Add new vote or remove if same
        if (currentVote === voteType) {
          newVote = undefined
          toast({
            title: "Vote retiré",
            description: "Votre réaction a été supprimée",
          })
        } else {
          if (voteType === "like") newLikes++
          if (voteType === "dislike") newDislikes++
          toast({
            title: "Vote enregistré",
            description: `Vous avez ${voteType === "like" ? "aimé" : "n'aimez pas"} cet événement`,
          })
        }

        return {
          ...event,
          likes: newLikes,
          dislikes: newDislikes,
          userVote: newVote,
        }
      }),
    )
  }

  const handleAddComment = async (eventId: string) => {
    if (!user) return
    
    const commentText = newComments[eventId]?.trim()
    if (!commentText) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le commentaire ne peut pas être vide",
      })
      return
    }

    const authorName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.email || "Utilisateur"

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: authorName,
      avatar: user.avatar || "/placeholder.svg",
      content: commentText,
      timestamp: "À l'instant",
    }

    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, comments: [...event.comments, newComment] } : event,
      ),
    )

    setNewComments((prev) => ({ ...prev, [eventId]: "" }))
    
    toast({
      title: "Commentaire ajouté",
      description: "Votre commentaire a été publié avec succès",
    })
  }

  if (!user) {
    router.push("/login")
    return null
  }

  if (isLoading) {
    return (
      <DashboardPageLayout
        header={{
          title: "Vie du Club",
          description: "Événements, sondages et feedback de la communauté",
          icon: Users,
        }}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-electric-blue" />
        </div>
      </DashboardPageLayout>
    )
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Vie du Club",
        description: "Événements, sondages et feedback de la communauté",
        icon: Users,
      }}
    >
      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun événement disponible</h3>
            <p className="text-muted-foreground">Les événements apparaîtront ici bientôt.</p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-electric-blue/50 transition-all"
            >
              {event.image && (
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={event.image} 
                    alt={event.title} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold mb-2">{event.title}</h3>
                    <p className="text-muted-foreground mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center gap-2 text-electric-blue">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(event.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-neon-lime" />
                        <Badge variant="outline" className="border-neon-lime/30 text-neon-lime">
                          {event.location}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground">Organisé par {event.organizer}</span>
                    </div>
                  </div>
                </div>

                {/* Voting Section */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                  <Button
                    variant={event.userVote === "like" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVote(event.id, "like")}
                    className={event.userVote === "like" ? "bg-neon-lime text-black hover:bg-neon-lime/90" : ""}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {event.likes}
                  </Button>
                  <Button
                    variant={event.userVote === "dislike" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVote(event.id, "dislike")}
                    className={
                      event.userVote === "dislike" ? "bg-signal-orange text-white hover:bg-signal-orange/90" : ""
                    }
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    {event.dislikes}
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground ml-auto">
                    <MessageSquare className="h-4 w-4" />
                    <span>{event.comments.length} commentaire{event.comments.length > 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="space-y-4">
                  {event.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar} alt={comment.author} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted rounded-lg p-3">
                          <p className="font-semibold text-sm mb-1">{comment.author}</p>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground ml-3 mt-1 inline-block">
                          {comment.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Add Comment */}
                  <div className="flex gap-3 mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.firstName} />
                      <AvatarFallback>{user.firstName?.[0] || user.email?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder="Ajouter un commentaire..."
                        value={newComments[event.id] || ""}
                        onChange={(e) => setNewComments((prev) => ({ ...prev, [event.id]: e.target.value }))}
                        className="min-h-[60px]"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleAddComment(event.id)
                          }
                        }}
                      />
                      <Button
                        onClick={() => handleAddComment(event.id)}
                        disabled={!newComments[event.id]?.trim()}
                        className="bg-electric-blue hover:bg-electric-blue/90"
                      >
                        Publier
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardPageLayout>
  )
}
