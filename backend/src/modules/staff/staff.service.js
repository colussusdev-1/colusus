import mongoose from "mongoose";

import User from "../users/user.model.js";
import Application from "../applications/application.model.js";
import Document from "../documents/document.model.js";

import documentService from "../documents/document.service.js";
import workflowService from "../workflows/workflow.service.js";

import {
  STAFF_ROLE,
  APPLICATION_STATUSES,
  DOCUMENT_REVIEW_ACTIONS,
  normalizeStatus,
  normalizePagination,
  isValidApplicationStatus,
  STAFF_ERRORS,
  DEFAULT_SORT,
  RECENT_APPLICATION_LIMIT,
} from "./staff.constants.js";

import staffFormSubmissionService from "./staffFormSubmission.service.js";

/*
============================================================
colossus — STAFF SERVICE
============================================================

Staff operational service.

RESPONSIBILITIES:

- Staff profile
- Staff dashboard
- Assigned applications
- Application details
- Application status updates
- Internal notes
- Application documents
- Individual document access
- Document review

FORM SUBMISSION RESPONSIBILITIES:

- Staff dashboard FormSubmission summary
- FormSubmission assignment access
- FormSubmission workflow is handled by:
    staffFormSubmission.service.js

IMPORTANT SECURITY RULE:

A Staff member can ONLY operate on an application where:

    application.assignedTo === staffId

This rule is enforced server-side.

The frontend is NEVER trusted to enforce Staff ownership.

ADMIN RESPONSIBILITIES:

- View all applications
- Assign applications
- Reassign applications
- Unassign applications
- Manage Staff
- Broader operational oversight

WORKFLOW RESPONSIBILITY:

This service does NOT duplicate the notification system.

Existing services remain responsible for:

- Application workflow
- Application progress
- Document progress
- Client notifications
- Admin/Staff notifications

Notifications are intentionally NOT handled here.
============================================================
*/

/*
============================================================
STAFF DOCUMENT REVIEW STATUSES
============================================================

IMPORTANT:

UPLOADED is an existing document state, but it is NOT an
action Staff should actively select from the review UI.

Staff review actions are limited to:

    UNDER_REVIEW
    APPROVED
    REJECTED
    REUPLOAD_REQUIRED

============================================================
*/

const STAFF_DOCUMENT_REVIEW_STATUSES = [
  DOCUMENT_REVIEW_ACTIONS.UNDER_REVIEW,

  DOCUMENT_REVIEW_ACTIONS.APPROVED,

  DOCUMENT_REVIEW_ACTIONS.REJECTED,

  DOCUMENT_REVIEW_ACTIONS.REUPLOAD_REQUIRED,
];

/*
============================================================
CREATE SERVICE ERROR
============================================================
*/

const createError = (message, statusCode = 400) => {
  const error = new Error(message);

  error.statusCode = statusCode;

  return error;
};

/*
============================================================
VALIDATE OBJECT ID
============================================================
*/

const validateObjectId = (id, message = "Invalid ID.") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError(message, 400);
  }

  return id;
};

/*
============================================================
VALIDATE STAFF
============================================================

Confirms:

- account exists
- account is active
- role is STAFF

============================================================
*/

const validateStaff = async (staffId) => {
  validateObjectId(staffId, STAFF_ERRORS.STAFF_NOT_FOUND);

  const staff = await User.findOne({
    _id: staffId,

    role: STAFF_ROLE,

    isActive: true,
  }).select("_id name email role");

  if (!staff) {
    throw createError(STAFF_ERRORS.STAFF_ACCESS_DENIED, 403);
  }

  return staff;
};

/*
============================================================
GET ASSIGNED APPLICATION
============================================================

SECURITY-CRITICAL METHOD.

Every Staff application operation should eventually pass
through this method.

A Staff member cannot access an application assigned to
another Staff member.

============================================================
*/

const getAssignedApplication = async (applicationId, staffId) => {
  validateObjectId(applicationId, STAFF_ERRORS.APPLICATION_NOT_FOUND);

  validateObjectId(staffId, STAFF_ERRORS.STAFF_NOT_FOUND);

  const application = await Application.findOne({
    _id: applicationId,

    assignedTo: staffId,
  });

  if (!application) {
    /*
    --------------------------------------------------------
    APPLICATION DOES NOT EXIST
    --------------------------------------------------------
    */

    const exists = await Application.exists({
      _id: applicationId,
    });

    if (!exists) {
      throw createError(STAFF_ERRORS.APPLICATION_NOT_FOUND, 404);
    }

    /*
    --------------------------------------------------------
    APPLICATION EXISTS BUT IS NOT ASSIGNED TO THIS STAFF
    --------------------------------------------------------
    */

    throw createError(STAFF_ERRORS.APPLICATION_NOT_ASSIGNED, 403);
  }

  return application;
};

/*
============================================================
POPULATE APPLICATION
============================================================
*/

const populateApplication = (query) => {
  return query
    .populate("user", "name email")
    .populate("assignedTo", "name email role")
    .populate("internalNotes.createdBy", "name email")
    .populate("lastUpdatedBy", "name email");
};

/*
============================================================
GET STAFF PROFILE
============================================================

GET /api/v1/staff/profile

============================================================
*/

const getStaffProfile = async (staffId) => {
  return validateStaff(staffId);
};

/*
============================================================
GET STAFF DASHBOARD
============================================================

All dashboard statistics are scoped to the authenticated
Staff member.

The dashboard contains:

- Application statistics
- Document statistics
- Recent applications
- FormSubmission statistics

FormSubmission statistics are delegated to:

    staffFormSubmission.service.js

Notifications are intentionally not handled here.

============================================================
*/

const getDashboard = async (staffId) => {
  await validateStaff(staffId);

  /*
  ----------------------------------------------------------
  FIND ASSIGNED APPLICATION IDS
  ----------------------------------------------------------
  */

  const assignedApplicationIds = await Application.find({
    assignedTo: staffId,
  }).distinct("_id");

  /*
  ----------------------------------------------------------
  DASHBOARD QUERIES
  ----------------------------------------------------------
  */

  const [
    totalAssigned,

    submitted,

    underReview,

    documentRequest,

    processing,

    approved,

    rejected,

    pendingDocuments,

    recentApplications,

    formSubmissions,
  ] = await Promise.all([
    /*
    --------------------------------------------------------
    TOTAL ASSIGNED
    --------------------------------------------------------
    */

    Application.countDocuments({
      assignedTo: staffId,
    }),

    /*
    --------------------------------------------------------
    SUBMITTED
    --------------------------------------------------------
    */

    Application.countDocuments({
      assignedTo: staffId,

      status: "SUBMITTED",
    }),

    /*
    --------------------------------------------------------
    UNDER REVIEW
    --------------------------------------------------------
    */

    Application.countDocuments({
      assignedTo: staffId,

      status: "UNDER_REVIEW",
    }),

    /*
    --------------------------------------------------------
    DOCUMENT REQUEST
    --------------------------------------------------------
    */

    Application.countDocuments({
      assignedTo: staffId,

      status: "DOCUMENT_REQUEST",
    }),

    /*
    --------------------------------------------------------
    PROCESSING
    --------------------------------------------------------
    */

    Application.countDocuments({
      assignedTo: staffId,

      status: "PROCESSING",
    }),

    /*
    --------------------------------------------------------
    APPROVED
    --------------------------------------------------------
    */

    Application.countDocuments({
      assignedTo: staffId,

      status: "APPROVED",
    }),

    /*
    --------------------------------------------------------
    REJECTED
    --------------------------------------------------------
    */

    Application.countDocuments({
      assignedTo: staffId,

      status: "REJECTED",
    }),

    /*
    --------------------------------------------------------
    PENDING DOCUMENTS
    --------------------------------------------------------
    */

    assignedApplicationIds.length
      ? Document.countDocuments({
          application: {
            $in: assignedApplicationIds,
          },

          status: {
            $in: ["UPLOADED", "UNDER_REVIEW"],
          },
        })
      : 0,

    /*
    --------------------------------------------------------
    RECENT APPLICATIONS
    --------------------------------------------------------
    */

    populateApplication(
      Application.find({
        assignedTo: staffId,
      })
        .sort(DEFAULT_SORT)
        .limit(RECENT_APPLICATION_LIMIT),
    ),

    /*
    --------------------------------------------------------
    FORM SUBMISSIONS
    --------------------------------------------------------
    */

    staffFormSubmissionService.getDashboardSummary(staffId),
  ]);

  /*
  ----------------------------------------------------------
  RETURN STAFF DASHBOARD
  ----------------------------------------------------------
  */

  return {
    staff: {
      id: staffId,
    },

    /*
    --------------------------------------------------------
    APPLICATIONS
    --------------------------------------------------------
    */

    applications: {
      total: totalAssigned,

      submitted,

      underReview,

      documentRequest,

      processing,

      approved,

      rejected,
    },

    /*
    --------------------------------------------------------
    DOCUMENTS
    --------------------------------------------------------
    */

    documents: {
      pendingReview: pendingDocuments,
    },

    /*
    --------------------------------------------------------
    RECENT APPLICATIONS
    --------------------------------------------------------
    */

    recentApplications,

    /*
    --------------------------------------------------------
    FORM SUBMISSIONS
    --------------------------------------------------------
    */

    formSubmissions,
  };
};

/*
============================================================
GET ASSIGNED APPLICATIONS
============================================================

GET /api/v1/staff/applications

Optional:

?page=1
?limit=20
?status=UNDER_REVIEW

============================================================
*/

const getAssignedApplications = async (
  staffId,
  { page = 1, limit = 20, status = null } = {},
) => {
  await validateStaff(staffId);

  const pagination = normalizePagination(page, limit);

  const query = {
    assignedTo: staffId,
  };

  /*
  ----------------------------------------------------------
  STATUS FILTER
  ----------------------------------------------------------
  */

  if (status) {
    const normalizedStatus = normalizeStatus(status);

    if (!isValidApplicationStatus(normalizedStatus)) {
      throw createError(STAFF_ERRORS.INVALID_APPLICATION_STATUS, 400);
    }

    query.status = normalizedStatus;
  }

  /*
  ----------------------------------------------------------
  FETCH APPLICATIONS + COUNT
  ----------------------------------------------------------
  */

  const [applications, total] = await Promise.all([
    populateApplication(
      Application.find(query)
        .sort(DEFAULT_SORT)
        .skip(pagination.skip)
        .limit(pagination.limit),
    ),

    Application.countDocuments(query),
  ]);

  return {
    applications,

    pagination: {
      page: pagination.page,

      limit: pagination.limit,

      total,

      pages: Math.ceil(total / pagination.limit),
    },
  };
};

/*
============================================================
GET ASSIGNED APPLICATION BY ID
============================================================
*/

const getAssignedApplicationById = async (applicationId, staffId) => {
  await validateStaff(staffId);

  const application = await getAssignedApplication(
    applicationId,

    staffId,
  );

  /*
  ----------------------------------------------------------
  SORT ACTIVITY
  ----------------------------------------------------------
  */

  if (Array.isArray(application.activity)) {
    application.activity = [...application.activity].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  /*
  ----------------------------------------------------------
  SORT INTERNAL NOTES
  ----------------------------------------------------------
  */

  if (Array.isArray(application.internalNotes)) {
    application.internalNotes = [...application.internalNotes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  /*
  ----------------------------------------------------------
  RE-FETCH WITH POPULATION
  ----------------------------------------------------------
  */

  return populateApplication(Application.findById(application._id));
};

/*
============================================================
BUILD APPLICATION STATUS ACTIVITY
============================================================
*/

const buildApplicationStatusActivity = ({
  previousStatus,

  nextStatus,

  notes = "",

  staffId,
}) => {
  const statusLabels = {
    DRAFT: "Draft",

    IN_PROGRESS: "In Progress",

    SUBMITTED: "Submitted",

    UNDER_REVIEW: "Under Review",

    DOCUMENT_REQUEST: "Document Request",

    PROCESSING: "Processing",

    APPROVED: "Approved",

    REJECTED: "Rejected",
  };

  const fromLabel = statusLabels[previousStatus] || previousStatus;

  const toLabel = statusLabels[nextStatus] || nextStatus;

  let title = "Application status updated";

  let description = `Application status changed from ${fromLabel} to ${toLabel}.`;

  switch (nextStatus) {
    case "SUBMITTED":
      title = "Application submitted";

      description =
        "The application has been submitted and is ready for review.";

      break;

    case "UNDER_REVIEW":
      title = "Application moved to review";

      description =
        "The application is now being reviewed by the colossus team.";

      break;

    case "DOCUMENT_REQUEST":
      title = "Additional documents requested";

      description =
        "Additional documents are required before the application can continue.";

      break;

    case "PROCESSING":
      title = "Application processing started";

      description = "The application has moved into processing.";

      break;

    case "APPROVED":
      title = "Application approved";

      description = "The application has been approved.";

      break;

    case "REJECTED":
      title = "Application rejected";

      description = "The application has been rejected.";

      break;

    default:
      break;
  }

  return {
    type: "STATUS_CHANGED",

    title,

    description,

    metadata: {
      fromStatus: previousStatus,

      toStatus: nextStatus,

      previousStatus: fromLabel,

      currentStatus: toLabel,

      reviewNote: notes,

      updatedBy: staffId,
    },

    createdAt: new Date(),
  };
};

/*
============================================================
UPDATE APPLICATION STATUS
============================================================

PATCH /api/v1/staff/applications/:id/status

SECURITY:

Staff must own the assignment before anything is changed.

============================================================
*/

const updateApplicationStatus = async (
  applicationId,

  status,

  notes = "",

  staffId,
) => {
  await validateStaff(staffId);

  /*
  ----------------------------------------------------------
  VERIFY ASSIGNMENT
  ----------------------------------------------------------
  */

  const application = await getAssignedApplication(
    applicationId,

    staffId,
  );

  /*
  ----------------------------------------------------------
  NORMALIZE STATUS
  ----------------------------------------------------------
  */

  const normalizedStatus = normalizeStatus(status);

  /*
  ----------------------------------------------------------
  VALIDATE STATUS
  ----------------------------------------------------------
  */

  if (!isValidApplicationStatus(normalizedStatus)) {
    throw createError(
      STAFF_ERRORS.INVALID_APPLICATION_STATUS,

      400,
    );
  }

  /*
  ----------------------------------------------------------
  PREVIOUS STATUS
  ----------------------------------------------------------
  */

  const previousStatus = normalizeStatus(application.status);

  const statusChanged = previousStatus !== normalizedStatus;

  /*
  ----------------------------------------------------------
  UPDATE APPLICATION
  ----------------------------------------------------------
  */

  application.status = normalizedStatus;

  application.notes = String(notes || "").trim();

  application.lastUpdatedBy = staffId;

  /*
  ----------------------------------------------------------
  ACTIVITY
  ----------------------------------------------------------
  */

  if (statusChanged) {
    application.activity.push(
      buildApplicationStatusActivity({
        previousStatus,

        nextStatus: normalizedStatus,

        notes: application.notes,

        staffId,
      }),
    );
  }

  /*
  ----------------------------------------------------------
  SAVE
  ----------------------------------------------------------
  */

  await application.save();

  /*
  ----------------------------------------------------------
  RUN CENTRAL WORKFLOW
  ----------------------------------------------------------

  The workflow service owns:

  - progress
  - client notification
  - operational notification
  - workflow consequences

  ----------------------------------------------------------
  */

  if (statusChanged) {
    await workflowService.handleApplicationStatusChange({
      userId: application.user,

      applicationId: application._id,

      status: application.status,

      actorId: staffId,
    });
  }

  /*
  ----------------------------------------------------------
  RETURN COMPLETE APPLICATION
  ----------------------------------------------------------
  */

  return getAssignedApplicationById(
    application._id,

    staffId,
  );
};

/*
============================================================
GET APPLICATION NOTES
============================================================
*/

const getApplicationNotes = async (
  applicationId,

  staffId,
) => {
  const application = await getAssignedApplication(
    applicationId,

    staffId,
  );

  return [...(application.internalNotes || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
};

/*
============================================================
ADD APPLICATION NOTE
============================================================

Staff may add internal notes only to their assigned
applications.

============================================================
*/

const addApplicationNote = async (
  applicationId,

  message,

  staffId,
) => {
  await validateStaff(staffId);

  const application = await getAssignedApplication(
    applicationId,

    staffId,
  );

  const trimmedMessage = String(message || "").trim();

  /*
  ----------------------------------------------------------
  VALIDATE
  ----------------------------------------------------------
  */

  if (!trimmedMessage) {
    throw createError(
      "Note message is required.",

      400,
    );
  }

  /*
  ----------------------------------------------------------
  ADD NOTE
  ----------------------------------------------------------
  */

  application.internalNotes.push({
    message: trimmedMessage,

    createdBy: staffId,

    createdAt: new Date(),
  });

  /*
  ----------------------------------------------------------
  ADD ACTIVITY
  ----------------------------------------------------------
  */

  application.activity.push({
    type: "UPDATED",

    title: "Internal note added",

    description: "A Staff member added an internal note to this application.",

    metadata: {
      action: "INTERNAL_NOTE_ADDED",

      note: trimmedMessage,

      createdBy: staffId,
    },

    createdAt: new Date(),
  });

  /*
  ----------------------------------------------------------
  LAST UPDATED BY
  ----------------------------------------------------------
  */

  application.lastUpdatedBy = staffId;

  /*
  ----------------------------------------------------------
  SAVE
  ----------------------------------------------------------
  */

  await application.save();

  /*
  ----------------------------------------------------------
  RETURN COMPLETE APPLICATION
  ----------------------------------------------------------
  */

  return getAssignedApplicationById(
    application._id,

    staffId,
  );
};

/*
============================================================
GET APPLICATION DOCUMENTS
============================================================

Staff can only access documents attached to applications
assigned to themselves.

============================================================
*/

const getApplicationDocuments = async (
  applicationId,

  staffId,
) => {
  await getAssignedApplication(
    applicationId,

    staffId,
  );

  return Document.find({
    application: applicationId,
  })
    .populate("user", "name email")
    .populate("reviewedBy", "name email role")
    .sort({
      createdAt: -1,
    });
};

/*
============================================================
GET SINGLE DOCUMENT
============================================================

SECURITY:

Document ownership alone is NOT sufficient.

The parent application must also be assigned to this
Staff member.

============================================================
*/

const getDocumentById = async (
  documentId,

  staffId,
) => {
  validateObjectId(
    documentId,

    STAFF_ERRORS.DOCUMENT_NOT_FOUND,
  );

  await validateStaff(staffId);

  /*
  ----------------------------------------------------------
  FIND DOCUMENT
  ----------------------------------------------------------
  */

  const document = await Document.findById(documentId);

  if (!document) {
    throw createError(
      STAFF_ERRORS.DOCUMENT_NOT_FOUND,

      404,
    );
  }

  /*
  ----------------------------------------------------------
  VERIFY PARENT APPLICATION
  ----------------------------------------------------------
  */

  await getAssignedApplication(
    document.application,

    staffId,
  );

  /*
  ----------------------------------------------------------
  POPULATE
  ----------------------------------------------------------
  */

  await document.populate([
    {
      path: "user",

      select: "name email",
    },

    {
      path: "reviewedBy",

      select: "name email role",
    },
  ]);

  return document;
};

/*
============================================================
REVIEW DOCUMENT
============================================================

PATCH /api/v1/staff/documents/:id/review

Allowed Staff actions:

    UNDER_REVIEW
    APPROVED
    REJECTED
    REUPLOAD_REQUIRED

============================================================
*/

const reviewDocument = async (
  documentId,

  { status, reviewNote = "" } = {},

  staffId,
) => {
  await validateStaff(staffId);

  validateObjectId(
    documentId,

    STAFF_ERRORS.DOCUMENT_NOT_FOUND,
  );

  /*
  ----------------------------------------------------------
  FIND DOCUMENT
  ----------------------------------------------------------
  */

  const document = await Document.findById(documentId);

  if (!document) {
    throw createError(
      STAFF_ERRORS.DOCUMENT_NOT_FOUND,

      404,
    );
  }

  /*
  ----------------------------------------------------------
  VERIFY APPLICATION ASSIGNMENT
  ----------------------------------------------------------
  */

  await getAssignedApplication(
    document.application,

    staffId,
  );

  /*
  ----------------------------------------------------------
  NORMALIZE STATUS
  ----------------------------------------------------------
  */

  const normalizedStatus = normalizeStatus(status);

  /*
  ----------------------------------------------------------
  VALIDATE STAFF REVIEW ACTION
  ----------------------------------------------------------
  */

  if (!STAFF_DOCUMENT_REVIEW_STATUSES.includes(normalizedStatus)) {
    throw createError(
      STAFF_ERRORS.INVALID_DOCUMENT_STATUS,

      400,
    );
  }

  /*
  ----------------------------------------------------------
  REVIEW NOTE
  ----------------------------------------------------------
  */

  const normalizedReviewNote = String(reviewNote || "").trim();

  /*
  ----------------------------------------------------------
  DELEGATE DOCUMENT WORKFLOW
  ----------------------------------------------------------

  documentService remains the source of truth for:

  - document status
  - reviewer
  - review time
  - review note
  - document progress
  - application progress
  - application activity

  ----------------------------------------------------------
  */

  return documentService.updateDocumentStatusByStaff(
    documentId,

    {
      status: normalizedStatus,

      reviewNote: normalizedReviewNote,
    },

    staffId,
  );
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
