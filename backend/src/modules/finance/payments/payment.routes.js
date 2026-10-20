import { Router } from "express";

import authenticate from "../../../middleware/auth.middleware.js";
import { allowRoles } from "../../../middleware/role.middleware.js";

import {
  initializePayment,
  verifyPayment,
  verifyConsultationPayment,
  paystackWebhook,
  getPaymentByReference,
  getMyPayments,
} from "./payment.controller.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* PAYMENT INITIALIZATION                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Initialize payments for authenticated clients and administrators.
 *
 * Consultation payments that must be initiated by unauthenticated visitors
 * will need a separate, restricted public initialization endpoint.
 */
router.post(
  "/initialize",
  authenticate,
  allowRoles("CLIENT", "ADMIN"),
  initializePayment,
);

/* -------------------------------------------------------------------------- */
/* AUTHENTICATED PAYMENT VERIFICATION                                         */
/* -------------------------------------------------------------------------- */

/**
 * Verify ordinary payments.
 *
 * Authentication and role restrictions remain in place.
 */
router.get(
  "/verify/:reference",
  authenticate,
  allowRoles("CLIENT", "ADMIN"),
  verifyPayment,
);

/* -------------------------------------------------------------------------- */
/* PUBLIC CONSULTATION PAYMENT VERIFICATION                                   */
/* -------------------------------------------------------------------------- */

/**
 * Verify consultation payments after returning from Paystack.
 *
 * This endpoint does not require authentication.
 * The controller and service must validate the consultation invoice,
 * verify the transaction with Paystack, and return limited confirmation data.
 *
 * Do not expose general payment records through this endpoint.
 */
router.get("/verify-consultation/:reference", verifyConsultationPayment);

/* -------------------------------------------------------------------------- */
/* PAYSTACK WEBHOOK                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Paystack calls this endpoint directly.
 *
 * Do not add application authentication.
 * The controller validates the Paystack HMAC signature.
 *
 * Ensure app.js mounts the webhook with express.raw() before express.json().
 */
router.post("/webhook", paystackWebhook);

/* -------------------------------------------------------------------------- */
/* GET MY PAYMENTS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Retrieve payment history for the authenticated client or administrator.
 */
router.get("/my", authenticate, allowRoles("CLIENT", "ADMIN"), getMyPayments);

/* -------------------------------------------------------------------------- */
/* GET PAYMENT BY REFERENCE                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Retrieve an individual payment.
 *
 * This route remains protected.
 */
router.get(
  "/:reference",
  authenticate,
  allowRoles("CLIENT", "ADMIN"),
  getPaymentByReference,
);

export default router;
