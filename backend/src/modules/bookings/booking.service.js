import Booking from "./booking.model.js";
import couponService from "../coupons/coupon.service.js";
import invoiceService from "../finance/invoices/invoice.service.js";
import config from "../../config/environment.js";

/*
|--------------------------------------------------------------------------
| CREATE BOOKING
|--------------------------------------------------------------------------
*/

const createBooking = async (bookingData) => {
  /*
  |--------------------------------------------------------------------------
  | Calculate Booking Pricing
  |--------------------------------------------------------------------------
  |
  | Pricing is calculated entirely on the server.
  |
  */

  const pricing = await reviewBooking(bookingData);

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
    | Consultation Information
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

    couponCode: pricing.couponApplied ? pricing.coupon : null,

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

    paymentStatus: pricing.paymentStatus,

    bookingStatus: pricing.bookingStatus,
  });

  /*
  |--------------------------------------------------------------------------
  | Fully Discounted Booking
  |--------------------------------------------------------------------------
  |
  | No financial transaction is required when the booking is completely
  | waived.
  |
  */

  if (!pricing.paymentRequired) {
    return {
      booking,
      invoice: null,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE INVOICE
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  |
  | This is a public booking flow.
  |
  | The person making the booking does not necessarily have a User account.
  |
  | Therefore:
  |
  | customerId = null
  |
  | The invoice still keeps:
  |
  | - customerName
  | - customerEmail
  | - customerPhone
  |
  | as immutable transaction snapshots.
  |
  */

  const invoice = await invoiceService.createInvoice({
    invoiceType: "BOOKING",

    customer: {
      name: booking.fullName,
      email: booking.email,
      phone: booking.phone,
    },

    /*
      |--------------------------------------------------------------------------
      | Invoice Items
      |--------------------------------------------------------------------------
      |
      | The booking service determines the commercial amount.
      |
      | The invoice service calculates the final item total.
      |
      */

    items: [
      {
        name: "Consultation Booking",

        description: `${booking.consultationType} consultation`,

        quantity: 1,

        unitPrice: booking.amountPayable,
      },
    ],

    currency: booking.currency,

    /*
      |--------------------------------------------------------------------------
      | Business Context
      |--------------------------------------------------------------------------
      |
      | The invoice knows what business transaction it belongs to,
      | without owning booking business logic.
      |
      */

    context: {
      bookingId: booking._id,

      consultationDate: booking.consultationDate,

      consultationType: booking.consultationType,
    },

    dueDate: null,

    notes: "Consultation booking payment.",

    metadata: {
      bookingId: booking._id.toString(),

      paymentType: "BOOKING",
    },
  });

  /*
  |--------------------------------------------------------------------------
  | ISSUE INVOICE
  |--------------------------------------------------------------------------
  |
  | Payment initialization must only happen against an issued invoice.
  |
  */

  const issuedInvoice = await invoiceService.issueInvoice(invoice._id);

  /*
  |--------------------------------------------------------------------------
  | LINK INVOICE TO BOOKING
  |--------------------------------------------------------------------------
  */

  booking.invoice = issuedInvoice._id;

  await booking.save();

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return {
    booking,
    invoice: issuedInvoice,
  };
};

/*
|--------------------------------------------------------------------------
| REVIEW BOOKING
|--------------------------------------------------------------------------
|
| This is the single source of truth for consultation pricing.
|
| Normal:
| ₦50,000 → UNPAID → AWAITING_PAYMENT
|
| Partial discount:
| ₦50,000 → e.g. ₦20,000 → UNPAID → AWAITING_PAYMENT
|
| Full discount:
| ₦50,000 → ₦0 → WAIVED → CONFIRMED
|
|--------------------------------------------------------------------------
*/

const reviewBooking = async (bookingData) => {
  /*
  |--------------------------------------------------------------------------
  | Base Consultation Fee
  |--------------------------------------------------------------------------
  */

  const consultationFee = config.consultationFee;

  /*
  |--------------------------------------------------------------------------
  | Default Pricing
  |--------------------------------------------------------------------------
  */

  let discount = 0;

  let amountPayable = consultationFee;

  let couponApplied = false;

  let coupon = null;

  /*
  |--------------------------------------------------------------------------
  | Coupon Processing
  |--------------------------------------------------------------------------
  */

  if (bookingData.couponCode) {
    const result = await couponService.validateCoupon(bookingData.couponCode);

    /*
    |--------------------------------------------------------------------------
    | Valid Coupon
    |--------------------------------------------------------------------------
    */

    if (result.valid && result.coupon) {
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
        | FULL DISCOUNT
        |--------------------------------------------------------------------------
        */

        case "FULL":
          discount = consultationFee;

          amountPayable = 0;

          break;

        /*
        |--------------------------------------------------------------------------
        | FIXED DISCOUNT
        |--------------------------------------------------------------------------
        */

        case "FIXED":
          discount = Math.max(Number(result.coupon.discountValue) || 0, 0);

          amountPayable = Math.max(consultationFee - discount, 0);

          break;

        /*
        |--------------------------------------------------------------------------
        | PERCENTAGE DISCOUNT
        |--------------------------------------------------------------------------
        */

        case "PERCENTAGE": {
          const percentage = Math.min(
            Math.max(Number(result.coupon.discountValue) || 0, 0),
            100,
          );

          discount = Math.round((consultationFee * percentage) / 100);

          amountPayable = Math.max(consultationFee - discount, 0);

          break;
        }

        /*
        |--------------------------------------------------------------------------
        | UNKNOWN COUPON TYPE
        |--------------------------------------------------------------------------
        */

        default:
          couponApplied = false;

          coupon = null;

          discount = 0;

          amountPayable = consultationFee;

          break;
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Normalize Final Amount
  |--------------------------------------------------------------------------
  |
  | Never allow a negative payable amount.
  |
  */

  amountPayable = Math.max(Number(amountPayable) || 0, 0);

  /*
  |--------------------------------------------------------------------------
  | Determine Payment State
  |--------------------------------------------------------------------------
  */

  const paymentRequired = amountPayable > 0;

  const paymentStatus = paymentRequired ? "UNPAID" : "WAIVED";

  const bookingStatus = paymentRequired ? "AWAITING_PAYMENT" : "CONFIRMED";

  /*
  |--------------------------------------------------------------------------
  | Final Pricing
  |--------------------------------------------------------------------------
  */

  const pricing = {
    consultationFee,

    discount,

    amountPayable,

    paymentRequired,

    couponApplied,

    coupon,

    paymentStatus,

    bookingStatus,
  };

  /*
  |--------------------------------------------------------------------------
  | Debug
  |--------------------------------------------------------------------------
  */

  console.log("BOOKING PRICING:", pricing);

  /*
  |--------------------------------------------------------------------------
  | Return
  |--------------------------------------------------------------------------
  */

  return pricing;
};

/*
|--------------------------------------------------------------------------
| GET ALL BOOKINGS
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
| GET BOOKING BY ID
|--------------------------------------------------------------------------
*/

const getBookingById = async (bookingId) => {
  const booking = await Booking.findById(bookingId);

  return booking;
};

/*
|--------------------------------------------------------------------------
| UPDATE BOOKING STATUS
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
| CONFIRM BOOKING
|--------------------------------------------------------------------------
|
| Legacy/business-level helper.
|
| The normal Paystack flow should now be completed through the
| payment workflow service rather than directly trusting the client.
|
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
| CANCEL BOOKING
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
| UPDATE PAYMENT STATUS
|--------------------------------------------------------------------------
|
| Legacy/business-level helper.
|
| This remains available for existing admin/business flows.
| Paystack completion should use the payment workflow.
|
|--------------------------------------------------------------------------
*/

const updatePaymentStatus = async (
  bookingId,
  paymentStatus,
  paymentReference = null,
) => {
  const bookingStatus =
    paymentStatus === "PAID" || paymentStatus === "WAIVED"
      ? "CONFIRMED"
      : "AWAITING_PAYMENT";

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      paymentStatus,

      paymentReference,

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
| EXPORT
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
