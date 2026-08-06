/*
|--------------------------------------------------------------------------
| Booking Confirmation
|--------------------------------------------------------------------------
*/

export const bookingConfirmationTemplate = ({
  fullName,
  consultationDate,
  consultationType,
  travelPackage,
}) => ({
  subject: "Your Consultation Has Been Confirmed",

  html: `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:40px;background:#f8fafc">

      <div style="background:#ffffff;padding:40px;border-radius:12px">

        <h2 style="color:#2563eb;margin-top:0;">
          Booking Confirmed 🎉
        </h2>

        <p>
          Hello <strong>${fullName}</strong>,
        </p>

        <p>
          Thank you for booking a consultation with
          <strong>Colusus Migration</strong>.
        </p>

        <table style="width:100%;border-collapse:collapse;margin:30px 0;">

          <tr>
            <td><strong>Package</strong></td>
            <td>${travelPackage}</td>
          </tr>

          <tr>
            <td><strong>Consultation</strong></td>
            <td>${consultationType}</td>
          </tr>

          <tr>
            <td><strong>Date</strong></td>
            <td>${consultationDate}</td>
          </tr>

        </table>

        <p>
          We look forward to speaking with you and helping you begin your international journey.
        </p>

        <hr>

        <small>
          Colusus Migration
        </small>

      </div>

    </div>
  `,
});

/*
|--------------------------------------------------------------------------
| Payment Receipt
|--------------------------------------------------------------------------
*/

export const paymentReceiptTemplate = ({ fullName, amount, reference }) => ({
  subject: "Payment Receipt",

  html: `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:40px;background:#f8fafc">

      <div style="background:#ffffff;padding:40px;border-radius:12px">

        <h2 style="color:#16a34a;">
          Payment Successful
        </h2>

        <p>
          Hello <strong>${fullName}</strong>,
        </p>

        <p>
          Your payment has been received successfully.
        </p>

        <table style="width:100%;border-collapse:collapse;margin:30px 0;">

          <tr>
            <td><strong>Amount</strong></td>
            <td>₦${Number(amount).toLocaleString()}</td>
          </tr>

          <tr>
            <td><strong>Reference</strong></td>
            <td>${reference}</td>
          </tr>

        </table>

        <p>
          Thank you for choosing Colusus Migration.
        </p>

      </div>

    </div>
  `,
});

/*
|--------------------------------------------------------------------------
| Admin Booking Notification
|--------------------------------------------------------------------------
*/

export const adminBookingTemplate = ({
  fullName,
  email,
  phone,
  travelPackage,
}) => ({
  subject: "New Consultation Booking",

  html: `
    <div style="font-family:Arial,sans-serif">

      <h2>
        New Consultation Booking
      </h2>

      <p><strong>Name:</strong> ${fullName}</p>

      <p><strong>Email:</strong> ${email}</p>

      <p><strong>Phone:</strong> ${phone}</p>

      <p><strong>Package:</strong> ${travelPackage}</p>

    </div>
  `,
});

/*
|--------------------------------------------------------------------------
| Consultation Reminder
|--------------------------------------------------------------------------
*/

export const consultationReminderTemplate = ({
  fullName,
  consultationDate,
  consultationType,
}) => ({
  subject: "Consultation Reminder",

  html: `
    <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:40px;background:#f8fafc">

      <div style="background:#ffffff;padding:40px;border-radius:12px">

        <h2 style="color:#2563eb;">
          Consultation Reminder
        </h2>

        <p>
          Hello <strong>${fullName}</strong>,
        </p>

        <p>
          This is a reminder that your consultation is scheduled for:
        </p>

        <table style="width:100%;margin:25px 0;">

          <tr>
            <td><strong>Date</strong></td>
            <td>${consultationDate}</td>
          </tr>

          <tr>
            <td><strong>Type</strong></td>
            <td>${consultationType}</td>
          </tr>

        </table>

        <p>
          We look forward to speaking with you.
        </p>

      </div>

    </div>
  `,
});

/*
|--------------------------------------------------------------------------
| Contact Notification (Admin)
|--------------------------------------------------------------------------
*/

export const contactNotificationTemplate = ({
  fullName,
  email,
  phone,
  service,
  message,
}) => ({
  subject: `New Contact Enquiry - ${service}`,

  html: `
    <div style="font-family:Arial,sans-serif;background:#f5f7fb;padding:40px;">

      <div style="max-width:700px;margin:auto;background:#ffffff;border-radius:12px;padding:40px;">

        <h2 style="margin-top:0;color:#0056b3;">
          📩 New Contact Enquiry
        </h2>

        <p>
          A new enquiry has been submitted through the
          <strong>Colossus Migration</strong> website.
        </p>

        <table
          style="
            width:100%;
            border-collapse:collapse;
            margin:30px 0;
          "
        >

          <tr>

            <td style="padding:10px;font-weight:bold;">
              Full Name
            </td>

            <td style="padding:10px;">
              ${fullName}
            </td>

          </tr>

          <tr>

            <td style="padding:10px;font-weight:bold;">
              Email
            </td>

            <td style="padding:10px;">
              ${email}
            </td>

          </tr>

          <tr>

            <td style="padding:10px;font-weight:bold;">
              Phone
            </td>

            <td style="padding:10px;">
              ${phone}
            </td>

          </tr>

          <tr>

            <td style="padding:10px;font-weight:bold;">
              Service
            </td>

            <td style="padding:10px;">
              ${service}
            </td>

          </tr>

        </table>

        <h3 style="color:#111827;">
          Message
        </h3>

        <div
          style="
            background:#f9fafb;
            padding:20px;
            border-left:4px solid #0056b3;
            border-radius:8px;
            white-space:pre-line;
          "
        >

          ${message}

        </div>

        <hr style="margin:40px 0;">

        <small style="color:#6b7280;">

          Generated automatically by the
          Colossus Migration website.

        </small>

      </div>

    </div>
  `,
});

/*
|--------------------------------------------------------------------------
| Contact Confirmation (Customer)
|--------------------------------------------------------------------------
*/

export const contactConfirmationTemplate = ({ fullName, service }) => ({
  subject: "We've Received Your Enquiry",

  html: `
    <div style="font-family:Arial,sans-serif;background:#f5f7fb;padding:40px;">

      <div style="max-width:700px;margin:auto;background:#ffffff;border-radius:12px;padding:40px;">

        <h2 style="margin-top:0;color:#0056b3;">

          Thank You For Contacting Us

        </h2>

        <p>

          Hello <strong>${fullName}</strong>,

        </p>

        <p>

          Thank you for contacting
          <strong>Colossus Migration</strong>.

        </p>

        <p>

          We have successfully received your enquiry regarding:

        </p>

        <div
          style="
            margin:25px 0;
            background:#eef6ff;
            padding:18px;
            border-radius:8px;
            font-weight:bold;
            color:#0056b3;
          "
        >

          ${service}

        </div>

        <p>

          One of our immigration specialists will review your enquiry
          and get back to you as soon as possible.

        </p>

        <p>

          We appreciate your interest in working with us and look
          forward to helping you begin your global journey.

        </p>

        <hr style="margin:40px 0;">

        <p>

          Kind regards,

        </p>

        <strong>

          Colossus Migration

        </strong>

        <br>

        admin@colossusmigration.com

        <br>

        +234 703 520 9306

      </div>

    </div>
  `,
});
