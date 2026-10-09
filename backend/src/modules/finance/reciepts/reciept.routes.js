import { Router } from "express";

import authenticate from "../../../middleware/auth.middleware.js";
import { allowRoles } from "../../../middleware/role.middleware.js";

import {
  createReceipt,
  getReceiptById,
  getReceiptByNumber,
  getReceiptByPayment,
  getMyReceipts,
  voidReceipt,
} from "./reciept.controller.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* AUTHENTICATION                                                             */
/* -------------------------------------------------------------------------- */

router.use(authenticate);

/* -------------------------------------------------------------------------- */
/* CLIENT RECEIPTS                                                            */
/* -------------------------------------------------------------------------- */
/*
 * Clients can only access receipts belonging to their authenticated account.
 *
 * The customerId is resolved from req.user inside the controller.
 * The frontend never supplies customerId.
 */

router.get("/my", allowRoles("CLIENT"), getMyReceipts);

/* -------------------------------------------------------------------------- */
/* INTERNAL FINANCE ACCESS                                                    */
/* -------------------------------------------------------------------------- */
/*
 * Receipt management remains restricted to administrators.
 *
 * Internal payment completion workflows call receiptService directly.
 */

router.use(allowRoles("ADMIN"));

/* -------------------------------------------------------------------------- */
/* CREATE RECEIPT                                                             */
/* -------------------------------------------------------------------------- */

router.post("/", createReceipt);

/* -------------------------------------------------------------------------- */
/* GET RECEIPT BY NUMBER                                                      */
/* -------------------------------------------------------------------------- */

router.get("/number/:receiptNumber", getReceiptByNumber);

/* -------------------------------------------------------------------------- */
/* GET RECEIPT BY PAYMENT                                                     */
/* -------------------------------------------------------------------------- */

router.get("/payment/:paymentId", getReceiptByPayment);

/* -------------------------------------------------------------------------- */
/* GET RECEIPT BY ID                                                          */
/* -------------------------------------------------------------------------- */

router.get("/:receiptId", getReceiptById);

/* -------------------------------------------------------------------------- */
/* VOID RECEIPT                                                               */
/* -------------------------------------------------------------------------- */

router.patch("/:receiptId/void", voidReceipt);

export default router;
