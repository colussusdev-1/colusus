import BlogPost from "../models/BlogPost.js";
import BlogComment from "../models/BlogComment.js";

import { calculateReadingTime, createSlug } from "../utils/blog.utils.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const normalizePagination = (page = 1, limit = 12) => {
  const safePage = Math.max(Number(page) || 1, 1);

  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

/*
|--------------------------------------------------------------------------
| Build Blog Post Data
|--------------------------------------------------------------------------
*/

export const buildPostData = ({
  title,
  excerpt,
  content,
  category,
  tags,
  coverImage,
  author,
  status,
  scheduledFor,
  featured,
  commentsEnabled,
  seo,
  publishedAt = null,
}) => {
  let normalizedPublishedAt = publishedAt;

  if (status === "PUBLISHED" && !normalizedPublishedAt) {
    normalizedPublishedAt = new Date();
  }

  if (status !== "PUBLISHED") {
    normalizedPublishedAt = null;
  }

  return {
    title: title?.trim(),

    slug: createSlug(title),

    excerpt: excerpt?.trim() || "",

    content,

    category: category?.trim() || "",

    tags: Array.isArray(tags)
      ? tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [],

    coverImage: coverImage || {},

    author,

    status,

    scheduledFor: status === "SCHEDULED" ? scheduledFor || null : null,

    publishedAt: normalizedPublishedAt,

    featured: Boolean(featured),

    commentsEnabled: commentsEnabled !== false,

    readingTime: calculateReadingTime(content),

    seo: seo || {},
  };
};

/*
|--------------------------------------------------------------------------
| Public — Get Blog Posts
|--------------------------------------------------------------------------
*/

export const getPublicPosts = async ({ category, page = 1, limit = 12 }) => {
  const {
    page: currentPage,
    limit: currentLimit,
    skip,
  } = normalizePagination(page, limit);

  const filter = {
    status: "PUBLISHED",

    publishedAt: {
      $lte: new Date(),
    },
  };

  if (category && category !== "all") {
    filter.category = category;
  }

  const [posts, total] = await Promise.all([
    BlogPost.find(filter)
      .populate("author", "name")
      .sort({
        publishedAt: -1,
      })
      .skip(skip)
      .limit(currentLimit)
      .lean(),

    BlogPost.countDocuments(filter),
  ]);

  return {
    posts,

    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      pages: Math.ceil(total / currentLimit),
    },
  };
};

/*
|--------------------------------------------------------------------------
| Public — Featured Post
|--------------------------------------------------------------------------
*/

export const getFeaturedPost = async () => {
  const filter = {
    status: "PUBLISHED",

    publishedAt: {
      $lte: new Date(),
    },
  };

  const featured = await BlogPost.findOne({
    ...filter,
    featured: true,
  })
    .populate("author", "name")
    .sort({
      publishedAt: -1,
    })
    .lean();

  if (featured) {
    return featured;
  }

  return BlogPost.findOne(filter)
    .populate("author", "name")
    .sort({
      publishedAt: -1,
    })
    .lean();
};

/*
|--------------------------------------------------------------------------
| Public — Single Post
|--------------------------------------------------------------------------
*/

export const getPublicPost = async (slug) => {
  return BlogPost.findOne({
    slug,

    status: "PUBLISHED",

    publishedAt: {
      $lte: new Date(),
    },
  })
    .populate("author", "name")
    .lean();
};

/*
|--------------------------------------------------------------------------
| Public — Related Posts
|--------------------------------------------------------------------------
*/

export const getRelatedPosts = async (post) => {
  if (!post) {
    return [];
  }

  const filter = {
    _id: {
      $ne: post._id,
    },

    status: "PUBLISHED",

    publishedAt: {
      $lte: new Date(),
    },

    category: post.category,
  };

  return BlogPost.find(filter)
    .populate("author", "name")
    .sort({
      publishedAt: -1,
    })
    .limit(3)
    .lean();
};

/*
|--------------------------------------------------------------------------
| Public — Increment Views
|--------------------------------------------------------------------------
*/

export const incrementViews = async (postId) => {
  return BlogPost.findOneAndUpdate(
    {
      _id: postId,

      status: "PUBLISHED",

      publishedAt: {
        $lte: new Date(),
      },
    },

    {
      $inc: {
        views: 1,
      },
    },

    {
      new: true,
    },
  );
};

/*
|--------------------------------------------------------------------------
| Public — Get Comments
|--------------------------------------------------------------------------
*/

export const getPublicComments = async (postId) => {
  return BlogComment.find({
    post: postId,

    status: "APPROVED",

    publishedAt: {
      $lte: new Date(),
    },
  })
    .sort({
      pinned: -1,
      publishedAt: -1,
      createdAt: -1,
    })
    .lean();
};

/*
|--------------------------------------------------------------------------
| Public — Comment Count
|--------------------------------------------------------------------------
*/

export const getCommentCount = async (postId) => {
  return BlogComment.countDocuments({
    post: postId,

    status: "APPROVED",

    publishedAt: {
      $lte: new Date(),
    },
  });
};

/*
|--------------------------------------------------------------------------
| Public — Categories
|--------------------------------------------------------------------------
*/

export const getPublicCategories = async () => {
  return BlogPost.aggregate([
    {
      $match: {
        status: "PUBLISHED",

        publishedAt: {
          $lte: new Date(),
        },
      },
    },

    {
      $group: {
        _id: "$category",

        count: {
          $sum: 1,
        },
      },
    },

    {
      $match: {
        _id: {
          $nin: [null, ""],
        },
      },
    },

    {
      $project: {
        _id: 0,

        name: "$_id",

        count: 1,
      },
    },

    {
      $sort: {
        name: 1,
      },
    },
  ]);
};

/*
|--------------------------------------------------------------------------
| Public — Popular Posts
|--------------------------------------------------------------------------
*/

export const getPopularPosts = async (limit = 5) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);

  return BlogPost.find({
    status: "PUBLISHED",

    publishedAt: {
      $lte: new Date(),
    },
  })
    .populate("author", "name")
    .sort({
      views: -1,
      publishedAt: -1,
    })
    .limit(safeLimit)
    .lean();
};

/*
|--------------------------------------------------------------------------
| Public — Recent Posts
|--------------------------------------------------------------------------
*/

export const getRecentPosts = async (limit = 5) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 5, 1), 20);

  return BlogPost.find({
    status: "PUBLISHED",

    publishedAt: {
      $lte: new Date(),
    },
  })
    .populate("author", "name")
    .sort({
      publishedAt: -1,
    })
    .limit(safeLimit)
    .lean();
};

/*
|--------------------------------------------------------------------------
| Admin — Blog Statistics
|--------------------------------------------------------------------------
*/

export const getBlogStats = async () => {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    scheduledPosts,
    totalViews,
    pendingComments,
    approvedComments,
    scheduledComments,
  ] = await Promise.all([
    BlogPost.countDocuments(),

    BlogPost.countDocuments({
      status: "PUBLISHED",
    }),

    BlogPost.countDocuments({
      status: "DRAFT",
    }),

    BlogPost.countDocuments({
      status: "SCHEDULED",
    }),

    BlogPost.aggregate([
      {
        $group: {
          _id: null,

          total: {
            $sum: "$views",
          },
        },
      },
    ]),

    BlogComment.countDocuments({
      status: "PENDING",
    }),

    BlogComment.countDocuments({
      status: "APPROVED",
    }),

    BlogComment.countDocuments({
      status: "SCHEDULED",
    }),
  ]);

  return {
    posts: {
      total: totalPosts,
      published: publishedPosts,
      drafts: draftPosts,
      scheduled: scheduledPosts,
    },

    views: totalViews[0]?.total || 0,

    comments: {
      pending: pendingComments,
      approved: approvedComments,
      scheduled: scheduledComments,
    },
  };
};
