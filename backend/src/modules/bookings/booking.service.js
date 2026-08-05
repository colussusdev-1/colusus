import Booking from "./booking.model.js";
import couponService from "../coupons/coupon.service.js";
import config from "../../config/environment.js";


/*
|--------------------------------------------------------------------------
| Create Booking
|--------------------------------------------------------------------------
*/

const createBooking = async (bookingData) => {
  /*
  |--------------------------------------------------------------------------
  | Calculate Booking Pricing
  |--------------------------------------------------------------------------
  */

  const pricing = await reviewBooking(bookingData);

  /*
  |--------------------------------------------------------------------------
  | Debug
  |--------------------------------------------------------------------------
  */

  console.log("=================================");
  console.log("BOOKING TO SAVE");
  console.log("=================================");
  console.log({
    ...bookingData,

    consultationFee: pricing.consultationFee,

    amountPayable: pricing.amountPayable,

    paymentStatus: pricing.paymentRequired ? "UNPAID" : "WAIVED",

    bookingStatus: pricing.paymentRequired ? "AWAITING_PAYMENT" : "CONFIRMED",
  });

  /*
  |--------------------------------------------------------------------------
  | Create Booking
  |--------------------------------------------------------------------------
  */

  const booking = await Booking.create({
    /*
    |--------------------------------------------------------------------------
    | Personal Information
    |--------------------------------------------------------------------------
    */

    fullName: bookingData.fullName,

    email: bookingData.email,

    phone: bookingData.phone,

    age: bookingData.age,

    education: bookingData.education,

    maritalStatus: bookingData.maritalStatus,

    /*
    |--------------------------------------------------------------------------
    | Travel Information
    |--------------------------------------------------------------------------
    */

    travelPackage: bookingData.travelPackage,

    countries: bookingData.countries || [],

    visaClass: bookingData.visaClass,

    intendedTravelDate: bookingData.intendedTravelDate,

    /*
    |--------------------------------------------------------------------------
    | Consultation
    |--------------------------------------------------------------------------
    */

    consultationDate: bookingData.consultationDate,

    consultationType: bookingData.consultationType,

    message: bookingData.message,

    /*
    |--------------------------------------------------------------------------
    | Coupon
    |--------------------------------------------------------------------------
    */

    couponCode: bookingData.couponCode || null,

    couponApplied: pricing.couponApplied,

    discountAmount: pricing.discount,

    /*
    |--------------------------------------------------------------------------
    | Payment
    |--------------------------------------------------------------------------
    */

    consultationFee: pricing.consultationFee,

    amountPayable: pricing.amountPayable,

    currency: "NGN",

    paymentStatus: pricing.paymentRequired ? "UNPAID" : "WAIVED",

    bookingStatus: pricing.paymentRequired ? "AWAITING_PAYMENT" : "CONFIRMED",
  });

  return {
    booking,
  
  };
};

/*
|--------------------------------------------------------------------------
| Review Booking
|--------------------------------------------------------------------------
*/

const reviewBooking = async (bookingData) => {
  const consultationFee = config.consultationFee;

  let discount = 0;

  let amountPayable = consultationFee;

  let paymentRequired = true;

  let couponApplied = false;

  let coupon = null;

  if (bookingData.couponCode) {
    const result = await couponService.validateCoupon(bookingData.couponCode);

    if (result.valid) {
      couponApplied = true;

      coupon = result.coupon.code;

      switch (result.coupon.discountType) {
        case "FULL":
          discount = consultationFee;
          amountPayable = 0;
          paymentRequired = false;
          break;

        case "FIXED":
          discount = result.coupon.discountValue;

          amountPayable = Math.max(consultationFee - discount, 0);

          paymentRequired = amountPayable > 0;

          break;

        case "PERCENTAGE":
          discount = Math.round(
            (consultationFee * result.coupon.discountValue) / 100,
          );

          amountPayable = consultationFee - discount;

          paymentRequired = amountPayable > 0;

          break;

        default:
          break;
      }
    }
  }

  return {
    consultationFee,

    discount,

    amountPayable,

    paymentRequired,

    couponApplied,

    coupon,

    paymentStatus: paymentRequired ? "UNPAID" : "WAIVED",

    bookingStatus: paymentRequired ? "AWAITING_PAYMENT" : "CONFIRMED",
  };
};

/*
|--------------------------------------------------------------------------
| Get All Bookings
|--------------------------------------------------------------------------
*/

const getAllBookings = async () => {
  const bookings = await Booking.find().sort({
    createdAt: -1,
  });

  return bookings;
};

/*
|--------------------------------------------------------------------------
| Get Booking By ID
|--------------------------------------------------------------------------
*/

const getBookingById = async (bookingId) => {
  const booking = await Booking.findById(bookingId);

  return booking;
};

/*
|--------------------------------------------------------------------------
| Update Booking Status
|--------------------------------------------------------------------------
*/

const updateBookingStatus = async (bookingId, bookingStatus) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      bookingStatus,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return booking;
};

/*
|--------------------------------------------------------------------------
| Update Payment Status
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Confirm Booking
|--------------------------------------------------------------------------
*/

const confirmBooking = async (
  bookingId,
  paymentReference = null,
  paymentStatus = "PAID",
) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      paymentStatus,

      paymentReference,

      bookingStatus: "CONFIRMED",
    },
    {
      new: true,

      runValidators: true,
    },
  );

  return booking;
};

/*
|--------------------------------------------------------------------------
| Cancel Booking
|--------------------------------------------------------------------------
*/

const cancelBooking = async (bookingId) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      bookingStatus: "CANCELLED",
    },
    {
      new: true,

      runValidators: true,
    },
  );

  return booking;
};

const updatePaymentStatus = async (
  bookingId,
  paymentStatus,
  paymentReference = null,
) => {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      paymentStatus,

      paymentReference,

      bookingStatus:
        paymentStatus === "PAID" || paymentStatus === "WAIVED"
          ? "CONFIRMED"
          : "AWAITING_PAYMENT",
    },
    {
      new: true,
      runValidators: true,
    },
  );

  return booking;
};

export default {
  createBooking,

  reviewBooking,

  getAllBookings,

  getBookingById,

  updateBookingStatus,

  updatePaymentStatus,

  confirmBooking,

  cancelBooking,
};
