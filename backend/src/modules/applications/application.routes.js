import express from "express";

import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
} from "./application.controller.js";

import authenticate from "../../middleware/auth.middleware.js";

const router = express.Router();

/*
============================================================
CREATE APPLICATION
============================================================
|
| POST /api/v1/applications
|
| Creates a new application draft.
|
============================================================
*/

router.post("/", authenticate, createApplication);

/*
============================================================
GET USER APPLICATIONS
============================================================
|
| GET /api/v1/applications
|
| Returns all applications belonging to
| the authenticated client.
|
============================================================
*/

router.get("/", authenticate, getApplications);

/*
============================================================
UPDATE APPLICATION
============================================================
|
| PATCH /api/v1/applications/:id
|
| Used by the client portal to persist:
|
| - currentStep
| - currentStepIndex
| - answers
| - personalInformation
| - notes
|
| This is what allows the application journey
| to move instead of remaining static.
|
============================================================
*/

router.patch("/:id", authenticate, updateApplication);

/*
============================================================
GET SINGLE APPLICATION
============================================================
|
| GET /api/v1/applications/:id
|
| Returns one application belonging to
| the authenticated client.
|
============================================================
*/

router.get("/:id", authenticate, getApplication);

export default router;
