import mongoose from "mongoose";

/* -------------------------------------------------------------------------- */
/* BOOKING SCHEMA                                                             */
/* -------------------------------------------------------------------------- */

const bookingSchema = new mongoose.Schema(
  {
    /* ---------------------------------------------------------------------- */
    /* FORM SUBMISSION LINK                                                    */
    /* ---------------------------------------------------------------------- */

    /**
     * References the website form submission associated with this booking.
     *
     * Stored as a string because form submission IDs are passed between
     * the public website and the booking API as strings.
     */
    formSubmissionId: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* PERSONAL INFORMATION                                                    */
    /* ---------------------------------------------------------------------- */

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      min: 0,
      default: null,
    },

    education: {
      type: String,
      trim: true,
      default: "",
    },

    maritalStatus: {
      type: String,
      trim: true,
      default: "",
    },

    /* ---------------------------------------------------------------------- */
    /* TRAVEL INFORMATION                                                      */
    /* ---------------------------------------------------------------------- */

    travelPackage: {
      type: String,
      required: true,
      trim: true,
    },

    countries: {
      type: [String],
      default: [],
    },

    visaClass: {
      type: String,
      trim: true,
      default: "",
    },

    intendedTravelDate: {
      type: Date,
      default: null,
    },

    /* ---------------------------------------------------------------------- */
    /* CONSULTATION INFORMATION                                                */
    /* ---------------------------------------------------------------------- */

    consultationDate: {
      type: Date,
      required: true,
    },

    consultationType: {
      type: String,
      enum: ["PHONE", "VIDEO", "PHYSICAL"],
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    /* ---------------------------------------------------------------------- */
    /* COUPON                                                                  */
    /* ---------------------------------------------------------------------- */

    couponCode: {
      type: String,
      uppercase: true,
      trim: true,
      default: null,
    },

    couponApplied: {
      type: Boolean,
      default: false,
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* ---------------------------------------------------------------------- */
    /* FINANCIAL INVOICE LINK                                                  */
    /* ---------------------------------------------------------------------- */

    /**
     * Financial relationship:
     *
     * Booking → Invoice → Payment → Receipt
     *
     * The finance module remains responsible for payment records.
     */
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* CONSULTATION PRICING                                                    */
    /* ---------------------------------------------------------------------- */

    consultationFee: {
      type: Number,
      required: true,
      default: 50000,
      min: 0,
    },

    amountPayable: {
      type: Number,
      required: true,
      default: 50000,
      min: 0,
    },

    currency: {
      type: String,
      default: "NGN",
      uppercase: true,
    },

    /* ---------------------------------------------------------------------- */
    /* PAYMENT REFERENCE                                                       */
    /* ---------------------------------------------------------------------- */

    /**
     * Most recent successful payment reference associated with the booking.
     *
     * The Payment collection remains the financial source of truth.
     */
    paymentReference: {
      type: String,
      unique: true,
      sparse: true,
    },

    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PAID", "WAIVED", "FAILED", "REFUNDED"],
      default: "UNPAID",
    },

    /* ---------------------------------------------------------------------- */
    /* BOOKING STATUS                                                          */
    /* ---------------------------------------------------------------------- */

    bookingStatus: {
      type: String,
      enum: [
        "PENDING",
        "AWAITING_PAYMENT",
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
      ],
      default: "AWAITING_PAYMENT",
    },

    /* ---------------------------------------------------------------------- */
    /* AUDIT                                                                   */
    /* ---------------------------------------------------------------------- */

    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

/* -------------------------------------------------------------------------- */
/* INDEXES                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Supports finding bookings associated with a saved website submission.
 *
 * This is deliberately not unique yet, because existing records may already
 * contain multiple bookings for the same customer or submission.
 */
bookingSchema.index({ formSubmissionId: 1, createdAt: -1 });

/* -------------------------------------------------------------------------- */
/* MODEL                                                                       */
/* -------------------------------------------------------------------------- */

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
