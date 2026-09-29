import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    excerpt: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "SCHEDULED", "PUBLISHED"],
      default: "DRAFT",
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

    featured: {
      type: Boolean,
      default: false,
    },

    commentsEnabled: {
      type: Boolean,
      default: true,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    readingTime: {
      type: Number,
      default: 1,
      min: 1,
    },

    seo: {
      metaTitle: {
        type: String,
        default: "",
        trim: true,
      },

      metaDescription: {
        type: String,
        default: "",
        trim: true,
      },

      keywords: [
        {
          type: String,
          trim: true,
        },
      ],
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

blogPostSchema.index({
  status: 1,
  publishedAt: -1,
});

blogPostSchema.index({
  category: 1,
  status: 1,
  publishedAt: -1,
});

blogPostSchema.index({
  views: -1,
  publishedAt: -1,
});

export default mongoose.model("BlogPost", blogPostSchema);
