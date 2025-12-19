import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  startConversation,
  getUnreadCount,
  markMessagesAsRead,
} from "@/lib/chat-api";
import { Conversation, Message } from "@shared/schema";
import { getTestUserId } from "@/lib/chat-api";

export const chatKeys = {
  conversations: ["chats"] as const,
  messages: (conversationId: string) =>
    ["chats", conversationId, "messages"] as const,
  unreadCount: ["chats", "unreadCount"] as const,
  conversationUnreadCount: (conversationId: string) =>
    ["chats", conversationId, "unreadCount"] as const,
};

export function useConversationsQuery(enabled = true) {
  return useQuery<Conversation[]>({
    queryKey: chatKeys.conversations,
    queryFn: fetchConversations,
    enabled,
    refetchInterval: 3000, // Poll for new conversations every 3 seconds
    refetchIntervalInBackground: true,
  });
}

export function useMessagesQuery(conversationId?: string) {
  return useQuery<Message[]>({
    queryKey: chatKeys.messages(conversationId || ""),
    queryFn: () => fetchMessages(conversationId!),
    enabled: Boolean(conversationId),
    refetchInterval: 2000, // Poll for new messages every 2 seconds
    refetchIntervalInBackground: true, // Keep polling even if tab is hidden
  });
}

export function useStartConversationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recipientId: string) => startConversation(recipientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations });
    },
  });
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => sendMessage(conversationId, content),
    onSuccess: (message) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(message.conversationId),
      });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations });
    },
  });
}

/**
 * Hook to calculate unread message count
 * A message is unread if:
 * - It was not sent by the current user
 * - It hasn't been marked as read
 */
export function useUnreadMessageCount() {
  const { data: conversations } = useConversationsQuery();
  const currentUserId = getTestUserId();

  return useMemo(() => {
    if (!conversations) return 0;

    let count = 0;
    conversations.forEach((conv) => {
      // Check if current user is a participant
      if (conv.participantIds?.includes(currentUserId)) {
        // Last message is from someone else and not read
        if (
          conv.lastMessage &&
          conv.lastMessage.senderId !== currentUserId &&
          !conv.lastMessage.readAt
        ) {
          count++;
        }
      }
    });

    return count;
  }, [conversations, currentUserId]);
}

/**
 * Hook to get unread message count for a specific conversation
 */
export function useConversationUnreadCount(conversationId?: string) {
  return useQuery<number>({
    queryKey: chatKeys.conversationUnreadCount(conversationId || ""),
    queryFn: () => getUnreadCount(conversationId!),
    enabled: Boolean(conversationId),
    refetchInterval: 2000, // Poll every 2 seconds
    refetchIntervalInBackground: true,
  });
}

/**
 * Hook to mark messages as read
 */
export function useMarkMessagesAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => markMessagesAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      // Invalidate the unread count query to trigger a refresh
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversationUnreadCount(conversationId),
      });
      // Also invalidate the conversations query since unread status changes
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations });
    },
  });
}
