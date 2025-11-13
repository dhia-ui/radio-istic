"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useChatState } from "./use-chat-state";
import PlusIcon from "../icons/plus";
import ChatPreview from "./chat-preview";
import ChatConversation from "./chat-conversation";
import { useWebSocket } from "@/lib/websocket-context";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { ChatHeader } from "./chat-header";
import type { ChatMessage } from "@/types/chat";

const CONTENT_HEIGHT = 420; // Height of expandable content

export default function Chat() {
  const {
    chatState,
    conversations,
    newMessage,
    setNewMessage,
    setCurrentUserId,
    updateConversationMessages,
    addMessage,
    updateMessageStatus,
    activeConversation,
    handleSendMessage,
    openConversation,
    goBack,
    toggleExpanded,
  } = useChatState();

  const { sendMessage, join, leave, markAsRead, conversationHistories, messages: wsMessages } = useWebSocket();
  const { user } = useAuth();
  const { toast } = useToast();

  const isExpanded = chatState.state !== "collapsed";
  const processedMessageIds = useRef<Set<string>>(new Set());

  // Set current user ID
  useEffect(() => {
    if (user?.id) {
      setCurrentUserId(user.id);
    }
  }, [user?.id, setCurrentUserId]);

  // Load conversation history when it arrives from WebSocket (only once per conversation)
  const loadedHistories = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (activeConversation && conversationHistories[activeConversation.id]) {
      // Only load history once per conversation
      if (loadedHistories.current.has(activeConversation.id)) {
        return;
      }
      
      const history = conversationHistories[activeConversation.id];
      const chatMessages: ChatMessage[] = history.map((msg) => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.timestamp,
        senderId: msg.senderId,
        isFromCurrentUser: msg.senderId === user?.id,
        status: msg.status,
      }));
      
      updateConversationMessages(activeConversation.id, chatMessages);
      loadedHistories.current.add(activeConversation.id);
      
      // Mark these messages as processed to avoid duplicates
      history.forEach(msg => processedMessageIds.current.add(msg.id));
    }
  }, [conversationHistories, activeConversation?.id, user?.id, updateConversationMessages]);

  // Handle incoming WebSocket messages (only new ones)
  useEffect(() => {
    wsMessages.forEach((wsMsg) => {
      // Skip if we've already processed this message
      if (processedMessageIds.current.has(wsMsg.id)) {
        return;
      }
      
      const chatMsg: ChatMessage = {
        id: wsMsg.id,
        content: wsMsg.content,
        timestamp: wsMsg.timestamp,
        senderId: wsMsg.senderId,
        isFromCurrentUser: wsMsg.senderId === user?.id,
        status: wsMsg.status,
      };
      
      // Add message to the appropriate conversation
      addMessage(wsMsg.conversationId, chatMsg);
      
      // Mark as processed
      processedMessageIds.current.add(wsMsg.id);
    });
  }, [wsMessages, user?.id, addMessage]);

  // Join/Leave conversation rooms
  const prevConvId = useRef<string | null>(null);
  useEffect(() => {
    const currentId = chatState.state === "conversation" ? activeConversation?.id ?? null : null;
    if (prevConvId.current && prevConvId.current !== currentId) {
      leave(prevConvId.current);
    }
    if (currentId) {
      join(currentId);
      // Mark as read on open
      markAsRead(currentId);
    }
    prevConvId.current = currentId;
    return () => {
      if (prevConvId.current) {
        leave(prevConvId.current);
        prevConvId.current = null;
      }
    };
  }, [chatState.state, activeConversation?.id, join, leave, markAsRead]);

  return (
    <motion.div
      className="absolute bottom-0 inset-x-0 z-50"
      initial={{ y: CONTENT_HEIGHT }}
      animate={{ y: isExpanded ? 0 : CONTENT_HEIGHT }}
      transition={{ duration: 0.3, ease: "circInOut" }}
    >
      {/* Shared Morphing Header - Always at the top */}
      <ChatHeader
        variant="desktop"
        onClick={toggleExpanded}
        showBackButton={chatState.state === "conversation"}
        onBackClick={goBack}
        aria-label={isExpanded ? "Réduire le chat" : "Ouvrir le chat"}
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpanded();
          }
        }}
      />

      {/* Expandable Content - Below the header */}
      <div className="pt-1 overflow-y-auto" style={{ height: CONTENT_HEIGHT }}>
        <div className="bg-background text-foreground h-full">
          <AnimatePresence mode="wait">
            {chatState.state === "expanded" && (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full flex flex-col"
              >
                {/* Conversations List */}
                <div className="flex-1 flex flex-col overflow-y-auto">
                  {conversations.map((conversation) => (
                    <ChatPreview
                      key={conversation.id}
                      conversation={conversation}
                      onOpenConversation={openConversation}
                    />
                  ))}

                  {/* Footer */}
                  <div className="mt-auto flex justify-end p-4 sticky bottom-0 bg-gradient-to-t from-background via-background/80 to-black/0">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="pl-0 py-0 gap-4 overflow-clip"
                    >
                      <div className="bg-primary text-primary-foreground h-full aspect-square border-r-2 border-background flex items-center justify-center">
                        <PlusIcon className="size-4" />
                      </div>
                      New Chat
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {chatState.state === "conversation" && activeConversation && (
              <ChatConversation
                activeConversation={activeConversation}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={() => {
                  const result = handleSendMessage();
                  if (!result) return;
                  const { message, conversationId } = result;
                  
                  // Find the recipient in the conversation
                  const recipient = activeConversation.participants.find(
                    (p) => p.id !== user?.id
                  );
                  
                  if (!recipient) {
                    toast({
                      variant: "destructive",
                      title: "Erreur",
                      description: "Destinataire non trouvé.",
                    });
                    return;
                  }

                  try {
                    sendMessage(recipient.id, message.content, conversationId);
                    // Update message status to 'sent' after sending
                    setTimeout(() => {
                      updateMessageStatus(message.id, "sent");
                    }, 300);
                  } catch (e) {
                    toast({
                      variant: "destructive",
                      title: "Échec de l'envoi",
                      description: "Le message n'a pas pu être envoyé.",
                    });
                  }
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
