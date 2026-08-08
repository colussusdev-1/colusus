const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "business59.web-hosting.com",
  port: 465, // SSL
  secure: true,
  auth: {
    user: process.env.MAIL_USER, // your email
    pass: process.env.MAIL_PASS  // your password
  }
});

module.exports = transporter;
