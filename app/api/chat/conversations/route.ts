/**
 * Chat Conversations API
 * Handles fetching and managing chat conversations
 */

import { NextRequest, NextResponse } from 'next/server'
import type { ChatConversation, ChatUser, ChatMessage } from '@/types/chat'

// Mock database - In production, replace with real database
let conversations: ChatConversation[] = []

/**
 * GET /api/chat/conversations
 * Fetch all conversations for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Filter conversations for this user
    const userConversations = conversations.filter(conv =>
      conv.participants.some(p => p.id === userId)
    )

    // Sort by last message timestamp
    userConversations.sort((a, b) => {
      const aTime = new Date(a.lastMessage.timestamp).getTime()
      const bTime = new Date(b.lastMessage.timestamp).getTime()
      return bTime - aTime
    })

    return NextResponse.json({
      conversations: userConversations,
      count: userConversations.length,
    })
  } catch (error) {
    console.error('[API] Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/chat/conversations
 * Create a new conversation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { participants, initialMessage } = body

    if (!participants || participants.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 participants are required' },
        { status: 400 }
      )
    }

    // Check if conversation already exists
    const existingConv = conversations.find(conv =>
      conv.participants.length === participants.length &&
      conv.participants.every(p => participants.some((part: ChatUser) => part.id === p.id))
    )

    if (existingConv) {
      return NextResponse.json({
        conversation: existingConv,
        existed: true,
      })
    }

    // Create new conversation
    const newConversation: ChatConversation = {
      id: `conv-${Date.now()}`,
      participants,
      messages: initialMessage ? [initialMessage] : [],
      lastMessage: initialMessage || {
        id: 'placeholder',
        content: '',
        timestamp: new Date().toISOString(),
        senderId: participants[0].id,
        isFromCurrentUser: false,
      },
      unreadCount: 0,
    }

    conversations.push(newConversation)

    return NextResponse.json({
      conversation: newConversation,
      existed: false,
    }, { status: 201 })
  } catch (error) {
    console.error('[API] Error creating conversation:', error)
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/chat/conversations/:id
 * Delete a conversation
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('id')
    const userId = searchParams.get('userId')

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: 'Conversation ID and User ID are required' },
        { status: 400 }
      )
    }

    // Find conversation
    const convIndex = conversations.findIndex(c => c.id === conversationId)
    if (convIndex === -1) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Check if user is participant
    const isParticipant = conversations[convIndex].participants.some(p => p.id === userId)
    if (!isParticipant) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Remove conversation
    conversations.splice(convIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Conversation deleted',
    })
  } catch (error) {
    console.error('[API] Error deleting conversation:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    )
  }
}
