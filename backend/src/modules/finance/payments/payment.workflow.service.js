import mongoose from "mongoose";

import Payment from "./payment.model.js";
import paymentService from "./payment.service.js";
import paymentWorkflowRegistry from "../payment.workflow.registry.js";

import invoiceService from "../invoices/invoice.service.js";
import receiptService from "../reciepts/reciept.service.js";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Create a standardized service error.
 */
const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Resolve a business workflow.
 *
 * Finance may receive an explicit handler from the caller.
 *
 * Otherwise, Finance resolves the registered workflow using invoiceType.
 *
 * Finance does not directly import business modules.
 */
const resolveBusinessWorkflow = ({ invoiceType, businessWorkflow = null }) => {
  if (businessWorkflow) {
    if (typeof businessWorkflow !== "function") {
      throw createError("Business workflow handler must be a function.", 500);
    }

    return businessWorkflow;
  }

  const handler = paymentWorkflowRegistry.getPaymentWorkflow(invoiceType);

  /*
   * Assessment payments must never silently complete without
   * updating their associated assessment record.
   */

  if (String(invoiceType).trim().toUpperCase() === "ASSESSMENT" && !handler) {
    throw createError(
      "Assessment payment workflow has not been registered. Payment completion cannot continue.",
      500,
    );
  }

  return handler;
};

/**
 * Validate that the payment belongs to the invoice.
 */
const validatePaymentInvoice = ({ payment, invoice }) => {
  if (!invoice) {
    throw createError("Invoice linked to payment was not found.", 404);
  }

  if (
    String(payment.paymentType).toUpperCase() !==
    String(invoice.invoiceType).toUpperCase()
  ) {
    throw createError("Payment type does not match invoice type.");
  }

  if (
    String(payment.currency).toUpperCase() !==
    String(invoice.currency).toUpperCase()
  ) {
    throw createError("Payment currency does not match invoice currency.");
  }

  if (String(invoice.customerId || "") !== String(payment.customerId || "")) {
    throw createError("Payment customer does not match invoice customer.", 403);
  }

  return true;
};

/* -------------------------------------------------------------------------- */
/* COMPLETE PAYMENT                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Verify a payment and complete the financial workflow.
 *
 * Financial workflow:
 *
 * Paystack
 *   ↓
 * Payment
 *   ↓
 * Invoice
 *   ↓
 * Receipt
 *   ↓
 * Business workflow
 *
 * The optional user argument is passed to paymentService.verifyPayment
 * for ownership validation.
 */
const completePayment = async ({
  reference,
  user = null,
  businessWorkflow = null,
}) => {
  if (!reference) {
    throw createError("Payment reference is required.");
  }

  const verification = await paymentService.verifyPayment(reference, user);

  if (!verification.verified) {
    throw createError("Payment verification failed.");
  }

  return completeSuccessfulPayment({
    paymentId: verification.payment._id,
    businessWorkflow,
  });
};

/* -------------------------------------------------------------------------- */
/* BUSINESS WORKFLOW                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Run an optional business-side completion handler.
 *
 * This runs only after the invoice reaches PAID.
 *
 * The handler receives:
 * - payment
 * - invoice
 * - receipt
 * - session
 *
 * The session allows the business module to update its records
 * within the same MongoDB transaction as the financial records.
 *
 * Business handlers must be idempotent.
 */
const completeBusinessWorkflow = async ({
  payment,
  invoice,
  receipt,
  session,
  businessWorkflow,
}) => {
  if (!businessWorkflow) {
    /*
     * Assessment workflows are mandatory.
     * Other invoice types may legitimately have no registered handler.
     */

    if (String(invoice.invoiceType).trim().toUpperCase() === "ASSESSMENT") {
      throw createError("Assessment payment workflow is unavailable.", 500);
    }

    return null;
  }

  if (typeof businessWorkflow !== "function") {
    throw createError("Business workflow handler must be a function.", 500);
  }

  return businessWorkflow({
    payment,
    invoice,
    receipt,
    session,
  });
};

/* -------------------------------------------------------------------------- */
/* COMPLETE SUCCESSFUL PAYMENT                                                */
/* -------------------------------------------------------------------------- */

/**
 * Complete all financial records associated with a successful payment.
 *
 * This operation supports repeated verification and webhook delivery.
 *
 * PARTIAL PAYMENT:
 *
 * Payment → Invoice → Receipt
 *
 * FULL PAYMENT:
 *
 * Payment → Invoice → Receipt → Business workflow
 *
 * ASSESSMENT:
 *
 * Payment → Invoice → Receipt → Assessment submission
 */
const completeSuccessfulPayment = async ({
  paymentId,
  businessWorkflow = null,
}) => {
  if (!paymentId) {
    throw createError("Payment ID is required.");
  }

  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw createError("Invalid payment ID.");
  }

  /* ------------------------------------------------------------------------ */
  /* LOAD PAYMENT                                                             */
  /* ------------------------------------------------------------------------ */

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    throw createError("Payment not found.", 404);
  }

  /* ------------------------------------------------------------------------ */
  /* PAYMENT STATUS                                                           */
  /* ------------------------------------------------------------------------ */

  if (payment.status !== "SUCCESS") {
    throw createError(
      "Only successful payments can complete the financial workflow.",
    );
  }

  /* ------------------------------------------------------------------------ */
  /* INVOICE REQUIREMENT                                                      */
  /* ------------------------------------------------------------------------ */

  if (!payment.invoice) {
    throw createError("Payment is not linked to an invoice.");
  }

  /* ------------------------------------------------------------------------ */
  /* LOAD + VALIDATE INVOICE                                                  */
  /* ------------------------------------------------------------------------ */

  const invoice = await invoiceService.getInvoiceById(payment.invoice);

  if (!invoice) {
    throw createError("Invoice linked to payment was not found.", 404);
  }

  validatePaymentInvoice({
    payment,
    invoice,
  });

  /* ------------------------------------------------------------------------ */
  /* RESOLVE BUSINESS WORKFLOW                                                */
  /* ------------------------------------------------------------------------ */

  const resolvedBusinessWorkflow = resolveBusinessWorkflow({
    invoiceType: invoice.invoiceType,
    businessWorkflow,
  });

  /* ------------------------------------------------------------------------ */
  /* TRANSACTION                                                              */
  /* ------------------------------------------------------------------------ */

  const session = await mongoose.startSession();

  try {
    let completedInvoice = null;
    let receipt = null;
    let businessRecord = null;

    let alreadyCompleted = false;

    await session.withTransaction(async () => {
      /* -------------------------------------------------------------------- */
      /* RELOAD PAYMENT                                                       */
      /* -------------------------------------------------------------------- */

      const currentPayment = await Payment.findById(payment._id).session(
        session,
      );

      if (!currentPayment) {
        throw createError("Payment not found during transaction.", 404);
      }

      if (currentPayment.status !== "SUCCESS") {
        throw createError("Payment is no longer marked as successful.");
      }

      /* -------------------------------------------------------------------- */
      /* RELOAD INVOICE                                                       */
      /* -------------------------------------------------------------------- */

      const currentInvoice = await invoiceService.getInvoiceById(
        currentPayment.invoice,
        session,
      );

      if (!currentInvoice) {
        throw createError("Invoice linked to payment was not found.", 404);
      }

      validatePaymentInvoice({
        payment: currentPayment,
        invoice: currentInvoice,
      });

      /* -------------------------------------------------------------------- */
      /* CHECK EXISTING RECEIPT                                               */
      /* -------------------------------------------------------------------- */

      const existingReceipt = await receiptService.findReceiptByPayment(
        currentPayment._id,
        session,
      );

      if (existingReceipt) {
        /*
         * Financial completion already happened.
         *
         * Do not record the payment again.
         * Do not create another receipt.
         *
         * If the invoice is fully paid, rerun the business workflow.
         * This recovers a previously incomplete business-side update.
         */

        completedInvoice = currentInvoice;

        receipt = existingReceipt;

        alreadyCompleted = true;

        if (currentInvoice.status === "PAID") {
          businessRecord = await completeBusinessWorkflow({
            payment: currentPayment,
            invoice: currentInvoice,
            receipt: existingReceipt,
            session,
            businessWorkflow: resolvedBusinessWorkflow,
          });
        }

        return;
      }

      /* -------------------------------------------------------------------- */
      /* RECORD PAYMENT AGAINST INVOICE                                       */
      /* -------------------------------------------------------------------- */

      completedInvoice = await invoiceService.recordPayment({
        invoiceId: currentPayment.invoice,
        amount: currentPayment.amount,
        paymentReference: currentPayment.reference,
        session,
      });

      /* -------------------------------------------------------------------- */
      /* CREATE RECEIPT                                                       */
      /* -------------------------------------------------------------------- */

      receipt = await receiptService.createReceipt({
        paymentId: currentPayment._id,
        invoiceId: currentPayment.invoice,
        session,
      });

      /* -------------------------------------------------------------------- */
      /* BUSINESS COMPLETION                                                  */
      /* -------------------------------------------------------------------- */

      if (completedInvoice.status === "PAID") {
        businessRecord = await completeBusinessWorkflow({
          payment: currentPayment,
          invoice: completedInvoice,
          receipt,
          session,
          businessWorkflow: resolvedBusinessWorkflow,
        });
      }
    });

    /* ---------------------------------------------------------------------- */
    /* RESULT                                                                 */
    /* ---------------------------------------------------------------------- */

    return {
      alreadyCompleted,

      payment,

      invoice: completedInvoice,

      receipt,

      businessRecord,
    };
  } finally {
    await session.endSession();
  }
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default {
  completePayment,
  completeSuccessfulPayment,
};
