import financeAdminService from "./finance.admin.service.js";

/* -------------------------------------------------------------------------- */
/* OVERVIEW                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Get the Admin Finance overview.
 *
 * Optional query parameters:
 *
 * ?from=2026-10-01
 * ?to=2026-10-31
 */
export const getFinanceOverview = async (req, res, next) => {
  try {
    const { from = null, to = null } = req.query || {};

    const overview = await financeAdminService.getOverview({
      from,
      to,
    });

    return res.status(200).json({
      success: true,
      data: overview,
    });
  } catch (error) {
    console.error("GET FINANCE OVERVIEW ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* INVOICES                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * List invoices for Admin.
 *
 * Supported filters:
 *
 * ?page=1
 * ?limit=20
 * ?status=PAID
 * ?invoiceType=SERVICE
 * ?customerId=...
 * ?from=2026-10-01
 * ?to=2026-10-31
 * ?search=...
 */
export const getFinanceInvoices = async (req, res, next) => {
  try {
    const { page, limit, status, invoiceType, customerId, from, to, search } =
      req.query || {};

    const result = await financeAdminService.listInvoices({
      page,
      limit,
      status,
      invoiceType,
      customerId,
      from,
      to,
      search,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET FINANCE INVOICES ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* PAYMENTS                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * List payments for Admin.
 *
 * Supported filters:
 *
 * ?page=1
 * ?limit=20
 * ?status=SUCCESS
 * ?paymentType=SERVICE
 * ?customerId=...
 * ?from=2026-10-01
 * ?to=2026-10-31
 * ?search=...
 */
export const getFinancePayments = async (req, res, next) => {
  try {
    const { page, limit, status, paymentType, customerId, from, to, search } =
      req.query || {};

    const result = await financeAdminService.listPayments({
      page,
      limit,
      status,
      paymentType,
      customerId,
      from,
      to,
      search,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET FINANCE PAYMENTS ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* RECEIPTS                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * List receipts for Admin.
 *
 * Supported filters:
 *
 * ?page=1
 * ?limit=20
 * ?paymentType=SERVICE
 * ?customerId=...
 * ?from=2026-10-01
 * ?to=2026-10-31
 * ?search=...
 */
export const getFinanceReceipts = async (req, res, next) => {
  try {
    const { page, limit, paymentType, customerId, from, to, search } =
      req.query || {};

    const result = await financeAdminService.listReceipts({
      page,
      limit,
      paymentType,
      customerId,
      from,
      to,
      search,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET FINANCE RECEIPTS ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* PAYMENT DETAILS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Get complete payment details by payment reference.
 */
export const getFinancePaymentDetails = async (req, res, next) => {
  try {
    const { reference } = req.params;

    const result = await financeAdminService.getPaymentDetails(reference);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET FINANCE PAYMENT DETAILS ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* INVOICE DETAILS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Get complete invoice details.
 */
export const getFinanceInvoiceDetails = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const result = await financeAdminService.getInvoiceDetails(invoiceId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET FINANCE INVOICE DETAILS ERROR");
    console.error(error);

    next(error);
  }
};
