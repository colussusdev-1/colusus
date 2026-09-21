import Application from "../applications/application.model.js";

import notificationService from "../notifications/notification.service.js";

import {
  getApplicationNotificationData,
  getDocumentNotificationData,
} from "./workflow.helpers.js";

import { getApplicationProgress } from "./workflow.progress.js";

/*
|--------------------------------------------------------------------------
| colossus — WORKFLOW SERVICE
|--------------------------------------------------------------------------
|
| Central workflow coordination service.
|
| RESPONSIBILITIES:
|
| - Application workflow progress
| - Application status change handling
| - Client application notifications
| - Admin operational notifications
| - Assigned Staff operational notifications
|
| IMPORTANT:
|
| Staff notifications must respect application assignment.
|
| Staff should NOT receive notifications for applications that
| are assigned to another Staff member.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET APPLICATION NOTIFICATION CONTEXT
|--------------------------------------------------------------------------
|
| Collects the real application information needed by
| notification workflows.
|
|--------------------------------------------------------------------------
*/

const getApplicationNotificationContext = async (applicationId) => {
  const application = await Application.findById(applicationId)
    .populate("user", "name email")
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

/*
|--------------------------------------------------------------------------
| BUILD ADMIN NOTIFICATION
|--------------------------------------------------------------------------
|
| Admin receives operational information about every relevant
| application workflow event.
|
|--------------------------------------------------------------------------
*/

const buildAdminNotification = ({
  applicationContext,

  status,
}) => {
  let title = "Application updated";

  let message = `${applicationContext.clientName}'s application ${applicationContext.applicationReference} has been updated.`;

  let priority = "NORMAL";

  switch (
    String(status || "")
      .trim()
      .toUpperCase()
  ) {
    case "UNDER_REVIEW":
      title = "Application moved to review";

      message = `${applicationContext.clientName}'s ${
        applicationContext.applicationType || "application"
      } for ${
        applicationContext.destinationCountry || "the selected destination"
      } is now under review.`;

      priority = "HIGH";

      break;

    case "APPROVED":
      title = "Application approved";

      message = `${applicationContext.clientName}'s ${applicationContext.applicationReference} application has been approved.`;

      priority = "NORMAL";

      break;

    case "REJECTED":
      title = "Application rejected";

      message = `${applicationContext.clientName}'s ${applicationContext.applicationReference} application has been rejected and requires attention.`;

      priority = "HIGH";

      break;

    case "SUBMITTED":
      title = "Application submitted";

      message = `${applicationContext.clientName} submitted application ${applicationContext.applicationReference} for ${
        applicationContext.destinationCountry || "a destination"
      }.`;

      priority = "NORMAL";

      break;

    case "DOCUMENT_REQUEST":
      title = "Additional documents requested";

      message = `${applicationContext.clientName}'s application ${applicationContext.applicationReference} requires additional documents.`;

      priority = "HIGH";

      break;

    case "PROCESSING":
      title = "Application processing started";

      message = `${applicationContext.clientName}'s application ${applicationContext.applicationReference} has moved into processing.`;

      priority = "NORMAL";

      break;

    default:
      title = "Application status updated";

      message = `${applicationContext.clientName}'s application ${applicationContext.applicationReference} is now ${String(
        status || "",
      )
        .replace(/_/g, " ")
        .toLowerCase()}.`;

      break;
  }

  return {
    title,

    message,

    priority,
  };
};

/*
|--------------------------------------------------------------------------
| BUILD NOTIFICATION METADATA
|--------------------------------------------------------------------------
*/

const buildApplicationNotificationMetadata = ({
  applicationContext,

  status,

  progress,

  event,
}) => {
  return {
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
  };
};

/*
|--------------------------------------------------------------------------
| HANDLE APPLICATION STATUS CHANGE
|--------------------------------------------------------------------------
|
| Called when an application's status changes.
|
| RESPONSIBILITIES:
|
| 1. Calculate application progress
| 2. Persist progress
| 3. Notify application owner
| 4. Notify Admin users
| 5. Notify the assigned Staff member
|
|--------------------------------------------------------------------------
*/

const handleApplicationStatusChange = async ({
  userId = null,

  applicationId,

  status,

  actorId = null,
}) => {
  /*
  |--------------------------------------------------------------------------
  | VALIDATE APPLICATION
  |--------------------------------------------------------------------------
  */

  if (!applicationId) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | CALCULATE OVERALL APPLICATION PROGRESS
  |--------------------------------------------------------------------------
  */

  const progress = getApplicationProgress(status);

  /*
  |--------------------------------------------------------------------------
  | UPDATE APPLICATION PROGRESS
  |--------------------------------------------------------------------------
  */

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
    .populate("user", "name email")
    .populate("assignedTo", "name email role");

  /*
  |--------------------------------------------------------------------------
  | APPLICATION NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (!application) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | DETERMINE CLIENT
  |--------------------------------------------------------------------------
  |
  | Prefer the application owner over the supplied userId.
  |
  |--------------------------------------------------------------------------
  */

  const applicationOwnerId =
    application.user?._id || application.user || userId || null;

  /*
  |--------------------------------------------------------------------------
  | CLIENT NOTIFICATION DATA
  |--------------------------------------------------------------------------
  */

  const notificationData = getApplicationNotificationData(status);

  /*
  |--------------------------------------------------------------------------
  | CLIENT NOTIFICATION
  |--------------------------------------------------------------------------
  */

  let clientNotification = null;

  if (applicationOwnerId) {
    clientNotification = await notificationService.createForApplicationOwner({
      application,

      actorId,

      title: notificationData.title,

      message: notificationData.message,

      type: notificationData.type,

      entityType: "APPLICATION",

      entityId: application._id,

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
    });
  }

  /*
  |--------------------------------------------------------------------------
  | GET FULL APPLICATION CONTEXT
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

  /*
  |--------------------------------------------------------------------------
  | ADMIN NOTIFICATION
  |--------------------------------------------------------------------------
  |
  | Admin has global operational visibility.
  |
  | Therefore Admin receives the application workflow
  | notification regardless of assignment.
  |
  |--------------------------------------------------------------------------
  */

  const adminNotification = buildAdminNotification({
    applicationContext,

    status,
  });

  await notificationService.createForRoles({
    roles: ["ADMIN"],

    actorId,

    title: adminNotification.title,

    message: adminNotification.message,

    type: "APPLICATION_STATUS_CHANGED",

    entityType: "APPLICATION",

    entityId: application._id,

    metadata: buildApplicationNotificationMetadata({
      applicationContext,

      status,

      progress,

      event: "APPLICATION_STATUS_CHANGED",
    }),

    priority: adminNotification.priority,
  });

  /*
  |--------------------------------------------------------------------------
  | ASSIGNED STAFF NOTIFICATION
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | We DO NOT notify all STAFF users.
  |
  | Only the Staff member currently assigned to this
  | application receives the operational notification.
  |
  |--------------------------------------------------------------------------
  */

  const assignedStaffId =
    application.assignedTo?._id || application.assignedTo || null;

  if (assignedStaffId) {
    await notificationService.createForUsers({
      userIds: [assignedStaffId],

      actorId,

      title: adminNotification.title,

      message: adminNotification.message,

      type: "APPLICATION_STATUS_CHANGED",

      entityType: "APPLICATION",

      entityId: application._id,

      metadata: buildApplicationNotificationMetadata({
        applicationContext,

        status,

        progress,

        event: "APPLICATION_STATUS_CHANGED",
      }),

      priority: adminNotification.priority,
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

/*
|--------------------------------------------------------------------------
| HANDLE DOCUMENT STATUS CHANGE
|--------------------------------------------------------------------------
|
| This remains available for workflows that explicitly change
| document status.
|
| Detailed document workflow notifications are currently
| handled by document.service.js.
|
|--------------------------------------------------------------------------
*/

const handleDocumentStatusChange = async ({
  userId,

  documentId,

  status,

  actorId = null,
}) => {
  /*
  |--------------------------------------------------------------------------
  | VALIDATE REQUIRED VALUES
  |--------------------------------------------------------------------------
  */

  if (!userId || !documentId) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | BUILD NOTIFICATION DATA
  |--------------------------------------------------------------------------
  */

  const notificationData = getDocumentNotificationData(status);

  /*
  |--------------------------------------------------------------------------
  | CREATE CLIENT NOTIFICATION
  |--------------------------------------------------------------------------
  */

  return notificationService.createForUser({
    userId,

    actorId,

    title: notificationData.title,

    message: notificationData.message,

    type: notificationData.type,

    entityType: "DOCUMENT",

    entityId: documentId,

    metadata: {
      documentId,

      status,

      event: "DOCUMENT_STATUS_CHANGED",
    },
  });
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  handleApplicationStatusChange,

  handleDocumentStatusChange,
};
