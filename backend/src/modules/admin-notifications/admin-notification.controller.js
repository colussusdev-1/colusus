import adminNotificationService from "./admin-notification.service.js";

/*
============================================================
colossus — ADMIN NOTIFICATION CONTROLLER
============================================================

Admin-facing notification controller.

IMPORTANT:

This controller does NOT determine which users are admins.

Authorization should be handled by the admin route layer.

The controller is responsible only for:

- Reading admin notifications
- Reading unread count
- Marking one notification as read
- Marking all notifications as read
- Deleting one notification
- Deleting all admin notifications

The actual database logic belongs to:

    adminNotificationService

============================================================
*/

/*
============================================================
GET ADMIN NOTIFICATIONS
============================================================

GET /api/v1/admin/notifications

QUERY:

    ?page=1
    ?limit=30
    ?unreadOnly=true

Returns:

{
    success: true,
    data: {
        notifications,
        pagination,
        unreadCount
    }
}

============================================================
*/

export const getAdminNotifications = async (req, res, next) => {
  try {
    const { page, limit, unreadOnly } = req.query;

    const result = await adminNotificationService.getAdminNotifications({
      page,
      limit,
      unreadOnly: unreadOnly === "true",
    });

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
GET ADMIN UNREAD COUNT
============================================================

GET /api/v1/admin/notifications/unread-count

Returns:

{
    success: true,
    data: {
        count: 4
    }
}

============================================================
*/

export const getAdminUnreadCount = async (req, res, next) => {
  try {
    const count = await adminNotificationService.getAdminUnreadCount();

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
MARK ONE ADMIN NOTIFICATION AS READ
============================================================

PATCH /api/v1/admin/notifications/:id/read

============================================================
*/

export const markAdminNotificationAsRead = async (req, res, next) => {
  try {
    const notification =
      await adminNotificationService.markAdminNotificationAsRead(req.params.id);

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
    SUCCESS
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
MARK ALL ADMIN NOTIFICATIONS AS READ
============================================================

PATCH /api/v1/admin/notifications/read-all

============================================================
*/

export const markAllAdminNotificationsAsRead = async (req, res, next) => {
  try {
    const result =
      await adminNotificationService.markAllAdminNotificationsAsRead();

    return res.status(200).json({
      success: true,
      message: "All admin notifications marked as read.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
DELETE ONE ADMIN NOTIFICATION
============================================================

DELETE /api/v1/admin/notifications/:id

============================================================
*/

export const deleteAdminNotification = async (req, res, next) => {
  try {
    const notification = await adminNotificationService.deleteAdminNotification(
      req.params.id,
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
    SUCCESS
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
DELETE ALL ADMIN NOTIFICATIONS
============================================================

DELETE /api/v1/admin/notifications

Removes all notifications belonging to the admin
notification scope.

The service is responsible for determining the exact
admin scope.

============================================================
*/

export const deleteAllAdminNotifications = async (req, res, next) => {
  try {
    const result = await adminNotificationService.deleteAllAdminNotifications();

    return res.status(200).json({
      success: true,
      message: "All admin notifications deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
