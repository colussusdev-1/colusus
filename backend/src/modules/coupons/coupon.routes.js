import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  validateCoupon,
  updateCoupon,
  deactivateCoupon,
  deleteCoupon,
} from "./coupon.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Validate coupon

router.post("/validate", validateCoupon);

/*
|--------------------------------------------------------------------------
| Coupon Management
|--------------------------------------------------------------------------
*/

// Create coupon

router.post("/", authenticate, allowRoles("ADMIN", "STAFF"), createCoupon);

// Get all coupons

router.get("/", authenticate, allowRoles("ADMIN", "STAFF"), getAllCoupons);

// Get single coupon

router.get("/:id", authenticate, allowRoles("ADMIN", "STAFF"), getCouponById);

// Update coupon

router.patch("/:id", authenticate, allowRoles("ADMIN", "STAFF"), updateCoupon);

// Deactivate coupon

router.patch(
  "/:id/deactivate",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  deactivateCoupon,
);

// Delete coupon

router.delete("/:id", authenticate, allowRoles("ADMIN", "STAFF"), deleteCoupon);

export default router;
