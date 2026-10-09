import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import {
  getNotifications,
  getUnreadCountController,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteUserNotification,
  deleteUserNotifications,
} from "./notification.controller.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* AUTHENTICATION                                                             */
/* -------------------------------------------------------------------------- */

router.use(authenticate);

/* -------------------------------------------------------------------------- */
/* GET NOTIFICATIONS                                                          */
/* -------------------------------------------------------------------------- */

router.get("/", getNotifications);

/* -------------------------------------------------------------------------- */
/* GET UNREAD COUNT                                                           */
/* -------------------------------------------------------------------------- */

router.get("/unread-count", getUnreadCountController);

/* -------------------------------------------------------------------------- */
/* MARK AS READ                                                               */
/* -------------------------------------------------------------------------- */

// Keep this route before any generic ID-based routes.
router.patch("/read-all", markAllNotificationsAsRead);

router.patch("/:id/read", markNotificationAsRead);

/* -------------------------------------------------------------------------- */
/* DELETE NOTIFICATIONS                                                       */
/* -------------------------------------------------------------------------- */

router.delete("/", deleteUserNotifications);

router.delete("/:id", deleteUserNotification);

export default router;
