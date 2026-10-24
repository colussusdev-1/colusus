import { Router } from "express";

import assessmentController from "./assessment.controller.js";
import upload from "../../middleware/upload.js";
import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| PUBLIC: SUBMIT ASSESSMENT
|--------------------------------------------------------------------------
| POST /api/v1/assessments
|
| Candidates can submit assessments before registering.
| Accepts multipart/form-data with up to five documents.
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  upload.array("documents", 5),
  assessmentController.submitAssessment,
);

/*
|--------------------------------------------------------------------------
| ADMIN: LIST ASSESSMENTS
|--------------------------------------------------------------------------
| GET /api/v1/assessments/admin
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.getAssessmentsForAdmin,
);

/*
|--------------------------------------------------------------------------
| ADMIN: ACCESS ASSESSMENT DOCUMENT
|--------------------------------------------------------------------------
| GET /api/v1/assessments/admin/:id/documents/:documentId
|
| Preview:
| GET /api/v1/assessments/admin/:id/documents/:documentId
|
| Download:
| GET /api/v1/assessments/admin/:id/documents/:documentId?download=1
|
| Authentication and role authorization are required.
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/:id/documents/:documentId",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.accessAssessmentDocument,
);

/*
|--------------------------------------------------------------------------
| ADMIN: UPDATE ASSESSMENT STATUS
|--------------------------------------------------------------------------
| PATCH /api/v1/assessments/admin/:id/status
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/status",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.updateAssessmentStatus,
);

/*
|--------------------------------------------------------------------------
| ADMIN: UPDATE INTERNAL NOTES
|--------------------------------------------------------------------------
| PATCH /api/v1/assessments/admin/:id/notes
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id/notes",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.updateAssessmentNotes,
);

/*
|--------------------------------------------------------------------------
| ADMIN: GET ASSESSMENT DETAILS
|--------------------------------------------------------------------------
| GET /api/v1/assessments/admin/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/:id",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.getAssessmentForAdmin,
);

export default router;
