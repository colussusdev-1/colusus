import invoiceService from "./invoice.service.js";

/* -------------------------------------------------------------------------- */
/* CREATE INVOICE                                                             */
/* -------------------------------------------------------------------------- */

export const createInvoice = async (req, res, next) => {
  try {
    const {
      invoiceType,
      customer,
      items,
      currency,
      discount,
      context,
      dueDate,
      notes,
      metadata,
    } = req.body || {};

    const invoice = await invoiceService.createInvoice({
      invoiceType,
      customer,
      items,
      currency,
      discount,
      context,
      dueDate,
      notes,
      metadata,
    });

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully.",
      data: invoice,
    });
  } catch (error) {
    console.error("CREATE INVOICE ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* ISSUE INVOICE                                                              */
/* -------------------------------------------------------------------------- */

export const issueInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await invoiceService.issueInvoice(invoiceId);

    return res.status(200).json({
      success: true,
      message: "Invoice issued successfully.",
      data: invoice,
    });
  } catch (error) {
    console.error("ISSUE INVOICE ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET INVOICE BY ID                                                          */
/* -------------------------------------------------------------------------- */

export const getInvoiceById = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await invoiceService.getInvoiceById(invoiceId);

    return res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("GET INVOICE ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET INVOICE BY NUMBER                                                      */
/* -------------------------------------------------------------------------- */

export const getInvoiceByNumber = async (req, res, next) => {
  try {
    const { invoiceNumber } = req.params;

    const invoice = await invoiceService.getInvoiceByNumber(invoiceNumber);

    return res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("GET INVOICE BY NUMBER ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET MY INVOICES                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Get invoices belonging to the authenticated client.
 *
 * IMPORTANT:
 * The client ID is taken from req.user.
 * The frontend must never provide customerId.
 */
export const getMyInvoices = async (req, res, next) => {
  try {
    const customerId = req.user?.id || req.user?._id;

    if (!customerId) {
      const error = new Error("Authenticated user is required.");
      error.statusCode = 401;
      throw error;
    }

    const { status, invoiceType } = req.query;

    const invoices = await invoiceService.getClientInvoices({
      customerId,
      status: status || null,
      invoiceType: invoiceType || null,
    });

    return res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices,
    });
  } catch (error) {
    console.error("GET MY INVOICES ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* RECORD PAYMENT                                                             */
/* -------------------------------------------------------------------------- */

export const recordPayment = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const { amount, paymentReference } = req.body || {};

    const invoice = await invoiceService.recordPayment({
      invoiceId,
      amount,
      paymentReference,
    });

    return res.status(200).json({
      success: true,
      message: "Invoice payment recorded successfully.",
      data: invoice,
    });
  } catch (error) {
    console.error("RECORD INVOICE PAYMENT ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* CANCEL INVOICE                                                             */
/* -------------------------------------------------------------------------- */

export const cancelInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await invoiceService.cancelInvoice(invoiceId);

    return res.status(200).json({
      success: true,
      message: "Invoice cancelled successfully.",
      data: invoice,
    });
  } catch (error) {
    console.error("CANCEL INVOICE ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* MARK OVERDUE                                                               */
/* -------------------------------------------------------------------------- */

export const markOverdue = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await invoiceService.markOverdue(invoiceId);

    return res.status(200).json({
      success: true,
      message: "Invoice status checked successfully.",
      data: invoice,
    });
  } catch (error) {
    console.error("MARK INVOICE OVERDUE ERROR");
    console.error(error);

    next(error);
  }
};
