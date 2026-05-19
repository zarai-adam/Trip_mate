import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-12345";

let io: Server;

export function setupSocket(httpServer: HttpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next();

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      (socket as any).userId = decoded.id;
      next();
    } catch (err) {
      next();
    }
  });

  const onlineUsers = new Set<string>();

  io.on("connection", (socket) => {
    const userId = (socket as any).userId;
    if (userId) {
      socket.join(`user-${userId}`);
      onlineUsers.add(userId);
      io.emit("online-users", Array.from(onlineUsers));
      console.log(`User ${userId} connected and joined room user-${userId}`);
    }

    // Join conversation rooms
    socket.on("join-conversation", (conversationId) => {
      socket.join(`conv-${conversationId}`);
      console.log(`User ${userId || socket.id} joined conversation: ${conversationId}`);
    });

    socket.on("leave-conversation", (conversationId) => {
      socket.leave(`conv-${conversationId}`);
    });

    // Typing indicators
    socket.on("typing:start", (data: { conversationId: string; userId: string; userName: string }) => {
      socket.to(`conv-${data.conversationId}`).emit("typing:start", data);
    });

    socket.on("typing:stop", (data: { conversationId: string; userId: string }) => {
      socket.to(`conv-${data.conversationId}`).emit("typing:stop", data);
    });

    socket.on("disconnect", () => {
      if (userId) {
        onlineUsers.delete(userId);
        io.emit("online-users", Array.from(onlineUsers));
      }
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}
