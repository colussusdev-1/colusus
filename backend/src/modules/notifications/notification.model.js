import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    title: {
      type: String,

      required: true,

      trim: true,
    },

    message: {
      type: String,

      required: true,

      trim: true,
    },

    type: {
      type: String,

      enum: [
        "APPLICATION_UPDATE",

        "APPLICATION_STATUS_CHANGED",

        "DOCUMENT_APPROVED",

        "DOCUMENT_REJECTED",

        "DOCUMENT_REUPLOAD",

        "GENERAL",
      ],

      default: "GENERAL",
    },

    read: {
      type: Boolean,

      default: false,
    },

    /*
        |--------------------------------------------------------------------------
        | Additional Data
        |--------------------------------------------------------------------------
        |
        | Stores references related to the notification.
        |
        | Example:
        |
        | {
        |   applicationId:"...",
        |   documentId:"..."
        | }
        |
        |--------------------------------------------------------------------------
        */

    metadata: {
      type: Object,

      default: {},
    },
  },

  {
    timestamps: true,
  },
);

const Notification = mongoose.model(
  "Notification",

  notificationSchema,
);

export default Notification;
