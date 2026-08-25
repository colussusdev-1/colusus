import express from "express";

import {
  getUpdates,
  getUnreadCount,
  markUpdateAsRead,
  markAllUpdatesAsRead,
} from "./update.controller.js";

import authenticate from "../../middleware/auth.middleware.js";

const router = express.Router();

/*
============================================================
GET CLIENT UPDATES
============================================================
|
| GET /api/v1/updates
|
============================================================
*/

router.get("/", authenticate, getUpdates);

/*
============================================================
GET UNREAD COUNT
============================================================
|
| IMPORTANT:
| This route MUST come before /:id/read.
|
============================================================
*/

router.get("/unread-count", authenticate, getUnreadCount);

/*
============================================================
MARK ALL AS READ
============================================================
*/

router.patch("/read-all", authenticate, markAllUpdatesAsRead);

/*
============================================================
MARK SINGLE UPDATE AS READ
============================================================
*/

router.patch("/:id/read", authenticate, markUpdateAsRead);

export default router;
