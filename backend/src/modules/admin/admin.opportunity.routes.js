import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

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
| ADMIN OPPORTUNITY MANAGEMENT
|--------------------------------------------------------------------------
|
| All opportunity management is ADMIN only.
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

router.get("/", authenticate, allowRoles("ADMIN"), getAllOpportunities);

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
| Otherwise Express can interpret "destinations" as an opportunity ID.
|
|--------------------------------------------------------------------------
*/

router.get("/destinations", authenticate, allowRoles("ADMIN"), getDestinations);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
|
| POST /api/v1/admin/opportunities
|
|--------------------------------------------------------------------------
*/

router.post("/", authenticate, allowRoles("ADMIN"), createOpportunity);

/*
|--------------------------------------------------------------------------
| GET SINGLE
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/opportunities/:id
|
|--------------------------------------------------------------------------
*/

router.get("/:id", authenticate, allowRoles("ADMIN"), getOpportunityById);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/opportunities/:id
|
|--------------------------------------------------------------------------
*/

router.patch("/:id", authenticate, allowRoles("ADMIN"), updateOpportunity);

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
  allowRoles("ADMIN"),
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
  allowRoles("ADMIN"),
  setOpportunityFeatured,
);

/*
|--------------------------------------------------------------------------
| DEACTIVATE
|--------------------------------------------------------------------------
|
| DELETE /api/v1/admin/opportunities/:id
|
| This performs a soft delete by setting active=false.
|
|--------------------------------------------------------------------------
*/

router.delete("/:id", authenticate, allowRoles("ADMIN"), deactivateOpportunity);

export default router;
