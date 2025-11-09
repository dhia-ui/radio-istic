import type { ChatData, ChatConversation, ChatUser } from "@/types/chat"
import { membersData } from "@/lib/members-data"

const convertMemberToChatUser = (member: (typeof membersData)[0]): ChatUser => ({
  id: member.id,
  name: `${member.firstName} ${member.lastName}`,
  username: `@${member.firstName.toLowerCase()}`,
  avatar: member.avatar || "/placeholder.svg",
  isOnline: member.isOnline,
})

const currentUser: ChatUser = convertMemberToChatUser(membersData[0])

const conversations: ChatConversation[] = [
  {
    id: "conv-1",
    participants: [currentUser, convertMemberToChatUser(membersData[1])],
    unreadCount: 1,
    lastMessage: {
      id: "msg-1",
      content: "Salut! Comment ça va?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      senderId: membersData[1].id,
      isFromCurrentUser: false,
    },
    messages: [
      {
        id: "msg-1",
        content: "Salut! Comment ça va?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        senderId: membersData[1].id,
        isFromCurrentUser: false,
      },
    ],
  },
  {
    id: "conv-2",
    participants: [currentUser, convertMemberToChatUser(membersData[3])],
    unreadCount: 0,
    lastMessage: {
      id: "msg-2",
      content: "On se voit demain pour le podcast?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      senderId: membersData[3].id,
      isFromCurrentUser: false,
    },
    messages: [
      {
        id: "msg-2-1",
        content: "On se voit demain pour le podcast?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        senderId: membersData[3].id,
        isFromCurrentUser: false,
      },
      {
        id: "msg-2-2",
        content: "Oui bien sûr! À quelle heure?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
        senderId: currentUser.id,
        isFromCurrentUser: true,
      },
      {
        id: "msg-2",
        content: "14h ça te va?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        senderId: membersData[3].id,
        isFromCurrentUser: false,
      },
    ],
  },
  {
    id: "conv-3",
    participants: [currentUser, convertMemberToChatUser(membersData[5])],
    unreadCount: 0,
    lastMessage: {
      id: "msg-3",
      content: "Super idée pour le tournoi!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      senderId: currentUser.id,
      isFromCurrentUser: true,
    },
    messages: [
      {
        id: "msg-3",
        content: "Super idée pour le tournoi!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        senderId: currentUser.id,
        isFromCurrentUser: true,
      },
    ],
  },
]

export const mockChatData: ChatData = {
  currentUser,
  conversations,
}
