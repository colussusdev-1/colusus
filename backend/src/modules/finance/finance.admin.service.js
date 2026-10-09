
import Invoice from "./invoices/invoice.model.js";
import Payment from "./payments/payment.model.js";
import Receipt from "./reciepts/reciept.model.js";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const PAYMENT_STATUSES = ["PENDING", "PROCESSING", "SUCCESS", "FAILED"];

const INVOICE_STATUSES = [
  "DRAFT",
  "ISSUED",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "CANCELLED",
  "VOID",
];

const FINANCE_TYPES = [
  "BOOKING",
  "APPLICATION",
  "OPPORTUNITY",
  "SERVICE",
  "OTHER",
];

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Normalize pagination values.
 */
const normalizePagination = ({ page = 1, limit = 20 }) => {
  const normalizedPage = Math.max(Number(page) || 1, 1);

  const normalizedLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100,
  );

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    skip: (normalizedPage - 1) * normalizedLimit,
  };
};

/**
 * Validate a finance type.
 */
const validateFinanceType = (type) => {
  if (!type) {
    return;
  }

  if (!FINANCE_TYPES.includes(type)) {
    const error = new Error(`Unsupported finance type: ${type}.`);

    error.statusCode = 400;

    throw error;
  }
};

/**
 * Validate a payment status.
 */
const validatePaymentStatus = (status) => {
  if (!status) {
    return;
  }

  if (!PAYMENT_STATUSES.includes(status)) {
    const error = new Error(`Unsupported payment status: ${status}.`);

    error.statusCode = 400;

    throw error;
  }
};

/**
 * Validate an invoice status.
 */
const validateInvoiceStatus = (status) => {
  if (!status) {
    return;
  }

  if (!INVOICE_STATUSES.includes(status)) {
    const error = new Error(`Unsupported invoice status: ${status}.`);

    error.statusCode = 400;

    throw error;
  }
};

/**
 * Build an optional date range.
 *
 * Dates are interpreted as ISO-compatible values.
 */
const buildDateRange = ({ from, to, field }) => {
  if (!from && !to) {
    return {};
  }

  const range = {};

  if (from) {
    const fromDate = new Date(from);

    if (Number.isNaN(fromDate.getTime())) {
      const error = new Error("Invalid `from` date.");

      error.statusCode = 400;

      throw error;
    }

    range.$gte = fromDate;
  }

  if (to) {
    const toDate = new Date(to);

    if (Number.isNaN(toDate.getTime())) {
      const error = new Error("Invalid `to` date.");

      error.statusCode = 400;

      throw error;
    }

    /*
     * Make an ISO date supplied as YYYY-MM-DD inclusive through
     * the end of that day.
     */
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(to))) {
      toDate.setUTCHours(23, 59, 59, 999);
    }

    range.$lte = toDate;
  }

  return {
    [field]: range,
  };
};

/* -------------------------------------------------------------------------- */
/* OVERVIEW                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get the Finance overview for the Admin dashboard.
 *
 * This is intentionally calculated from the Finance collections rather
 * than maintained as separate counters.
 *
 * That keeps the overview derived from financial records themselves.
 */
const getOverview = async ({ from = null, to = null } = {}) => {
  const paymentDateRange = buildDateRange({
    from,
    to,
    field: "createdAt",
  });

  const invoiceDateRange = buildDateRange({
    from,
    to,
    field: "createdAt",
  });

  const [
    paymentSummary,
    successfulPaymentSummary,
    invoiceSummary,
    outstandingSummary,
    statusSummary,
    typeSummary,
    recentPayments,
    recentInvoices,
  ] = await Promise.all([
    /* ---------------------------------------------------------------------- */
    /* ALL PAYMENT COUNTS                                                     */
    /* ---------------------------------------------------------------------- */

    Payment.aggregate([
      {
        $match: paymentDateRange,
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
    ]),

    /* ---------------------------------------------------------------------- */
    /* SUCCESSFUL PAYMENTS                                                    */
    /* ---------------------------------------------------------------------- */

    Payment.aggregate([
      {
        $match: {
          ...paymentDateRange,
          status: "SUCCESS",
        },
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
    ]),

    /* ---------------------------------------------------------------------- */
    /* INVOICE SUMMARY                                                        */
    /* ---------------------------------------------------------------------- */

    Invoice.aggregate([
      {
        $match: invoiceDateRange,
      },
      {
        $group: {
          _id: null,
          count: {
            $sum: 1,
          },
          total: {
            $sum: "$total",
          },
          amountPaid: {
            $sum: "$amountPaid",
          },
          balanceDue: {
            $sum: "$balanceDue",
          },
        },
      },
    ]),

    /* ---------------------------------------------------------------------- */
    /* OUTSTANDING BALANCE                                                    */
    /* ---------------------------------------------------------------------- */

    Invoice.aggregate([
      {
        $match: {
          ...invoiceDateRange,
          status: {
            $in: ["ISSUED", "PARTIALLY_PAID", "OVERDUE"],
          },
        },
      },
      {
        $group: {
          _id: null,
          amount: {
            $sum: "$balanceDue",
          },
        },
      },
    ]),

    /* ---------------------------------------------------------------------- */
    /* INVOICE STATUS BREAKDOWN                                               */
    /* ---------------------------------------------------------------------- */

    Invoice.aggregate([
      {
        $match: invoiceDateRange,
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
          amount: {
            $sum: "$total",
          },
          amountPaid: {
            $sum: "$amountPaid",
          },
          balanceDue: {
            $sum: "$balanceDue",
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]),

    /* ---------------------------------------------------------------------- */
    /* FINANCE TYPE BREAKDOWN                                                 */
    /* ---------------------------------------------------------------------- */

    Payment.aggregate([
      {
        $match: {
          ...paymentDateRange,
          status: "SUCCESS",
        },
      },
      {
        $group: {
          _id: "$paymentType",
          count: {
            $sum: 1,
          },
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]),

    /* ---------------------------------------------------------------------- */
    /* RECENT PAYMENTS                                                        */
    /* ---------------------------------------------------------------------- */

    Payment.find(paymentDateRange)
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .select(
        [
          "reference",
          "paymentType",
          "customerName",
          "customerEmail",
          "amount",
          "currency",
          "status",
          "invoice",
          "transactionId",
          "createdAt",
          "paidAt",
        ].join(" "),
      )
      .lean(),

    /* ---------------------------------------------------------------------- */
    /* RECENT INVOICES                                                        */
    /* ---------------------------------------------------------------------- */

    Invoice.find(invoiceDateRange)
      .sort({
        createdAt: -1,
      })
      .limit(10)
      .select(
        [
          "invoiceNumber",
          "invoiceType",
          "customerName",
          "customerEmail",
          "total",
          "amountPaid",
          "balanceDue",
          "currency",
          "status",
          "issuedAt",
          "paidAt",
          "createdAt",
        ].join(" "),
      )
      .lean(),
  ]);

  /* ------------------------------------------------------------------------ */
  /* NORMALIZE PAYMENT STATUS DATA                                            */
  /* ------------------------------------------------------------------------ */

  const paymentsByStatus = PAYMENT_STATUSES.reduce((result, status) => {
    const row = paymentSummary.find((item) => item._id === status);

    result[status] = {
      count: row?.count || 0,
      amount: row?.amount || 0,
    };

    return result;
  }, {});

  /* ------------------------------------------------------------------------ */
  /* NORMALIZE INVOICE STATUS DATA                                             */
  /* ------------------------------------------------------------------------ */

  const invoicesByStatus = INVOICE_STATUSES.reduce((result, status) => {
    const row = statusSummary.find((item) => item._id === status);

    result[status] = {
      count: row?.count || 0,
      amount: row?.amount || 0,
      amountPaid: row?.amountPaid || 0,
      balanceDue: row?.balanceDue || 0,
    };

    return result;
  }, {});

  /* ------------------------------------------------------------------------ */
  /* NORMALIZE TYPE DATA                                                      */
  /* ------------------------------------------------------------------------ */

  const revenueByType = FINANCE_TYPES.reduce((result, type) => {
    const row = typeSummary.find((item) => item._id === type);

    result[type] = {
      count: row?.count || 0,
      amount: row?.amount || 0,
    };

    return result;
  }, {});

  const invoiceTotals = invoiceSummary[0] || {};

  const successfulPayments = successfulPaymentSummary[0] || {};

  /* ------------------------------------------------------------------------ */
  /* RESPONSE                                                                 */
  /* ------------------------------------------------------------------------ */

  return {
    period: {
      from,
      to,
    },

    financials: {
      totalInvoiced: Number(invoiceTotals.total || 0),

      totalCollected: Number(invoiceTotals.amountPaid || 0),

      outstandingBalance: Number(
        outstandingSummary[0]?.amount || 0,
      ),

      successfulPaymentAmount: Number(
        successfulPayments.amount || 0,
      ),
    },

    payments: {
      total: paymentSummary.reduce(
        (sum, item) => sum + Number(item.count || 0),
        0,
      ),

      successful: paymentsByStatus.SUCCESS,

      pending: paymentsByStatus.PENDING,

      processing: paymentsByStatus.PROCESSING,

      failed: paymentsByStatus.FAILED,

      byStatus: paymentsByStatus,
    },

    invoices: {
      total: Number(invoiceTotals.count || 0),

      byStatus: invoicesByStatus,
    },

    revenueByType,

    recentPayments,

    recentInvoices,
  };
};

/* -------------------------------------------------------------------------- */
/* LIST INVOICES                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Admin invoice listing.
 */
const listInvoices = async ({
  page = 1,
  limit = 20,
  status = null,
  invoiceType = null,
  customerId = null,
  from = null,
  to = null,
  search = null,
} = {}) => {
  validateInvoiceStatus(status);
  validateFinanceType(invoiceType);

  const pagination = normalizePagination({
    page,
    limit,
  });

  const query = {};

  if (status) {
    query.status = status;
  }

  if (invoiceType) {
    query.invoiceType = invoiceType;
  }

  if (customerId) {
    query.customerId = customerId;
  }

  Object.assign(
    query,
    buildDateRange({
      from,
      to,
      field: "createdAt",
    }),
  );

  if (search) {
    const searchRegex = new RegExp(
      String(search).trim(),
      "i",
    );

    query.$or = [
      {
        invoiceNumber: searchRegex,
      },
      {
        customerName: searchRegex,
      },
      {
        customerEmail: searchRegex,
      },
    ];
  }

  const [invoices, total] = await Promise.all([
    Invoice.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    Invoice.countDocuments(query),
  ]);

  return {
    invoices,

    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      pages: Math.ceil(total / pagination.limit),
    },
  };
};

/* -------------------------------------------------------------------------- */
/* LIST PAYMENTS                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Admin payment listing.
 */
const listPayments = async ({
  page = 1,
  limit = 20,
  status = null,
  paymentType = null,
  customerId = null,
  from = null,
  to = null,
  search = null,
} = {}) => {
  validatePaymentStatus(status);
  validateFinanceType(paymentType);

  const pagination = normalizePagination({
    page,
    limit,
  });

  const query = {};

  if (status) {
    query.status = status;
  }

  if (paymentType) {
    query.paymentType = paymentType;
  }

  if (customerId) {
    query.customerId = customerId;
  }

  Object.assign(
    query,
    buildDateRange({
      from,
      to,
      field: "createdAt",
    }),
  );

  if (search) {
    const searchRegex = new RegExp(
      String(search).trim(),
      "i",
    );

    query.$or = [
      {
        reference: searchRegex,
      },
      {
        customerName: searchRegex,
      },
      {
        customerEmail: searchRegex,
      },
      {
        transactionId: searchRegex,
      },
    ];
  }

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate({
        path: "invoice",
        select:
          "invoiceNumber invoiceType status total amountPaid balanceDue",
      })
      .lean(),

    Payment.countDocuments(query),
  ]);

  return {
    payments,

    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      pages: Math.ceil(total / pagination.limit),
    },
  };
};

/* -------------------------------------------------------------------------- */
/* LIST RECEIPTS                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Admin receipt listing.
 */
const listReceipts = async ({
  page = 1,
  limit = 20,
  paymentType = null,
  customerId = null,
  from = null,
  to = null,
  search = null,
} = {}) => {
  validateFinanceType(paymentType);

  const pagination = normalizePagination({
    page,
    limit,
  });

  const query = {};

  if (paymentType) {
    query.paymentType = paymentType;
  }

  if (customerId) {
    query.customerId = customerId;
  }

  Object.assign(
    query,
    buildDateRange({
      from,
      to,
      field: "createdAt",
    }),
  );

  if (search) {
    const searchRegex = new RegExp(
      String(search).trim(),
      "i",
    );

    query.$or = [
      {
        receiptNumber: searchRegex,
      },
      {
        paymentReference: searchRegex,
      },
      {
        customerName: searchRegex,
      },
      {
        customerEmail: searchRegex,
      },
    ];
  }

  const [receipts, total] = await Promise.all([
    Receipt.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .populate({
        path: "payment",
        select:
          "reference status amount currency transactionId",
      })
      .populate({
        path: "invoice",
        select:
          "invoiceNumber invoiceType status total amountPaid balanceDue",
      })
      .lean(),

    Receipt.countDocuments(query),
  ]);

  return {
    receipts,

    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      pages: Math.ceil(total / pagination.limit),
    },
  };
};

/* -------------------------------------------------------------------------- */
/* PAYMENT DETAILS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Get complete payment details for Admin.
 */
const getPaymentDetails = async (reference) => {
  if (!reference) {
    const error = new Error(
      "Payment reference is required.",
    );

    error.statusCode = 400;

    throw error;
  }

  const payment = await Payment.findOne({
    reference,
  })
    .populate({
      path: "invoice",
    })
    .lean();

  if (!payment) {
    const error = new Error("Payment not found.");

    error.statusCode = 404;

    throw error;
  }

  const receipt = await Receipt.findOne({
    payment: payment._id,
  }).lean();

  return {
    payment,
    invoice: payment.invoice || null,
    receipt,
  };
};

/* -------------------------------------------------------------------------- */
/* INVOICE DETAILS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Get complete invoice details for Admin.
 */
const getInvoiceDetails = async (invoiceId) => {
  if (!invoiceId) {
    const error = new Error(
      "Invoice ID is required.",
    );

    error.statusCode = 400;

    throw error;
  }

  const invoice = await Invoice.findById(invoiceId).lean();

  if (!invoice) {
    const error = new Error("Invoice not found.");

    error.statusCode = 404;

    throw error;
  }

  const payments = await Payment.find({
    invoice: invoice._id,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  const receipts = await Receipt.find({
    invoice: invoice._id,
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    invoice,
    payments,
    receipts,
  };
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

export default {
  getOverview,
  listInvoices,
  listPayments,
  listReceipts,
  getPaymentDetails,
  getInvoiceDetails,
};
