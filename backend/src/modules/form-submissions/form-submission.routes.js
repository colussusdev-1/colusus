import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import { requirePermission } from "../staff/access/access.middleware.js";

import { PERMISSIONS } from "../staff/permissions/permission.constants.js";

import formSubmissionController from "./form-submission.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC FORM SUBMISSION
|--------------------------------------------------------------------------
|
| POST /api/v1/form-submissions
|
| Website visitors can submit forms without authentication.
|
|--------------------------------------------------------------------------
*/

router.post("/", formSubmissionController.createSubmission);

/*
|--------------------------------------------------------------------------
| FORM TYPES
|--------------------------------------------------------------------------
|
| GET /api/v1/form-submissions/forms
|
| Requires:
|
|     forms.view
|
|--------------------------------------------------------------------------
*/

router.get(
  "/forms",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_VIEW),
  formSubmissionController.getForms,
);

/*
|--------------------------------------------------------------------------
| ALL FORM SUBMISSIONS
|--------------------------------------------------------------------------
|
| GET /api/v1/form-submissions
|
| Requires:
|
|     forms.view
|
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_VIEW),
  formSubmissionController.getSubmissions,
);

/*
|--------------------------------------------------------------------------
| VIEW SUBMISSION DOCUMENT
|--------------------------------------------------------------------------
|
| GET /api/v1/form-submissions/:submissionId/documents/:documentId/view
|
| Requires:
|
|     forms.documents.view
|
|--------------------------------------------------------------------------
*/

router.get(
  "/:submissionId/documents/:documentId/view",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_DOCUMENTS_VIEW),
  formSubmissionController.viewDocument,
);

/*
|--------------------------------------------------------------------------
| SINGLE FORM SUBMISSION
|--------------------------------------------------------------------------
|
| GET /api/v1/form-submissions/:id
|
| Requires:
|
|     forms.view
|
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_VIEW),
  formSubmissionController.getSubmissionById,
);

/*
|--------------------------------------------------------------------------
| UPDATE FORM SUBMISSION
|--------------------------------------------------------------------------
|
| PATCH /api/v1/form-submissions/:id
|
| Requires:
|
|     forms.update
|
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_UPDATE),
  formSubmissionController.updateSubmission,
);

export default router;
