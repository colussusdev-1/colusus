import Application from "../applications/application.model.js";
import User from "../users/user.model.js";

import { notifyUser } from "../notifications/notification.policy.js";

import {
  getApplicationNotificationData,
  getDocumentNotificationData,
} from "./workflow.helpers.js";

import { getApplicationProgress } from "./workflow.progress.js";

/*
|--------------------------------------------------------------------------
| COLOSSUS — WORKFLOW SERVICE
|--------------------------------------------------------------------------
|
| Responsibilities:
| - Application workflow progress.
| - Client application notifications.
| - Admin operational notifications.
| - Assigned staff operational notifications.
| - Document status notifications.
|
| IMPORTANT:
| - Staff notifications respect application assignment.
| - Notifications use the new notification policy.
| - Notification failures must not undo saved workflow changes.
|--------------------------------------------------------------------------
*/

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const normalizeStatus = (status) =>
  String(status || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

/* -------------------------------------------------------------------------- */
/* APPLICATION NOTIFICATION CONTEXT                                           */
/* -------------------------------------------------------------------------- */

const getApplicationNotificationContext = async (applicationId) => {
  const application = await Application.findById(applicationId)
    .populate("user", "name email role")
    .populate("assignedTo", "name email role")
    .lean();

  if (!application) {
    return null;
  }

  const opportunity = application.opportunitySnapshot || {};

  return {
    applicationId: application._id,

    applicationReference: application.applicationReference || "",

    clientId: application.user?._id || application.user || null,

    clientName: application.user?.name || "Client",

    clientEmail: application.user?.email || "",

    applicationType: application.type || opportunity.type || "",

    opportunityTitle: opportunity.title || "",

    destinationCountry:
      application.destinationCountry || opportunity.countryName || "",

    category: opportunity.category || "",

    status: application.status || "",

    currentStep: application.currentStep || "",

    progress: application.progress ?? 0,

    documentProgress: application.documentProgress || {},

    assignedTo: application.assignedTo || null,

    priority: application.priority || "NORMAL",
  };
};

/* -------------------------------------------------------------------------- */
/* BUILD ADMIN NOTIFICATION                                                   */
/* -------------------------------------------------------------------------- */

const buildAdminNotification = ({ applicationContext, status }) => {
  const normalizedStatus = normalizeStatus(status);

  let title = "Application status updated";

  let message =
    `${applicationContext.clientName}'s application ` +
    `${applicationContext.applicationReference} has been updated.`;

  let priority = "NORMAL";

  switch (normalizedStatus) {
    case "UNDER_REVIEW":
      title = "Application moved to review";

      message =
        `${applicationContext.clientName}'s ` +
        `${applicationContext.applicationType || "application"} for ` +
        `${applicationContext.destinationCountry || "the selected destination"} ` +
        "is now under review.";

      priority = "HIGH";
      break;

    case "APPROVED":
      title = "Application approved";

      message =
        `${applicationContext.clientName}'s application ` +
        `${applicationContext.applicationReference} has been approved.`;

      break;

    case "REJECTED":
      title = "Application rejected";

      message =
        `${applicationContext.clientName}'s application ` +
        `${applicationContext.applicationReference} has been rejected ` +
        "and requires attention.";

      priority = "HIGH";
      break;

    case "SUBMITTED":
      title = "Application submitted";

      message =
        `${applicationContext.clientName} submitted application ` +
        `${applicationContext.applicationReference} for ` +
        `${applicationContext.destinationCountry || "a destination"}.`;

      break;

    case "DOCUMENT_REQUEST":
      title = "Additional documents requested";

      message =
        `${applicationContext.clientName}'s application ` +
        `${applicationContext.applicationReference} requires additional documents.`;

      priority = "HIGH";
      break;

    case "PROCESSING":
      title = "Application processing started";

      message =
        `${applicationContext.clientName}'s application ` +
        `${applicationContext.applicationReference} has moved into processing.`;

      break;

    default:
      message =
        `${applicationContext.clientName}'s application ` +
        `${applicationContext.applicationReference} is now ` +
        `${normalizedStatus.toLowerCase().replace(/_/g, " ")}.`;
  }

  return {
    title,
    message,
    priority,
  };
};

/* -------------------------------------------------------------------------- */
/* BUILD APPLICATION NOTIFICATION METADATA                                    */
/* -------------------------------------------------------------------------- */

const buildApplicationNotificationMetadata = ({
  applicationContext,
  status,
  progress,
  event,
}) => ({
  applicationId: applicationContext.applicationId,

  applicationReference: applicationContext.applicationReference,

  clientId: applicationContext.clientId,

  clientName: applicationContext.clientName,

  clientEmail: applicationContext.clientEmail,

  applicationType: applicationContext.applicationType,

  opportunityTitle: applicationContext.opportunityTitle,

  destinationCountry: applicationContext.destinationCountry,

  category: applicationContext.category,

  applicationStatus: status,

  currentStep: applicationContext.currentStep,

  progress,

  documentProgress: applicationContext.documentProgress,

  assignedTo: applicationContext.assignedTo,

  priority: applicationContext.priority,

  event,
});

/* -------------------------------------------------------------------------- */
/* SEND NOTIFICATION SAFELY                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Notifications are secondary to the business operation.
 *
 * A notification failure is logged and returned as null rather than
 * propagating an exception into the saved application workflow.
 */
const sendNotificationSafely = async (label, payload) => {
  try {
    return await notifyUser(payload);
  } catch (error) {
    console.error(`[WORKFLOW] ${label} notification failed:`, error.message);

    return null;
  }
};

/* -------------------------------------------------------------------------- */
/* HANDLE APPLICATION STATUS CHANGE                                           */
/* -------------------------------------------------------------------------- */

const handleApplicationStatusChange = async ({
  userId = null,
  applicationId,
  status,
  actorId = null,
}) => {
  if (!applicationId) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | UPDATE APPLICATION PROGRESS
  |--------------------------------------------------------------------------
  */

  const progress = getApplicationProgress(status);

  const application = await Application.findByIdAndUpdate(
    applicationId,
    {
      $set: {
        progress,
      },
    },
    {
      new: true,
    },
  )
    .populate("user", "name email role")
    .populate("assignedTo", "name email role");

  if (!application) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | RESOLVE APPLICATION OWNER
  |--------------------------------------------------------------------------
  */

  const applicationOwnerId =
    application.user?._id || application.user || userId || null;

  const notificationData = getApplicationNotificationData(status);

  /*
  |--------------------------------------------------------------------------
  | CLIENT NOTIFICATION
  |--------------------------------------------------------------------------
  */

  let clientNotification = null;

  if (applicationOwnerId) {
    clientNotification = await sendNotificationSafely(
      "Client application status",
      {
        user: applicationOwnerId,

        role: "CLIENT",

        actor: actorId,

        category: "APPLICATION",

        type: "STATUS_CHANGED",

        title: notificationData.title,

        message: notificationData.message,

        priority: "NORMAL",

        application: application._id,

        entityType: "APPLICATION",

        entityId: application._id,

        action: "VIEW",

        actionUrl: `/portal/applications/${application._id}`,

        metadata: {
          applicationId: application._id,

          applicationReference: application.applicationReference || "",

          applicationType:
            application.type || application.opportunitySnapshot?.type || "",

          opportunityTitle: application.opportunitySnapshot?.title || "",

          destinationCountry:
            application.destinationCountry ||
            application.opportunitySnapshot?.countryName ||
            "",

          applicationStatus: status,

          currentStep: application.currentStep || "",

          progress,

          documentProgress: application.documentProgress || {},

          event: "APPLICATION_STATUS_CHANGED",
        },
      },
    );
  }

  /*
  |--------------------------------------------------------------------------
  | LOAD APPLICATION CONTEXT
  |--------------------------------------------------------------------------
  */

  const applicationContext =
    await getApplicationNotificationContext(applicationId);

  if (!applicationContext) {
    return {
      clientNotification,
      application,
    };
  }

  const metadata = buildApplicationNotificationMetadata({
    applicationContext,
    status,
    progress,
    event: "APPLICATION_STATUS_CHANGED",
  });

  const adminNotification = buildAdminNotification({
    applicationContext,
    status,
  });

  /*
  |--------------------------------------------------------------------------
  | ADMIN NOTIFICATIONS
  |--------------------------------------------------------------------------
  |
  | Administrators receive operational notifications.
  | Each notification is created for an individual recipient.
  |--------------------------------------------------------------------------
  */

  try {
    const admins = await User.find({
      role: "ADMIN",
      isActive: { $ne: false },
    })
      .select("_id role")
      .lean();

    await Promise.all(
      admins.map((admin) =>
        sendNotificationSafely("Admin application status", {
          user: admin._id,

          role: "ADMIN",

          actor: actorId,

          category: "APPLICATION",

          type: "STATUS_CHANGED",

          title: adminNotification.title,

          message: adminNotification.message,

          priority: adminNotification.priority,

          application: application._id,

          entityType: "APPLICATION",

          entityId: application._id,

          action: "VIEW",

          actionUrl: `/admin/applications/${application._id}`,

          metadata,
        }),
      ),
    );
  } catch (error) {
    console.error(
      "[WORKFLOW] Failed to resolve admin notification recipients:",
      error.message,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | ASSIGNED STAFF NOTIFICATION
  |--------------------------------------------------------------------------
  |
  | Notify only the staff member assigned to this application.
  | Do not broadcast this notification to all staff members.
  |--------------------------------------------------------------------------
  */

  const assignedStaffId =
    application.assignedTo?._id || application.assignedTo || null;

  if (assignedStaffId) {
    await sendNotificationSafely("Assigned staff application status", {
      user: assignedStaffId,

      role: "STAFF",

      actor: actorId,

      category: "APPLICATION",

      type: "STATUS_CHANGED",

      title: adminNotification.title,

      message: adminNotification.message,

      priority: adminNotification.priority,

      application: application._id,

      entityType: "APPLICATION",

      entityId: application._id,

      action: "VIEW",

      actionUrl: `/staff/applications/${application._id}`,

      metadata,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return {
    clientNotification,
    application,
  };
};

/* -------------------------------------------------------------------------- */
/* HANDLE DOCUMENT STATUS CHANGE                                              */
/* -------------------------------------------------------------------------- */

const handleDocumentStatusChange = async ({
  userId,
  documentId,
  status,
  actorId = null,
  applicationId = null,
}) => {
  if (!userId || !documentId) {
    return null;
  }

  const notificationData = getDocumentNotificationData(status);

  /*
  |--------------------------------------------------------------------------
  | MAP DOCUMENT STATUS TO NOTIFICATION TYPE
  |--------------------------------------------------------------------------
  |
  | These values must match notification.types.js.
  |--------------------------------------------------------------------------
  */

  const normalizedStatus = normalizeStatus(status);

  let type = "UPDATED";

  if (normalizedStatus === "APPROVED") {
    type = "APPROVED";
  } else if (normalizedStatus === "REJECTED") {
    type = "REJECTED";
  } else if (normalizedStatus === "REUPLOAD_REQUIRED") {
    type = "REUPLOAD_REQUIRED";
  }

  const requiresAttention = ["REJECTED", "REUPLOAD_REQUIRED"].includes(
    normalizedStatus,
  );

  /*
  |--------------------------------------------------------------------------
  | CREATE CLIENT DOCUMENT NOTIFICATION
  |--------------------------------------------------------------------------
  */

  return sendNotificationSafely("Document status", {
    user: userId,

    role: "CLIENT",

    actor: actorId,

    category: "DOCUMENT",

    type,

    title: notificationData.title,

    message: notificationData.message,

    priority: requiresAttention ? "HIGH" : "NORMAL",

    application: applicationId || null,

    entityType: "DOCUMENT",

    entityId: documentId,

    action: requiresAttention ? "UPLOAD" : "VIEW",

    actionUrl: applicationId
      ? `/portal/applications/${applicationId}`
      : "/portal/documents",

    metadata: {
      documentId,

      applicationId,

      status,

      event: "DOCUMENT_STATUS_CHANGED",
    },
  });
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                      */
/* -------------------------------------------------------------------------- */

export default {
  handleApplicationStatusChange,
  handleDocumentStatusChange,
};
