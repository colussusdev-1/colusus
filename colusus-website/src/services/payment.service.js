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
| Redirect To Paystack
|--------------------------------------------------------------------------
*/

const pay = async (bookingData) => {
  const result = await createBooking(bookingData);

  console.log(result);

  const payment = await initializePayment(result.booking._id);

  window.location.href = payment.authorization_url;
};

export default {
  reviewBooking,

  createBooking,

  initializePayment,

  verifyPayment,

  pay,
};
