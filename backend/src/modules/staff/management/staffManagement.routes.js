import express from "express";

import authenticate from "../../../middleware/auth.middleware.js";
import { allowRoles } from "../../../middleware/role.middleware.js";

import {
  getStaffList,
  getStaffById,
  getStaffAccess,
  createStaff,
  updateStaff,
  updateStaffAccess,
  updateStaffStatus,
} from "./staffManagement.controller.js";

const router = express.Router();

/*
============================================================
COLOSSUS — ADMIN STAFF MANAGEMENT
============================================================

These routes are for managing Staff accounts.

This is intentionally separate from:

    /api/v1/admin/staff

which is currently used by the application assignment
workflow.

Staff management is ADMIN-only.

============================================================
*/

router.use(authenticate, allowRoles("ADMIN"));

/*
============================================================
STAFF DIRECTORY
============================================================
*/

/*
GET /api/v1/admin/staff/manage

Query:

    ?page=1
    ?limit=20
    ?search=john
    ?department=...
    ?staffRole=...
    ?status=ACTIVE
*/

router.get("/", getStaffList);

/*
============================================================
CREATE STAFF
============================================================
*/

/*
POST /api/v1/admin/staff/manage

Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "temporaryPassword123",
  "staffRole": "ROLE_ID",
  "department": "DEPARTMENT_ID",
  "position": "Case Officer"
}
*/

router.post("/", createStaff);

/*
============================================================
STAFF EFFECTIVE ACCESS
============================================================
*/

/*
GET /api/v1/admin/staff/manage/:id/access

Returns the staff member's effective permissions.

Effective permissions are calculated from:

    Staff Role permissions
    +
    Individual permission grants
    -
    Individual permission denials
*/

router.get("/:id/access", getStaffAccess);

/*
============================================================
STAFF DETAILS
============================================================
*/

/*
GET /api/v1/admin/staff/manage/:id
*/

router.get("/:id", getStaffById);

/*
============================================================
UPDATE STAFF
============================================================
*/

/*
PATCH /api/v1/admin/staff/manage/:id

Possible fields:

{
  "name": "John Doe",
  "email": "john@example.com",
  "position": "Senior Case Officer",
  "staffRole": "ROLE_ID",
  "department": "DEPARTMENT_ID"
}

Password can also be changed:

{
  "password": "newPassword123"
}
*/

router.patch("/:id", updateStaff);

/*
============================================================
STAFF ACCESS
============================================================
*/

/*
PATCH /api/v1/admin/staff/manage/:id/access

Body:

{
  "permissionGrants": [
    "applications.view",
    "applications.notes.create"
  ],

  "permissionDenials": [
    "applications.delete"
  ]
}
*/

router.patch("/:id/access", updateStaffAccess);

/*
============================================================
STAFF STATUS
============================================================
*/

/*
PATCH /api/v1/admin/staff/manage/:id/status

Body:

{
  "isActive": false
}
*/

router.patch("/:id/status", updateStaffStatus);

export default router;
