import notificationService from "./notification.service.js";

/*
============================================================
colossus — NOTIFICATION CONTROLLER
============================================================

Recipient-facing notification controller.

This controller is responsible ONLY for:

- Reading request parameters
- Reading the authenticated user
- Calling notificationService
- Returning HTTP responses
- Passing errors to the global error handler

IMPORTANT:

Notification creation is intentionally NOT exposed through
these routes.

Notifications are created internally by trusted backend
workflows such as:

- Application services
- Document services
- Payment services
- Booking services
- Admin services
- Profile services
- Messaging services
- Other trusted platform workflows

The authenticated user's ID is always used when accessing
recipient notifications.

The controller never accepts a user ID from the request body
or query string for recipient operations.

============================================================
*/

/*
============================================================
GET USER NOTIFICATIONS
============================================================

GET /api/v1/notifications

QUERY:

?page=1
&limit=30
&unreadOnly=true

Example:

GET /api/v1/notifications?page=1&limit=30

Response:

{
    success: true,
    data: {
        notifications: [],
        pagination: {},
        unreadCount: 0
    }
}

============================================================
*/

export const getNotifications = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------
    AUTHENTICATED USER
    ----------------------------------------------------------
    */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,

        message: "Authentication required.",
      });
    }

    /*
    ----------------------------------------------------------
    QUERY PARAMETERS
    ----------------------------------------------------------
    */

    const { page = 1, limit = 30, unreadOnly = "false" } = req.query;

    /*
    ----------------------------------------------------------
    NORMALIZE UNREAD FILTER
    ----------------------------------------------------------
    */

    const shouldFetchUnreadOnly =
      String(unreadOnly).trim().toLowerCase() === "true";

    /*
    ----------------------------------------------------------
    SERVICE
    ----------------------------------------------------------
    */

    const result = await notificationService.getUserNotifications(req.user.id, {
      page,
      limit,
      unreadOnly: shouldFetchUnreadOnly,
    });

    /*
    ----------------------------------------------------------
    RESPONSE
    ----------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET UNREAD COUNT
============================================================

GET /api/v1/notifications/unread-count

Response:

{
    success: true,
    data: {
        count: 4
    }
}

============================================================
*/

export const getUnreadCount = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------
    AUTHENTICATED USER
    ----------------------------------------------------------
    */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,

        message: "Authentication required.",
      });
    }

    /*
    ----------------------------------------------------------
    SERVICE
    ----------------------------------------------------------
    */

    const count = await notificationService.getUnreadCount(req.user.id);

    /*
    ----------------------------------------------------------
    RESPONSE
    ----------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      data: {
        count,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
MARK NOTIFICATION AS READ
============================================================

PATCH /api/v1/notifications/:id/read

IMPORTANT:

The service verifies that the notification belongs to the
authenticated user.

A user therefore cannot mark another user's notification
as read simply by supplying another notification ID.

============================================================
*/

export const markNotificationAsRead = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------
    AUTHENTICATED USER
    ----------------------------------------------------------
    */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,

        message: "Authentication required.",
      });
    }

    /*
    ----------------------------------------------------------
    NOTIFICATION ID
    ----------------------------------------------------------
    */

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,

        message: "Notification ID is required.",
      });
    }

    /*
    ----------------------------------------------------------
    SERVICE
    ----------------------------------------------------------
    */

    const notification = await notificationService.markNotificationAsRead(
      id,

      req.user.id,
    );

    /*
    ----------------------------------------------------------
    NOT FOUND
    ----------------------------------------------------------
    |
    | This intentionally covers:
    |
    | - Notification does not exist
    | - Notification belongs to another user
    | - Invalid notification ID
    |
    ----------------------------------------------------------
    */

    if (!notification) {
      return res.status(404).json({
        success: false,

        message: "Notification not found.",
      });
    }

    /*
    ----------------------------------------------------------
    RESPONSE
    ----------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message: "Notification marked as read.",

      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
MARK ALL NOTIFICATIONS AS READ
============================================================

PATCH /api/v1/notifications/read-all

Only notifications belonging to the authenticated user
are affected.

============================================================
*/

export const markAllAsRead = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------
    AUTHENTICATED USER
    ----------------------------------------------------------
    */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,

        message: "Authentication required.",
      });
    }

    /*
    ----------------------------------------------------------
    SERVICE
    ----------------------------------------------------------
    */

    const result = await notificationService.markAllAsRead(req.user.id);

    /*
    ----------------------------------------------------------
    RESPONSE
    ----------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message: "All notifications marked as read.",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
DELETE NOTIFICATION
============================================================

DELETE /api/v1/notifications/:id

IMPORTANT:

The service ensures that the notification belongs to the
authenticated user before deleting it.

============================================================
*/

export const deleteNotification = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------
    AUTHENTICATED USER
    ----------------------------------------------------------
    */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,

        message: "Authentication required.",
      });
    }

    /*
    ----------------------------------------------------------
    NOTIFICATION ID
    ----------------------------------------------------------
    */

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,

        message: "Notification ID is required.",
      });
    }

    /*
    ----------------------------------------------------------
    SERVICE
    ----------------------------------------------------------
    */

    const notification = await notificationService.deleteNotification(
      id,

      req.user.id,
    );

    /*
    ----------------------------------------------------------
    NOT FOUND
    ----------------------------------------------------------
    */

    if (!notification) {
      return res.status(404).json({
        success: false,

        message: "Notification not found.",
      });
    }

    /*
    ----------------------------------------------------------
    RESPONSE
    ----------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message: "Notification deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
DELETE ALL NOTIFICATIONS
============================================================

DELETE /api/v1/notifications

Deletes every notification belonging to the authenticated
user.

IMPORTANT:

This does NOT delete notifications belonging to:

- Other clients
- Admins
- Staff
- Developers

The service scopes the deletion to req.user.id.

============================================================
*/

export const deleteAllNotifications = async (req, res, next) => {
  try {
    /*
    ----------------------------------------------------------
    AUTHENTICATED USER
    ----------------------------------------------------------
    */

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,

        message: "Authentication required.",
      });
    }

    /*
    ----------------------------------------------------------
    SERVICE
    ----------------------------------------------------------
    */

    const result = await notificationService.deleteAllUserNotifications(
      req.user.id,
    );

    /*
    ----------------------------------------------------------
    RESPONSE
    ----------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      message: "All notifications deleted successfully.",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
EXPORT SUMMARY
============================================================

Recipient notification operations:

GET     /notifications
GET     /notifications/unread-count
PATCH   /notifications/read-all
PATCH   /notifications/:id/read
DELETE  /notifications/:id
DELETE  /notifications

Notification creation is intentionally absent.

============================================================
*/
