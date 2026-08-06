import nodemailer from "nodemailer";

import config from "../../config/environment.js";

import {
  bookingConfirmationTemplate,
  paymentReceiptTemplate,
  adminBookingTemplate,
  consultationReminderTemplate,
  contactNotificationTemplate,
  contactConfirmationTemplate,
} from "./email.templates.js";

/*
|--------------------------------------------------------------------------
| Mail Transporter
|--------------------------------------------------------------------------
*/

const transporter = nodemailer.createTransport({
  host: config.emailHost,

  port: config.emailPort,

  secure: false,

  auth: {
    user: config.emailUser,

    pass: config.emailPassword,
  },
});

/*
|--------------------------------------------------------------------------
| Generic Email Sender
|--------------------------------------------------------------------------
*/

const sendEmail = async ({
  to,

  subject,

  html,
}) => {
  const info = await transporter.sendMail({
    from: config.emailFrom,

    to,

    subject,

    html,
  });

  return info;
};

/*
|--------------------------------------------------------------------------
| Booking Confirmation
|--------------------------------------------------------------------------
*/

const sendBookingConfirmation = async (booking) => {
  const template = bookingConfirmationTemplate({
    fullName: booking.fullName,

    consultationDate: booking.consultationDate,

    consultationType: booking.consultationType,

    travelPackage: booking.travelPackage,
  });

  return sendEmail({
    to: booking.email,

    subject: template.subject,

    html: template.html,
  });
};

/*
|--------------------------------------------------------------------------
| Payment Receipt
|--------------------------------------------------------------------------
*/

const sendPaymentReceipt = async (booking) => {
  const template = paymentReceiptTemplate({
    fullName: booking.fullName,

    amount: booking.amountPayable,

    reference: booking.paymentReference,
  });

  return sendEmail({
    to: booking.email,

    subject: template.subject,

    html: template.html,
  });
};
/*
|--------------------------------------------------------------------------
| Admin Booking Notification
|--------------------------------------------------------------------------
*/

const sendAdminNotification = async (booking) => {
  const template = adminBookingTemplate({
    fullName: booking.fullName,

    email: booking.email,

    phone: booking.phone,

    travelPackage: booking.travelPackage,
  });

  return sendEmail({
    to: config.adminEmail,

    subject: template.subject,

    html: template.html,
  });
};

/*
|--------------------------------------------------------------------------
| Consultation Reminder
|--------------------------------------------------------------------------
*/

const sendConsultationReminder = async (booking) => {
  const template = consultationReminderTemplate({
    fullName: booking.fullName,

    consultationDate: booking.consultationDate,

    consultationType: booking.consultationType,
  });

  return sendEmail({
    to: booking.email,

    subject: template.subject,

    html: template.html,
  });
};

/*
|--------------------------------------------------------------------------
| Contact Form Notification (Admin)
|--------------------------------------------------------------------------
*/

const sendContactNotification = async (contact) => {
  const template = contactNotificationTemplate({
    fullName: contact.fullName,

    email: contact.email,

    phone: contact.phone,

    service: contact.service,

    message: contact.message,
  });

  return sendEmail({
    to: config.adminEmail,

    subject: template.subject,

    html: template.html,
  });
};

/*
|--------------------------------------------------------------------------
| Contact Form Confirmation (Customer)
|--------------------------------------------------------------------------
*/

const sendContactConfirmation = async (contact) => {
  const template = contactConfirmationTemplate({
    fullName: contact.fullName,

    email: contact.email,

    service: contact.service,
  });

  return sendEmail({
    to: contact.email,

    subject: template.subject,

    html: template.html,
  });
};
/*
|--------------------------------------------------------------------------
| Verify SMTP Connection
|--------------------------------------------------------------------------
*/

const verifyConnection = async () => {
  await transporter.verify();

  console.log("Email service connected successfully.");
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default {
  /*
  |--------------------------------------------------------------------------
  | Generic
  |--------------------------------------------------------------------------
  */

  sendEmail,

  verifyConnection,

  /*
  |--------------------------------------------------------------------------
  | Booking Emails
  |--------------------------------------------------------------------------
  */

  sendBookingConfirmation,

  sendPaymentReceipt,

  sendAdminNotification,

  sendConsultationReminder,

  /*
  |--------------------------------------------------------------------------
  | Contact Emails
  |--------------------------------------------------------------------------
  */

  sendContactNotification,

  sendContactConfirmation,
};
