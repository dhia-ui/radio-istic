"use client"

import { useState, useEffect, useRef } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { MessageCircle, Search, Users, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import type { Member } from "@/types/member"
import { useChatState } from "@/components/chat/use-chat-state"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import ChatConversation from "@/components/chat/chat-conversation"
import { useToast } from "@/hooks/use-toast"
import { useWebSocket } from "@/lib/websocket-context"

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const ws = useWebSocket()
  const { conversations, openConversation, activeConversation, newMessage, setNewMessage, handleSendMessage, setConversations, setCurrentUserId } =
    useChatState()

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.members.getAll({})
        // Backend returns { success: true, members: [...] }
        const membersArray = response.members || []
        const transformedMembers: Member[] = membersArray.map((u: any) => ({
          id: u._id,
          name: `${u.firstName} ${u.lastName}`,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone || "",
          field: u.field,
          year: u.year,
          motivation: u.motivation || "",
          projects: typeof u.projects === 'string' ? u.projects : (u.projects?.join(", ") || ""),
          skills: typeof u.skills === 'string' ? u.skills : (u.skills?.join(", ") || ""),
          status: u.status || "offline",
          avatar: u.avatar || u.photo || `/avatars/${u.firstName.toLowerCase()}-${u.lastName.toLowerCase()}.png`,
          points: u.points || 0,
          role: u.role,
          isBureau: u.isBureau,
          isOnline: u.status === "online",
        }))
        setMembers(transformedMembers)
      } catch (error) {
        console.error("Failed to fetch members:", error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les membres",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [toast])

  // Set current user ID in chat state
  useEffect(() => {
    if (user?.id) {
      setCurrentUserId(user.id)
    }
  }, [user?.id, setCurrentUserId])

  // Sync WebSocket messages with conversations
  useEffect(() => {
    if (ws.messages.length === 0) return

    // Get the latest message
    const latestMessage = ws.messages[ws.messages.length - 1]
    
    // Find the conversation for this message
    const convIndex = conversations.findIndex(c => c.id === latestMessage.conversationId)
    
    if (convIndex !== -1) {
      // Update existing conversation
      const updatedConversations = [...conversations]
      const conv = updatedConversations[convIndex]
      
      // Check if message already exists
      const messageExists = conv.messages.some(m => m.id === latestMessage.id)
      
      if (!messageExists) {
        conv.messages.push({
          id: latestMessage.id,
          content: latestMessage.content,
          timestamp: latestMessage.timestamp,
          senderId: latestMessage.senderId,
          isFromCurrentUser: latestMessage.senderId === user?.id,
          status: latestMessage.status
        })
        conv.lastMessage = {
          id: latestMessage.id,
          content: latestMessage.content,
          timestamp: latestMessage.timestamp,
          senderId: latestMessage.senderId,
          isFromCurrentUser: latestMessage.senderId === user?.id,
          status: latestMessage.status
        }
        
        setConversations(updatedConversations)
      }
    }
  }, [ws.messages, conversations, user?.id, setConversations])

  // Filter members for search
  const filteredMembers = members.filter(
    (member) =>
      member.id !== user?.id &&
      (member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Get conversation for selected member
  const selectedConversation = selectedMemberId
    ? conversations.find((conv) => conv.participants.some((p) => p.id === selectedMemberId))
    : null

  const handleStartChat = async (memberId: string) => {
    if (!user) return
    
    setSelectedMemberId(memberId)
    const existingConv = conversations.find((conv) => 
      conv.participants.length === 2 && 
      conv.participants.some((p) => p.id === memberId) &&
      conv.participants.some((p) => p.id === user.id)
    )
    
    if (existingConv) {
      openConversation(existingConv.id)
      ws.join(existingConv.id)
    } else {
      // Create new conversation
      try {
        const response = await api.chat.createConversation([user.id, memberId], false)
        const newConv = response.conversation
        
        // Transform to chat conversation format
        const member = members.find(m => m.id === memberId)
        const chatConv = {
          id: newConv._id,
          participants: [
            {
              id: user.id,
              name: user.name || `${user.firstName} ${user.lastName}`,
              username: user.username ?? user.email ?? `${user.firstName ?? ""}${user.lastName ?? ""}`,
              avatar: user.avatar || '/avatars/default-avatar.jpg',
              isOnline: true
            },
            {
              id: memberId,
              name: member?.name || `${member?.firstName} ${member?.lastName}`,
              username: member?.email ?? `${member?.firstName ?? ""}${member?.lastName ?? ""}`,
              avatar: member?.avatar || '/avatars/default-avatar.jpg',
              isOnline: member?.isOnline || false
            }
          ],
          messages: [],
          lastMessage: undefined,
          unreadCount: 0,
          isPinned: false,
          isMuted: false
        }
        
        // Add to conversations
        const updatedConversations = [...conversations, chatConv]
        setConversations(updatedConversations)
        openConversation(chatConv.id)
        ws.join(chatConv.id)
      } catch (error) {
        console.error("Failed to create conversation:", error)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de démarrer la conversation"
        })
      }
    }
  }

  return (
    <ProtectedRoute>
      <DashboardPageLayout
        header={{
          title: "Messages",
          description: "Discutez avec les membres",
          icon: MessageCircle,
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-electric-blue" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un membre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Existing Conversations */}
              {conversations.length > 0 && (
                <div className="border-b border-border">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">Conversations</div>
                  {conversations.map((conv) => {
                    const otherParticipant = conv.participants.find((p) => p.id !== user?.id)
                    if (!otherParticipant) return null

                    return (
                      <button
                        key={conv.id}
                        onClick={() => {
                          setSelectedMemberId(otherParticipant.id)
                          openConversation(conv.id)
                        }}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors ${
                          selectedMemberId === otherParticipant.id ? "bg-accent" : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={otherParticipant.avatar || "/placeholder.svg"}
                              alt={otherParticipant.name}
                            />
                            <AvatarFallback className="bg-electric-blue/20 text-electric-blue">
                              {otherParticipant.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {otherParticipant.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card bg-neon-lime" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold truncate">{otherParticipant.name}</p>
                            {conv.unreadCount > 0 && (
                              <Badge className="bg-electric-blue text-xs">{conv.unreadCount}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.lastMessage?.content || "Nouvelle conversation"}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* All Members */}
              <>
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                  {searchQuery ? "Résultats de recherche" : "Tous les membres"}
                </div>
                {filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleStartChat(member.id)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-accent transition-colors ${
                        selectedMemberId === member.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={member.avatar || "/placeholder.svg"}
                            alt={`${member.firstName} ${member.lastName}`}
                          />
                          <AvatarFallback className="bg-electric-blue/20 text-electric-blue">
                            {member.firstName[0]}
                            {member.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card bg-neon-lime" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-semibold truncate">
                          {member.firstName} {member.lastName}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {member.field}
                          </Badge>
                          {member.isOnline && <span className="text-xs text-neon-lime font-medium">En ligne</span>}
                        </div>
                      </div>
                    </button>
                  ))}
              </>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            {selectedMemberId && activeConversation ? (
              <ChatConversation
                activeConversation={activeConversation}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={() => {
                  if (!user || !newMessage.trim() || !activeConversation) return
                  
                  // Get recipient ID (the other participant)
                  const recipientId = activeConversation.participants.find(p => p.id !== user.id)?.id
                  if (!recipientId) return
                  
                  // Send via WebSocket
                  ws.sendMessage(recipientId, newMessage.trim(), activeConversation.id)
                  
                  // Add message to local state immediately for UI feedback
                  const localMessage = {
                    id: `temp-${Date.now()}`,
                    content: newMessage.trim(),
                    timestamp: new Date().toISOString(),
                    senderId: user.id,
                    isFromCurrentUser: true,
                    status: 'sending' as const
                  }
                  
                  const updatedConversations = conversations.map(conv => 
                    conv.id === activeConversation.id 
                      ? { ...conv, messages: [...conv.messages, localMessage], lastMessage: localMessage }
                      : conv
                  )
                  setConversations(updatedConversations)
                  setNewMessage('')
                }}
              />
            ) : selectedMemberId && !selectedConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-display font-bold mb-2">Nouvelle conversation</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Commencez une conversation avec {members.find((m) => m.id === selectedMemberId)?.firstName}
                </p>
                <Button className="bg-electric-blue hover:bg-electric-blue/90">Envoyer un message</Button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-display font-bold mb-2">Sélectionnez une conversation</h3>
                <p className="text-muted-foreground text-center">
                  Choisissez un membre dans la liste pour commencer à discuter
                </p>
              </div>
            )}
          </div>
        </div>
        )}
      </DashboardPageLayout>
    </ProtectedRoute>
  )
}
