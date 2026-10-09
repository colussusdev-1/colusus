import api from "./api";

/*
|--------------------------------------------------------------------------
| Review Booking
|--------------------------------------------------------------------------
*/

const reviewBooking = async (bookingData) => {
  const { data } = await api.post("/bookings/review", bookingData);

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Create Booking
|--------------------------------------------------------------------------
*/

const createBooking = async (bookingData) => {
  const { data } = await api.post("/bookings", bookingData);

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Initialize Payment
|--------------------------------------------------------------------------
|
| The backend is the source of truth for:
|
| - amount
| - currency
| - customer
| - invoice balance
|
| The frontend only identifies:
|
| - payment type
| - invoice
|
|--------------------------------------------------------------------------
*/

const initializePayment = async ({ paymentType, invoiceId }) => {
  if (!paymentType) {
    throw new Error("Payment type is required.");
  }

  if (!invoiceId) {
    throw new Error("Invoice ID is required.");
  }

  const { data } = await api.post("/payments/initialize", {
    paymentType,
    invoiceId,
  });

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

const verifyPayment = async (reference) => {
  if (!reference) {
    throw new Error("Payment reference is required.");
  }

  const { data } = await api.get(`/payments/verify/${reference}`);

  return data.data;
};

/*
|--------------------------------------------------------------------------
| Pay an Existing Invoice
|--------------------------------------------------------------------------
|
| Generic payment helper.
|
| Used when an invoice has already been created by the backend.
|
| Supported payment types currently include:
|
| - BOOKING
| - APPLICATION
| - OPPORTUNITY
| - SERVICE
| - OTHER
|
| The backend determines the actual amount from the invoice.
|
|--------------------------------------------------------------------------
*/

const payInvoice = async ({ paymentType, invoiceId }) => {
  /*
  |--------------------------------------------------------------------------
  | VALIDATE INPUT
  |--------------------------------------------------------------------------
  */

  if (!paymentType) {
    throw new Error("Payment type is required.");
  }

  if (!invoiceId) {
    throw new Error("Invoice ID is required.");
  }

  /*
  |--------------------------------------------------------------------------
  | INITIALIZE PAYMENT
  |--------------------------------------------------------------------------
  */

  const payment = await initializePayment({
    paymentType,
    invoiceId,
  });

  console.log("PAYMENT INITIALIZATION RESPONSE:", payment);

  /*
  |--------------------------------------------------------------------------
  | VALIDATE PAYSTACK RESPONSE
  |--------------------------------------------------------------------------
  */

  if (!payment?.authorizationUrl) {
    throw new Error("Payment gateway did not return an authorization URL.");
  }

  /*
  |--------------------------------------------------------------------------
  | REDIRECT TO PAYSTACK
  |--------------------------------------------------------------------------
  */

  window.location.href = payment.authorizationUrl;

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  |
  | Normally the browser will leave the page immediately because of the
  | Paystack redirect.
  |
  |--------------------------------------------------------------------------
  */

  return {
    payment,
    paymentRequired: true,
  };
};

/*
|--------------------------------------------------------------------------
| Pay Application Invoice
|--------------------------------------------------------------------------
|
| Application invoices are created by the backend when:
|
| - an application is created
| - a payment stage becomes payable
| - the previous payment stage is completed
|
| The application frontend should only provide the invoice ID.
|
|--------------------------------------------------------------------------
*/

const payApplication = async (invoiceId) => {
  if (!invoiceId) {
    throw new Error("Application invoice ID is required.");
  }

  return payInvoice({
    paymentType: "APPLICATION",
    invoiceId,
  });
};

/*
|--------------------------------------------------------------------------
| Start Consultation / Booking Payment Flow
|--------------------------------------------------------------------------
|
| Flow:
|
| 1. Create consultation booking
| 2. Receive booking + invoice
| 3. Check whether payment is required
|
| FREE / FULL COUPON:
|    → WAIVED
|    → CONFIRMED
|    → DO NOT CALL PAYSTACK
|
| NORMAL BOOKING:
|    → UNPAID
|    → AWAITING_PAYMENT
|    → Initialize payment using invoice ID
|    → Redirect client
|
|--------------------------------------------------------------------------
*/

const pay = async (bookingData) => {
  /*
  |--------------------------------------------------------------------------
  | CREATE BOOKING
  |--------------------------------------------------------------------------
  */

  const result = await createBooking(bookingData);

  console.log("BOOKING CREATED:", result);

  /*
  |--------------------------------------------------------------------------
  | VALIDATE BOOKING RESPONSE
  |--------------------------------------------------------------------------
  */

  if (!result?.booking?._id) {
    throw new Error("Booking was created, but no booking ID was returned.");
  }

  const booking = result.booking;

  const invoice = result.invoice || null;

  /*
  |--------------------------------------------------------------------------
  | READ FINAL BOOKING STATE
  |--------------------------------------------------------------------------
  |
  | The backend is the source of truth.
  |
  |--------------------------------------------------------------------------
  */

  const amountPayable = Number(booking.amountPayable);

  const paymentStatus = booking.paymentStatus;

  const bookingStatus = booking.bookingStatus;

  console.log("CONSULTATION PAYMENT STATE:", {
    amountPayable,
    paymentStatus,
    bookingStatus,
    invoiceId: invoice?._id || null,
    invoiceStatus: invoice?.status || null,
  });

  /*
  |--------------------------------------------------------------------------
  | FREE / FULL COUPON BOOKING
  |--------------------------------------------------------------------------
  */

  if (
    amountPayable <= 0 ||
    paymentStatus === "WAIVED" ||
    bookingStatus === "CONFIRMED"
  ) {
    console.log("NO PAYMENT REQUIRED.");

    return {
      booking,
      invoice: null,
      paymentRequired: false,
      payment: null,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | VALIDATE REQUIRED INVOICE
  |--------------------------------------------------------------------------
  |
  | A paid booking must have an issued invoice.
  |
  |--------------------------------------------------------------------------
  */

  if (!invoice?._id) {
    throw new Error("Booking was created, but no invoice was returned.");
  }

  if (
    invoice.status !== "ISSUED" &&
    invoice.status !== "PARTIALLY_PAID" &&
    invoice.status !== "OVERDUE"
  ) {
    throw new Error(
      `Invoice cannot receive payment from ${invoice.status} status.`,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | SAFETY CHECK
  |--------------------------------------------------------------------------
  |
  | The frontend does not determine the payment amount.
  |
  | This check only confirms that the backend-created booking
  | actually requires a positive payment.
  |
  |--------------------------------------------------------------------------
  */

  if (!Number.isFinite(amountPayable) || amountPayable <= 0) {
    throw new Error("Invalid consultation payment amount.");
  }

  /*
  |--------------------------------------------------------------------------
  | INITIALIZE PAYMENT
  |--------------------------------------------------------------------------
  */

  const payment = await initializePayment({
    paymentType: "BOOKING",
    invoiceId: invoice._id,
  });

  console.log("PAYMENT INITIALIZATION RESPONSE:", payment);

  console.log("AUTHORIZATION URL:", payment?.authorizationUrl);

  /*
  |--------------------------------------------------------------------------
  | VALIDATE PAYMENT RESPONSE
  |--------------------------------------------------------------------------
  */

  if (!payment?.authorizationUrl) {
    throw new Error("Payment gateway did not return an authorization URL.");
  }

  /*
  |--------------------------------------------------------------------------
  | REDIRECT CLIENT TO PAYSTACK
  |--------------------------------------------------------------------------
  */

  window.location.href = payment.authorizationUrl;

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return {
    booking,
    invoice,
    payment,
    paymentRequired: true,
  };
};

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
  /*
  | Booking
  */

  reviewBooking,
  createBooking,
  pay,

  /*
  | Generic Finance Payment
  */
  initializePayment,
  verifyPayment,
  payInvoice,
  /*
  | Application Payment
  */
  payApplication,
};