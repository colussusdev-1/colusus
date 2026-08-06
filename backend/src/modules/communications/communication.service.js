import emailService from "./email.service.js";

/*
|--------------------------------------------------------------------------
| Booking Confirmed
|--------------------------------------------------------------------------
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
| Contact Form - Notify Admin
|--------------------------------------------------------------------------
*/

const contactReceived = async (contact) => {
  try {
    await emailService.sendContactNotification(contact);

    console.log(`New contact enquiry received from ${contact.email}`);
  } catch (error) {
    console.error("Contact notification failed:", error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Contact Form - Confirmation
|--------------------------------------------------------------------------
*/

const contactConfirmation = async (contact) => {
  try {
    await emailService.sendContactConfirmation(contact);

    console.log(`Contact confirmation sent to ${contact.email}`);
  } catch (error) {
    console.error("Contact confirmation failed:", error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Booking Cancelled
|--------------------------------------------------------------------------
*/

const bookingCancelled = async (booking) => {
  console.log(`Booking cancelled for ${booking.email}`);

  /*
    Future:

    Refund Payment

    Send Email

    SMS

    WhatsApp

  */
};

/*
|--------------------------------------------------------------------------
| Application Status Changed
|--------------------------------------------------------------------------
*/

const applicationStatusChanged = async (application) => {
  console.log(`Application status changed: ${application._id}`);
};

/*
|--------------------------------------------------------------------------
| Document Status Changed
|--------------------------------------------------------------------------
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

  contactReceived,

  contactConfirmation,

  bookingCancelled,

  applicationStatusChanged,

  documentStatusChanged,
};
