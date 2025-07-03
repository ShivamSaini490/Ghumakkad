const userModel = require("../models/UserModel");
const userService = require("../services/UserService");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/BlackListTokenModel");
const { sendMail } = require("../utils/Nodemailer");
const otpStore = {};

// Create A User
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;

  const isUserAlreadyExist = await userModel.findOne({ email });

  if (isUserAlreadyExist) {
    res.status(400).json({ message: "User alreday exist" });
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword,
  });

  const token = user.generateAuthToken();

  res.status(201).json({ token, user });
};

// Login A User

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Email or Password " });
  }

  const token = user.generateAuthToken();
  res.cookie("token", token);

  res.status(200).json({ token, user });
};

const profile = async (req, res, next) => {
  res.status(200).json(req.user);
};

const logoutUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    await blackListTokenModel.create({ token });

    res.clearCookie("token");

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
};

const requestOtp = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  user.otp = { code: otp, expires };
  await user.save();

  await sendMail({
    from: '"Ghumakkad" <shivamsaini490@gmail.com>',
    to: email,
    subject: 'Your OTP Code',
    text:  `Hello,

We received a request to verify your identity on Ghumakkad.

🔐 Your One-Time Password (OTP) is: ${otp}

This OTP is valid for the next 5 minutes.

⚠️ Please do not share this code with anyone. Ghumakkad will never ask you for your OTP.

If you didn’t request this, you can safely ignore this email.

Stay curious,  
Team Ghumakkad`,
  });

  res.status(200).json({ message: 'OTP sent to your email' });
};


const loginWithOtp = async (req, res, next) => {
  const email = req.body.email.toLowerCase();
  const { code } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (
    !user.otp ||
    String(user.otp.code) !== String(code) ||
    Date.now() > new Date(user.otp.expires).getTime()
  ) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.otp = undefined;
  await user.save();

  const token = user.generateAuthToken();
  res.cookie('token', token);
  res.status(200).json({ token, user });
};


module.exports = {
  registerUser,
  loginUser,
  profile,
  logoutUser,
  requestOtp,
  loginWithOtp,
};
