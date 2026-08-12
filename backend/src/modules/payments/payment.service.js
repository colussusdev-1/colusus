import paystack from "../../config/paystack.js";

import Booking from "../bookings/booking.model.js";
import bookingService from "../bookings/booking.service.js";
import communicationService from "../communications/communication.service.js";
import couponService from "../coupons/coupon.service.js";

import generatePaymentReference from "../../utils/generatePaymentReference.js";

/*
|--------------------------------------------------------------------------
| Initialize Payment
|--------------------------------------------------------------------------
|
| Creates a Paystack transaction for a booking that actually requires
| payment.
|
| Rules:
|
| PAID     → reject
| WAIVED   → reject
| ₦0       → reject
| > ₦0     → initialize Paystack
|
|--------------------------------------------------------------------------
*/

const initializePayment = async (bookingId) => {
  /*
    |--------------------------------------------------------------------------
    | Find Booking
    |--------------------------------------------------------------------------
    */

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found.");
  }

  /*
    |--------------------------------------------------------------------------
    | Already Paid
    |--------------------------------------------------------------------------
    */

  if (booking.paymentStatus === "PAID") {
    throw new Error("This booking has already been paid.");
  }

  /*
    |--------------------------------------------------------------------------
    | Waived Booking
    |--------------------------------------------------------------------------
    |
    | A fully discounted consultation does not need Paystack.
    |
    |--------------------------------------------------------------------------
    */

  if (booking.paymentStatus === "WAIVED") {
    throw new Error("This booking does not require payment.");
  }

  /*
    |--------------------------------------------------------------------------
    | Validate Payable Amount
    |--------------------------------------------------------------------------
    */

  const amountPayable = Number(booking.amountPayable);

  if (!Number.isFinite(amountPayable) || amountPayable <= 0) {
    throw new Error("This booking does not require payment.");
  }

  /*
    |--------------------------------------------------------------------------
    | Generate Payment Reference
    |--------------------------------------------------------------------------
    */

  const reference = generatePaymentReference();

  /*
    |--------------------------------------------------------------------------
    | Initialize Paystack
    |--------------------------------------------------------------------------
    */

  try {
    const response = await paystack.post("/transaction/initialize", {
      email: booking.email,

      /*
                    |--------------------------------------------------------------------------
                    | Paystack expects amount in the smallest currency unit.
                    |
                    | ₦50,000 → 5,000,000 kobo
                    |--------------------------------------------------------------------------
                    */

      amount: Math.round(amountPayable * 100),

      currency: booking.currency,

      reference,

      metadata: {
        bookingId: booking._id.toString(),

        fullName: booking.fullName,

        consultationType: booking.consultationType,

        travelPackage: booking.travelPackage,

        consultationDate: booking.consultationDate,
      },
    });

    /*
        |--------------------------------------------------------------------------
        | Save Payment Reference
        |--------------------------------------------------------------------------
        */

    booking.paymentReference = reference;

    await booking.save();

    /*
        |--------------------------------------------------------------------------
        | Return Paystack Data
        |--------------------------------------------------------------------------
        */

    return response.data.data;
  } catch (error) {
    console.log("");
    console.log("=================================");
    console.log("PAYSTACK INITIALIZATION ERROR");
    console.log("=================================");

    console.log("Booking ID:", booking._id.toString());

    console.log("Amount:", amountPayable);

    console.log("Currency:", booking.currency);

    console.log("Reference:", reference);

    console.log("Status:", error.response?.status);

    console.log("Response:", error.response?.data);

    console.log("=================================");

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
|
| Verifies a Paystack transaction and confirms the booking.
|
|--------------------------------------------------------------------------
*/

const verifyPayment = async (reference) => {
  /*
    |--------------------------------------------------------------------------
    | Find Booking
    |--------------------------------------------------------------------------
    */

  const booking = await Booking.findOne({
    paymentReference: reference,
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  /*
    |--------------------------------------------------------------------------
    | Prevent Duplicate Verification
    |--------------------------------------------------------------------------
    */

  if (booking.paymentStatus === "PAID") {
    return {
      booking,

      payment: {
        status: "success",

        reference,

        verified: true,
      },
    };
  }

  /*
    |--------------------------------------------------------------------------
    | Verify Transaction With Paystack
    |--------------------------------------------------------------------------
    */

  let response;

  try {
    response = await paystack.get(`/transaction/verify/${reference}`);
  } catch (error) {
    console.error(
      "PAYSTACK VERIFICATION ERROR:",
      error.response?.data || error.message,
    );

    throw error;
  }

  const payment = response.data.data;

  /*
    |--------------------------------------------------------------------------
    | Check Paystack Payment Status
    |--------------------------------------------------------------------------
    */

  if (payment.status !== "success") {
    throw new Error("Payment verification failed.");
  }

  /*
    |--------------------------------------------------------------------------
    | Verify Payment Amount
    |--------------------------------------------------------------------------
    |
    | Paystack returns the amount in kobo.
    | Our booking stores the amount in naira.
    |
    |--------------------------------------------------------------------------
    */

  const expectedAmount = Math.round(Number(booking.amountPayable) * 100);

  const paidAmount = Number(payment.amount);

  if (paidAmount !== expectedAmount) {
    console.error("PAYMENT AMOUNT MISMATCH", {
      bookingId: booking._id.toString(),

      expectedAmount,

      paidAmount,

      reference,
    });

    throw new Error("Payment amount does not match the booking amount.");
  }

  /*
    |--------------------------------------------------------------------------
    | Confirm Booking
    |--------------------------------------------------------------------------
    */

  const confirmedBooking = await bookingService.confirmBooking(
    booking._id,

    reference,

    "PAID",
  );

  if (!confirmedBooking) {
    throw new Error("Unable to confirm booking.");
  }

  /*
    |--------------------------------------------------------------------------
    | Mark Coupon As Used
    |--------------------------------------------------------------------------
    */

  if (confirmedBooking.couponApplied && confirmedBooking.couponCode) {
    try {
      await couponService.markCouponAsUsed(confirmedBooking.couponCode);
    } catch (error) {
      /*
            |--------------------------------------------------------------------------
            | Coupon bookkeeping should not undo a successful payment.
            |--------------------------------------------------------------------------
            */

      console.warn("Coupon usage update failed:", error.message);
    }
  }

  /*
    |--------------------------------------------------------------------------
    | Communications
    |--------------------------------------------------------------------------
    */

  try {
    await communicationService.bookingConfirmed(confirmedBooking);
  } catch (error) {
    console.error("Booking confirmation communication failed:", error.message);
  }

  try {
    await communicationService.paymentSuccessful(confirmedBooking);
  } catch (error) {
    console.error("Payment receipt communication failed:", error.message);
  }

  /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

  return {
    booking: confirmedBooking,

    payment,
  };
};

/*
|--------------------------------------------------------------------------
| Handle Paystack Webhook
|--------------------------------------------------------------------------
|
| Paystack sends charge.success when a payment succeeds.
|
|--------------------------------------------------------------------------
*/

const handleWebhook = async (payload) => {
  /*
    |--------------------------------------------------------------------------
    | Ignore Events We Don't Handle
    |--------------------------------------------------------------------------
    */

  if (payload.event !== "charge.success") {
    return;
  }

  /*
    |--------------------------------------------------------------------------
    | Get Reference
    |--------------------------------------------------------------------------
    */

  const reference = payload.data?.reference;

  if (!reference) {
    console.warn("Paystack webhook received without reference.");

    return;
  }

  /*
    |--------------------------------------------------------------------------
    | Find Booking
    |--------------------------------------------------------------------------
    */

  const booking = await Booking.findOne({
    paymentReference: reference,
  });

  if (!booking) {
    console.warn("Webhook booking not found:", reference);

    return;
  }

  /*
    |--------------------------------------------------------------------------
    | Ignore Duplicate Webhooks
    |--------------------------------------------------------------------------
    */

  if (booking.paymentStatus === "PAID") {
    return;
  }

  /*
    |--------------------------------------------------------------------------
    | Verify Webhook Payment Status
    |--------------------------------------------------------------------------
    */

  if (payload.data?.status !== "success") {
    return;
  }

  /*
    |--------------------------------------------------------------------------
    | Verify Payment Amount
    |--------------------------------------------------------------------------
    */

  const expectedAmount = Math.round(Number(booking.amountPayable) * 100);

  const paidAmount = Number(payload.data?.amount);

  if (paidAmount !== expectedAmount) {
    console.error("WEBHOOK PAYMENT AMOUNT MISMATCH", {
      bookingId: booking._id.toString(),

      reference,

      expectedAmount,

      paidAmount,
    });

    return;
  }

  /*
    |--------------------------------------------------------------------------
    | Confirm Booking
    |--------------------------------------------------------------------------
    */

  const confirmedBooking = await bookingService.confirmBooking(
    booking._id,

    reference,

    "PAID",
  );

  if (!confirmedBooking) {
    return;
  }

  /*
    |--------------------------------------------------------------------------
    | Mark Coupon As Used
    |--------------------------------------------------------------------------
    */

  if (confirmedBooking.couponApplied && confirmedBooking.couponCode) {
    try {
      await couponService.markCouponAsUsed(confirmedBooking.couponCode);
    } catch (error) {
      console.warn("Coupon usage update failed:", error.message);
    }
  }

  /*
    |--------------------------------------------------------------------------
    | Communications
    |--------------------------------------------------------------------------
    */

  try {
    await communicationService.bookingConfirmed(confirmedBooking);
  } catch (error) {
    console.error("Webhook booking communication failed:", error.message);
  }

  try {
    await communicationService.paymentSuccessful(confirmedBooking);
  } catch (error) {
    console.error("Webhook payment communication failed:", error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {
  initializePayment,

  verifyPayment,

  handleWebhook,
};
