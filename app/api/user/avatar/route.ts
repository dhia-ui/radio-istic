/**
 * Avatar Upload API Route
 * Handles custom avatar uploads and preset avatar selection
 */

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')

    // Handle preset avatar selection (JSON)
    if (contentType?.includes('application/json')) {
      const { userId, presetAvatar } = await request.json()

      if (!userId || !presetAvatar) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      // TODO: Update user avatar in database
      // For now, we'll just return the preset avatar URL
      // In production, you would update the user's avatar in your database here

      return NextResponse.json({
        success: true,
        avatarUrl: presetAvatar,
        message: 'Avatar updated successfully',
      })
    }

    // Handle file upload (FormData)
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('avatar') as File
      const userId = formData.get('userId') as string

      if (!file || !userId) {
        return NextResponse.json(
          { error: 'Missing file or user ID' },
          { status: 400 }
        )
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed' },
          { status: 400 }
        )
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'File size exceeds 5MB limit' },
          { status: 400 }
        )
      }

      // Convert file to buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const filename = `${userId}-${timestamp}.${fileExtension}`
      const filepath = join(uploadsDir, filename)

      // Save file
      await writeFile(filepath, buffer)

      // Generate URL
      const avatarUrl = `/uploads/avatars/${filename}`

      // TODO: Update user avatar in database
      // For now, we'll just return the avatar URL
      // In production, you would:
      // 1. Save the file to cloud storage (AWS S3, Cloudinary, etc.)
      // 2. Update the user's avatar URL in your database
      // 3. Delete the old avatar file if it exists

      return NextResponse.json({
        success: true,
        avatarUrl,
        message: 'Avatar uploaded successfully',
      })
    }

    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[Avatar Upload API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get user's current avatar
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing user ID' },
        { status: 400 }
      )
    }

    // TODO: Fetch user's avatar from database
    // For now, return a placeholder
    // In production, you would fetch the user's avatar URL from your database

    return NextResponse.json({
      success: true,
      avatarUrl: '/placeholder.svg',
    })
  } catch (error) {
    console.error('[Avatar API] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
