"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EventPhotoGalleryProps {
  eventTitle: string
  photos: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  initialPhotoIndex?: number
}

export function EventPhotoGallery({
  eventTitle,
  photos,
  open,
  onOpenChange,
  initialPhotoIndex = 0,
}: EventPhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1))
  }

  const goToPhoto = (index: number) => {
    setCurrentIndex(index)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
    if (e.key === "Escape") onOpenChange(false)
  }

  if (photos.length === 0) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-7xl h-[90vh] p-0 overflow-hidden bg-black/95"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display text-white">{eventTitle}</h2>
            <p className="text-sm text-white/70">
              Photo {currentIndex + 1} sur {photos.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-full flex items-center justify-center p-20">
          <img
            src={photos[currentIndex]}
            alt={`${eventTitle} - Photo ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />

          {/* Navigation Arrows */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {photos.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => goToPhoto(index)}
                  className={cn(
                    "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all",
                    "border-2",
                    index === currentIndex
                      ? "border-electric-blue scale-110"
                      : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg"
                    }}
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-electric-blue/20" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/50">
            <ImageIcon className="h-16 w-16 mb-4" />
            <p>Aucune photo disponible</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
