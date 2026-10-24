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
|
| Stores metadata and storage references only.
| The actual document contents must be stored using the application's
| configured file storage solution.
|
*/

const assessmentDocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: DOCUMENT_TYPES,
      required: true,
    },

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

    /*
     * Provider used to store the file, for example LOCAL or CLOUDINARY.
     * Set this according to the storage implementation actually used.
     */

    storageProvider: {
      type: String,
      trim: true,
      default: "",
      maxlength: 50,
    },

    /*
     * Storage identifier or relative path.
     * Do not put file contents or private credentials here.
     */

    storageKey: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    /*
     * Optional storage URL/reference.
     * For private documents, prefer a private storage reference rather
     * than a permanently public URL.
     */

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
    |
    | Supports Australia, New Zealand, and future assessment-first
    | opportunities through the existing Opportunity model.
    |
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
    |
    | Metadata and references for documents uploaded with the assessment.
    | Actual file storage is handled by the upload/storage layer.
    |
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
    |
    | Null before the candidate links their assessment to an account.
    | The backend must verify the authenticated client before setting it.
    |
    */

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientProfile",
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
    |
    | The formal application reference is intentionally not added until
    | the actual application model and its relationship are confirmed.
    |
    */

    convertedAt: {
      type: Date,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | INTERNAL REVIEW NOTES
    |--------------------------------------------------------------------------
    |
    | Never expose these fields through public assessment responses.
    |
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
