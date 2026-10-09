import mongoose from "mongoose";

const PAYMENT_TYPES = [
  "BOOKING",
  "APPLICATION",
  "OPPORTUNITY",
  "SERVICE",
  "OTHER",
];

const receiptSchema = new mongoose.Schema(
  {
    /* ---------------------------------------------------------------------- */
    /* RECEIPT IDENTITY                                                       */
    /* ---------------------------------------------------------------------- */

    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /* FINANCIAL REFERENCES                                                   */
    /* ---------------------------------------------------------------------- */

    /*
     * Every receipt comes from a successful Payment.
     *
     * One payment can produce only one receipt.
     */
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      unique: true,
      index: true,
    },

    /*
     * The invoice that the payment settled.
     */
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* PAYMENT CONTEXT                                                        */
    /* ---------------------------------------------------------------------- */

    /*
     * The business reason for the payment.
     *
     * This mirrors Payment.paymentType and Invoice.invoiceType.
     */
    paymentType: {
      type: String,
      enum: PAYMENT_TYPES,
      required: true,
      index: true,
    },

    /*
     * Business-specific context.
     *
     * Examples:
     *
     * {
     *   bookingId: "..."
     * }
     *
     * {
     *   applicationId: "..."
     * }
     *
     * {
     *   opportunityId: "..."
     * }
     */
    context: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    /* ---------------------------------------------------------------------- */
    /* CUSTOMER SNAPSHOT                                                      */
    /* ---------------------------------------------------------------------- */

    /*
     * Authenticated customer relationship.
     *
     * Guest/public receipts may have customerId = null.
     *
     * The snapshot fields remain on the receipt because this is a historical
     * financial document and should not change when the customer's profile
     * changes.
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

    /* ---------------------------------------------------------------------- */
    /* PAYMENT DETAILS                                                        */
    /* ---------------------------------------------------------------------- */

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

    provider: {
      type: String,
      enum: ["PAYSTACK"],
      required: true,
    },

    transactionId: {
      type: Number,
      required: true,
      index: true,
    },

    paymentReference: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /* RECEIPT STATUS                                                         */
    /* ---------------------------------------------------------------------- */

    status: {
      type: String,
      enum: ["ISSUED", "VOID"],
      required: true,
      default: "ISSUED",
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* PAYMENT DATE                                                           */
    /* ---------------------------------------------------------------------- */

    paidAt: {
      type: Date,
      required: true,
      index: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    voidedAt: {
      type: Date,
      default: null,
    },

    /* ---------------------------------------------------------------------- */
    /* DOCUMENT INFORMATION                                                   */
    /* ---------------------------------------------------------------------- */

    /*
     * These fields allow the actual receipt document to be generated later
     * without redesigning the financial record.
     */
    documentUrl: {
      type: String,
      default: null,
      trim: true,
    },

    documentPublicId: {
      type: String,
      default: null,
      trim: true,
    },

    /* ---------------------------------------------------------------------- */
    /* NOTES                                                                  */
    /* ---------------------------------------------------------------------- */

    notes: {
      type: String,
      trim: true,
      default: null,
    },

    /* ---------------------------------------------------------------------- */
    /* ADDITIONAL METADATA                                                    */
    /* ---------------------------------------------------------------------- */

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

/* -------------------------------------------------------------------------- */
/* INDEXES                                                                    */
/* -------------------------------------------------------------------------- */

receiptSchema.index({
  customerId: 1,
  createdAt: -1,
});

receiptSchema.index({
  invoice: 1,
  createdAt: -1,
});

receiptSchema.index({
  paymentType: 1,
  createdAt: -1,
});

receiptSchema.index({
  paidAt: -1,
});

/* -------------------------------------------------------------------------- */
/* MODEL                                                                      */
/* -------------------------------------------------------------------------- */

const Receipt = mongoose.model("Receipt", receiptSchema);

export default Receipt;
