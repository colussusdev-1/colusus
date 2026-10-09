import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import { allowRoles } from "../../middleware/role.middleware.js";

import {
  getFinanceOverview,
  getFinanceInvoices,
  getFinancePayments,
  getFinanceReceipts,
  getFinancePaymentDetails,
  getFinanceInvoiceDetails,
} from "./finance.admin.controller.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/* ADMIN ACCESS                                                               */
/* -------------------------------------------------------------------------- */

router.use(authenticate, allowRoles("ADMIN"));

/* -------------------------------------------------------------------------- */
/* OVERVIEW                                                                   */
/* -------------------------------------------------------------------------- */

router.get("/overview", getFinanceOverview);

/* -------------------------------------------------------------------------- */
/* INVOICES                                                                   */
/* -------------------------------------------------------------------------- */

router.get("/invoices", getFinanceInvoices);
router.get("/invoices/:invoiceId", getFinanceInvoiceDetails);

/* -------------------------------------------------------------------------- */
/* PAYMENTS                                                                   */
/* -------------------------------------------------------------------------- */

router.get("/payments", getFinancePayments);
router.get("/payments/:reference", getFinancePaymentDetails);

/* -------------------------------------------------------------------------- */
/* RECEIPTS                                                                   */
/* -------------------------------------------------------------------------- */

router.get("/receipts", getFinanceReceipts);

export default router;
