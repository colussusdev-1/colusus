import emailService from "./email.service.js";

/*
|--------------------------------------------------------------------------
| Booking Confirmed
|--------------------------------------------------------------------------
|
| Triggered after:
| - Successful payment
| - Free consultation coupon
|
*/

const bookingConfirmed = async (booking) => {
  try {
    await Promise.all([
      emailService.sendBookingConfirmation(booking),

      emailService.sendAdminNotification(booking),
    ]);

    console.log(
      `Booking confirmation communications sent for ${booking.email}`,
    );
  } catch (error) {
    console.error("Booking confirmation communication failed:", error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Payment Successful
|--------------------------------------------------------------------------
*/

const paymentSuccessful = async (booking) => {
  try {
    await emailService.sendPaymentReceipt(booking);

    console.log(`Payment receipt sent to ${booking.email}`);
  } catch (error) {
    console.error("Payment communication failed:", error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Consultation Reminder
|--------------------------------------------------------------------------
*/

const consultationReminder = async (booking) => {
  try {
    await emailService.sendConsultationReminder(booking);

    console.log(`Consultation reminder sent to ${booking.email}`);
  } catch (error) {
    console.error("Consultation reminder failed:", error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Booking Cancelled
|--------------------------------------------------------------------------
|
| Placeholder for future implementation
|
*/

const bookingCancelled = async (booking) => {
  console.log(`Booking cancelled for ${booking.email}`);

  /*
    Future:

    Send cancellation email

    Refund payment

    Notify admin

    SMS

    WhatsApp

  */
};

/*
|--------------------------------------------------------------------------
| Application Status Changed
|--------------------------------------------------------------------------
|
| Future Version 2
|
*/

const applicationStatusChanged = async (application) => {
  console.log(`Application status changed: ${application._id}`);

  /*
      Future

      Email

      SMS

      Push Notification

      WhatsApp

  */
};

/*
|--------------------------------------------------------------------------
| Document Status Changed
|--------------------------------------------------------------------------
|
| Future Version 2
|
*/

const documentStatusChanged = async (document) => {
  console.log(`Document updated: ${document._id}`);
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {
  bookingConfirmed,

  paymentSuccessful,

  consultationReminder,

  bookingCancelled,

  applicationStatusChanged,

  documentStatusChanged,
};
