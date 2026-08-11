import express from "express";

import healthRoutes from "./health.routes.js";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";

import applicationRoutes from "../modules/applications/application.routes.js";
import documentRoutes from "../modules/documents/document.routes.js";

import clientProfileRoutes from "../modules/client-profile/clinet-profile.routes.js";
import clientRoutes from "../modules/client/client.routes.js";

import notificationRoutes from "../modules/notifications/notification.routes.js";

import bookingRoutes from "../modules/bookings/booking.routes.js";
import couponRoutes from "../modules/coupons/coupon.routes.js";

import adminRoutes from "../modules/admin/admin.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";

/*
|--------------------------------------------------------------------------
| Opportunities
|--------------------------------------------------------------------------
*/

import opportunityRoutes from "../modules/opportunities/opportunity.routes.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Health
|--------------------------------------------------------------------------
*/

router.use("/health", healthRoutes);

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use("/auth", authRoutes);

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

router.use("/users", userRoutes);

/*
|--------------------------------------------------------------------------
| Client Portal
|--------------------------------------------------------------------------
*/

router.use("/client", clientRoutes);

router.use("/client-profile", clientProfileRoutes);

/*
|--------------------------------------------------------------------------
| Applications
|--------------------------------------------------------------------------
*/

router.use("/applications", applicationRoutes);

/*
|--------------------------------------------------------------------------
| Documents
|--------------------------------------------------------------------------
*/

router.use("/documents", documentRoutes);

/*
|--------------------------------------------------------------------------
| Opportunities
|--------------------------------------------------------------------------
|
| Public migration opportunities.
|
*/

router.use("/opportunities", opportunityRoutes);

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

router.use("/notifications", notificationRoutes);

/*
|--------------------------------------------------------------------------
| Consultation Booking
|--------------------------------------------------------------------------
*/

router.use("/bookings", bookingRoutes);

router.use("/coupons", couponRoutes);

router.use("/payments", paymentRoutes);

/*
|--------------------------------------------------------------------------
| Admin Portal
|--------------------------------------------------------------------------
*/

router.use("/admin", adminRoutes);

export default router;
