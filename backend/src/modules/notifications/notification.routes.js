import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  createNotification,
} from "./notification.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Notification Routes
|--------------------------------------------------------------------------
*/

// Get logged-in user notifications

router.get(
  "/",

  authenticate,

  getNotifications,
);

router.post(
    "/",
    authenticate,
    createNotification
);

// Mark notification as read

router.patch(
  "/:id/read",

  authenticate,

  markNotificationAsRead,
);

// Delete notification

router.delete(
  "/:id",

  authenticate,

  deleteNotification,
);

export default router;
