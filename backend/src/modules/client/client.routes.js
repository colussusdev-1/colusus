import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
  getClientProfile,
  getClientApplications,
  getClientDocuments,
  getClientProgress,
} from "./client.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Client Portal Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/profile",

  authenticate,

  allowRoles("CLIENT"),

  getClientProfile,
);

router.get(
  "/applications",

  authenticate,

  allowRoles("CLIENT"),

  getClientApplications,
);

router.get(
  "/documents",

  authenticate,

  allowRoles("CLIENT"),

  getClientDocuments,
);

router.get(
  "/progress",

  authenticate,

  allowRoles("CLIENT"),

  getClientProgress,
);

export default router;
