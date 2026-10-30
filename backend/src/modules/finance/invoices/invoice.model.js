import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    /* ---------------------------------------------------------------------- */
    /* ITEM DESCRIPTION                                                       */
    /* ---------------------------------------------------------------------- */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },

    /* ---------------------------------------------------------------------- */
    /* QUANTITY & PRICING                                                     */
    /* ---------------------------------------------------------------------- */

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const invoiceSchema = new mongoose.Schema(
  {
    /* ---------------------------------------------------------------------- */
    /* INVOICE IDENTITY                                                       */
    /* ---------------------------------------------------------------------- */

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    /*
     * Describes the business reason for the invoice.
     *
     * BOOKING      → booking-related charge
     * APPLICATION  → application-related charge
     * OPPORTUNITY  → migration opportunity charge
     * SERVICE      → Colossus service charge
     * ASSESSMENT   → trainee/apprenticeship assessment charge
     * OTHER        → future/unclassified charge
     */
    invoiceType: {
      type: String,
      enum: [
        "BOOKING",
        "APPLICATION",
        "OPPORTUNITY",
        "SERVICE",
        "ASSESSMENT",
        "OTHER",
      ],
      required: true,
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* BUSINESS CONTEXT                                                       */
    /* ---------------------------------------------------------------------- */

    context: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    /* ---------------------------------------------------------------------- */
    /* CUSTOMER                                                               */
    /* ---------------------------------------------------------------------- */

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
    /* LINE ITEMS                                                             */
    /* ---------------------------------------------------------------------- */

    items: {
      type: [invoiceItemSchema],
      required: true,
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "An invoice must contain at least one item.",
      },
    },

    /* ---------------------------------------------------------------------- */
    /* FINANCIAL TOTALS                                                       */
    /* ---------------------------------------------------------------------- */

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    amountPaid: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    balanceDue: {
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

    /* ---------------------------------------------------------------------- */
    /* INVOICE STATUS                                                         */
    /* ---------------------------------------------------------------------- */

    status: {
      type: String,
      enum: [
        "DRAFT",
        "ISSUED",
        "PARTIALLY_PAID",
        "PAID",
        "OVERDUE",
        "CANCELLED",
        "VOID",
      ],
      required: true,
      default: "DRAFT",
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* DATES                                                                  */
    /* ---------------------------------------------------------------------- */

    issuedAt: {
      type: Date,
      default: null,
    },

    dueDate: {
      type: Date,
      default: null,
      index: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    /* ---------------------------------------------------------------------- */
    /* PAYMENT REFERENCE                                                      */
    /* ---------------------------------------------------------------------- */

    lastPaymentReference: {
      type: String,
      default: null,
      trim: true,
      index: true,
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

invoiceSchema.index({
  customerId: 1,
  createdAt: -1,
});

invoiceSchema.index({
  status: 1,
  dueDate: 1,
});

invoiceSchema.index({
  invoiceType: 1,
  status: 1,
});

invoiceSchema.index({
  createdAt: -1,
});

/* -------------------------------------------------------------------------- */
/* MODEL                                                                      */
/* -------------------------------------------------------------------------- */

const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
