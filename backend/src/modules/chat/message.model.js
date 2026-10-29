import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    storedName: {
      type: String,
      required: true,
      trim: true,
    },

    storageKey: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: Number,
      required: true,
      min: 1,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      trim: true,
      maxlength: 10000,
      default: "",
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    editedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ chat: 1, sender: 1, createdAt: -1 });

messageSchema.pre("validate", function () {
  if (
    !this.content?.trim() &&
    (!this.attachments || this.attachments.length === 0)
  ) {
    this.invalidate(
      "content",
      "A message must contain text or at least one attachment.",
    );
  }
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
