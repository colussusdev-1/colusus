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
