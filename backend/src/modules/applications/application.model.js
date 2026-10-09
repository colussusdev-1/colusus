
import mongoose from "mongoose";

/*
============================================================
APPLICATION ACTIVITY SCHEMA
============================================================
*/

const applicationActivitySchema = new mongoose.Schema(
  {
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

    title: {
      type: String,

      required: true,

      trim: true,
    },

    description: {
      type: String,

      default: "",

      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,

      default: {},
    },

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
APPLICATION PAYMENT STAGE SCHEMA
============================================================
|
| This is a snapshot of the opportunity payment plan at the
| time the application is created.
|
| Finance remains responsible for invoices/payments/receipts.
| The Application only tracks which payment stages belong to
| this particular application and their business state.
|
============================================================
*/

const applicationPaymentStageSchema = new mongoose.Schema(
  {
    stage: {
      type: Number,

      required: true,

      min: 1,
    },

    name: {
      type: String,

      required: true,

      trim: true,
    },

    amount: {
      type: Number,

      required: true,

      min: 0,
    },

    currency: {
      type: String,

      default: "NGN",

      trim: true,

      uppercase: true,
    },

    status: {
      type: String,

      enum: [
        "LOCKED",
        "PENDING",
        "PAID",
        "CANCELLED",
      ],

      default: "LOCKED",
    },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Invoice",

      default: null,
    },

    paidAt: {
      type: Date,

      default: null,
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
    | PERMANENT APPLICATION REFERENCE
    |----------------------------------------------------------------
    */

    applicationReference: {
      type: String,

      required: true,

      unique: true,

      index: true,

      trim: true,

      immutable: true,
    },

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
    | APPLICATION PAYMENT STATUS
    |----------------------------------------------------------------
    |
    | This is deliberately separate from application.status.
    |
    | application.status:
    |   Business/application workflow
    |
    | paymentStatus:
    |   Financial state
    |
    |----------------------------------------------------------------
    */

    paymentStatus: {
      type: String,

      enum: [
        "NOT_REQUIRED",
        "PAYMENT_PENDING",
        "PARTIALLY_PAID",
        "PAID",
      ],

      default: "NOT_REQUIRED",

      index: true,
    },

    /*
    |----------------------------------------------------------------
    | CURRENT PAYMENT STAGE
    |----------------------------------------------------------------
    |
    | 1 = first payable stage
    | 2 = second payable stage
    | etc.
    |
    | null means there is currently no payable stage.
    |
    |----------------------------------------------------------------
    */

    currentPaymentStage: {
      type: Number,

      default: null,

      min: 1,
    },

    /*
    |----------------------------------------------------------------
    | APPLICATION PAYMENT PLAN SNAPSHOT
    |----------------------------------------------------------------
    |
    | Copied from Opportunity.paymentPlan when the application
    | is created.
    |
    | Example:
    |
    | [
    |   {
    |     stage: 1,
    |     name: "Migration Agreement Signing",
    |     amount: 2000000,
    |     status: "PENDING",
    |     invoiceId: null
    |   },
    |   {
    |     stage: 2,
    |     name: "Job Offer + Contract...",
    |     amount: 3000000,
    |     status: "LOCKED",
    |     invoiceId: null
    |   }
    | ]
    |
    |----------------------------------------------------------------
    */

    paymentPlan: {
      type: [applicationPaymentStageSchema],

      default: [],
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
    | OVERALL APPLICATION PROGRESS
    |----------------------------------------------------------------
    */

    progress: {
      type: Number,

      default: 0,

      min: 0,

      max: 100,
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

/*
|----------------------------------------------------------------
| CLIENT APPLICATIONS
|----------------------------------------------------------------
*/

applicationSchema.index({
  user: 1,

  createdAt: -1,
});

/*
|----------------------------------------------------------------
| OPPORTUNITY
|----------------------------------------------------------------
*/

applicationSchema.index({
  opportunity: 1,
});

/*
|----------------------------------------------------------------
| USER + OPPORTUNITY
|----------------------------------------------------------------
*/

applicationSchema.index({
  user: 1,

  opportunity: 1,
});

/*
|----------------------------------------------------------------
| USER + STATUS
|----------------------------------------------------------------
*/

applicationSchema.index({
  user: 1,

  status: 1,

  createdAt: -1,
});

/*
|----------------------------------------------------------------
| USER + PAYMENT STATUS
|----------------------------------------------------------------
*/

applicationSchema.index({
  user: 1,

  paymentStatus: 1,

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
