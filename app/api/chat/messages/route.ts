/**
 * Chat Messages API
 * Handles CRUD operations for chat messages
 */

import { NextRequest, NextResponse } from 'next/server'
import type { ChatMessage } from '@/types/chat'

// Mock database - In production, replace with real database
let messages: Record<string, ChatMessage[]> = {}

/**
 * GET /api/chat/messages
 * Fetch messages for a conversation with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') // Timestamp for pagination

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Conversation ID is required' },
        { status: 400 }
      )
    }

    // Get messages for conversation
    let conversationMessages = messages[conversationId] || []

    // Filter by timestamp if pagination requested
    if (before) {
      const beforeTime = new Date(before).getTime()
      conversationMessages = conversationMessages.filter(msg =>
        new Date(msg.timestamp).getTime() < beforeTime
      )
    }

    // Sort by timestamp (oldest first)
    conversationMessages.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    // Apply limit
    const paginatedMessages = conversationMessages.slice(-limit)

    return NextResponse.json({
      messages: paginatedMessages,
      hasMore: conversationMessages.length > paginatedMessages.length,
      count: paginatedMessages.length,
    })
  } catch (error) {
    console.error('[API] Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/chat/messages
 * Create a new message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, content, senderId, replyTo } = body

    if (!conversationId || !content || !senderId) {
      return NextResponse.json(
        { error: 'Conversation ID, content, and sender ID are required' },
        { status: 400 }
      )
    }

    // Create new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      timestamp: new Date().toISOString(),
      senderId,
      isFromCurrentUser: true,
      status: 'sent',
      reactions: [],
      edited: false,
      replyTo,
    }

    // Add to conversation
    if (!messages[conversationId]) {
      messages[conversationId] = []
    }
    messages[conversationId].push(newMessage)

    return NextResponse.json({
      message: newMessage,
    }, { status: 201 })
  } catch (error) {
    console.error('[API] Error creating message:', error)
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/chat/messages
 * Update an existing message (edit content)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, messageId, newContent, userId } = body

    if (!conversationId || !messageId || !newContent || !userId) {
      return NextResponse.json(
        { error: 'Conversation ID, message ID, new content, and user ID are required' },
        { status: 400 }
      )
    }

    // Find message
    const conversationMessages = messages[conversationId]
    if (!conversationMessages) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const messageIndex = conversationMessages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    const message = conversationMessages[messageIndex]

    // Check if user is the sender
    if (message.senderId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only edit your own messages' },
        { status: 403 }
      )
    }

    // Update message
    conversationMessages[messageIndex] = {
      ...message,
      content: newContent,
      edited: true,
    }

    return NextResponse.json({
      message: conversationMessages[messageIndex],
    })
  } catch (error) {
    console.error('[API] Error updating message:', error)
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/chat/messages
 * Delete a message
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const messageId = searchParams.get('messageId')
    const userId = searchParams.get('userId')

    if (!conversationId || !messageId || !userId) {
      return NextResponse.json(
        { error: 'Conversation ID, message ID, and user ID are required' },
        { status: 400 }
      )
    }

    // Find message
    const conversationMessages = messages[conversationId]
    if (!conversationMessages) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const messageIndex = conversationMessages.findIndex(m => m.id === messageId)
    if (messageIndex === -1) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      )
    }

    const message = conversationMessages[messageIndex]

    // Check if user is the sender
    if (message.senderId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only delete your own messages' },
        { status: 403 }
      )
    }

    // Remove message
    conversationMessages.splice(messageIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Message deleted',
    })
  } catch (error) {
    console.error('[API] Error deleting message:', error)
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    )
  }
}
