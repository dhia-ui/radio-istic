'use client'

interface YouTubePlayerProps {
  videoId: string
  title?: string
  width?: string
  height?: string
}

export function YouTubePlayer({ 
  videoId, 
  title = "YouTube Video",
  width = "100%",
  height = "100%"
}: YouTubePlayerProps) {
  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-lg">
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}
