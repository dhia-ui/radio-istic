export default function BureauLoading() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="h-20 bg-card/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-card/50 rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-card/50 rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
