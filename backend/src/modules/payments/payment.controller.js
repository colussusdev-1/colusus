import verifyPaystackSignature from "../../utils/verifyPaystackSignatures.js";

import paymentService from "./payment.service.js";

/*
|--------------------------------------------------------------------------
| Initialize Payment
|--------------------------------------------------------------------------
*/

export const initializePayment = async (req, res, next) => {
  try {
    console.log("BOOKING ID RECEIVED:", req.body.bookingId);

    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    const payment = await paymentService.initializePayment(bookingId);

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("INITIALIZE PAYMENT ERROR");
    console.error(error);
    console.error(error.stack);

    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

export const verifyPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.verifyPayment(req.params.reference);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Paystack Webhook
|--------------------------------------------------------------------------
*/

export const paystackWebhook = async (req, res, next) => {
  try {
    const signature = req.headers["x-paystack-signature"];

    if (!signature) {
      return res.status(401).json({
        success: false,
        message: "Missing Paystack signature.",
      });
    }

    const isValid = verifyPaystackSignature(signature, req.body);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Paystack signature.",
      });
    }

    await paymentService.handleWebhook(req.body);

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
