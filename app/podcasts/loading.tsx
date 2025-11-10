export default function PodcastsLoading() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 animate-pulse">
        <div className="h-10 w-64 bg-muted rounded mb-4"></div>
        <div className="h-6 w-96 bg-muted rounded"></div>
      </div>
      
      <section className="mb-12">
        <div className="h-8 w-48 bg-muted rounded mb-6"></div>
        <div className="w-full max-w-2xl mx-auto h-[352px] bg-muted rounded-xl animate-pulse"></div>
      </section>
      
      <section className="mb-12">
        <div className="h-8 w-48 bg-muted rounded mb-6"></div>
        <div className="aspect-video max-w-4xl mx-auto bg-muted rounded-xl animate-pulse"></div>
      </section>
    </div>
  )
}
