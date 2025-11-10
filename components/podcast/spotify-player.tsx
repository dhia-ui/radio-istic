'use client'

interface SpotifyPlayerProps {
  episodeId: string
  height?: number
}

export function SpotifyPlayer({ episodeId, height = 352 }: SpotifyPlayerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <iframe
        style={{ borderRadius: '12px' }}
        src={`https://open.spotify.com/embed/episode/${episodeId}?utm_source=generator&theme=0`}
        width="100%"
        height={height}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        title="Spotify Podcast Player"
      />
    </div>
  )
}

// Usage example:
// <SpotifyPlayer episodeId="2ePzduTwuu4OsYRw9DTJb5" />
