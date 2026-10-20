import express from "express";

import authenticate from "../../middleware/auth.middleware.js";

import { requirePermission } from "../staff/access/access.middleware.js";

import { PERMISSIONS } from "../staff/permissions/permission.constants.js";

import contactController from "./contact.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC CONTACT SUBMISSION
|--------------------------------------------------------------------------
|
| POST /api/v1/contact
|
*/

router.post("/", contactController.createContact);

/*
|--------------------------------------------------------------------------
| ADMIN CONTACT SUMMARY
|--------------------------------------------------------------------------
|
| GET /api/v1/contact/admin/summary
|
*/

router.get(
  "/admin/summary",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_VIEW),
  contactController.getContactSummary,
);

/*
|--------------------------------------------------------------------------
| ADMIN CONTACT LIST
|--------------------------------------------------------------------------
|
| GET /api/v1/contact/admin
|
*/

router.get(
  "/admin",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_VIEW),
  contactController.getContacts,
);

/*
|--------------------------------------------------------------------------
| ADMIN CONTACT DETAILS
|--------------------------------------------------------------------------
|
| GET /api/v1/contact/admin/:id
|
*/

router.get(
  "/admin/:id",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_VIEW),
  contactController.getContactById,
);

/*
|--------------------------------------------------------------------------
| ADMIN UPDATE CONTACT
|--------------------------------------------------------------------------
|
| PATCH /api/v1/contact/admin/:id
|
*/

router.patch(
  "/admin/:id",
  authenticate,
  requirePermission(PERMISSIONS.FORMS_UPDATE),
  contactController.updateContact,
);

export default router;
