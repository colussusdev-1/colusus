import Payment from "../payments/payment.model.js";
import Invoice from "../invoices/invoice.model.js";
import Receipt from "./reciept.model.js";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Generate a unique human-readable receipt number.
 *
 * Example:
 * RCT-20260929-0001
 *
 * The database unique constraint on receiptNumber remains
 * the final protection against duplicate receipt numbers.
 */
const generateReceiptNumber = async (session = null) => {
  const date = new Date();

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  const prefix = `RCT-${year}${month}${day}`;

  const receiptQuery = Receipt.findOne({
    receiptNumber: {
      $regex: `^${prefix}-`,
    },
  })
    .sort({
      receiptNumber: -1,
    })
    .select("receiptNumber")
    .lean();

  if (session) {
    receiptQuery.session(session);
  }

  const lastReceipt = await receiptQuery;

  let sequence = 1;

  if (lastReceipt?.receiptNumber) {
    const lastSequence = Number(lastReceipt.receiptNumber.split("-").pop());

    if (Number.isFinite(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}-${String(sequence).padStart(4, "0")}`;
};

/* -------------------------------------------------------------------------- */
/* CREATE RECEIPT                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Create a receipt for a successful payment.
 *
 * IMPORTANT:
 * This function does not verify Paystack.
 * Payment service is responsible for establishing payment success.
 *
 * Finance remains generic here.
 *
 * The receipt does not care whether the payment came from:
 * - an application
 * - a booking
 * - an opportunity
 * - a service
 * - another future financial source
 *
 * `session` is optional so receipt creation can participate
 * in the payment completion transaction.
 */
const createReceipt = async ({ paymentId, invoiceId, session = null }) => {
  if (!paymentId) {
    const error = new Error("Payment ID is required.");

    error.statusCode = 400;

    throw error;
  }

  if (!invoiceId) {
    const error = new Error("Invoice ID is required.");

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* LOAD PAYMENT                                                             */
  /* ------------------------------------------------------------------------ */

  const paymentQuery = Payment.findById(paymentId);

  if (session) {
    paymentQuery.session(session);
  }

  const payment = await paymentQuery;

  if (!payment) {
    const error = new Error("Payment not found.");

    error.statusCode = 404;

    throw error;
  }

  if (payment.status !== "SUCCESS") {
    const error = new Error(
      "A receipt can only be created for a successful payment.",
    );

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* LOAD INVOICE                                                             */
  /* ------------------------------------------------------------------------ */

  const invoiceQuery = Invoice.findById(invoiceId);

  if (session) {
    invoiceQuery.session(session);
  }

  const invoice = await invoiceQuery;

  if (!invoice) {
    const error = new Error("Invoice not found.");

    error.statusCode = 404;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* PREVENT DUPLICATE RECEIPTS                                               */
  /* ------------------------------------------------------------------------ */

  const existingReceiptQuery = Receipt.findOne({
    payment: payment._id,
  });

  if (session) {
    existingReceiptQuery.session(session);
  }

  const existingReceipt = await existingReceiptQuery;

  if (existingReceipt) {
    return existingReceipt;
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE PAYMENT / INVOICE RELATIONSHIP                                  */
  /* ------------------------------------------------------------------------ */

  if (payment.paymentType !== invoice.invoiceType) {
    const error = new Error("Payment type does not match invoice type.");

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE CURRENCY                                                        */
  /* ------------------------------------------------------------------------ */

  if (payment.currency !== invoice.currency) {
    const error = new Error(
      "Payment currency does not match invoice currency.",
    );

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE PAYMENT AMOUNT                                                  */
  /* ------------------------------------------------------------------------ */

  if (payment.amount <= 0) {
    const error = new Error(
      "Receipt cannot be created for a zero-value payment.",
    );

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* RESOLVE GENERIC FINANCE CONTEXT                                          */
  /* ------------------------------------------------------------------------ */

  /**
   * The invoice is the financial source of truth for the transaction.
   *
   * Payment context is retained as a fallback for older or already-created
   * payment records, while invoice context remains authoritative whenever
   * available.
   */
  const context = {
    ...(payment.context || {}),
    ...(invoice.context || {}),
  };

  /* ------------------------------------------------------------------------ */
  /* CREATE RECEIPT                                                           */
  /* ------------------------------------------------------------------------ */

  const receiptNumber = await generateReceiptNumber(session);

  const receiptData = {
    receiptNumber,

    payment: payment._id,

    invoice: invoice._id,

    paymentType: invoice.invoiceType,

    context,

    customerId: invoice.customerId ?? payment.customerId ?? null,

    customerName: invoice.customerName || payment.customerName || "",

    customerEmail: invoice.customerEmail || payment.customerEmail || "",

    customerPhone: invoice.customerPhone || payment.customerPhone || "",

    amount: payment.amount,

    currency: invoice.currency,

    provider: payment.provider,

    transactionId: payment.transactionId,

    paymentReference: payment.reference,

    status: "ISSUED",

    paidAt: payment.paidAt || new Date(),

    issuedAt: new Date(),

    metadata: {
      paymentMetadata: payment.metadata || {},
      invoiceMetadata: invoice.metadata || {},
    },
  };

  let receipt;

  if (session) {
    const createdReceipts = await Receipt.create([receiptData], {
      session,
    });

    receipt = createdReceipts[0];
  } else {
    receipt = await Receipt.create(receiptData);
  }

  return receipt;
};

/* -------------------------------------------------------------------------- */
/* GET RECEIPT                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Get a receipt by MongoDB ID.
 */
const getReceiptById = async (receiptId) => {
  const receipt = await Receipt.findById(receiptId)
    .populate("payment")
    .populate("invoice");

  if (!receipt) {
    const error = new Error("Receipt not found.");

    error.statusCode = 404;

    throw error;
  }

  return receipt;
};

/**
 * Get a receipt by receipt number.
 */
const getReceiptByNumber = async (receiptNumber) => {
  const receipt = await Receipt.findOne({
    receiptNumber,
  })
    .populate("payment")
    .populate("invoice");

  if (!receipt) {
    const error = new Error("Receipt not found.");

    error.statusCode = 404;

    throw error;
  }

  return receipt;
};

/* -------------------------------------------------------------------------- */
/* FIND RECEIPT BY PAYMENT                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Find a receipt by payment without throwing when no receipt exists.
 *
 * This method is intended for internal payment workflow and idempotency
 * checks where "no receipt yet" is a valid state.
 *
 * `session` is optional so the lookup can participate in a transaction.
 */
const findReceiptByPayment = async (paymentId, session = null) => {
  if (!paymentId) {
    const error = new Error("Payment ID is required.");

    error.statusCode = 400;

    throw error;
  }

  const receiptQuery = Receipt.findOne({
    payment: paymentId,
  })
    .populate("payment")
    .populate("invoice");

  if (session) {
    receiptQuery.session(session);
  }

  return receiptQuery;
};

/* -------------------------------------------------------------------------- */
/* GET RECEIPT BY PAYMENT                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Find a receipt by its payment.
 *
 * Unlike findReceiptByPayment(), this method throws a 404 when
 * the receipt does not exist. This behavior is appropriate for
 * normal API consumers requesting an existing receipt.
 *
 * `session` is optional so this lookup can participate in
 * the payment completion transaction.
 */
const getReceiptByPayment = async (paymentId, session = null) => {
  const receipt = await findReceiptByPayment(paymentId, session);

  if (!receipt) {
    const error = new Error("Receipt not found.");

    error.statusCode = 404;

    throw error;
  }

  return receipt;
};

/* -------------------------------------------------------------------------- */
/* GET CLIENT RECEIPTS                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Get receipts belonging to the authenticated client.
 *
 * The customer ID comes from authentication.
 * The client never supplies customerId.
 */
const getClientReceipts = async ({
  customerId,
  status = null,
  paymentType = null,
}) => {
  if (!customerId) {
    const error = new Error("Customer ID is required.");

    error.statusCode = 400;

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

  const receipts = await Receipt.find(query)
    .populate("payment")
    .populate("invoice")
    .sort({
      issuedAt: -1,
      createdAt: -1,
    })
    .lean();

  return receipts;
};

/* -------------------------------------------------------------------------- */
/* VOID RECEIPT                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Void a receipt when the underlying financial transaction needs
 * to be invalidated.
 *
 * This does not delete the receipt.
 * Financial records should remain auditable.
 */
const voidReceipt = async (receiptId, reason = null) => {
  const receipt = await Receipt.findById(receiptId);

  if (!receipt) {
    const error = new Error("Receipt not found.");

    error.statusCode = 404;

    throw error;
  }

  if (receipt.status === "VOID") {
    return receipt;
  }

  receipt.status = "VOID";
  receipt.voidedAt = new Date();

  if (reason) {
    receipt.notes = reason;
  }

  await receipt.save();

  return receipt;
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default {
  createReceipt,
  getReceiptById,
  getReceiptByNumber,
  findReceiptByPayment,
  getReceiptByPayment,
  getClientReceipts,
  voidReceipt,
};
