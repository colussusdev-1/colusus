import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import formSubmissionController from "./form-submission.controller.js";

const router = express.Router();

router.post("/", formSubmissionController.createSubmission);

router.get(
  "/forms",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  formSubmissionController.getForms,
);

router.get(
  "/",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  formSubmissionController.getSubmissions,
);

router.get(
  "/:submissionId/documents/:documentId/view",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  formSubmissionController.viewDocument,
);

router.get(
  "/:id",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  formSubmissionController.getSubmissionById,
);

router.patch(
  "/:id",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  formSubmissionController.updateSubmission,
);

export default router;
