import Notification from "../notifications/notification.model.js";
import User from "../users/user.model.js";

/*
============================================================
colossus — ADMIN NOTIFICATION SERVICE
============================================================

Admin-only notification data access.

IMPORTANT:

This service MUST NEVER operate on the entire Notification
collection without restricting the recipient to ADMIN users.

Admin notifications are identified by the recipient user's
role:

    user.role === "ADMIN"

This prevents admin notification operations from accidentally
reading, modifying, or deleting:

    CLIENT
    STAFF
    DEVELOPER

notifications.

The route layer is responsible for authentication and ADMIN
authorization.

This service is responsible for database-level scoping.

============================================================
*/

/*
============================================================
ADMIN USER FILTER
============================================================

Reusable recipient filter.

Because Notification.user references User, admin notification
queries use this filter through MongoDB's $in operator.

============================================================
*/

const getAdminUserIds = async () => {
  const admins = await User.find({
    role: "ADMIN",
    isActive: true,
  }).select("_id");

  return admins.map((admin) => admin._id);
};

/*
============================================================
GET ADMIN NOTIFICATIONS
============================================================

Returns notifications belonging only to active ADMIN users.

Supports:

    page
    limit
    unreadOnly

============================================================
*/

const getAdminNotifications = async ({
  page = 1,
  limit = 30,
  unreadOnly = false,
} = {}) => {
  /*
  ----------------------------------------------------------
  PAGINATION
  ----------------------------------------------------------
  */

  const parsedPage = Math.max(Number(page) || 1, 1);

  const parsedLimit = Math.min(Math.max(Number(limit) || 30, 1), 100);

  const skip = (parsedPage - 1) * parsedLimit;

  /*
  ----------------------------------------------------------
  FIND ACTIVE ADMIN USERS
  ----------------------------------------------------------
  */

  const adminUserIds = await getAdminUserIds();

  /*
  ----------------------------------------------------------
  BASE QUERY
  ----------------------------------------------------------
  */

  const query = {
    user: {
      $in: adminUserIds,
    },
  };

  /*
  ----------------------------------------------------------
  UNREAD FILTER
  ----------------------------------------------------------
  */

  if (unreadOnly) {
    query.read = false;
  }

  /*
  ----------------------------------------------------------
  DATABASE OPERATIONS
  ----------------------------------------------------------
  */

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .populate("user", "name email role")
      .populate("actor", "name email role")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(parsedLimit),

    Notification.countDocuments(query),

    Notification.countDocuments({
      user: {
        $in: adminUserIds,
      },

      read: false,
    }),
  ]);

  /*
  ----------------------------------------------------------
  RESPONSE
  ----------------------------------------------------------
  */

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
GET ADMIN UNREAD COUNT
============================================================

Counts unread notifications belonging only to active ADMIN
users.

============================================================
*/

const getAdminUnreadCount = async () => {
  const adminUserIds = await getAdminUserIds();

  return Notification.countDocuments({
    user: {
      $in: adminUserIds,
    },

    read: false,
  });
};

/*
============================================================
MARK ADMIN NOTIFICATION AS READ
============================================================

Only notifications belonging to an ADMIN user can be updated.

============================================================
*/

const markAdminNotificationAsRead = async (notificationId) => {
  const adminUserIds = await getAdminUserIds();

  return Notification.findOneAndUpdate(
    {
      _id: notificationId,

      user: {
        $in: adminUserIds,
      },
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
  )
    .populate("user", "name email role")
    .populate("actor", "name email role");
};

/*
============================================================
MARK ALL ADMIN NOTIFICATIONS AS READ
============================================================

Marks only unread notifications belonging to ADMIN users.

CLIENT / STAFF / DEVELOPER notifications are untouched.

============================================================
*/

const markAllAdminNotificationsAsRead = async () => {
  const adminUserIds = await getAdminUserIds();

  const result = await Notification.updateMany(
    {
      user: {
        $in: adminUserIds,
      },

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
DELETE ONE ADMIN NOTIFICATION
============================================================

Only notifications belonging to ADMIN users can be deleted.

============================================================
*/

const deleteAdminNotification = async (notificationId) => {
  const adminUserIds = await getAdminUserIds();

  return Notification.findOneAndDelete({
    _id: notificationId,

    user: {
      $in: adminUserIds,
    },
  });
};

/*
============================================================
DELETE ALL ADMIN NOTIFICATIONS
============================================================

Deletes notifications belonging only to ADMIN users.

CLIENT / STAFF / DEVELOPER notifications remain untouched.

============================================================
*/

const deleteAllAdminNotifications = async () => {
  const adminUserIds = await getAdminUserIds();

  const result = await Notification.deleteMany({
    user: {
      $in: adminUserIds,
    },
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
  Retrieval
  */

  getAdminNotifications,

  getAdminUnreadCount,

  /*
  Read state
  */

  markAdminNotificationAsRead,

  markAllAdminNotificationsAsRead,

  /*
  Deletion
  */

  deleteAdminNotification,

  deleteAllAdminNotifications,
};
