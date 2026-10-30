import { Router } from "express";

import assessmentController from "./assessment.controller.js";

import upload from "../../middleware/upload.js";

import authenticate from "../../middleware/auth.middleware.js";

import { allowRoles } from "../../middleware/role.middleware.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* CLIENT: SUBMIT ASSESSMENT                                                   */
/* -------------------------------------------------------------------------- */

/**
 * POST /api/v1/assessments
 *
 * Authentication: CLIENT
 *
 * Accepts:
 * - Assessment form fields
 * - Up to five supporting documents
 *
 * Workflow:
 * 1. Validate assessment information.
 * 2. Upload and process supporting documents.
 * 3. Create assessment record.
 * 4. Generate ₦50,000 assessment invoice.
 * 5. Return invoice details for payment initialization.
 *
 * Payment is initialized separately through:
 *
 * POST /api/v1/payments/initialize
 */
router.post(
  "/",
  authenticate,
  allowRoles("CLIENT"),
  upload.array("documents", 5),
  assessmentController.submitAssessment,
);

/* -------------------------------------------------------------------------- */
/* CLIENT: GET MY ASSESSMENTS                                                  */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/v1/assessments/my
 *
 * Authentication: CLIENT
 *
 * Returns assessments belonging to the authenticated client.
 */
router.get(
  "/my",
  authenticate,
  allowRoles("CLIENT"),
  assessmentController.getMyAssessments,
);

/* -------------------------------------------------------------------------- */
/* CLIENT: GET ONE ASSESSMENT                                                  */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/v1/assessments/my/:id
 *
 * Authentication: CLIENT
 *
 * Returns one assessment belonging to the authenticated client.
 */
router.get(
  "/my/:id",
  authenticate,
  allowRoles("CLIENT"),
  assessmentController.getMyAssessment,
);

/* -------------------------------------------------------------------------- */
/* ADMIN: LIST ASSESSMENTS                                                     */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/v1/assessments/admin
 *
 * Authentication: ADMIN, SUPER_ADMIN
 *
 * Returns submitted assessments for administrative review.
 */
router.get(
  "/admin",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.getAssessmentsForAdmin,
);

/* -------------------------------------------------------------------------- */
/* ADMIN: ACCESS ASSESSMENT DOCUMENT                                           */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/v1/assessments/admin/:id/documents/:documentId
 *
 * Authentication: ADMIN, SUPER_ADMIN
 *
 * Retrieves a specific supporting document associated with an assessment.
 */
router.get(
  "/admin/:id/documents/:documentId",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.accessAssessmentDocument,
);

/* -------------------------------------------------------------------------- */
/* ADMIN: UPDATE ASSESSMENT STATUS                                             */
/* -------------------------------------------------------------------------- */

/**
 * PATCH /api/v1/assessments/admin/:id/status
 *
 * Authentication: ADMIN, SUPER_ADMIN
 *
 * Updates the administrative review status.
 */
router.patch(
  "/admin/:id/status",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.updateAssessmentStatus,
);

/* -------------------------------------------------------------------------- */
/* ADMIN: UPDATE INTERNAL NOTES                                                */
/* -------------------------------------------------------------------------- */

/**
 * PATCH /api/v1/assessments/admin/:id/notes
 *
 * Authentication: ADMIN, SUPER_ADMIN
 *
 * Updates internal assessment review notes.
 */
router.patch(
  "/admin/:id/notes",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.updateAssessmentNotes,
);

/* -------------------------------------------------------------------------- */
/* ADMIN: GET ONE ASSESSMENT                                                   */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/v1/assessments/admin/:id
 *
 * Authentication: ADMIN, SUPER_ADMIN
 *
 * Returns complete assessment information for administrative review.
 */
router.get(
  "/admin/:id",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.getAssessmentForAdmin,
);

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default router;
