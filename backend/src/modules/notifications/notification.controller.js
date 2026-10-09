import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "./notification.service.js";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Get the authenticated user's ID.
 */
const getUserId = (req) => {
  const userId = req.user?._id || req.user?.id;

  if (!userId) {
    const error = new Error("Authenticated user is required.");
    error.statusCode = 401;
    throw error;
  }

  return userId;
};

/**
 * Handle notification controller errors consistently.
 */
const handleError = (res, error) => {
  console.error("NOTIFICATION ERROR:", error);

  let statusCode = error.statusCode || 500;

  if (error.name === "CastError" || error.name === "ValidationError") {
    statusCode = 400;
  }

  if (error.name === "UnauthorizedError") {
    statusCode = 401;
  }

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Notification request failed.",
  });
};

/* -------------------------------------------------------------------------- */
/* GET NOTIFICATIONS                                                          */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/v1/notifications
 *
 * Query parameters:
 * ?page=1
 * ?limit=20
 * ?unreadOnly=true
 * ?category=APPLICATION
 * ?application=<applicationId>
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = getUserId(req);

    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      category,
      application,
    } = req.query;

    const result = await getUserNotifications(userId, {
      page,
      limit,
      unreadOnly,
      category,
      application,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET UNREAD COUNT                                                           */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/v1/notifications/unread-count
 */
export const getUnreadCountController = async (req, res) => {
  try {
    const userId = getUserId(req);

    const count = await getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      unreadCount: count,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/* MARK ONE AS READ                                                           */
/* -------------------------------------------------------------------------- */

/**
 * PATCH /api/v1/notifications/:id/read
 */
export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = getUserId(req);

    const notification = await markAsRead(req.params.id, userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      notification,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/* MARK ALL AS READ                                                           */
/* -------------------------------------------------------------------------- */

/**
 * PATCH /api/v1/notifications/read-all
 */
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = getUserId(req);

    const result = await markAllAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      ...result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/* DELETE ONE                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * DELETE /api/v1/notifications/:id
 */
export const deleteUserNotification = async (req, res) => {
  try {
    const userId = getUserId(req);

    const notification = await deleteNotification(req.params.id, userId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

/* -------------------------------------------------------------------------- */
/* DELETE ALL                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * DELETE /api/v1/notifications
 */
export const deleteUserNotifications = async (req, res) => {
  try {
    const userId = getUserId(req);

    const result = await deleteAllNotifications(userId);

    return res.status(200).json({
      success: true,
      message: "Notifications deleted successfully.",
      ...result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
