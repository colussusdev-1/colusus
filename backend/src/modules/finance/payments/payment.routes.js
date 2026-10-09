import { Router } from "express";

import authenticate from "../../../middleware/auth.middleware.js";
import { allowRoles } from "../../../middleware/role.middleware.js";

import {
  initializePayment,
  verifyPayment,
  paystackWebhook,
  getPaymentByReference,
  getMyPayments,
} from "./payment.controller.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* PAYMENT INITIALIZATION                                                     */
/* -------------------------------------------------------------------------- */
/*
 * Customers need to initialize their own invoice payments.
 *
 * ADMIN is also allowed for administrative/payment recovery workflows.
 */

router.post(
  "/initialize",
  authenticate,
  allowRoles("CLIENT", "ADMIN"),
  initializePayment,
);

/* -------------------------------------------------------------------------- */
/* PAYMENT VERIFICATION                                                       */
/* -------------------------------------------------------------------------- */
/*
 * Verification is available to authenticated customers and administrators.
 */

router.get(
  "/verify/:reference",
  authenticate,
  allowRoles("CLIENT", "ADMIN"),
  verifyPayment,
);

/* -------------------------------------------------------------------------- */
/* PAYSTACK WEBHOOK                                                           */
/* -------------------------------------------------------------------------- */
/*
 * DO NOT add authenticate here.
 *
 * Paystack calls this endpoint directly.
 *
 * Authenticity is established through the Paystack HMAC signature
 * inside payment.controller.js.
 *
 * app.js also ensures this route receives the raw request body.
 */

router.post("/webhook", paystackWebhook);

/* -------------------------------------------------------------------------- */
/* GET MY PAYMENTS                                                            */
/* -------------------------------------------------------------------------- */
/*
 * CLIENT:
 * Returns only payments belonging to the authenticated client.
 *
 * ADMIN:
 * Can also access this endpoint through the service authorization logic.
 *
 * The frontend does not provide customerId.
 */

router.get("/my", authenticate, allowRoles("CLIENT", "ADMIN"), getMyPayments);

/* -------------------------------------------------------------------------- */
/* GET PAYMENT                                                                */
/* -------------------------------------------------------------------------- */
/*
 * Payment records are financial records and should not be publicly readable.
 */

router.get(
  "/:reference",
  authenticate,
  allowRoles("CLIENT", "ADMIN"),
  getPaymentByReference,
);

export default router;
