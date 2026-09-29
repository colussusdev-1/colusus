import mongoose from "mongoose";

import BlogPost from "../models/BlogPost.js";
import BlogComment from "../models/BlogComment.js";

import { createSlug, calculateReadingTime } from "../utils/blog.utils.js";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const getUserId = (req) => req.user?._id || req.user?.id || null;

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

const escapeRegex = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildPostPayload = (body, existing = {}) => {
  const title =
    body.title !== undefined ? String(body.title).trim() : existing.title;

  const content =
    body.content !== undefined ? String(body.content) : existing.content;

  const payload = {};

  if (title !== undefined) {
    payload.title = title;
  }

  if (body.slug !== undefined) {
    payload.slug = createSlug(body.slug);
  } else if (title && (!existing.slug || body.title !== undefined)) {
    payload.slug = createSlug(title);
  }

  if (body.excerpt !== undefined) {
    payload.excerpt = String(body.excerpt).trim();
  }

  if (content !== undefined) {
    payload.content = content;
    payload.readingTime = calculateReadingTime(content);
  }

  if (body.category !== undefined) {
    payload.category = String(body.category).trim();
  }

  if (body.tags !== undefined) {
    payload.tags = Array.isArray(body.tags)
      ? body.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : String(body.tags)
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
  }

  if (body.coverImage !== undefined) {
    payload.coverImage = body.coverImage;
  }

  if (body.featured !== undefined) {
    payload.featured = Boolean(body.featured);
  }

  if (body.commentsEnabled !== undefined) {
    payload.commentsEnabled = Boolean(body.commentsEnabled);
  }

  if (body.seo !== undefined) {
    payload.seo = body.seo;
  }

  return payload;
};

/*
|--------------------------------------------------------------------------
| Create Blog Post
|--------------------------------------------------------------------------
*/

export const createPost = async (req, res, next) => {
  try {
    const rawTitle = req.body.title;
    const rawContent = req.body.content;

    const title = typeof rawTitle === "string" ? rawTitle.trim() : "";

    const content = typeof rawContent === "string" ? rawContent : "";

    if (!title || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    const author = getUserId(req);

    if (!author) {
      return res.status(401).json({
        success: false,
        message: "Authenticated author is required.",
      });
    }

    const slug = createSlug(req.body.slug || title);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "A valid title or slug is required.",
      });
    }

    const existingPost = await BlogPost.findOne({
      slug,
    });

    if (existingPost) {
      return res.status(409).json({
        success: false,
        message: "A blog post with this slug already exists.",
      });
    }

    const requestedStatus = String(req.body.status || "DRAFT").toUpperCase();

    const status = ["DRAFT", "SCHEDULED", "PUBLISHED"].includes(requestedStatus)
      ? requestedStatus
      : "DRAFT";

    const payload = buildPostPayload(req.body);

    payload.title = title;
    payload.content = content;
    payload.slug = slug;
    payload.author = author;
    payload.status = status;

    payload.publishedAt = null;
    payload.scheduledFor = null;

    if (status === "PUBLISHED") {
      payload.publishedAt = new Date();
    }

    if (status === "SCHEDULED") {
      if (!req.body.scheduledFor) {
        return res.status(400).json({
          success: false,
          message: "scheduledFor is required for scheduled posts.",
        });
      }

      const scheduledDate = new Date(req.body.scheduledFor);

      if (Number.isNaN(scheduledDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid scheduled date.",
        });
      }

      if (scheduledDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date must be in the future.",
        });
      }

      payload.scheduledFor = scheduledDate;
    }

    const post = await BlogPost.create(payload);

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully.",
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Admin Blog Posts
|--------------------------------------------------------------------------
*/

export const getPosts = async (req, res, next) => {
  try {
    const {
      status,
      category,
      featured,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = String(status).toUpperCase();
    }

    if (category) {
      filter.category = category;
    }

    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    if (search?.trim()) {
      const searchRegex = new RegExp(escapeRegex(search.trim()), "i");

      filter.$or = [
        {
          title: searchRegex,
        },
        {
          excerpt: searchRegex,
        },
      ];
    }

    const pageNumber = Math.max(Number(page) || 1, 1);

    const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [posts, total] = await Promise.all([
      BlogPost.find(filter)
        .populate("author", "name email")
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      BlogPost.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: posts,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Admin Post
|--------------------------------------------------------------------------
*/

export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog post ID.",
      });
    }

    const post = await BlogPost.findById(id).populate("author", "name email");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    return res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Update Blog Post
|--------------------------------------------------------------------------
*/

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog post ID.",
      });
    }

    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    const payload = buildPostPayload(req.body, post);

    if (payload.slug !== undefined && !payload.slug) {
      return res.status(400).json({
        success: false,
        message: "A valid slug is required.",
      });
    }

    if (payload.slug) {
      const duplicate = await BlogPost.findOne({
        slug: payload.slug,
        _id: {
          $ne: post._id,
        },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another blog post already uses this slug.",
        });
      }
    }

    if (req.body.status !== undefined) {
      const requestedStatus = String(req.body.status).toUpperCase();

      if (!["DRAFT", "SCHEDULED", "PUBLISHED"].includes(requestedStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid blog post status.",
        });
      }

      payload.status = requestedStatus;
    }

    if (payload.status === "SCHEDULED") {
      if (!req.body.scheduledFor) {
        return res.status(400).json({
          success: false,
          message: "scheduledFor is required.",
        });
      }

      const scheduledDate = new Date(req.body.scheduledFor);

      if (
        Number.isNaN(scheduledDate.getTime()) ||
        scheduledDate <= new Date()
      ) {
        return res.status(400).json({
          success: false,
          message: "Scheduled date must be a valid future date.",
        });
      }

      payload.scheduledFor = scheduledDate;

      payload.publishedAt = null;
    }

    if (payload.status === "PUBLISHED") {
      payload.publishedAt = post.publishedAt || new Date();

      payload.scheduledFor = null;
    }

    if (payload.status === "DRAFT") {
      payload.scheduledFor = null;

      payload.publishedAt = null;
    }

    Object.assign(post, payload);

    await post.save();

    return res.json({
      success: true,
      message: "Blog post updated successfully.",
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Delete Blog Post
|--------------------------------------------------------------------------
*/

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog post ID.",
      });
    }

    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    await BlogComment.deleteMany({
      post: post._id,
    });

    await post.deleteOne();

    return res.json({
      success: true,
      message: "Blog post deleted successfully.",
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Publish Immediately
|--------------------------------------------------------------------------
*/

export const publishPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog post ID.",
      });
    }

    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    post.status = "PUBLISHED";

    post.publishedAt = post.publishedAt || new Date();

    post.scheduledFor = null;

    await post.save();

    return res.json({
      success: true,
      message: "Blog post published.",
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Schedule Post
|--------------------------------------------------------------------------
*/

export const schedulePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scheduledFor } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog post ID.",
      });
    }

    if (!scheduledFor) {
      return res.status(400).json({
        success: false,
        message: "scheduledFor is required.",
      });
    }

    const scheduledDate = new Date(scheduledFor);

    if (Number.isNaN(scheduledDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date.",
      });
    }

    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Scheduled date must be in the future.",
      });
    }

    const post = await BlogPost.findByIdAndUpdate(
      id,
      {
        status: "SCHEDULED",
        scheduledFor: scheduledDate,
        publishedAt: null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    return res.json({
      success: true,
      message: "Blog post scheduled successfully.",
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Unpublish Post
|--------------------------------------------------------------------------
*/

export const unpublishPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog post ID.",
      });
    }

    const post = await BlogPost.findByIdAndUpdate(
      id,
      {
        status: "DRAFT",
        scheduledFor: null,
        publishedAt: null,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    return res.json({
      success: true,
      message: "Blog post unpublished.",
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Toggle Featured
|--------------------------------------------------------------------------
*/

export const toggleFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog post ID.",
      });
    }

    const post = await BlogPost.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    const shouldFeature = !post.featured;

    if (shouldFeature) {
      await BlogPost.updateMany(
        {
          _id: {
            $ne: post._id,
          },
          featured: true,
        },
        {
          $set: {
            featured: false,
          },
        },
      );
    }

    post.featured = shouldFeature;

    await post.save();

    return res.json({
      success: true,
      message: shouldFeature
        ? "Blog post featured."
        : "Blog post removed from featured.",
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};
