import receiptService from "../reciepts/reciept.service.js";

/* -------------------------------------------------------------------------- */
/* CREATE RECEIPT                                                             */
/* -------------------------------------------------------------------------- */

export const createReceipt = async (req, res, next) => {
  try {
    const { paymentId, invoiceId } = req.body || {};

    const receipt = await receiptService.createReceipt({
      paymentId,
      invoiceId,
    });

    return res.status(201).json({
      success: true,
      message: "Receipt created successfully.",
      data: receipt,
    });
  } catch (error) {
    console.error("CREATE RECEIPT ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET RECEIPT BY ID                                                          */
/* -------------------------------------------------------------------------- */

export const getReceiptById = async (req, res, next) => {
  try {
    const { receiptId } = req.params;

    const receipt = await receiptService.getReceiptById(receiptId);

    return res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    console.error("GET RECEIPT ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET RECEIPT BY NUMBER                                                      */
/* -------------------------------------------------------------------------- */

export const getReceiptByNumber = async (req, res, next) => {
  try {
    const { receiptNumber } = req.params;

    const receipt = await receiptService.getReceiptByNumber(receiptNumber);

    return res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    console.error("GET RECEIPT BY NUMBER ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET RECEIPT BY PAYMENT                                                     */
/* -------------------------------------------------------------------------- */

export const getReceiptByPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;

    const receipt = await receiptService.getReceiptByPayment(paymentId);

    return res.status(200).json({
      success: true,
      data: receipt,
    });
  } catch (error) {
    console.error("GET RECEIPT BY PAYMENT ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET MY RECEIPTS                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Get receipts belonging to the authenticated client.
 *
 * The customer ID is taken from req.user.
 * The frontend never supplies customerId.
 */
export const getMyReceipts = async (req, res, next) => {
  try {
    const customerId = req.user?.id || req.user?._id;

    if (!customerId) {
      const error = new Error("Authenticated user is required.");

      error.statusCode = 401;

      throw error;
    }

    const { status, paymentType } = req.query;

    const receipts = await receiptService.getClientReceipts({
      customerId,
      status: status || null,
      paymentType: paymentType || null,
    });

    return res.status(200).json({
      success: true,
      count: receipts.length,
      data: receipts,
    });
  } catch (error) {
    console.error("GET MY RECEIPTS ERROR");
    console.error(error);

    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* VOID RECEIPT                                                               */
/* -------------------------------------------------------------------------- */

export const voidReceipt = async (req, res, next) => {
  try {
    const { receiptId } = req.params;
    const { reason } = req.body || {};

    const receipt = await receiptService.voidReceipt(receiptId, reason);

    return res.status(200).json({
      success: true,
      message: "Receipt voided successfully.",
      data: receipt,
    });
  } catch (error) {
    console.error("VOID RECEIPT ERROR");
    console.error(error);

    next(error);
  }
};
