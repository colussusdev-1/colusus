import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      minlength: 3,
      maxlength: 120,
    },

    email: {
      type: String,
      required: [true, "Email address is required."],
      trim: true,
      lowercase: true,
      maxlength: 254,
      index: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
      minlength: 7,
      maxlength: 25,
    },

    service: {
      type: String,
      required: [true, "Please select a service."],
      trim: true,
      maxlength: 150,
    },

    message: {
      type: String,
      required: [true, "Your message is required."],
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },

    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "CONTACTED", "RESOLVED", "CLOSED"],
      default: "NEW",
      index: true,
    },

    source: {
      type: String,
      default: "website-contact",
      trim: true,
      maxlength: 100,
    },

    internalNotes: [
      {
        message: {
          type: String,
          trim: true,
          maxlength: 2000,
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

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    contactedAt: {
      type: Date,
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.index({
  status: 1,
  createdAt: -1,
});

contactSchema.index({
  createdAt: -1,
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
