import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| PAYMENT CONSTANTS
|--------------------------------------------------------------------------
*/

const PAYMENT_TYPES = [
  "BOOKING",
  "APPLICATION",
  "OPPORTUNITY",
  "SERVICE",
  "ASSESSMENT",
  "OTHER",
];

const PAYMENT_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
];

/*
|--------------------------------------------------------------------------
| PAYMENT SCHEMA
|--------------------------------------------------------------------------
*/

const paymentSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | PAYMENT IDENTITY
    |--------------------------------------------------------------------------
    */

    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    paymentType: {
      type: String,
      enum: PAYMENT_TYPES,
      required: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | BUSINESS CONTEXT
    |--------------------------------------------------------------------------
    */

    context: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    /*
    |--------------------------------------------------------------------------
    | INVOICE
    |--------------------------------------------------------------------------
    */

    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | CUSTOMER
    |--------------------------------------------------------------------------
    */

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      trim: true,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | AMOUNT
    |--------------------------------------------------------------------------
    */

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "NGN",
      uppercase: true,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | PAYMENT PROVIDER
    |--------------------------------------------------------------------------
    */

    provider: {
      type: String,
      enum: ["PAYSTACK"],
      required: true,
      default: "PAYSTACK",
      index: true,
    },

    transactionId: {
      type: Number,
      default: null,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | PAYMENT STATUS
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      required: true,
      default: "PENDING",
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | PAYSTACK CHECKOUT
    |--------------------------------------------------------------------------
    */

    authorizationUrl: {
      type: String,
      default: null,
      trim: true,
    },

    accessCode: {
      type: String,
      default: null,
      trim: true,
    },

    /*
    |--------------------------------------------------------------------------
    | GATEWAY RESPONSE
    |--------------------------------------------------------------------------
    */

    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | PAYMENT LIFECYCLE
    |--------------------------------------------------------------------------
    */

    initiatedAt: {
      type: Date,
      default: Date.now,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    failedAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    /*
    |--------------------------------------------------------------------------
    | ADDITIONAL METADATA
    |--------------------------------------------------------------------------
    */

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| INDEXES
|--------------------------------------------------------------------------
*/

paymentSchema.index({
  status: 1,
  createdAt: -1,
});

paymentSchema.index({
  paymentType: 1,
  status: 1,
});

paymentSchema.index({
  customerId: 1,
  createdAt: -1,
});

paymentSchema.index({
  invoice: 1,
  status: 1,
});

paymentSchema.index({
  provider: 1,
  status: 1,
});

paymentSchema.index({
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| MODEL REGISTRATION
|--------------------------------------------------------------------------
*/

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
