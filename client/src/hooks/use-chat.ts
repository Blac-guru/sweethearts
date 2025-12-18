import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  startConversation,
} from "@/lib/chat-api";
import { Conversation, Message } from "@shared/schema";

export const chatKeys = {
  conversations: ["chats"] as const,
  messages: (conversationId: string) =>
    ["chats", conversationId, "messages"] as const,
};

export function useConversationsQuery(enabled = true) {
  return useQuery<Conversation[]>({
    queryKey: chatKeys.conversations,
    queryFn: fetchConversations,
    enabled,
  });
}

export function useMessagesQuery(conversationId?: string) {
  return useQuery<Message[]>({
    queryKey: chatKeys.messages(conversationId || ""),
    queryFn: () => fetchMessages(conversationId!),
    enabled: Boolean(conversationId),
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
