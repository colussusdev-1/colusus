import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| DEFAULT APPLICATION STEPS
|--------------------------------------------------------------------------
|
| Client personal information is handled by the Client Profile.
|
| The application itself begins with document collection.
|
*/

const DEFAULT_APPLICATION_STEPS = ["DOCUMENTS", "REVIEW"];

/*
|--------------------------------------------------------------------------
| SUPPORTED DOCUMENT TYPES
|--------------------------------------------------------------------------
|
| These values MUST remain aligned with the Document model.
|
*/

const DOCUMENT_TYPES = [
  "PASSPORT",
  "IDENTIFICATION",
  "ACADEMIC_CERTIFICATE",
  "FINANCIAL_DOCUMENT",
  "EMPLOYMENT_DOCUMENT",
  "OTHER",
];

/*
|--------------------------------------------------------------------------
| OPPORTUNITY SCHEMA
|--------------------------------------------------------------------------
*/

const opportunitySchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | COUNTRY INFORMATION
    |--------------------------------------------------------------------------
    */

    countryId: {
      type: Number,

      required: true,
    },

    countryName: {
      type: String,

      required: true,

      trim: true,
    },

    countrySlug: {
      type: String,

      required: true,

      trim: true,

      lowercase: true,

      index: true,
    },

    countryFlag: {
      type: String,

      default: "",
    },

    countryImage: {
      type: String,

      default: "",
    },

    /*
    |--------------------------------------------------------------------------
    | COUNTRY METADATA
    |--------------------------------------------------------------------------
    */

    applicants: {
      type: String,

      default: "",
    },

    countryCategories: {
      type: [String],

      default: [],
    },

    countryVisa: {
      type: String,

      default: "",
    },

    countryDuration: {
      type: String,

      default: "",
    },

    countryProcessingTime: {
      type: String,

      default: "",
    },

    countryDescription: {
      type: String,

      default: "",
    },

    opportunityScore: {
      type: String,

      default: "",
    },

    successRate: {
      type: String,

      default: "",
    },

    featured: {
      type: Boolean,

      default: false,
    },

    /*
    |--------------------------------------------------------------------------
    | OPPORTUNITY IDENTITY
    |--------------------------------------------------------------------------
    */

    legacyId: {
      type: Number,

      required: true,
    },

    title: {
      type: String,

      required: true,

      trim: true,
    },

    slug: {
      type: String,

      required: true,

      trim: true,
    },

    image: {
      type: String,

      default: "",
    },

    category: {
      type: String,

      default: "",
    },

    location: {
      type: String,

      default: "",
    },

    type: {
      type: String,

      default: "",
    },

    duration: {
      type: String,

      default: "",
    },

    icon: {
      type: String,

      default: "",
    },

    /*
    |--------------------------------------------------------------------------
    | OPPORTUNITY DETAILS
    |--------------------------------------------------------------------------
    */

    salary: {
      type: String,

      default: "",
    },

    demand: {
      type: String,

      default: "",
    },

    description: {
      type: String,

      default: "",
    },

    /*
    |--------------------------------------------------------------------------
    | HIGHLIGHTS
    |--------------------------------------------------------------------------
    */

    highlights: {
      type: [String],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | REQUIREMENTS
    |--------------------------------------------------------------------------
    */

    requirements: {
      type: [String],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | PUBLIC REQUIRED DOCUMENT INFORMATION
    |--------------------------------------------------------------------------
    |
    | This is the public-facing document list.
    |
    | Example:
    |
    | documents: [
    |   "Passport",
    |   "Academic Certificate",
    |   "Bank Statement"
    | ]
    |
    */

    documents: {
      type: [String],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | BENEFITS
    |--------------------------------------------------------------------------
    */

    benefits: {
      type: [String],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | APPLICATION / MIGRATION JOURNEY
    |--------------------------------------------------------------------------
    |
    | These are the public-facing pathway steps.
    |
    */

    steps: {
      type: [
        {
          title: {
            type: String,

            default: "",
          },

          description: {
            type: String,

            default: "",
          },

          duration: {
            type: String,

            default: "",
          },
        },
      ],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | POSITIONS
    |--------------------------------------------------------------------------
    */

    positions: {
      type: [mongoose.Schema.Types.Mixed],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | WORK CONDITIONS
    |--------------------------------------------------------------------------
    */

    workConditions: {
      type: mongoose.Schema.Types.Mixed,

      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | CONTRACT
    |--------------------------------------------------------------------------
    */

    contract: {
      type: String,

      default: "",
    },

    /*
    |--------------------------------------------------------------------------
    | FAQ
    |--------------------------------------------------------------------------
    */

    faq: {
      type: [mongoose.Schema.Types.Mixed],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | PRICING
    |--------------------------------------------------------------------------
    */

    pricing: {
      type: mongoose.Schema.Types.Mixed,

      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | PAYMENT PLAN
    |--------------------------------------------------------------------------
    */

    paymentPlan: {
      type: [mongoose.Schema.Types.Mixed],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | TERMS
    |--------------------------------------------------------------------------
    */

    terms: {
      type: [String],

      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | APPLICATION CONFIGURATION
    |--------------------------------------------------------------------------
    |
    | The opportunity controls the application requirements.
    |
    | Default journey:
    |
    | DOCUMENTS → REVIEW
    |
    | Personal information belongs to ClientProfile.
    |
    */

    applicationConfig: {
      /*
      |--------------------------------------------------------------------------
      | APPLICATION STEPS
      |--------------------------------------------------------------------------
      */

      steps: {
        type: [String],

        default: DEFAULT_APPLICATION_STEPS,
      },

      /*
      |--------------------------------------------------------------------------
      | QUESTIONS
      |--------------------------------------------------------------------------
      |
      | Kept for future pathway-specific requirements.
      |
      | They are NOT part of the default application journey.
      |
      */

      questions: {
        type: [mongoose.Schema.Types.Mixed],

        default: [],
      },

      /*
      |--------------------------------------------------------------------------
      | REQUIRED DOCUMENTS
      |--------------------------------------------------------------------------
      |
      | These are the actual documents the client must submit
      | for this specific migration pathway.
      |
      | The `type` MUST match the Document model.
      |
      | Example:
      |
      | {
      |   name: "Passport",
      |   type: "PASSPORT",
      |   description: "Valid passport bio-data page",
      |   required: true
      | }
      |
      */

      requiredDocuments: {
        type: [
          {
            name: {
              type: String,

              required: true,

              trim: true,
            },

            type: {
              type: String,

              enum: DOCUMENT_TYPES,

              required: true,
            },

            description: {
              type: String,

              default: "",

              trim: true,
            },

            required: {
              type: Boolean,

              default: true,
            },
          },
        ],

        default: [],
      },

      /*
      |--------------------------------------------------------------------------
      | INTERNAL WORKFLOW
      |--------------------------------------------------------------------------
      */

      workflow: {
        type: [mongoose.Schema.Types.Mixed],

        default: [],
      },
    },

    /*
    |--------------------------------------------------------------------------
    | ACTIVE
    |--------------------------------------------------------------------------
    */

    active: {
      type: Boolean,

      default: true,
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

opportunitySchema.index(
  {
    countrySlug: 1,

    slug: 1,
  },

  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| MODEL
|--------------------------------------------------------------------------
*/

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;
