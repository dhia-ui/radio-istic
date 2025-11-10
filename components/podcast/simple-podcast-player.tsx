'use client'

interface PodcastPlayerProps {
  title: string
  description?: string
  episodeId?: string
  spotifyUrl?: string
  youtubeUrl?: string
}

export function SimplePodcastPlayer({ 
  title, 
  description, 
  episodeId, 
  spotifyUrl,
  youtubeUrl 
}: PodcastPlayerProps) {
  // If we have Spotify episode ID, use embed
  if (episodeId) {
    return (
      <div className="w-full bg-card rounded-xl p-4 shadow-lg border border-border">
        <h3 className="font-bold mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        <iframe
          style={{ borderRadius: '12px' }}
          src={`https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    )
  }

  // Otherwise show a placeholder with links
  return (
    <div className="w-full bg-card rounded-xl p-6 shadow-lg border border-border">
      <h3 className="font-bold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <div className="flex gap-2">
        {spotifyUrl && (
          <a 
            href={spotifyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
          >
            🎧 Écouter sur Spotify
          </a>
        )}
        {youtubeUrl && (
          <a 
            href={youtubeUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            ▶️ Voir sur YouTube
          </a>
        )}
        {!spotifyUrl && !youtubeUrl && (
          <a 
            href="https://www.youtube.com/@radioistic" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            ▶️ Voir sur YouTube
          </a>
        )}
      </div>
    </div>
  )
}
