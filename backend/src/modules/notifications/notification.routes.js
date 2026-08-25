import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from "./notification.controller.js";

const router = express.Router();

/*
============================================================
COLUSUS — NOTIFICATION ROUTES
============================================================

Recipient-facing notification endpoints.

These routes are intentionally protected by authentication.

Notification creation should happen internally through:

    notificationService.createNotification()

rather than allowing clients to create arbitrary
notifications for themselves or other users.

Supported recipients include:

    CLIENT
    ADMIN
    STAFF
    DEVELOPER

The authenticated user's ID is always used by the
recipient-facing endpoints.

============================================================
*/

/*
============================================================
GET USER NOTIFICATIONS
============================================================

GET /api/v1/notifications

Optional query parameters:

    ?unreadOnly=true
    ?limit=20

Examples:

    GET /api/v1/notifications

    GET /api/v1/notifications?unreadOnly=true

    GET /api/v1/notifications?limit=50

============================================================
*/

router.get("/", authenticate, getNotifications);

/*
============================================================
GET UNREAD COUNT
============================================================

GET /api/v1/notifications/unread-count

Returns:

{
    success: true,
    data: {
        count: 4
    }
}

============================================================
*/

router.get("/unread-count", authenticate, getUnreadCount);

/*
============================================================
MARK ALL AS READ
============================================================

PATCH /api/v1/notifications/read-all

Marks every unread notification belonging to the
authenticated user as read.

============================================================
*/

router.patch("/read-all", authenticate, markAllAsRead);

/*
============================================================
MARK SINGLE NOTIFICATION AS READ
============================================================

PATCH /api/v1/notifications/:id/read

Important:

The controller/service verifies that the notification
belongs to the authenticated user before updating it.

============================================================
*/

router.patch("/:id/read", authenticate, markNotificationAsRead);

/*
============================================================
DELETE SINGLE NOTIFICATION
============================================================

DELETE /api/v1/notifications/:id

Only the owner of the notification can delete it.

============================================================
*/

router.delete("/:id", authenticate, deleteNotification);

/*
============================================================
EXPORT
============================================================
*/

export default router;
