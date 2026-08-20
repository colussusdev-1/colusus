import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | CLIENT OWNER
    |--------------------------------------------------------------------------
    */

    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    /*
    |--------------------------------------------------------------------------
    | SELECTED OPPORTUNITY
    |--------------------------------------------------------------------------
    |
    | The actual Colusus pathway the client selected.
    |
    */

    opportunity: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Opportunity",

      required: true,
    },

    /*
    |--------------------------------------------------------------------------
    | OPPORTUNITY SNAPSHOT
    |--------------------------------------------------------------------------
    |
    | Preserve the configuration that existed when the
    | client started the application.
    |
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
    |--------------------------------------------------------------------------
    | ASSIGNED STAFF / ADMIN
    |--------------------------------------------------------------------------
    */

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | APPLICATION TYPE
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
    | DESTINATION COUNTRY
    |--------------------------------------------------------------------------
    */

    destinationCountry: {
      type: String,

      required: true,

      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | APPLICATION STATUS
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,

      enum: [
        "DRAFT",
        "SUBMITTED",
        "UNDER_REVIEW",
        "DOCUMENT_REQUEST",
        "PROCESSING",
        "APPROVED",
        "REJECTED",
      ],

      default: "DRAFT",
    },

    /*
    |--------------------------------------------------------------------------
    | APPLICATION PROGRESS
    |--------------------------------------------------------------------------
    */

    currentStep: {
      type: String,

      default: "PERSONAL_INFORMATION",
    },

    currentStepIndex: {
      type: Number,

      default: 0,
    },

    /*
    |--------------------------------------------------------------------------
    | CLIENT ANSWERS
    |--------------------------------------------------------------------------
    |
    | Answers to pathway-specific application questions.
    |
    */

    answers: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

    /*
    |--------------------------------------------------------------------------
    | PERSONAL INFORMATION
    |--------------------------------------------------------------------------
    |
    | Information collected during the application wizard.
    |
    */

    personalInformation: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

    /*
    |--------------------------------------------------------------------------
    | APPLICATION DOCUMENTS
    |--------------------------------------------------------------------------
    |
    | Actual uploaded document records are handled by the
    | document module. This field stores the relationship
    | to those documents when necessary.
    |
    */

    documentProgress: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

    /*
    |--------------------------------------------------------------------------
    | WORKFLOW
    |--------------------------------------------------------------------------
    |
    | Snapshot of the workflow assigned to this application.
    |
    */

    workflow: {
      type: [mongoose.Schema.Types.Mixed],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | PRIORITY
    |--------------------------------------------------------------------------
    */

    priority: {
      type: String,

      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],

      default: "MEDIUM",
    },

    /*
    |--------------------------------------------------------------------------
    | CLIENT VISIBLE NOTES
    |--------------------------------------------------------------------------
    */

    notes: {
      type: String,

      default: "",
    },

    /*
    |--------------------------------------------------------------------------
    | INTERNAL ADMIN NOTES
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
    | LAST UPDATED BY
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

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
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

const Application = mongoose.model("Application", applicationSchema);

export default Application;
