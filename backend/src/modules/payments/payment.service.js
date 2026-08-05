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
*/

const initializePayment = async (bookingId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (booking.paymentStatus === "PAID") {
    throw new Error("This booking has already been paid.");
  }

  if (booking.amountPayable <= 0) {
    throw new Error("This booking does not require payment.");
  }

  const reference = generatePaymentReference();

  try {
    const response = await paystack.post("/transaction/initialize", {
      email: booking.email,

      amount: booking.amountPayable * 100,

      currency: booking.currency,

      reference,

      metadata: {
        bookingId: booking._id.toString(),

        fullName: booking.fullName,

        consultationType: booking.consultationType,

        travelPackage: booking.travelPackage,
      },
    });

    booking.paymentReference = reference;

    await booking.save();

    return response.data.data;
  } catch (error) {
    console.log("=================================");
    console.log("PAYSTACK ERROR");
    console.log("=================================");

    console.log("Status:", error.response?.status);

    console.log("Response:", error.response?.data);

    console.log(
      "Secret Key:",
      process.env.PAYSTACK_SECRET_KEY
        ? process.env.PAYSTACK_SECRET_KEY.substring(0, 12) + "..."
        : "UNDEFINED",
    );

    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

const verifyPayment = async (reference) => {
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

  const response = await paystack.get(`/transaction/verify/${reference}`);

  const payment = response.data.data;

  if (payment.status !== "success") {
    throw new Error("Payment verification failed.");
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

  /*
  |--------------------------------------------------------------------------
  | Mark Coupon As Used (Future Proof)
  |--------------------------------------------------------------------------
  */

  if (confirmedBooking.couponApplied) {
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

  await communicationService.bookingConfirmed(confirmedBooking);

  await communicationService.paymentSuccessful(confirmedBooking);

  return {
    booking: confirmedBooking,

    payment,
  };
};

/*
|--------------------------------------------------------------------------
| Handle Paystack Webhook
|--------------------------------------------------------------------------
*/

const handleWebhook = async (payload) => {
  if (payload.event !== "charge.success") {
    return;
  }

  const reference = payload.data.reference;

  const booking = await Booking.findOne({
    paymentReference: reference,
  });

  if (!booking) {
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

  const confirmedBooking = await bookingService.confirmBooking(
    booking._id,
    reference,
    "PAID",
  );

  /*
  |--------------------------------------------------------------------------
  | Mark Coupon As Used
  |--------------------------------------------------------------------------
  */

  if (confirmedBooking.couponApplied) {
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

  await communicationService.bookingConfirmed(confirmedBooking);

  await communicationService.paymentSuccessful(confirmedBooking);
};

export default {
  initializePayment,

  verifyPayment,

  handleWebhook,
};
