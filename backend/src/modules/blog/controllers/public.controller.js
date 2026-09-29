import {
  getFeaturedPost,
  getPublicCategories,
  getPublicComments,
  getPublicPost,
  getPublicPosts,
  getRelatedPosts,
  incrementViews,
} from "../services/blog.service.js";

import { createComment as createBlogComment } from "./comment.controller.js";

export const listPosts = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);

    const limit = Math.min(24, Math.max(1, Number(req.query.limit) || 12));

    const result = await getPublicPosts({
      category: req.query.category,
      page,
      limit,
    });

    return res.json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    return next(error);
  }
};

export const listCategories = async (req, res, next) => {
  try {
    const categories = await getPublicCategories();

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return next(error);
  }
};

export const featuredPost = async (req, res, next) => {
  try {
    const post = await getFeaturedPost();

    return res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    return next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await getPublicPost(req.params.slug);

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

export const relatedPosts = async (req, res, next) => {
  try {
    const post = await getPublicPost(req.params.slug);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    const posts = await getRelatedPosts(post);

    return res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    return next(error);
  }
};

export const recordView = async (req, res, next) => {
  try {
    const post = await incrementViews(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    return res.json({
      success: true,
      data: {
        views: post.views,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const listComments = async (req, res, next) => {
  try {
    const comments = await getPublicComments(req.params.id);

    return res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    return next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    return createBlogComment(req, res, next);
  } catch (error) {
    return next(error);
  }
};
