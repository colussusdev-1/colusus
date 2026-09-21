import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import { allowRoles } from "../../middleware/role.middleware.js";

import clientRoutes from "./admin.client.routes.js";

import adminNotificationRoutes from "../admin-notifications/admin-notification.routes.js";

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
|--------------------------------------------------------------------------
| ADMIN DASHBOARD
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/dashboard
|
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
| ADMIN STAFF / ASSIGNMENT
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| GET ASSIGNABLE STAFF
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/staff
|
| Returns:
|
| - ADMIN users
| - STAFF users
|
| These users can be assigned to applications.
|
|--------------------------------------------------------------------------
*/

router.get(
  "/staff",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getAssignableStaff,
);


/*
|--------------------------------------------------------------------------
| ADMIN APPLICATION MANAGEMENT
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| GET ALL APPLICATIONS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/applications
|
|--------------------------------------------------------------------------
*/

router.get(
  "/applications",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getAllApplications,
);


/*
|--------------------------------------------------------------------------
| APPLICATION NOTES
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| These routes MUST come before:
|
| /applications/:id
|
| because :id is a dynamic parameter.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| GET APPLICATION INTERNAL NOTES
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/applications/:id/notes
|
|--------------------------------------------------------------------------
*/

router.get(
  "/applications/:id/notes",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getApplicationNotes,
);


/*
|--------------------------------------------------------------------------
| ADD APPLICATION INTERNAL NOTE
|--------------------------------------------------------------------------
|
| POST /api/v1/admin/applications/:id/notes
|
| Body:
|
| {
|   "message": "Client needs to provide an updated bank statement."
| }
|
|--------------------------------------------------------------------------
*/

router.post(
  "/applications/:id/notes",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  addApplicationNote,
);


/*
|--------------------------------------------------------------------------
| ASSIGN / REASSIGN APPLICATION
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/applications/:id/assignment
|
| Body:
|
| {
|   "staffId": "USER_OBJECT_ID"
| }
|
| To remove the current assignment:
|
| {
|   "staffId": null
| }
|
|--------------------------------------------------------------------------
*/

router.patch(
  "/applications/:id/assignment",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  assignApplication,
);


/*
|--------------------------------------------------------------------------
| GET SINGLE APPLICATION
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/applications/:id
|
|--------------------------------------------------------------------------
*/

router.get(
  "/applications/:id",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getApplicationById,
);


/*
|--------------------------------------------------------------------------
| UPDATE APPLICATION STATUS
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/applications/:id/status
|
| Body:
|
| {
|   "status": "PROCESSING",
|   "notes": "Application has moved into processing."
| }
|
|--------------------------------------------------------------------------
*/

router.patch(
  "/applications/:id/status",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  updateApplicationStatus,
);


/*
|--------------------------------------------------------------------------
| ADMIN DOCUMENT MANAGEMENT
|--------------------------------------------------------------------------
|
| These endpoints are completely separate from the client document
| routes.
|
| Client:
|
| /api/v1/documents/...
|
| Admin:
|
| /api/v1/admin/documents/...
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| GET ALL DOCUMENTS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents
|
|--------------------------------------------------------------------------
*/

router.get(
  "/documents",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getAllDocuments,
);


/*
|--------------------------------------------------------------------------
| GET DOCUMENTS FOR APPLICATION
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/application/:applicationId
|
| Used by:
|
| Admin Application Details
| → Documents tab
|
|--------------------------------------------------------------------------
*/

router.get(
  "/documents/application/:applicationId",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getApplicationDocuments,
);


/*
|--------------------------------------------------------------------------
| GET DOCUMENTS BY STATUS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/status/:status
|
| Example:
|
| /api/v1/admin/documents/status/APPROVED
|
| IMPORTANT:
|
| This must remain ABOVE:
|
| /documents/:id
|
|--------------------------------------------------------------------------
*/

router.get(
  "/documents/status/:status",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getDocumentsByStatus,
);


/*
|--------------------------------------------------------------------------
| GET SINGLE DOCUMENT
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/:id
|
|--------------------------------------------------------------------------
*/

router.get(
  "/documents/:id",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getDocumentById,
);


/*
|--------------------------------------------------------------------------
| UPDATE DOCUMENT STATUS
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/documents/:id/status
|
| Body:
|
| {
|   "status": "APPROVED",
|   "reviewNote": "Document verified successfully."
| }
|
|--------------------------------------------------------------------------
*/

router.patch(
  "/documents/:id/status",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  updateDocumentStatus,
);


/*
|--------------------------------------------------------------------------
| ADMIN NOTIFICATIONS
|--------------------------------------------------------------------------
|
| /api/v1/admin/notifications/...
|
| IMPORTANT:
|
| The notification router handles its own:
|
| - Authentication
| - ADMIN authorization
|
| Therefore we mount the router directly here.
|
| Supported endpoints:
|
| GET    /api/v1/admin/notifications
| GET    /api/v1/admin/notifications/unread-count
| PATCH  /api/v1/admin/notifications/read-all
| PATCH  /api/v1/admin/notifications/:id/read
| DELETE /api/v1/admin/notifications
| DELETE /api/v1/admin/notifications/:id
|
|--------------------------------------------------------------------------
*/

router.use(
  "/notifications",
  adminNotificationRoutes,
);


/*
|--------------------------------------------------------------------------
| ADMIN CLIENT MANAGEMENT
|--------------------------------------------------------------------------
|
| /api/v1/admin/clients/...
|
|--------------------------------------------------------------------------
*/

router.use(
  "/clients",
  clientRoutes,
);


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default router;