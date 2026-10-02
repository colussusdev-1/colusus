import express from "express";

import authenticate from "../../../middleware/auth.middleware.js";
import { allowRoles } from "../../../middleware/role.middleware.js";

import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "./department.controller.js";

const router = express.Router();

router.use(authenticate, allowRoles("ADMIN"));

router.get("/", getDepartments);

router.post("/", createDepartment);

router.get("/:id", getDepartmentById);

router.patch("/:id", updateDepartment);

router.delete("/:id", deleteDepartment);

export default router;
