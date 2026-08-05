import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import { getAllClients, getClientDetails } from "./admin.client.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Client Management Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  authenticate,

  allowRoles("ADMIN"),

  getAllClients,
);

router.get(
  "/:id",

  authenticate,

  allowRoles("ADMIN"),

  getClientDetails,
);

export default router;
