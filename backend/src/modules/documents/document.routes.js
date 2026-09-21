import express from "express";

import {
  createDocument,
  getDocuments,
  getApplicationDocuments,
  getDocument,
  updateDocumentStatus,
} from "./document.controller.js";

import authenticate from "../../middleware/auth.middleware.js";

import upload from "../../middleware/upload.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| CREATE / UPLOAD DOCUMENT
|--------------------------------------------------------------------------
|
| POST /api/v1/documents
|
| Client sends multipart/form-data:
|
| file
| application
| name
| type
|
| The document service:
|
| - validates the application
| - verifies client ownership
| - uploads the file
| - creates the document
| - recalculates document progress
| - updates application journey state
| - creates relevant notifications
|
|--------------------------------------------------------------------------
*/

router.post("/", authenticate, upload.single("file"), createDocument);

/*
|--------------------------------------------------------------------------
| GET CLIENT DOCUMENTS
|--------------------------------------------------------------------------
|
| GET /api/v1/documents
|
| Returns all documents belonging to the authenticated client.
|
|--------------------------------------------------------------------------
*/

router.get("/", authenticate, getDocuments);

/*
|--------------------------------------------------------------------------
| GET APPLICATION DOCUMENTS
|--------------------------------------------------------------------------
|
| GET /api/v1/documents/application/:applicationId
|
| Returns documents belonging to the authenticated client's
| specific application.
|
| IMPORTANT:
|
| This is CLIENT-SCOPED.
|
| The document service verifies:
|
|   application.user === req.user.id
|
| Therefore this endpoint must NOT be used by the admin portal
| to retrieve another client's documents.
|
|--------------------------------------------------------------------------
*/

router.get(
  "/application/:applicationId",
  authenticate,
  getApplicationDocuments,
);

/*
|--------------------------------------------------------------------------
| GET SINGLE DOCUMENT
|--------------------------------------------------------------------------
|
| GET /api/v1/documents/:id
|
| Used by the Client Portal document viewer.
|
| The document service verifies that the document belongs
| to the authenticated client before returning it.
|
|--------------------------------------------------------------------------
*/

router.get("/:id", authenticate, getDocument);

/*
|--------------------------------------------------------------------------
| UPDATE CLIENT DOCUMENT
|--------------------------------------------------------------------------
|
| PATCH /api/v1/documents/:id
|
| This endpoint is client-scoped.
|
| The client cannot change review statuses.
|
| Allowed client-side changes are handled by the service.
|
| Staff/admin document review uses a separate endpoint.
|
|--------------------------------------------------------------------------
*/

router.patch("/:id", authenticate, updateDocumentStatus);

export default router;
