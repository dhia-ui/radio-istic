/**
 * Avatar Picker Component
 * Allows users to select from preset avatars or upload custom images
 */

'use client'

import React, { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Image as ImageIcon, Check, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useAvatarUpload } from '@/hooks/use-avatar-upload'
import { cn } from '@/lib/utils'
import { DEFAULT_AVATARS, AVATAR_CATEGORIES } from '@/lib/default-avatars'

interface AvatarPickerProps {
  currentAvatar: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onAvatarChange: (newAvatar: string) => void
}

export function AvatarPicker({ currentAvatar, open, onOpenChange, onAvatarChange }: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { uploading, progress, error, uploadAvatar, selectPresetAvatar, clearError } = useAvatarUpload()

  // Dropzone for file upload
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setUploadedFile(file)

      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      clearError()
    }
  }, [clearError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  // Filter avatars by category
  const filteredAvatars = selectedCategory === 'all' 
    ? DEFAULT_AVATARS 
    : DEFAULT_AVATARS.filter(avatar => avatar.category === selectedCategory)

  // Handle preset avatar selection
  const handlePresetSelect = async (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl)
  }

  // Handle custom upload
  const handleUpload = async () => {
    if (!uploadedFile) return

    const result = await uploadAvatar(uploadedFile)
    if (result) {
      onAvatarChange(result)
      onOpenChange(false)
      // Cleanup
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setUploadedFile(null)
      setPreviewUrl(null)
    }
  }

  // Save preset selection
  const handleSavePreset = async () => {
    await selectPresetAvatar(selectedAvatar)
    onAvatarChange(selectedAvatar)
    onOpenChange(false)
  }

  // Clear uploaded file
  const handleClearUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setUploadedFile(null)
    setPreviewUrl(null)
    clearError()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col glass">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Change Avatar</DialogTitle>
          <DialogDescription>
            Choose from our preset avatars or upload your own image
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="presets" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Choose Avatar
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Photo
            </TabsTrigger>
          </TabsList>

          {/* Preset Avatars Tab */}
          <TabsContent value="presets" className="flex-1 overflow-y-auto">
            {/* Category Filter */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {AVATAR_CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'transition-all',
                    selectedCategory === category.id && 'neon-glow-blue'
                  )}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-4 gap-4">
              {filteredAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => handlePresetSelect(avatar.url)}
                  className={cn(
                    'relative aspect-square rounded-xl overflow-hidden transition-all card-3d-lift cursor-pointer',
                    'border-2',
                    selectedAvatar === avatar.url
                      ? 'border-electric-blue neon-glow-blue scale-105'
                      : 'border-border hover:border-electric-blue/50'
                  )}
                >
                  <img
                    src={avatar.url}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image doesn't exist
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                  {selectedAvatar === avatar.url && (
                    <div className="absolute inset-0 bg-electric-blue/20 flex items-center justify-center">
                      <Check className="h-8 w-8 text-electric-blue neon-text-blue" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSavePreset}
                disabled={uploading || selectedAvatar === currentAvatar}
                className="bg-electric-blue hover:bg-electric-blue/90 neon-glow-blue"
              >
                Save Avatar
              </Button>
            </div>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="flex-1 flex flex-col overflow-y-auto">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all card-3d',
                isDragActive ? 'border-electric-blue bg-electric-blue/10 neon-glow-blue' : 'border-border hover:border-electric-blue/50',
                previewUrl && 'border-success'
              )}
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32 border-4 border-electric-blue neon-glow-blue avatar-ring-3d">
                    <AvatarImage src={previewUrl} alt="Preview" />
                    <AvatarFallback>Preview</AvatarFallback>
                  </Avatar>
                  <div className="flex gap-2">
                    <Button onClick={handleClearUpload} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Upload className="h-16 w-16 text-muted-foreground" />
                  <div>
                    <p className="text-lg font-semibold mb-1">
                      {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (JPG, PNG, WEBP • Max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Progress Bar */}
            {uploading && (
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center mt-2 text-muted-foreground">
                  Uploading... {progress}%
                </p>
              </div>
            )}

            {/* Upload Button */}
            <div className="mt-auto pt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!uploadedFile || uploading}
                className="bg-electric-blue hover:bg-electric-blue/90 neon-glow-blue"
              >
                {uploading ? 'Uploading...' : 'Upload Avatar'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
