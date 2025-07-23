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

const verifiedEmailSessions = {}; // In-memory object to track email sessions after OTP verification for signup

// Request OTP for signup
const signupWithOtp = async (req, res) => {
  const email = req.body.email?.toLowerCase();
  if (!email) return res.status(400).json({ message: "Email is required" });

  let user = await userModel.findOne({ email });

  if (user && user.fullName?.firstName !== "temp") {
    return res
      .status(400)
      .json({ message: "An account with this email already exists" });
  }

  // If user does not exist, create a temporary user for signup
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
    from: '"Ghumakkad"',
    to: email,
    subject: "🔐 Your OTP Code - Ghumakkad Verification",
    html: `
      <div style="background-color: #111827; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
        
        <h2 style="color: #10B981; margin-bottom: 20px;">🔐 Ghumakkad Identity Verification</h2>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Hi there,<br/><br/>
          We received a request to verify your identity on <strong style="color: #ffffff;">Ghumakkad</strong>.
        </p>

        <div style="margin: 30px 0; padding: 20px; background-color: #1F2937; border-left: 4px solid #10B981; border-radius: 8px;">
          <p style="margin: 0; font-size: 18px;">Your One-Time Password (OTP) is:</p>
          <p style="font-size: 32px; font-weight: bold; color: #FBBF24; margin-top: 10px;">${otp}</p>
          <p style="margin-top: 10px; color: #D1D5DB;">Valid for the next <strong>5 minutes</strong>.</p>
        </div>

        <p style="font-size: 14px; color: #F87171;">
          ⚠️ Please do not share this OTP with anyone. Ghumakkad will never ask you for it.
        </p>

        <p style="font-size: 14px; color: #9CA3AF;">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <br/>

        <p style="font-size: 16px; color: #9CA3AF;">
          Stay curious,<br/>
          <strong style="color: #10B981;">Team Ghumakkad</strong>
        </p>

      </div>
    `,
  });

  res.status(200).json({ message: "OTP sent", type: "signup" });
};

// Request OTP for login
const loginWithOtp = async (req, res) => {
  const email = req.body.email?.toLowerCase(); // Get email from request body and convert to lowercase
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await userModel.findOne({ email }); // Check if user already exists with this email
  if (!user)
    return res
      .status(404)
      .json({ message: "No account exists for this email" });

  // Block login if user has not completed profile

  if (user?.fullName?.firstName === "temp") {
    return res.status(403).json({
      message:
        "Signup incomplete. Please complete your profile to log in by Signup again.",
      type: "signup",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await userModel.hashOTP(otp);
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  user.otp = { code: hashedOtp, expires }; // Store hashed OTP and expiry in user document
  await user.save(); // Save the user with updated OTP

  await sendMail({
    from: '"Ghumakkad"',
    to: email,
    subject: "🔐 Your OTP Code - Ghumakkad Verification",
    html: `
      <div style="background-color: #111827; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
        
        <h2 style="color: #10B981; margin-bottom: 20px;">🔐 Ghumakkad Identity Verification</h2>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Hi there,<br/><br/>
          We received a request to verify your identity on <strong style="color: #ffffff;">Ghumakkad</strong>.
        </p>

        <div style="margin: 30px 0; padding: 20px; background-color: #1F2937; border-left: 4px solid #10B981; border-radius: 8px;">
          <p style="margin: 0; font-size: 18px;">Your One-Time Password (OTP) is:</p>
          <p style="font-size: 32px; font-weight: bold; color: #FBBF24; margin-top: 10px;">${otp}</p>
          <p style="margin-top: 10px; color: #D1D5DB;">Valid for the next <strong>5 minutes</strong>.</p>
        </div>

        <p style="font-size: 14px; color: #F87171;">
          ⚠️ Please do not share this OTP with anyone. Ghumakkad will never ask you for it.
        </p>

        <p style="font-size: 14px; color: #9CA3AF;">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <br/>

        <p style="font-size: 16px; color: #9CA3AF;">
          Stay curious,<br/>
          <strong style="color: #10B981;">Team Ghumakkad</strong>
        </p>

      </div>
    `,
  });

  res.status(200).json({ message: "OTP sent", type: "login" });
};

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, code } = req.body; // Get email from request body
  const user = await userModel.findOne({ email });

  if (!user || !user.otp || !user.otp.code) {
    return res.status(400).json({ message: "Invalid OTP or OTP is expired" });
  }

  const isValid = await userModel.compareOTP(code, user.otp.code); // Compare provided and stored OTP
  if (!isValid) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const isExpired = Date.now() > new Date(user.otp.expires).getTime();
  if (isExpired) {
    return res.status(400).json({ message: "OTP has expired" });
  }

  user.otp = undefined; // Clear OTP
  await user.save(); // Save changes

  // If user has not completed profile yet

  // if (user.fullName.firstName) {
  //   verifiedEmailSessions[email] = true; // Mark email as verified in memory
  //   return res.status(200).json({ message: "OTP verified", type: "signup" }); // Prompt to complete signup
  // }

  // If user has not completed profile yet
  if (user.fullName?.firstName === "temp") {
    verifiedEmailSessions[email] = true;
    return res.status(200).json({ message: "OTP verified", type: "signup" });
  }

  const token = user.generateAuthToken(); // Generate JWT token
  res.cookie("token", token);
  return res.status(200).json({ token, user, type: "login" });
};

// Complete Signup
const completeSignup = async (req, res) => {
  const email = Object.keys(verifiedEmailSessions)[0]; // Get verified email from memory
  if (!email)
    return res.status(400).json({ message: "No verified email session found" });

  const { firstName, lastName, mobile, gender, dob } = req.body; // Get profile fields from request
  if (!firstName || !lastName || !mobile || !gender || !dob) {
    return res
      .status(400)
      .json({ message: "All fields are required to complete signup" });
  }

  // ✅ Check age
  const birthDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  const isUnderage =
    age < 18 ||
    (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)));

  if (isUnderage) {
    return res
      .status(400)
      .json({ message: "You must be at least 18 years old to register." });
  }

  const user = await userModel.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.fullName = { firstName, lastName };
  user.mobile = mobile;
  user.gender = gender;
  user.dob = dob;
  await user.save();

  const token = user.generateAuthToken();

  await sendMail({
    from: '"Ghumakkad" <shivamsaini490@gmail.com>',
    to: email,
    subject: "✅ Your Account Is Successfully Created – Ghumakkad",
    html: `
      <div style="background-color: #111827; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.4);">
        
        <h2 style="color: #10B981; margin-bottom: 20px;">✅ Your Account Is Successfully Created</h2>
        
        <p style="font-size: 16px; line-height: 1.6;">
          Hi there,<br/><br/>
          We're thrilled to welcome you to <strong style="color: #ffffff;">Ghumakkad</strong>!<br/><br/>
          Your account has been <span style="color: #FBBF24;">successfully created</span> using the email address below:
        </p>

        <div style="margin: 20px 0; padding: 15px; background-color: #1F2937; border-left: 4px solid #10B981; border-radius: 8px;">
          <p style="font-size: 18px; font-weight: bold; color: #FBBF24; margin: 0;">${email}</p>
        </div>

        <p style="font-size: 16px;">You're now ready to explore, book, and ride with Ghumakkad effortlessly.</p>

        <br/>

        <p style="font-size: 16px; color: #9CA3AF;">
          Thank you for joining us!<br/>
          <strong style="color: #10B981;">– The Ghumakkad Team</strong>
        </p>

      </div>
    `,
  });

  delete verifiedEmailSessions[email]; // Clear session from memory
  res.cookie("token", token);
  res.status(201).json({ token, user });
};

// Logout User
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Get token from cookie or header
    await require("../models/BlackListTokenModel").create({ token }); // Store token in blacklist
    res.clearCookie("token"); // Clear token cookie
    res.status(200).json({ message: "Logged out successfully" }); // Respond with success
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
