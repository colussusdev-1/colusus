import mongoose from "mongoose";

/*
============================================================
COLUSUS — NOTIFICATION MODEL
============================================================
|
| Platform-wide notification infrastructure.
|
| Notifications are always associated with a recipient user.
|
| Clients, admins and staff can all receive notifications.
|
============================================================
*/

const notificationSchema = new mongoose.Schema(
  {
    /*
    ----------------------------------------------------------
    RECIPIENT
    ----------------------------------------------------------
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    /*
    ----------------------------------------------------------
    ACTOR
    ----------------------------------------------------------
    |
    | The user/system that caused the notification.
    |
    | Example:
    |
    | Admin changes application status
    | actor = admin user
    |
    | System-generated event
    | actor = null
    |
    ----------------------------------------------------------
    */

    actor: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    /*
    ----------------------------------------------------------
    TYPE
    ----------------------------------------------------------
    */

    type: {
      type: String,

      required: true,

      uppercase: true,

      trim: true,

      enum: [
        /*
        APPLICATION
        */

        "APPLICATION_CREATED",

        "APPLICATION_UPDATED",

        "APPLICATION_STATUS_CHANGED",

        "APPLICATION_SUBMITTED",

        "APPLICATION_APPROVED",

        "APPLICATION_REJECTED",

        /*
        DOCUMENT
        */

        "DOCUMENT_UPLOADED",

        "DOCUMENT_UPDATED",

        "DOCUMENT_APPROVED",

        "DOCUMENT_REJECTED",

        "DOCUMENT_REUPLOAD_REQUIRED",

        /*
        PROFILE
        */

        "PROFILE_UPDATED",

        "PROFILE_COMPLETED",

        /*
        PAYMENT
        */

        "PAYMENT_CREATED",

        "PAYMENT_RECEIVED",

        "PAYMENT_PENDING",

        "PAYMENT_FAILED",

        "PAYMENT_REFUNDED",

        /*
        BOOKING
        */

        "BOOKING_CREATED",

        "BOOKING_UPDATED",

        "BOOKING_CANCELLED",

        "BOOKING_CONFIRMED",

        /*
        ADMIN / STAFF
        */

        "ADMIN_ACTION",

        "STAFF_ACTION",

        /*
        SYSTEM
        */

        "MESSAGE_RECEIVED",

        "SYSTEM",

        "GENERAL",
      ],

      index: true,
    },

    /*
    ----------------------------------------------------------
    TITLE
    ----------------------------------------------------------
    */

    title: {
      type: String,

      required: true,

      trim: true,

      maxlength: 180,
    },

    /*
    ----------------------------------------------------------
    MESSAGE
    ----------------------------------------------------------
    */

    message: {
      type: String,

      required: true,

      trim: true,

      maxlength: 2000,
    },

    /*
    ----------------------------------------------------------
    ENTITY TYPE
    ----------------------------------------------------------
    |
    | Identifies what the notification is about.
    |
    ----------------------------------------------------------
    */

    entityType: {
      type: String,

      enum: [
        "APPLICATION",

        "DOCUMENT",

        "PROFILE",

        "PAYMENT",

        "BOOKING",

        "USER",

        "SYSTEM",

        "NONE",
      ],

      default: "NONE",

      index: true,
    },

    /*
    ----------------------------------------------------------
    ENTITY ID
    ----------------------------------------------------------
    */

    entityId: {
      type: mongoose.Schema.Types.ObjectId,

      default: null,

      index: true,
    },

    /*
    ----------------------------------------------------------
    METADATA
    ----------------------------------------------------------
    |
    | Extra information needed by the frontend.
    |
    | Example:
    |
    | {
    |   applicationId: "...",
    |   documentId: "...",
    |   previousStatus: "SUBMITTED",
    |   newStatus: "UNDER_REVIEW"
    | }
    |
    ----------------------------------------------------------
    */

    metadata: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

    /*
    ----------------------------------------------------------
    PRIORITY
    ----------------------------------------------------------
    */

    priority: {
      type: String,

      enum: ["LOW", "NORMAL", "HIGH", "URGENT"],

      default: "NORMAL",

      index: true,
    },

    /*
    ----------------------------------------------------------
    READ STATE
    ----------------------------------------------------------
    */

    read: {
      type: Boolean,

      default: false,

      index: true,
    },

    /*
    ----------------------------------------------------------
    READ AT
    ----------------------------------------------------------
    */

    readAt: {
      type: Date,

      default: null,
    },

    /*
    ----------------------------------------------------------
    OPTIONAL EXPIRATION
    ----------------------------------------------------------
    |
    | Allows old temporary notifications to expire.
    |
    ----------------------------------------------------------
    */

    expiresAt: {
      type: Date,

      default: null,

      index: true,
    },
  },

  {
    timestamps: true,
  },
);

/*
============================================================
INDEXES
============================================================
*/

notificationSchema.index({
  user: 1,

  createdAt: -1,
});

notificationSchema.index({
  user: 1,

  read: 1,

  createdAt: -1,
});

notificationSchema.index({
  user: 1,

  type: 1,

  createdAt: -1,
});

/*
============================================================
MODEL
============================================================
*/

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
