import staffService from "./staff.service.js";

/*
============================================================
colossus — STAFF CONTROLLER
============================================================

The controller is responsible for:

- Reading request data
- Calling the Staff service
- Returning HTTP responses
- Passing errors to the global error handler

Business logic belongs in:

    staff.service.js

Staff access is always based on:

    req.user.id

The Staff service verifies that the authenticated user
actually has the STAFF role and that applications being
accessed are assigned to that Staff member.

============================================================
*/

/*
============================================================
GET STAFF PROFILE
============================================================

GET /api/v1/staff/profile

Returns the authenticated Staff user's account information.

============================================================
*/

export const getStaffProfile = async (req, res, next) => {
  try {
    const staff = await staffService.getStaffProfile(req.user.id);

    return res.status(200).json({
      success: true,

      data: staff,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET STAFF DASHBOARD
============================================================

GET /api/v1/staff/dashboard

Returns:

- Assigned application count
- Application status counts
- Pending document count
- Recent assigned applications

============================================================
*/

export const getDashboard = async (req, res, next) => {
  try {
    const dashboard = await staffService.getDashboard(req.user.id);

    return res.status(200).json({
      success: true,

      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET ASSIGNED APPLICATIONS
============================================================

GET /api/v1/staff/applications

Optional query:

    ?page=1
    ?limit=20
    ?status=UNDER_REVIEW

============================================================
*/

export const getAssignedApplications = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;

    const result = await staffService.getAssignedApplications(
      req.user.id,

      {
        page,

        limit,

        status,
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
GET SINGLE ASSIGNED APPLICATION
============================================================

GET /api/v1/staff/applications/:id

A Staff member can only open an application assigned
to them.

============================================================
*/

export const getAssignedApplicationById = async (req, res, next) => {
  try {
    const application = await staffService.getAssignedApplicationById(
      req.params.id,

      req.user.id,
    );

    return res.status(200).json({
      success: true,

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
UPDATE APPLICATION STATUS
============================================================

PATCH /api/v1/staff/applications/:id/status

Body:

{
  "status": "UNDER_REVIEW",
  "notes": "Application is currently being reviewed."
}

============================================================
*/

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes = "" } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,

        message: "Application status is required.",
      });
    }

    const application = await staffService.updateApplicationStatus(
      req.params.id,

      status,

      notes,

      req.user.id,
    );

    return res.status(200).json({
      success: true,

      message: "Application status updated successfully.",

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET APPLICATION NOTES
============================================================

GET /api/v1/staff/applications/:id/notes

============================================================
*/

export const getApplicationNotes = async (req, res, next) => {
  try {
    const notes = await staffService.getApplicationNotes(
      req.params.id,

      req.user.id,
    );

    return res.status(200).json({
      success: true,

      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
ADD APPLICATION NOTE
============================================================

POST /api/v1/staff/applications/:id/notes

Body:

{
  "message": "Client needs to provide an updated bank statement."
}

============================================================
*/

export const addApplicationNote = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,

        message: "Note message is required.",
      });
    }

    const application = await staffService.addApplicationNote(
      req.params.id,

      message,

      req.user.id,
    );

    return res.status(201).json({
      success: true,

      message: "Internal note added successfully.",

      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET APPLICATION DOCUMENTS
============================================================

GET /api/v1/staff/applications/:id/documents

Returns documents belonging to an application assigned
to the authenticated Staff member.

============================================================
*/

export const getApplicationDocuments = async (req, res, next) => {
  try {
    const documents = await staffService.getApplicationDocuments(
      req.params.id,

      req.user.id,
    );

    return res.status(200).json({
      success: true,

      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
GET SINGLE DOCUMENT
============================================================

GET /api/v1/staff/documents/:id

============================================================
*/

export const getDocumentById = async (req, res, next) => {
  try {
    const document = await staffService.getDocumentById(
      req.params.id,

      req.user.id,
    );

    return res.status(200).json({
      success: true,

      data: document,
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
REVIEW DOCUMENT
============================================================

PATCH /api/v1/staff/documents/:id/review

Body:

{
  "status": "APPROVED",
  "reviewNote": "Document verified successfully."
}

Allowed statuses:

    UNDER_REVIEW
    APPROVED
    REJECTED
    REUPLOAD_REQUIRED

============================================================
*/

export const reviewDocument = async (req, res, next) => {
  try {
    const { status, reviewNote = "" } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,

        message: "Document review status is required.",
      });
    }

    const result = await staffService.reviewDocument(
      req.params.id,

      {
        status,

        reviewNote,
      },

      req.user.id,
    );

    return res.status(200).json({
      success: true,

      message: "Document review updated successfully.",

      data: {
        document: result.document,

        application: result.application,

        progress: result.progress,
      },
    });
  } catch (error) {
    next(error);
  }
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  /*
  ----------------------------------------------------------
  PROFILE
  ----------------------------------------------------------
  */

  getStaffProfile,

  /*
  ----------------------------------------------------------
  DASHBOARD
  ----------------------------------------------------------
  */

  getDashboard,

  /*
  ----------------------------------------------------------
  APPLICATIONS
  ----------------------------------------------------------
  */

  getAssignedApplications,

  getAssignedApplicationById,

  updateApplicationStatus,

  /*
  ----------------------------------------------------------
  NOTES
  ----------------------------------------------------------
  */

  getApplicationNotes,

  addApplicationNote,

  /*
  ----------------------------------------------------------
  DOCUMENTS
  ----------------------------------------------------------
  */

  getApplicationDocuments,

  getDocumentById,

  reviewDocument,
};
