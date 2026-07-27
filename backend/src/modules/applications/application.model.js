import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

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

    destinationCountry: {
      type: String,

      required: true,

      trim: true,
    },

    status: {
      type: String,

      enum: [
        "SUBMITTED",
        "UNDER_REVIEW",
        "DOCUMENT_REQUEST",
        "PROCESSING",
        "APPROVED",
        "REJECTED",
      ],

      default: "SUBMITTED",
    },

    notes: {
      type: String,

      default: "",
    },
  },

  {
    timestamps: true,
  },
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
