import express from "express";

import authenticate from "../../../middleware/auth.middleware.js";

import { getMyAccess } from "./access.controller.js";

const router = express.Router();

router.get("/", authenticate, getMyAccess);

export default router;
