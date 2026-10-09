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
     * OTHER        → future/unclassified charge
     *
     * Finance owns the invoice and payment lifecycle.
     * The related business record is identified through `context`.
     */
    invoiceType: {
      type: String,
      enum: ["BOOKING", "APPLICATION", "OPPORTUNITY", "SERVICE", "OTHER"],
      required: true,
      index: true,
    },

    /* ---------------------------------------------------------------------- */
    /* BUSINESS CONTEXT                                                       */
    /* ---------------------------------------------------------------------- */

    /*
     * Identifies the business transaction that generated the invoice.
     *
     * Examples:
     *
     * Booking:
     * {
     *   bookingId: "..."
     * }
     *
     * Application:
     * {
     *   applicationId: "..."
     * }
     *
     * Opportunity:
     * {
     *   opportunityId: "..."
     * }
     *
     * Service:
     * {
     *   serviceId: "..."
     * }
     *
     * Finance stores the context but does not own the business logic
     * of the referenced module.
     */
    context: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    /* ---------------------------------------------------------------------- */
    /* CUSTOMER                                                               */
    /* ---------------------------------------------------------------------- */

    /*
     * Optional authenticated customer reference.
     *
     * Authenticated transaction:
     *     customerId → User._id
     *
     * Guest/public transaction:
     *     customerId → null
     *
     * The customer snapshot fields remain required so the invoice
     * remains self-contained even if the customer profile changes later.
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

    /*
     * This does NOT store the payment itself.
     *
     * Payment documents remain the source of truth for individual
     * financial transactions.
     *
     * This field only makes the latest/current payment easy to
     * trace from the invoice.
     */
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

    /*
     * Additional invoice information that does not belong in the
     * core financial fields.
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

/* -------------------------------------------------------------------------- */
/* INDEXES                                                                    */
/* -------------------------------------------------------------------------- */

/*
 * Customer financial history.
 *
 * Works for both authenticated users and guest invoices.
 */
invoiceSchema.index({
  customerId: 1,
  createdAt: -1,
});

/*
 * Outstanding / overdue invoice queries.
 */
invoiceSchema.index({
  status: 1,
  dueDate: 1,
});

/*
 * Financial reporting by invoice type and status.
 */
invoiceSchema.index({
  invoiceType: 1,
  status: 1,
});

/*
 * Recent invoices.
 */
invoiceSchema.index({
  createdAt: -1,
});

/* -------------------------------------------------------------------------- */
/* MODEL                                                                      */
/* -------------------------------------------------------------------------- */

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
