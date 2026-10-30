import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/* DOCUMENT SCHEMA                                                            */
/* -------------------------------------------------------------------------- */

const serviceEnquiryDocumentSchema = new mongoose.Schema(
  {
    fieldName: {
      type: String,
      trim: true,
      required: true,
    },

    documentType: {
      type: String,
      trim: true,
      required: true,
    },

    name: {
      type: String,
      trim: true,
      required: true,
    },

    publicId: {
      type: String,
      trim: true,
      required: true,
    },

    resourceType: {
      type: String,
      trim: true,
      default: "raw",
    },

    format: {
      type: String,
      trim: true,
    },

    mimeType: {
      type: String,
      trim: true,
    },

    size: {
      type: Number,
      default: 0,
    },

    storageType: {
      type: String,
      default: "authenticated",
    },
  },
  {
    timestamps: true,
  },
);

/* -------------------------------------------------------------------------- */
/* APPLICANT SCHEMA                                                           */
/* -------------------------------------------------------------------------- */

const applicantSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    countryOfResidence: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

/* -------------------------------------------------------------------------- */
/* MAIN SERVICE ENQUIRY SCHEMA                                                */
/* -------------------------------------------------------------------------- */

const serviceEnquirySchema = new mongoose.Schema(
  {
    /* ---------------------------------------------------------------------- */
    /* SERVICE IDENTITY                                                       */
    /* ---------------------------------------------------------------------- */

    serviceType: {
      type: String,
      required: true,
      enum: [
        "INTERNATIONAL_RECRUITMENT",
        "STUDY_ABROAD",
        "SKILLED_MIGRATION",
        "TRAINEE_APPRENTICESHIP",
      ],
      index: true,
    },

    serviceName: {
      type: String,
      required: true,
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /* APPLICANT                                                              */
    /* ---------------------------------------------------------------------- */

    applicant: {
      type: applicantSchema,
      required: true,
    },

    /* ---------------------------------------------------------------------- */
    /* SERVICE-SPECIFIC INFORMATION                                           */
    /* ---------------------------------------------------------------------- */

    enquiryData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },

    /* ---------------------------------------------------------------------- */
    /* DOCUMENTS                                                              */
    /* ---------------------------------------------------------------------- */

    documents: {
      type: [serviceEnquiryDocumentSchema],
      default: [],
    },

    /* ---------------------------------------------------------------------- */
    /* ENQUIRY STATUS                                                         */
    /* ---------------------------------------------------------------------- */

    status: {
      type: String,
      enum: [
        "NEW",
        "REVIEWING",
        "CONTACTED",
        "QUALIFIED",
        "CONVERTED",
        "CLOSED",
      ],
      default: "NEW",
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* SOURCE                                                                 */
    /* ---------------------------------------------------------------------- */

    source: {
      type: String,
      trim: true,
      default: "WEBSITE",
    },

    /* ---------------------------------------------------------------------- */
    /* STAFF ASSIGNMENT                                                       */
    /* ---------------------------------------------------------------------- */

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* INTERNAL NOTES                                                         */
    /* ---------------------------------------------------------------------- */

    internalNotes: {
      type: [
        {
          message: {
            type: String,
            required: true,
            trim: true,
          },

          addedBy: {
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
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

/* -------------------------------------------------------------------------- */
/* INDEXES                                                                    */
/* -------------------------------------------------------------------------- */

serviceEnquirySchema.index({
  serviceType: 1,
  createdAt: -1,
});

serviceEnquirySchema.index({
  status: 1,
  createdAt: -1,
});

serviceEnquirySchema.index({
  "applicant.email": 1,
  createdAt: -1,
});

serviceEnquirySchema.index({
  assignedTo: 1,
  status: 1,
});

const ServiceEnquiry = mongoose.model("ServiceEnquiry", serviceEnquirySchema);

export default ServiceEnquiry;
