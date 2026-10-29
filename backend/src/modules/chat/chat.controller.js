import fs from "fs/promises";
import path from "path";

import chatService from "./chat.service.js";
import Chat from "./chat.model.js";
import Message from "./message.model.js";
import User from "../users/user.model.js";
import { uploadDirectory } from "./chat.upload.js";

import {
  validateObjectId,
  validateMessage,
  validateSubject,
  validatePagination,
  validateChatStatus,
} from "./chat.validation.js";

const getUserId = (req) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    const error = new Error("Authentication required.");
    error.statusCode = 401;
    throw error;
  }

  return String(userId);
};

const getUserRole = (req) => String(req.user?.role || "").toUpperCase();

const isAdmin = (req) => ["ADMIN", "SUPER_ADMIN"].includes(getUserRole(req));

const isClient = (req) => getUserRole(req) === "CLIENT";

const handleError = (res, error) => {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error("[Chat Module]", {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
    });
  }

  return res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500 ? "An unexpected error occurred." : error.message,
  });
};

/**
 * Assign an active administrator to a client-initiated conversation.
 * Selects the active administrator with the fewest open conversations.
 */
const findAvailableAdmin = async () => {
  const administrators = await User.find({
    role: "ADMIN",
    isActive: true,
  })
    .select("_id")
    .lean();

  if (administrators.length === 0) {
    const error = new Error(
      "No active administrator is currently available. Please try again later.",
    );

    error.statusCode = 503;
    throw error;
  }

  const adminIds = administrators.map((admin) => admin._id);

  const workload = await Chat.aggregate([
    {
      $match: {
        participants: { $in: adminIds },
        status: "OPEN",
      },
    },
    {
      $unwind: "$participants",
    },
    {
      $match: {
        participants: { $in: adminIds },
      },
    },
    {
      $group: {
        _id: "$participants",
        openConversations: { $sum: 1 },
      },
    },
  ]);

  const workloadMap = new Map(
    workload.map((item) => [String(item._id), item.openConversations]),
  );

  administrators.sort((a, b) => {
    const workloadA = workloadMap.get(String(a._id)) || 0;
    const workloadB = workloadMap.get(String(b._id)) || 0;

    return workloadA - workloadB;
  });

  return String(administrators[0]._id);
};

/**
 * POST /api/v1/chat
 *
 * Admin request:
 *   { clientId, subject, content, relatedApplication? }
 *
 * Client request:
 *   { subject, content, relatedApplication? }
 */
export const createChat = async (req, res) => {
  try {
    const requesterId = getUserId(req);

    const {
      clientId: requestedClientId,
      subject,
      content,
      relatedApplication,
    } = req.body || {};

    let clientId;
    let adminId;
    let initialMessageSenderId;

    if (isAdmin(req)) {
      if (!requestedClientId) {
        return res.status(400).json({
          success: false,
          message: "A client must be selected to create a conversation.",
        });
      }

      validateObjectId(requestedClientId, "client ID");

      const client = await User.findOne({
        _id: requestedClientId,
        role: "CLIENT",
        isActive: true,
      })
        .select("_id")
        .lean();

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "The selected client could not be found or is inactive.",
        });
      }

      clientId = String(client._id);
      adminId = requesterId;
      initialMessageSenderId = requesterId;
    } else if (isClient(req)) {
      // Never trust a clientId supplied by the client request.
      clientId = requesterId;

      // Automatically assign an active administrator.
      adminId = await findAvailableAdmin();

      initialMessageSenderId = requesterId;
    } else {
      return res.status(403).json({
        success: false,
        message:
          "Your account does not have permission to create conversations.",
      });
    }

    if (relatedApplication) {
      validateObjectId(relatedApplication, "application ID");
    }

    const validatedSubject = validateSubject(subject);
    const validatedContent = validateMessage(content);

    if (!validatedContent) {
      return res.status(400).json({
        success: false,
        message: "Enter an initial message to start the conversation.",
      });
    }

    const chat = await chatService.createChat({
      clientId,
      adminId,
      subject: validatedSubject,
      relatedApplication: relatedApplication || null,
      initialMessage: validatedContent,
      initialMessageSenderId,
    });

    return res.status(201).json({
      success: true,
      message: "Conversation created successfully.",
      data: chat,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * GET /api/v1/chat
 * List conversations for the authenticated user.
 */
export const getChats = async (req, res) => {
  try {
    const userId = getUserId(req);
    const pagination = validatePagination(req.query);

    const result = await chatService.getUserChats(userId, pagination);

    return res.status(200).json({
      success: true,
      data: result.chats,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * GET /api/v1/chat/:chatId/messages
 * Retrieve conversation history.
 */
export const getMessages = async (req, res) => {
  try {
    const userId = getUserId(req);

    validateObjectId(req.params.chatId, "conversation ID");

    const pagination = validatePagination(req.query);

    const result = await chatService.getMessages(
      req.params.chatId,
      userId,
      pagination,
    );

    return res.status(200).json({
      success: true,
      data: result.messages,
      pagination: result.pagination,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * POST /api/v1/chat/:chatId/messages
 * Send a text message.
 */
export const sendMessage = async (req, res) => {
  try {
    const senderId = getUserId(req);

    validateObjectId(req.params.chatId, "conversation ID");

    const content = validateMessage(req.body?.content);

    if (!content) {
      return res.status(400).json({
        success: false,
        message:
          "A message is required. Use the attachment endpoint to send documents.",
      });
    }

    const message = await chatService.sendMessage({
      chatId: req.params.chatId,
      senderId,
      content,
      attachments: [],
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * POST /api/v1/chat/:chatId/attachments
 *
 * Expected multipart/form-data:
 * - documents: one or more files
 * - content: optional text
 */
export const uploadAttachments = async (req, res) => {
  const uploadedFiles = req.files || [];
  let messageSaved = false;

  try {
    const senderId = getUserId(req);
    const { chatId } = req.params;

    validateObjectId(chatId, "conversation ID");

    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Select at least one document to upload.",
      });
    }

    const chat = await chatService.getAuthorizedChat(chatId, senderId);

    if (chat.status !== "OPEN") {
      const error = new Error(
        "Documents cannot be sent to a conversation that is not open.",
      );

      error.statusCode = 400;
      throw error;
    }

    // Text is optional when uploading attachments.
    const content =
      typeof req.body?.content === "string"
        ? validateMessage(req.body.content)
        : "";

    const attachments = uploadedFiles.map((file) => ({
      originalName: path.basename(file.originalname),
      storedName: file.filename,
      storageKey: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      uploadedBy: senderId,
    }));

    console.info("[Chat Attachments] Saving uploaded files", {
      chatId,
      senderId,
      fileCount: attachments.length,
      hasText: Boolean(content),
      files: uploadedFiles.map((file) => ({
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
      })),
    });

    const message = await chatService.sendMessage({
      chatId,
      senderId,
      content,
      attachments,
    });

    messageSaved = true;

    return res.status(201).json({
      success: true,
      message: "Documents sent successfully.",
      data: message,
    });
  } catch (error) {
    console.error("[Chat Attachments] Upload/message creation failed", {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
      chatId: req.params?.chatId,
      uploadedFileCount: uploadedFiles.length,
    });

    // Remove uploaded files if creating the message failed.
    if (!messageSaved) {
      await Promise.all(
        uploadedFiles.map(async (file) => {
          if (!file.path) return;

          try {
            await fs.unlink(file.path);
          } catch (cleanupError) {
            if (cleanupError.code !== "ENOENT") {
              console.error(
                "[Chat Attachments] Failed to clean up uploaded file",
                cleanupError,
              );
            }
          }
        }),
      );
    }

    return handleError(res, error);
  }
};

/**
 * GET /api/v1/chat/:chatId/attachments/:attachmentId
 *
 * Deliver an attachment after verifying conversation membership.
 * PDFs and supported images can be previewed inline.
 */
export const getAttachment = async (req, res) => {
  try {
    const userId = getUserId(req);

    const { chatId, attachmentId } = req.params;

    validateObjectId(chatId, "conversation ID");
    validateObjectId(attachmentId, "attachment ID");

    await chatService.getAuthorizedChat(chatId, userId);

    const message = await Message.findOne({
      chat: chatId,
      deletedAt: null,
      "attachments._id": attachmentId,
    }).select("attachments");

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found.",
      });
    }

    const attachment = message.attachments.id(attachmentId);

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found.",
      });
    }

    const storageKey = attachment.storageKey;

    if (
      typeof storageKey !== "string" ||
      storageKey !== path.basename(storageKey) ||
      storageKey.includes("..")
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid attachment storage reference.",
      });
    }

    const resolvedDirectory = path.resolve(uploadDirectory);

    const filePath = path.resolve(resolvedDirectory, storageKey);

    if (!filePath.startsWith(`${resolvedDirectory}${path.sep}`)) {
      return res.status(400).json({
        success: false,
        message: "Invalid attachment path.",
      });
    }

    try {
      await fs.access(filePath);
    } catch {
      return res.status(404).json({
        success: false,
        message: "The attachment file could not be found.",
      });
    }

    const supportedInlineTypes = new Set([
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);

    const wantsInline = req.query.inline === "true";

    const canPreviewInline = supportedInlineTypes.has(attachment.mimeType);

    const disposition =
      wantsInline && canPreviewInline ? "inline" : "attachment";

    const safeFilename = path
      .basename(attachment.originalName)
      .replace(/[\r\n"]/g, "_");

    res.setHeader("X-Content-Type-Options", "nosniff");

    res.setHeader("Cache-Control", "private, no-store");

    res.setHeader("Content-Type", attachment.mimeType);

    res.setHeader(
      "Content-Disposition",
      `${disposition}; filename="${safeFilename}"`,
    );

    return res.sendFile(filePath, (error) => {
      if (error && !res.headersSent) {
        console.error("[Chat Module] Attachment delivery failed:", error);

        res.status(500).json({
          success: false,
          message: "Unable to deliver the attachment.",
        });
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * PATCH /api/v1/chat/:chatId/read
 * Mark incoming messages as read.
 */
export const markAsRead = async (req, res) => {
  try {
    const userId = getUserId(req);

    validateObjectId(req.params.chatId, "conversation ID");

    const result = await chatService.markMessagesAsRead(
      req.params.chatId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read.",
      data: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * GET /api/v1/chat/:chatId/unread
 * Return unread-message count.
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = getUserId(req);

    validateObjectId(req.params.chatId, "conversation ID");

    const unreadCount = await chatService.getUnreadCount(
      req.params.chatId,
      userId,
    );

    return res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/**
 * PATCH /api/v1/chat/:chatId/status
 * Only administrators can change conversation status.
 */
export const updateChatStatus = async (req, res) => {
  try {
    const adminId = getUserId(req);

    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Only administrators can change conversation status.",
      });
    }

    validateObjectId(req.params.chatId, "conversation ID");

    const status = validateChatStatus(req.body?.status);

    const chat = await chatService.updateChatStatus(
      req.params.chatId,
      status,
      adminId,
    );

    return res.status(200).json({
      success: true,
      message: "Conversation status updated successfully.",
      data: chat,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
