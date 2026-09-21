import mongoose from "mongoose";

const formSubmissionDocumentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      trim: true,
    },

    publicId: {
      type: String,
      trim: true,
    },

    resourceType: {
      type: String,
      trim: true,
    },

    format: {
      type: String,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const formSubmissionSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | FORM IDENTITY
    |--------------------------------------------------------------------------
    */

    formKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    formName: {
      type: String,
      required: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | SUBMITTED FORM DATA
    |--------------------------------------------------------------------------
    |
    | This remains flexible because different public forms will have
    | different fields.
    |
    */

    submissionData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },

    /*
    |--------------------------------------------------------------------------
    | UPLOADED DOCUMENTS
    |--------------------------------------------------------------------------
    */

    documents: {
      type: [formSubmissionDocumentSchema],
      default: [],
    },

    /*
    |--------------------------------------------------------------------------
    | SUBMISSION STATUS
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | SOURCE
    |--------------------------------------------------------------------------
    */

    source: {
      type: String,
      trim: true,
      default: "WEBSITE",
    },

    /*
    |--------------------------------------------------------------------------
    | ASSIGNMENT
    |--------------------------------------------------------------------------
    */

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | INTERNAL NOTES
    |--------------------------------------------------------------------------
    */

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

formSubmissionSchema.index({
  formKey: 1,
  createdAt: -1,
});

formSubmissionSchema.index({
  status: 1,
  createdAt: -1,
});

const FormSubmission = mongoose.model("FormSubmission", formSubmissionSchema);

export default FormSubmission;
