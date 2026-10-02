import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import { requirePermission } from "../staff/access/access.middleware.js";

import { PERMISSIONS } from "../staff/permissions/permission.constants.js";

import {
  getAllOpportunities,
  getDestinations,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  setOpportunityActive,
  setOpportunityFeatured,
  deactivateOpportunity,
} from "./admin.opportunity.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| OPPORTUNITY MANAGEMENT
|--------------------------------------------------------------------------
|
| Access is controlled through granular staff permissions.
|
| opportunities.view
| opportunities.create
| opportunities.update
| opportunities.delete
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/opportunities
|
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_VIEW),
  getAllOpportunities,
);

/*
|--------------------------------------------------------------------------
| GET DESTINATIONS
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/opportunities/destinations
|
| IMPORTANT:
| This route must come before "/:id".
|
|--------------------------------------------------------------------------
*/

router.get(
  "/destinations",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_VIEW),
  getDestinations,
);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
|
| POST /api/v1/admin/opportunities
|
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_CREATE),
  createOpportunity,
);

/*
|--------------------------------------------------------------------------
| GET SINGLE
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/opportunities/:id
|
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_VIEW),
  getOpportunityById,
);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/opportunities/:id
|
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_UPDATE),
  updateOpportunity,
);

/*
|--------------------------------------------------------------------------
| ACTIVATE / DEACTIVATE
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/opportunities/:id/active
|
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/active",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_UPDATE),
  setOpportunityActive,
);

/*
|--------------------------------------------------------------------------
| FEATURED
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/opportunities/:id/featured
|
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/featured",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_UPDATE),
  setOpportunityFeatured,
);

/*
|--------------------------------------------------------------------------
| DEACTIVATE
|--------------------------------------------------------------------------
|
| DELETE /api/v1/admin/opportunities/:id
|
| Performs a soft delete by setting active=false.
|
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_DELETE),
  deactivateOpportunity,
);

export default router;
