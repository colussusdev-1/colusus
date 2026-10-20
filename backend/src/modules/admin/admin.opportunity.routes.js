import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import { requirePermission } from "../staff/access/access.middleware.js";

import { PERMISSIONS } from "../staff/permissions/permission.constants.js";

import {
  getAllOpportunities,
  getDestinations,
  getDestinationBySlug,
  updateDestination,
  getIntegrityReport,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  setOpportunityActive,
  setOpportunityFeatured,
  deactivateOpportunity,
} from "./admin.opportunity.controller.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* GET DESTINATIONS                                                           */
/* GET /api/v1/admin/opportunities/destinations                               */
/* -------------------------------------------------------------------------- */

router.get(
  "/destinations",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_VIEW),
  getDestinations,
);

/* -------------------------------------------------------------------------- */
/* GET DESTINATION DETAILS                                                    */
/* GET /api/v1/admin/opportunities/destinations/:countrySlug                 */
/* -------------------------------------------------------------------------- */

router.get(
  "/destinations/:countrySlug",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_VIEW),
  getDestinationBySlug,
);

/* -------------------------------------------------------------------------- */
/* UPDATE DESTINATION METADATA                                                */
/* PATCH /api/v1/admin/opportunities/destinations/:countrySlug               */
/* -------------------------------------------------------------------------- */

router.patch(
  "/destinations/:countrySlug",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_UPDATE),
  updateDestination,
);

/* -------------------------------------------------------------------------- */
/* OPPORTUNITY DATA INTEGRITY                                                 */
/* GET /api/v1/admin/opportunities/integrity                                  */
/* -------------------------------------------------------------------------- */

router.get(
  "/integrity",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_VIEW),
  getIntegrityReport,
);

/* -------------------------------------------------------------------------- */
/* GET ALL OPPORTUNITIES                                                      */
/* GET /api/v1/admin/opportunities                                            */
/* -------------------------------------------------------------------------- */

router.get(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_VIEW),
  getAllOpportunities,
);

/* -------------------------------------------------------------------------- */
/* CREATE OPPORTUNITY                                                         */
/* POST /api/v1/admin/opportunities                                           */
/* -------------------------------------------------------------------------- */

router.post(
  "/",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_CREATE),
  createOpportunity,
);

/* -------------------------------------------------------------------------- */
/* GET SINGLE OPPORTUNITY                                                     */
/* GET /api/v1/admin/opportunities/:id                                        */
/* -------------------------------------------------------------------------- */

router.get(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_VIEW),
  getOpportunityById,
);

/* -------------------------------------------------------------------------- */
/* UPDATE OPPORTUNITY                                                         */
/* PATCH /api/v1/admin/opportunities/:id                                      */
/* -------------------------------------------------------------------------- */

router.patch(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_UPDATE),
  updateOpportunity,
);

/* -------------------------------------------------------------------------- */
/* ACTIVATE / DEACTIVATE OPPORTUNITY                                          */
/* PATCH /api/v1/admin/opportunities/:id/active                               */
/* -------------------------------------------------------------------------- */

router.patch(
  "/:id/active",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_UPDATE),
  setOpportunityActive,
);

/* -------------------------------------------------------------------------- */
/* FEATURE / UNFEATURE OPPORTUNITY                                            */
/* PATCH /api/v1/admin/opportunities/:id/featured                             */
/* -------------------------------------------------------------------------- */

router.patch(
  "/:id/featured",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_UPDATE),
  setOpportunityFeatured,
);

/* -------------------------------------------------------------------------- */
/* DEACTIVATE OPPORTUNITY                                                     */
/* DELETE /api/v1/admin/opportunities/:id                                     */
/* -------------------------------------------------------------------------- */

router.delete(
  "/:id",
  authenticate,
  requirePermission(PERMISSIONS.OPPORTUNITIES_DELETE),
  deactivateOpportunity,
);

export default router;
