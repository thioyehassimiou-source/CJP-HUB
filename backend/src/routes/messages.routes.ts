import { Router } from "express";
import { ConversationType, MembershipStatus } from "@prisma/client";
import { ApiError } from "../lib/api-error";
import { toConversationPreview, toPublicMessage } from "../lib/messages-public";
import { PERMISSIONS } from "../lib/rbac";
import { prisma } from "../lib/prisma";
import { asyncHandler } from "../middleware/async-handler";
import { type AuthRequest, requireAuth, requireRole } from "../middleware/auth";
import { requireActiveMember } from "../middleware/membership";
import { emitNewMessageToConversation } from "../lib/socket";

export const messagesRouter = Router();

const participantInclude = {
  include: {
    user: {
      select: { id: true, firstName: true, lastName: true },
    },
  },
} as const;

const messageInclude = {
  sender: {
    select: { id: true, firstName: true, lastName: true },
  },
} as const;

const conversationListInclude = {
  participants: participantInclude,
  messages: {
    take: 1,
    orderBy: { createdAt: "desc" as const },
    include: messageInclude,
  },
} as const;

async function getAnnouncementConversation() {
  return prisma.conversation.findFirst({
    where: { type: ConversationType.ANNOUNCEMENT },
    orderBy: { createdAt: "asc" },
  });
}

async function assertConversationAccess(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  });

  if (!conversation) {
    throw new ApiError(404, "Conversation introuvable");
  }

  if (conversation.type === ConversationType.ANNOUNCEMENT) {
    return conversation;
  }

  const isParticipant = conversation.participants.some((item) => item.userId === userId);
  if (!isParticipant) {
    throw new ApiError(403, "Accès refusé à cette conversation");
  }

  return conversation;
}

messagesRouter.get(
  "/conversations",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const userId = req.user!.id;

    const [directConversations, announcement] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          type: ConversationType.DIRECT,
          participants: { some: { userId } },
        },
        include: conversationListInclude,
        orderBy: { updatedAt: "desc" },
      }),
      getAnnouncementConversation(),
    ]);

    const previews = directConversations.map((conversation) =>
      toConversationPreview(conversation, userId),
    );

    if (announcement) {
      const announcementWithMessages = await prisma.conversation.findUnique({
        where: { id: announcement.id },
        include: conversationListInclude,
      });

      if (announcementWithMessages) {
        previews.unshift(toConversationPreview(announcementWithMessages, userId));
      }
    }

    res.json({ conversations: previews });
  }),
);

messagesRouter.get(
  "/conversations/:conversationId/messages",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const conversationIdParam = req.params.conversationId;
    if (!conversationIdParam || Array.isArray(conversationIdParam)) {
      throw new ApiError(400, "Identifiant de conversation invalide");
    }

    await assertConversationAccess(conversationIdParam, req.user!.id);

    const messages = await prisma.message.findMany({
      where: { conversationId: conversationIdParam },
      include: messageInclude,
      orderBy: { createdAt: "asc" },
    });

    res.json({
      messages: messages.map((message) => toPublicMessage(message, req.user!.id)),
    });
  }),
);

messagesRouter.post(
  "/conversations/direct",
  requireAuth,
  requireActiveMember,
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as { userId?: string };
    const targetUserId = body.userId?.trim();

    if (!targetUserId) {
      throw new ApiError(400, "Destinataire requis");
    }

    if (targetUserId === req.user!.id) {
      throw new ApiError(400, "Impossible de démarrer une conversation avec vous-même");
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { membership: true },
    });

    if (!targetUser || targetUser.membership?.status !== MembershipStatus.ACTIVE) {
      throw new ApiError(404, "Membre introuvable ou inactif");
    }

    const existing = await prisma.conversation.findFirst({
      where: {
        type: ConversationType.DIRECT,
        AND: [
          { participants: { some: { userId: req.user!.id } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
      include: conversationListInclude,
    });

    if (existing) {
      res.json({ conversation: toConversationPreview(existing, req.user!.id) });
      return;
    }

    const conversation = await prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        participants: {
          create: [{ userId: req.user!.id }, { userId: targetUserId }],
        },
      },
      include: conversationListInclude,
    });

    res.status(201).json({ conversation: toConversationPreview(conversation, req.user!.id) });
  }),
);

messagesRouter.post(
  "/conversations/:conversationId/messages",
  requireAuth,
  asyncHandler(async (req: AuthRequest, res) => {
    const conversationIdParam = req.params.conversationId;
    if (!conversationIdParam || Array.isArray(conversationIdParam)) {
      throw new ApiError(400, "Identifiant de conversation invalide");
    }

    const body = req.body as { content?: string };
    const content = body.content?.trim();

    if (!content) {
      throw new ApiError(400, "Le message ne peut pas être vide");
    }

    const conversation = await assertConversationAccess(conversationIdParam, req.user!.id);

    if (conversation.type === ConversationType.ANNOUNCEMENT) {
      if (!PERMISSIONS.manageMembers.includes(req.user!.role)) {
        throw new ApiError(403, "Seul le bureau peut publier une annonce");
      }
    } else {
      const membership = await prisma.membership.findUnique({
        where: { userId: req.user!.id },
      });

      if (membership?.status !== MembershipStatus.ACTIVE) {
        throw new ApiError(403, "Adhésion active requise pour envoyer un message");
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: req.user!.id,
        content,
      },
      include: messageInclude,
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    const publicMessage = toPublicMessage(message, req.user!.id);
    
    // Émettre l'événement Socket.IO
    emitNewMessageToConversation(conversation.id, publicMessage);

    res.status(201).json({ message: publicMessage });
  }),
);

messagesRouter.post(
  "/announcements",
  requireAuth,
  requireRole(...PERMISSIONS.manageMembers),
  asyncHandler(async (req: AuthRequest, res) => {
    const body = req.body as { content?: string };
    const content = body.content?.trim();

    if (!content) {
      throw new ApiError(400, "Le message ne peut pas être vide");
    }

    let conversation = await getAnnouncementConversation();

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          type: ConversationType.ANNOUNCEMENT,
          title: "Annonces CJP",
        },
      });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: req.user!.id,
        content,
      },
      include: messageInclude,
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    const publicMessage = toPublicMessage(message, req.user!.id);
    
    // Émettre l'événement Socket.IO
    emitNewMessageToConversation(conversation.id, publicMessage);

    res.status(201).json({ message: publicMessage });
  }),
);
