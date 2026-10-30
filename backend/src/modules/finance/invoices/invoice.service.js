import Invoice from "./invoice.model.js";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Finance-supported invoice categories.
 *
 * These describe why money is being collected.
 *
 * The actual business record is stored inside `context`.
 */
const INVOICE_TYPES = [
  "BOOKING",
  "APPLICATION",
  "OPPORTUNITY",
  "SERVICE",
  "ASSESSMENT",
  "OTHER",
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Validate an invoice type.
 */
const validateInvoiceType = (invoiceType) => {
  if (!invoiceType) {
    const error = new Error("Invoice type is required.");

    error.statusCode = 400;

    throw error;
  }

  const normalizedType = String(invoiceType).trim().toUpperCase();

  if (!INVOICE_TYPES.includes(normalizedType)) {
    const error = new Error(`Unsupported invoice type: ${invoiceType}.`);

    error.statusCode = 400;

    throw error;
  }

  return normalizedType;
};

/**
 * Calculate the total for a single invoice item.
 *
 * The server calculates this value.
 * Clients/business modules do not provide the final item total.
 */
const calculateItemTotal = (item) => {
  const quantity = Number(item.quantity);
  const unitPrice = Number(item.unitPrice);

  if (!Number.isFinite(quantity) || quantity <= 0) {
    const error = new Error("Invoice item quantity must be greater than zero.");

    error.statusCode = 400;

    throw error;
  }

  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    const error = new Error("Invoice item unit price cannot be negative.");

    error.statusCode = 400;

    throw error;
  }

  return quantity * unitPrice;
};

/**
 * Normalize and validate invoice items.
 *
 * The server calculates item totals.
 * Clients should not be trusted to provide the final amount.
 */
const normalizeItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("An invoice must contain at least one item.");

    error.statusCode = 400;

    throw error;
  }

  return items.map((item) => {
    if (!item?.name || typeof item.name !== "string") {
      const error = new Error("Every invoice item must have a name.");

      error.statusCode = 400;

      throw error;
    }

    const name = item.name.trim();

    if (!name) {
      const error = new Error("Every invoice item must have a name.");

      error.statusCode = 400;

      throw error;
    }

    const total = calculateItemTotal(item);

    return {
      name,

      description:
        typeof item.description === "string"
          ? item.description.trim() || null
          : null,

      quantity: Number(item.quantity),

      unitPrice: Number(item.unitPrice),

      total,
    };
  });
};

/**
 * Calculate invoice financial totals.
 */
const calculateTotals = (items, discount = 0) => {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  const normalizedDiscount = Number(discount);

  if (!Number.isFinite(normalizedDiscount) || normalizedDiscount < 0) {
    const error = new Error("Invoice discount cannot be negative.");

    error.statusCode = 400;

    throw error;
  }

  if (normalizedDiscount > subtotal) {
    const error = new Error(
      "Invoice discount cannot be greater than the subtotal.",
    );

    error.statusCode = 400;

    throw error;
  }

  const total = subtotal - normalizedDiscount;

  return {
    subtotal,
    discount: normalizedDiscount,
    total,
  };
};

/**
 * Normalize currency.
 */
const normalizeCurrency = (currency) => {
  const normalizedCurrency = String(currency || "NGN")
    .trim()
    .toUpperCase();

  if (!normalizedCurrency) {
    const error = new Error("Invoice currency is required.");

    error.statusCode = 400;

    throw error;
  }

  return normalizedCurrency;
};

/**
 * Generate a human-readable invoice number.
 *
 * Example:
 *
 * INV-20261002-0001
 *
 * MongoDB's unique index remains the final uniqueness protection.
 *
 * `session` is optional so this lookup can participate in a
 * MongoDB transaction when invoice creation is part of one.
 */
const generateInvoiceNumber = async (session = null) => {
  const date = new Date();

  const year = date.getUTCFullYear();

  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  const day = String(date.getUTCDate()).padStart(2, "0");

  const prefix = `INV-${year}${month}${day}`;

  const invoiceQuery = Invoice.findOne({
    invoiceNumber: {
      $regex: `^${prefix}-`,
    },
  })
    .sort({
      invoiceNumber: -1,
    })
    .select("invoiceNumber")
    .lean();

  if (session) {
    invoiceQuery.session(session);
  }

  const lastInvoice = await invoiceQuery;

  let sequence = 1;

  if (lastInvoice?.invoiceNumber) {
    const lastSequence = Number(lastInvoice.invoiceNumber.split("-").pop());

    if (Number.isFinite(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${prefix}-${String(sequence).padStart(4, "0")}`;
};

/* -------------------------------------------------------------------------- */
/* CREATE INVOICE                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Create a new invoice.
 *
 * The business module supplies the commercial information.
 * This service calculates the actual financial totals.
 *
 * Customer behavior:
 *
 * Authenticated customer:
 *
 * {
 *   id: user._id,
 *   name: user.name,
 *   email: user.email,
 *   phone: user.phone
 * }
 *
 * Guest customer:
 *
 * {
 *   name: "...",
 *   email: "...",
 *   phone: "..."
 * }
 *
 * `customerId` is therefore optional.
 *
 * `session` is optional so invoice creation can participate
 * in a MongoDB transaction.
 */
const createInvoice = async ({
  invoiceType,
  customer,
  items,
  currency = "NGN",
  discount = 0,
  context = {},
  dueDate = null,
  notes = null,
  metadata = {},
  session = null,
}) => {
  /* ------------------------------------------------------------------------ */
  /* VALIDATE INVOICE TYPE                                                    */
  /* ------------------------------------------------------------------------ */

  const normalizedInvoiceType = validateInvoiceType(invoiceType);

  /* ------------------------------------------------------------------------ */
  /* VALIDATE CUSTOMER SNAPSHOT                                               */
  /* ------------------------------------------------------------------------ */

  if (!customer?.name) {
    const error = new Error("Customer name is required.");

    error.statusCode = 400;

    throw error;
  }

  if (!customer?.email) {
    const error = new Error("Customer email is required.");

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* NORMALIZE ITEMS                                                          */
  /* ------------------------------------------------------------------------ */

  const normalizedItems = normalizeItems(items);

  /* ------------------------------------------------------------------------ */
  /* CALCULATE TOTALS                                                         */
  /* ------------------------------------------------------------------------ */

  const totals = calculateTotals(normalizedItems, discount);

  /* ------------------------------------------------------------------------ */
  /* NORMALIZE CURRENCY                                                       */
  /* ------------------------------------------------------------------------ */

  const normalizedCurrency = normalizeCurrency(currency);

  /* ------------------------------------------------------------------------ */
  /* GENERATE INVOICE NUMBER                                                  */
  /* ------------------------------------------------------------------------ */

  const invoiceNumber = await generateInvoiceNumber(session);

  /* ------------------------------------------------------------------------ */
  /* INVOICE DATA                                                             */
  /* ------------------------------------------------------------------------ */

  const invoiceData = {
    invoiceNumber,

    invoiceType: normalizedInvoiceType,

    /*
     * Finance deliberately does not interpret this object.
     *
     * Assessment example:
     *
     * {
     *   flow: "TRAINEE_ASSESSMENT",
     *   assessmentId: "...",
     *   assessmentReference: "...",
     *   opportunityId: "..."
     * }
     */

    context,

    /* ---------------------------------------------------------------------- */
    /* CUSTOMER                                                               */
    /* ---------------------------------------------------------------------- */

    customerId: customer.id || customer.customerId || null,

    customerName: customer.name,

    customerEmail: customer.email,

    customerPhone: customer.phone || null,

    /* ---------------------------------------------------------------------- */
    /* FINANCIAL INFORMATION                                                  */
    /* ---------------------------------------------------------------------- */

    items: normalizedItems,

    subtotal: totals.subtotal,

    discount: totals.discount,

    total: totals.total,

    amountPaid: 0,

    balanceDue: totals.total,

    currency: normalizedCurrency,

    /* ---------------------------------------------------------------------- */
    /* INITIAL STATE                                                          */
    /* ---------------------------------------------------------------------- */

    status: "DRAFT",

    dueDate: dueDate ? new Date(dueDate) : null,

    notes,

    metadata,
  };

  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

  if (session) {
    const [invoice] = await Invoice.create([invoiceData], {
      session,
    });

    return invoice;
  }

  return Invoice.create(invoiceData);
};

/* -------------------------------------------------------------------------- */
/* ISSUE INVOICE                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Move a draft invoice into the issued state.
 *
 * Issuing an invoice makes it eligible for payment.
 *
 * `session` is optional so this operation can participate
 * in a MongoDB transaction.
 */
const issueInvoice = async (invoiceId, session = null) => {
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

  if (invoice.status !== "DRAFT") {
    const error = new Error(
      `Invoice cannot be issued from ${invoice.status} status.`,
    );

    error.statusCode = 400;

    throw error;
  }

  invoice.status = "ISSUED";

  invoice.issuedAt = new Date();

  if (session) {
    await invoice.save({
      session,
    });
  } else {
    await invoice.save();
  }

  return invoice;
};

/* -------------------------------------------------------------------------- */
/* GET INVOICE                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Get an invoice by ID.
 *
 * `session` is optional so this lookup can participate in
 * a MongoDB transaction when called by the payment workflow.
 */
const getInvoiceById = async (invoiceId, session = null) => {
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

  return invoice;
};

/* -------------------------------------------------------------------------- */
/* GET CLIENT INVOICES                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Get invoices belonging to an authenticated client.
 *
 * The client ID comes from authentication.
 * The client never supplies customerId from the frontend.
 */
const getClientInvoices = async ({
  customerId,
  status = null,
  invoiceType = null,
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

  if (invoiceType) {
    query.invoiceType = validateInvoiceType(invoiceType);
  }

  const invoices = await Invoice.find(query)
    .sort({
      createdAt: -1,
    })
    .lean();

  return invoices;
};

/**
 * Get an invoice by invoice number.
 */
const getInvoiceByNumber = async (invoiceNumber) => {
  const invoice = await Invoice.findOne({
    invoiceNumber,
  });

  if (!invoice) {
    const error = new Error("Invoice not found.");

    error.statusCode = 404;

    throw error;
  }

  return invoice;
};

/* -------------------------------------------------------------------------- */
/* RECORD PAYMENT                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Update an invoice after a successful payment.
 *
 * Payment service is responsible for establishing that money was received.
 *
 * This function:
 *
 * - validates the invoice
 * - validates the payment amount
 * - prevents overpayment
 * - supports partial payments
 * - moves the invoice to PARTIALLY_PAID or PAID
 * - records the latest payment reference
 *
 * `session` is optional so this function can participate in a MongoDB
 * transaction when called by the payment workflow.
 */
const recordPayment = async ({
  invoiceId,
  amount,
  paymentReference,
  session = null,
}) => {
  /* ------------------------------------------------------------------------ */
  /* FIND INVOICE                                                             */
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
  /* VALIDATE PAYMENT REFERENCE                                               */
  /* ------------------------------------------------------------------------ */

  if (!paymentReference) {
    const error = new Error(
      "Payment reference is required when recording a payment.",
    );

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* IDEMPOTENCY                                                              */
  /* ------------------------------------------------------------------------ */

  if (
    invoice.lastPaymentReference &&
    invoice.lastPaymentReference === paymentReference
  ) {
    return invoice;
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE PAYMENT AMOUNT                                                  */
  /* ------------------------------------------------------------------------ */

  const paymentAmount = Number(amount);

  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    const error = new Error("A valid payment amount is required.");

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE INVOICE STATE                                                   */
  /* ------------------------------------------------------------------------ */

  if (invoice.status === "DRAFT") {
    const error = new Error(
      "Payment cannot be recorded against a draft invoice.",
    );

    error.statusCode = 400;

    throw error;
  }

  if (invoice.status === "CANCELLED" || invoice.status === "VOID") {
    const error = new Error(
      "Payment cannot be recorded against a cancelled or void invoice.",
    );

    error.statusCode = 400;

    throw error;
  }

  if (invoice.status === "PAID" || invoice.balanceDue <= 0) {
    const error = new Error("Invoice has already been fully paid.");

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* VALIDATE PAYMENT AGAINST BALANCE                                         */
  /* ------------------------------------------------------------------------ */

  if (paymentAmount > invoice.balanceDue) {
    const error = new Error(
      "Payment amount cannot exceed the invoice balance.",
    );

    error.statusCode = 400;

    throw error;
  }

  /* ------------------------------------------------------------------------ */
  /* APPLY PAYMENT                                                            */
  /* ------------------------------------------------------------------------ */

  invoice.amountPaid += paymentAmount;

  invoice.balanceDue = Math.max(invoice.total - invoice.amountPaid, 0);

  /* ------------------------------------------------------------------------ */
  /* RECORD PAYMENT REFERENCE                                                 */
  /* ------------------------------------------------------------------------ */

  invoice.lastPaymentReference = paymentReference;

  /* ------------------------------------------------------------------------ */
  /* DETERMINE INVOICE STATE                                                  */
  /* ------------------------------------------------------------------------ */

  if (invoice.balanceDue === 0) {
    invoice.status = "PAID";

    invoice.paidAt = new Date();
  } else {
    invoice.status = "PARTIALLY_PAID";
  }

  /* ------------------------------------------------------------------------ */
  /* SAVE                                                                     */
  /* ------------------------------------------------------------------------ */

  if (session) {
    await invoice.save({
      session,
    });
  } else {
    await invoice.save();
  }

  return invoice;
};

/* -------------------------------------------------------------------------- */
/* CANCEL INVOICE                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Cancel an invoice that has not been fully paid.
 */
const cancelInvoice = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    const error = new Error("Invoice not found.");

    error.statusCode = 404;

    throw error;
  }

  if (invoice.status === "PAID") {
    const error = new Error("A paid invoice cannot be cancelled.");

    error.statusCode = 400;

    throw error;
  }

  if (invoice.status === "CANCELLED") {
    return invoice;
  }

  invoice.status = "CANCELLED";

  invoice.cancelledAt = new Date();

  await invoice.save();

  return invoice;
};

/* -------------------------------------------------------------------------- */
/* CHECK OVERDUE                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Mark an invoice as overdue when its due date has passed
 * and there is still an outstanding balance.
 *
 * This works for both fully unpaid and partially paid invoices.
 */
const markOverdue = async (invoiceId) => {
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    const error = new Error("Invoice not found.");

    error.statusCode = 404;

    throw error;
  }

  if (
    invoice.balanceDue > 0 &&
    invoice.dueDate &&
    invoice.dueDate < new Date() &&
    ["ISSUED", "PARTIALLY_PAID"].includes(invoice.status)
  ) {
    invoice.status = "OVERDUE";

    await invoice.save();
  }

  return invoice;
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

const invoiceService = {
  createInvoice,

  issueInvoice,

  getInvoiceById,

  getInvoiceByNumber,

  getClientInvoices,

  recordPayment,

  cancelInvoice,

  markOverdue,
};

export default invoiceService;
