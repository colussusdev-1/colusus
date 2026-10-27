import { Router } from "express";

import assessmentController from "./assessment.controller.js";
import upload from "../../middleware/upload.js";
import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  allowRoles("CLIENT"),
  upload.array("documents", 5),
  assessmentController.submitAssessment,
);

router.get(
  "/my",
  authenticate,
  allowRoles("CLIENT"),
  assessmentController.getMyAssessments,
);

router.get(
  "/my/:id",
  authenticate,
  allowRoles("CLIENT"),
  assessmentController.getMyAssessment,
);

router.get(
  "/admin",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.getAssessmentsForAdmin,
);

router.get(
  "/admin/:id/documents/:documentId",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.accessAssessmentDocument,
);

router.patch(
  "/admin/:id/status",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.updateAssessmentStatus,
);

router.patch(
  "/admin/:id/notes",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.updateAssessmentNotes,
);

router.get(
  "/admin/:id",
  authenticate,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  assessmentController.getAssessmentForAdmin,
);

export default router;
