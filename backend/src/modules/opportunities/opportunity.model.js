import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    /*
        |--------------------------------------------------------------------------
        | Country Information
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
        | Country Metadata
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
        | Opportunity Identity
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
        | Opportunity Details
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
        | Requirements
        |--------------------------------------------------------------------------
        */

    requirements: {
      type: [String],
      default: [],
    },

    /*
        |--------------------------------------------------------------------------
        | Required Documents
        |--------------------------------------------------------------------------
        */

    documents: {
      type: [String],
      default: [],
    },

    /*
        |--------------------------------------------------------------------------
        | Benefits
        |--------------------------------------------------------------------------
        */

    benefits: {
      type: [String],
      default: [],
    },

    /*
        |--------------------------------------------------------------------------
        | Application Journey
        |--------------------------------------------------------------------------
        */

    steps: {
      type: [
        {
          title: {
            type: String,
          },

          description: {
            type: String,
          },

          duration: {
            type: String,
          },
        },
      ],

      default: [],
    },

    /*
        |--------------------------------------------------------------------------
        | Positions
        |--------------------------------------------------------------------------
        */

    positions: {
      type: [
        {
          title: String,
          description: String,
          salary: String,
          location: String,
        },
      ],

      default: [],
    },

    /*
        |--------------------------------------------------------------------------
        | Pricing
        |--------------------------------------------------------------------------
        */

    pricing: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    /*
        |--------------------------------------------------------------------------
        | Payment Plan
        |--------------------------------------------------------------------------
        */

    paymentPlan: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    /*
        |--------------------------------------------------------------------------
        | Application Configuration
        |--------------------------------------------------------------------------
        |
        | This will eventually control the dynamic application wizard.
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
        | Active
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
============================================================
INDEXES
============================================================
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

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;
