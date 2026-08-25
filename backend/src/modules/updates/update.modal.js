import mongoose from "mongoose";

/*
============================================================
COLUSUS — UPDATE MODEL
============================================================
*/

const updateSchema = new mongoose.Schema(
  {
    /*
    ----------------------------------------------------------
    CLIENT
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
    UPDATE TYPE
    ----------------------------------------------------------
    */

    type: {
      type: String,

      required: true,

      uppercase: true,

      trim: true,

      enum: [
        "APPLICATION_CREATED",

        "APPLICATION_STATUS_CHANGED",

        "APPLICATION_UPDATED",

        "DOCUMENT_UPLOADED",

        "DOCUMENT_APPROVED",

        "DOCUMENT_REJECTED",

        "DOCUMENT_REUPLOAD_REQUIRED",

        "DOCUMENT_UPDATED",

        "PROFILE_UPDATED",

        "MESSAGE_RECEIVED",

        "PAYMENT_RECEIVED",

        "PAYMENT_REQUIRED",

        "SYSTEM",
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

      maxlength: 1000,
    },

    /*
    ----------------------------------------------------------
    APPLICATION REFERENCE
    ----------------------------------------------------------
    */

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,

      default: null,

      index: true,
    },

    /*
    ----------------------------------------------------------
    DOCUMENT REFERENCE
    ----------------------------------------------------------
    */

    documentId: {
      type: mongoose.Schema.Types.ObjectId,

      default: null,

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
    READ DATE
    ----------------------------------------------------------
    */

    readAt: {
      type: Date,

      default: null,
    },

    /*
    ----------------------------------------------------------
    OPTIONAL METADATA
    ----------------------------------------------------------
    */

    metadata: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
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

updateSchema.index({
  user: 1,

  createdAt: -1,
});

updateSchema.index({
  user: 1,

  read: 1,

  createdAt: -1,
});

/*
============================================================
MODEL
============================================================
*/

const Update = mongoose.model("Update", updateSchema);

export default Update;
