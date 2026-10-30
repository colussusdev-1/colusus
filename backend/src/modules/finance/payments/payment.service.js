import paystack from "../../../config/paystack.js";

import Invoice from "../invoices/invoice.model.js";
import Payment from "./payment.model.js";

import generatePaymentReference from "../../../utils/generatePaymentReference.js";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const validateInitializationPayload = ({ paymentType, invoiceId }) => {
  if (!paymentType) {
    throw createError("Payment type is required.");
  }

  if (!invoiceId) {
    throw createError("Invoice ID is required.");
  }

  return true;
};

const isAdmin = (user) => user?.role === "ADMIN";

const getUserId = (user) =>
  user?.id?.toString?.() || user?._id?.toString?.() || null;

const assertClientOwnership = ({ user, customerId, resource = "payment" }) => {
  if (isAdmin(user)) {
    return true;
  }

  if (user?.role !== "CLIENT") {
    throw createError("You are not authorized to access this resource.", 403);
  }

  const userId = getUserId(user);

  if (!userId || !customerId || userId !== customerId.toString()) {
    throw createError(
      `You are not authorized to access this ${resource}.`,
      403,
    );
  }

  return true;
};

const toGatewayAmount = (amount) => {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw createError("Payment amount must be greater than zero.");
  }

  return Math.round(numericAmount * 100);
};

const validateGatewayAmount = (payment, gatewayAmount) => {
  const expectedAmount = toGatewayAmount(payment.amount);

  if (Number(gatewayAmount) !== expectedAmount) {
    throw createError(
      "Payment amount does not match the expected transaction amount.",
    );
  }
};

const validateGatewayCurrency = (payment, gatewayCurrency) => {
  const expectedCurrency = String(payment.currency || "").toUpperCase();
  const actualCurrency = String(gatewayCurrency || "").toUpperCase();

  if (!actualCurrency || actualCurrency !== expectedCurrency) {
    throw createError(
      "Payment currency does not match the gateway transaction.",
    );
  }
};

const validateInvoiceForPayment = (invoice) => {
  if (!invoice) {
    throw createError("Invoice not found.", 404);
  }

  if (invoice.status === "DRAFT") {
    throw createError(
      "Invoice must be issued before payment can be initialized.",
    );
  }

  if (["CANCELLED", "VOID"].includes(invoice.status)) {
    throw createError(
      "Payment cannot be initialized for a cancelled or void invoice.",
    );
  }

  if (invoice.status === "PAID" || Number(invoice.balanceDue) <= 0) {
    throw createError("Invoice has already been fully paid.");
  }

  if (!["ISSUED", "PARTIALLY_PAID", "OVERDUE"].includes(invoice.status)) {
    throw createError(
      `Invoice cannot receive payment from ${invoice.status} status.`,
    );
  }

  if (
    !Number.isFinite(Number(invoice.balanceDue)) ||
    Number(invoice.balanceDue) <= 0
  ) {
    throw createError("Invoice has no outstanding balance.");
  }

  return true;
};

const findActivePaymentForInvoice = async (invoiceId) => {
  return Payment.findOne({
    invoice: invoiceId,
    status: {
      $in: ["PENDING", "PROCESSING"],
    },
  }).sort({
    createdAt: -1,
  });
};

/* -------------------------------------------------------------------------- */
/* CONSULTATION DETECTION                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Consultation bookings use invoiceType BOOKING.
 *
 * Therefore, invoiceType alone cannot identify a consultation payment.
 * We inspect persisted invoice context and metadata instead.
 */
const isConsultationInvoice = (invoice) => {
  if (!invoice) {
    return false;
  }

  const context = invoice.context || {};
  const metadata = invoice.metadata || {};

  const consultationFlow =
    String(metadata.flow || "").toUpperCase() === "CONSULTATION" ||
    String(context.flow || "").toUpperCase() === "CONSULTATION";

  const linkedConsultationBooking = Boolean(
    context.bookingId && context.consultationType,
  );

  const explicitConsultation =
    /consultation/i.test(String(context.purpose || "")) ||
    /consultation/i.test(String(context.paymentFor || "")) ||
    /consultation/i.test(String(metadata.purpose || "")) ||
    /consultation/i.test(String(metadata.paymentFor || ""));

  return consultationFlow || linkedConsultationBooking || explicitConsultation;
};

/* -------------------------------------------------------------------------- */
/* FRONTEND CALLBACK                                                          */
/* -------------------------------------------------------------------------- */

const getFrontendUrl = () => {
  const frontendUrl = (
    process.env.CLIENT_URL || "https://www.colossusmigration.com"
  ).replace(/\/+$/, "");

  if (!/^https?:\/\//i.test(frontendUrl)) {
    throw createError("CLIENT_URL must be a valid HTTP or HTTPS URL.", 500);
  }

  return frontendUrl;
};

const getPaymentCallbackUrl = ({ frontendUrl, isConsultation }) => {
  if (isConsultation) {
    return `${frontendUrl}/consultation/payment-success`;
  }

  return `${frontendUrl}/payment/callback`;
};

/* -------------------------------------------------------------------------- */
/* INITIALIZE PAYMENT                                                         */
/* -------------------------------------------------------------------------- */

const initializePayment = async ({
  paymentType,
  invoiceId,
  context = {},
  metadata = {},
  user = null,
}) => {
  validateInitializationPayload({
    paymentType,
    invoiceId,
  });

  const invoice = await Invoice.findById(invoiceId);

  validateInvoiceForPayment(invoice);

  if (
    String(paymentType).trim().toUpperCase() !==
    String(invoice.invoiceType).trim().toUpperCase()
  ) {
    throw createError("Payment type does not match invoice type.");
  }

  /*
   * Determine whether this invoice belongs to the consultation flow
   * using backend-persisted invoice data.
   */
  const publicConsultation = isConsultationInvoice(invoice);

  /*
   * Ordinary invoices require ownership verification.
   *
   * Consultation invoices can initialize checkout publicly because
   * the visitor may not have a client account yet.
   */
  if (!publicConsultation) {
    assertClientOwnership({
      user,
      customerId: invoice.customerId,
      resource: "invoice",
    });
  }

  /*
   * The invoice remains authoritative.
   *
   * Caller-supplied context and metadata can provide additional
   * information, but persisted invoice values take precedence.
   */

  const paymentContext = {
    ...(context || {}),
    ...(invoice.context || {}),
    invoiceId: invoice._id.toString(),
  };

  const paymentMetadata = {
    ...(metadata || {}),
    ...(invoice.metadata || {}),
    invoiceId: invoice._id.toString(),
    paymentType: invoice.invoiceType,
  };

  /*
   * Replace an earlier active checkout session.
   */
  const existingPayment = await findActivePaymentForInvoice(invoice._id);

  if (existingPayment) {
    existingPayment.status = "FAILED";
    existingPayment.failedAt = new Date();

    existingPayment.gatewayResponse = {
      ...(existingPayment.gatewayResponse || {}),
      recoveryReason:
        "Previous Paystack checkout session was replaced with a fresh transaction.",
    };

    await existingPayment.save();
  }

  /*
   * The invoice is authoritative for amount and currency.
   */
  const amount = Number(invoice.balanceDue);
  const currency = String(invoice.currency || "NGN").toUpperCase();

  const customer = {
    id: invoice.customerId || null,
    name: invoice.customerName,
    email: invoice.customerEmail,
    phone: invoice.customerPhone || null,
  };

  if (!customer.email) {
    throw createError("A customer email is required to initialize payment.");
  }

  const reference = generatePaymentReference();

  const payment = await Payment.create({
    reference,
    paymentType: invoice.invoiceType,
    context: paymentContext,
    invoice: invoice._id,
    amount,
    currency,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    provider: "PAYSTACK",
    status: "PENDING",
    metadata: paymentMetadata,
  });

  try {
    const frontendUrl = getFrontendUrl();

    /*
     * Route consultation payments to the consultation success page.
     * Route all other payments to the standard finance callback.
     */
    const callbackUrl = getPaymentCallbackUrl({
      frontendUrl,
      isConsultation: publicConsultation,
    });

    console.log("");
    console.log("==============================================");
    console.log("PAYSTACK PAYMENT INITIALIZATION");
    console.log("==============================================");
    console.log("Payment ID:", payment._id.toString());
    console.log("Payment Reference:", reference);
    console.log("Invoice ID:", invoice._id.toString());
    console.log("Payment Type:", payment.paymentType);
    console.log("Amount:", amount);
    console.log("Currency:", currency);
    console.log("Consultation Payment:", publicConsultation);
    console.log("Client URL:", frontendUrl);
    console.log("PAYSTACK CALLBACK URL:", callbackUrl);
    console.log("==============================================");
    console.log("");

    const response = await paystack.post("/transaction/initialize", {
      email: customer.email,
      amount: toGatewayAmount(amount),
      currency,
      reference,
      callback_url: callbackUrl,

      metadata: {
        ...paymentMetadata,

        /*
         * Protected transaction identifiers must come last.
         */
        paymentId: payment._id.toString(),
        paymentReference: reference,
        paymentType: payment.paymentType,
        invoiceId: invoice._id.toString(),
        context: paymentContext,
      },
    });

    const gatewayData = response.data?.data;

    if (!gatewayData?.authorization_url) {
      throw createError(
        "Paystack did not return a checkout authorization URL.",
        502,
      );
    }

    payment.authorizationUrl = gatewayData.authorization_url;
    payment.accessCode = gatewayData.access_code || null;
    payment.gatewayResponse = response.data;
    payment.status = "PROCESSING";

    await payment.save();

    return {
      paymentId: payment._id,
      reference: payment.reference,
      paymentType: payment.paymentType,
      invoiceId: payment.invoice,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      authorizationUrl: payment.authorizationUrl,
      accessCode: payment.accessCode,
      callbackUrl,
      existing: false,
    };
  } catch (error) {
    payment.status = "FAILED";
    payment.failedAt = new Date();

    payment.gatewayResponse = error.response?.data || {
      message: error.message,
    };

    await payment.save();

    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/* VERIFY AUTHENTICATED PAYMENT                                               */
/* -------------------------------------------------------------------------- */

const verifyPayment = async (reference, user = null) => {
  if (!reference) {
    throw createError("Payment reference is required.");
  }

  const payment = await Payment.findOne({
    reference,
  });

  if (!payment) {
    throw createError("Payment record not found.", 404);
  }

  assertClientOwnership({
    user,
    customerId: payment.customerId,
    resource: "payment",
  });

  if (payment.status === "SUCCESS") {
    return {
      verified: true,
      alreadyVerified: true,
      payment,
    };
  }

  const response = await paystack.get(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );

  const gatewayData = response.data?.data;

  if (!gatewayData) {
    throw createError("Invalid payment verification response.", 502);
  }

  payment.gatewayResponse = response.data;

  if (gatewayData.status !== "success") {
    if (
      ["failed", "abandoned"].includes(
        String(gatewayData.status || "").toLowerCase(),
      )
    ) {
      payment.status = "FAILED";
      payment.failedAt = new Date();

      await payment.save();
    }

    return {
      verified: false,
      alreadyVerified: false,
      payment,
    };
  }

  validateGatewayAmount(payment, gatewayData.amount);
  validateGatewayCurrency(payment, gatewayData.currency);

  payment.status = "SUCCESS";
  payment.transactionId = gatewayData.id || null;

  payment.paidAt = gatewayData.paid_at
    ? new Date(gatewayData.paid_at)
    : new Date();

  await payment.save();

  return {
    verified: true,
    alreadyVerified: false,
    payment,
  };
};

/* -------------------------------------------------------------------------- */
/* VERIFY PUBLIC CONSULTATION PAYMENT                                         */
/* -------------------------------------------------------------------------- */

/**
 * Public route:
 * GET /payments/verify-consultation/:reference
 *
 * The frontend can call this after Paystack redirects the customer.
 */
const verifyConsultationPayment = async (reference) => {
  if (!reference || typeof reference !== "string") {
    throw createError("Payment reference is required.");
  }

  const payment = await Payment.findOne({
    reference,
  });

  if (!payment) {
    throw createError("Payment record not found.", 404);
  }

  if (!payment.invoice) {
    throw createError("Payment is not linked to an invoice.");
  }

  const invoice = await Invoice.findById(payment.invoice);

  if (!invoice) {
    throw createError("Linked invoice was not found.", 404);
  }

  if (!isConsultationInvoice(invoice)) {
    throw createError(
      "This endpoint is only available for consultation payments.",
      403,
    );
  }

  if (
    String(payment.paymentType).toUpperCase() !==
    String(invoice.invoiceType).toUpperCase()
  ) {
    throw createError("Payment type does not match invoice type.");
  }

  if (
    String(payment.currency || "").toUpperCase() !==
    String(invoice.currency || "").toUpperCase()
  ) {
    throw createError("Payment currency does not match invoice currency.");
  }

  /*
   * Always verify the transaction with Paystack.
   */
  const response = await paystack.get(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );

  const gatewayData = response.data?.data;

  if (!gatewayData) {
    throw createError("Invalid payment verification response.", 502);
  }

  if (gatewayData.status !== "success") {
    if (
      ["failed", "abandoned"].includes(
        String(gatewayData.status || "").toLowerCase(),
      )
    ) {
      payment.status = "FAILED";
      payment.failedAt = new Date();
      payment.gatewayResponse = response.data;

      await payment.save();
    }

    return {
      verified: false,
      status: gatewayData.status || "PENDING",
      reference: payment.reference,
      amount: payment.amount,
      currency: payment.currency,
    };
  }

  validateGatewayAmount(payment, gatewayData.amount);
  validateGatewayCurrency(payment, gatewayData.currency);

  payment.status = "SUCCESS";
  payment.transactionId = gatewayData.id || null;

  payment.paidAt = gatewayData.paid_at
    ? new Date(gatewayData.paid_at)
    : new Date();

  payment.gatewayResponse = response.data;

  await payment.save();

  return {
    verified: true,
    status: "SUCCESS",
    reference: payment.reference,
    amount: payment.amount,
    currency: payment.currency,
    paidAt: payment.paidAt,
    paymentId: payment._id,
  };
};

/* -------------------------------------------------------------------------- */
/* WEBHOOK                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * The controller must verify the Paystack webhook signature before calling
 * this method.
 */
const handleWebhook = async (payload) => {
  if (!payload || !payload.event) {
    return {
      processed: false,
      reason: "Invalid webhook payload.",
    };
  }

  if (payload.event !== "charge.success") {
    return {
      processed: false,
      reason: "Event not handled.",
    };
  }

  const gatewayData = payload.data;

  if (!gatewayData?.reference) {
    return {
      processed: false,
      reason: "Payment reference missing.",
    };
  }

  const payment = await Payment.findOne({
    reference: gatewayData.reference,
  });

  if (!payment) {
    return {
      processed: false,
      reason: "Payment record not found.",
    };
  }

  if (payment.status === "SUCCESS") {
    return {
      processed: true,
      alreadyProcessed: true,
      payment,
    };
  }

  if (gatewayData.status !== "success") {
    payment.status = "FAILED";
    payment.failedAt = new Date();
    payment.gatewayResponse = payload;

    await payment.save();

    return {
      processed: true,
      payment,
    };
  }

  validateGatewayAmount(payment, gatewayData.amount);
  validateGatewayCurrency(payment, gatewayData.currency);

  payment.status = "SUCCESS";
  payment.transactionId = gatewayData.id || null;

  payment.paidAt = gatewayData.paid_at
    ? new Date(gatewayData.paid_at)
    : new Date();

  payment.gatewayResponse = payload;

  await payment.save();

  return {
    processed: true,
    payment,
  };
};

/* -------------------------------------------------------------------------- */
/* GET PAYMENT                                                                */
/* -------------------------------------------------------------------------- */

const getPaymentByReference = async (reference, user = null) => {
  const payment = await Payment.findOne({
    reference,
  });

  if (!payment) {
    throw createError("Payment record not found.", 404);
  }

  assertClientOwnership({
    user,
    customerId: payment.customerId,
    resource: "payment",
  });

  return payment;
};

/* -------------------------------------------------------------------------- */
/* GET CLIENT PAYMENTS                                                        */
/* -------------------------------------------------------------------------- */

const getClientPayments = async ({
  user,
  status = null,
  paymentType = null,
}) => {
  const customerId = getUserId(user);

  if (!customerId) {
    throw createError("Authenticated user is required.", 401);
  }

  if (isAdmin(user)) {
    const query = {};

    if (status) {
      query.status = status;
    }

    if (paymentType) {
      query.paymentType = paymentType;
    }

    return Payment.find(query)
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  if (user?.role !== "CLIENT") {
    throw createError("You are not authorized to access payment records.", 403);
  }

  const query = {
    customerId,
  };

  if (status) {
    query.status = status;
  }

  if (paymentType) {
    query.paymentType = paymentType;
  }

  return Payment.find(query)
    .sort({
      createdAt: -1,
    })
    .lean();
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default {
  initializePayment,
  verifyPayment,
  verifyConsultationPayment,
  handleWebhook,
  getPaymentByReference,
  getClientPayments,
};
