import express from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
  reviewBooking,
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
} from "./booking.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Booking Routes
|--------------------------------------------------------------------------
*/

// Review booking before payment
router.post("/review", reviewBooking);

// Create booking
router.post("/", createBooking);

/*
|--------------------------------------------------------------------------
| Admin Booking Management
|--------------------------------------------------------------------------
*/

// Get all bookings
router.get("/", authenticate, allowRoles("ADMIN", "STAFF"), getAllBookings);

// Get single booking
router.get("/:id", authenticate, allowRoles("ADMIN", "STAFF"), getBookingById);

// Update booking status
router.patch(
  "/:id/status",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  updateBookingStatus,
);

// Update payment status
router.patch(
  "/:id/payment",
  authenticate,
  allowRoles("ADMIN", "STAFF"),
  updatePaymentStatus,
);

export default router;
