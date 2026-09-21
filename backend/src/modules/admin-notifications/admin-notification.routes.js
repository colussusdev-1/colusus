import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { authorize } from "../../middleware/role.middleware.js";

import {
  getAdminNotifications,
  getAdminUnreadCount,
  markAdminNotificationAsRead,
  markAllAdminNotificationsAsRead,
  deleteAdminNotification,
  deleteAllAdminNotifications,
} from "./admin-notification.controller.js";

const router = express.Router();

/*
============================================================
colossus — ADMIN NOTIFICATIONS
============================================================

Admin-only notification operations.

All routes require:

1. Authentication
2. ADMIN role

Notification creation remains internal to the backend.

============================================================
*/

/*
============================================================
ADMIN AUTHORIZATION
============================================================

Every notification route below requires:

    authenticate
    authorize("ADMIN")

============================================================
*/

router.use(authenticate, authorize("ADMIN"));

/*
============================================================
GET ADMIN NOTIFICATIONS
============================================================

GET /api/v1/admin/notifications

QUERY:

    ?page=1
    ?limit=30
    ?unreadOnly=true

============================================================
*/

router.get("/", getAdminNotifications);

/*
============================================================
GET ADMIN UNREAD COUNT
============================================================

GET /api/v1/admin/notifications/unread-count

============================================================
*/

router.get("/unread-count", getAdminUnreadCount);

/*
============================================================
MARK ALL ADMIN NOTIFICATIONS AS READ
============================================================

PATCH /api/v1/admin/notifications/read-all

============================================================
*/

router.patch("/read-all", markAllAdminNotificationsAsRead);

/*
============================================================
DELETE ALL ADMIN NOTIFICATIONS
============================================================

DELETE /api/v1/admin/notifications

Removes notifications within the admin notification scope.

The service determines the exact database scope.

============================================================
*/

router.delete("/", deleteAllAdminNotifications);

/*
============================================================
MARK ONE ADMIN NOTIFICATION AS READ
============================================================

PATCH /api/v1/admin/notifications/:id/read

============================================================
*/

router.patch("/:id/read", markAdminNotificationAsRead);

/*
============================================================
DELETE ONE ADMIN NOTIFICATION
============================================================

DELETE /api/v1/admin/notifications/:id

============================================================
*/

router.delete("/:id", deleteAdminNotification);

/*
============================================================
EXPORT
============================================================
*/

export default router;
