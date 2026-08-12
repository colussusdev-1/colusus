import api from "./api";

/*
|--------------------------------------------------------------------------
| Review Booking
|--------------------------------------------------------------------------
*/

const reviewBooking = async (bookingData) => {
  const { data } = await api.post("/bookings/review", bookingData);

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Create Booking
|--------------------------------------------------------------------------
*/

const createBooking = async (bookingData) => {
  const { data } = await api.post("/bookings", bookingData);

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Initialize Paystack Payment
|--------------------------------------------------------------------------
*/

const initializePayment = async (bookingId) => {
  const { data } = await api.post("/payments/initialize", {
    bookingId,
  });

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

const verifyPayment = async (reference) => {
  const { data } = await api.get(`/payments/verify/${reference}`);

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Start Consultation Payment Flow
|--------------------------------------------------------------------------
|
| Flow:
|
| 1. Create consultation booking
| 2. Receive booking
| 3. Check whether payment is required
|
|    FREE / FULL COUPON:
|       → WAIVED
|       → CONFIRMED
|       → DO NOT CALL PAYSTACK
|
|    NORMAL BOOKING:
|       → UNPAID
|       → AWAITING_PAYMENT
|       → Initialize Paystack
|       → Redirect client
|
|--------------------------------------------------------------------------
*/

const pay = async (bookingData) => {
  /*
    |--------------------------------------------------------------------------
    | Create Booking
    |--------------------------------------------------------------------------
    */

  const result = await createBooking(bookingData);

  console.log("BOOKING CREATED:", result);

  /*
    |--------------------------------------------------------------------------
    | Validate Booking Response
    |--------------------------------------------------------------------------
    */

  if (!result?.booking?._id) {
    throw new Error("Booking was created, but no booking ID was returned.");
  }

  const booking = result.booking;

  /*
    |--------------------------------------------------------------------------
    | Read Final Booking State
    |--------------------------------------------------------------------------
    |
    | The backend is the source of truth.
    |
    |--------------------------------------------------------------------------
    */

  const amountPayable = Number(booking.amountPayable);

  const paymentStatus = booking.paymentStatus;

  const bookingStatus = booking.bookingStatus;

  console.log("CONSULTATION PAYMENT STATE:", {
    amountPayable,

    paymentStatus,

    bookingStatus,
  });

  /*
    |--------------------------------------------------------------------------
    | FREE / FULL COUPON BOOKING
    |--------------------------------------------------------------------------
    |
    | A fully discounted consultation:
    |
    | amountPayable = 0
    | paymentStatus = WAIVED
    | bookingStatus = CONFIRMED
    |
    | There is NO Paystack transaction.
    |
    |--------------------------------------------------------------------------
    */

  if (
    amountPayable <= 0 ||
    paymentStatus === "WAIVED" ||
    bookingStatus === "CONFIRMED"
  ) {
    console.log("NO PAYMENT REQUIRED.");

    return {
      booking,

      paymentRequired: false,

      payment: null,
    };
  }

  /*
    |--------------------------------------------------------------------------
    | Safety Check
    |--------------------------------------------------------------------------
    |
    | If the backend says payment is required, the amount must be > 0.
    |
    |--------------------------------------------------------------------------
    */

  if (!Number.isFinite(amountPayable) || amountPayable <= 0) {
    throw new Error("Invalid consultation payment amount.");
  }

  /*
    |--------------------------------------------------------------------------
    | Initialize Paystack
    |--------------------------------------------------------------------------
    */

  const payment = await initializePayment(booking._id);

  console.log("PAYSTACK RESPONSE:", payment);

  console.log("AUTHORIZATION URL:", payment?.authorization_url);

  /*
    |--------------------------------------------------------------------------
    | Validate Paystack Response
    |--------------------------------------------------------------------------
    */

  if (!payment?.authorization_url) {
    throw new Error("Paystack did not return an authorization URL.");
  }

  /*
    |--------------------------------------------------------------------------
    | Redirect Client To Paystack
    |--------------------------------------------------------------------------
    */

  window.location.href = payment.authorization_url;

  /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    |
    | Normally the browser leaves this page immediately because of the
    | redirect. Returning this also makes the service easier to test.
    |
    |--------------------------------------------------------------------------
    */

  return {
    booking,

    payment,

    paymentRequired: true,
  };
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {
  reviewBooking,

  createBooking,

  initializePayment,

  verifyPayment,

  pay,
};
