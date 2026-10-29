import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import config from "../../config/environment.js";
import Chat from "./chat.model.js";

let io;

const getTokenFromSocket = (socket) => {
  const authToken = socket.handshake.auth?.token;

  if (authToken) {
    return authToken.startsWith("Bearer ") ? authToken.slice(7) : authToken;
  }

  const authorization = socket.handshake.headers?.authorization;

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7);
  }

  return null;
};

const getUserFromToken = (token) => {
  if (!token) {
    const error = new Error("Authentication required.");
    error.data = { code: "AUTH_REQUIRED" };
    throw error;
  }

  // Adjust this if your project uses a different JWT secret property
  // or a different token payload structure.
  const secret =
    config.jwtSecret || config.JWT_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT secret is not configured.");
  }

  const decoded = jwt.verify(token, secret);

  const userId = decoded.id || decoded._id || decoded.userId;

  if (!userId) {
    const error = new Error("Invalid authentication token.");
    error.data = { code: "INVALID_TOKEN" };
    throw error;
  }

  return {
    id: String(userId),
    role: decoded.role || "",
  };
};

export const initializeChatSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:4173",
        "https://www.colossusmigration.com",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Authenticate every socket connection.
  io.use((socket, next) => {
    try {
      const token = getTokenFromSocket(socket);
      socket.user = getUserFromToken(token);
      next();
    } catch {
      const error = new Error("Socket authentication failed.");
      error.data = { code: "AUTH_FAILED" };
      next(error);
    }
  });

  io.on("connection", (socket) => {
    console.log(`[Chat Socket] Connected: ${socket.user.id}`);

    // Join a conversation only if the authenticated user participates in it.
    socket.on("chat:join", async (payload = {}, callback) => {
      try {
        const chatId = String(payload.chatId || "");

        if (!/^[a-f\d]{24}$/i.test(chatId)) {
          throw new Error("A valid conversation ID is required.");
        }

        const chat = await Chat.findOne({
          _id: chatId,
          participants: socket.user.id,
        }).select("_id status");

        if (!chat) {
          throw new Error("Conversation not found or access denied.");
        }

        const room = `chat:${chat._id}`;

        await socket.join(room);

        const response = {
          success: true,
          chatId: String(chat._id),
        };

        if (typeof callback === "function") {
          callback(response);
        }

        socket.emit("chat:joined", response);
      } catch (error) {
        if (typeof callback === "function") {
          callback({
            success: false,
            message: error.message,
          });
        } else {
          socket.emit("chat:error", {
            message: error.message,
          });
        }
      }
    });

    socket.on("chat:leave", async (payload = {}, callback) => {
      const chatId = String(payload.chatId || "");

      if (/^[a-f\d]{24}$/i.test(chatId)) {
        await socket.leave(`chat:${chatId}`);
      }

      if (typeof callback === "function") {
        callback({ success: true });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Chat Socket] Disconnected: ${socket.user.id} (${reason})`);
    });
  });

  return io;
};

// Retrieve the initialized Socket.IO server elsewhere in the application.
export const getChatIO = () => {
  if (!io) {
    throw new Error(
      "Chat Socket.IO has not been initialized. Initialize it with the HTTP server first.",
    );
  }

  return io;
};

// Send an event to everyone currently connected to a conversation.
export const emitToChat = (chatId, event, data) => {
  if (!io) return;

  io.to(`chat:${chatId}`).emit(event, data);
};

export default initializeChatSocket;
