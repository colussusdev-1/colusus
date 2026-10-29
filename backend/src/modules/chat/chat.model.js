import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "Client Communication",
    },

    relatedApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "ARCHIVED"],
      default: "OPEN",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

chatSchema.index({ participants: 1, lastMessageAt: -1 });
chatSchema.index({ client: 1, status: 1 });

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;
