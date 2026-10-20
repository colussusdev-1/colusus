import mongoose from "mongoose";
import bookingService from "./booking.service.js";

/* -------------------------------------------------------------------------- */
/* REVIEW BOOKING                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Review consultation pricing.
 *
 * The backend calculates the authoritative consultation fee,
 * coupon discount, and final amount payable.
 */
export const reviewBooking = async (req, res, next) => {
  try {
    const review = await bookingService.reviewBooking(req.body || {});

    return res.status(200).json({
      success: true,
      message: "Booking reviewed successfully.",
      data: review,
    });
  } catch (error) {
    console.error("BOOKING REVIEW ERROR:", error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* CREATE BOOKING                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Create a consultation booking and its invoice.
 *
 * An optional formSubmissionId links the booking to the consultation
 * request already saved through the public website form.
 */
export const createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body || {};

    console.log("=================================");
    console.log("CREATE BOOKING REQUEST");
    console.log("=================================");

    console.log({
      fullName: bookingData.fullName,
      email: bookingData.email,
      consultationType: bookingData.consultationType,
      consultationDate: bookingData.consultationDate,
      formSubmissionId: bookingData.formSubmissionId || null,
    });

    /* ---------------------------------------------------------------------- */
    /* REQUIRED FIELD VALIDATION                                               */
    /* ---------------------------------------------------------------------- */

    const requiredFields = [
      "fullName",
      "email",
      "phone",
      "travelPackage",
      "consultationDate",
      "consultationType",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = bookingData[field];

      return (
        value === undefined || value === null || String(value).trim() === ""
      );
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required booking information.",
        errors: missingFields.map((field) => ({
          field,
          message: `${field} is required.`,
        })),
      });
    }

    /* ---------------------------------------------------------------------- */
    /* EMAIL VALIDATION                                                        */
    /* ---------------------------------------------------------------------- */

    const email = String(bookingData.email).trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* CONSULTATION TYPE VALIDATION                                            */
    /* ---------------------------------------------------------------------- */

    const allowedConsultationTypes = ["PHONE", "VIDEO", "PHYSICAL"];

    if (
      !allowedConsultationTypes.includes(
        String(bookingData.consultationType).toUpperCase(),
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid consultation type.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /* FORM SUBMISSION ID VALIDATION                                           */
    /* ---------------------------------------------------------------------- */

    if (bookingData.formSubmissionId) {
      const submissionId = String(bookingData.formSubmissionId).trim();

      if (!mongoose.isValidObjectId(submissionId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid consultation form submission ID.",
        });
      }
    }

    /* ---------------------------------------------------------------------- */
    /* CREATE BOOKING                                                          */
    /* ---------------------------------------------------------------------- */

    const result = await bookingService.createBooking({
      ...bookingData,
      fullName: String(bookingData.fullName).trim(),
      email: email.toLowerCase(),
      phone: String(bookingData.phone).trim(),
      consultationType: String(bookingData.consultationType).toUpperCase(),
    });

    if (!result?.booking?._id) {
      throw new Error(
        "Booking creation did not return a valid booking record.",
      );
    }

    const booking = result.booking;

    const invoice = result.invoice || null;

    console.log("=================================");
    console.log("BOOKING CREATED SUCCESSFULLY");
    console.log("=================================");

    console.log({
      bookingId: booking._id.toString(),
      invoiceId: invoice?._id?.toString() || null,
      formSubmissionId: booking.formSubmissionId || null,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      amountPayable: booking.amountPayable,
      paymentRequired: result.paymentRequired,
    });

    /* ---------------------------------------------------------------------- */
    /* RESPONSE                                                                */
    /* ---------------------------------------------------------------------- */

    return res.status(201).json({
      success: true,
      message: result.paymentRequired
        ? "Booking created successfully. Payment is required."
        : "Booking created successfully. No payment is required.",
      data: {
        booking,
        invoice,
        pricing: result.pricing || null,
        paymentRequired: Boolean(result.paymentRequired),
      },
    });
  } catch (error) {
    console.error("=================================");
    console.error("CREATE BOOKING ERROR");
    console.error("=================================");
    console.error(error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET ALL BOOKINGS                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Retrieve all bookings.
 *
 * Keep this endpoint protected by the appropriate admin/staff middleware
 * in booking.routes.js.
 */
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingService.getAllBookings();

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("GET ALL BOOKINGS ERROR:", error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* GET BOOKING BY ID                                                          */
/* -------------------------------------------------------------------------- */

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await bookingService.getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("GET BOOKING BY ID ERROR:", error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* UPDATE BOOKING STATUS                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Update the operational status of a booking.
 *
 * Route authorization must restrict this action to authorized staff/admins.
 */
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { bookingStatus } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    if (!bookingStatus) {
      return res.status(400).json({
        success: false,
        message: "Booking status is required.",
      });
    }

    const allowedStatuses = [
      "PENDING",
      "AWAITING_PAYMENT",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
        allowedStatuses,
      });
    }

    const booking = await bookingService.updateBookingStatus(id, bookingStatus);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully.",
      data: booking,
    });
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR:", error);

    return next(error);
  }
};

/* -------------------------------------------------------------------------- */
/* UPDATE PAYMENT STATUS                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Legacy payment-status endpoint.
 *
 * IMPORTANT:
 * Do not expose this endpoint to public clients. Otherwise, someone could
 * potentially submit PAID and mark a booking as paid without Paystack
 * verification.
 *
 * Actual payment confirmation should go through the finance payment
 * workflow and verified Paystack transactions.
 */
export const updatePaymentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { paymentStatus, paymentReference } = req.body || {};

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required.",
      });
    }

    /*
     * This legacy endpoint must not be used to confirm a payment.
     * Successful payments must be confirmed by the finance workflow.
     */
    if (paymentStatus === "PAID") {
      return res.status(403).json({
        success: false,
        message:
          "Successful payments must be confirmed through the verified finance payment workflow.",
      });
    }

    const allowedStatuses = ["UNPAID", "WAIVED", "FAILED", "REFUNDED"];

    if (!allowedStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status.",
        allowedStatuses: [
          ...allowedStatuses,
          "PAID (verified finance workflow only)",
        ],
      });
    }

    const booking = await bookingService.updatePaymentStatus(
      id,
      paymentStatus,
      paymentReference || null,
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking payment status updated successfully.",
      data: booking,
    });
  } catch (error) {
    console.error("UPDATE PAYMENT STATUS ERROR:", error);

    return next(error);
  }
};
