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
import uploadRoutes from "../modules/uploads/upload.routes.js";

import adminRoutes from "../modules/admin/admin.routes.js";
import staffRoutes from "../modules/staff/staff.routes.js";

import accessRoutes from "../modules/staff/access/access.routes.js";


const router = express.Router();


/*
|--------------------------------------------------------------------------
| HEALTH
|--------------------------------------------------------------------------
*/

router.use(
    "/health",
    healthRoutes,
);


/*
|--------------------------------------------------------------------------
| AUTHENTICATION
|--------------------------------------------------------------------------
*/

router.use(
    "/auth",
    authRoutes,
);


/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

router.use(
    "/users",
    userRoutes,
);


/*
|--------------------------------------------------------------------------
| CLIENT PORTAL
|--------------------------------------------------------------------------
*/

router.use(
    "/client",
    clientRoutes,
);


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

router.use(
    "/client-profile",
    clientProfileRoutes,
);


/*
|--------------------------------------------------------------------------
| APPLICATIONS
|--------------------------------------------------------------------------
*/

router.use(
    "/applications",
    applicationRoutes,
);


/*
|--------------------------------------------------------------------------
| DOCUMENTS
|--------------------------------------------------------------------------
*/

router.use(
    "/documents",
    documentRoutes,
);


/*
|--------------------------------------------------------------------------
| OPPORTUNITIES
|--------------------------------------------------------------------------
|
| Public migration opportunities.
|
|--------------------------------------------------------------------------
*/

router.use(
    "/opportunities",
    opportunityRoutes,
);


/*
|--------------------------------------------------------------------------
| PUBLIC FORM SUBMISSIONS
|--------------------------------------------------------------------------
|
| POST /api/v1/form-submissions
|
| Generic public form submission endpoint used by website forms such as:
|
| - Ireland Nursing & Healthcare
| - Webinar Registration
| - Contact
| - Consultation Request
| - Future forms
|
| The form-submission router handles authentication for its
| protected administration endpoints separately.
|
|--------------------------------------------------------------------------
*/

router.use(
    "/form-submissions",
    formSubmissionRoutes,
);


/*
|--------------------------------------------------------------------------
| PUBLIC FILE UPLOADS
|--------------------------------------------------------------------------
|
| POST /api/v1/uploads
|
| Generic file upload endpoint.
|
|--------------------------------------------------------------------------
*/

router.use(
    "/uploads",
    uploadRoutes,
);


/*
|--------------------------------------------------------------------------
| USER NOTIFICATIONS
|--------------------------------------------------------------------------
|
| Recipient-facing notification system.
|
| GET    /api/v1/notifications
| GET    /api/v1/notifications/unread-count
| PATCH  /api/v1/notifications/:id/read
| PATCH  /api/v1/notifications/read-all
| DELETE /api/v1/notifications
| DELETE /api/v1/notifications/:id
|
| Authentication is handled inside notification.routes.js.
|
|--------------------------------------------------------------------------
*/

router.use(
    "/notifications",
    notificationRoutes,
);


/*
|--------------------------------------------------------------------------
| BOOKINGS
|--------------------------------------------------------------------------
*/

router.use(
    "/bookings",
    bookingRoutes,
);


/*
|--------------------------------------------------------------------------
| COUPONS
|--------------------------------------------------------------------------
*/

router.use(
    "/coupons",
    couponRoutes,
);


/*
|--------------------------------------------------------------------------
| STAFF ACCESS
|--------------------------------------------------------------------------
|
| GET /api/v1/access
|
| Returns the effective permissions of the authenticated user.
|
| The access service calculates:
|
|     role permissions
|     + direct grants
|     - direct denials
|
| Authentication is handled inside access.routes.js.
|
| This endpoint is intentionally not under /admin because it describes
| the permissions of the currently authenticated user rather than being
| an Admin management endpoint.
|
|--------------------------------------------------------------------------
*/

router.use(
    "/access",
    accessRoutes,
);


/*
|--------------------------------------------------------------------------
| ADMIN PORTAL
|--------------------------------------------------------------------------
|
| Complete Admin route tree.
|
| Includes:
|
| /api/v1/admin/dashboard
| /api/v1/admin/staff
| /api/v1/admin/applications
| /api/v1/admin/documents
| /api/v1/admin/clients
| /api/v1/admin/notifications
|
| Admin authentication and authorization are handled by the
| individual Admin route trees.
|
|--------------------------------------------------------------------------
*/

router.use(
    "/admin",
    adminRoutes,
);


/*
|--------------------------------------------------------------------------
| STAFF PORTAL
|--------------------------------------------------------------------------
|
| Complete Staff route tree.
|
| Includes:
|
| /api/v1/staff/profile
| /api/v1/staff/dashboard
| /api/v1/staff/applications
| /api/v1/staff/applications/:id
| /api/v1/staff/applications/:id/status
| /api/v1/staff/applications/:id/notes
| /api/v1/staff/applications/:id/documents
| /api/v1/staff/documents/:id
| /api/v1/staff/documents/:id/review
|
| Staff authentication and STAFF role authorization are
| handled inside staff.routes.js.
|
| Staff access to applications/documents is additionally
| enforced by staff.service.js.
|
|--------------------------------------------------------------------------
*/

router.use(
    "/staff",
    staffRoutes,
);


/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default router;