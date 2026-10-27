import mongoose from "mongoose";
import { randomBytes } from "node:crypto";

/*
|--------------------------------------------------------------------------
| ASSESSMENT CONSTANTS
|--------------------------------------------------------------------------
*/

const ASSESSMENT_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "CONTACTED",
  "QUALIFIED",
  "NOT_QUALIFIED",
  "CONVERTED",
  "WITHDRAWN",
];

const DOCUMENT_TYPES = ["PASSPORT", "EDUCATIONAL_CERTIFICATE", "CV", "OTHER"];

/*
|--------------------------------------------------------------------------
| ASSESSMENT REFERENCE GENERATOR
|--------------------------------------------------------------------------
*/

function generateAssessmentReference() {
  const year = new Date().getFullYear();
  const randomPart = randomBytes(6).toString("hex").toUpperCase();

  return `ASM-${year}-${randomPart}`;
}

/*
|--------------------------------------------------------------------------
| DOCUMENT SCHEMA
|--------------------------------------------------------------------------
*/

const assessmentDocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: DOCUMENT_TYPES,
      required: true,
    },

    // Human-readable description of the document's purpose.
    documentLabel: {
      type: String,
      trim: true,
      default: "",
      maxlength: 200,
    },

    // Identifies the originating field in the assessment form.
    fieldKey: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    // Original filename supplied by the applicant.
    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    mimeType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    size: {
      type: Number,
      required: true,
      min: 1,
    },

    storageProvider: {
      type: String,
      trim: true,
      default: "",
      maxlength: 50,
    },

    storageKey: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    url: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  },
);

/*
|--------------------------------------------------------------------------
| ASSESSMENT SCHEMA
|--------------------------------------------------------------------------
*/

const assessmentSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | ASSESSMENT REFERENCE
    |--------------------------------------------------------------------------
    */

    reference: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      trim: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | OPPORTUNITY
    |--------------------------------------------------------------------------
    */

    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
      index: true,
    },

    opportunitySlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    opportunityTitle: {
      type: String,
      required: true,
      trim: true,
    },

    countryName: {
      type: String,
      required: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | CANDIDATE PERSONAL DETAILS
    |--------------------------------------------------------------------------
    */

    personalDetails: {
      fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
        index: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },

      age: {
        type: Number,
        required: true,
        min: 18,
        max: 100,
      },

      countryOfResidence: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | EDUCATION AND WORK EXPERIENCE
    |--------------------------------------------------------------------------
    */

    background: {
      education: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      fieldOfStudy: {
        type: String,
        default: "",
        trim: true,
        maxlength: 150,
      },

      workExperience: {
        type: String,
        default: "",
        trim: true,
        maxlength: 5000,
      },

      yearsOfExperience: {
        type: Number,
        min: 0,
        max: 80,
        default: null,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | PROGRAM PREFERENCES
    |--------------------------------------------------------------------------
    */

    preferences: {
      trainingCategory: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      preferredCourse: {
        type: String,
        default: "",
        trim: true,
        maxlength: 200,
      },

      preferredIntake: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      budget: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      hasPassport: {
        type: String,
        required: true,
        enum: ["YES", "NO", "IN_PROGRESS"],
      },
    },

    /*
    |--------------------------------------------------------------------------
    | ADDITIONAL INFORMATION
    |--------------------------------------------------------------------------
    */

    additionalInformation: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    /*
    |--------------------------------------------------------------------------
    | SUPPORTING DOCUMENTS
    |--------------------------------------------------------------------------
    */

    documents: {
      type: [assessmentDocumentSchema],
      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | PRIVACY CONSENT
    |--------------------------------------------------------------------------
    */

    consent: {
      privacyAccepted: {
        type: Boolean,
        required: true,
        validate: {
          validator(value) {
            return value === true;
          },
          message:
            "The candidate must accept the privacy notice before submitting.",
        },
      },

      acceptedAt: {
        type: Date,
        default: null,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | ASSESSMENT STATUS
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: ASSESSMENT_STATUSES,
      default: "PENDING",
      required: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | CLIENT ACCOUNT LINK
    |--------------------------------------------------------------------------
    */

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    accountLinkedAt: {
      type: Date,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | CONVERSION METADATA
    |--------------------------------------------------------------------------
    */

    convertedAt: {
      type: Date,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | INTERNAL REVIEW NOTES
    |--------------------------------------------------------------------------
    */

    internalNotes: {
      type: String,
      default: "",
      maxlength: 10000,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | SUBMISSION METADATA
    |--------------------------------------------------------------------------
    */

    submittedAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
    minimize: false,
  },
);

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/

assessmentSchema.index({
  opportunity: 1,
  submittedAt: -1,
});

assessmentSchema.index({
  status: 1,
  submittedAt: -1,
});

assessmentSchema.index({
  client: 1,
  submittedAt: -1,
});

assessmentSchema.index({
  "personalDetails.email": 1,
  submittedAt: -1,
});

/*
|--------------------------------------------------------------------------
| REFERENCE AND CONSENT GENERATION
|--------------------------------------------------------------------------
*/

assessmentSchema.pre("validate", function () {
  if (this.isNew && !this.reference) {
    this.reference = generateAssessmentReference();
  }

  if (
    this.isNew &&
    this.consent?.privacyAccepted === true &&
    !this.consent.acceptedAt
  ) {
    this.consent.acceptedAt = new Date();
  }
});

/*
|--------------------------------------------------------------------------
| MODEL REGISTRATION
|--------------------------------------------------------------------------
*/

const Assessment =
  mongoose.models.Assessment || mongoose.model("Assessment", assessmentSchema);

export default Assessment;
