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

  console.log("");
  console.log("=================================");
  console.log("BOOKING TO SAVE");
  console.log("=================================");

  console.log({
    consultationFee: pricing.consultationFee,

    amountPayable: pricing.amountPayable,

    paymentStatus: pricing.paymentRequired ? "UNPAID" : "WAIVED",

    bookingStatus: pricing.paymentRequired ? "AWAITING_PAYMENT" : "CONFIRMED",
  });

  console.log("=================================");
  console.log("");

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

    currency: config.consultationCurrency,

    paymentStatus: pricing.paymentRequired ? "UNPAID" : "WAIVED",

    bookingStatus: pricing.paymentRequired ? "AWAITING_PAYMENT" : "CONFIRMED",
  });

  /*
    |--------------------------------------------------------------------------
    | Return
    |--------------------------------------------------------------------------
    */

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
  /*
    |--------------------------------------------------------------------------
    | Consultation Fee
    |--------------------------------------------------------------------------
    */

  const consultationFee = config.consultationFee;
/*
    |--------------------------------------------------------------------------
    | Pricing Debug
    |--------------------------------------------------------------------------
    */

  

  /*
    |--------------------------------------------------------------------------
    | Default Pricing
    |--------------------------------------------------------------------------
    */

  let discount = 0;

  let amountPayable = consultationFee;

  let paymentRequired = true;

  let couponApplied = false;

  let coupon = null;

  /*
    |--------------------------------------------------------------------------
    | Coupon Processing
    |--------------------------------------------------------------------------
    */

  if (bookingData.couponCode) {
    const result = await couponService.validateCoupon(bookingData.couponCode);

    if (result.valid) {
      couponApplied = true;

      coupon = result.coupon.code;

      /*
            |--------------------------------------------------------------------------
            | Coupon Type
            |--------------------------------------------------------------------------
            */

      switch (result.coupon.discountType) {
        /*
                |--------------------------------------------------------------------------
                | FULL
                |--------------------------------------------------------------------------
                */

        case "FULL":
          discount = consultationFee;

          amountPayable = 0;

          paymentRequired = false;

          break;

        /*
                |--------------------------------------------------------------------------
                | FIXED
                |--------------------------------------------------------------------------
                */

        case "FIXED":
          discount = result.coupon.discountValue;

          amountPayable = Math.max(consultationFee - discount, 0);

          paymentRequired = amountPayable > 0;

          break;

        /*
                |--------------------------------------------------------------------------
                | PERCENTAGE
                |--------------------------------------------------------------------------
                */

        case "PERCENTAGE":
          discount = Math.round(
            (consultationFee * result.coupon.discountValue) / 100,
          );

          amountPayable = consultationFee - discount;

          paymentRequired = amountPayable > 0;

          break;

        /*
                |--------------------------------------------------------------------------
                | Default
                |--------------------------------------------------------------------------
                */

        default:
          break;
      }
    }
  }

  /*
    |--------------------------------------------------------------------------
    | Final Pricing Debug
    |--------------------------------------------------------------------------
    */

  console.log("");
  console.log("=================================");
  console.log("FINAL BOOKING PRICING");
  console.log("=================================");

  console.log({
    consultationFee,

    discount,

    amountPayable,

    paymentRequired,

    couponApplied,

    coupon,
  });

  console.log("=================================");
  console.log("");

  /*
    |--------------------------------------------------------------------------
    | Return Pricing
    |--------------------------------------------------------------------------
    */

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

/*
|--------------------------------------------------------------------------
| Update Payment Status
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

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
