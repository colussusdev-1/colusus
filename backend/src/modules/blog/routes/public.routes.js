import express from "express";

import {
  featuredPost,
  listCategories,
  listPosts,
  getPost,
  relatedPosts,
  recordView,
  listComments,
  createComment,
} from "../controllers/public.controller.js";

const router = express.Router();

router.get("/", listPosts);

router.get("/categories", listCategories);

router.get("/featured", featuredPost);

router.get("/post/:slug/related", relatedPosts);

router.get("/post/:slug", getPost);

router.post("/post/:id/view", recordView);

router.get("/post/:id/comments", listComments);

router.post("/post/:id/comments", createComment);

export default router;
