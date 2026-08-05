import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
  getClientDashboard,
  getClientProfile,
  getClientApplications,
  getClientDocuments,
  getClientProgress,
  getApplicationTimeline,
  getClientDocumentOverview,
  getNotificationUnreadCount,
  markAllNotificationsAsRead,
  getNotificationSummary,
  getClientActivityFeed,
} from "./client.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Client Portal Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",

  authenticate,

  allowRoles("CLIENT"),

  getClientDashboard,
);

router.get(
  "/profile",

  authenticate,

  allowRoles("CLIENT"),

  getClientProfile,
);

router.get(
  "/applications",

  authenticate,

  allowRoles("CLIENT"),

  getClientApplications,
);

router.get(
  "/applications/:id/timeline",

  authenticate,

  allowRoles("CLIENT"),

  getApplicationTimeline,
);

router.get(
  "/documents/overview",

  authenticate,

  allowRoles("CLIENT"),

  getClientDocumentOverview,
);

router.get(
  "/documents",

  authenticate,

  allowRoles("CLIENT"),

  getClientDocuments,
);

router.get(
  "/progress",

  authenticate,

  allowRoles("CLIENT"),

  getClientProgress,
);

/*
|--------------------------------------------------------------------------
| Client Notification Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/notifications/unread-count",

  authenticate,

  allowRoles("CLIENT"),

  getNotificationUnreadCount,
);

router.patch(
  "/notifications/read-all",

  authenticate,

  allowRoles("CLIENT"),

  markAllNotificationsAsRead,
);

router.get(
  "/notifications/summary",

  authenticate,

  allowRoles("CLIENT"),

  getNotificationSummary,
);

router.get(
  "/activity",

  authenticate,

  allowRoles("CLIENT"),

  getClientActivityFeed,
);

export default router;
