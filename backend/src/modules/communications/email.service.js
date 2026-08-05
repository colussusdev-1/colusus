import nodemailer from "nodemailer";

import config from "../../config/environment.js";

import {
  bookingConfirmationTemplate,
  paymentReceiptTemplate,
  adminBookingTemplate,
  consultationReminderTemplate,
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
| Send Email
|--------------------------------------------------------------------------
*/

const sendEmail = async ({ to, subject, html }) => {
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
| Admin Notification
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
| Verify SMTP Connection
|--------------------------------------------------------------------------
*/

const verifyConnection = async () => {
  await transporter.verify();

  console.log("Email service connected successfully.");
};

export default {
  sendEmail,

  sendBookingConfirmation,

  sendPaymentReceipt,

  sendAdminNotification,

  sendConsultationReminder,

  verifyConnection,
};
