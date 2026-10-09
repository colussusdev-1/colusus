import User from "../users/user.model.js";

import { NOTIFICATION_AUDIENCES } from "./notification.types.js";

import {
  createNotification,
  createForUsers,
  createForRole,
} from "./notification.service.js";

/* -------------------------------------------------------------------------- */
/* ROLE HELPERS                                                               */
/* -------------------------------------------------------------------------- */

const ROLE_TO_AUDIENCE = {
  CLIENT: NOTIFICATION_AUDIENCES.includes("CLIENT") ? "CLIENT" : null,

  STAFF: NOTIFICATION_AUDIENCES.includes("STAFF") ? "STAFF" : null,

  ADMIN: NOTIFICATION_AUDIENCES.includes("ADMIN") ? "ADMIN" : null,
};

const getAudienceForRole = (role) => {
  const normalized = String(role || "")
    .trim()
    .toUpperCase();

  const audience = ROLE_TO_AUDIENCE[normalized];

  if (!audience) {
    throw new Error(`Unsupported notification recipient role: ${role}`);
  }

  return audience;
};

/* -------------------------------------------------------------------------- */
/* COMMON BUILDERS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Create a notification for one user.
 *
 * The policy layer is responsible for knowing the recipient's audience.
 */
const notifyUser = async ({
  user,
  role,

  actor = null,

  category,
  type,
  title,
  message,

  priority = "NORMAL",

  application = null,

  entityType = "NONE",
  entityId = null,

  action = "NONE",
  actionUrl = null,

  metadata = {},

  expiresAt = null,
}) => {
  const audience = getAudienceForRole(role);

  return createNotification({
    user,
    audience,

    actor,

    category,
    type,
    title,
    message,

    priority,

    application,

    entityType,
    entityId,

    action,
    actionUrl,

    metadata,

    expiresAt,
  });
};

/* -------------------------------------------------------------------------- */
/* APPLICATION POLICIES                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Application created.
 *
 * Client gets confirmation.
 * Staff/Admin can be notified separately when operationally required.
 */
const applicationCreated = async ({
  application,
  actor = null,
  client = null,
}) => {
  const recipient = client || application?.user;

  if (!recipient) {
    throw new Error("Application creation notification requires a client.");
  }

  return notifyUser({
    user: recipient,
    role: "CLIENT",

    actor,

    category: "APPLICATION",
    type: "CREATED",

    title: "Application started",

    message: "Your migration application has been created successfully.",

    priority: "NORMAL",

    application: application._id,

    entityType: "APPLICATION",
    entityId: application._id,

    action: "VIEW",

    actionUrl: `/portal/applications/${application._id}`,

    metadata: {
      applicationNumber: application.applicationNumber || null,
    },
  });
};

/**
 * Application submitted.
 *
 * Client gets confirmation.
 */
const applicationSubmitted = async ({
  application,
  actor = null,
  client = null,
}) => {
  const recipient = client || application?.user;

  if (!recipient) {
    throw new Error("Application submission notification requires a client.");
  }

  return notifyUser({
    user: recipient,
    role: "CLIENT",

    actor,

    category: "APPLICATION",
    type: "SUBMITTED",

    title: "Application submitted",

    message:
      "Your migration application has been submitted successfully and is now being reviewed.",

    priority: "NORMAL",

    application: application._id,

    entityType: "APPLICATION",
    entityId: application._id,

    action: "VIEW",

    actionUrl: `/portal/applications/${application._id}`,

    metadata: {
      applicationNumber: application.applicationNumber || null,
    },
  });
};

/**
 * Application status changed.
 *
 * Client receives the journey-facing notification.
 */
const applicationStatusChanged = async ({
  application,
  actor = null,
  client = null,
  status,
  message,
}) => {
  const recipient = client || application?.user;

  if (!recipient) {
    throw new Error("Application status notification requires a client.");
  }

  const readableStatus = String(status || application?.status || "updated")
    .replace(/_/g, " ")
    .toLowerCase();

  return notifyUser({
    user: recipient,
    role: "CLIENT",

    actor,

    category: "APPLICATION",
    type: "STATUS_CHANGED",

    title: "Application status updated",

    message:
      message ||
      `Your migration application status has been updated to ${readableStatus}.`,

    priority: "NORMAL",

    application: application._id,

    entityType: "APPLICATION",
    entityId: application._id,

    action: "VIEW",

    actionUrl: `/portal/applications/${application._id}`,

    metadata: {
      status: status || application?.status || null,
      applicationNumber: application.applicationNumber || null,
    },
  });
};

/**
 * Application approved.
 */
const applicationApproved = async ({
  application,
  actor = null,
  client = null,
}) => {
  const recipient = client || application?.user;

  if (!recipient) {
    throw new Error("Application approval notification requires a client.");
  }

  return notifyUser({
    user: recipient,
    role: "CLIENT",

    actor,

    category: "APPLICATION",
    type: "APPROVED",

    title: "Application approved",

    message: "Your migration application has been approved.",

    priority: "HIGH",

    application: application._id,

    entityType: "APPLICATION",
    entityId: application._id,

    action: "VIEW",

    actionUrl: `/portal/applications/${application._id}`,

    metadata: {
      applicationNumber: application.applicationNumber || null,
    },
  });
};

/**
 * Application rejected.
 */
const applicationRejected = async ({
  application,
  actor = null,
  client = null,
  reason = null,
}) => {
  const recipient = client || application?.user;

  if (!recipient) {
    throw new Error("Application rejection notification requires a client.");
  }

  return notifyUser({
    user: recipient,
    role: "CLIENT",

    actor,

    category: "APPLICATION",
    type: "REJECTED",

    title: "Application update",

    message:
      reason ||
      "There has been an update to your migration application that requires your attention.",

    priority: "HIGH",

    application: application._id,

    entityType: "APPLICATION",
    entityId: application._id,

    action: "VIEW",

    actionUrl: `/portal/applications/${application._id}`,

    metadata: {
      reason,
      applicationNumber: application.applicationNumber || null,
    },
  });
};

/* -------------------------------------------------------------------------- */
/* DOCUMENT POLICIES                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Document uploaded.
 *
 * Staff need to know that a document is ready for review.
 */
const documentUploaded = async ({ document, application, actor = null }) => {
  if (!application?._id) {
    throw new Error("Document notification requires an application.");
  }

  return createForRole({
    User,

    role: "STAFF",

    actor,

    category: "DOCUMENT",
    type: "UPLOADED",

    title: "New document uploaded",

    message: "A client has uploaded a document that requires review.",

    priority: "NORMAL",

    application: application._id,

    entityType: "DOCUMENT",
    entityId: document?._id || null,

    action: "REVIEW",

    actionUrl: `/admin/applications/${application._id}`,

    metadata: {
      documentName: document?.name || document?.documentType || null,

      applicationNumber: application.applicationNumber || null,
    },
  });
};

/**
 * Document approved.
 *
 * Client gets notified.
 */
const documentApproved = async ({
  document,
  application,
  actor = null,
  client = null,
}) => {
  const recipient = client || application?.user;

  if (!recipient) {
    throw new Error("Document approval notification requires a client.");
  }

  return notifyUser({
    user: recipient,
    role: "CLIENT",

    actor,

    category: "DOCUMENT",
    type: "APPROVED",

    title: "Document approved",

    message: "One of your application documents has been approved.",

    priority: "NORMAL",

    application: application._id,

    entityType: "DOCUMENT",
    entityId: document?._id || null,

    action: "VIEW",

    actionUrl: `/portal/applications/${application._id}`,

    metadata: {
      documentName: document?.name || document?.documentType || null,
    },
  });
};

/**
 * Document rejected.
 */
const documentRejected = async ({
  document,
  application,
  actor = null,
  client = null,
  reason = null,
}) => {
  const recipient = client || application?.user;

  if (!recipient) {
    throw new Error("Document rejection notification requires a client.");
  }

  return notifyUser({
    user: recipient,
    role: "CLIENT",

    actor,

    category: "DOCUMENT",
    type: "REJECTED",

    title: "Document requires attention",

    message:
      reason ||
      "One of your application documents has been rejected and requires your attention.",

    priority: "HIGH",

    application: application._id,

    entityType: "DOCUMENT",
    entityId: document?._id || null,

    action: "REVIEW",

    actionUrl: `/portal/applications/${application._id}`,

    metadata: {
      documentName: document?.name || document?.documentType || null,

      reason,
    },
  });
};

/**
 * Document requires re-upload.
 */
const documentReuploadRequired = async ({
  document,
  application,
  actor = null,
  client = null,
  reason = null,
}) => {
  const recipient = client || application?.user;

  if (!recipient) {
    throw new Error("Document re-upload notification requires a client.");
  }

  return notifyUser({
    user: recipient,
    role: "CLIENT",

    actor,

    category: "DOCUMENT",
    type: "REUPLOAD_REQUIRED",

    title: "Document re-upload required",

    message:
      reason ||
      "A document needs to be uploaded again before your application can continue.",

    priority: "HIGH",

    application: application._id,

    entityType: "DOCUMENT",
    entityId: document?._id || null,

    action: "UPLOAD",

    actionUrl: `/portal/applications/${application._id}`,

    metadata: {
      documentName: document?.name || document?.documentType || null,

      reason,
    },
  });
};

/* -------------------------------------------------------------------------- */
/* PAYMENT POLICIES                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Payment created / pending.
 */
const paymentPending = async ({
  payment,
  application = null,
  client,
  amount = null,
}) => {
  if (!client) {
    throw new Error("Payment notification requires a client.");
  }

  return notifyUser({
    user: client,
    role: "CLIENT",

    category: "PAYMENT",
    type: "PENDING",

    title: "Payment pending",

    message: "Your payment is currently being processed.",

    priority: "NORMAL",

    application: application?._id || null,

    entityType: "PAYMENT",
    entityId: payment?._id || null,

    action: "VIEW",

    actionUrl: "/portal/finance",

    metadata: {
      amount,
      paymentReference: payment?.reference || null,
    },
  });
};

/**
 * Payment received.
 */
const paymentReceived = async ({
  payment,
  application = null,
  client,
  amount = null,
}) => {
  if (!client) {
    throw new Error("Payment notification requires a client.");
  }

  return notifyUser({
    user: client,
    role: "CLIENT",

    category: "PAYMENT",
    type: "RECEIVED",

    title: "Payment received",

    message: "Your payment has been received successfully.",

    priority: "NORMAL",

    application: application?._id || null,

    entityType: "PAYMENT",
    entityId: payment?._id || null,

    action: "VIEW",

    actionUrl: "/portal/finance",

    metadata: {
      amount,
      paymentReference: payment?.reference || null,
    },
  });
};

/**
 * Payment failed.
 */
const paymentFailed = async ({
  payment,
  application = null,
  client,
  amount = null,
}) => {
  if (!client) {
    throw new Error("Payment notification requires a client.");
  }

  return notifyUser({
    user: client,
    role: "CLIENT",

    category: "PAYMENT",
    type: "FAILED",

    title: "Payment failed",

    message: "Your payment could not be completed. Please try again.",

    priority: "HIGH",

    application: application?._id || null,

    entityType: "PAYMENT",
    entityId: payment?._id || null,

    action: "PAY",

    actionUrl: "/portal/finance",

    metadata: {
      amount,
      paymentReference: payment?.reference || null,
    },
  });
};

/**
 * Payment refunded.
 */
const paymentRefunded = async ({
  payment,
  application = null,
  client,
  amount = null,
}) => {
  if (!client) {
    throw new Error("Payment notification requires a client.");
  }

  return notifyUser({
    user: client,
    role: "CLIENT",

    category: "PAYMENT",
    type: "REFUNDED",

    title: "Payment refunded",

    message: "Your payment has been refunded.",

    priority: "NORMAL",

    application: application?._id || null,

    entityType: "PAYMENT",
    entityId: payment?._id || null,

    action: "VIEW",

    actionUrl: "/portal/finance",

    metadata: {
      amount,
      paymentReference: payment?.reference || null,
    },
  });
};

/* -------------------------------------------------------------------------- */
/* BOOKING POLICIES                                                           */
/* -------------------------------------------------------------------------- */

const bookingCreated = async ({
  booking,
  client,
  application = null,
  actor = null,
}) => {
  if (!client) {
    throw new Error("Booking notification requires a client.");
  }

  return notifyUser({
    user: client,
    role: "CLIENT",

    actor,

    category: "BOOKING",
    type: "CREATED",

    title: "Booking created",

    message: "Your booking has been created successfully.",

    priority: "NORMAL",

    application: application?._id || null,

    entityType: "BOOKING",
    entityId: booking?._id || null,

    action: "VIEW",

    actionUrl: "/portal/bookings",

    metadata: {
      bookingId: booking?._id || null,
    },
  });
};

const bookingConfirmed = async ({
  booking,
  client,
  application = null,
  actor = null,
}) => {
  if (!client) {
    throw new Error("Booking confirmation requires a client.");
  }

  return notifyUser({
    user: client,
    role: "CLIENT",

    actor,

    category: "BOOKING",
    type: "CONFIRMED",

    title: "Booking confirmed",

    message: "Your booking has been confirmed.",

    priority: "HIGH",

    application: application?._id || null,

    entityType: "BOOKING",
    entityId: booking?._id || null,

    action: "VIEW",

    actionUrl: "/portal/bookings",

    metadata: {
      bookingId: booking?._id || null,
    },
  });
};

const bookingCancelled = async ({
  booking,
  client,
  application = null,
  actor = null,
}) => {
  if (!client) {
    throw new Error("Booking cancellation notification requires a client.");
  }

  return notifyUser({
    user: client,
    role: "CLIENT",

    actor,

    category: "BOOKING",
    type: "CANCELLED",

    title: "Booking cancelled",

    message: "Your booking has been cancelled.",

    priority: "HIGH",

    application: application?._id || null,

    entityType: "BOOKING",
    entityId: booking?._id || null,

    action: "VIEW",

    actionUrl: "/portal/bookings",

    metadata: {
      bookingId: booking?._id || null,
    },
  });
};

/* -------------------------------------------------------------------------- */
/* PROFILE POLICIES                                                           */
/* -------------------------------------------------------------------------- */

const profileUpdated = async ({ user, actor = null }) => {
  if (!user) {
    throw new Error("Profile notification requires a user.");
  }

  return notifyUser({
    user,
    role: "CLIENT",

    actor,

    category: "PROFILE",
    type: "UPDATED",

    title: "Profile updated",

    message: "Your profile has been updated successfully.",

    priority: "LOW",

    entityType: "PROFILE",
    entityId: user,

    action: "VIEW",

    actionUrl: "/portal/profile",
  });
};

const profileCompleted = async ({ user, actor = null }) => {
  if (!user) {
    throw new Error("Profile notification requires a user.");
  }

  return notifyUser({
    user,
    role: "CLIENT",

    actor,

    category: "PROFILE",
    type: "COMPLETED",

    title: "Profile completed",

    message: "Your profile is now complete.",

    priority: "NORMAL",

    entityType: "PROFILE",
    entityId: user,

    action: "VIEW",

    actionUrl: "/portal/profile",
  });
};

/* -------------------------------------------------------------------------- */
/* COMMUNICATION POLICIES                                                     */
/* -------------------------------------------------------------------------- */

const messageReceived = async ({
  recipient,
  role,
  actor,
  message,
  application = null,
  messageId = null,
}) => {
  if (!recipient) {
    throw new Error("Message notification requires a recipient.");
  }

  if (!role) {
    throw new Error("Message notification requires a recipient role.");
  }

  return notifyUser({
    user: recipient,
    role,

    actor,

    category: "COMMUNICATION",
    type: "MESSAGE_RECEIVED",

    title: "New message",

    message: message || "You have received a new message.",

    priority: "NORMAL",

    application: application?._id || application || null,

    entityType: "MESSAGE",
    entityId: messageId,

    action: "RESPOND",

    actionUrl: "/portal/messages",

    metadata: {
      messageId,
    },
  });
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export {
  notifyUser,
  applicationCreated,
  applicationSubmitted,
  applicationStatusChanged,
  applicationApproved,
  applicationRejected,
  documentUploaded,
  documentApproved,
  documentRejected,
  documentReuploadRequired,
  paymentPending,
  paymentReceived,
  paymentFailed,
  paymentRefunded,
  bookingCreated,
  bookingConfirmed,
  bookingCancelled,
  profileUpdated,
  profileCompleted,
  messageReceived,
};
