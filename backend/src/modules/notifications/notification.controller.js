import notificationService from "./notification.service.js";

/*
============================================================
COLUSUS — NOTIFICATION CONTROLLER
============================================================

The controller handles notifications belonging to the
authenticated user.

IMPORTANT:

Notification creation is intentionally NOT exposed here.

System notifications should be created internally by:

- Application services
- Document services
- Payment services
- Booking services
- Admin services
- Profile services
- Other trusted backend workflows

This prevents a client from creating notifications for
another user.
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

Returns:

{
    notifications,
    pagination,
    unreadCount
}

============================================================
*/

export const getNotifications = async (
  req,

  res,

  next,
) => {
  try {
    const {
      page,

      limit,

      unreadOnly,
    } = req.query;

    const result = await notificationService.getUserNotifications(
      req.user.id,

      {
        page,

        limit,

        unreadOnly: unreadOnly === "true",
      },
    );

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

============================================================
*/

export const getUnreadCount = async (
  req,

  res,

  next,
) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id);

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

============================================================
*/

export const markNotificationAsRead = async (
  req,

  res,

  next,
) => {
  try {
    const notification = await notificationService.markNotificationAsRead(
      req.params.id,

      req.user.id,
    );

    /*
    --------------------------------------------------------
    NOT FOUND
    --------------------------------------------------------
    */

    if (!notification) {
      return res.status(404).json({
        success: false,

        message: "Notification not found.",
      });
    }

    /*
    --------------------------------------------------------
    SUCCESS
    --------------------------------------------------------
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

============================================================
*/

export const markAllAsRead = async (
  req,

  res,

  next,
) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);

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

============================================================
*/

export const deleteNotification = async (
  req,

  res,

  next,
) => {
  try {
    const notification = await notificationService.deleteNotification(
      req.params.id,

      req.user.id,
    );

    /*
    --------------------------------------------------------
    NOT FOUND
    --------------------------------------------------------
    */

    if (!notification) {
      return res.status(404).json({
        success: false,

        message: "Notification not found.",
      });
    }

    /*
    --------------------------------------------------------
    SUCCESS
    --------------------------------------------------------
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

Useful for:

- Notification cleanup
- Client notification settings
- Admin notification cleanup
============================================================
*/

export const deleteAllNotifications = async (
  req,

  res,

  next,
) => {
  try {
    const result = await notificationService.deleteAllUserNotifications(
      req.user.id,
    );

    return res.status(200).json({
      success: true,

      message: "All notifications deleted successfully.",

      data: result,
    });
  } catch (error) {
    next(error);
  }
};
