const express = require("express");
const router = express.Router();
const transporter = require("../utils/mailer");

router.post("/send-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.message
    });
    res.send("Email sent successfully!");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

module.exports = router;
