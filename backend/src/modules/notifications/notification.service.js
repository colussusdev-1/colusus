import mongoose from "mongoose";
import Notification from "./notification.model.js";

import {
  NOTIFICATION_AUDIENCES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_ENTITY_TYPES,
  NOTIFICATION_ACTIONS,
  isValidNotificationType,
} from "./notification.types.js";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/* -------------------------------------------------------------------------- */
/* NORMALIZATION                                                              */
/* -------------------------------------------------------------------------- */

const normalizeString = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim().toUpperCase();

  return normalized || null;
};

/**
 * Normalize MongoDB ObjectIds.
 */
const normalizeId = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const candidate = typeof value === "object" && value._id ? value._id : value;

  if (!mongoose.Types.ObjectId.isValid(candidate)) {
    const error = new Error(`${fieldName} must be a valid ObjectId.`);
    error.statusCode = 400;
    throw error;
  }

  return new mongoose.Types.ObjectId(candidate);
};

/**
 * Normalize notification metadata.
 */
const normalizeMetadata = (metadata) => {
  if (metadata === undefined || metadata === null) {
    return {};
  }

  if (
    typeof metadata !== "object" ||
    Array.isArray(metadata) ||
    metadata instanceof Date
  ) {
    const error = new Error("Notification metadata must be a plain object.");

    error.statusCode = 400;
    throw error;
  }

  const prototype = Object.getPrototypeOf(metadata);

  if (prototype !== Object.prototype && prototype !== null) {
    const error = new Error("Notification metadata must be a plain object.");

    error.statusCode = 400;
    throw error;
  }

  return metadata;
};

/**
 * Create a consistent not-found error.
 */
const createNotFoundError = () => {
  const error = new Error("Notification not found.");
  error.statusCode = 404;

  return error;
};

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

const validateAudience = (audience) => {
  const normalized = normalizeString(audience);

  if (!NOTIFICATION_AUDIENCES.includes(normalized)) {
    const error = new Error(`Invalid notification audience "${audience}".`);

    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

const validateCategory = (category) => {
  const normalized = normalizeString(category);

  if (!NOTIFICATION_CATEGORIES.includes(normalized)) {
    const error = new Error(`Invalid notification category "${category}".`);

    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

const validatePriority = (priority) => {
  const normalized = normalizeString(priority || "NORMAL");

  if (!NOTIFICATION_PRIORITIES.includes(normalized)) {
    const error = new Error(`Invalid notification priority "${priority}".`);

    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

const validateEntityType = (entityType) => {
  const normalized = normalizeString(entityType || "NONE");

  if (!NOTIFICATION_ENTITY_TYPES.includes(normalized)) {
    const error = new Error(
      `Invalid notification entity type "${entityType}".`,
    );

    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

const validateAction = (action) => {
  const normalized = normalizeString(action || "NONE");

  if (!NOTIFICATION_ACTIONS.includes(normalized)) {
    const error = new Error(`Invalid notification action "${action}".`);

    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

const validateType = (category, type) => {
  const normalized = normalizeString(type);

  if (!normalized) {
    const error = new Error("Notification type is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!isValidNotificationType(category, normalized)) {
    const error = new Error(
      `Notification type "${normalized}" is not valid for category "${category}".`,
    );

    error.statusCode = 400;
    throw error;
  }

  return normalized;
};

/* -------------------------------------------------------------------------- */
/* BUILD NOTIFICATION                                                         */
/* -------------------------------------------------------------------------- */

const buildNotification = ({
  user,
  audience,
  actor = null,

  category,
  type,
  title,
  message,

  priority = "NORMAL",

  application = null,

  entityType = "NONE",
  entityId = null,

  action = "NONE",
  actionUrl = null,

  metadata = {},

  expiresAt = null,
}) => {
  const recipientId = normalizeId(user, "user");

  if (!recipientId) {
    const error = new Error("Notification recipient is required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedAudience = validateAudience(audience);
  const normalizedCategory = validateCategory(category);
  const normalizedType = validateType(normalizedCategory, type);
  const normalizedPriority = validatePriority(priority);
  const normalizedEntityType = validateEntityType(entityType);
  const normalizedAction = validateAction(action);

  if (!title || !String(title).trim()) {
    const error = new Error("Notification title is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!message || !String(message).trim()) {
    const error = new Error("Notification message is required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedTitle = String(title).trim();
  const normalizedMessage = String(message).trim();

  if (normalizedTitle.length > 180) {
    const error = new Error("Notification title cannot exceed 180 characters.");

    error.statusCode = 400;
    throw error;
  }

  if (normalizedMessage.length > 2000) {
    const error = new Error(
      "Notification message cannot exceed 2000 characters.",
    );

    error.statusCode = 400;
    throw error;
  }

  const actorId = normalizeId(actor, "actor");
  const applicationId = normalizeId(application, "application");
  const normalizedEntityId = normalizeId(entityId, "entityId");

  let normalizedActionUrl = null;

  if (actionUrl !== undefined && actionUrl !== null) {
    normalizedActionUrl = String(actionUrl).trim() || null;

    if (normalizedActionUrl && normalizedActionUrl.length > 500) {
      const error = new Error(
        "Notification actionUrl cannot exceed 500 characters.",
      );

      error.statusCode = 400;
      throw error;
    }
  }

  let normalizedExpiresAt = null;

  if (expiresAt !== undefined && expiresAt !== null) {
    normalizedExpiresAt = new Date(expiresAt);

    if (Number.isNaN(normalizedExpiresAt.getTime())) {
      const error = new Error("expiresAt must be a valid date.");
      error.statusCode = 400;
      throw error;
    }
  }

  return {
    user: recipientId,
    audience: normalizedAudience,

    actor: actorId,

    category: normalizedCategory,
    type: normalizedType,

    title: normalizedTitle,
    message: normalizedMessage,

    priority: normalizedPriority,

    application: applicationId,

    entityType: normalizedEntityType,
    entityId: normalizedEntityId,

    action: normalizedAction,
    actionUrl: normalizedActionUrl,

    metadata: normalizeMetadata(metadata),

    expiresAt: normalizedExpiresAt,
  };
};

/* -------------------------------------------------------------------------- */
/* CREATE ONE                                                                 */
/* -------------------------------------------------------------------------- */

const createNotification = async (payload) => {
  const notificationData = buildNotification(payload);

  return Notification.create(notificationData);
};

/* -------------------------------------------------------------------------- */
/* CREATE MANY                                                                */
/* -------------------------------------------------------------------------- */

const createNotifications = async (notifications = []) => {
  if (!Array.isArray(notifications)) {
    const error = new Error("Notifications must be an array.");
    error.statusCode = 400;
    throw error;
  }

  if (notifications.length === 0) {
    return [];
  }

  const notificationData = notifications.map(buildNotification);

  return Notification.insertMany(notificationData);
};

/* -------------------------------------------------------------------------- */
/* CREATE FOR USERS                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Create one notification per recipient.
 *
 * Each recipient must have an explicit notification audience.
 */
const createForUsers = async ({
  users,
  audience,
  getAudience,
  actor = null,

  category,
  type,
  title,
  message,

  priority = "NORMAL",

  application = null,

  entityType = "NONE",
  entityId = null,

  action = "NONE",
  actionUrl = null,

  metadata = {},

  expiresAt = null,
}) => {
  if (!Array.isArray(users)) {
    const error = new Error("users must be an array.");
    error.statusCode = 400;
    throw error;
  }

  const uniqueUsers = [
    ...new Set(
      users.filter(Boolean).map((user) => {
        const id = typeof user === "object" && user._id ? user._id : user;

        return String(id);
      }),
    ),
  ];

  if (uniqueUsers.length === 0) {
    return [];
  }

  const notifications = await Promise.all(
    uniqueUsers.map(async (user) => {
      const recipientAudience = getAudience
        ? await getAudience(user)
        : audience;

      return {
        user,
        audience: validateAudience(recipientAudience),

        actor,

        category,
        type,
        title,
        message,

        priority,

        application,

        entityType,
        entityId,

        action,
        actionUrl,

        metadata,

        expiresAt,
      };
    }),
  );

  return createNotifications(notifications);
};

/* -------------------------------------------------------------------------- */
/* CREATE FOR ROLE                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Create notifications for active users with a specific business role.
 */
const createForRole = async ({
  User,
  role,

  actor = null,

  category,
  type,
  title,
  message,

  priority = "NORMAL",

  application = null,

  entityType = "NONE",
  entityId = null,

  action = "NONE",
  actionUrl = null,

  metadata = {},

  expiresAt = null,
}) => {
  if (!User) {
    const error = new Error("User model is required.");
    error.statusCode = 500;
    throw error;
  }

  const normalizedRole = normalizeString(role);

  if (!normalizedRole) {
    const error = new Error("User role is required.");
    error.statusCode = 400;
    throw error;
  }

  /*
   * Business roles and notification audiences are separate concepts.
   * In this application, supported operational roles map to audiences
   * with the same names.
   */
  const audience = validateAudience(normalizedRole);

  const users = await User.find({
    role: normalizedRole,
    isActive: { $ne: false },
  })
    .select("_id role")
    .lean();

  if (!users.length) {
    return [];
  }

  return createForUsers({
    users: users.map((user) => user._id),
    audience,

    actor,

    category,
    type,
    title,
    message,

    priority,

    application,

    entityType,
    entityId,

    action,
    actionUrl,

    metadata,

    expiresAt,
  });
};

/* -------------------------------------------------------------------------- */
/* GET USER NOTIFICATIONS                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Retrieve notifications belonging only to the specified user.
 */
const getUserNotifications = async (
  userId,
  {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    unreadOnly = false,
    category = null,
    application = null,
  } = {},
) => {
  const normalizedUserId = normalizeId(userId, "userId");

  if (!normalizedUserId) {
    const error = new Error("userId is required.");
    error.statusCode = 400;
    throw error;
  }

  const parsedPage = Number.parseInt(page, 10);
  const parsedLimit = Number.parseInt(limit, 10);

  const currentPage = Math.max(
    Number.isFinite(parsedPage) ? parsedPage : DEFAULT_PAGE,
    1,
  );

  const currentLimit = Math.min(
    Math.max(Number.isFinite(parsedLimit) ? parsedLimit : DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  const filter = {
    user: normalizedUserId,
  };

  if (unreadOnly === true || String(unreadOnly).toLowerCase() === "true") {
    filter.read = false;
  }

  if (category) {
    filter.category = validateCategory(category);
  }

  if (application) {
    const applicationId = normalizeId(application, "application");

    if (!applicationId) {
      const error = new Error("application must be a valid ObjectId.");
      error.statusCode = 400;
      throw error;
    }

    filter.application = applicationId;
  }

  const skip = (currentPage - 1) * currentLimit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate({
        path: "actor",
        select: "firstName lastName email role",
      })
      .populate({
        path: "application",
        select: "_id applicationNumber status",
      })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    Notification.countDocuments(filter),

    Notification.countDocuments({
      user: normalizedUserId,
      read: false,
    }),
  ]);

  return {
    notifications,

    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      pages: Math.ceil(total / currentLimit),
    },

    unreadCount,
  };
};

/* -------------------------------------------------------------------------- */
/* GET UNREAD COUNT                                                           */
/* -------------------------------------------------------------------------- */

const getUnreadCount = async (userId) => {
  const normalizedUserId = normalizeId(userId, "userId");

  if (!normalizedUserId) {
    const error = new Error("userId is required.");
    error.statusCode = 400;
    throw error;
  }

  return Notification.countDocuments({
    user: normalizedUserId,
    read: false,
  });
};

/* -------------------------------------------------------------------------- */
/* MARK ONE AS READ                                                           */
/* -------------------------------------------------------------------------- */

const markAsRead = async (notificationId, userId) => {
  const normalizedNotificationId = normalizeId(
    notificationId,
    "notificationId",
  );

  const normalizedUserId = normalizeId(userId, "userId");

  if (!normalizedNotificationId) {
    const error = new Error("notificationId is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!normalizedUserId) {
    const error = new Error("userId is required.");
    error.statusCode = 400;
    throw error;
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: normalizedNotificationId,
      user: normalizedUserId,
    },
    {
      $set: {
        read: true,
        readAt: new Date(),
      },
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!notification) {
    throw createNotFoundError();
  }

  return notification;
};

/* -------------------------------------------------------------------------- */
/* MARK ALL AS READ                                                           */
/* -------------------------------------------------------------------------- */

const markAllAsRead = async (userId) => {
  const normalizedUserId = normalizeId(userId, "userId");

  if (!normalizedUserId) {
    const error = new Error("userId is required.");
    error.statusCode = 400;
    throw error;
  }

  const result = await Notification.updateMany(
    {
      user: normalizedUserId,
      read: false,
    },
    {
      $set: {
        read: true,
        readAt: new Date(),
      },
    },
  );

  return {
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  };
};

/* -------------------------------------------------------------------------- */
/* DELETE ONE                                                                 */
/* -------------------------------------------------------------------------- */

const deleteNotification = async (notificationId, userId) => {
  const normalizedNotificationId = normalizeId(
    notificationId,
    "notificationId",
  );

  const normalizedUserId = normalizeId(userId, "userId");

  if (!normalizedNotificationId) {
    const error = new Error("notificationId is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!normalizedUserId) {
    const error = new Error("userId is required.");
    error.statusCode = 400;
    throw error;
  }

  const notification = await Notification.findOneAndDelete({
    _id: normalizedNotificationId,
    user: normalizedUserId,
  });

  if (!notification) {
    throw createNotFoundError();
  }

  return notification;
};

/* -------------------------------------------------------------------------- */
/* DELETE ALL                                                                 */
/* -------------------------------------------------------------------------- */

const deleteAllNotifications = async (userId) => {
  const normalizedUserId = normalizeId(userId, "userId");

  if (!normalizedUserId) {
    const error = new Error("userId is required.");
    error.statusCode = 400;
    throw error;
  }

  const result = await Notification.deleteMany({
    user: normalizedUserId,
  });

  return {
    deletedCount: result.deletedCount,
  };
};

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                    */
/* -------------------------------------------------------------------------- */

export {
  buildNotification,
  createNotification,
  createNotifications,
  createForUsers,
  createForRole,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};
