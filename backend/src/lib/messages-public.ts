import type { Conversation, ConversationType, Message, User } from "@prisma/client";

type ParticipantUser = Pick<User, "id" | "firstName" | "lastName">;

export function userInitials(user: Pick<User, "firstName" | "lastName">) {
  return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
}

export function toPublicMessage(
  message: Message & { sender: ParticipantUser },
  currentUserId: string,
) {
  return {
    id: message.id,
    conversationId: message.conversationId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    sent: message.senderId === currentUserId,
    sender: {
      id: message.sender.id,
      firstName: message.sender.firstName,
      lastName: message.sender.lastName,
      initials: userInitials(message.sender),
    },
  };
}

export function toConversationPreview(
  conversation: Conversation & {
    messages: Array<Message & { sender: ParticipantUser }>;
    participants: Array<{ user: ParticipantUser }>;
  },
  currentUserId: string,
) {
  const lastMessage = conversation.messages[0] ?? null;
  const otherParticipant =
    conversation.type === "DIRECT"
      ? conversation.participants.find((item) => item.user.id !== currentUserId)?.user ?? null
      : null;

  return {
    id: conversation.id,
    type: conversation.type as ConversationType,
    title:
      conversation.type === "ANNOUNCEMENT"
        ? (conversation.title ?? "Annonces CJP")
        : otherParticipant
          ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
          : "Conversation",
    subtitle:
      conversation.type === "ANNOUNCEMENT" ? "Canal officiel du bureau" : "Message direct",
    otherParticipant: otherParticipant
      ? {
          id: otherParticipant.id,
          firstName: otherParticipant.firstName,
          lastName: otherParticipant.lastName,
          initials: userInitials(otherParticipant),
        }
      : null,
    lastMessage: lastMessage
      ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt.toISOString(),
          senderId: lastMessage.senderId,
        }
      : null,
  };
}
