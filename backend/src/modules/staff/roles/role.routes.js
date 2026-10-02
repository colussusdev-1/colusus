import express from "express";

import authenticate from "../../../middleware/auth.middleware.js";
import { allowRoles } from "../../../middleware/role.middleware.js";

import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "./role.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| ADMIN STAFF ROLES
|--------------------------------------------------------------------------
|
| These endpoints manage the reusable Staff roles that
| determine the base permission set for Staff accounts.
|
| All endpoints are ADMIN-only.
|
|--------------------------------------------------------------------------
*/

router.use(authenticate, allowRoles("ADMIN"));

/*
|--------------------------------------------------------------------------
| GET ROLES
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/staff/roles
|
| Optional:
|
| ?search=case
| ?status=ACTIVE
|
|--------------------------------------------------------------------------
*/

router.get("/", getRoles);

/*
|--------------------------------------------------------------------------
| CREATE ROLE
|--------------------------------------------------------------------------
|
| POST /api/v1/admin/staff/roles
|
| Body:
|
| {
|   "name": "Case Officer",
|   "key": "CASE_OFFICER",
|   "description": "Handles migration applications.",
|   "permissions": [
|     "dashboard.view",
|     "applications.view",
|     "applications.update",
|     "documents.view"
|   ]
| }
|
|--------------------------------------------------------------------------
*/

router.post("/", createRole);

/*
|--------------------------------------------------------------------------
| GET ROLE
|--------------------------------------------------------------------------
|
| GET /api/v1/admin/staff/roles/:id
|
|--------------------------------------------------------------------------
*/

router.get("/:id", getRoleById);

/*
|--------------------------------------------------------------------------
| UPDATE ROLE
|--------------------------------------------------------------------------
|
| PATCH /api/v1/admin/staff/roles/:id
|
|--------------------------------------------------------------------------
*/

router.patch("/:id", updateRole);

/*
|--------------------------------------------------------------------------
| DELETE ROLE
|--------------------------------------------------------------------------
|
| DELETE /api/v1/admin/staff/roles/:id
|
| System roles cannot be deleted.
|
|--------------------------------------------------------------------------
*/

router.delete("/:id", deleteRole);

export default router;
