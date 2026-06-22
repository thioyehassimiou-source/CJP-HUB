import type http from "node:http";
import { Server, type Socket } from "socket.io";
import { env } from "../config/env";
import { verifyToken } from "./jwt";
import { prisma } from "./prisma";

let io: Server;

interface ServerToClientEvents {
  newMessage: (message: any) => void;
  conversationUpdated: (conversationId: string) => void;
}

interface ClientToServerEvents {}

interface InterServerEvents {}

interface SocketData {
  userId: string;
}

export function initSocket(server: http.Server) {
  io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server, {
    cors: {
      origin: env.corsOrigin,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const payload = verifyToken(token);
      socket.data.userId = payload.sub;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.data.userId;
    // L'utilisateur rejoint sa propre room pour des notifications privées
    socket.join(`user_${userId}`);

    // L'utilisateur rejoint les rooms de toutes ses conversations
    try {
      const conversations = await prisma.conversationParticipant.findMany({
        where: { userId },
        select: { conversationId: true },
      });
      for (const conv of conversations) {
        socket.join(`conversation_${conv.conversationId}`);
      }
      
      // Rejoindre la conversation d'annonce
      const announcement = await prisma.conversation.findFirst({
        where: { type: "ANNOUNCEMENT" },
        select: { id: true },
      });
      if (announcement) {
        socket.join(`conversation_${announcement.id}`);
      }
    } catch (error) {
      console.error("Socket error joining conversations:", error);
    }

    socket.on("disconnect", () => {
      // Nettoyage automatique par socket.io
    });
  });

  return io;
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io is not initialized");
  }
  return io;
}

export function emitNewMessageToConversation(conversationId: string, message: any) {
  if (io) {
    io.to(`conversation_${conversationId}`).emit("newMessage", message);
    io.to(`conversation_${conversationId}`).emit("conversationUpdated", conversationId);
  }
}
