import express from "express";

import upload from "./upload.middleware.js";
import uploadController from "./upload.controller.js";

const router = express.Router();

router.post("/", upload.single("file"), uploadController.uploadFile);

export default router;
