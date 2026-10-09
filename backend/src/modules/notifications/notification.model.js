import mongoose from "mongoose";

import {
  NOTIFICATION_AUDIENCES,
  NOTIFICATION_CATEGORIES,
  NOTIFICATION_PRIORITIES,
  NOTIFICATION_ENTITY_TYPES,
  NOTIFICATION_ACTIONS,
  NOTIFICATION_TYPES,
  isValidNotificationType,
} from "./notification.types.js";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const allNotificationTypes = Object.values(NOTIFICATION_TYPES).flat();

/* -------------------------------------------------------------------------- */
/* SCHEMA                                                                     */
/* -------------------------------------------------------------------------- */

const notificationSchema = new mongoose.Schema(
  {
    /* RECIPIENT */

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    audience: {
      type: String,
      enum: NOTIFICATION_AUDIENCES,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    /* ACTOR */

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* NOTIFICATION CLASSIFICATION */

    category: {
      type: String,
      enum: NOTIFICATION_CATEGORIES,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: allNotificationTypes,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    priority: {
      type: String,
      enum: NOTIFICATION_PRIORITIES,
      default: "NORMAL",
      uppercase: true,
      trim: true,
      index: true,
    },

    /* CONTENT */

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    /* APPLICATION CONTEXT */

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
      index: true,
    },

    /* ENTITY CONTEXT */

    entityType: {
      type: String,
      enum: NOTIFICATION_ENTITY_TYPES,
      default: "NONE",
      uppercase: true,
      trim: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    /* ACTION */

    action: {
      type: String,
      enum: NOTIFICATION_ACTIONS,
      default: "NONE",
      uppercase: true,
      trim: true,
    },

    actionUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    /* EXTRA DATA */

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    /* READ STATE */

    read: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    /* EXPIRATION */

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/* -------------------------------------------------------------------------- */
/* VALIDATION                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Ensure the notification type belongs to its category.
 *
 * Example:
 * APPLICATION + APPROVED = valid
 * APPLICATION + REFUNDED = invalid
 */
notificationSchema.pre("validate", function () {
  if (!isValidNotificationType(this.category, this.type)) {
    throw new Error(
      `Notification type "${this.type}" is not valid for category "${this.category}".`,
    );
  }
});

/* -------------------------------------------------------------------------- */
/* READ STATE CONSISTENCY                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Keep the read flag and readAt timestamp consistent.
 */
notificationSchema.pre("save", function () {
  if (this.read) {
    if (!this.readAt) {
      this.readAt = new Date();
    }
  } else {
    this.readAt = null;
  }
});

/* -------------------------------------------------------------------------- */
/* INDEXES                                                                    */
/* -------------------------------------------------------------------------- */

/* Main notification feed */
notificationSchema.index({
  user: 1,
  createdAt: -1,
});

/* Unread notifications */
notificationSchema.index({
  user: 1,
  read: 1,
  createdAt: -1,
});

/* Application-specific notification history */
notificationSchema.index({
  user: 1,
  application: 1,
  createdAt: -1,
});

/* Category filtering */
notificationSchema.index({
  user: 1,
  category: 1,
  createdAt: -1,
});

/* Audience operational queries */
notificationSchema.index({
  audience: 1,
  read: 1,
  createdAt: -1,
});

/* Automatic expiration */
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

/* -------------------------------------------------------------------------- */
/* MODEL                                                                      */
/* -------------------------------------------------------------------------- */

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
