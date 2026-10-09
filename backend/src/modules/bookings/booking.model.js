import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Personal Information
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Travel Information
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Consultation
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Coupon
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Payment
    |--------------------------------------------------------------------------
    */

    /*
     * Financial source-of-record link.
     *
     * A booking may have one invoice associated with it.
     *
     * Booking
     *    ↓
     * Invoice
     *    ↓
     * Payment
     *    ↓
     * Receipt
     */
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
      index: true,
    },

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

    /*
     * Latest successful payment reference associated with the booking.
     *
     * The Payment collection remains the financial source of truth.
     * This field is retained for convenient business-level access.
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

    /*
    |--------------------------------------------------------------------------
    | Booking Status
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Audit
    |--------------------------------------------------------------------------
    */

    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
