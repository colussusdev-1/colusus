import mongoose from "mongoose";

import User from "../users/user.model.js";
import FormSubmission from "../form-submissions/form-submission.model.js";
import formSubmissionService from "../form-submissions/form-submission.service.js";

/*
============================================================
colossus — STAFF FORM SUBMISSION SERVICE
============================================================

Staff-side workflow for generic public FormSubmissions.

SECURITY RULE:

A Staff member can ONLY access a FormSubmission where:

    submission.assignedTo === staffId

This is enforced server-side.

This service is intentionally separate from the existing
Staff Application service because:

    Application
        !=
    FormSubmission

Both may have Staff assignments, but they represent
different operational workflows.
============================================================
*/

const FORM_SUBMISSION_STATUSES = [
  "NEW",
  "REVIEWING",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "CLOSED",
];

const createError = (message, statusCode = 400) => {
  const error = new Error(message);

  error.statusCode = statusCode;

  return error;
};

const validateObjectId = (id, message = "Invalid ID.") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw createError(message, 400);
  }

  return id;
};

const validateStaff = async (staffId) => {
  validateObjectId(staffId, "Staff member not found.");

  const staff = await User.findOne({
    _id: staffId,
    role: "STAFF",
    isActive: true,
  }).select("_id name email role");

  if (!staff) {
    throw createError("Staff access denied.", 403);
  }

  return staff;
};

const normalizeStatus = (status) => {
  return String(status || "")
    .trim()
    .toUpperCase();
};

const populateSubmission = (query) => {
  return query
    .populate("assignedTo", "name email role")
    .populate("internalNotes.addedBy", "name email role");
};

/*
============================================================
GET ASSIGNED FORM SUBMISSION
============================================================
*/

const getAssignedFormSubmission = async (submissionId, staffId) => {
  validateObjectId(submissionId, "Form submission not found.");

  validateObjectId(staffId, "Staff member not found.");

  const submission = await FormSubmission.findOne({
    _id: submissionId,
    assignedTo: staffId,
  });

  if (!submission) {
    const exists = await FormSubmission.exists({
      _id: submissionId,
    });

    if (!exists) {
      throw createError("Form submission not found.", 404);
    }

    throw createError("This form submission is not assigned to you.", 403);
  }

  return submission;
};

/*
============================================================
GET ASSIGNED FORM SUBMISSIONS
============================================================

GET /api/v1/staff/form-submissions

Optional:

    ?page=1
    ?limit=20
    ?status=NEW
    ?formKey=ireland-nursing-healthcare
============================================================
*/

const getAssignedFormSubmissions = async (
  staffId,
  { page = 1, limit = 20, status = null, formKey = null } = {},
) => {
  await validateStaff(staffId);

  const normalizedPage = Math.max(Number.parseInt(page, 10) || 1, 1);

  const normalizedLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || 20, 1),
    100,
  );

  const skip = (normalizedPage - 1) * normalizedLimit;

  const query = {
    assignedTo: staffId,
  };

  if (status) {
    const normalizedStatus = normalizeStatus(status);

    if (!FORM_SUBMISSION_STATUSES.includes(normalizedStatus)) {
      throw createError("Invalid form submission status.", 400);
    }

    query.status = normalizedStatus;
  }

  if (formKey && typeof formKey === "string" && formKey.trim()) {
    query.formKey = formKey.trim().toLowerCase();
  }

  const [submissions, total] = await Promise.all([
    populateSubmission(
      FormSubmission.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(normalizedLimit),
    ),

    FormSubmission.countDocuments(query),
  ]);

  return {
    submissions,

    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      pages: Math.ceil(total / normalizedLimit),
    },
  };
};

/*
============================================================
GET SINGLE ASSIGNED FORM SUBMISSION
============================================================
*/

const getAssignedFormSubmissionById = async (submissionId, staffId) => {
  await validateStaff(staffId);

  const submission = await getAssignedFormSubmission(submissionId, staffId);

  return populateSubmission(FormSubmission.findById(submission._id));
};

/*
============================================================
UPDATE FORM SUBMISSION
============================================================

Staff can update:

    status
    note

Assignment remains Admin-controlled.

Staff cannot reassign submissions.
============================================================
*/

const updateFormSubmission = async (
  submissionId,
  { status, note } = {},
  staffId,
) => {
  await validateStaff(staffId);

  const submission = await getAssignedFormSubmission(submissionId, staffId);

  let changed = false;

  if (status !== undefined) {
    const normalizedStatus = normalizeStatus(status);

    if (!FORM_SUBMISSION_STATUSES.includes(normalizedStatus)) {
      throw createError("Invalid form submission status.", 400);
    }

    if (submission.status !== normalizedStatus) {
      submission.status = normalizedStatus;

      changed = true;
    }
  }

  if (note !== undefined && typeof note === "string" && note.trim()) {
    submission.internalNotes.push({
      message: note.trim(),
      addedBy: staffId,
      createdAt: new Date(),
    });

    changed = true;
  }

  if (!changed) {
    throw createError("No valid update fields were provided.", 400);
  }

  await submission.save();

  return getAssignedFormSubmissionById(submission._id, staffId);
};

/*
============================================================
ADD INTERNAL NOTE
============================================================
*/

const addFormSubmissionNote = async (submissionId, message, staffId) => {
  await validateStaff(staffId);

  const submission = await getAssignedFormSubmission(submissionId, staffId);

  const trimmedMessage = String(message || "").trim();

  if (!trimmedMessage) {
    throw createError("Note message is required.", 400);
  }

  submission.internalNotes.push({
    message: trimmedMessage,
    addedBy: staffId,
    createdAt: new Date(),
  });

  await submission.save();

  return getAssignedFormSubmissionById(submission._id, staffId);
};

/*
============================================================
VIEW FORM SUBMISSION DOCUMENT
============================================================

The generic FormSubmission service already handles the
Cloudinary private document retrieval.

Staff access is verified HERE first.

Therefore Staff cannot use the generic document endpoint
to bypass assignment ownership.
============================================================
*/

const viewFormSubmissionDocument = async (
  submissionId,
  documentId,
  staffId,
) => {
  await validateStaff(staffId);

  await getAssignedFormSubmission(submissionId, staffId);

  return formSubmissionService.getDocumentFile({
    submissionId,
    documentId,
  });
};

/*
============================================================
GET DASHBOARD FORM SUBMISSION SUMMARY
============================================================
*/

const getDashboardSummary = async (staffId) => {
  await validateStaff(staffId);

  const [
    total,
    newSubmissions,
    reviewing,
    contacted,
    qualified,
    converted,
    recent,
  ] = await Promise.all([
    FormSubmission.countDocuments({
      assignedTo: staffId,
    }),

    FormSubmission.countDocuments({
      assignedTo: staffId,
      status: "NEW",
    }),

    FormSubmission.countDocuments({
      assignedTo: staffId,
      status: "REVIEWING",
    }),

    FormSubmission.countDocuments({
      assignedTo: staffId,
      status: "CONTACTED",
    }),

    FormSubmission.countDocuments({
      assignedTo: staffId,
      status: "QUALIFIED",
    }),

    FormSubmission.countDocuments({
      assignedTo: staffId,
      status: "CONVERTED",
    }),

    populateSubmission(
      FormSubmission.find({
        assignedTo: staffId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(5),
    ),
  ]);

  return {
    total,
    new: newSubmissions,
    reviewing,
    contacted,
    qualified,
    converted,
    recent,
  };
};

export default {
  getAssignedFormSubmission,

  getAssignedFormSubmissions,

  getAssignedFormSubmissionById,

  updateFormSubmission,

  addFormSubmissionNote,

  viewFormSubmissionDocument,

  getDashboardSummary,
};
