import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    /*
        ========================================================
        OWNER
        ========================================================
        */

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    /*
        ========================================================
        APPLICATION
        ========================================================
        */

    application: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Application",

      required: true,
    },

    /*
        ========================================================
        DOCUMENT INFORMATION
        ========================================================
        */

    name: {
      type: String,

      required: true,

      trim: true,
    },

    type: {
      type: String,

      enum: [
        "PASSPORT",

        "IDENTIFICATION",

        "ACADEMIC_CERTIFICATE",

        "FINANCIAL_DOCUMENT",

        "EMPLOYMENT_DOCUMENT",

        "OTHER",
      ],

      required: true,
    },

    /*
        ========================================================
        CLOUDINARY FILE
        ========================================================
        */

    fileUrl: {
      type: String,

      default: "",
    },

    cloudinaryPublicId: {
      type: String,

      default: "",
    },

    /*
        ========================================================
        ORIGINAL FILE INFORMATION
        ========================================================
        */

    originalFileName: {
      type: String,

      default: "",
    },

    mimeType: {
      type: String,

      default: "",
    },

    fileSize: {
      type: Number,

      default: 0,
    },

    /*
        ========================================================
        DOCUMENT STATUS
        ========================================================
        */

    status: {
      type: String,

      enum: [
        "UPLOADED",

        "UNDER_REVIEW",

        "APPROVED",

        "REJECTED",

        "REUPLOAD_REQUIRED",
      ],

      default: "UPLOADED",
    },

    /*
        ========================================================
        REVIEW
        ========================================================
        */

    reviewNote: {
      type: String,

      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    reviewedAt: {
      type: Date,

      default: null,
    },
  },

  {
    timestamps: true,
  },
);

const Document = mongoose.model(
  "Document",

  documentSchema,
);

export default Document;
