import paystack from "../../../config/paystack.js";

import Invoice from "../invoices/invoice.model.js";
import Payment from "./payment.model.js";

import generatePaymentReference from "../../../utils/generatePaymentReference.js";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const validateInitializationPayload = ({ paymentType, invoiceId }) => {
  if (!paymentType) {
    const error = new Error("Payment type is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!invoiceId) {
    const error = new Error("Invoice ID is required.");
    error.statusCode = 400;
    throw error;
  }

  return true;
};

const isAdmin = (user) => {
  return user?.role === "ADMIN";
};

const getUserId = (user) => {
  return user?.id?.toString?.() || user?._id?.toString?.() || null;
};

const assertClientOwnership = ({ user, customerId, resource = "payment" }) => {
  if (isAdmin(user)) {
    return true;
  }

  if (user?.role !== "CLIENT") {
    const error = new Error("You are not authorized to access this resource.");

    error.statusCode = 403;

    throw error;
  }

  const userId = getUserId(user);

  if (!userId || !customerId) {
    const error = new Error(
      `You are not authorized to access this ${resource}.`,
    );

    error.statusCode = 403;

    throw error;
  }

  if (userId !== customerId.toString()) {
    const error = new Error(
      `You are not authorized to access this ${resource}.`,
    );

    error.statusCode = 403;

    throw error;
  }

  return true;
};

const toGatewayAmount = (amount) => {
  return Math.round(Number(amount) * 100);
};

const validateGatewayAmount = (payment, gatewayAmount) => {
  const expectedAmount = toGatewayAmount(payment.amount);

  if (Number(gatewayAmount) !== expectedAmount) {
    const error = new Error(
      "Payment amount does not match the expected transaction amount.",
    );

    error.statusCode = 400;

    throw error;
  }
};

const validateInvoiceForPayment = (invoice) => {
  if (!invoice) {
    const error = new Error("Invoice not found.");

    error.statusCode = 404;

    throw error;
  }

  if (invoice.status === "DRAFT") {
    const error = new Error(
      "Invoice must be issued before payment can be initialized.",
    );

    error.statusCode = 400;

    throw error;
  }

  if (invoice.status === "CANCELLED" || invoice.status === "VOID") {
    const error = new Error(
      "Payment cannot be initialized for a cancelled or void invoice.",
    );

    error.statusCode = 400;

    throw error;
  }

  if (invoice.status === "PAID" || Number(invoice.balanceDue) <= 0) {
    const error = new Error("Invoice has already been fully paid.");

    error.statusCode = 400;

    throw error;
  }

  if (!["ISSUED", "PARTIALLY_PAID", "OVERDUE"].includes(invoice.status)) {
    const error = new Error(
      `Invoice cannot receive payment from ${invoice.status} status.`,
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    !Number.isFinite(Number(invoice.balanceDue)) ||
    Number(invoice.balanceDue) <= 0
  ) {
    const error = new Error("Invoice has no outstanding balance.");

    error.statusCode = 400;

    throw error;
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

  assertClientOwnership({
    user,
    customerId: invoice.customerId,
    resource: "invoice",
  });

  if (paymentType !== invoice.invoiceType) {
    const error = new Error("Payment type does not match invoice type.");

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------
     STALE PAYMENT RECOVERY

     Never blindly reuse an old Paystack checkout session.

     If a previous local payment is still PENDING/PROCESSING,
     invalidate it and create a fresh transaction.
  ------------------------------------------------------------------------ */

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

  const amount = Number(invoice.balanceDue);

  const currency = invoice.currency.toUpperCase();

  const customer = {
    id: invoice.customerId || null,

    name: invoice.customerName,

    email: invoice.customerEmail,

    phone: invoice.customerPhone || null,
  };

  const paymentContext = {
    ...(invoice.context || {}),

    ...(context || {}),

    invoiceId: invoice._id.toString(),
  };

  /* ------------------------------------------------------------------------
     GENERATE NEW PAYMENT REFERENCE
  ------------------------------------------------------------------------ */

  const reference = generatePaymentReference();

  const payment = await Payment.create({
    reference,

    paymentType,

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

    metadata: {
      ...(invoice.metadata || {}),

      ...(metadata || {}),

      invoiceId: invoice._id.toString(),

      paymentType,
    },
  });

  try {
    /* ----------------------------------------------------------------------
       PAYSTACK INITIALIZATION
    ---------------------------------------------------------------------- */

    const frontendUrl = (
      process.env.CLIENT_URL || "https://www.colossusmigration.com"
    ).replace(/\/$/, "");

    /*
     * Paystack returns to a dedicated callback route.
     *
     * The callback route then forwards the customer
     * into the protected Client Finance page.
     */

    const callbackUrl = `${frontendUrl}/payment/callback`;

    /* ----------------------------------------------------------------------
       DEBUG INFORMATION
    ---------------------------------------------------------------------- */

    console.log("");
    console.log("==============================================");
    console.log("PAYSTACK PAYMENT INITIALIZATION");
    console.log("==============================================");
    console.log("Payment ID:", payment._id.toString());
    console.log("Payment Reference:", reference);
    console.log("Invoice ID:", invoice._id.toString());
    console.log("Amount:", amount);
    console.log("Currency:", currency);
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
        paymentId: payment._id.toString(),

        paymentReference: reference,

        paymentType,

        invoiceId: invoice._id.toString(),

        context: paymentContext,

        ...metadata,
      },
    });

    const gatewayData = response.data?.data;

    if (!gatewayData) {
      throw new Error("Invalid payment gateway response.");
    }

    /*
     * Store Paystack checkout information.
     */

    payment.authorizationUrl = gatewayData.authorization_url || null;

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
/* VERIFY PAYMENT                                                             */
/* -------------------------------------------------------------------------- */

const verifyPayment = async (reference, user = null) => {
  if (!reference) {
    const error = new Error("Payment reference is required.");

    error.statusCode = 400;

    throw error;
  }

  const payment = await Payment.findOne({
    reference,
  });

  if (!payment) {
    const error = new Error("Payment record not found.");

    error.statusCode = 404;

    throw error;
  }

  assertClientOwnership({
    user,

    customerId: payment.customerId,

    resource: "payment",
  });

  /*
   * Idempotency:
   *
   * If the payment is already successful,
   * don't call Paystack again.
   */

  if (payment.status === "SUCCESS") {
    return {
      verified: true,

      alreadyVerified: true,

      payment,
    };
  }

  /*
   * Paystack verification uses the transaction
   * REFERENCE, never the access code.
   */

  const response = await paystack.get(
    `/transaction/verify/${encodeURIComponent(reference)}`,
  );

  const gatewayData = response.data?.data;

  if (!gatewayData) {
    const error = new Error("Invalid payment verification response.");

    error.statusCode = 502;

    throw error;
  }

  payment.gatewayResponse = response.data;

  /*
   * Payment was not successful.
   */

  if (gatewayData.status !== "success") {
    payment.status = "FAILED";

    payment.failedAt = new Date();

    await payment.save();

    return {
      verified: false,

      alreadyVerified: false,

      payment,
    };
  }

  /*
   * Verify amount.
   */

  validateGatewayAmount(payment, gatewayData.amount);

  /*
   * Mark local payment successful.
   */

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
/* WEBHOOK                                                                    */
/* -------------------------------------------------------------------------- */

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

  /*
   * Idempotency.
   */

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

  /*
   * Validate amount.
   */

  validateGatewayAmount(payment, gatewayData.amount);

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
    const error = new Error("Payment record not found.");

    error.statusCode = 404;

    throw error;
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
    const error = new Error("Authenticated user is required.");

    error.statusCode = 401;

    throw error;
  }

  /*
   * ADMIN
   */

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

  /*
   * CLIENT
   */

  if (user?.role !== "CLIENT") {
    const error = new Error(
      "You are not authorized to access payment records.",
    );

    error.statusCode = 403;

    throw error;
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

  handleWebhook,

  getPaymentByReference,

  getClientPayments,
};
