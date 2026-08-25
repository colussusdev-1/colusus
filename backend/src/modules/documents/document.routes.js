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
| Create / Upload Document
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
|--------------------------------------------------------------------------
*/

router.post("/", authenticate, upload.single("file"), createDocument);

/*
|--------------------------------------------------------------------------
| Get Client Documents
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
| Get Application Documents
|--------------------------------------------------------------------------
|
| GET /api/v1/documents/application/:applicationId
|
| Returns only documents belonging to the authenticated client's
| specific application.
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
| Get Single Document
|--------------------------------------------------------------------------
|
| GET /api/v1/documents/:id
|
| Used by the Client Portal document viewer.
|
| The document service verifies ownership before returning it.
|
|--------------------------------------------------------------------------
*/

router.get("/:id", authenticate, getDocument);

/*
|--------------------------------------------------------------------------
| Update Document
|--------------------------------------------------------------------------
|
| PATCH /api/v1/documents/:id
|
|--------------------------------------------------------------------------
*/

router.patch("/:id", authenticate, updateDocumentStatus);

export default router;
