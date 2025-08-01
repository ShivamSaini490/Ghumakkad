const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email using the transporter.
 * @param {Object} mailOptions - { from, to, subject, text }
 * @returns {Promise}
 */
const sendMail = (mailOptions) => {
  return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };