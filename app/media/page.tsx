"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Radio, ImageIcon, Video, X, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EventPhotoGallery } from "@/components/event-photo-gallery"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

const podcasts = [
  {
    id: "1",
    title: "Hidden Talent",
    episode: "Épisode 1",
    description: "Découvrez les talents cachés de nos membres - performances incroyables et moments authentiques",
    duration: "3 min",
    date: "2025-11-11",
    cover: "/podcast-microphone-neon.jpg",
    category: "Vidéo",
    instagramUrl: "https://www.instagram.com/reel/DP6wpTdDHp5/",
    audioUrl: "https://www.instagram.com/reel/DP6wpTdDHp5/",
  },
  {
    id: "2",
    title: "InBetween Podcast",
    episode: "Épisode 1",
    description: "Discussions authentiques entre étudiants - partage d'expériences et débats sur la vie universitaire",
    duration: "45 min",
    date: "2025-01-15",
    cover: "/podcast-microphone-neon.jpg",
    category: "Podcast",
    spotifyUrl: "https://open.spotify.com/episode/2ePzduTwuu4OsYRw9DTJb5",
    youtubeId: "M33JDlNnrTc",
  },  
  {
    id: "3",
    title: "Tech Talk avec Shrek AI",
    episode: "Épisode 3",
    description: "Conversations avec une IA version Shrek sur les dernières tendances tech",
    duration: "38 min",
    date: "2025-01-20",
    cover: "/ai-technology-podcast.jpg",
    category: "Podcast",
    spotifyUrl: "https://open.spotify.com/episode/7makk4oTQel546B0PZlDM5",
  },
  {
    id: "4",
    title: "Yawmiyat Bac ISTIC",
    episode: "Série",
    description: "Les aventures quotidiennes des étudiants de première année",
    duration: "Série",
    date: "2025-01-25",
    cover: "/student-life-vlog.jpg",
    category: "Vidéo",
  },
  {
    id: "5",
    title: "Small Business Stories",
    episode: "Épisode 5",
    description: "Rencontres avec des entrepreneurs tunisiens qui ont réussi",
    duration: "52 min",
    date: "2025-02-01",
    cover: "/business-entrepreneur-interview.jpg",
    category: "Podcast",
  },
]

const galleries = [
  {
    id: "1",
    title: "Tournoi de Ping-Pong 2024",
    images: 4,
    date: "2024-12-15",
    cover: "/events/ping-pong-tournament.jpg",
    photos: [
      "/logo/Gemini_Generated_Image_fs6oy3fs6oy3fs6o.png",
      "/events/ping-pong-tournament.jpg",
      "/ping-pong-tournament.jpg",
      "/ping-pong-tournament-action.jpg",
    ],
  },
  {
    id: "2",
    title: "Voyage à Ain Draham",
    images: 4,
    date: "2024-11-20",
    cover: "/events/ain-draham-trip.jpg",
    photos: [
      "/events/ain-draham-trip.jpg",
      "/ain-draham-nature-trip.jpg",
      "/ain-draham-nature-group.jpg",
      "/ain-draham-nature-group-photo.jpg",
    ],
  },
  {
    id: "3",
    title: "Match Football ISTIC",
    images: 2,
    date: "2024-12-01",
    cover: "/vibrant-football-tournament.png",
    photos: [
      "/vibrant-football-tournament.png",
      "/logo/match.png",
    ],
  },
  {
    id: "4",
    title: "Soirée Cinéma",
    images: 2,
    date: "2024-11-15",
    cover: "/events/cinema-night.jpg",
    photos: [
      "/events/cinema-night.jpg",
      "/cinema-night-students.jpg",
    ],
  },
  {
    id: "5",
    title: "Matchy Matchy & Speed Dating",
    images: 2,
    date: "2024-10-30",
    cover: "/events/matchy-matchy.jpg",
    photos: [
      "/events/matchy-matchy.jpg",
      "/speed-dating-students.jpg",
    ],
  },
  {
    id: "6",
    title: "Enregistrements Podcasts",
    images: 4,
    date: "2024-12-05",
    cover: "/events/podcast-live-recording.jpg",
    photos: [
      "/events/podcast-live-recording.jpg",
      "/podcast-studio-recording.jpg",
      "/podcast-microphone-neon.jpg",
      "/podcast-microphone-neon-lights.jpg",
    ],
  },
]

export default function MediaPage() {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState<{ title: string; photos: string[] } | null>(null)
  const [playerOpen, setPlayerOpen] = useState(false)
  const [selectedPodcast, setSelectedPodcast] = useState<typeof podcasts[0] | null>(null)

  const openGallery = (gallery: typeof galleries[0]) => {
    setSelectedGallery({ title: gallery.title, photos: gallery.photos })
    setGalleryOpen(true)
  }

  const openPlayer = (podcast: typeof podcasts[0]) => {
    setSelectedPodcast(podcast)
    setPlayerOpen(true)
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Médias & Podcasts",
        description: "Découvrez nos contenus",
        icon: Radio,
      }}
    >
      {/* Hero Section - Mobile Optimized */}
      <div className="bg-gradient-to-br from-signal-orange/20 via-background to-electric-blue/10 border border-signal-orange/30 rounded-xl p-4 sm:p-6 md:p-8 mb-6">
        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-2 sm:mb-3">Écoutez nos podcasts</h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-4">
          Des discussions authentiques, des interviews inspirantes et du contenu créé par les étudiants pour les
          étudiants.
        </p>
        <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-3 sm:p-4 mb-4">
          <h3 className="font-display font-bold mb-3 text-base sm:text-lg">Dernier épisode: {podcasts[0].title}</h3>
          <div className="space-y-3">
            {/* Instagram Embed for Hidden Talent */}
            {podcasts[0].instagramUrl && (
              <div className="w-full space-y-4">
                {/* Instagram Reel with Sound */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                    Instagram Reel - Hidden Talent
                  </span>
                </div>
                <div className="relative w-full bg-black rounded-xl overflow-hidden border border-border shadow-lg">
                  <div className="aspect-[9/16] max-w-[400px] mx-auto">
                    <iframe
                      src={`${podcasts[0].instagramUrl}embed/`}
                      className="w-full h-full"
                      frameBorder="0"
                      scrolling="no"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                  </div>
                </div>
                <Button 
                  asChild 
                  className="w-full mt-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white"
                  size="lg"
                >
                  <a
                    href={podcasts[0].instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Voir sur Instagram
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-sm sm:text-base">Voir tous les épisodes</Button>
        </div>
      </div>

      {/* Podcasts Section - Mobile Optimized */}
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-display font-bold mb-4 sm:mb-6">Podcasts & Émissions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              onClick={() => openPlayer(podcast)}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:border-signal-orange/50 hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-signal-orange/20 to-electric-blue/20">
                <img
                  src={podcast.cover || "/placeholder.svg"}
                  alt={podcast.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-signal-orange rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" fill="white" />
                  </div>
                </div>
                <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-signal-orange/90 backdrop-blur-sm text-xs sm:text-sm">
                  {podcast.category}
                </Badge>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <Badge variant="outline" className="mb-2 text-xs bg-black/50 backdrop-blur-sm border-white/20">
                    {podcast.episode}
                  </Badge>
                  <h4 className="font-display font-bold text-base sm:text-lg text-white mb-1 line-clamp-1">
                    {podcast.title}
                  </h4>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                  {podcast.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{podcast.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">
                      {new Date(podcast.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline sm:hidden">
                      {new Date(podcast.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Galleries Section - Mobile Optimized */}
      <div>
        <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4">Galeries Photos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {galleries.map((gallery) => (
            <div
              key={gallery.id}
              onClick={() => openGallery(gallery)}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-electric-blue/50 transition-all group cursor-pointer"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <img
                  src={gallery.cover || "/placeholder.svg"}
                  alt={gallery.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <h4 className="font-display font-bold text-white mb-1 text-sm sm:text-base">{gallery.title}</h4>
                  <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                    <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{gallery.images} photos</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">
                      {new Date(gallery.date).toLocaleDateString("fr-TN", {
                        timeZone: "Africa/Tunis",
                      })}
                    </span>
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-electric-blue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center">
                    <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2" />
                    <p className="font-semibold text-sm sm:text-base">Voir la galerie</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Section - Mobile Optimized */}
      <div className="mt-8 bg-card border border-border rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-display font-bold mb-3 sm:mb-4">Suivez-nous sur les réseaux sociaux</h3>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Button asChild variant="outline" className="gap-2 bg-transparent text-xs sm:text-sm">
            <a href="https://www.instagram.com/radio.istic" target="_blank" rel="noopener noreferrer">
              <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              Instagram
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2 bg-transparent text-xs sm:text-sm">
            <a
              href="https://www.tiktok.com/@radioistic2?is_from_webapp=1&sender_device=pc"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Video className="h-3 w-3 sm:h-4 sm:w-4" />
              TikTok
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2 bg-transparent text-xs sm:text-sm">
            <a
              href="https://www.facebook.com/people/Radio-Istic/61580851396527/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Radio className="h-3 w-3 sm:h-4 sm:w-4" />
              Facebook
            </a>
          </Button>
        </div>
      </div>

      {/* Episode Player Dialog */}
      <Dialog open={playerOpen} onOpenChange={setPlayerOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <DialogTitle className="text-xl sm:text-2xl font-display font-bold">
              {selectedPodcast?.title}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className="bg-signal-orange/90">{selectedPodcast?.category}</Badge>
              <Badge variant="outline">{selectedPodcast?.episode}</Badge>
              <span className="text-xs sm:text-sm text-muted-foreground">{selectedPodcast?.duration}</span>
            </div>
          </DialogHeader>
          
          <div className="p-4 sm:p-6 space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground">{selectedPodcast?.description}</p>
            
            {/* Instagram Embed */}
            {selectedPodcast?.instagramUrl && (
              <div className="space-y-4">
                {/* Instagram Reel */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                    Instagram Reel
                  </span>
                </div>
                <div className="relative w-full bg-black rounded-xl overflow-hidden">
                  <div className="aspect-[9/16] max-w-[400px] mx-auto">
                    <iframe
                      src={`${selectedPodcast.instagramUrl}embed/`}
                      className="w-full h-full"
                      frameBorder="0"
                      scrolling="no"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                  </div>
                </div>
                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white"
                >
                  <a
                    href={selectedPodcast.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Voir sur Instagram
                  </a>
                </Button>
              </div>
            )}

            {/* Spotify Embed */}
            {selectedPodcast?.spotifyUrl && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-green-500">Écouter sur Spotify</span>
                </div>
                <iframe
                  style={{ borderRadius: "12px" }}
                  src={`https://open.spotify.com/embed/episode/${selectedPodcast.spotifyUrl.split('/').pop()}?theme=0`}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            )}

            {/* YouTube Section */}
            {selectedPodcast?.youtubeId && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <Video className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-red-500">Regarder sur YouTube</span>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedPodcast.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full group cursor-pointer"
                >
                  <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-border hover:border-red-500 transition-colors">
                    <img
                      src={`https://img.youtube.com/vi/${selectedPodcast.youtubeId}/maxresdefault.jpg`}
                      alt={selectedPodcast.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${selectedPodcast.youtubeId}/hqdefault.jpg`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
                <Button 
                  asChild 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedPodcast.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Ouvrir sur YouTube
                  </a>
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Gallery Modal */}
      {selectedGallery && (
        <EventPhotoGallery
          eventTitle={selectedGallery.title}
          photos={selectedGallery.photos}
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
        />
      )}
    </DashboardPageLayout>
  )
}
