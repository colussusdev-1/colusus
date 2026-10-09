import { Router } from "express";

import authenticate from "../../../middleware/auth.middleware.js";
import { allowRoles } from "../../../middleware/role.middleware.js";

import {
  createInvoice,
  issueInvoice,
  getInvoiceById,
  getInvoiceByNumber,
  getMyInvoices,
  recordPayment,
  cancelInvoice,
  markOverdue,
} from "./invoice.controller.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* AUTHENTICATION                                                             */
/* -------------------------------------------------------------------------- */

router.use(authenticate);

/* -------------------------------------------------------------------------- */
/* CLIENT INVOICES                                                            */
/* -------------------------------------------------------------------------- */
/*
 * Clients can only access invoices belonging to their authenticated account.
 *
 * The customerId is taken from req.user inside the controller.
 * It is never supplied by the frontend.
 */

router.get("/my", allowRoles("CLIENT"), getMyInvoices);

/* -------------------------------------------------------------------------- */
/* INTERNAL FINANCE ACCESS                                                    */
/* -------------------------------------------------------------------------- */
/*
 * Invoice management is an internal financial operation.
 *
 * Business modules create invoices through invoice.service.js.
 * Administrative invoice operations are restricted to administrators.
 */

router.use(allowRoles("ADMIN"));

/* -------------------------------------------------------------------------- */
/* CREATE INVOICE                                                             */
/* -------------------------------------------------------------------------- */

router.post("/", createInvoice);

/* -------------------------------------------------------------------------- */
/* GET INVOICE BY NUMBER                                                      */
/* -------------------------------------------------------------------------- */

router.get("/number/:invoiceNumber", getInvoiceByNumber);

/* -------------------------------------------------------------------------- */
/* GET INVOICE BY ID                                                          */
/* -------------------------------------------------------------------------- */

router.get("/:invoiceId", getInvoiceById);

/* -------------------------------------------------------------------------- */
/* ISSUE INVOICE                                                              */
/* -------------------------------------------------------------------------- */

router.patch("/:invoiceId/issue", issueInvoice);

/* -------------------------------------------------------------------------- */
/* RECORD PAYMENT                                                             */
/* -------------------------------------------------------------------------- */

router.patch("/:invoiceId/payment", recordPayment);

/* -------------------------------------------------------------------------- */
/* CANCEL INVOICE                                                             */
/* -------------------------------------------------------------------------- */

router.patch("/:invoiceId/cancel", cancelInvoice);

/* -------------------------------------------------------------------------- */
/* MARK INVOICE OVERDUE                                                       */
/* -------------------------------------------------------------------------- */

router.patch("/:invoiceId/overdue", markOverdue);

export default router;
