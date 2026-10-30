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

import formSubmissionRoutes from "../modules/form-submissions/form-submission.routes.js";
import serviceEnquiryRoutes from "../modules/service-enquiries/service-enquiry.routes.js";

import uploadRoutes from "../modules/uploads/upload.routes.js";

import adminRoutes from "../modules/admin/admin.routes.js";
import staffRoutes from "../modules/staff/staff.routes.js";

import accessRoutes from "../modules/staff/access/access.routes.js";
import contactRoutes from "../modules/contact/contact.routes.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/* HEALTH                                                                     */
/* -------------------------------------------------------------------------- */

router.use("/health", healthRoutes);

/* -------------------------------------------------------------------------- */
/* AUTHENTICATION                                                             */
/* -------------------------------------------------------------------------- */

router.use("/auth", authRoutes);

/* -------------------------------------------------------------------------- */
/* USERS                                                                      */
/* -------------------------------------------------------------------------- */

router.use("/users", userRoutes);

/* -------------------------------------------------------------------------- */
/* CLIENT PORTAL                                                              */
/* -------------------------------------------------------------------------- */

router.use("/client", clientRoutes);

/* -------------------------------------------------------------------------- */
/* CLIENT PROFILE                                                             */
/* -------------------------------------------------------------------------- */

router.use("/client-profile", clientProfileRoutes);

/* -------------------------------------------------------------------------- */
/* APPLICATIONS                                                               */
/* -------------------------------------------------------------------------- */

router.use("/applications", applicationRoutes);

/* -------------------------------------------------------------------------- */
/* DOCUMENTS                                                                  */
/* -------------------------------------------------------------------------- */

router.use("/documents", documentRoutes);

/* -------------------------------------------------------------------------- */
/* OPPORTUNITIES                                                              */
/* -------------------------------------------------------------------------- */

router.use("/opportunities", opportunityRoutes);

/* -------------------------------------------------------------------------- */
/* EXISTING PUBLIC FORM SUBMISSIONS                                           */
/* -------------------------------------------------------------------------- */

/*
 * POST /api/v1/form-submissions
 *
 * Existing generic website forms:
 * - Ireland Nursing & Healthcare
 * - Webinar Registration
 * - Contact
 * - Consultation Request
 */

router.use("/form-submissions", formSubmissionRoutes);

/* -------------------------------------------------------------------------- */
/* SERVICE ENQUIRIES                                                         */
/* -------------------------------------------------------------------------- */

/*
 * POST  /api/v1/service-enquiries
 * GET   /api/v1/service-enquiries
 * GET   /api/v1/service-enquiries/:id
 * GET   /api/v1/service-enquiries/:id/documents/:documentId/view
 * PATCH /api/v1/service-enquiries/:id
 *
 * Dedicated service enquiry management:
 * - International Recruitment
 * - Study Abroad
 * - Skilled Migration
 * - Trainee & Apprenticeship
 *
 * Public submission and protected admin endpoints are
 * handled inside service-enquiry.routes.js.
 */

router.use("/service-enquiries", serviceEnquiryRoutes);

/* -------------------------------------------------------------------------- */
/* PUBLIC FILE UPLOADS                                                        */
/* -------------------------------------------------------------------------- */

router.use("/uploads", uploadRoutes);

/* -------------------------------------------------------------------------- */
/* USER NOTIFICATIONS                                                         */
/* -------------------------------------------------------------------------- */

router.use("/notifications", notificationRoutes);

/* -------------------------------------------------------------------------- */
/* BOOKINGS                                                                   */
/* -------------------------------------------------------------------------- */

router.use("/bookings", bookingRoutes);

/* -------------------------------------------------------------------------- */
/* COUPONS                                                                    */
/* -------------------------------------------------------------------------- */

router.use("/coupons", couponRoutes);

/* -------------------------------------------------------------------------- */
/* STAFF ACCESS                                                               */
/* -------------------------------------------------------------------------- */

router.use("/access", accessRoutes);

/* -------------------------------------------------------------------------- */
/* ADMIN PORTAL                                                               */
/* -------------------------------------------------------------------------- */

router.use("/admin", adminRoutes);

/* -------------------------------------------------------------------------- */
/* STAFF PORTAL                                                               */
/* -------------------------------------------------------------------------- */

router.use("/staff", staffRoutes);

/* -------------------------------------------------------------------------- */
/* CONTACT                                                                    */
/* -------------------------------------------------------------------------- */

router.use("/contact", contactRoutes);

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default router;
