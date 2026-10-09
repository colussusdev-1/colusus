import User from "../users/user.model.js";
import Application from "../applications/application.model.js";
import Document from "../documents/document.model.js";
import workflowService from "../workflows/workflow.service.js";
import adminOpportunityService from "./admin.opportunity.service.js";

/* -------------------------------------------------------------------------- */
/* APPLICATION STATUS LABEL                                                  */
/* -------------------------------------------------------------------------- */

const formatStatusLabel = (status) =>
  String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

/* -------------------------------------------------------------------------- */
/* NORMALIZE STATUS                                                           */
/* -------------------------------------------------------------------------- */

const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

/* -------------------------------------------------------------------------- */
/* APPLICATION STATUS ACTIVITY                                               */
/* -------------------------------------------------------------------------- */

const createApplicationStatusActivity = ({
  previousStatus,
  nextStatus,
  notes = "",
  updatedBy = null,
}) => {
  const fromLabel = formatStatusLabel(previousStatus);
  const toLabel = formatStatusLabel(nextStatus);

  const metadata = {
    fromStatus: previousStatus,
    toStatus: nextStatus,
    previousStatus: fromLabel,
    currentStatus: toLabel,
    reviewNote: notes,
    updatedBy,
  };

  switch (nextStatus) {
    case "SUBMITTED":
      return {
        type: "SUBMITTED",
        title: "Application submitted",
        description:
          "Your application has been submitted and is ready for colossus review.",
        metadata,
        createdAt: new Date(),
      };

    case "UNDER_REVIEW":
      return {
        type: "STATUS_CHANGED",
        title: "Application moved to review",
        description:
          "Your application is now being reviewed by the colossus team.",
        metadata,
        createdAt: new Date(),
      };

    case "DOCUMENT_REQUEST":
      return {
        type: "STATUS_CHANGED",
        title: "Additional documents requested",
        description:
          "The colossus team has requested additional documents for your application.",
        metadata,
        createdAt: new Date(),
      };

    case "PROCESSING":
      return {
        type: "STATUS_CHANGED",
        title: "Application processing started",
        description:
          "Your application has moved into processing by the colossus team.",
        metadata,
        createdAt: new Date(),
      };

    case "APPROVED":
      return {
        type: "APPROVED",
        title: "Application approved",
        description:
          "Your application has been approved by the colossus team.",
        metadata,
        createdAt: new Date(),
      };

    case "REJECTED":
      return {
        type: "REJECTED",
        title: "Application rejected",
        description:
          "Your application has been rejected by the colossus team.",
        metadata,
        createdAt: new Date(),
      };

    case "IN_PROGRESS":
      return {
        type: "STATUS_CHANGED",
        title: "Application moved to in progress",
        description: "Your application is now in progress.",
        metadata,
        createdAt: new Date(),
      };

    case "DRAFT":
      return {
        type: "STATUS_CHANGED",
        title: "Application moved to draft",
        description: "Your application has been moved back to draft.",
        metadata,
        createdAt: new Date(),
      };

    default:
      return {
        type: "STATUS_CHANGED",
        title: `Application status changed to ${toLabel}`,
        description: `Your application status has changed from ${fromLabel} to ${toLabel}.`,
        metadata,
        createdAt: new Date(),
      };
  }
};

/* -------------------------------------------------------------------------- */
/* DASHBOARD STATISTICS                                                       */
/* -------------------------------------------------------------------------- */

const getDashboardStats = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalClients,
    newClients,
    totalApplications,
    submittedApplications,
    underReviewApplications,
    approvedApplications,
    rejectedApplications,
    totalDocuments,
    pendingDocuments,
    approvedDocuments,
    rejectedDocuments,
    recentApplications,
  ] = await Promise.all([
    User.countDocuments({
      role: "CLIENT",
    }),

    User.countDocuments({
      role: "CLIENT",
      createdAt: {
        $gte: thirtyDaysAgo,
      },
    }),

    Application.countDocuments(),

    Application.countDocuments({
      status: "SUBMITTED",
    }),

    Application.countDocuments({
      status: "UNDER_REVIEW",
    }),

    Application.countDocuments({
      status: "APPROVED",
    }),

    Application.countDocuments({
      status: "REJECTED",
    }),

    Document.countDocuments(),

    Document.countDocuments({
      status: {
        $in: ["UPLOADED", "UNDER_REVIEW"],
      },
    }),

    Document.countDocuments({
      status: "APPROVED",
    }),

    Document.countDocuments({
      status: "REJECTED",
    }),

    Application.find()
      .populate("user", "name email")
      .populate("assignedTo", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(5),
  ]);

  return {
    clients: {
      total: totalClients,
      newThisMonth: newClients,
    },

    applications: {
      total: totalApplications,
      submitted: submittedApplications,
      underReview: underReviewApplications,
      approved: approvedApplications,
      rejected: rejectedApplications,
    },

    documents: {
      total: totalDocuments,
      pendingReview: pendingDocuments,
      approved: approvedDocuments,
      rejected: rejectedDocuments,
    },

    recentApplications,
  };
};

/* -------------------------------------------------------------------------- */
/* GET ALL APPLICATIONS                                                       */
/* -------------------------------------------------------------------------- */

const getAllApplications = async () => {
  return Application.find()
    .populate("user", "name email")
    .populate("assignedTo", "name email")
    .sort({
      createdAt: -1,
    });
};

/* -------------------------------------------------------------------------- */
/* GET SINGLE APPLICATION                                                    */
/* -------------------------------------------------------------------------- */

const getApplicationById = async (applicationId) => {
  const application = await Application.findById(applicationId)
    .populate("user", "name email")
    .populate("assignedTo", "name email")
    .populate("internalNotes.createdBy", "name email");

  if (!application) {
    return null;
  }

  if (Array.isArray(application.activity)) {
    application.activity = [...application.activity].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  if (Array.isArray(application.internalNotes)) {
    application.internalNotes = [...application.internalNotes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  return application;
};

/* -------------------------------------------------------------------------- */
/* UPDATE APPLICATION STATUS                                                 */
/* -------------------------------------------------------------------------- */

const updateApplicationStatus = async (
  applicationId,
  status,
  notes = "",
  updatedBy = null,
) => {
  const normalizedStatus = normalizeStatus(status);

  const allowedStatuses = [
    "DRAFT",
    "IN_PROGRESS",
    "SUBMITTED",
    "UNDER_REVIEW",
    "DOCUMENT_REQUEST",
    "PROCESSING",
    "APPROVED",
    "REJECTED",
  ];

  if (!allowedStatuses.includes(normalizedStatus)) {
    const error = new Error(`Invalid application status: ${status}`);
    error.statusCode = 400;
    throw error;
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    return null;
  }

  const previousStatus = normalizeStatus(application.status);
  const statusChanged = previousStatus !== normalizedStatus;

  application.status = normalizedStatus;
  application.notes = String(notes || "").trim();

  if (updatedBy) {
    application.lastUpdatedBy = updatedBy;
  }

  if (statusChanged) {
    application.activity.push(
      createApplicationStatusActivity({
        previousStatus,
        nextStatus: normalizedStatus,
        notes,
        updatedBy,
      }),
    );
  }

  await application.save();

  /*
   * Notification ownership:
   *
   * The workflow service handles application-status notifications.
   * We intentionally do not call the old notificationService here,
   * preventing duplicate notifications and calls to obsolete methods.
   *
   * Notification failures must not undo a successfully saved status.
   */

  if (statusChanged) {
    try {
      await workflowService.handleApplicationStatusChange({
        userId: application.user,
        applicationId: application._id,
        status: normalizedStatus,
        actorId: updatedBy,
      });
    } catch (workflowError) {
      console.error("[COLOSSUS_WORKFLOW_ERROR]", {
        applicationId: String(application._id),
        previousStatus,
        newStatus: normalizedStatus,
        updatedBy: updatedBy ? String(updatedBy) : null,
        error: workflowError?.message || "Unknown workflow error",
      });
    }
  }

  return getApplicationById(application._id);
};

/* -------------------------------------------------------------------------- */
/* GET APPLICATION INTERNAL NOTES                                             */
/* -------------------------------------------------------------------------- */

const getApplicationNotes = async (applicationId) => {
  const application = await Application.findById(applicationId)
    .select("internalNotes")
    .populate("internalNotes.createdBy", "name email");

  if (!application) {
    return null;
  }

  return [...(application.internalNotes || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
};

/* -------------------------------------------------------------------------- */
/* ADD APPLICATION INTERNAL NOTE                                              */
/* -------------------------------------------------------------------------- */

const addApplicationNote = async (applicationId, message, adminId) => {
  const application = await Application.findById(applicationId);

  if (!application) {
    return null;
  }

  const trimmedMessage = String(message || "").trim();

  if (!trimmedMessage) {
    const error = new Error("Note message is required.");
    error.statusCode = 400;
    throw error;
  }

  application.internalNotes.push({
    message: trimmedMessage,
    createdBy: adminId,
    createdAt: new Date(),
  });

  application.activity.push({
    type: "UPDATED",
    title: "Internal note added",
    description: "An internal note was added to this application.",
    metadata: {
      action: "INTERNAL_NOTE_ADDED",
      note: trimmedMessage,
      createdBy: adminId,
    },
    createdAt: new Date(),
  });

  application.lastUpdatedBy = adminId;

  await application.save();

  return getApplicationById(application._id);
};

/* -------------------------------------------------------------------------- */
/* GET ASSIGNABLE STAFF                                                       */
/* -------------------------------------------------------------------------- */

const getAssignableStaff = async () => {
  return User.find({
    role: {
      $in: ["ADMIN", "STAFF"],
    },
  })
    .select("_id name email role")
    .sort({
      name: 1,
    });
};

/* -------------------------------------------------------------------------- */
/* ASSIGN APPLICATION                                                         */
/* -------------------------------------------------------------------------- */

const assignApplication = async (applicationId, staffId, updatedBy) => {
  if (!applicationId) {
    const error = new Error("Application ID is required.");
    error.statusCode = 400;
    throw error;
  }

  const application = await Application.findById(applicationId);

  if (!application) {
    return null;
  }

  const previousAssignedTo = application.assignedTo;

  const assignmentValue =
    staffId === null || staffId === undefined || staffId === ""
      ? null
      : String(staffId).trim();

  /* UNASSIGN APPLICATION */

  if (assignmentValue === null) {
    if (previousAssignedTo) {
      application.assignedTo = null;

      application.activity.push({
        type: "UPDATED",
        title: "Application unassigned",
        description:
          "The application was removed from its assigned staff member.",
        metadata: {
          action: "APPLICATION_UNASSIGNED",
          previousAssignedTo: String(previousAssignedTo),
          updatedBy: updatedBy ? String(updatedBy) : null,
        },
        createdAt: new Date(),
      });
    }
  } else {
    /* VALIDATE STAFF ID */

    if (!/^[a-fA-F0-9]{24}$/.test(assignmentValue)) {
      const error = new Error("Selected staff member ID is invalid.");
      error.statusCode = 400;
      throw error;
    }

    /* FIND VALID STAFF MEMBER */

    const staff = await User.findOne({
      _id: assignmentValue,
      role: {
        $in: ["ADMIN", "STAFF"],
      },
    }).select("_id name email role");

    if (!staff) {
      const error = new Error("Selected staff member is invalid.");
      error.statusCode = 400;
      throw error;
    }

    const isSameStaff =
      previousAssignedTo &&
      String(previousAssignedTo) === String(staff._id);

    /* ASSIGN OR REASSIGN */

    if (!isSameStaff) {
      application.assignedTo = staff._id;

      application.activity.push({
        type: "UPDATED",
        title: previousAssignedTo
          ? "Application reassigned"
          : "Application assigned",
        description: previousAssignedTo
          ? `Application reassigned to ${staff.name}.`
          : `Application assigned to ${staff.name}.`,
        metadata: {
          action: previousAssignedTo
            ? "APPLICATION_REASSIGNED"
            : "APPLICATION_ASSIGNED",
          assignedTo: String(staff._id),
          assignedToName: staff.name || "",
          assignedToEmail: staff.email || "",
          assignedToRole: staff.role || "",
          previousAssignedTo: previousAssignedTo
            ? String(previousAssignedTo)
            : null,
          updatedBy: updatedBy ? String(updatedBy) : null,
        },
        createdAt: new Date(),
      });
    }
  }

  if (updatedBy) {
    application.lastUpdatedBy = updatedBy;
  }

  /* SAVE ASSIGNMENT */

  try {
    await application.save();
  } catch (error) {
    console.error("APPLICATION ASSIGNMENT SAVE FAILED", {
      applicationId: application?._id
        ? String(application._id)
        : applicationId,

      applicationReference: application?.applicationReference || "N/A",

      previousAssignedTo: previousAssignedTo
        ? String(previousAssignedTo)
        : null,

      newAssignedTo: application?.assignedTo
        ? String(application.assignedTo)
        : null,

      updatedBy: updatedBy ? String(updatedBy) : null,

      errorName: error?.name || "UnknownError",
      errorMessage: error?.message || "Unknown error",
      errorCode: error?.code || null,

      validationErrors: error?.errors
        ? Object.fromEntries(
            Object.entries(error.errors).map(([field, fieldError]) => [
              field,
              {
                message: fieldError?.message,
                kind: fieldError?.kind,
                path: fieldError?.path,
                value: fieldError?.value,
              },
            ]),
          )
        : null,
    });

    throw error;
  }

  return getApplicationById(application._id);
};

/* -------------------------------------------------------------------------- */
/* OPPORTUNITY MANAGEMENT                                                     */
/* -------------------------------------------------------------------------- */

const getAllOpportunities = async () => {
  return adminOpportunityService.getAllOpportunities();
};

const getOpportunityById = async (opportunityId) => {
  return adminOpportunityService.getOpportunityById(opportunityId);
};

const createOpportunity = async (payload) => {
  return adminOpportunityService.createOpportunity(payload);
};

const updateOpportunity = async (opportunityId, payload) => {
  return adminOpportunityService.updateOpportunity(opportunityId, payload);
};

const setOpportunityActive = async (opportunityId, active) => {
  return adminOpportunityService.setOpportunityActive(opportunityId, active);
};

const setOpportunityFeatured = async (opportunityId, featured) => {
  return adminOpportunityService.setOpportunityFeatured(
    opportunityId,
    featured,
  );
};

const deactivateOpportunity = async (opportunityId) => {
  return adminOpportunityService.deactivateOpportunity(opportunityId);
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                      */
/* -------------------------------------------------------------------------- */

export default {
  getDashboardStats,

  getAllApplications,
  getApplicationById,
  updateApplicationStatus,

  getApplicationNotes,
  addApplicationNote,

  getAssignableStaff,
  assignApplication,

  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  setOpportunityActive,
  setOpportunityFeatured,
  deactivateOpportunity,
};