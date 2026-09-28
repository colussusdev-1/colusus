import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
  getAllDocuments,
  getApplicationDocuments,
  getDocumentById,
  viewDocument,
  updateDocumentStatus,
  getDocumentsByStatus,
} from "./admin.document.controller.js";

const router = express.Router();

/*
============================================================
ADMIN DOCUMENTS
============================================================
*/

/*
GET ALL DOCUMENTS
GET /api/v1/admin/documents
*/
router.get("/", authenticate, allowRoles("ADMIN", "STAFF"), getAllDocuments);

/*
GET APPLICATION DOCUMENTS
GET /api/v1/admin/documents/application/:applicationId
*/
router.get(
  "/application/:applicationId",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getApplicationDocuments,
);

/*
GET DOCUMENTS BY STATUS
GET /api/v1/admin/documents/status/:status
*/
router.get(
  "/status/:status",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  getDocumentsByStatus,
);

/*
VIEW / PREVIEW DOCUMENT
GET /api/v1/admin/documents/:id/view

IMPORTANT:
This route MUST come before "/:id".
*/
router.get(
  "/:id/view",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  viewDocument,
);

/*
GET SINGLE DOCUMENT
GET /api/v1/admin/documents/:id
*/
router.get("/:id", authenticate, allowRoles("ADMIN", "STAFF"), getDocumentById);

/*
UPDATE DOCUMENT STATUS
PATCH /api/v1/admin/documents/:id/status
*/
router.patch(
  "/:id/status",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  updateDocumentStatus,
);

export default router;
