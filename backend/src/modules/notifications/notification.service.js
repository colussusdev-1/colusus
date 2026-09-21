import mongoose from "mongoose";

import Notification from "./notification.model.js";
import User from "../users/user.model.js";

/*
============================================================
colossus — NOTIFICATION SERVICE
============================================================

Central notification service for the entire colossus ecosystem.

SUPPORTED RECIPIENTS:

CLIENT
ADMIN
STAFF
DEVELOPER

This service is responsible for:

- Creating notifications
- Targeting users
- Targeting roles
- Creating application-owner notifications
- Retrieving notifications
- Managing read state
- Deleting notifications

IMPORTANT:

Controllers should NOT decide who receives system
notifications.

Feature services should call this service.

The recipient's role is used to determine the notification
AUDIENCE automatically.

============================================================
*/

/*
============================================================
SUPPORTED ROLES
============================================================
*/

const SUPPORTED_ROLES = ["CLIENT", "ADMIN", "DEVELOPER", "STAFF"];

/*
============================================================
SUPPORTED AUDIENCES
============================================================
*/

const SUPPORTED_AUDIENCES = ["CLIENT", "ADMIN", "DEVELOPER", "STAFF"];

/*
============================================================
SUPPORTED NOTIFICATION TYPES
============================================================
*/

const NOTIFICATION_TYPES = [
  /*
  ----------------------------------------------------------
  APPLICATION
  ----------------------------------------------------------
  */

  "APPLICATION_CREATED",

  "APPLICATION_UPDATED",

  "APPLICATION_STATUS_CHANGED",

  "APPLICATION_SUBMITTED",

  "APPLICATION_APPROVED",

  "APPLICATION_REJECTED",

  /*
  ----------------------------------------------------------
  DOCUMENT
  ----------------------------------------------------------
  */

  "DOCUMENT_UPLOADED",

  "DOCUMENT_UPDATED",

  "DOCUMENT_APPROVED",

  "DOCUMENT_REJECTED",

  "DOCUMENT_REUPLOAD_REQUIRED",

  /*
  ----------------------------------------------------------
  PROFILE
  ----------------------------------------------------------
  */

  "PROFILE_UPDATED",

  "PROFILE_COMPLETED",

  /*
  ----------------------------------------------------------
  PAYMENT
  ----------------------------------------------------------
  */

  "PAYMENT_CREATED",

  "PAYMENT_RECEIVED",

  "PAYMENT_PENDING",

  "PAYMENT_FAILED",

  "PAYMENT_REFUNDED",

  /*
  ----------------------------------------------------------
  BOOKING
  ----------------------------------------------------------
  */

  "BOOKING_CREATED",

  "BOOKING_UPDATED",

  "BOOKING_CANCELLED",

  "BOOKING_CONFIRMED",

  /*
  ----------------------------------------------------------
  ADMIN / STAFF
  ----------------------------------------------------------
  */

  "ADMIN_ACTION",

  "STAFF_ACTION",

  /*
  ----------------------------------------------------------
  SYSTEM
  ----------------------------------------------------------
  */

  "MESSAGE_RECEIVED",

  "SYSTEM",

  "GENERAL",
];

/*
============================================================
SUPPORTED ENTITY TYPES
============================================================
*/

const SUPPORTED_ENTITY_TYPES = [
  "APPLICATION",

  "DOCUMENT",

  "PROFILE",

  "PAYMENT",

  "BOOKING",

  "USER",

  "SYSTEM",

  "NONE",
];

/*
============================================================
SUPPORTED PRIORITIES
============================================================
*/

const SUPPORTED_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"];

/*
============================================================
NORMALIZE ROLE
============================================================
*/

const normalizeRole = (role) => {
  return String(role || "")
    .trim()
    .toUpperCase();
};

/*
============================================================
NORMALIZE AUDIENCE
============================================================
*/

const normalizeAudience = (audience) => {
  const normalized = String(audience || "")
    .trim()
    .toUpperCase();

  if (SUPPORTED_AUDIENCES.includes(normalized)) {
    return normalized;
  }

  return null;
};

/*
============================================================
ROLE → AUDIENCE
============================================================
|
| The current colossus architecture uses the user's role as
| the source of truth for notification audience.
|
| Example:
|
|     CLIENT    → CLIENT
|     ADMIN     → ADMIN
|     STAFF     → STAFF
|     DEVELOPER → DEVELOPER
|
============================================================
*/

const audienceFromRole = (role) => {
  const normalizedRole = normalizeRole(role);

  if (SUPPORTED_ROLES.includes(normalizedRole)) {
    return normalizedRole;
  }

  return null;
};

/*
============================================================
NORMALIZE NOTIFICATION TYPE
============================================================
*/

const normalizeNotificationType = (type) => {
  const normalized = String(type || "")
    .trim()
    .toUpperCase();

  if (NOTIFICATION_TYPES.includes(normalized)) {
    return normalized;
  }

  return "GENERAL";
};

/*
============================================================
NORMALIZE ENTITY TYPE
============================================================
*/

const normalizeEntityType = (entityType) => {
  const normalized = String(entityType || "")
    .trim()
    .toUpperCase();

  if (SUPPORTED_ENTITY_TYPES.includes(normalized)) {
    return normalized;
  }

  return "NONE";
};

/*
============================================================
NORMALIZE PRIORITY
============================================================
*/

const normalizePriority = (priority) => {
  const normalized = String(priority || "")
    .trim()
    .toUpperCase();

  if (SUPPORTED_PRIORITIES.includes(normalized)) {
    return normalized;
  }

  return "NORMAL";
};

/*
============================================================
VALIDATE USER ID
============================================================
*/

const validateUserId = (userId) => {
  if (!userId) {
    const error = new Error("Notification recipient is required.");

    error.statusCode = 400;

    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new Error("Invalid notification recipient.");

    error.statusCode = 400;

    throw error;
  }

  return userId;
};

/*
============================================================
VALIDATE ACTOR ID
============================================================
*/

const normalizeActorId = (actorId) => {
  if (!actorId) {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(actorId)) {
    return null;
  }

  return actorId;
};

/*
============================================================
NORMALIZE METADATA
============================================================
*/

const normalizeMetadata = (metadata = {}) => {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  return metadata;
};

/*
============================================================
BUILD NOTIFICATION DATA
============================================================
|
| Audience must be supplied here.
|
| The public creation helpers normally determine the audience
| automatically from the recipient User record.
|
============================================================
*/

const buildNotificationData = ({
  userId,

  audience,

  actorId = null,

  title,

  message,

  type = "GENERAL",

  entityType = "NONE",

  entityId = null,

  metadata = {},

  priority = "NORMAL",
}) => {
  validateUserId(userId);

  /*
  ----------------------------------------------------------
  AUDIENCE
  ----------------------------------------------------------
  */

  const normalizedAudience = normalizeAudience(audience);

  if (!normalizedAudience) {
    const error = new Error("Notification audience is required.");

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  TITLE
  ----------------------------------------------------------
  */

  if (!title || String(title).trim() === "") {
    const error = new Error("Notification title is required.");

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  MESSAGE
  ----------------------------------------------------------
  */

  if (!message || String(message).trim() === "") {
    const error = new Error("Notification message is required.");

    error.statusCode = 400;

    throw error;
  }

  /*
  ----------------------------------------------------------
  ENTITY ID
  ----------------------------------------------------------
  */

  let normalizedEntityId = null;

  if (entityId) {
    if (!mongoose.Types.ObjectId.isValid(entityId)) {
      const error = new Error("Invalid notification entity ID.");

      error.statusCode = 400;

      throw error;
    }

    normalizedEntityId = entityId;
  }

  /*
  ----------------------------------------------------------
  RETURN NORMALIZED DATA
  ----------------------------------------------------------
  */

  return {
    user: userId,

    audience: normalizedAudience,

    actor: normalizeActorId(actorId),

    title: String(title).trim(),

    message: String(message).trim(),

    type: normalizeNotificationType(type),

    entityType: normalizeEntityType(entityType),

    entityId: normalizedEntityId,

    metadata: normalizeMetadata(metadata),

    priority: normalizePriority(priority),
  };
};

/*
============================================================
CREATE NOTIFICATION
============================================================
|
| Low-level internal notification creator.
|
| This method requires an audience because it is the lowest
| level creation function.
|
| Most application code should use createForUser(),
| createForUsers() or createForRoles().
|
============================================================
*/

const createNotification = async ({
  userId,

  audience,

  actorId = null,

  title,

  message,

  type = "GENERAL",

  entityType = "NONE",

  entityId = null,

  metadata = {},

  priority = "NORMAL",
}) => {
  const notificationData = buildNotificationData({
    userId,

    audience,

    actorId,

    title,

    message,

    type,

    entityType,

    entityId,

    metadata,

    priority,
  });

  return Notification.create(notificationData);
};

/*
============================================================
CREATE NOTIFICATION FOR USER
============================================================
|
| Checks that the recipient exists and is active.
|
| Audience is automatically derived from the recipient's
| current role.
|
============================================================
*/

const createForUser = async ({
  userId,

  actorId = null,

  title,

  message,

  type = "GENERAL",

  entityType = "NONE",

  entityId = null,

  metadata = {},

  priority = "NORMAL",
}) => {
  validateUserId(userId);

  const user = await User.findOne({
    _id: userId,

    isActive: true,
  }).select("_id role");

  if (!user) {
    return null;
  }

  const audience = audienceFromRole(user.role);

  if (!audience) {
    const error = new Error(
      `Unsupported notification recipient role: ${user.role}`,
    );

    error.statusCode = 400;

    throw error;
  }

  return createNotification({
    userId: user._id,

    audience,

    actorId,

    title,

    message,

    type,

    entityType,

    entityId,

    metadata,

    priority,
  });
};

/*
============================================================
CREATE NOTIFICATIONS FOR MULTIPLE USERS
============================================================
|
| Audience is determined individually for every recipient.
|
| This is important because a list may contain:
|
|     CLIENT
|     ADMIN
|     STAFF
|
| at the same time.
|
============================================================
*/

const createForUsers = async ({
  userIds = [],

  actorId = null,

  title,

  message,

  type = "GENERAL",

  entityType = "NONE",

  entityId = null,

  metadata = {},

  priority = "NORMAL",
}) => {
  if (!Array.isArray(userIds) || !userIds.length) {
    return [];
  }

  /*
  ----------------------------------------------------------
  REMOVE DUPLICATES
  ----------------------------------------------------------
  */

  const uniqueUserIds = [
    ...new Set(userIds.filter(Boolean).map((id) => String(id))),
  ];

  if (!uniqueUserIds.length) {
    return [];
  }

  /*
  ----------------------------------------------------------
  VALIDATE USER IDS
  ----------------------------------------------------------
  */

  const validUserIds = uniqueUserIds.filter((id) =>
    mongoose.Types.ObjectId.isValid(id),
  );

  if (!validUserIds.length) {
    return [];
  }

  /*
  ----------------------------------------------------------
  FIND ACTIVE USERS
  ----------------------------------------------------------
  */

  const users = await User.find({
    _id: {
      $in: validUserIds,
    },

    isActive: true,
  }).select("_id role");

  if (!users.length) {
    return [];
  }

  /*
  ----------------------------------------------------------
  BUILD NOTIFICATIONS
  ----------------------------------------------------------
  */

  const notifications = [];

  for (const user of users) {
    const audience = audienceFromRole(user.role);

    /*
    --------------------------------------------------------
    SKIP USERS WITH UNSUPPORTED ROLES
    --------------------------------------------------------
    */

    if (!audience) {
      continue;
    }

    notifications.push(
      buildNotificationData({
        userId: user._id,

        audience,

        actorId,

        title,

        message,

        type,

        entityType,

        entityId,

        metadata,

        priority,
      }),
    );
  }

  /*
  ----------------------------------------------------------
  INSERT
  ----------------------------------------------------------
  */

  if (!notifications.length) {
    return [];
  }

  return Notification.insertMany(notifications);
};

/*
============================================================
CREATE NOTIFICATIONS FOR ROLES
============================================================
|
| Example:
|
| createForRoles({
|   roles: ["ADMIN", "STAFF"],
|   ...
| })
|
| Every active user with one of those roles receives an
| individual notification.
|
============================================================
*/

const createForRoles = async ({
  roles = [],

  actorId = null,

  title,

  message,

  type = "GENERAL",

  entityType = "NONE",

  entityId = null,

  metadata = {},

  priority = "NORMAL",
}) => {
  if (!Array.isArray(roles) || !roles.length) {
    return [];
  }

  /*
  ----------------------------------------------------------
  NORMALIZE ROLES
  ----------------------------------------------------------
  */

  const normalizedRoles = [
    ...new Set(
      roles.map(normalizeRole).filter((role) => SUPPORTED_ROLES.includes(role)),
    ),
  ];

  if (!normalizedRoles.length) {
    return [];
  }

  /*
  ----------------------------------------------------------
  FIND ACTIVE USERS
  ----------------------------------------------------------
  */

  const users = await User.find({
    role: {
      $in: normalizedRoles,
    },

    isActive: true,
  }).select("_id role");

  if (!users.length) {
    return [];
  }

  /*
  ----------------------------------------------------------
  CREATE NOTIFICATIONS
  ----------------------------------------------------------
  */

  const notifications = [];

  for (const user of users) {
    const audience = audienceFromRole(user.role);

    if (!audience) {
      continue;
    }

    notifications.push(
      buildNotificationData({
        userId: user._id,

        audience,

        actorId,

        title,

        message,

        type,

        entityType,

        entityId,

        metadata,

        priority,
      }),
    );
  }

  if (!notifications.length) {
    return [];
  }

  return Notification.insertMany(notifications);
};

/*
============================================================
CREATE NOTIFICATION FOR APPLICATION OWNER
============================================================
|
| Used for:
|
| - Document approved
| - Document rejected
| - Re-upload required
| - Application status changed
| - Application approved
| - Application rejected
|
============================================================
*/

const createForApplicationOwner = async ({
  application,

  actorId = null,

  title,

  message,

  type = "APPLICATION_STATUS_CHANGED",

  entityType = "APPLICATION",

  entityId = null,

  metadata = {},

  priority = "NORMAL",
}) => {
  if (!application) {
    return null;
  }

  const userId = application.user?._id || application.user;

  if (!userId) {
    return null;
  }

  return createForUser({
    userId,

    actorId,

    title,

    message,

    type,

    entityType,

    entityId: entityId || application._id,

    metadata: {
      applicationId: application._id,

      ...normalizeMetadata(metadata),
    },

    priority,
  });
};

/*
============================================================
GET USER NOTIFICATIONS
============================================================
|
| Recipient-facing inbox.
|
| IMPORTANT:
|
| The query is ALWAYS scoped to the authenticated user's ID.
|
| Audience is intentionally not trusted from the frontend.
|
============================================================
*/

const getUserNotifications = async (
  userId,

  {
    page = 1,

    limit = 30,

    unreadOnly = false,
  } = {},
) => {
  validateUserId(userId);

  const parsedPage = Math.max(Number(page) || 1, 1);

  const parsedLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);

  const skip = (parsedPage - 1) * parsedLimit;

  const query = {
    user: userId,
  };

  if (unreadOnly) {
    query.read = false;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .populate("actor", "name email role")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),

    Notification.countDocuments(query),

    Notification.countDocuments({
      user: userId,

      read: false,
    }),
  ]);

  return {
    notifications,

    pagination: {
      page: parsedPage,

      limit: parsedLimit,

      total,

      pages: Math.ceil(total / parsedLimit),
    },

    unreadCount,
  };
};

/*
============================================================
GET UNREAD COUNT
============================================================
*/

const getUnreadCount = async (userId) => {
  validateUserId(userId);

  return Notification.countDocuments({
    user: userId,

    read: false,
  });
};

/*
============================================================
MARK NOTIFICATION AS READ
============================================================
|
| A notification can ONLY be modified when it belongs to
| the authenticated user.
|
============================================================
*/

const markNotificationAsRead = async (
  notificationId,

  userId,
) => {
  validateUserId(userId);

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return null;
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,

      user: userId,
    },

    {
      $set: {
        read: true,

        readAt: new Date(),
      },
    },

    {
      new: true,
    },
  );

  return notification;
};

/*
============================================================
MARK ALL AS READ
============================================================
*/

const markAllAsRead = async (userId) => {
  validateUserId(userId);

  const result = await Notification.updateMany(
    {
      user: userId,

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
    success: true,

    modifiedCount: result.modifiedCount || 0,
  };
};

/*
============================================================
DELETE NOTIFICATION
============================================================
*/

const deleteNotification = async (
  notificationId,

  userId,
) => {
  validateUserId(userId);

  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return null;
  }

  return Notification.findOneAndDelete({
    _id: notificationId,

    user: userId,
  });
};

/*
============================================================
DELETE ALL USER NOTIFICATIONS
============================================================
*/

const deleteAllUserNotifications = async (userId) => {
  validateUserId(userId);

  const result = await Notification.deleteMany({
    user: userId,
  });

  return {
    success: true,

    deletedCount: result.deletedCount || 0,
  };
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  /*
  ----------------------------------------------------------
  CREATION
  ----------------------------------------------------------
  */

  createNotification,

  createForUser,

  createForUsers,

  createForRoles,

  createForApplicationOwner,

  /*
  ----------------------------------------------------------
  RETRIEVAL
  ----------------------------------------------------------
  */

  getUserNotifications,

  getUnreadCount,

  /*
  ----------------------------------------------------------
  READ STATE
  ----------------------------------------------------------
  */

  markNotificationAsRead,

  markAllAsRead,

  /*
  ----------------------------------------------------------
  DELETION
  ----------------------------------------------------------
  */

  deleteNotification,

  deleteAllUserNotifications,
};
