import { create } from "zustand";
import type { ChatState, ChatMessage, ChatConversation } from "@/types/chat";

type ChatComponentState = {
  state: ChatState;
  activeConversation?: string;
};

interface ChatStore {
  // State
  chatState: ChatComponentState;
  conversations: ChatConversation[];
  newMessage: string;
  replyingToId?: string;
  currentUserId?: string;

  // Actions
  setChatState: (state: ChatComponentState) => void;
  setConversations: (conversations: ChatConversation[]) => void;
  setCurrentUserId: (userId: string) => void;
  updateConversationMessages: (conversationId: string, messages: ChatMessage[]) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  updateMessageStatus: (messageId: string, status: "sending" | "sent" | "delivered" | "read") => void;
  setNewMessage: (message: string) => void;
  setReplyingTo: (messageId?: string) => void;
  handleSendMessage: () => { message: ChatMessage; conversationId: string } | null;
  openConversation: (conversationId: string) => void;
  goBack: () => void;
  toggleExpanded: () => void;
}

const chatStore = create<ChatStore>((set, get) => ({
  // Initial state
  chatState: {
    state: "collapsed",
  },
  conversations: [],
  newMessage: "",
  replyingToId: undefined,
  currentUserId: undefined,

  // Actions
  setChatState: (chatState) => set({ chatState }),

  setConversations: (conversations) => set({ conversations }),

  setCurrentUserId: (userId) => set({ currentUserId: userId }),

  updateConversationMessages: (conversationId, messages) => {
    const { conversations } = get();
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId
        ? {
            ...conv,
            messages,
            lastMessage: messages.length > 0 ? messages[messages.length - 1] : conv.lastMessage,
          }
        : conv
    );
    set({ conversations: updatedConversations });
  },

  addMessage: (conversationId, message) => {
    const { conversations } = get();
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: message,
          }
        : conv
    );
    set({ conversations: updatedConversations });
  },

  updateMessageStatus: (messageId, status) => {
    const { conversations } = get();
    const updatedConversations = conversations.map((conv) => ({
      ...conv,
      messages: conv.messages.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg
      ),
    }));
    set({ conversations: updatedConversations });
  },

  setNewMessage: (newMessage) => set({ newMessage }),

  setReplyingTo: (messageId) => set({ replyingToId: messageId }),

  handleSendMessage: () => {
    const { newMessage, conversations, chatState, replyingToId, currentUserId } = get();
    const activeConv = conversations.find(
      (conv) => conv.id === chatState.activeConversation
    );

    if (!newMessage.trim() || !activeConv || !currentUserId) return null;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      senderId: currentUserId,
      isFromCurrentUser: true,
      status: "sending",
      replyTo: replyingToId,
    };

    const updatedConversations = conversations.map((conv) =>
      conv.id === activeConv.id
        ? {
            ...conv,
            messages: [...conv.messages, message],
            lastMessage: message,
          }
        : conv
    );

    set({
      conversations: updatedConversations,
      newMessage: "",
      replyingToId: undefined,
    });

    return { message, conversationId: activeConv.id };
  },

  openConversation: (conversationId) => {
    const { conversations } = get();

    // Update chat state
    set({
      chatState: { state: "conversation", activeConversation: conversationId },
    });

    // Mark conversation as read
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );

    set({ conversations: updatedConversations });
  },

  goBack: () => {
    const { chatState } = get();
    if (chatState.state === "conversation") {
      set({ chatState: { state: "expanded" } });
    } else {
      set({ chatState: { state: "collapsed" } });
    }
  },

  toggleExpanded: () => {
    const { chatState } = get();
    set({
      chatState: {
        state: chatState.state === "collapsed" ? "expanded" : "collapsed",
      },
    });
  },
}));

// Hook with computed values using selectors
export const useChatState = () => {
  const chatState = chatStore((state) => state.chatState);
  const conversations = chatStore((state) => state.conversations);
  const newMessage = chatStore((state) => state.newMessage);
  const setChatState = chatStore((state) => state.setChatState);
  const setConversations = chatStore((state) => state.setConversations);
  const setCurrentUserId = chatStore((state) => state.setCurrentUserId);
  const updateConversationMessages = chatStore((state) => state.updateConversationMessages);
  const addMessage = chatStore((state) => state.addMessage);
  const updateMessageStatus = chatStore((state) => state.updateMessageStatus);
  const setNewMessage = chatStore((state) => state.setNewMessage);
  const replyingToId = chatStore((state) => state.replyingToId);
  const setReplyingTo = chatStore((state) => state.setReplyingTo);
  const handleSendMessage = chatStore((state) => state.handleSendMessage);
  const openConversation = chatStore((state) => state.openConversation);
  const goBack = chatStore((state) => state.goBack);
  const toggleExpanded = chatStore((state) => state.toggleExpanded);

  // Computed values
  const totalUnreadCount = conversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );

  const activeConversation = conversations.find(
    (conv) => conv.id === chatState.activeConversation
  );

  return {
    chatState,
    conversations,
    newMessage,
    replyingToId,
    totalUnreadCount,
    activeConversation,
    setChatState,
    setConversations,
    setCurrentUserId,
    updateConversationMessages,
    addMessage,
    updateMessageStatus,
    setNewMessage,
    setReplyingTo,
    handleSendMessage,
    openConversation,
    goBack,
    toggleExpanded,
  };
};
