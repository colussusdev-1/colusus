import mongoose from "mongoose";

/*
============================================================
APPLICATION ACTIVITY SCHEMA
============================================================
|
| Stores the real event history for an application.
|
| This powers:
|
| - Recent Activity
| - Document activity
| - Application status changes
| - Submission events
| - Approval / rejection events
|
============================================================
*/

const applicationActivitySchema = new mongoose.Schema(
  {
    /*
    ----------------------------------------------------------
    ACTIVITY TYPE
    ----------------------------------------------------------
    */

    type: {
      type: String,

      enum: [
        "CREATED",
        "STARTED",

        "DOCUMENT_UPLOADED",
        "DOCUMENT_REVIEW",
        "DOCUMENT_APPROVED",
        "DOCUMENT_REJECTED",
        "DOCUMENT_REUPLOAD_REQUIRED",
        "DOCUMENTS_COMPLETED",

        "STATUS_CHANGED",

        "SUBMITTED",

        "APPROVED",
        "REJECTED",

        "UPDATED",
      ],

      required: true,
    },

    /*
    ----------------------------------------------------------
    ACTIVITY TITLE
    ----------------------------------------------------------
    */

    title: {
      type: String,

      required: true,

      trim: true,
    },

    /*
    ----------------------------------------------------------
    ACTIVITY DESCRIPTION
    ----------------------------------------------------------
    */

    description: {
      type: String,

      default: "",

      trim: true,
    },

    /*
    ----------------------------------------------------------
    ACTIVITY METADATA
    ----------------------------------------------------------
    |
    | Used for additional information such as:
    |
    | documentId
    | documentName
    | previousStatus
    | status
    | currentStep
    | etc.
    |
    ----------------------------------------------------------
    */

    metadata: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

    /*
    ----------------------------------------------------------
    CREATED AT
    ----------------------------------------------------------
    */

    createdAt: {
      type: Date,

      default: Date.now,

      index: true,
    },
  },

  {
    _id: true,
  },
);

/*
============================================================
APPLICATION SCHEMA
============================================================
*/

const applicationSchema = new mongoose.Schema(
  {
    /*
    |----------------------------------------------------------------
    | CLIENT OWNER
    |----------------------------------------------------------------
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

      index: true,
    },

    /*
    |----------------------------------------------------------------
    | SELECTED OPPORTUNITY
    |----------------------------------------------------------------
    */

    opportunity: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Opportunity",

      required: true,

      index: true,
    },

    /*
    |----------------------------------------------------------------
    | OPPORTUNITY SNAPSHOT
    |----------------------------------------------------------------
    */

    opportunitySnapshot: {
      title: {
        type: String,

        default: "",
      },

      countryName: {
        type: String,

        default: "",
      },

      countrySlug: {
        type: String,

        default: "",
      },

      countryFlag: {
        type: String,

        default: "",
      },

      category: {
        type: String,

        default: "",
      },

      type: {
        type: String,

        default: "",
      },

      description: {
        type: String,

        default: "",
      },

      applicationConfig: {
        type: mongoose.Schema.Types.Mixed,

        default: null,
      },
    },

    /*
    |----------------------------------------------------------------
    | ASSIGNED STAFF
    |----------------------------------------------------------------
    */

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    /*
    |----------------------------------------------------------------
    | APPLICATION TYPE
    |----------------------------------------------------------------
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
    |----------------------------------------------------------------
    | DESTINATION COUNTRY
    |----------------------------------------------------------------
    */

    destinationCountry: {
      type: String,

      required: true,

      trim: true,
    },

    /*
    |----------------------------------------------------------------
    | APPLICATION STATUS
    |----------------------------------------------------------------
    |
    | CLIENT CONTROLLED:
    |
    | DRAFT
    | IN_PROGRESS
    |
    | STAFF / BACKEND CONTROLLED:
    |
    | SUBMITTED
    | UNDER_REVIEW
    | DOCUMENT_REQUEST
    | PROCESSING
    | APPROVED
    | REJECTED
    |
    | The client portal must not arbitrarily change staff-only
    | statuses.
    |
    */

    status: {
      type: String,

      enum: [
        "DRAFT",
        "IN_PROGRESS",
        "SUBMITTED",
        "UNDER_REVIEW",
        "DOCUMENT_REQUEST",
        "PROCESSING",
        "APPROVED",
        "REJECTED",
      ],

      default: "DRAFT",

      index: true,
    },

    /*
    |----------------------------------------------------------------
    | APPLICATION JOURNEY
    |----------------------------------------------------------------
    */

    currentStep: {
      type: String,

      default: "DOCUMENTS",

      trim: true,
    },

    currentStepIndex: {
      type: Number,

      default: 0,

      min: 0,
    },

    /*
    |----------------------------------------------------------------
    | CLIENT ANSWERS
    |----------------------------------------------------------------
    */

    answers: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

    /*
    |----------------------------------------------------------------
    | PERSONAL INFORMATION
    |----------------------------------------------------------------
    */

    personalInformation: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

    /*
    |----------------------------------------------------------------
    | DOCUMENT PROGRESS
    |----------------------------------------------------------------
    */

    documentProgress: {
      type: mongoose.Schema.Types.Mixed,

      default: {
        required: 0,

        uploaded: 0,

        approved: 0,

        pending: 0,

        rejected: 0,

        missing: [],

        percentage: 0,

        complete: false,
      },
    },

    /*
    |----------------------------------------------------------------
    | WORKFLOW
    |----------------------------------------------------------------
    */

    workflow: {
      type: [mongoose.Schema.Types.Mixed],

      default: [],
    },

    /*
    |----------------------------------------------------------------
    | APPLICATION ACTIVITY
    |----------------------------------------------------------------
    |
    | This is the persistent activity history displayed by
    | ApplicationActivity.jsx.
    |
    */

    activity: {
      type: [applicationActivitySchema],

      default: [],
    },

    /*
    |----------------------------------------------------------------
    | PRIORITY
    |----------------------------------------------------------------
    */

    priority: {
      type: String,

      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],

      default: "MEDIUM",
    },

    /*
    |----------------------------------------------------------------
    | CLIENT NOTES
    |----------------------------------------------------------------
    */

    notes: {
      type: String,

      default: "",

      trim: true,
    },

    /*
    |----------------------------------------------------------------
    | INTERNAL ADMIN NOTES
    |----------------------------------------------------------------
    */

    internalNotes: [
      {
        message: {
          type: String,

          required: true,

          trim: true,
        },

        createdBy: {
          type: mongoose.Schema.Types.ObjectId,

          ref: "User",

          default: null,
        },

        createdAt: {
          type: Date,

          default: Date.now,
        },
      },
    ],

    /*
    |----------------------------------------------------------------
    | LAST UPDATED BY
    |----------------------------------------------------------------
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

/*
============================================================
INDEXES
============================================================
*/

applicationSchema.index({
  user: 1,

  createdAt: -1,
});

applicationSchema.index({
  opportunity: 1,
});

applicationSchema.index({
  user: 1,

  opportunity: 1,
});

applicationSchema.index({
  user: 1,

  status: 1,

  createdAt: -1,
});

/*
============================================================
MODEL
============================================================
*/

const Application = mongoose.model(
  "Application",

  applicationSchema,
);

export default Application;
