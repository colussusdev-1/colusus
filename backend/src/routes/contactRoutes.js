import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Contact Form
|--------------------------------------------------------------------------
*/

router.post("/", async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  try {
    // ✅ Use cPanel SMTP instead of Gmail
    const transporter = nodemailer.createTransport({
      host: "business59.web-hosting.com",
      port: 465, // SSL port
      secure: true, // true for port 465
      auth: {
        user: process.env.MAIL_USER, //  cPanel email 
        pass: process.env.MAIL_PASS, // cPanel email password
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      replyTo: email,
      to: "admin@colossusmigration.com", // destination inbox
      subject: `New Migration Inquiry - ${service}`,
      html: `
        <h2>New Website Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

export default router;
