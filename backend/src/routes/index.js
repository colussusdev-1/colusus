import express from "express";

import healthRoutes from "./health.routes.js";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/user.routes.js";

import clientRoutes from "../modules/client/client.routes.js";
import clientProfileRoutes from "../modules/client-profile/clinet-profile.routes.js";

import applicationRoutes from "../modules/applications/application.routes.js";
import documentRoutes from "../modules/documents/document.routes.js";

import opportunityRoutes from "../modules/opportunities/opportunity.routes.js";

import notificationRoutes from "../modules/notifications/notification.routes.js";

import bookingRoutes from "../modules/bookings/booking.routes.js";
import couponRoutes from "../modules/coupons/coupon.routes.js";
import paymentRoutes from "../modules/payments/payment.routes.js";

import adminRoutes from "../modules/admin/admin.routes.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| HEALTH
|--------------------------------------------------------------------------
*/

router.use("/health", healthRoutes);

/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

router.use("/auth", authRoutes);

/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

router.use("/users", userRoutes);

/*
|--------------------------------------------------------------------------
| CLIENT PORTAL
|--------------------------------------------------------------------------
*/

router.use("/client", clientRoutes);

/*
|--------------------------------------------------------------------------
| CLIENT PROFILE
|--------------------------------------------------------------------------
|
| GET   /api/v1/client-profile
| POST  /api/v1/client-profile
| PATCH /api/v1/client-profile
| GET   /api/v1/client-profile/completion
|
|--------------------------------------------------------------------------
*/

router.use("/client-profile", clientProfileRoutes);

/*
|--------------------------------------------------------------------------
| APPLICATIONS
|--------------------------------------------------------------------------
*/

router.use("/applications", applicationRoutes);

/*
|--------------------------------------------------------------------------
| DOCUMENTS
|--------------------------------------------------------------------------
*/

router.use("/documents", documentRoutes);

/*
|--------------------------------------------------------------------------
| OPPORTUNITIES
|--------------------------------------------------------------------------
|
| Public migration opportunities.
|
|--------------------------------------------------------------------------
*/

router.use("/opportunities", opportunityRoutes);

/*
|--------------------------------------------------------------------------
| NOTIFICATIONS
|--------------------------------------------------------------------------
*/

router.use("/notifications", notificationRoutes);

/*
|--------------------------------------------------------------------------
| BOOKINGS
|--------------------------------------------------------------------------
*/

router.use("/bookings", bookingRoutes);

/*
|--------------------------------------------------------------------------
| COUPONS
|--------------------------------------------------------------------------
*/

router.use("/coupons", couponRoutes);

/*
|--------------------------------------------------------------------------
| PAYMENTS
|--------------------------------------------------------------------------
*/

router.use("/payments", paymentRoutes);

/*
|--------------------------------------------------------------------------
| ADMIN PORTAL
|--------------------------------------------------------------------------
*/

router.use("/admin", adminRoutes);

export default router;
