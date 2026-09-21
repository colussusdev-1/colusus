import staffFormSubmissionService from "./staffFormSubmission.service.js";

/*
============================================================
colossus — STAFF FORM SUBMISSION CONTROLLER
============================================================

Controller responsibilities:

- Read request data
- Call Staff FormSubmission service
- Return HTTP responses
- Pass errors to global error handler

Business logic remains inside:

    staffFormSubmission.service.js
============================================================
*/

/*
============================================================
GET ASSIGNED FORM SUBMISSIONS
============================================================

GET /api/v1/staff/form-submissions
============================================================
*/

export const getAssignedFormSubmissions = async (req, res, next) => {
  try {
    const { page, limit, status, formKey } = req.query;

    const result = await staffFormSubmissionService.getAssignedFormSubmissions(
      req.user.id,
      {
        page,
        limit,
        status,
        formKey,
      },
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET SINGLE ASSIGNED FORM SUBMISSION
============================================================

GET /api/v1/staff/form-submissions/:id
============================================================
*/

export const getAssignedFormSubmissionById = async (req, res, next) => {
  try {
    const submission =
      await staffFormSubmissionService.getAssignedFormSubmissionById(
        req.params.id,
        req.user.id,
      );

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
UPDATE FORM SUBMISSION
============================================================

PATCH /api/v1/staff/form-submissions/:id

Body:

{
  "status": "REVIEWING"
}

or:

{
  "note": "Client needs to provide additional information."
}

or both.
============================================================
*/

export const updateFormSubmission = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const submission = await staffFormSubmissionService.updateFormSubmission(
      req.params.id,
      {
        status,
        note,
      },
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Form submission updated successfully.",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
ADD INTERNAL NOTE
============================================================

POST /api/v1/staff/form-submissions/:id/notes

Body:

{
  "message": "Follow up with applicant."
}
============================================================
*/

export const addFormSubmissionNote = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "Note message is required.",
      });
    }

    const submission = await staffFormSubmissionService.addFormSubmissionNote(
      req.params.id,
      message,
      req.user.id,
    );

    return res.status(201).json({
      success: true,
      message: "Internal note added successfully.",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
VIEW FORM SUBMISSION DOCUMENT
============================================================

GET
/api/v1/staff/form-submissions/:submissionId/documents/:documentId/view
============================================================
*/

export const viewFormSubmissionDocument = async (req, res, next) => {
  try {
    const document =
      await staffFormSubmissionService.viewFormSubmissionDocument(
        req.params.submissionId,
        req.params.documentId,
        req.user.id,
      );

    res.setHeader("Content-Type", document.contentType);

    res.setHeader("Content-Length", document.contentLength);

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${document.fileName}"`,
    );

    res.setHeader(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate",
    );

    return res.send(document.buffer);
  } catch (error) {
    next(error);
  }
};

export default {
  getAssignedFormSubmissions,
  getAssignedFormSubmissionById,
  updateFormSubmission,
  addFormSubmissionNote,
  viewFormSubmissionDocument,
};
