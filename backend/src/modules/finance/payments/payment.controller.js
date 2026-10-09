import verifyPaystackSignature from "../../../utils/verifyPaystackSignatures.js";

import paymentService from "./payment.service.js";
import paymentWorkflowService from "./payment.workflow.service.js";

/* -------------------------------------------------------------------------- */
/* INITIALIZE PAYMENT                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Initialize a payment.
 *
 * The request identifies the invoice.
 *
 * Finance resolves the authoritative financial values from the invoice:
 *
 * - amount
 * - currency
 * - customer
 * - payment type
 * - invoice context
 *
 * The business module creates the invoice.
 * Finance creates the payment session.
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

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* VERIFY PAYMENT                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Verify a payment manually.
 *
 * Verification establishes financial truth with Paystack.
 *
 * The workflow service then completes:
 *
 * Payment
 * ↓
 * Invoice
 * ↓
 * Receipt
 * ↓
 * Business workflow when invoice becomes PAID
 *
 * The business workflow is only triggered when the invoice is fully paid.
 * Partial payments still receive receipts but do not complete the
 * downstream business workflow.
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const result = await paymentService.verifyPayment(reference, req.user);

    if (!result.verified) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
        data: result,
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

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* PAYSTACK WEBHOOK                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Handle Paystack webhook events.
 *
 * IMPORTANT:
 *
 * app.js must mount this route before express.json() and provide
 * express.raw({ type: "application/json" }) for this endpoint.
 *
 * The webhook does not use application authentication because Paystack
 * calls this endpoint directly.
 *
 * Paystack authenticity is established through the HMAC signature.
 */
export const paystackWebhook = async (req, res, next) => {
  try {
    /* ---------------------------------------------------------------------- */
    /* SIGNATURE                                                              */
    /* ---------------------------------------------------------------------- */

    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      return res.status(401).json({
        success: false,
        message: "Missing Paystack signature.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* RAW BODY                                                               */
    /* ---------------------------------------------------------------------- */

    const rawBody = req.body;

    if (!Buffer.isBuffer(rawBody)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook request body.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* VERIFY SIGNATURE                                                       */
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
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Invalid Paystack webhook payload.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* PROCESS PAYMENT                                                        */
    /* ---------------------------------------------------------------------- */

    const webhookResult = await paymentService.handleWebhook(payload);

    /**
     * Valid Paystack events that do not belong to a local payment record
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
    /* SUCCESSFUL PAYMENT                                                     */
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
        data: workflow,
      });
    }

    /* ---------------------------------------------------------------------- */
    /* NON-SUCCESSFUL PAYMENT                                                 */
    /* ---------------------------------------------------------------------- */

    return res.status(200).json({
      success: true,
      message: "Webhook received.",
      data: webhookResult,
    });
  } catch (error) {
    console.error("PAYSTACK WEBHOOK ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET PAYMENT                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Get a payment by its internal reference.
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

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET MY PAYMENTS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Get payment history for the authenticated client.
 *
 * The client ID is resolved from req.user inside the service.
 * The frontend never supplies customerId.
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

    next(error);
  }
};
