import express from "express";

import {
  createDocument,
  getDocuments,
  getApplicationDocuments,
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
*/

router.get("/", authenticate, getDocuments);

/*
|--------------------------------------------------------------------------
| Get Application Documents
|--------------------------------------------------------------------------
*/

router.get(
  "/application/:applicationId",
  authenticate,
  getApplicationDocuments,
);

/*
|--------------------------------------------------------------------------
| Update Document
|--------------------------------------------------------------------------
*/

router.patch("/:id", authenticate, updateDocumentStatus);

export default router;
