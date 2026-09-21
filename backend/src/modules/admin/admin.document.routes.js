import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import { allowRoles } from "../../middleware/role.middleware.js";

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
| GET ALL ADMIN DOCUMENTS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents
|
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  getAllDocuments,
);

/*
|--------------------------------------------------------------------------
| GET APPLICATION DOCUMENTS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/documents/application/:applicationId
|
| Used by the Application Details Documents tab.
|
|--------------------------------------------------------------------------
*/

router.get(
  "/application/:applicationId",

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
|--------------------------------------------------------------------------
*/

router.get(
  "/status/:status",

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
  "/:id",

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
  "/:id/status",

  authenticate,

  allowRoles("ADMIN", "STAFF"),

  updateDocumentStatus,
);

export default router;
