import Booking from "./booking.model.js";
import couponService from "../coupons/coupon.service.js";
import invoiceService from "../finance/invoices/invoice.service.js";
import config from "../../config/environment.js";

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                                                  */
/* -------------------------------------------------------------------------- */

const PAYMENT_REQUIRED_INVOICE_STATUSES = [
  "ISSUED",
  "PARTIALLY_PAID",
  "OVERDUE",
];

/* -------------------------------------------------------------------------- */
/* NORMALIZE FORM SUBMISSION ID                                                */
/* -------------------------------------------------------------------------- */

const normalizeFormSubmissionId = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalized = String(value).trim();

  if (!/^[a-f\d]{24}$/i.test(normalized)) {
    throw new Error("Invalid consultation form submission ID.");
  }

  return normalized;
};

/* -------------------------------------------------------------------------- */
/* REVIEW BOOKING                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Calculate consultation pricing on the server.
 *
 * The frontend cannot determine the authoritative consultation fee,
 * discount, or final amount payable.
 */
const reviewBooking = async (bookingData = {}) => {
  const consultationFee = Number(config.consultationFee);

  if (!Number.isFinite(consultationFee) || consultationFee < 0) {
    throw new Error("Invalid consultation fee configuration.");
  }

  let discount = 0;
  let amountPayable = consultationFee;
  let couponApplied = false;
  let coupon = null;

  /* ------------------------------------------------------------------------ */
  /* VALIDATE COUPON                                                          */
  /* ------------------------------------------------------------------------ */

  if (bookingData.couponCode) {
    const result = await couponService.validateCoupon(
      String(bookingData.couponCode).trim().toUpperCase(),
    );

    if (result.valid && result.coupon) {
      const validatedCoupon = result.coupon;

      const discountValue = Number(validatedCoupon.discountValue) || 0;

      switch (validatedCoupon.discountType) {
        case "FULL": {
          couponApplied = true;
          coupon = validatedCoupon.code;
          discount = consultationFee;
          amountPayable = 0;
          break;
        }

        case "FIXED": {
          couponApplied = true;
          coupon = validatedCoupon.code;

          discount = Math.min(Math.max(discountValue, 0), consultationFee);

          amountPayable = consultationFee - discount;

          break;
        }

        case "PERCENTAGE": {
          const percentage = Math.min(Math.max(discountValue, 0), 100);

          couponApplied = true;
          coupon = validatedCoupon.code;

          discount = Math.round((consultationFee * percentage) / 100);

          amountPayable = consultationFee - discount;

          break;
        }

        default: {
          couponApplied = false;
          coupon = null;
          discount = 0;
          amountPayable = consultationFee;
          break;
        }
      }
    }
  }

  /* ------------------------------------------------------------------------ */
  /* NORMALIZE AMOUNTS                                                        */
  /* ------------------------------------------------------------------------ */

  discount = Math.max(Number(discount) || 0, 0);

  amountPayable = Math.max(Number(amountPayable) || 0, 0);

  const paymentRequired = amountPayable > 0;

  const paymentStatus = paymentRequired ? "UNPAID" : "WAIVED";

  const bookingStatus = paymentRequired ? "AWAITING_PAYMENT" : "CONFIRMED";

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

  console.log("BOOKING PRICING:", pricing);

  return pricing;
};

/* -------------------------------------------------------------------------- */
/* CREATE BOOKING                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Create a consultation booking and its invoice.
 *
 * Flow:
 *
 * 1. Calculate pricing on the server.
 * 2. Create the booking.
 * 3. If payment is required, create and issue an invoice.
 * 4. Link the invoice to the booking.
 * 5. Return the booking and invoice.
 *
 * formSubmissionId optionally links the booking to the previously saved
 * website consultation submission.
 */
const createBooking = async (bookingData = {}) => {
  /* ------------------------------------------------------------------------ */
  /* VALIDATE REQUIRED INFORMATION                                            */
  /* ------------------------------------------------------------------------ */

  const fullName = String(bookingData.fullName || "").trim();
  const email = String(bookingData.email || "")
    .trim()
    .toLowerCase();
  const phone = String(bookingData.phone || "").trim();

  if (!fullName) {
    throw new Error("Full name is required.");
  }

  if (!email) {
    throw new Error("Email address is required.");
  }

  if (!phone) {
    throw new Error("Phone number is required.");
  }

  if (!bookingData.travelPackage) {
    throw new Error("Travel package is required.");
  }

  if (!bookingData.consultationDate) {
    throw new Error("Consultation date is required.");
  }

  if (!bookingData.consultationType) {
    throw new Error("Consultation type is required.");
  }

  /* ------------------------------------------------------------------------ */
  /* NORMALIZE FORM SUBMISSION ID                                             */
  /* ------------------------------------------------------------------------ */

  const formSubmissionId = normalizeFormSubmissionId(
    bookingData.formSubmissionId,
  );

  /* ------------------------------------------------------------------------ */
  /* CALCULATE AUTHORITATIVE PRICING                                          */
  /* ------------------------------------------------------------------------ */

  const pricing = await reviewBooking({
    ...bookingData,
    fullName,
    email,
    phone,
  });

  /* ------------------------------------------------------------------------ */
  /* CREATE BOOKING                                                           */
  /* ------------------------------------------------------------------------ */

  const booking = await Booking.create({
    /* Consultation form submission linkage */

    ...(formSubmissionId ? { formSubmissionId } : {}),

    /* Personal information */

    fullName,

    email,

    phone,

    age: bookingData.age ?? null,

    education: String(bookingData.education || "").trim(),

    maritalStatus: bookingData.maritalStatus || "",

    /* Travel information */

    travelPackage: bookingData.travelPackage,

    countries: Array.isArray(bookingData.countries)
      ? bookingData.countries
      : [],

    visaClass: bookingData.visaClass || "",

    intendedTravelDate: bookingData.intendedTravelDate || null,

    /* Consultation information */

    consultationDate: bookingData.consultationDate,

    consultationType: bookingData.consultationType,

    message: String(bookingData.message || "").trim(),

    /* Coupon information */

    couponCode: pricing.couponApplied ? pricing.coupon : null,

    couponApplied: pricing.couponApplied,

    discountAmount: pricing.discount,

    /* Financial information */

    consultationFee: pricing.consultationFee,

    amountPayable: pricing.amountPayable,

    currency: config.consultationCurrency,

    paymentStatus: pricing.paymentStatus,

    bookingStatus: pricing.bookingStatus,
  });

  console.log("CONSULTATION BOOKING CREATED:", {
    bookingId: booking._id.toString(),
    formSubmissionId: formSubmissionId || null,
    paymentStatus: booking.paymentStatus,
    bookingStatus: booking.bookingStatus,
    amountPayable: booking.amountPayable,
  });

  /* ------------------------------------------------------------------------ */
  /* NO PAYMENT REQUIRED                                                      */
  /* ------------------------------------------------------------------------ */

  if (!pricing.paymentRequired) {
    return {
      booking,
      invoice: null,
      pricing,
      paymentRequired: false,
    };
  }

  /* ------------------------------------------------------------------------ */
  /* CREATE INVOICE                                                           */
  /* ------------------------------------------------------------------------ */

  const invoice = await invoiceService.createInvoice({
    invoiceType: "BOOKING",

    customer: {
      name: booking.fullName,
      email: booking.email,
      phone: booking.phone,
    },

    items: [
      {
        name: "Consultation Booking",

        description: `${booking.consultationType} consultation`,

        quantity: 1,

        unitPrice: booking.amountPayable,
      },
    ],

    currency: booking.currency,

    context: {
      bookingId: booking._id,

      consultationDate: booking.consultationDate,

      consultationType: booking.consultationType,

      formSubmissionId,
    },

    dueDate: null,

    notes: "Consultation booking payment.",

    metadata: {
      bookingId: booking._id.toString(),

      paymentType: "BOOKING",

      flow: "CONSULTATION",

      formSubmissionId,
    },
  });

  /* ------------------------------------------------------------------------ */
  /* ISSUE INVOICE                                                            */
  /* ------------------------------------------------------------------------ */

  const issuedInvoice = await invoiceService.issueInvoice(invoice._id);

  if (!issuedInvoice?._id) {
    throw new Error("Consultation invoice could not be issued.");
  }

  if (!PAYMENT_REQUIRED_INVOICE_STATUSES.includes(issuedInvoice.status)) {
    throw new Error(
      `Consultation invoice cannot receive payment from ${issuedInvoice.status} status.`,
    );
  }

  /* ------------------------------------------------------------------------ */
  /* LINK INVOICE TO BOOKING                                                  */
  /* ------------------------------------------------------------------------ */

  booking.invoice = issuedInvoice._id;

  await booking.save();

  /* ------------------------------------------------------------------------ */
  /* RETURN                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    booking,
    invoice: issuedInvoice,
    pricing,
    paymentRequired: true,
  };
};

/* -------------------------------------------------------------------------- */
/* GET ALL BOOKINGS                                                           */
/* -------------------------------------------------------------------------- */

const getAllBookings = async () => {
  return Booking.find().sort({
    createdAt: -1,
  });
};

/* -------------------------------------------------------------------------- */
/* GET BOOKING BY ID                                                          */
/* -------------------------------------------------------------------------- */

const getBookingById = async (bookingId) => {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  return Booking.findById(bookingId);
};

/* -------------------------------------------------------------------------- */
/* UPDATE BOOKING STATUS                                                      */
/* -------------------------------------------------------------------------- */

const updateBookingStatus = async (bookingId, bookingStatus) => {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  if (!bookingStatus) {
    throw new Error("Booking status is required.");
  }

  return Booking.findByIdAndUpdate(
    bookingId,
    {
      bookingStatus,
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

/* -------------------------------------------------------------------------- */
/* CONFIRM BOOKING                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Legacy helper.
 *
 * Prefer paymentWorkflowService.completeSuccessfulPayment() for actual
 * Paystack transactions.
 */
const confirmBooking = async (
  bookingId,
  paymentReference = null,
  paymentStatus = "PAID",
) => {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  return Booking.findByIdAndUpdate(
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
};

/* -------------------------------------------------------------------------- */
/* CANCEL BOOKING                                                             */
/* -------------------------------------------------------------------------- */

const cancelBooking = async (bookingId) => {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  return Booking.findByIdAndUpdate(
    bookingId,
    {
      bookingStatus: "CANCELLED",
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

/* -------------------------------------------------------------------------- */
/* UPDATE PAYMENT STATUS                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Legacy helper.
 *
 * Successful Paystack payments should normally be completed through
 * paymentWorkflowService rather than trusting client-provided payment status.
 */
const updatePaymentStatus = async (
  bookingId,
  paymentStatus,
  paymentReference = null,
) => {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  if (!paymentStatus) {
    throw new Error("Payment status is required.");
  }

  const bookingStatus =
    paymentStatus === "PAID" || paymentStatus === "WAIVED"
      ? "CONFIRMED"
      : "AWAITING_PAYMENT";

  return Booking.findByIdAndUpdate(
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
};

/* -------------------------------------------------------------------------- */
/* EXPORT                                                                     */
/* -------------------------------------------------------------------------- */

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
