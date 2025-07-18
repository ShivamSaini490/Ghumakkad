// ===========================================

// LOGIN / SIGNUP BY THE EMAIL ID AND PASSWORD

// ===========================================



// const userModel = require("../models/UserModel");
// const userService = require("../services/UserService");
// const { validationResult } = require("express-validator");
// const blackListTokenModel = require("../models/BlackListTokenModel");
// const { sendMail } = require("../utils/Nodemailer");
// const otpStore = {};

// // Create A User
// const registerUser = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { fullName, email, password } = req.body;

//   const isUserAlreadyExist = await userModel.findOne({ email });

//   if (isUserAlreadyExist) {
//     res.status(400).json({ message: "User alreday exist" });
//   }

//   const hashedPassword = await userModel.hashPassword(password);

//   const user = await userService.createUser({
//     firstName: fullName.firstName,
//     lastName: fullName.lastName,
//     email,
//     password: hashedPassword,
//   });

//   const token = user.generateAuthToken();

//   res.status(201).json({ token, user });
// };

// // Login A User

// const loginUser = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password } = req.body;

//   const user = await userModel.findOne({ email }).select("+password");

//   if (!user) {
//     return res.status(401).json({ message: "Invalid Email or Password" });
//   }

//   const isMatch = await user.comparePassword(password);

//   if (!isMatch) {
//     return res.status(401).json({ message: "Invalid Email or Password " });
//   }

//   const token = user.generateAuthToken();
//   res.cookie("token", token);

//   res.status(200).json({ token, user });
// };

// const profile = async (req, res, next) => {
//   res.status(200).json(req.user);
// };

// const logoutUser = async (req, res, next) => {
//   try {
//     const token =
//       req.cookies.token ||
//       (req.headers.authorization && req.headers.authorization.split(" ")[1]);

//     await blackListTokenModel.create({ token });

//     res.clearCookie("token");

//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Logout failed", error: err.message });
//   }
// };

// const requestOtp = async (req, res, next) => {
//   const email = req.body.email.toLowerCase();
//   const user = await userModel.findOne({ email });
//   if (!user) return res.status(404).json({ message: 'User not found' });

//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

//   user.otp = { code: otp, expires };
//   await user.save();

//   await sendMail({
//     from: '"Ghumakkad" <shivamsaini490@gmail.com>',
//     to: email,
//     subject: 'Your OTP Code',
//     text:  `Hello,

// We received a request to verify your identity on Ghumakkad.

// 🔐 Your One-Time Password (OTP) is: ${otp}

// This OTP is valid for the next 5 minutes.

// ⚠️ Please do not share this code with anyone. Ghumakkad will never ask you for your OTP.

// If you didn’t request this, you can safely ignore this email.

// Stay curious,  
// Team Ghumakkad`,
//   });

//   res.status(200).json({ message: 'OTP sent to your email' });
// };


// const loginWithOtp = async (req, res, next) => {
//   const email = req.body.email.toLowerCase();
//   const { code } = req.body;

//   const user = await userModel.findOne({ email });
//   if (!user) return res.status(404).json({ message: 'User not found' });

//   if (
//     !user.otp ||
//     String(user.otp.code) !== String(code) ||
//     Date.now() > new Date(user.otp.expires).getTime()
//   ) {
//     return res.status(400).json({ message: 'Invalid or expired OTP' });
//   }

//   user.otp = undefined;
//   await user.save();

//   const token = user.generateAuthToken();
//   res.cookie('token', token);
//   res.status(200).json({ token, user });
// };


// module.exports = {
//   registerUser,
//   loginUser,
//   profile,
//   logoutUser,
//   requestOtp,
//   loginWithOtp,
// };






// ====================================

// LOGIN / SIGNUP BY EMAIL ID AND OTP

// ====================================


const userModel = require("../models/UserModel");
const { sendMail } = require("../utils/nodemailer");

const verifiedEmailSessions = {};

// Request OTP for signup
const signupWithOtp = async (req, res) => {
  const email = req.body.email?.toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required" });

  let user = await userModel.findOne({ email });

  if (!user) {
    user = await userModel.create({
      email,
      fullName: { firstName: "temp", lastName: "temp" },
      otp: {},
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await userModel.hashOTP(otp);
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = { code: hashedOtp, expires };
  await user.save();

  await sendMail({
    from: '"Ghumakkad" <shivamsaini490@gmail.com>',
    to: email,
    subject: '🔐 Your OTP Code - Ghumakkad Verification',
    html: `<p>Your OTP is: <strong>${otp}</strong> (valid for 5 min)</p>`
  });

  res.status(200).json({ message: "OTP sent", type: "signup" });
};

// Request OTP for login
const loginWithOtp = async (req, res) => {
  const email = req.body.email?.toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "No account exists for this email" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await userModel.hashOTP(otp);
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = { code: hashedOtp, expires };
  await user.save();

  await sendMail({
    from: '"Ghumakkad" <shivamsaini490@gmail.com>',
    to: email,
    subject: '🔐 Your OTP Code - Ghumakkad Login',
    html: `<p>Your OTP is: <strong>${otp}</strong> (valid for 5 min)</p>`
  });

  res.status(200).json({ message: "OTP sent", type: "login" });
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, code } = req.body;
  const user = await userModel.findOne({ email });

 if (!user || !user.otp || !user.otp.code) {
  return res.status(400).json({ message: 'OTP not found or expired' });
}


  const isValid = await userModel.compareOTP(code, user.otp.code);
  console.log("Submitted OTP:", code);
console.log("Stored Hashed OTP:", user.otp.code);

  const isExpired = Date.now() > new Date(user.otp.expires).getTime();
  if (!isValid || isExpired) return res.status(400).json({ message: 'Invalid or expired OTP' });

  user.otp = undefined;
  await user.save();

  if (user.fullName.firstName === 'temp') {
    verifiedEmailSessions[email] = true;
    return res.status(200).json({ message: 'OTP verified', type: 'signup' });
  }

  const token = user.generateAuthToken();
  res.cookie('token', token);
  return res.status(200).json({ token, user, type: 'login' });
};

// Complete Signup
const completeSignup = async (req, res) => {
  const email = Object.keys(verifiedEmailSessions)[0];
  if (!email) return res.status(400).json({ message: 'No verified email session found' });

  const { firstName, lastName, mobile, gender, dob } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.fullName = { firstName, lastName };
  user.mobile = mobile;
  user.gender = gender;
  user.dob = dob;
  await user.save();

  const token = user.generateAuthToken();

  await sendMail({
    from: '"Ghumakkad" <shivamsaini490@gmail.com>',
    to: email,
    subject: '✅ Account Created Successfully',
    html: `<p>Welcome to Ghumakkad. Your account is now active.</p>`
  });

  delete verifiedEmailSessions[email];
  res.status(201).json({ token, user });
};

const logoutUser =  async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await require('../models/BlackListTokenModel').create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

module.exports = {
  signupWithOtp,
  loginWithOtp,
  verifyOtp,
  completeSignup,
  logoutUser,
};