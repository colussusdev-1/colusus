import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import { requirePermission } from "../staff/access/access.middleware.js";

import { PERMISSIONS } from "../staff/permissions/permission.constants.js";

import { getAllClients, getClientDetails } from "./admin.client.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Client Management Routes
|--------------------------------------------------------------------------
|
| Client access is controlled through granular permissions.
|
| clients.view
|   - View all clients
|   - View individual client details
|
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.CLIENTS_VIEW),
  getAllClients,
);

router.get(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.CLIENTS_VIEW),
  getClientDetails,
);

export default router;
