import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import {
  createChat,
  getChats,
  getMessages,
  sendMessage,
  uploadAttachments,
  getAttachment,
  markAsRead,
  getUnreadCount,
  updateChatStatus,
} from "./chat.controller.js";

import chatUpload from "./chat.upload.js";

const router = express.Router();

// All Chat endpoints require authentication.
router.use(authenticate);

// Conversations
router.get("/", getChats);
router.post("/", createChat);

// Messages
router.get("/:chatId/messages", getMessages);
router.post("/:chatId/messages", sendMessage);

// Document uploads
router.post(
  "/:chatId/attachments",
  chatUpload.array("documents", 5),
  uploadAttachments,
);

// Secure attachment preview/download
router.get("/:chatId/attachments/:attachmentId", getAttachment);

// Read receipts
router.patch("/:chatId/read", markAsRead);
router.get("/:chatId/unread", getUnreadCount);

// Conversation status
router.patch("/:chatId/status", updateChatStatus);

export default router;
