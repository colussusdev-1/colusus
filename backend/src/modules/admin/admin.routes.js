import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import clientRoutes from "./admin.client.routes.js";
import adminNotificationRoutes from "../admin-notifications/admin-notification.routes.js";
import adminOpportunityRoutes from "./admin.opportunity.routes.js";

import staffManagementRoutes from "../staff/management/staffManagement.routes.js";
import staffRoleRoutes from "../staff/roles/role.routes.js";
import departmentRoutes from "../staff/departments/department.routes.js";

import { requirePermission } from "../staff/access/access.middleware.js";
import { PERMISSIONS } from "../staff/permissions/permission.constants.js";

import {
  getDashboardStats,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getApplicationNotes,
  addApplicationNote,
  getAssignableStaff,
  assignApplication,
} from "./admin.controller.js";

import {
  getAllDocuments,
  getApplicationDocuments,
  getDocumentById,
  updateDocumentStatus,
  getDocumentsByStatus,
} from "./admin.document.controller.js";

const router = express.Router();

/*
============================================================
COLOSSUS — ADMIN ROUTES
============================================================

ADMIN users remain unrestricted through accessService.

STAFF users are controlled by granular permissions.

Existing STAFF assignment scoping remains inside the
application/service layer.

============================================================
*/

/*
============================================================
DASHBOARD
============================================================
*/

router.get(
  "/dashboard",
  authenticate,
  requirePermission(PERMISSIONS.DASHBOARD_VIEW),
  getDashboardStats,
);

/*
============================================================
ASSIGNABLE STAFF
============================================================
*/

router.get(
  "/staff",
  authenticate,
  requirePermission(PERMISSIONS.APPLICATIONS_ASSIGN),
  getAssignableStaff,
);

/*
============================================================
STAFF MANAGEMENT
============================================================

These remain separate ADMIN-only management areas.

============================================================
*/

router.use("/staff/manage", staffManagementRoutes);

router.use("/staff/roles", staffRoleRoutes);

router.use("/staff/departments", departmentRoutes);

/*
============================================================
APPLICATIONS
============================================================
*/

router.get(
  "/applications",
  authenticate,
  requirePermission(PERMISSIONS.APPLICATIONS_VIEW),
  getAllApplications,
);

router.get(
  "/applications/:id/notes",
  authenticate,
  requirePermission(PERMISSIONS.APPLICATIONS_NOTES_VIEW),
  getApplicationNotes,
);

router.post(
  "/applications/:id/notes",
  authenticate,
  requirePermission(PERMISSIONS.APPLICATIONS_NOTES_CREATE),
  addApplicationNote,
);

router.patch(
  "/applications/:id/assignment",
  authenticate,
  requirePermission(PERMISSIONS.APPLICATIONS_ASSIGN),
  assignApplication,
);

router.get(
  "/applications/:id",
  authenticate,
  requirePermission(PERMISSIONS.APPLICATIONS_VIEW),
  getApplicationById,
);

router.patch(
  "/applications/:id/status",
  authenticate,
  requirePermission(PERMISSIONS.APPLICATIONS_STATUS_UPDATE),
  updateApplicationStatus,
);

/*
============================================================
DOCUMENTS
============================================================
*/

router.get(
  "/documents",
  authenticate,
  requirePermission(PERMISSIONS.DOCUMENTS_VIEW),
  getAllDocuments,
);

router.get(
  "/documents/application/:applicationId",
  authenticate,
  requirePermission(PERMISSIONS.DOCUMENTS_VIEW),
  getApplicationDocuments,
);

router.get(
  "/documents/status/:status",
  authenticate,
  requirePermission(PERMISSIONS.DOCUMENTS_VIEW),
  getDocumentsByStatus,
);

router.get(
  "/documents/:id",
  authenticate,
  requirePermission(PERMISSIONS.DOCUMENTS_VIEW),
  getDocumentById,
);

router.patch(
  "/documents/:id/status",
  authenticate,
  requirePermission(PERMISSIONS.DOCUMENTS_REVIEW),
  updateDocumentStatus,
);

/*
============================================================
NOTIFICATIONS
============================================================
*/

router.use("/notifications", adminNotificationRoutes);

/*
============================================================
CLIENTS
============================================================
*/

router.use("/clients", clientRoutes);

/*
============================================================
OPPORTUNITIES
============================================================

Opportunity routes enforce their own granular permissions:

- opportunities.view
- opportunities.create
- opportunities.update
- opportunities.delete

============================================================
*/

router.use("/opportunities", adminOpportunityRoutes);

export default router;
