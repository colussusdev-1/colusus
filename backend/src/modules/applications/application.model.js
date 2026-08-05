import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Client Owner
    |--------------------------------------------------------------------------
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Assigned Staff/Admin
    |--------------------------------------------------------------------------
    */

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | Visa Type
    |--------------------------------------------------------------------------
    */

    type: {
      type: String,

      enum: [
        "STUDENT_VISA",
        "WORK_VISA",
        "TOURIST_VISA",
        "PERMANENT_RESIDENCE",
      ],

      required: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Destination
    |--------------------------------------------------------------------------
    */

    destinationCountry: {
      type: String,

      required: true,

      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | Application Status
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,

      enum: [
        "SUBMITTED",

        "UNDER_REVIEW",

        "DOCUMENT_REQUEST",

        "PROCESSING",

        "APPROVED",

        "REJECTED",
      ],

      default: "SUBMITTED",
    },

    /*
    |--------------------------------------------------------------------------
    | Priority
    |--------------------------------------------------------------------------
    */

    priority: {
      type: String,

      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],

      default: "MEDIUM",
    },

    /*
    |--------------------------------------------------------------------------
    | Client Visible Notes
    |--------------------------------------------------------------------------
    */

    notes: {
      type: String,

      default: "",
    },

    /*
    |--------------------------------------------------------------------------
    | Internal Admin Notes
    |--------------------------------------------------------------------------
    */

    internalNotes: [
      {
        message: {
          type: String,

          required: true,
        },

        createdBy: {
          type: mongoose.Schema.Types.ObjectId,

          ref: "User",
        },

        createdAt: {
          type: Date,

          default: Date.now,
        },
      },
    ],

    /*
    |--------------------------------------------------------------------------
    | Last Updated By
    |--------------------------------------------------------------------------
    */

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },
  },

  {
    timestamps: true,
  },
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
