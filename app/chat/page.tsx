"use client"

import { useState } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { MessageCircle, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { membersData } from "@/lib/members-data"
import { useChatState } from "@/components/chat/use-chat-state"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/lib/auth-context"
import ChatConversation from "@/components/chat/chat-conversation"

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const { user } = useAuth()
  const { conversations, openConversation, activeConversation, newMessage, setNewMessage, handleSendMessage } =
    useChatState()

  // Filter members for search
  const filteredMembers = membersData.filter(
    (member) =>
      member.id !== user?.id &&
      (member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Get conversation for selected member
  const selectedConversation = selectedMemberId
    ? conversations.find((conv) => conv.participants.some((p) => p.id === selectedMemberId))
    : null

  const handleStartChat = (memberId: string) => {
    setSelectedMemberId(memberId)
    const existingConv = conversations.find((conv) => conv.participants.some((p) => p.id === memberId))
    if (existingConv) {
      openConversation(existingConv.id)
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
                          <p className="text-sm text-muted-foreground truncate">{conv.lastMessage.content}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* All Members */}
              {searchQuery && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Tous les membres
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
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            {selectedMemberId && activeConversation ? (
              <ChatConversation
                activeConversation={activeConversation}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            ) : selectedMemberId && !selectedConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-display font-bold mb-2">Nouvelle conversation</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Commencez une conversation avec {membersData.find((m) => m.id === selectedMemberId)?.firstName}
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
      </DashboardPageLayout>
    </ProtectedRoute>
  )
}
