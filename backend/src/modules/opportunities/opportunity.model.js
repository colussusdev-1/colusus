import mongoose from "mongoose";

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
    |
    | Examples:
    |
    | [
    |   "Verified Job Offer",
    |   "Work Permit",
    |   "Employer Accommodation"
    | ]
    |
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
    | REQUIRED DOCUMENTS
    |--------------------------------------------------------------------------
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
    | Example:
    |
    | [
    |   {
    |     title: "Document Submission",
    |     description: "...",
    |     duration: "..."
    |   }
    | ]
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
    |
    | Position structures differ between opportunities.
    |
    | Examples include:
    |
    | {
    |   sector: "Construction",
    |   roles: [...],
    |   salary: "...",
    |   notes: [...]
    | }
    |
    | or:
    |
    | {
    |   title: "Cleaner",
    |   category: "Cleaning",
    |   description: "..."
    | }
    |
    | We therefore preserve the complete structure.
    |
    */

    positions: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | WORK CONDITIONS
    |--------------------------------------------------------------------------
    |
    | Some opportunities use an object:
    |
    | {
    |   hours: "8 - 12 Hours Per Day"
    | }
    |
    | Others use an array:
    |
    | [
    |   "Working Hours: 120–160 Hours Per Month",
    |   "Probation Period: 3 Months"
    | ]
    |
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
    |
    | Pricing structures can differ between pathways.
    |
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
    | This is the important part for the application wizard.
    |
    | The opportunity determines:
    |
    | - which application steps are shown
    | - which questions are asked
    | - which documents are required
    | - which internal workflow is created
    |
    */

    applicationConfig: {
      steps: {
        type: [String],

        default: ["PERSONAL_INFORMATION", "DOCUMENTS", "REVIEW"],
      },

      questions: {
        type: [mongoose.Schema.Types.Mixed],

        default: [],
      },

      requiredDocuments: {
        type: [mongoose.Schema.Types.Mixed],

        default: [],
      },

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
