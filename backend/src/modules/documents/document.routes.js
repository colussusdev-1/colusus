import express from "express";

import {
  createDocument,
  getDocuments,
  getApplicationDocuments,
  getDocument,
  viewDocument,
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
|--------------------------------------------------------------------------
*/

router.get(
  "/application/:applicationId",
  authenticate,
  getApplicationDocuments,
);

/*
|--------------------------------------------------------------------------
| VIEW / STREAM DOCUMENT
|--------------------------------------------------------------------------
|
| GET /api/v1/documents/:id/view
|
| Streams the document through the backend.
|
| The backend:
|
| - authenticates the client
| - verifies document ownership
| - retrieves the Cloudinary file
| - streams it to the browser
| - sets Content-Disposition to inline
|
| This allows PDFs to render inside the browser instead of
| forcing the Cloudinary raw asset to download.
|
| IMPORTANT:
|
| This route MUST appear before /:id.
|
|--------------------------------------------------------------------------
*/

router.get("/:id/view", authenticate, viewDocument);

/*
|--------------------------------------------------------------------------
| GET SINGLE DOCUMENT
|--------------------------------------------------------------------------
|
| GET /api/v1/documents/:id
|
| Returns document metadata.
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
|--------------------------------------------------------------------------
*/

router.patch("/:id", authenticate, updateDocumentStatus);

export default router;
