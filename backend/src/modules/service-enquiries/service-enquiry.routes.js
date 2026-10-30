import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import { requirePermission } from "../staff/access/access.middleware.js";

import { PERMISSIONS } from "../staff/permissions/permission.constants.js";

import serviceEnquiryUpload from "./service-enquiry.upload.js";

import serviceEnquiryController from "./service-enquiry.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC SERVICE ENQUIRY SUBMISSION
|--------------------------------------------------------------------------
|
| POST /api/v1/service-enquiries
|
*/

router.post(
  "/",
  serviceEnquiryUpload,
  serviceEnquiryController.createSubmission,
);

/*
|--------------------------------------------------------------------------
| ALL SERVICE ENQUIRIES
|--------------------------------------------------------------------------
|
| GET /api/v1/service-enquiries
|
*/

router.get(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_VIEW),
  serviceEnquiryController.getSubmissions,
);

/*
|--------------------------------------------------------------------------
| VIEW SERVICE ENQUIRY DOCUMENT
|--------------------------------------------------------------------------
|
| GET /api/v1/service-enquiries/:id/documents/:documentId/view
|
*/

router.get(
  "/:id/documents/:documentId/view",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_DOCUMENTS_VIEW),
  serviceEnquiryController.viewDocument,
);

/*
|--------------------------------------------------------------------------
| SINGLE SERVICE ENQUIRY
|--------------------------------------------------------------------------
|
| GET /api/v1/service-enquiries/:id
|
*/

router.get(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_VIEW),
  serviceEnquiryController.getSubmissionById,
);

/*
|--------------------------------------------------------------------------
| UPDATE SERVICE ENQUIRY
|--------------------------------------------------------------------------
|
| PATCH /api/v1/service-enquiries/:id
|
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_UPDATE),
  serviceEnquiryController.updateSubmission,
);

export default router;
