import express from "express";

import {
  getOpportunities,
  getOpportunity,
  getOpportunityById,
  getCountries,
} from "./opportunity.controller.js";

const router = express.Router();

router.get("/countries", getCountries);

router.get("/", getOpportunities);

router.get("/:id", getOpportunityById);

router.get("/:country/:slug", getOpportunity);

export default router;
