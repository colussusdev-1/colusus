import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Application",

      required: true,
    },

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

    fileUrl: {
      type: String,

      default: "",
    },

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
