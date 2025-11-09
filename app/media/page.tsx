"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Radio, ImageIcon, Video, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AudioWaveform } from "@/components/media/audio-waveform"
import { useMediaPlayer } from "@/components/media/media-player-context"

const podcasts = [
  {
    id: "1",
    title: "ISTIC Hater Vibe",
    episode: "Épisode 1",
    description: "Podcast anonyme avec voice changer - discussions franches sur la vie à l'ISTIC",
    duration: "45 min",
    date: "2025-01-15",
    cover: "/podcast-microphone-neon.jpg",
    category: "Podcast",
    audioUrl: "/audio/radio-istic-podcast-ep1.mp3",
  },  
  {
    id: "2",
    title: "Tech Talk avec Shrek AI",
    episode: "Épisode 3",
    description: "Conversations avec une IA version Shrek sur les dernières tendances tech",
    duration: "38 min",
    date: "2025-01-20",
    cover: "/ai-technology-podcast.jpg",
    category: "Podcast",
    audioUrl: "/audio/radio-istic-podcast-ep3.mp3",
  },
  {
    id: "3",
    title: "Yawmiyat Bac ISTIC",
    episode: "Série",
    description: "Les aventures quotidiennes des étudiants de première année",
    duration: "Série",
    date: "2025-01-25",
    cover: "/student-life-vlog.jpg",
    category: "Vidéo",
  },
  {
    id: "4",
    title: "Small Business Stories",
    episode: "Épisode 5",
    description: "Rencontres avec des entrepreneurs tunisiens qui ont réussi",
    duration: "52 min",
    date: "2025-02-01",
    cover: "/business-entrepreneur-interview.jpg",
    category: "Podcast",
    audioUrl: "/audio/radio-istic-podcast-ep5.mp3",
  },
]

const galleries = [
  {
    id: "1",
    title: "Tournoi de Ping-Pong 2024",
    images: 45,
    date: "2024-12-15",
    cover: "/ping-pong-tournament-action.jpg",
  },
  {
    id: "2",
    title: "Voyage à Ain Draham",
    images: 78,
    date: "2024-11-20",
    cover: "/ain-draham-nature-group-photo.jpg",
  },
  {
    id: "3",
    title: "Soirée de Gala 2024",
    images: 120,
    date: "2024-10-30",
    cover: "/gala-night-students-formal.jpg",
  },
]

export default function MediaPage() {
  const { playNow, addToQueue } = useMediaPlayer();
  return (
    <DashboardPageLayout
      header={{
        title: "Médias & Podcasts",
        description: "Découvrez nos contenus",
        icon: Radio,
      }}
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-signal-orange/20 via-background to-electric-blue/10 border border-signal-orange/30 rounded-xl p-8 mb-6">
        <h2 className="text-3xl font-display font-bold mb-3">Écoutez nos podcasts</h2>
        <p className="text-muted-foreground mb-4">
          Des discussions authentiques, des interviews inspirantes et du contenu créé par les étudiants pour les
          étudiants.
        </p>
        <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-4 mb-4">
          <h3 className="font-display font-bold mb-3">Dernier épisode: {podcasts[0].title}</h3>
          <div className="space-y-3">
            <AudioWaveform
              src={`/api/media/audio?file=${(podcasts[0].audioUrl ?? "").split('/').pop()}`}
              title={`${podcasts[0].episode} • ${podcasts[0].duration}`}
            />
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() =>
                  playNow({
                    id: podcasts[0].id,
                    title: podcasts[0].title,
                    subtitle: podcasts[0].episode,
                    src: `/api/media/audio?file=${(podcasts[0].audioUrl ?? "").split('/').pop()}`,
                    cover: podcasts[0].cover,
                  })
                }
              >
                Lire maintenant
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  addToQueue({
                    id: podcasts[0].id,
                    title: podcasts[0].title,
                    subtitle: podcasts[0].episode,
                    src: `/api/media/audio?file=${(podcasts[0].audioUrl ?? "").split('/').pop()}`,
                    cover: podcasts[0].cover,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Ajouter à la file
              </Button>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Voir tous les podcasts</Button>
        </div>
      </div>

      {/* Podcasts Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-display font-bold mb-4">Podcasts & Émissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-signal-orange/50 transition-all group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={podcast.cover || "/placeholder.svg"}
                  alt={podcast.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-signal-orange/90">{podcast.category}</Badge>
              </div>
              <div className="p-4">
                <Badge variant="outline" className="mb-2 text-xs">
                  {podcast.episode}
                </Badge>
                <h4 className="font-display font-bold mb-2 group-hover:text-signal-orange transition-colors">
                  {podcast.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{podcast.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{podcast.duration}</span>
                  <span>
                    {new Date(podcast.date).toLocaleDateString("fr-TN", {
                      timeZone: "Africa/Tunis",
                    })}
                  </span>
                </div>
                {podcast.audioUrl && (
                  <div className="mt-3 space-y-2">
                    <AudioWaveform
                      src={`/api/media/audio?file=${(podcast.audioUrl ?? "").split('/').pop()}`}
                      title={podcast.episode}
                      height={48}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() =>
                          playNow({
                            id: podcast.id,
                            title: podcast.title,
                            subtitle: podcast.episode,
                            src: `/api/media/audio?file=${(podcast.audioUrl ?? "").split('/').pop()}`,
                            cover: podcast.cover,
                          })
                        }
                      >
                        Lire
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          addToQueue({
                            id: podcast.id,
                            title: podcast.title,
                            subtitle: podcast.episode,
                            src: `/api/media/audio?file=${(podcast.audioUrl ?? "").split('/').pop()}`,
                            cover: podcast.cover,
                          })
                        }
                      >
                        <Plus className="h-3 w-3 mr-1" /> File
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Galleries Section */}
      <div>
        <h3 className="text-2xl font-display font-bold mb-4">Galeries Photos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-electric-blue/50 transition-all group cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={gallery.cover || "/placeholder.svg"}
                  alt={gallery.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="font-display font-bold text-white mb-1">{gallery.title}</h4>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <ImageIcon className="h-4 w-4" />
                    <span>{gallery.images} photos</span>
                    <span>•</span>
                    <span>
                      {new Date(gallery.date).toLocaleDateString("fr-TN", {
                        timeZone: "Africa/Tunis",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Section */}
      <div className="mt-8 bg-card border border-border rounded-xl p-6">
        <h3 className="text-xl font-display font-bold mb-4">Suivez-nous sur les réseaux sociaux</h3>
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="outline" className="gap-2 bg-transparent">
            <a href="https://www.instagram.com/radio.istic" target="_blank" rel="noopener noreferrer">
              <ImageIcon className="h-4 w-4" />
              Instagram
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2 bg-transparent">
            <a
              href="https://www.tiktok.com/@radioistic2?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Video className="h-4 w-4" />
              TikTok
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2 bg-transparent">
            <a
              href="https://www.facebook.com/people/Radio-Istic/61580851396527/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Radio className="h-4 w-4" />
              Facebook
            </a>
          </Button>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
