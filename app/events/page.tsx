"use client"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import React, { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useJson } from "@/lib/use-swr-json";

import { upcomingEvents } from "@/data/events";

const categoryColors: Record<string, string> = {
  Sport: "bg-neon-lime/20 text-neon-lime border-neon-lime/30",
  Podcast: "bg-electric-blue/20 text-electric-blue border-electric-blue/30",
  Soirée: "bg-signal-orange/20 text-signal-orange border-signal-orange/30",
  Voyage: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Social: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

export default function EventsPage() {
  const { toast } = useToast();
  // Example SWR usage for future server-backed events list
  const { data: eventsData } = useJson<{ events?: typeof upcomingEvents }>(null);
  const eventsList = useMemo(() => eventsData?.events ?? upcomingEvents, [eventsData]);
  const [rsvpState, setRsvpState] = useState<Record<string, { attending: boolean; count: number }>>({});
  const [voteState, setVoteState] = useState<Record<string, { upvoted: boolean; total: number }>>({});
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, { id: string; userId: string; text: string; createdAt: string }[]>>({});

  async function api(action: string, eventId: string, extra?: any) {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, eventId, userId: "joyboy", ...extra }),
    });
    if (!res.ok) throw new Error("Action échouée");
    return res.json();
  }

  async function toggleRsvp(eventId: string) {
    try {
      const data = await api("rsvp", eventId);
      setRsvpState((s) => ({ ...s, [eventId]: { attending: data.attending, count: data.attendees } }));
      toast({ title: data.attending ? "Inscription confirmée" : "Inscription annulée" });
    } catch {
      toast({ variant: "destructive", title: "Impossible de modifier l'inscription" });
    }
  }

  async function toggleVote(eventId: string) {
    try {
      const data = await api("vote", eventId);
      setVoteState((s) => ({ ...s, [eventId]: { upvoted: data.upvoted, total: data.total } }));
    } catch {
      toast({ variant: "destructive", title: "Vote échoué" });
    }
  }

  async function addReminder(eventId: string, when: string) {
    try {
      await api("remind", eventId, { when });
      toast({ title: "Rappel programmé", description: `Notification ${when} avant l'événement.` });
    } catch {
      toast({ variant: "destructive", title: "Rappel non enregistré" });
    }
  }

  async function submitComment(eventId: string) {
    const text = commentDraft[eventId]?.trim();
    if (!text) return;
    try {
      const data = await api("comment", eventId, { text });
      setComments((c) => ({ ...c, [eventId]: [...(c[eventId] || []), data.comment] }));
      setCommentDraft((d) => ({ ...d, [eventId]: "" }));
    } catch {
      toast({ variant: "destructive", title: "Commentaire échoué" });
    }
  }
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
        {eventsList.map((event) => (
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
                    {(rsvpState[event.id]?.count ?? event.participants)}/{event.maxParticipants} participants
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full bg-electric-blue hover:bg-electric-blue/90"
                  variant={rsvpState[event.id]?.attending ? "secondary" : "default"}
                  onClick={() => toggleRsvp(event.id)}
                  aria-label={rsvpState[event.id]?.attending ? `Cancel registration for ${event.title}` : `Register for ${event.title}`}
                >
                  {rsvpState[event.id]?.attending ? "Annuler l'inscription" : "S'inscrire"}
                </Button>
                <div className="flex gap-2 text-xs">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => addReminder(event.id, "1h")}
                    aria-label={`Set 1 hour reminder for ${event.title}`}
                  >
                    Rappel 1h
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => addReminder(event.id, "1d")}
                    aria-label={`Set 1 day reminder for ${event.title}`}
                  >
                    Rappel 1j
                  </Button>
                  <Button 
                    size="sm" 
                    variant={voteState[event.id]?.upvoted ? "default" : "outline"} 
                    onClick={() => toggleVote(event.id)}
                    aria-label={`${voteState[event.id]?.upvoted ? 'Remove vote' : 'Vote'} for ${event.title}. Current votes: ${voteState[event.id]?.total ?? 0}`}
                  >
                    👍 {voteState[event.id]?.total ?? 0}
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  <Textarea
                    placeholder="Commenter..."
                    value={commentDraft[event.id] || ""}
                    onChange={(e) => setCommentDraft((d) => ({ ...d, [event.id]: e.target.value }))}
                    className="h-16 text-xs"
                    aria-label={`Write a comment for ${event.title}`}
                  />
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={() => submitComment(event.id)} 
                    disabled={!commentDraft[event.id]?.trim()}
                    aria-label={`Submit comment for ${event.title}`}
                  >
                    Envoyer
                  </Button>
                  <div 
                    className="space-y-1 max-h-32 overflow-y-auto text-xs"
                    role="list"
                    aria-label={`Comments for ${event.title}`}
                  >
                    {(comments[event.id] || []).map((c) => (
                      <div key={c.id} className="border border-border/40 rounded p-1" role="listitem">
                        <span className="font-medium">{c.userId}</span> <span className="opacity-70">{new Date(c.createdAt).toLocaleTimeString("fr-TN", { timeZone: "Africa/Tunis", hour: "2-digit", minute: "2-digit" })}</span>
                        <div>{c.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardPageLayout>
  )
}
