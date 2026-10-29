import mongoose from "mongoose";

import Chat from "./chat.model.js";
import Message from "./message.model.js";
import { emitToChat } from "./chat.socket.js";
import Application from "../applications/application.model.js";

class ChatService {
  static id(value) {
    if (!value) return null;

    if (typeof value === "object" && value._id) {
      return String(value._id);
    }

    return String(value);
  }

  createError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  }

  validateIds(...ids) {
    return ids.every((id) => mongoose.isValidObjectId(id));
  }

  emitEvent(chatId, event, data) {
    try {
      emitToChat(String(chatId), event, data);
    } catch (error) {
      console.error(`[Chat Service] Failed to emit ${event}:`, error.message);
    }
  }

  static firstValidText(...values) {
    for (const value of values) {
      if (typeof value !== "string") continue;

      const text = value.trim();

      if (!text) continue;
      if (mongoose.isValidObjectId(text)) continue;

      return text;
    }

    return null;
  }

  static getApplicationName(application) {
    if (!application || typeof application !== "object") {
      return null;
    }

    return ChatService.firstValidText(
      application.opportunitySnapshot?.title,
      application.opportunitySnapshot?.name,
      application.opportunitySnapshot?.programName,

      application.opportunity?.title,
      application.opportunity?.name,
      application.opportunity?.programName,

      application.program?.title,
      application.program?.name,
      application.program?.programName,

      application.migrationProgram?.title,
      application.migrationProgram?.name,
      application.migrationProgram?.programName,

      application.service?.title,
      application.service?.name,

      application.applicationName,
      application.programName,
      application.migrationProgramName,
      application.serviceName,
      application.opportunityName,
      application.courseName,
      application.destinationProgram,
      application.title,
      application.name,
    );
  }

  static getApplicationDestination(application) {
    if (!application || typeof application !== "object") {
      return null;
    }

    return ChatService.firstValidText(
      application.opportunitySnapshot?.countryName,
      application.opportunity?.countryName,
      application.destinationCountry,
      application.destination,
      application.country,
      application.preferredDestination,
    );
  }

  static populateChatApplication(query) {
    return query
      .populate("participants", "name email role")
      .populate("client", "name email")
      .populate({
        path: "relatedApplication",
        model: Application,
        select: [
          "applicationReference",
          "opportunitySnapshot",
          "destinationCountry",
          "type",
          "status",
          "submittedAt",
          "createdAt",
          "opportunity",
        ].join(" "),
      });
  }

  static formatChat(chat) {
    if (!chat) return chat;

    const application = chat.relatedApplication;

    const applicationName = ChatService.getApplicationName(application);

    const applicationDestination =
      ChatService.getApplicationDestination(application);

    if (!application || typeof application !== "object") {
      return {
        ...chat,
        relatedApplicationDisplayName: applicationName,
        relatedApplicationDestination: applicationDestination,
        relatedApplicationReference: null,
      };
    }

    return {
      ...chat,

      relatedApplication: {
        ...application,
        relatedApplicationDisplayName: applicationName,
        relatedApplicationDestination: applicationDestination,
        relatedApplicationReference: application.applicationReference || null,
      },

      relatedApplicationDisplayName: applicationName,
      relatedApplicationDestination: applicationDestination,
      relatedApplicationReference: application.applicationReference || null,
    };
  }

  async getAuthorizedChat(chatId, userId) {
    if (!this.validateIds(chatId, userId)) {
      throw this.createError("Invalid conversation or user ID.");
    }

    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      throw this.createError("Conversation not found.", 404);
    }

    return chat;
  }

  /**
   * Create a conversation initiated by either an administrator
   * or a client.
   *
   * Admin-initiated:
   *   createdBy = adminId
   *   initialMessageSenderId = adminId
   *
   * Client-initiated:
   *   createdBy = adminId
   *   initialMessageSenderId = clientId
   *
   * The controller is responsible for authenticating the requester
   * and deciding which IDs they are permitted to use.
   */
  async createChat({
    clientId,
    adminId,
    subject,
    relatedApplication,
    initialMessage,
    initialMessageSenderId,
  }) {
    if (!this.validateIds(clientId, adminId)) {
      throw this.createError(
        "Valid client and administrator IDs are required.",
      );
    }

    const clientObjectId = new mongoose.Types.ObjectId(String(clientId));

    const adminObjectId = new mongoose.Types.ObjectId(String(adminId));

    if (String(clientObjectId) === String(adminObjectId)) {
      throw this.createError(
        "The client and administrator must be different users.",
      );
    }

    const firstSenderId = initialMessageSenderId
      ? String(initialMessageSenderId)
      : String(adminObjectId);

    if (!this.validateIds(firstSenderId)) {
      throw this.createError("Invalid initial message sender.");
    }

    if (
      firstSenderId !== String(clientObjectId) &&
      firstSenderId !== String(adminObjectId)
    ) {
      throw this.createError(
        "The initial message sender must be a conversation participant.",
        403,
      );
    }

    let applicationId = null;

    if (relatedApplication) {
      if (!mongoose.isValidObjectId(relatedApplication)) {
        throw this.createError("Invalid application ID.");
      }

      // A linked application must belong to this conversation's client.
      const application = await Application.findOne({
        _id: relatedApplication,
        user: clientObjectId,
      }).select("_id");

      if (!application) {
        throw this.createError(
          "Application not found or does not belong to this client.",
          404,
        );
      }

      applicationId = application._id;
    }

    const cleanSubject =
      typeof subject === "string" && subject.trim()
        ? subject.trim().slice(0, 200)
        : "Client Communication";

    const cleanInitialMessage =
      typeof initialMessage === "string" ? initialMessage.trim() : "";

    if (cleanInitialMessage.length > 5000) {
      throw this.createError(
        "The first message cannot exceed 5000 characters.",
      );
    }

    if (!cleanInitialMessage) {
      throw this.createError(
        "Please enter a first message to start the conversation.",
      );
    }

    const chat = await Chat.create({
      client: clientObjectId,

      participants: [clientObjectId, adminObjectId],

      subject: cleanSubject,

      relatedApplication: applicationId,

      // Keep the required schema field populated with the administrator.
      createdBy: adminObjectId,

      status: "OPEN",
    });

    try {
      const message = await Message.create({
        chat: chat._id,
        sender: new mongoose.Types.ObjectId(firstSenderId),
        content: cleanInitialMessage,
        attachments: [],

        // The sender has already read their own message.
        readBy: [
          {
            user: new mongoose.Types.ObjectId(firstSenderId),
            readAt: new Date(),
          },
        ],
      });

      chat.lastMessage = message._id;
      chat.lastMessageAt = message.createdAt || new Date();

      await chat.save();
    } catch (error) {
      // Avoid leaving an empty conversation if its first message fails.
      await Chat.deleteOne({
        _id: chat._id,
      });

      throw error;
    }

    const populatedChat = await ChatService.populateChatApplication(
      Chat.findById(chat._id).populate("lastMessage"),
    ).lean();

    const formattedChat = ChatService.formatChat(populatedChat);

    this.emitEvent(chat._id, "chat:created", {
      chat: formattedChat,
    });

    const populatedMessage = await Message.findById(chat.lastMessage)
      .populate("sender", "name email role")
      .lean();

    this.emitEvent(chat._id, "chat:message", {
      chatId: String(chat._id),
      message: populatedMessage,
    });

    this.emitEvent(chat._id, "chat:updated", {
      chatId: String(chat._id),
      lastMessage: populatedMessage,
      lastMessageAt: chat.lastMessageAt,
    });

    return formattedChat;
  }

  async getUserChats(userId, { page = 1, limit = 20 } = {}) {
    if (!mongoose.isValidObjectId(userId)) {
      throw this.createError("Invalid user ID.");
    }

    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);

    const pageSize = Math.min(
      50,
      Math.max(1, Number.parseInt(limit, 10) || 20),
    );

    const filter = {
      participants: new mongoose.Types.ObjectId(userId),
    };

    const [chatDocuments, total] = await Promise.all([
      ChatService.populateChatApplication(
        Chat.find(filter).populate("lastMessage"),
      )
        .sort({
          lastMessageAt: -1,
          _id: -1,
        })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Chat.countDocuments(filter),
    ]);

    const chats = chatDocuments.map((chat) => ChatService.formatChat(chat));

    return {
      chats,

      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async getMessages(chatId, userId, { page = 1, limit = 30 } = {}) {
    await this.getAuthorizedChat(chatId, userId);

    const currentPage = Math.max(1, Number.parseInt(page, 10) || 1);

    const pageSize = Math.min(
      100,
      Math.max(1, Number.parseInt(limit, 10) || 30),
    );

    const filter = {
      chat: chatId,
      deletedAt: null,
    };

    const [messages, total] = await Promise.all([
      Message.find(filter)
        .populate("sender", "name email role")
        .sort({
          createdAt: -1,
          _id: -1,
        })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Message.countDocuments(filter),
    ]);

    return {
      messages: messages.reverse(),

      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async sendMessage({ chatId, senderId, content, attachments = [] }) {
    const chat = await this.getAuthorizedChat(chatId, senderId);

    if (chat.status !== "OPEN") {
      throw this.createError("This conversation is closed or archived.");
    }

    const cleanContent = typeof content === "string" ? content.trim() : "";

    if (!Array.isArray(attachments)) {
      throw this.createError("Attachments must be an array.");
    }

    if (!cleanContent && attachments.length === 0) {
      throw this.createError("Enter a message or attach a document.");
    }

    if (cleanContent.length > 10000) {
      throw this.createError("Message exceeds the 10,000-character limit.");
    }

    const message = await Message.create({
      chat: chat._id,
      sender: senderId,
      content: cleanContent,
      attachments,

      readBy: [
        {
          user: senderId,
          readAt: new Date(),
        },
      ],
    });

    chat.lastMessage = message._id;
    chat.lastMessageAt = message.createdAt;

    await chat.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email role")
      .lean();

    this.emitEvent(chat._id, "chat:message", {
      chatId: String(chat._id),
      message: populatedMessage,
    });

    this.emitEvent(chat._id, "chat:updated", {
      chatId: String(chat._id),
      lastMessage: populatedMessage,
      lastMessageAt: chat.lastMessageAt,
    });

    return populatedMessage;
  }

  async markMessagesAsRead(chatId, userId) {
    await this.getAuthorizedChat(chatId, userId);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const result = await Message.updateMany(
      {
        chat: chatId,

        sender: {
          $ne: userObjectId,
        },

        deletedAt: null,

        "readBy.user": {
          $ne: userObjectId,
        },
      },
      {
        $push: {
          readBy: {
            user: userObjectId,
            readAt: new Date(),
          },
        },
      },
    );

    const readAt = new Date();

    this.emitEvent(chatId, "chat:read", {
      chatId: String(chatId),
      userId: String(userId),
      readAt,
    });

    return {
      modifiedCount: result.modifiedCount,
    };
  }

  async getUnreadCount(chatId, userId) {
    await this.getAuthorizedChat(chatId, userId);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    return Message.countDocuments({
      chat: chatId,

      sender: {
        $ne: userObjectId,
      },

      deletedAt: null,

      "readBy.user": {
        $ne: userObjectId,
      },
    });
  }

  async updateChatStatus(chatId, status, userId) {
    const allowedStatuses = ["OPEN", "CLOSED", "ARCHIVED"];

    if (!allowedStatuses.includes(status)) {
      throw this.createError("Invalid conversation status.");
    }

    const chat = await this.getAuthorizedChat(chatId, userId);

    chat.status = status;

    await chat.save();

    const populatedChat = await ChatService.populateChatApplication(
      Chat.findById(chat._id),
    ).lean();

    const formattedChat = ChatService.formatChat(populatedChat);

    this.emitEvent(chat._id, "chat:status", {
      chatId: String(chat._id),
      status: chat.status,
      updatedBy: String(userId),
    });

    return formattedChat;
  }
}

const chatService = new ChatService();

export default chatService;
