import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
  getDashboardStats,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} from "./admin.controller.js";

import {
  getAllDocuments,
  getDocumentById,
  updateDocumentStatus,
} from "./admin.document.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  getDashboardStats,
);

/*
|--------------------------------------------------------------------------
| Application Management
|--------------------------------------------------------------------------
*/

router.get(
  "/applications",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  getAllApplications,
);

router.get(
  "/applications/:id",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  getApplicationById,
);

router.patch(
  "/applications/:id/status",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  updateApplicationStatus,
);

/*
|--------------------------------------------------------------------------
| Document Management
|--------------------------------------------------------------------------
*/

router.get(
  "/documents",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  getAllDocuments,
);

router.get(
  "/documents/:id",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  getDocumentById,
);

router.patch(
  "/documents/:id/status",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  updateDocumentStatus,
);

export default router;
