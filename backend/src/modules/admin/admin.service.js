import User from "../users/user.model.js";
import Application from "../applications/application.model.js";
import Document from "../documents/document.model.js";
import workflowService from "../workflows/workflow.service.js";
import notificationService from "../notifications/notification.service.js";

/*
|--------------------------------------------------------------------------
| APPLICATION STATUS LABEL
|--------------------------------------------------------------------------
*/

const formatStatusLabel = (status) => {
  return String(status || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

/*
|--------------------------------------------------------------------------
| NORMALIZE STATUS
|--------------------------------------------------------------------------
*/

const normalizeStatus = (status) => {
  return String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
};

/*
|--------------------------------------------------------------------------
| APPLICATION STATUS ACTIVITY
|--------------------------------------------------------------------------
*/

const createApplicationStatusActivity = ({
  previousStatus,
  nextStatus,
  notes = "",
  updatedBy = null,
}) => {
  const fromLabel = formatStatusLabel(previousStatus);
  const toLabel = formatStatusLabel(nextStatus);

  switch (nextStatus) {
    case "SUBMITTED":
      return {
        type: "SUBMITTED",
        title: "Application submitted",
        description:
          "Your application has been submitted and is ready for colossus review.",
        metadata: {
          fromStatus: previousStatus,
          toStatus: nextStatus,
          previousStatus: fromLabel,
          currentStatus: toLabel,
          reviewNote: notes,
          updatedBy,
        },
        createdAt: new Date(),
      };

    case "UNDER_REVIEW":
      return {
        type: "STATUS_CHANGED",
        title: "Application moved to review",
        description:
          "Your application is now being reviewed by the colossus team.",
        metadata: {
          fromStatus: previousStatus,
          toStatus: nextStatus,
          previousStatus: fromLabel,
          currentStatus: toLabel,
          reviewNote: notes,
          updatedBy,
        },
        createdAt: new Date(),
      };

    case "DOCUMENT_REQUEST":
      return {
        type: "STATUS_CHANGED",
        title: "Additional documents requested",
        description:
          "The colossus team has requested additional documents for your application.",
        metadata: {
          fromStatus: previousStatus,
          toStatus: nextStatus,
          previousStatus: fromLabel,
          currentStatus: toLabel,
          reviewNote: notes,
          updatedBy,
        },
        createdAt: new Date(),
      };

    case "PROCESSING":
      return {
        type: "STATUS_CHANGED",
        title: "Application processing started",
        description:
          "Your application has moved into processing by the colossus team.",
        metadata: {
          fromStatus: previousStatus,
          toStatus: nextStatus,
          previousStatus: fromLabel,
          currentStatus: toLabel,
          reviewNote: notes,
          updatedBy,
        },
        createdAt: new Date(),
      };

    case "APPROVED":
      return {
        type: "APPROVED",
        title: "Application approved",
        description: "Your application has been approved by the colossus team.",
        metadata: {
          fromStatus: previousStatus,
          toStatus: nextStatus,
          previousStatus: fromLabel,
          currentStatus: toLabel,
          reviewNote: notes,
          updatedBy,
        },
        createdAt: new Date(),
      };

    case "REJECTED":
      return {
        type: "REJECTED",
        title: "Application rejected",
        description: "Your application has been rejected by the colossus team.",
        metadata: {
          fromStatus: previousStatus,
          toStatus: nextStatus,
          previousStatus: fromLabel,
          currentStatus: toLabel,
          reviewNote: notes,
          updatedBy,
        },
        createdAt: new Date(),
      };

    case "IN_PROGRESS":
      return {
        type: "STATUS_CHANGED",
        title: "Application moved to in progress",
        description: "Your application is now in progress.",
        metadata: {
          fromStatus: previousStatus,
          toStatus: nextStatus,
          previousStatus: fromLabel,
          currentStatus: toLabel,
          reviewNote: notes,
          updatedBy,
        },
        createdAt: new Date(),
      };

    case "DRAFT":
      return {
        type: "STATUS_CHANGED",
        title: "Application moved to draft",
        description: "Your application has been moved back to draft.",
        metadata: {
          fromStatus: previousStatus,
          toStatus: nextStatus,
          previousStatus: fromLabel,
          currentStatus: toLabel,
          reviewNote: notes,
          updatedBy,
        },
        createdAt: new Date(),
      };

    default:
      return {
        type: "STATUS_CHANGED",
        title: `Application status changed to ${toLabel}`,
        description: `Your application status has changed from ${fromLabel} to ${toLabel}.`,
        metadata: {
          fromStatus: previousStatus,
          toStatus: nextStatus,
          previousStatus: fromLabel,
          currentStatus: toLabel,
          reviewNote: notes,
          updatedBy,
        },
        createdAt: new Date(),
      };
  }
};

/*
|--------------------------------------------------------------------------
| NOTIFICATION TYPE FOR APPLICATION STATUS
|--------------------------------------------------------------------------
*/

const getApplicationStatusNotificationType = (status) => {
  switch (status) {
    case "SUBMITTED":
      return "APPLICATION_SUBMITTED";

    case "APPROVED":
      return "APPLICATION_APPROVED";

    case "REJECTED":
      return "APPLICATION_REJECTED";

    default:
      return "APPLICATION_STATUS_CHANGED";
  }
};

/*
|--------------------------------------------------------------------------
| NOTIFICATION PRIORITY FOR APPLICATION STATUS
|--------------------------------------------------------------------------
*/

const getApplicationStatusNotificationPriority = (status) => {
  switch (status) {
    case "APPROVED":
    case "REJECTED":
      return "HIGH";

    case "DOCUMENT_REQUEST":
      return "HIGH";

    default:
      return "NORMAL";
  }
};

/*
|--------------------------------------------------------------------------
| BUILD APPLICATION STATUS NOTIFICATION
|--------------------------------------------------------------------------
*/

const buildApplicationStatusNotification = ({
  previousStatus,
  nextStatus,
  notes = "",
  applicationId,
}) => {
  const fromLabel = formatStatusLabel(previousStatus);
  const toLabel = formatStatusLabel(nextStatus);

  switch (nextStatus) {
    case "SUBMITTED":
      return {
        title: "Application submitted",
        message:
          "Your application has been submitted and is ready for colossus review.",
      };

    case "UNDER_REVIEW":
      return {
        title: "Application under review",
        message: "Your application is now being reviewed by the colossus team.",
      };

    case "DOCUMENT_REQUEST":
      return {
        title: "Additional documents requested",
        message:
          String(notes || "").trim() ||
          "The colossus team has requested additional documents for your application.",
      };

    case "PROCESSING":
      return {
        title: "Application processing started",
        message:
          "Your application has moved into processing by the colossus team.",
      };

    case "APPROVED":
      return {
        title: "Application approved",
        message: "Your application has been approved by the colossus team.",
      };

    case "REJECTED":
      return {
        title: "Application rejected",
        message:
          String(notes || "").trim() ||
          "Your application has been rejected by the colossus team.",
      };

    case "IN_PROGRESS":
      return {
        title: "Application in progress",
        message: "Your application is now in progress.",
      };

    case "DRAFT":
      return {
        title: "Application moved to draft",
        message: "Your application has been moved back to draft.",
      };

    default:
      return {
        title: `Application status changed to ${toLabel}`,
        message: `Your application status has changed from ${fromLabel} to ${toLabel}.`,
      };
  }
};

/*
|--------------------------------------------------------------------------
| CREATE APPLICATION STATUS NOTIFICATION
|--------------------------------------------------------------------------
*/

const createApplicationStatusNotification = async ({
  application,
  previousStatus,
  nextStatus,
  notes = "",
  updatedBy = null,
}) => {
  if (!application?.user) {
    return null;
  }

  const notificationContent = buildApplicationStatusNotification({
    previousStatus,
    nextStatus,
    notes,
    applicationId: application._id,
  });

  const notificationType =
    getApplicationStatusNotificationType(nextStatus);

  const priority =
    getApplicationStatusNotificationPriority(nextStatus);

  return notificationService.createForApplicationOwner({
    application,
    actorId: updatedBy,
    title: notificationContent.title,
    message: notificationContent.message,
    type: notificationType,
    entityType: "APPLICATION",
    entityId: application._id,
    metadata: {
      applicationId: application._id,
      previousStatus,
      newStatus: nextStatus,
      previousStatusLabel: formatStatusLabel(previousStatus),
      newStatusLabel: formatStatusLabel(nextStatus),
      reviewNote: String(notes || "").trim(),
    },
    priority,
  });
};

/*
|--------------------------------------------------------------------------
| DASHBOARD STATISTICS
|--------------------------------------------------------------------------
*/

const getDashboardStats = async () => {
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
        $gte: new Date(
          new Date().setDate(new Date().getDate() - 30),
        ),
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

/*
|--------------------------------------------------------------------------
| GET ALL APPLICATIONS
|--------------------------------------------------------------------------
*/

const getAllApplications = async () => {
  return await Application.find()
    .populate("user", "name email")
    .populate("assignedTo", "name email")
    .sort({
      createdAt: -1,
    });
};

/*
|--------------------------------------------------------------------------
| GET SINGLE APPLICATION
|--------------------------------------------------------------------------
*/

const getApplicationById = async (applicationId) => {
  const application = await Application.findById(applicationId)
    .populate("user", "name email")
    .populate("assignedTo", "name email")
    .populate("internalNotes.createdBy", "name email");

  if (Array.isArray(application?.activity)) {
    application.activity = [...application.activity].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  if (Array.isArray(application?.internalNotes)) {
    application.internalNotes = [...application.internalNotes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  return application;
};

/*
|--------------------------------------------------------------------------
| UPDATE APPLICATION STATUS
|--------------------------------------------------------------------------
*/

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
    const error = new Error(
      `Invalid application status: ${status}`,
    );

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
    const activity = createApplicationStatusActivity({
      previousStatus,
      nextStatus: normalizedStatus,
      notes,
      updatedBy,
    });

    application.activity.push(activity);
  }

  await application.save();

  if (statusChanged) {
    try {
      await createApplicationStatusNotification({
        application,
        previousStatus,
        nextStatus: normalizedStatus,
        notes,
        updatedBy,
      });
    } catch (notificationError) {
      console.error("[colossus_NOTIFICATION_ERROR]", {
        applicationId: application._id,
        previousStatus,
        newStatus: normalizedStatus,
        updatedBy,
        error: notificationError?.message,
      });
    }
  }

  if (statusChanged) {
    await workflowService.handleApplicationStatusChange({
      userId: application.user,
      applicationId: application._id,
      status: application.status,
    });
  }

  return await getApplicationById(application._id);
};

/*
|--------------------------------------------------------------------------
| GET APPLICATION INTERNAL NOTES
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| ADD APPLICATION INTERNAL NOTE
|--------------------------------------------------------------------------
*/

const addApplicationNote = async (
  applicationId,
  message,
  adminId,
) => {
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
    description:
      "An internal note was added to this application.",
    metadata: {
      action: "INTERNAL_NOTE_ADDED",
      note: trimmedMessage,
      createdBy: adminId,
    },
    createdAt: new Date(),
  });

  application.lastUpdatedBy = adminId;

  await application.save();

  return await getApplicationById(application._id);
};

/*
|--------------------------------------------------------------------------
| GET ASSIGNABLE STAFF
|--------------------------------------------------------------------------
*/

const getAssignableStaff = async () => {
  return await User.find({
    role: {
      $in: ["ADMIN", "STAFF"],
    },
  })
    .select("_id name email role")
    .sort({
      name: 1,
    });
};

/*
|--------------------------------------------------------------------------
| ASSIGN APPLICATION
|--------------------------------------------------------------------------
*/

const assignApplication = async (
  applicationId,
  staffId,
  updatedBy,
) => {
  /*
  |--------------------------------------------------------------------------
  | VALIDATE APPLICATION ID
  |--------------------------------------------------------------------------
  */

  if (!applicationId) {
    const error = new Error("Application ID is required.");

    error.statusCode = 400;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | FIND APPLICATION
  |--------------------------------------------------------------------------
  */

  const application = await Application.findById(applicationId);

  if (!application) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | GET PREVIOUS ASSIGNEE
  |--------------------------------------------------------------------------
  */

  const previousAssignedTo = application.assignedTo;

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE ASSIGNMENT INPUT
  |--------------------------------------------------------------------------
  */

  const assignmentValue =
    staffId === null ||
    staffId === undefined ||
    staffId === ""
      ? null
      : String(staffId).trim();

  /*
  |--------------------------------------------------------------------------
  | REMOVE ASSIGNMENT
  |--------------------------------------------------------------------------
  */

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

          previousAssignedTo: previousAssignedTo
            ? String(previousAssignedTo)
            : null,

          updatedBy: updatedBy
            ? String(updatedBy)
            : null,
        },

        createdAt: new Date(),
      });
    }
  } else {
    /*
    |--------------------------------------------------------------------------
    | VALIDATE STAFF ID
    |--------------------------------------------------------------------------
    */

    if (!/^[a-fA-F0-9]{24}$/.test(assignmentValue)) {
      const error = new Error(
        "Selected staff member ID is invalid.",
      );

      error.statusCode = 400;

      throw error;
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE STAFF
    |--------------------------------------------------------------------------
    */

    const staff = await User.findOne({
      _id: assignmentValue,

      role: {
        $in: ["ADMIN", "STAFF"],
      },
    }).select("_id name email role");

    if (!staff) {
      const error = new Error(
        "Selected staff member is invalid.",
      );

      error.statusCode = 400;

      throw error;
    }

    /*
    |--------------------------------------------------------------------------
    | DETERMINE WHETHER THIS IS A NEW ASSIGNMENT OR REASSIGNMENT
    |--------------------------------------------------------------------------
    */

    const isSameStaff =
      previousAssignedTo &&
      String(previousAssignedTo) === String(staff._id);

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

          updatedBy: updatedBy
            ? String(updatedBy)
            : null,
        },

        createdAt: new Date(),
      });
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LAST UPDATED BY
  |--------------------------------------------------------------------------
  */

  if (updatedBy) {
    application.lastUpdatedBy = updatedBy;
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE APPLICATION
  |--------------------------------------------------------------------------
  |
  | Assignment should not silently fail.
  |
  | We capture the complete Mongoose error here so the backend log
  | identifies the exact validation/casting/database problem.
  |
  |--------------------------------------------------------------------------
  */

  try {
    await application.save();
  } catch (error) {
    console.error(
      "============================================================",
    );

    console.error(
      "APPLICATION ASSIGNMENT SAVE FAILED",
    );

    console.error(
      "============================================================",
    );

    console.error(
      "Application ID:",
      application?._id
        ? String(application._id)
        : applicationId,
    );

    console.error(
      "Application Reference:",
      application?.applicationReference || "N/A",
    );

    console.error(
      "Previous Assigned To:",
      previousAssignedTo
        ? String(previousAssignedTo)
        : null,
    );

    console.error(
      "New Assigned To:",
      application?.assignedTo
        ? String(application.assignedTo)
        : null,
    );

    console.error(
      "Updated By:",
      updatedBy
        ? String(updatedBy)
        : null,
    );

    console.error(
      "Error Name:",
      error?.name || "UnknownError",
    );

    console.error(
      "Error Message:",
      error?.message || "Unknown error",
    );

    console.error(
      "Error Code:",
      error?.code || "N/A",
    );

    if (error?.errors) {
      console.error(
        "Validation Errors:",
        Object.fromEntries(
          Object.entries(error.errors).map(
            ([field, fieldError]) => [
              field,
              {
                message: fieldError?.message,
                kind: fieldError?.kind,
                path: fieldError?.path,
                value: fieldError?.value,
              },
            ],
          ),
        ),
      );
    }

    console.error(
      "Full Error:",
      error,
    );

    console.error(
      "============================================================",
    );

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | RETURN COMPLETE APPLICATION
  |--------------------------------------------------------------------------
  */

  return await getApplicationById(application._id);
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  getDashboardStats,

  getAllApplications,

  getApplicationById,

  updateApplicationStatus,

  getApplicationNotes,

  addApplicationNote,

  getAssignableStaff,

  assignApplication,
};