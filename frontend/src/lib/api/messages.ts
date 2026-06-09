import { apiGet, apiPost } from "@/lib/api/client";
import type { ApiChatMessage, ApiConversationPreview } from "@/lib/api/types";

export function fetchConversations() {
  return apiGet<{ conversations: ApiConversationPreview[] }>("/messages/conversations", true);
}

export function fetchConversationMessages(conversationId: string) {
  return apiGet<{ messages: ApiChatMessage[] }>(
    `/messages/conversations/${conversationId}/messages`,
    true,
  );
}

export function sendConversationMessage(conversationId: string, content: string) {
  return apiPost<{ message: ApiChatMessage }>(
    `/messages/conversations/${conversationId}/messages`,
    { content },
    true,
  );
}

export function startDirectConversation(userId: string) {
  return apiPost<{ conversation: ApiConversationPreview }>(
    "/messages/conversations/direct",
    { userId },
    true,
  );
}

export function publishAnnouncement(content: string) {
  return apiPost<{ message: ApiChatMessage }>("/messages/announcements", { content }, true);
}
