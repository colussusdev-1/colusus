import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
  getStaffProfile,
  getDashboard,
  getAssignedApplications,
  getAssignedApplicationById,
  updateApplicationStatus,
  getApplicationNotes,
  addApplicationNote,
  getApplicationDocuments,
  getDocumentById,
  reviewDocument,
} from "./staff.controller.js";

import {
  getAssignedFormSubmissions,
  getAssignedFormSubmissionById,
  updateFormSubmission,
  addFormSubmissionNote,
  viewFormSubmissionDocument,
} from "./staffFormSubmission.controller.js";

const router = express.Router();

/*
============================================================
colossus — STAFF ROUTES
============================================================

All Staff routes are protected by:

    authenticate
    allowRoles("STAFF")

IMPORTANT:

Staff access is intentionally separate from the Admin API.

Admin:
    /api/v1/admin/...

Staff:
    /api/v1/staff/...

A Staff member can only work with resources assigned
to them. Ownership / assignment checks are handled
server-side inside the relevant Staff services.

============================================================
STAFF AUTHORIZATION
============================================================
*/

router.use(authenticate, allowRoles("STAFF"));

/*
============================================================
STAFF PROFILE
============================================================
*/

/*
GET /api/v1/staff/profile

Returns the authenticated Staff account.
*/

router.get("/profile", getStaffProfile);

/*
============================================================
STAFF DASHBOARD
============================================================
*/

/*
GET /api/v1/staff/dashboard

Returns Staff-specific operational statistics.
*/

router.get("/dashboard", getDashboard);

/*
============================================================
STAFF FORM SUBMISSIONS
============================================================

These routes are separate from the existing Application
workflow.

FormSubmission:

    Public Form
        ↓
    FormSubmission
        ↓
    Admin assignment
        ↓
    Staff review

A Staff member can only access FormSubmissions assigned
to that Staff member.

============================================================
*/

/*
GET /api/v1/staff/form-submissions

Optional query parameters:

    ?page=1
    ?limit=20
    ?status=NEW
    ?formKey=ireland-nursing-healthcare
*/

router.get("/form-submissions", getAssignedFormSubmissions);

/*
GET /api/v1/staff/form-submissions/:id

Returns a single FormSubmission assigned to the
authenticated Staff member.
*/

router.get("/form-submissions/:id", getAssignedFormSubmissionById);

/*
PATCH /api/v1/staff/form-submissions/:id

Body:

{
  "status": "REVIEWING"
}

or:

{
  "note": "Follow up with applicant."
}

or both.
*/

router.patch("/form-submissions/:id", updateFormSubmission);

/*
POST /api/v1/staff/form-submissions/:id/notes

Body:

{
  "message": "Applicant needs to provide additional information."
}
*/

router.post("/form-submissions/:id/notes", addFormSubmissionNote);

/*
GET
/api/v1/staff/form-submissions/:submissionId/documents/:documentId/view

Secure document viewer.

The Staff FormSubmission service verifies that the
submission belongs to the authenticated Staff member
before retrieving the document.
*/

router.get(
  "/form-submissions/:submissionId/documents/:documentId/view",
  viewFormSubmissionDocument,
);

/*
============================================================
STAFF APPLICATIONS
============================================================
*/

/*
GET /api/v1/staff/applications

Optional query parameters:

    ?page=1
    ?limit=20
    ?status=UNDER_REVIEW
*/

router.get("/applications", getAssignedApplications);

/*
============================================================
APPLICATION NOTES
============================================================

IMPORTANT:

These routes must remain above:

    /applications/:id

because :id is a dynamic parameter.
*/

/*
GET /api/v1/staff/applications/:id/notes
*/

router.get("/applications/:id/notes", getApplicationNotes);

/*
POST /api/v1/staff/applications/:id/notes

Body:

{
  "message": "Client needs to provide an updated bank statement."
}
*/

router.post("/applications/:id/notes", addApplicationNote);

/*
============================================================
APPLICATION DOCUMENTS
============================================================
*/

/*
GET /api/v1/staff/applications/:id/documents

Returns documents for an application assigned to the
authenticated Staff member.
*/

router.get("/applications/:id/documents", getApplicationDocuments);

/*
============================================================
UPDATE APPLICATION STATUS
============================================================
*/

/*
PATCH /api/v1/staff/applications/:id/status

Body:

{
  "status": "UNDER_REVIEW",
  "notes": "Application is currently being reviewed."
}
*/

router.patch("/applications/:id/status", updateApplicationStatus);

/*
============================================================
GET SINGLE APPLICATION
============================================================
*/

/*
GET /api/v1/staff/applications/:id
*/

router.get("/applications/:id", getAssignedApplicationById);

/*
============================================================
STAFF DOCUMENTS
============================================================
*/

/*
GET /api/v1/staff/documents/:id

Returns a single document belonging to an application
assigned to the authenticated Staff member.
*/

router.get("/documents/:id", getDocumentById);

/*
============================================================
REVIEW DOCUMENT
============================================================
*/

/*
PATCH /api/v1/staff/documents/:id/review

Body:

{
  "status": "APPROVED",
  "reviewNote": "Document verified successfully."
}

Supported review statuses are validated by the
Staff service.
*/

router.patch("/documents/:id/review", reviewDocument);

/*
============================================================
EXPORT
============================================================
*/

export default router;
