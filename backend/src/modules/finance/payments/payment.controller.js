import verifyPaystackSignature from "../../../utils/verifyPaystackSignatures.js";

import paymentService from "./payment.service.js";
import paymentWorkflowService from "./payment.workflow.service.js";

/* -------------------------------------------------------------------------- */
/* INITIALIZE PAYMENT                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Initialize a payment against an existing invoice.
 *
 * Finance resolves the authoritative financial values from the invoice:
 * - Amount
 * - Currency
 * - Customer
 * - Payment type
 * - Invoice context
 */
export const initializePayment = async (req, res, next) => {
  try {
    const { paymentType, invoiceId, context, metadata } = req.body || {};

    const payment = await paymentService.initializePayment({
      paymentType,
      invoiceId,
      context,
      metadata,
      user: req.user,
    });

    return res.status(200).json({
      success: true,
      message: payment.existing
        ? "Existing payment session retrieved successfully."
        : "Payment initialized successfully.",
      data: payment,
    });
  } catch (error) {
    console.error("INITIALIZE PAYMENT ERROR");
    console.error(error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* VERIFY AUTHENTICATED PAYMENT                                               */
/* -------------------------------------------------------------------------- */

/**
 * Verify a payment for an authenticated customer or administrator.
 *
 * Workflow:
 * Paystack → Payment → Invoice → Receipt → Business workflow.
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const result = await paymentService.verifyPayment(reference, req.user);

    if (!result.verified) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
        data: {
          verified: false,
          status: result.payment?.status || "PENDING",
          reference: result.payment?.reference || reference,
        },
      });
    }

    const workflow = await paymentWorkflowService.completeSuccessfulPayment({
      paymentId: result.payment._id,
    });

    return res.status(200).json({
      success: true,
      message: workflow.alreadyCompleted
        ? "Payment has already been completed."
        : "Payment verified and completed successfully.",
      data: workflow,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR");
    console.error(error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* VERIFY CONSULTATION PAYMENT — PUBLIC                                      */
/* -------------------------------------------------------------------------- */

/**
 * Verify a consultation payment after the customer returns from Paystack.
 *
 * Authentication is not required for this endpoint.
 *
 * Security:
 * - The payment service must verify that the linked invoice is a
 *   consultation invoice.
 * - The transaction is checked against Paystack.
 * - Only a limited confirmation response is returned.
 * - The full payment, invoice, and customer records are not exposed.
 *
 * The existing financial workflow completes the payment records.
 */
export const verifyConsultationPayment = async (req, res, next) => {
  try {
    const reference = String(req.params.reference || "").trim();

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required.",
      });
    }

    /*
     * The dedicated service method validates that this is genuinely
     * a consultation payment and verifies it with Paystack.
     */
    const result = await paymentService.verifyConsultationPayment(reference);

    /*
     * A pending or unsuccessful transaction must not complete the
     * invoice or generate a receipt.
     */
    if (!result.verified) {
      return res.status(200).json({
        success: true,
        message: "Payment has not yet been confirmed.",
        data: {
          verified: false,
          status: result.status || "PENDING",
          reference: result.reference || reference,
          amount: result.amount,
          currency: result.currency,
        },
      });
    }

    /*
     * Complete invoice, receipt, and any registered business workflow.
     *
     * This method is idempotent, so a customer can revisit the page
     * without intentionally creating a duplicate receipt.
     */
    const workflow = await paymentWorkflowService.completeSuccessfulPayment({
      paymentId: result.paymentId,
    });

    return res.status(200).json({
      success: true,
      message: workflow.alreadyCompleted
        ? "Consultation payment has already been completed."
        : "Consultation payment verified successfully.",
      data: {
        verified: true,
        status: "SUCCESS",
        reference: result.reference,
        amount: result.amount,
        currency: result.currency,
        paidAt: result.paidAt,
        alreadyCompleted: workflow.alreadyCompleted,
      },
    });
  } catch (error) {
    console.error("PUBLIC CONSULTATION PAYMENT VERIFICATION ERROR");
    console.error(error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* PAYSTACK WEBHOOK                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Handle Paystack webhook events.
 *
 * This endpoint must be mounted with express.raw() before express.json()
 * processes the request body.
 *
 * Authentication is not required because Paystack calls this endpoint.
 * Authenticity is established through the Paystack HMAC signature.
 */
export const paystackWebhook = async (req, res, next) => {
  try {
    /* ---------------------------------------------------------------------- */
    /* VERIFY SIGNATURE                                                       */
    /* ---------------------------------------------------------------------- */

    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      return res.status(401).json({
        success: false,
        message: "Missing Paystack signature.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* VALIDATE RAW BODY                                                      */
    /* ---------------------------------------------------------------------- */

    const rawBody = req.body;

    if (!Buffer.isBuffer(rawBody)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook request body.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* AUTHENTICATE PAYSTACK                                                  */
    /* ---------------------------------------------------------------------- */

    const isValid = verifyPaystackSignature(signature, rawBody);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Paystack signature.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* PARSE PAYLOAD                                                          */
    /* ---------------------------------------------------------------------- */

    let payload;

    try {
      payload = JSON.parse(rawBody.toString("utf8"));
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid Paystack webhook payload.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* PROCESS WEBHOOK                                                        */
    /* ---------------------------------------------------------------------- */

    const webhookResult = await paymentService.handleWebhook(payload);

    /*
     * A valid event without a corresponding local payment record
     * should still be acknowledged.
     */
    if (!webhookResult.payment) {
      return res.status(200).json({
        success: true,
        message: "Webhook received.",
        data: webhookResult,
      });
    }

    const payment = webhookResult.payment;

    /* ---------------------------------------------------------------------- */
    /* COMPLETE SUCCESSFUL PAYMENT                                            */
    /* ---------------------------------------------------------------------- */

    if (payment.status === "SUCCESS") {
      const workflow = await paymentWorkflowService.completeSuccessfulPayment({
        paymentId: payment._id,
      });

      return res.status(200).json({
        success: true,
        message:
          webhookResult.alreadyProcessed || workflow.alreadyCompleted
            ? "Payment webhook already processed."
            : "Payment webhook processed successfully.",
        data: {
          processed: true,
          alreadyCompleted: workflow.alreadyCompleted,
          paymentId: payment._id,
          reference: payment.reference,
          status: payment.status,
        },
      });
    }

    /* ---------------------------------------------------------------------- */
    /* NON-SUCCESSFUL PAYMENT                                                 */
    /* ---------------------------------------------------------------------- */

    return res.status(200).json({
      success: true,
      message: "Webhook received.",
      data: {
        processed: Boolean(webhookResult.processed),
        reference: payment.reference,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("PAYSTACK WEBHOOK ERROR");
    console.error(error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET PAYMENT                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Retrieve a payment by reference.
 *
 * This endpoint remains protected by payment.routes.js.
 */
export const getPaymentByReference = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const payment = await paymentService.getPaymentByReference(
      reference,
      req.user,
    );

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("GET PAYMENT ERROR");
    console.error(error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET MY PAYMENTS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Retrieve payment history for the authenticated client or administrator.
 */
export const getMyPayments = async (req, res, next) => {
  try {
    const { status, paymentType } = req.query;

    const payments = await paymentService.getClientPayments({
      user: req.user,
      status: status || null,
      paymentType: paymentType || null,
    });

    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("GET MY PAYMENTS ERROR");
    console.error(error);

    return next(error);
  }
};
