const nodemailer = require('nodemailer');
const twilio = require('twilio');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your OTP for Ghumakkad',
    text: `Your OTP is ${otp}`,
  });
}

async function sendOtpSms(to, otp) {
  await twilioClient.messages.create({
    to,
    from: process.env.TWILIO_PHONE_NUMBER,
    body: `Your OTP is ${otp}`,
  });
}

module.exports = { sendOtpEmail, sendOtpSms };
