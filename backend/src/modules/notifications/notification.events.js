import notificationService from "./notification.service.js";

/*
============================================================
colossus — NOTIFICATION EVENTS
============================================================

This module translates colossus BUSINESS EVENTS into
notifications.

IMPORTANT:

This file does NOT directly create Notification documents.

It delegates notification creation to:

    notificationService

Responsibilities:

    BUSINESS EVENT
          ↓
    notification.events.js
          ↓
    notification.service.js
          ↓
    Notification model
          ↓
    MongoDB

This keeps notification rules centralized and prevents
controllers/services from becoming filled with notification
logic.

SUPPORTED AUDIENCES:

    CLIENT
    ADMIN
    STAFF
    DEVELOPER

============================================================
*/

/*
============================================================
HELPERS
============================================================
*/

/*
------------------------------------------------------------
NORMALIZE ID
------------------------------------------------------------
*/

const getId = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "object" && value._id) {
    return value._id;
  }

  return value;
};

/*
------------------------------------------------------------
GET APPLICATION OWNER
------------------------------------------------------------
*/

const getApplicationOwnerId = (application) => {
  if (!application) {
    return null;
  }

  return getId(application.user);
};

/*
------------------------------------------------------------
GET APPLICATION ID
------------------------------------------------------------
*/

const getApplicationId = (application) => {
  return getId(application);
};

/*
------------------------------------------------------------
GET DOCUMENT ID
------------------------------------------------------------
*/

const getDocumentId = (document) => {
  return getId(document);
};

/*
------------------------------------------------------------
GET PAYMENT ID
------------------------------------------------------------
*/

const getPaymentId = (payment) => {
  return getId(payment);
};

/*
------------------------------------------------------------
GET BOOKING ID
------------------------------------------------------------
*/

const getBookingId = (booking) => {
  return getId(booking);
};

/*
============================================================
APPLICATION EVENTS
============================================================
*/

/*
------------------------------------------------------------
APPLICATION CREATED
------------------------------------------------------------

Triggered when a new migration application is created.

Audience:

    ADMIN
    STAFF

------------------------------------------------------------
*/

export const notifyApplicationCreated = async ({
  application,
  actorId = null,
} = {}) => {
  const applicationId = getApplicationId(application);

  if (!applicationId) {
    return [];
  }

  return notificationService.createForRoles({
    roles: ["ADMIN", "STAFF"],

    actorId,

    title: "New Application Created",

    message:
      "A new migration application has been created and requires operational attention.",

    type: "APPLICATION_CREATED",

    entityType: "APPLICATION",

    entityId: applicationId,

    metadata: {
      applicationId,
    },

    priority: "NORMAL",
  });
};

/*
------------------------------------------------------------
APPLICATION SUBMITTED
------------------------------------------------------------

Triggered when a client formally submits an application.

Audience:

    ADMIN
    STAFF

------------------------------------------------------------
*/

export const notifyApplicationSubmitted = async ({
  application,
  actorId = null,
} = {}) => {
  const applicationId = getApplicationId(application);

  if (!applicationId) {
    return [];
  }

  return notificationService.createForRoles({
    roles: ["ADMIN", "STAFF"],

    actorId,

    title: "Application Submitted",

    message:
      "A migration application has been submitted and is ready for review.",

    type: "APPLICATION_SUBMITTED",

    entityType: "APPLICATION",

    entityId: applicationId,

    metadata: {
      applicationId,
    },

    priority: "HIGH",
  });
};

/*
------------------------------------------------------------
APPLICATION UPDATED
------------------------------------------------------------

Generic application update.

Audience:

    ADMIN
    STAFF

------------------------------------------------------------
*/

export const notifyApplicationUpdated = async ({
  application,
  actorId = null,
  changes = {},
} = {}) => {
  const applicationId = getApplicationId(application);

  if (!applicationId) {
    return [];
  }

  return notificationService.createForRoles({
    roles: ["ADMIN", "STAFF"],

    actorId,

    title: "Application Updated",

    message:
      "A migration application has been updated and may require attention.",

    type: "APPLICATION_UPDATED",

    entityType: "APPLICATION",

    entityId: applicationId,

    metadata: {
      applicationId,
      changes,
    },

    priority: "NORMAL",
  });
};

/*
------------------------------------------------------------
APPLICATION STATUS CHANGED
------------------------------------------------------------

This is one of the most important notification events.

Audience:

    CLIENT

------------------------------------------------------------
*/

export const notifyApplicationStatusChanged = async ({
  application,
  actorId = null,
  previousStatus = null,
  newStatus = null,
  notes = null,
} = {}) => {
  const applicationId = getApplicationId(application);
  const userId = getApplicationOwnerId(application);

  if (!applicationId || !userId) {
    return null;
  }

  const normalizedNewStatus = String(newStatus || "")
    .trim()
    .replace(/_/g, " ")
    .toLowerCase();

  return notificationService.createForApplicationOwner({
    application,

    actorId,

    title: "Application Status Updated",

    message: normalizedNewStatus
      ? `Your migration application status has been updated to ${normalizedNewStatus}.`
      : "Your migration application status has been updated.",

    type: "APPLICATION_STATUS_CHANGED",

    entityType: "APPLICATION",

    entityId: applicationId,

    metadata: {
      applicationId,

      previousStatus,

      newStatus,

      notes,
    },

    priority: "HIGH",
  });
};

/*
------------------------------------------------------------
APPLICATION APPROVED
------------------------------------------------------------
*/

export const notifyApplicationApproved = async ({
  application,
  actorId = null,
} = {}) => {
  const applicationId = getApplicationId(application);
  const userId = getApplicationOwnerId(application);

  if (!applicationId || !userId) {
    return null;
  }

  return notificationService.createForApplicationOwner({
    application,

    actorId,

    title: "Application Approved",

    message:
      "Your migration application has been approved. Please check your application for the next steps.",

    type: "APPLICATION_APPROVED",

    entityType: "APPLICATION",

    entityId: applicationId,

    metadata: {
      applicationId,
    },

    priority: "HIGH",
  });
};

/*
------------------------------------------------------------
APPLICATION REJECTED
------------------------------------------------------------
*/

export const notifyApplicationRejected = async ({
  application,
  actorId = null,
  reason = null,
} = {}) => {
  const applicationId = getApplicationId(application);
  const userId = getApplicationOwnerId(application);

  if (!applicationId || !userId) {
    return null;
  }

  return notificationService.createForApplicationOwner({
    application,

    actorId,

    title: "Application Update Required",

    message:
      "There has been an update to your migration application. Please review the application details.",

    type: "APPLICATION_REJECTED",

    entityType: "APPLICATION",

    entityId: applicationId,

    metadata: {
      applicationId,

      reason,
    },

    priority: "URGENT",
  });
};

/*
============================================================
DOCUMENT EVENTS
============================================================
*/

/*
------------------------------------------------------------
DOCUMENT UPLOADED
------------------------------------------------------------

Client uploads document.

Audience:

    ADMIN
    STAFF

------------------------------------------------------------
*/

export const notifyDocumentUploaded = async ({
  document,
  application = null,
  actorId = null,
} = {}) => {
  const documentId = getDocumentId(document);
  const applicationId =
    getApplicationId(application) || getId(document?.application);

  if (!documentId) {
    return [];
  }

  return notificationService.createForRoles({
    roles: ["ADMIN", "STAFF"],

    actorId,

    title: "New Document Uploaded",

    message: "A client has uploaded a document that requires review.",

    type: "DOCUMENT_UPLOADED",

    entityType: "DOCUMENT",

    entityId: documentId,

    metadata: {
      documentId,

      applicationId,
    },

    priority: "HIGH",
  });
};

/*
------------------------------------------------------------
DOCUMENT UPDATED
------------------------------------------------------------
*/

export const notifyDocumentUpdated = async ({
  document,
  actorId = null,
} = {}) => {
  const documentId = getDocumentId(document);

  if (!documentId) {
    return [];
  }

  return notificationService.createForRoles({
    roles: ["ADMIN", "STAFF"],

    actorId,

    title: "Document Updated",

    message: "A migration document has been updated and may require review.",

    type: "DOCUMENT_UPDATED",

    entityType: "DOCUMENT",

    entityId: documentId,

    metadata: {
      documentId,
    },

    priority: "NORMAL",
  });
};

/*
------------------------------------------------------------
DOCUMENT APPROVED
------------------------------------------------------------

Audience:

    CLIENT

------------------------------------------------------------
*/

export const notifyDocumentApproved = async ({
  document,
  application = null,
  actorId = null,
} = {}) => {
  const documentId = getDocumentId(document);
  const resolvedApplication = application || document?.application;

  if (!documentId || !resolvedApplication) {
    return null;
  }

  return notificationService.createForApplicationOwner({
    application: resolvedApplication,

    actorId,

    title: "Document Approved",

    message: "One of your migration documents has been approved.",

    type: "DOCUMENT_APPROVED",

    entityType: "DOCUMENT",

    entityId: documentId,

    metadata: {
      documentId,

      applicationId: getApplicationId(resolvedApplication),
    },

    priority: "NORMAL",
  });
};

/*
------------------------------------------------------------
DOCUMENT REJECTED
------------------------------------------------------------
*/

export const notifyDocumentRejected = async ({
  document,
  application = null,
  actorId = null,
  reason = null,
} = {}) => {
  const documentId = getDocumentId(document);
  const resolvedApplication = application || document?.application;

  if (!documentId || !resolvedApplication) {
    return null;
  }

  return notificationService.createForApplicationOwner({
    application: resolvedApplication,

    actorId,

    title: "Document Rejected",

    message:
      "One of your migration documents was rejected. Please review the requirements and upload a valid replacement.",

    type: "DOCUMENT_REJECTED",

    entityType: "DOCUMENT",

    entityId: documentId,

    metadata: {
      documentId,

      applicationId: getApplicationId(resolvedApplication),

      reason,
    },

    priority: "HIGH",
  });
};

/*
------------------------------------------------------------
DOCUMENT REUPLOAD REQUIRED
------------------------------------------------------------
*/

export const notifyDocumentReuploadRequired = async ({
  document,
  application = null,
  actorId = null,
  reason = null,
} = {}) => {
  const documentId = getDocumentId(document);
  const resolvedApplication = application || document?.application;

  if (!documentId || !resolvedApplication) {
    return null;
  }

  return notificationService.createForApplicationOwner({
    application: resolvedApplication,

    actorId,

    title: "Document Re-upload Required",

    message:
      "A document in your migration application needs to be uploaded again.",

    type: "DOCUMENT_REUPLOAD_REQUIRED",

    entityType: "DOCUMENT",

    entityId: documentId,

    metadata: {
      documentId,

      applicationId: getApplicationId(resolvedApplication),

      reason,
    },

    priority: "URGENT",
  });
};

/*
============================================================
PROFILE EVENTS
============================================================
*/

/*
------------------------------------------------------------
PROFILE UPDATED
------------------------------------------------------------
*/

export const notifyProfileUpdated = async ({
  userId,
  actorId = null,
  changes = {},
} = {}) => {
  if (!userId) {
    return null;
  }

  return notificationService.createForUser({
    userId,

    actorId,

    title: "Profile Updated",

    message: "Your colossus profile has been updated successfully.",

    type: "PROFILE_UPDATED",

    entityType: "PROFILE",

    metadata: {
      changes,
    },

    priority: "LOW",
  });
};

/*
------------------------------------------------------------
PROFILE COMPLETED
------------------------------------------------------------
*/

export const notifyProfileCompleted = async ({
  userId,
  actorId = null,
} = {}) => {
  if (!userId) {
    return null;
  }

  return notificationService.createForUser({
    userId,

    actorId,

    title: "Profile Completed",

    message: "Your colossus profile is now complete.",

    type: "PROFILE_COMPLETED",

    entityType: "PROFILE",

    metadata: {
      userId,
    },

    priority: "NORMAL",
  });
};

/*
============================================================
PAYMENT EVENTS
============================================================
*/

/*
------------------------------------------------------------
PAYMENT CREATED
------------------------------------------------------------
*/

export const notifyPaymentCreated = async ({
  payment,
  userId = null,
  actorId = null,
} = {}) => {
  const paymentId = getPaymentId(payment);
  const recipientId = userId || payment?.user || payment?.client;

  if (!paymentId || !recipientId) {
    return null;
  }

  return notificationService.createForUser({
    userId: getId(recipientId),

    actorId,

    title: "Payment Created",

    message: "A payment record has been created for your colossus account.",

    type: "PAYMENT_CREATED",

    entityType: "PAYMENT",

    entityId: paymentId,

    metadata: {
      paymentId,
    },

    priority: "NORMAL",
  });
};

/*
------------------------------------------------------------
PAYMENT RECEIVED
------------------------------------------------------------
*/

export const notifyPaymentReceived = async ({
  payment,
  userId = null,
  actorId = null,
} = {}) => {
  const paymentId = getPaymentId(payment);
  const recipientId = userId || payment?.user || payment?.client;

  if (!paymentId || !recipientId) {
    return null;
  }

  return notificationService.createForUser({
    userId: getId(recipientId),

    actorId,

    title: "Payment Received",

    message: "Your payment has been received successfully.",

    type: "PAYMENT_RECEIVED",

    entityType: "PAYMENT",

    entityId: paymentId,

    metadata: {
      paymentId,

      reference: payment?.reference || payment?.transactionReference || null,
    },

    priority: "HIGH",
  });
};

/*
------------------------------------------------------------
PAYMENT PENDING
------------------------------------------------------------
*/

export const notifyPaymentPending = async ({
  payment,
  userId = null,
  actorId = null,
} = {}) => {
  const paymentId = getPaymentId(payment);
  const recipientId = userId || payment?.user || payment?.client;

  if (!paymentId || !recipientId) {
    return null;
  }

  return notificationService.createForUser({
    userId: getId(recipientId),

    actorId,

    title: "Payment Pending",

    message: "Your payment is currently pending confirmation.",

    type: "PAYMENT_PENDING",

    entityType: "PAYMENT",

    entityId: paymentId,

    metadata: {
      paymentId,
    },

    priority: "NORMAL",
  });
};

/*
------------------------------------------------------------
PAYMENT FAILED
------------------------------------------------------------
*/

export const notifyPaymentFailed = async ({
  payment,
  userId = null,
  actorId = null,
  reason = null,
} = {}) => {
  const paymentId = getPaymentId(payment);
  const recipientId = userId || payment?.user || payment?.client;

  if (!paymentId || !recipientId) {
    return null;
  }

  return notificationService.createForUser({
    userId: getId(recipientId),

    actorId,

    title: "Payment Failed",

    message:
      "Your payment could not be completed. Please try again or contact colossus support.",

    type: "PAYMENT_FAILED",

    entityType: "PAYMENT",

    entityId: paymentId,

    metadata: {
      paymentId,

      reason,
    },

    priority: "HIGH",
  });
};

/*
------------------------------------------------------------
PAYMENT REFUNDED
------------------------------------------------------------
*/

export const notifyPaymentRefunded = async ({
  payment,
  userId = null,
  actorId = null,
} = {}) => {
  const paymentId = getPaymentId(payment);
  const recipientId = userId || payment?.user || payment?.client;

  if (!paymentId || !recipientId) {
    return null;
  }

  return notificationService.createForUser({
    userId: getId(recipientId),

    actorId,

    title: "Payment Refunded",

    message: "Your payment has been refunded.",

    type: "PAYMENT_REFUNDED",

    entityType: "PAYMENT",

    entityId: paymentId,

    metadata: {
      paymentId,
    },

    priority: "HIGH",
  });
};

/*
============================================================
BOOKING EVENTS
============================================================
*/

/*
------------------------------------------------------------
BOOKING CREATED
------------------------------------------------------------
*/

export const notifyBookingCreated = async ({
  booking,
  userId = null,
  actorId = null,
} = {}) => {
  const bookingId = getBookingId(booking);
  const recipientId = userId || booking?.user || booking?.client;

  if (!bookingId || !recipientId) {
    return null;
  }

  return notificationService.createForUser({
    userId: getId(recipientId),

    actorId,

    title: "Booking Created",

    message: "Your consultation booking has been created successfully.",

    type: "BOOKING_CREATED",

    entityType: "BOOKING",

    entityId: bookingId,

    metadata: {
      bookingId,
    },

    priority: "NORMAL",
  });
};

/*
------------------------------------------------------------
BOOKING UPDATED
------------------------------------------------------------
*/

export const notifyBookingUpdated = async ({
  booking,
  userId = null,
  actorId = null,
  changes = {},
} = {}) => {
  const bookingId = getBookingId(booking);
  const recipientId = userId || booking?.user || booking?.client;

  if (!bookingId || !recipientId) {
    return null;
  }

  return notificationService.createForUser({
    userId: getId(recipientId),

    actorId,

    title: "Booking Updated",

    message: "Your consultation booking has been updated.",

    type: "BOOKING_UPDATED",

    entityType: "BOOKING",

    entityId: bookingId,

    metadata: {
      bookingId,

      changes,
    },

    priority: "NORMAL",
  });
};

/*
------------------------------------------------------------
BOOKING CONFIRMED
------------------------------------------------------------
*/

export const notifyBookingConfirmed = async ({
  booking,
  userId = null,
  actorId = null,
} = {}) => {
  const bookingId = getBookingId(booking);
  const recipientId = userId || booking?.user || booking?.client;

  if (!bookingId || !recipientId) {
    return null;
  }

  return notificationService.createForUser({
    userId: getId(recipientId),

    actorId,

    title: "Booking Confirmed",

    message: "Your consultation booking has been confirmed.",

    type: "BOOKING_CONFIRMED",

    entityType: "BOOKING",

    entityId: bookingId,

    metadata: {
      bookingId,
    },

    priority: "HIGH",
  });
};

/*
------------------------------------------------------------
BOOKING CANCELLED
------------------------------------------------------------
*/

export const notifyBookingCancelled = async ({
  booking,
  userId = null,
  actorId = null,
  reason = null,
} = {}) => {
  const bookingId = getBookingId(booking);
  const recipientId = userId || booking?.user || booking?.client;

  if (!bookingId || !recipientId) {
    return null;
  }

  return notificationService.createForUser({
    userId: getId(recipientId),

    actorId,

    title: "Booking Cancelled",

    message: "Your consultation booking has been cancelled.",

    type: "BOOKING_CANCELLED",

    entityType: "BOOKING",

    entityId: bookingId,

    metadata: {
      bookingId,

      reason,
    },

    priority: "HIGH",
  });
};

/*
============================================================
ADMIN / STAFF EVENTS
============================================================
*/

/*
------------------------------------------------------------
ADMIN ACTION
------------------------------------------------------------

Used when an important administrative action should be
visible to another operational user.

------------------------------------------------------------
*/

export const notifyAdminAction = async ({
  userIds = [],
  actorId = null,
  title,
  message,
  entityType = "NONE",
  entityId = null,
  metadata = {},
  priority = "NORMAL",
} = {}) => {
  return notificationService.createForUsers({
    userIds,

    actorId,

    title,

    message,

    type: "ADMIN_ACTION",

    entityType,

    entityId,

    metadata,

    priority,
  });
};

/*
------------------------------------------------------------
STAFF ACTION
------------------------------------------------------------
*/

export const notifyStaffAction = async ({
  userIds = [],
  actorId = null,
  title,
  message,
  entityType = "NONE",
  entityId = null,
  metadata = {},
  priority = "NORMAL",
} = {}) => {
  return notificationService.createForUsers({
    userIds,

    actorId,

    title,

    message,

    type: "STAFF_ACTION",

    entityType,

    entityId,

    metadata,

    priority,
  });
};

/*
============================================================
MESSAGE EVENT
============================================================
*/

export const notifyMessageReceived = async ({
  userId,
  actorId = null,
  message,
  entityType = "NONE",
  entityId = null,
  metadata = {},
} = {}) => {
  if (!userId) {
    return null;
  }

  return notificationService.createForUser({
    userId,

    actorId,

    title: "New Message",

    message: message || "You have received a new message on colossus.",

    type: "MESSAGE_RECEIVED",

    entityType,

    entityId,

    metadata,

    priority: "NORMAL",
  });
};

/*
============================================================
SYSTEM EVENT
============================================================
*/

export const notifySystem = async ({
  userIds = [],
  roles = [],
  actorId = null,
  title = "System Notification",
  message,
  entityType = "SYSTEM",
  entityId = null,
  metadata = {},
  priority = "NORMAL",
} = {}) => {
  const results = [];

  /*
  ----------------------------------------------------------
  DIRECT USERS
  ----------------------------------------------------------
  */

  if (Array.isArray(userIds) && userIds.length) {
    const userNotifications = await notificationService.createForUsers({
      userIds,

      actorId,

      title,

      message,

      type: "SYSTEM",

      entityType,

      entityId,

      metadata,

      priority,
    });

    results.push(...userNotifications);
  }

  /*
  ----------------------------------------------------------
  ROLES
  ----------------------------------------------------------
  */

  if (Array.isArray(roles) && roles.length) {
    const roleNotifications = await notificationService.createForRoles({
      roles,

      actorId,

      title,

      message,

      type: "SYSTEM",

      entityType,

      entityId,

      metadata,

      priority,
    });

    results.push(...roleNotifications);
  }

  return results;
};

/*
============================================================
GENERAL EVENT
============================================================
*/

export const notifyGeneral = async ({
  userId,
  actorId = null,
  title,
  message,
  entityType = "NONE",
  entityId = null,
  metadata = {},
  priority = "NORMAL",
} = {}) => {
  if (!userId) {
    return null;
  }

  return notificationService.createForUser({
    userId,

    actorId,

    title,

    message,

    type: "GENERAL",

    entityType,

    entityId,

    metadata,

    priority,
  });
};

/*
============================================================
EXPORT
============================================================
*/

export default {
  /*
  APPLICATION
  */

  notifyApplicationCreated,

  notifyApplicationUpdated,

  notifyApplicationSubmitted,

  notifyApplicationStatusChanged,

  notifyApplicationApproved,

  notifyApplicationRejected,

  /*
  DOCUMENT
  */

  notifyDocumentUploaded,

  notifyDocumentUpdated,

  notifyDocumentApproved,

  notifyDocumentRejected,

  notifyDocumentReuploadRequired,

  /*
  PROFILE
  */

  notifyProfileUpdated,

  notifyProfileCompleted,

  /*
  PAYMENT
  */

  notifyPaymentCreated,

  notifyPaymentReceived,

  notifyPaymentPending,

  notifyPaymentFailed,

  notifyPaymentRefunded,

  /*
  BOOKING
  */

  notifyBookingCreated,

  notifyBookingUpdated,

  notifyBookingConfirmed,

  notifyBookingCancelled,

  /*
  ADMIN / STAFF
  */

  notifyAdminAction,

  notifyStaffAction,

  /*
  MESSAGE / SYSTEM
  */

  notifyMessageReceived,

  notifySystem,

  notifyGeneral,
};
