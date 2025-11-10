import { SpotifyPlayer } from '@/components/podcast/spotify-player'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Podcasts | Radio Istic',
  description: 'Listen to Radio Istic podcasts and watch our latest episodes'
}

export default function PodcastsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Radio Istic Podcasts</h1>
        <p className="text-muted-foreground text-lg">
          Stay tuned with the latest episodes, interviews, and discussions from Radio Istic
        </p>
      </div>
      
      {/* Featured Podcast */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Latest Episode</h2>
        <SpotifyPlayer episodeId="2ePzduTwuu4OsYRw9DTJb5" />
      </section>
      
      {/* YouTube Player */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Watch on YouTube</h2>
        <div className="aspect-video max-w-4xl mx-auto">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/M33JDlNnrTc"
            title="Radio Istic Podcast"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-xl shadow-lg"
          />
        </div>
      </section>

      {/* More Episodes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">More Episodes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Episode cards can be added here */}
          <div className="card bg-card border border-border p-6">
            <h3 className="font-semibold text-lg mb-2">Episode 1: Tech Talk</h3>
            <p className="text-muted-foreground mb-4">
              Discussing the latest in technology and innovation
            </p>
            <button className="btn btn-primary btn-sm">Listen Now</button>
          </div>
          
          <div className="card bg-card border border-border p-6">
            <h3 className="font-semibold text-lg mb-2">Episode 2: Student Life</h3>
            <p className="text-muted-foreground mb-4">
              Exploring campus culture and student experiences
            </p>
            <button className="btn btn-primary btn-sm">Listen Now</button>
          </div>
          
          <div className="card bg-card border border-border p-6">
            <h3 className="font-semibold text-lg mb-2">Episode 3: Music Special</h3>
            <p className="text-muted-foreground mb-4">
              Featuring local artists and upcoming talents
            </p>
            <button className="btn btn-primary btn-sm">Listen Now</button>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="text-center py-12 bg-card rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Never Miss an Episode</h2>
        <p className="text-muted-foreground mb-6">
          Subscribe to Radio Istic on your favorite podcast platform
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a 
            href="https://open.spotify.com/show/your-show-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Spotify
          </a>
          <a 
            href="https://youtube.com/@radioistic" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            YouTube
          </a>
          <a 
            href="https://podcasts.apple.com/podcast/your-podcast" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Apple Podcasts
          </a>
        </div>
      </section>
    </div>
  )
}
