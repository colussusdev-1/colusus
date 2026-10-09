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
 * Resolve a business workflow.
 *
 * Finance may receive an explicit handler from the caller.
 *
 * If no explicit handler is provided, Finance looks for a registered
 * business workflow using the invoice type.
 *
 * Finance itself does not import Application, Booking, Opportunity, Service,
 * or any other business module.
 */
const resolveBusinessWorkflow = ({ invoiceType, businessWorkflow = null }) => {
  if (businessWorkflow) {
    return businessWorkflow;
  }

  return paymentWorkflowRegistry.getPaymentWorkflow(invoiceType);
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
 *
 * Business workflows are intentionally resolved outside Finance's business
 * domain knowledge.
 */
const completePayment = async ({ reference, businessWorkflow = null }) => {
  if (!reference) {
    const error = new Error("Payment reference is required.");

    error.statusCode = 400;

    throw error;
  }

  const verification = await paymentService.verifyPayment(reference);

  if (!verification.verified) {
    const error = new Error("Payment verification failed.");

    error.statusCode = 400;

    throw error;
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
 * This is called only after the invoice reaches PAID.
 */
const completeBusinessWorkflow = async ({
  payment,
  invoice,
  receipt,
  session,
  businessWorkflow,
}) => {
  if (!businessWorkflow) {
    return null;
  }

  if (typeof businessWorkflow !== "function") {
    const error = new Error("Business workflow handler must be a function.");

    error.statusCode = 500;

    throw error;
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
 * This operation is intentionally idempotent.
 *
 * Partial payment:
 *
 * Payment → Invoice → Receipt
 *
 * Full payment:
 *
 * Payment → Invoice → Receipt → Business workflow
 */
const completeSuccessfulPayment = async ({
  paymentId,
  businessWorkflow = null,
}) => {
  if (!paymentId) {
    const error = new Error("Payment ID is required.");

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* LOAD PAYMENT                                                             */
  /* ------------------------------------------------------------------------ */

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    const error = new Error("Payment not found.");

    error.statusCode = 404;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* PAYMENT STATUS                                                           */
  /* ------------------------------------------------------------------------ */

  if (payment.status !== "SUCCESS") {
    const error = new Error(
      "Only successful payments can complete the financial workflow.",
    );

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* INVOICE REQUIREMENT                                                      */
  /* ------------------------------------------------------------------------ */

  if (!payment.invoice) {
    const error = new Error("Payment is not linked to an invoice.");

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* LOAD + VALIDATE INVOICE                                                  */
  /* ------------------------------------------------------------------------ */

  const invoice = await invoiceService.getInvoiceById(payment.invoice);

  if (!invoice) {
    const error = new Error("Invoice linked to payment was not found.");

    error.statusCode = 404;

    throw error;
  }

  if (payment.paymentType !== invoice.invoiceType) {
    const error = new Error("Payment type does not match invoice type.");

    error.statusCode = 400;

    throw error;
  }

  if (payment.currency !== invoice.currency) {
    const error = new Error(
      "Payment currency does not match invoice currency.",
    );

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* RESOLVE BUSINESS WORKFLOW                                                */
  /* ------------------------------------------------------------------------ */

  const resolvedBusinessWorkflow = resolveBusinessWorkflow({
    invoiceType: invoice.invoiceType,

    businessWorkflow,
  });

  /* ------------------------------------------------------------------------ */
  /* FAST IDEMPOTENCY CHECK                                                   */
  /* ------------------------------------------------------------------------ */

  const existingReceipt = await receiptService.findReceiptByPayment(
    payment._id,
  );

  if (existingReceipt) {
    const currentInvoice = await invoiceService.getInvoiceById(payment.invoice);

    let businessRecord = null;

    /**
     * Only a fully paid invoice may trigger the business workflow.
     */
    if (currentInvoice.status === "PAID") {
      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          businessRecord = await completeBusinessWorkflow({
            payment,

            invoice: currentInvoice,

            receipt: existingReceipt,

            session,

            businessWorkflow: resolvedBusinessWorkflow,
          });
        });
      } finally {
        await session.endSession();
      }
    }

    return {
      alreadyCompleted: true,

      payment,

      invoice: currentInvoice,

      receipt: existingReceipt,

      businessRecord,
    };
  }

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
      /* RE-CHECK RECEIPT INSIDE TRANSACTION                                  */
      /* -------------------------------------------------------------------- */

      const existingReceiptInsideTransaction =
        await receiptService.findReceiptByPayment(payment._id, session);

      if (existingReceiptInsideTransaction) {
        completedInvoice = await invoiceService.getInvoiceById(
          payment.invoice,

          session,
        );

        receipt = existingReceiptInsideTransaction;

        alreadyCompleted = true;

        if (completedInvoice.status === "PAID") {
          businessRecord = await completeBusinessWorkflow({
            payment,

            invoice: completedInvoice,

            receipt,

            session,

            businessWorkflow: resolvedBusinessWorkflow,
          });
        }

        return;
      }

      /* -------------------------------------------------------------------- */
      /* RECORD PAYMENT AGAINST INVOICE                                        */
      /* -------------------------------------------------------------------- */

      completedInvoice = await invoiceService.recordPayment({
        invoiceId: payment.invoice,

        amount: payment.amount,

        paymentReference: payment.reference,

        session,
      });

      /* -------------------------------------------------------------------- */
      /* CREATE RECEIPT                                                        */
      /* -------------------------------------------------------------------- */

      receipt = await receiptService.createReceipt({
        paymentId: payment._id,

        invoiceId: payment.invoice,

        session,
      });

      /* -------------------------------------------------------------------- */
      /* BUSINESS COMPLETION                                                   */
      /* -------------------------------------------------------------------- */

      /**
       * PARTIALLY_PAID:
       *
       *   Payment → Invoice → Receipt
       *   Business workflow = NOT RUN
       *
       * PAID:
       *
       *   Payment → Invoice → Receipt → Business workflow
       */
      if (completedInvoice.status === "PAID") {
        businessRecord = await completeBusinessWorkflow({
          payment,

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
