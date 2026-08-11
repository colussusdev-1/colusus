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
| Start Payment
|--------------------------------------------------------------------------
|
| Flow:
|
| 1. Create consultation booking
| 2. Receive booking ID
| 3. Initialize Paystack transaction
| 4. Receive Paystack authorization URL
| 5. Redirect client to Paystack
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

  /*
    |--------------------------------------------------------------------------
    | Initialize Paystack
    |--------------------------------------------------------------------------
    */

  const payment = await initializePayment(result.booking._id);

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
