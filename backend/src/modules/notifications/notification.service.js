import Notification from "./notification.model.js";
import User from "../users/user.model.js";

/*
============================================================
COLUSUS — NOTIFICATION SERVICE
============================================================

Central notification service for the entire Colusus ecosystem.

SUPPORTED RECIPIENTS:

CLIENT
ADMIN
STAFF
DEVELOPER

This service is intended to be used internally by:

- Applications
- Documents
- Client profiles
- Payments
- Bookings
- Admin operations
- System events

IMPORTANT:

Controllers should NOT be responsible for deciding who receives
system notifications.

Instead:

feature service
      ↓
notification.service
      ↓
notification database
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
SUPPORTED NOTIFICATION TYPES
============================================================
*/

const NOTIFICATION_TYPES = [
  "APPLICATION_UPDATE",

  "APPLICATION_STATUS_CHANGED",

  "DOCUMENT_APPROVED",

  "DOCUMENT_REJECTED",

  "DOCUMENT_REUPLOAD",

  "GENERAL",
];

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
VALIDATE USER ID
============================================================
*/

const validateUserId = (userId) => {
  if (!userId) {
    const error = new Error("Notification recipient is required.");

    error.statusCode = 400;

    throw error;
  }

  return userId;
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
*/

const buildNotificationData = ({
  userId,

  title,

  message,

  type = "GENERAL",

  metadata = {},
}) => {
  validateUserId(userId);

  if (!title || String(title).trim() === "") {
    const error = new Error("Notification title is required.");

    error.statusCode = 400;

    throw error;
  }

  if (!message || String(message).trim() === "") {
    const error = new Error("Notification message is required.");

    error.statusCode = 400;

    throw error;
  }

  return {
    user: userId,

    title: String(title).trim(),

    message: String(message).trim(),

    type: normalizeNotificationType(type),

    metadata: normalizeMetadata(metadata),
  };
};

/*
============================================================
CREATE NOTIFICATION
============================================================

Low-level internal notification creator.

This should normally be called by other services.

Example:

notificationService.createNotification({
    userId,
    title: "Document approved",
    message: "Your passport has been approved.",
    type: "DOCUMENT_APPROVED",
    metadata: {
        applicationId,
        documentId,
    },
});
============================================================
*/

const createNotification = async ({
  userId,

  title,

  message,

  type = "GENERAL",

  metadata = {},
}) => {
  const notificationData = buildNotificationData({
    userId,

    title,

    message,

    type,

    metadata,
  });

  const notification = await Notification.create(notificationData);

  return notification;
};

/*
============================================================
CREATE NOTIFICATION FOR USER
============================================================

Checks that the recipient exists and is active.

This is the preferred method when the recipient is already
known.
============================================================
*/

const createForUser = async ({
  userId,

  title,

  message,

  type = "GENERAL",

  metadata = {},
}) => {
  validateUserId(userId);

  const user = await User.findOne({
    _id: userId,

    isActive: true,
  }).select("_id role");

  if (!user) {
    return null;
  }

  return createNotification({
    userId: user._id,

    title,

    message,

    type,

    metadata,
  });
};

/*
============================================================
CREATE NOTIFICATIONS FOR MULTIPLE USERS
============================================================

Useful when:

- Multiple staff members need an alert
- Multiple administrators need an alert
- A system event affects multiple users
============================================================
*/

const createForUsers = async ({
  userIds = [],

  title,

  message,

  type = "GENERAL",

  metadata = {},
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
  FIND ACTIVE USERS
  ----------------------------------------------------------
  */

  const users = await User.find({
    _id: {
      $in: uniqueUserIds,
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

  const notifications = users.map((user) =>
    buildNotificationData({
      userId: user._id,

      title,

      message,

      type,

      metadata,
    }),
  );

  /*
  ----------------------------------------------------------
  INSERT
  ----------------------------------------------------------
  */

  return Notification.insertMany(notifications);
};

/*
============================================================
CREATE NOTIFICATIONS FOR ROLES
============================================================

Example:

createForRoles({
    roles: ["ADMIN", "STAFF"],
    title: "New document uploaded",
    message: "A client uploaded a passport.",
    type: "APPLICATION_UPDATE",
    metadata: {
        applicationId,
        documentId,
    }
});

This sends the notification to every active ADMIN
and STAFF account.

============================================================
*/

const createForRoles = async ({
  roles = [],

  title,

  message,

  type = "GENERAL",

  metadata = {},
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

  const notifications = users.map((user) =>
    buildNotificationData({
      userId: user._id,

      title,

      message,

      type,

      metadata,
    }),
  );

  return Notification.insertMany(notifications);
};

/*
============================================================
CREATE NOTIFICATION FOR APPLICATION OWNER
============================================================

This is the preferred helper for:

- Document approved
- Document rejected
- Re-upload required
- Application status changed
- Application processing
- Application approved
- Application rejected
============================================================
*/

const createForApplicationOwner = async ({
  application,

  title,

  message,

  type = "APPLICATION_UPDATE",

  metadata = {},
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

    title,

    message,

    type,

    metadata: {
      applicationId: application._id,

      ...normalizeMetadata(metadata),
    },
  });
};

/*
============================================================
GET USER NOTIFICATIONS
============================================================

Supports pagination.

Default:

page = 1
limit = 30
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
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(parsedLimit),

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
*/

const markNotificationAsRead = async (
  notificationId,

  userId,
) => {
  validateUserId(userId);

  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,

      user: userId,
    },

    {
      $set: {
        read: true,
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

  const notification = await Notification.findOneAndDelete({
    _id: notificationId,

    user: userId,
  });

  return notification;
};

/*
============================================================
DELETE ALL USER NOTIFICATIONS
============================================================

Useful later for notification cleanup/settings.
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
  Internal creation
  */
  createNotification,

  /*
  Targeting helpers
  */
  createForUser,

  createForUsers,

  createForRoles,

  createForApplicationOwner,

  /*
  Retrieval
  */
  getUserNotifications,

  getUnreadCount,

  /*
  Read state
  */
  markNotificationAsRead,

  markAllAsRead,

  /*
  Deletion
  */
  deleteNotification,

  deleteAllUserNotifications,
};
