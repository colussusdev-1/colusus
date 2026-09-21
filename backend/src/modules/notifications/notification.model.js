import mongoose from "mongoose";

/*
============================================================
colossus — NOTIFICATION MODEL
============================================================
|
| Central notification infrastructure for the entire
| colossus platform.
|
| A notification always belongs to a specific USER.
|
| The AUDIENCE field identifies the operational area that
| the recipient belongs to:
|
|     CLIENT
|     ADMIN
|     STAFF
|     DEVELOPER
|
| This allows the same notification collection to safely
| support both:
|
|     Client notification inbox
|     Admin / staff notification inbox
|
| without creating separate notification collections.
|
============================================================
*/

const notificationSchema = new mongoose.Schema(
  {
    /*
    ============================================================
    RECIPIENT
    ============================================================
    |
    | The exact user who should receive the notification.
    |
    ============================================================
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    /*
    ============================================================
    AUDIENCE
    ============================================================
    |
    | Identifies which operational audience the notification
    | belongs to.
    |
    | IMPORTANT:
    |
    | This is NOT the actual recipient.
    |
    | `user` identifies the recipient.
    |
    | `audience` identifies the recipient's platform area.
    |
    | Example:
    |
    |     user    = client user ID
    | |   audience = CLIENT
    |
    |     user    = admin user ID
    | |   audience = ADMIN
    |
    ============================================================
    */

    audience: {
      type: String,

      required: true,

      uppercase: true,

      trim: true,

      enum: ["CLIENT", "ADMIN", "STAFF", "DEVELOPER"],

      index: true,
    },

    /*
    ============================================================
    ACTOR
    ============================================================
    |
    | The user/system that caused the notification.
    |
    | Example:
    |
    | Admin changes application status:
    |
    |     actor = admin user
    |
    | System-generated notification:
    |
    |     actor = null
    |
    ============================================================
    */

    actor: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,

      index: true,
    },

    /*
    ============================================================
    TYPE
    ============================================================
    */

    type: {
      type: String,

      required: true,

      uppercase: true,

      trim: true,

      enum: [
        /*
        --------------------------------------------------------
        APPLICATION
        --------------------------------------------------------
        */

        "APPLICATION_CREATED",

        "APPLICATION_UPDATED",

        "APPLICATION_STATUS_CHANGED",

        "APPLICATION_SUBMITTED",

        "APPLICATION_APPROVED",

        "APPLICATION_REJECTED",

        /*
        --------------------------------------------------------
        DOCUMENT
        --------------------------------------------------------
        */

        "DOCUMENT_UPLOADED",

        "DOCUMENT_UPDATED",

        "DOCUMENT_APPROVED",

        "DOCUMENT_REJECTED",

        "DOCUMENT_REUPLOAD_REQUIRED",

        /*
        --------------------------------------------------------
        PROFILE
        --------------------------------------------------------
        */

        "PROFILE_UPDATED",

        "PROFILE_COMPLETED",

        /*
        --------------------------------------------------------
        PAYMENT
        --------------------------------------------------------
        */

        "PAYMENT_CREATED",

        "PAYMENT_RECEIVED",

        "PAYMENT_PENDING",

        "PAYMENT_FAILED",

        "PAYMENT_REFUNDED",

        /*
        --------------------------------------------------------
        BOOKING
        --------------------------------------------------------
        */

        "BOOKING_CREATED",

        "BOOKING_UPDATED",

        "BOOKING_CANCELLED",

        "BOOKING_CONFIRMED",

        /*
        --------------------------------------------------------
        ADMIN / STAFF
        --------------------------------------------------------
        */

        "ADMIN_ACTION",

        "STAFF_ACTION",

        /*
        --------------------------------------------------------
        SYSTEM
        --------------------------------------------------------
        */

        "MESSAGE_RECEIVED",

        "SYSTEM",

        "GENERAL",
      ],

      index: true,
    },

    /*
    ============================================================
    TITLE
    ============================================================
    */

    title: {
      type: String,

      required: true,

      trim: true,

      maxlength: 180,
    },

    /*
    ============================================================
    MESSAGE
    ============================================================
    */

    message: {
      type: String,

      required: true,

      trim: true,

      maxlength: 2000,
    },

    /*
    ============================================================
    ENTITY TYPE
    ============================================================
    |
    | Identifies the primary platform entity involved.
    |
    ============================================================
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
    ============================================================
    ENTITY ID
    ============================================================
    |
    | ID of the entity the notification relates to.
    |
    | Examples:
    |
    | application ID
    | document ID
    | payment ID
    | booking ID
    |
    ============================================================
    */

    entityId: {
      type: mongoose.Schema.Types.ObjectId,

      default: null,

      index: true,
    },

    /*
    ============================================================
    METADATA
    ============================================================
    |
    | Additional structured information required by the
    | frontend or internal workflows.
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
    ============================================================
    */

    metadata: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

    /*
    ============================================================
    PRIORITY
    ============================================================
    */

    priority: {
      type: String,

      uppercase: true,

      trim: true,

      enum: ["LOW", "NORMAL", "HIGH", "URGENT"],

      default: "NORMAL",

      index: true,
    },

    /*
    ============================================================
    READ STATE
    ============================================================
    */

    read: {
      type: Boolean,

      default: false,

      index: true,
    },

    /*
    ============================================================
    READ AT
    ============================================================
    |
    | Timestamp showing when the notification was read.
    |
    ============================================================
    */

    readAt: {
      type: Date,

      default: null,
    },

    /*
    ============================================================
    OPTIONAL EXPIRATION
    ============================================================
    |
    | Used for temporary/system notifications that should
    | eventually disappear.
    |
    | NOTE:
    |
    | MongoDB TTL behavior can be enabled later if we decide
    | expired notifications should automatically be deleted.
    |
    ============================================================
    */

    expiresAt: {
      type: Date,

      default: null,

      index: true,
    },
  },

  {
    timestamps: true,

    /*
    ----------------------------------------------------------
    SCHEMA OPTIONS
    ----------------------------------------------------------
    */

    versionKey: false,
  },
);

/*
============================================================
INDEXES
============================================================
|
| These indexes are designed around the actual notification
| queries the platform will perform.
|
============================================================
*/

/*
------------------------------------------------------------
USER INBOX
------------------------------------------------------------
|
| Used by:
|
| GET /notifications
|
| Returns the recipient's newest notifications first.
|
------------------------------------------------------------
*/

notificationSchema.index({
  user: 1,

  createdAt: -1,
});

/*
------------------------------------------------------------
USER + READ STATE
------------------------------------------------------------
|
| Used by:
|
| unread notifications
| unread count
| notification inbox filtering
|
------------------------------------------------------------
*/

notificationSchema.index({
  user: 1,

  read: 1,

  createdAt: -1,
});

/*
------------------------------------------------------------
USER + TYPE
------------------------------------------------------------
|
| Useful for future notification filtering.
|
------------------------------------------------------------
*/

notificationSchema.index({
  user: 1,

  type: 1,

  createdAt: -1,
});

/*
------------------------------------------------------------
AUDIENCE + READ STATE
------------------------------------------------------------
|
| Useful for admin/staff operational inbox queries.
|
------------------------------------------------------------
*/

notificationSchema.index({
  audience: 1,

  read: 1,

  createdAt: -1,
});

/*
------------------------------------------------------------
AUDIENCE + USER + CREATED
------------------------------------------------------------
|
| Makes recipient-scoped operational inbox queries explicit.
|
------------------------------------------------------------
*/

notificationSchema.index({
  audience: 1,

  user: 1,

  createdAt: -1,
});

/*
------------------------------------------------------------
EXPIRATION
------------------------------------------------------------
|
| Partial TTL index:
|
| Only notifications with an expiresAt value are eligible
| for automatic expiration.
|
| Notifications without expiresAt remain permanent.
|
------------------------------------------------------------
*/

notificationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,

    partialFilterExpression: {
      expiresAt: {
        $type: "date",
      },
    },
  },
);

/*
============================================================
READ STATE CONSISTENCY
============================================================
|
| Keep `read` and `readAt` synchronized when documents are
| saved through Mongoose.
|
| This hook is intentionally synchronous.
|
| There is no asynchronous operation here, so Mongoose does
| not need a `next` callback.
|
============================================================
*/

notificationSchema.pre("save", function () {
  if (this.isModified("read")) {
    if (this.read) {
      if (!this.readAt) {
        this.readAt = new Date();
      }
    } else {
      this.readAt = null;
    }
  }
});

/*
============================================================
MODEL
============================================================
*/

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;