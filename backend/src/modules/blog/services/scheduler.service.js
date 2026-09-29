import BlogPost from "../models/BlogPost.js";
import BlogComment from "../models/BlogComment.js";

/*
|--------------------------------------------------------------------------
| Publish Scheduled Blog Posts
|--------------------------------------------------------------------------
*/

export const publishScheduledPosts = async () => {
  const now = new Date();

  const result = await BlogPost.updateMany(
    {
      status: "SCHEDULED",

      scheduledFor: {
        $lte: now,
      },
    },

    {
      $set: {
        status: "PUBLISHED",
        publishedAt: now,
      },

      $unset: {
        scheduledFor: 1,
      },
    },
  );

  return {
    postsPublished: result.modifiedCount || 0,
  };
};

/*
|--------------------------------------------------------------------------
| Publish Scheduled Comments
|--------------------------------------------------------------------------
*/

export const publishScheduledComments = async () => {
  const now = new Date();

  const result = await BlogComment.updateMany(
    {
      status: "SCHEDULED",

      scheduledFor: {
        $lte: now,
      },
    },

    {
      $set: {
        status: "APPROVED",
        publishedAt: now,
      },

      $unset: {
        scheduledFor: 1,
      },
    },
  );

  return {
    commentsPublished: result.modifiedCount || 0,
  };
};

/*
|--------------------------------------------------------------------------
| Process All Scheduled Blog Content
|--------------------------------------------------------------------------
*/

export const processScheduledBlogContent = async () => {
  const [postsResult, commentsResult] = await Promise.all([
    publishScheduledPosts(),
    publishScheduledComments(),
  ]);

  return {
    ...postsResult,
    ...commentsResult,
  };
};
