import { io, type Socket } from "socket.io-client";
import { getAuthToken } from "./client";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

let socket: Socket | null = null;

export function initSocketConnection() {
  if (socket) return socket;

  const token = getAuthToken();
  if (!token) return null;

  socket = io(API_BASE, {
    auth: {
      token,
    },
    // Prevent multiple connections
    autoConnect: true,
    reconnection: true,
  });

  socket.on("connect_error", (err) => {
    console.error("Erreur de connexion WebSocket:", err.message);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
