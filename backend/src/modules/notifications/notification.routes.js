import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "./notification.controller.js";

const router = express.Router();

/*
============================================================
colossus — NOTIFICATION ROUTES
============================================================

Recipient-facing notification endpoints.

ALL routes are protected by authentication.

The authenticated user's ID determines the notification
recipient.

Notification creation is intentionally NOT exposed here.

System notifications must be created internally through:

    notificationService.createNotification()

or one of the trusted targeting helpers:

    notificationService.createForUser()

    notificationService.createForUsers()

    notificationService.createForRoles()

    notificationService.createForApplicationOwner()

SUPPORTED RECIPIENTS:

    CLIENT
    ADMIN
    STAFF
    DEVELOPER

============================================================
*/

/*
============================================================
GET USER NOTIFICATIONS
============================================================

GET /api/v1/notifications

QUERY:

    ?page=1
    ?limit=30
    ?unreadOnly=true

Examples:

    GET /api/v1/notifications

    GET /api/v1/notifications?page=1&limit=30

    GET /api/v1/notifications?unreadOnly=true

    GET /api/v1/notifications?page=2&limit=20&unreadOnly=true

============================================================
*/

router.get("/", authenticate, getNotifications);

/*
============================================================
GET UNREAD COUNT
============================================================

GET /api/v1/notifications/unread-count

Response:

{
    "success": true,
    "data": {
        "count": 4
    }
}

IMPORTANT:

This route is intentionally declared BEFORE /:id routes.

============================================================
*/

router.get("/unread-count", authenticate, getUnreadCount);

/*
============================================================
MARK ALL NOTIFICATIONS AS READ
============================================================

PATCH /api/v1/notifications/read-all

Marks every unread notification belonging to the
authenticated user as read.

Response:

{
    "success": true,
    "message": "All notifications marked as read.",
    "data": {
        "success": true,
        "modifiedCount": 4
    }
}

IMPORTANT:

This route is declared BEFORE /:id/read.

============================================================
*/

router.patch("/read-all", authenticate, markAllAsRead);

/*
============================================================
DELETE ALL NOTIFICATIONS
============================================================

DELETE /api/v1/notifications

Deletes every notification belonging to the
authenticated user.

This does NOT affect:

    - Other clients
    - Admins
    - Staff
    - Developers

The service scopes deletion using req.user.id.

Response:

{
    "success": true,
    "message": "All notifications deleted successfully.",
    "data": {
        "success": true,
        "deletedCount": 12
    }
}

IMPORTANT:

This route uses "/" with DELETE.

It does NOT conflict with:

    DELETE /:id

because Express matches the HTTP method as well.

============================================================
*/

router.delete("/", authenticate, deleteAllNotifications);

/*
============================================================
MARK SINGLE NOTIFICATION AS READ
============================================================

PATCH /api/v1/notifications/:id/read

The notification service verifies ownership using:

    notification.user === req.user.id

Therefore a user cannot mark another user's notification
as read by supplying its ID.

============================================================
*/

router.patch("/:id/read", authenticate, markNotificationAsRead);

/*
============================================================
DELETE SINGLE NOTIFICATION
============================================================

DELETE /api/v1/notifications/:id

Only the authenticated owner of the notification can
delete it.

============================================================
*/

router.delete("/:id", authenticate, deleteNotification);

/*
============================================================
EXPORT
============================================================
*/

export default router;
