"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ChatConversation as ChatConversationType } from "@/types/chat";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { formatDate, formatTime } from "./utils";
import ArrowRightIcon from "../icons/arrow-right";
import { useWebSocket } from "@/lib/websocket-context";
import { Badge } from "../ui/badge";
import ClockIcon from "../icons/clock";
import CheckIcon from "../icons/check";
import DoubleCheckIcon from "../icons/double-check";
import { useChatState } from "./use-chat-state";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";

const MESSAGE_GROUP_THRESHOLD = 3 * 60 * 1000; // 3 minutes in milliseconds

interface ChatConversationProps {
  activeConversation: ChatConversationType;
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
}

interface MessageGroup {
  messages: ChatMessageType[];
  timestamp: string;
  isFromCurrentUser: boolean;
}

export default function ChatConversation({
  activeConversation,
  newMessage,
  setNewMessage,
  onSendMessage,
}: ChatConversationProps) {
  const [isSending, setIsSending] = useState(false);
  const { typing, typingUsers } = useWebSocket();
  const listRef = useRef<HTMLDivElement | null>(null);
  const { setConversations, conversations, setReplyingTo, replyingToId } = useChatState();
  const ws = useWebSocket();
  const editMessage: (conversationId: string, messageId: string, newContent: string) => void =
    (ws as any).editMessage ? (ws as any).editMessage.bind(ws) : (_conversationId: string, _messageId: string, _newContent: string) => {};
  const deleteMessage: (conversationId: string, messageId: string) => void =
    (ws as any).deleteMessage ? (ws as any).deleteMessage.bind(ws) : () => {};
  const addReaction = (conversationId: string, messageId: string, emoji: string): void => {
    // call underlying implementation if available on the runtime object
    if ((ws as any).addReaction) {
      (ws as any).addReaction(conversationId, messageId, emoji);
    }
    // otherwise no-op (keeps TypeScript happy and prevents runtime crashes)
  };
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Group messages by time and sender
  const groupMessages = (messages: ChatMessageType[]): MessageGroup[] => {
    const groups: MessageGroup[] = [];
    messages.forEach((message) => {
      const lastGroup = groups[groups.length - 1];
      const messageTime = new Date(message.timestamp).getTime();
      if (
        lastGroup &&
        lastGroup.isFromCurrentUser === message.isFromCurrentUser &&
        messageTime - new Date(lastGroup.timestamp).getTime() <= MESSAGE_GROUP_THRESHOLD
      ) {
        lastGroup.messages.push(message);
      } else {
        groups.push({ messages: [message], timestamp: message.timestamp, isFromCurrentUser: message.isFromCurrentUser });
      }
    });
    return groups;
  };

  const messageGroups = groupMessages(activeConversation.messages);

  return (
    <motion.div
      key="conversation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full flex flex-col overflow-clip"
    >
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto overflow-x-clip p-4 space-y-4"
        onScroll={async (e) => {
          const el = e.currentTarget;
          if (el.scrollTop <= 0 && !loadingOlder && hasMore) {
            setLoadingOlder(true);
            const first = activeConversation.messages[0];
            const before = first?.timestamp;
            try {
              const url = `/api/chat/messages?conversationId=${encodeURIComponent(
                activeConversation.id
              )}${before ? `&before=${encodeURIComponent(before)}` : ""}&limit=20`;
              const res = await fetch(url);
              if (res.ok) {
                const data = await res.json();
                const older: ChatMessageType[] = data.messages || [];
                // Preserve scroll position after prepend
                const prevHeight = el.scrollHeight;
                const updated = conversations.map((c) =>
                  c.id === activeConversation.id
                    ? { ...c, messages: [...older, ...c.messages] }
                    : c
                );
                setConversations(updated);
                requestAnimationFrame(() => {
                  const newHeight = el.scrollHeight;
                  el.scrollTop = newHeight - prevHeight;
                });
                setHasMore(Boolean(data.hasMore));
              } else {
                setHasMore(false);
              }
            } catch (err) {
              setHasMore(false);
            } finally {
              setLoadingOlder(false);
            }
          }
        }}
      >
        <div className="text-center">
          <Badge variant="secondary" className="font-medium text-xs text-foreground/40">
            {formatDate(activeConversation.messages[0]?.timestamp || "")}
          </Badge>
        </div>
        {loadingOlder && (
          <div className="text-center text-xs text-foreground/50">Chargement de l'historique…</div>
        )}
        <AnimatePresence initial={false}>
          {messageGroups.map((group, groupIndex) => (
            <motion.div
              key={`group-${groupIndex}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn("flex flex-col gap-1", group.isFromCurrentUser ? "items-end" : "items-start")}
            >
              <div className="w-full flex justify-center mb-1">
                <span className="text-xs text-foreground/40">{formatTime(group.timestamp)}</span>
              </div>
              {group.messages.map((message, messageIndex) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, scale: 0.8, x: group.isFromCurrentUser ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: "backOut", delay: messageIndex * 0.05 }}
                  className={cn(
                    "max-w-[70%] rounded-lg px-3 py-2 text-sm font-medium",
                    group.isFromCurrentUser ? "bg-primary text-primary-foreground" : "bg-accent text-foreground",
                    messageIndex === 0 && group.isFromCurrentUser
                      ? "rounded-br-sm"
                      : messageIndex === 0 && !group.isFromCurrentUser
                      ? "rounded-bl-sm"
                      : "",
                    messageIndex === group.messages.length - 1 && group.isFromCurrentUser
                      ? "rounded-tr-sm"
                      : messageIndex === group.messages.length - 1 && !group.isFromCurrentUser
                      ? "rounded-tl-sm"
                      : ""
                  )}
                  layout
                >
                  <div className="flex justify-between gap-2">
                    <span>{message.content}</span>
                    {message.isFromCurrentUser && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-[10px] opacity-40 hover:opacity-80 transition" aria-label="Options">•••</button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => setReplyingTo(message.id)}>Répondre</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addReaction(activeConversation.id, message.id, "👍")}>👍 Réaction</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addReaction(activeConversation.id, message.id, "🔥")}>🔥 Réaction</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => addReaction(activeConversation.id, message.id, "❤️")}>❤️ Réaction</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => editMessage(activeConversation.id, message.id, prompt("Modifier le message", message.content) || message.content)}>Modifier</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => deleteMessage(activeConversation.id, message.id)}>Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                  {message.replyTo && (
                    <div className="mt-1 pl-2 border-l text-[10px] opacity-70 italic">
                      Réponse à: {activeConversation.messages.find(m => m.id === message.replyTo)?.content || "message"}
                    </div>
                  )}
                  {message.edited && (
                    <span className="ml-2 text-[10px] opacity-70 italic">(modifié)</span>
                  )}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {message.reactions.map((r, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full bg-background/30 backdrop-blur border border-border"
                        >
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                  {message.isFromCurrentUser && (
                    <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-70">
                      {message.status === "sending" && (
                        <ClockIcon className="w-3 h-3" />
                      )}
                      {message.status === "sent" && (
                        <CheckIcon className="w-3 h-3" />
                      )}
                      {message.status === "delivered" && (
                        <DoubleCheckIcon className="w-3 h-3" />
                      )}
                      {message.status === "read" && (
                        <DoubleCheckIcon className="w-3 h-3 text-primary" />
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="border-t-2 border-muted sticky bottom-0 bg-secondary h-12 p-1">
        {replyingToId && (
          <div className="px-2 py-1 text-[10px] flex items-center gap-2 bg-background/50 backdrop-blur rounded">
            <span>Répondre à un message</span>
            <button
              onClick={() => setReplyingTo(undefined)}
              className="text-xs opacity-60 hover:opacity-100"
            >
              Annuler
            </button>
          </div>
        )}
        {Object.values(typingUsers).some(Boolean) && (
          <div className="px-2 py-1 text-xs text-foreground/60">Quelqu'un est en train d'écrire…</div>
        )}
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Message ${activeConversation.participants.find((p) => p.id !== "joyboy")?.name || ""}`}
          className="flex-1 rounded-none border-none text-foreground placeholder-foreground/40 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isSending && newMessage.trim()) {
              setIsSending(true);
              onSendMessage();
              setTimeout(() => setIsSending(false), 250);
            }
          }}
          onFocus={() => typing(activeConversation.id, true, activeConversation.participants.find((p) => p.id !== "joyboy")?.id || "")}
          onBlur={() => typing(activeConversation.id, false, activeConversation.participants.find((p) => p.id !== "joyboy")?.id || "")}
          onInput={() => typing(activeConversation.id, true, activeConversation.participants.find((p) => p.id !== "joyboy")?.id || "")}
        />
        <Button
          variant={newMessage.trim() ? "default" : "outline"}
          onClick={() => {
            if (!isSending && newMessage.trim()) {
              setIsSending(true);
              onSendMessage();
              setTimeout(() => setIsSending(false), 250);
            }
          }}
          disabled={!newMessage.trim() || isSending}
          className="absolute right-1.5 top-1.5 h-8 w-12 p-0"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
