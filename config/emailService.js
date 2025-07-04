const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to send an email

async function sendEmail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
      html,
    });
    // console.log(" Email sent successfully:", info);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(" Error sending email:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = sendEmail; 
