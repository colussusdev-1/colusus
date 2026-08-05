import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import clientRoutes from "./admin.client.routes.js";

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
  getDocumentsByStatus,
} from "./admin.document.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Dashboard
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
| Admin Application Management
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
| Admin Document Management
|--------------------------------------------------------------------------
*/

// Get all documents

router.get(
  "/documents",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  getAllDocuments,
);

// Get document by id

router.get(
  "/documents/:id",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  getDocumentById,
);

// Filter documents by status
//
// Example:
// GET /api/v1/admin/documents/status/APPROVED

router.get(
  "/documents/status/:status",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  getDocumentsByStatus,
);

// Update document status

router.patch(
  "/documents/:id/status",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  updateDocumentStatus,
);

/*
|--------------------------------------------------------------------------
| Admin Client Management
|--------------------------------------------------------------------------
*/

router.use(
  "/clients",

  clientRoutes,
);

export default router;
