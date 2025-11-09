/**
 * Custom Hook for Avatar Upload
 * Handles file upload, compression, and avatar updates
 */

'use client'

import { useState, useCallback } from 'react'
import { compressImage, validateImage, createThumbnail } from '@/lib/image-utils'
import { useAuth } from '@/lib/auth-context'

interface UseAvatarUploadReturn {
  uploading: boolean
  progress: number
  error: string | null
  uploadAvatar: (file: File) => Promise<string | null>
  selectPresetAvatar: (avatarUrl: string) => Promise<void>
  clearError: () => void
}

/**
 * Hook to manage avatar upload and selection
 * @returns Avatar upload utilities
 */
export const useAvatarUpload = (): UseAvatarUploadReturn => {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  /**
   * Upload a custom avatar image
   * @param file - Image file to upload
   * @returns URL of uploaded avatar or null on error
   */
  const uploadAvatar = useCallback(
    async (file: File): Promise<string | null> => {
      if (!user) {
        setError('User not authenticated')
        return null
      }

      setUploading(true)
      setProgress(0)
      setError(null)

      try {
        // Validate image
        const validation = validateImage(file, 5, ['image/jpeg', 'image/png', 'image/webp'])
        if (!validation.valid) {
          setError(validation.error || 'Invalid image')
          setUploading(false)
          return null
        }

        setProgress(20)

        // Compress image
        const compressedFile = await compressImage(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 512,
          useWebWorker: true,
        })

        setProgress(50)

        // Create FormData
        const formData = new FormData()
        formData.append('avatar', compressedFile)
        formData.append('userId', user.id)

        setProgress(60)

        // Upload to API
        const response = await fetch('/api/user/avatar', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        setProgress(90)

        const data = await response.json()
        const avatarUrl = data.avatarUrl

        setProgress(100)
        setUploading(false)

        return avatarUrl
      } catch (err) {
        console.error('[useAvatarUpload] Upload error:', err)
        setError(err instanceof Error ? err.message : 'Upload failed')
        setUploading(false)
        return null
      }
    },
    [user]
  )

  /**
   * Select a preset avatar
   * @param avatarUrl - URL of preset avatar
   */
  const selectPresetAvatar = useCallback(
    async (avatarUrl: string): Promise<void> => {
      if (!user) {
        setError('User not authenticated')
        return
      }

      setUploading(true)
      setError(null)

      try {
        const response = await fetch('/api/user/avatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            presetAvatar: avatarUrl,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update avatar')
        }

        setUploading(false)
      } catch (err) {
        console.error('[useAvatarUpload] Preset selection error:', err)
        setError(err instanceof Error ? err.message : 'Failed to update avatar')
        setUploading(false)
      }
    },
    [user]
  )

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    uploading,
    progress,
    error,
    uploadAvatar,
    selectPresetAvatar,
    clearError,
  }
}
