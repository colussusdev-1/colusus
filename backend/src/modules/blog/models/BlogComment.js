import mongoose from "mongoose";

const blogCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "SCHEDULED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    scheduledFor: {
      type: Date,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    pinned: {
      type: Boolean,
      default: false,
    },

    isEditorial: {
      type: Boolean,
      default: false,
    },

    createdBy: {
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
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

blogCommentSchema.index({
  post: 1,
  status: 1,
  publishedAt: -1,
});

export default mongoose.model("BlogComment", blogCommentSchema);
