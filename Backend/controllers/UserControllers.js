// const userModel = require('../models/UserModel');
// const userService = require('../services/UserService');
// const {validationResult} = require('express-validator');
// const blackListTokenModel = require('../models/BlackListTokenModel');

// // Create A User
// const registerUser = async(req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//   return res.status(400).json({ errors: errors.array() });
//  }


//   const {fullName, email, password} = req.body;

//   const isUserAlreadyExist = await userModel.findOne({email});

//   if (isUserAlreadyExist) {
//     res.status(400).json({message: 'User alreday exist'})
//   }

//   const hashedPassword = await userModel.hashPassword(password);

//   const user = await userService.createUser({
//     firstName: fullName.firstName,
//     lastName: fullName.lastName,
//     email,
//     password: hashedPassword
//   });

//   const token = user.generateAuthToken();

//   res.status(201).json({token, user});
// }


// // Login A User

// const loginUser = async(req, res, next) => {
//   const errors = validationResult(req);
//   if(!errors.isEmpty()) {
//     return res.status(400).json({errors: errors.array()});
//   }

//   const {email, password} = req.body;

//   const user = await userModel.findOne({email}).select('+password');

//   if(!user) {
//     return res.status(401).json({message: 'Invalid Email or Password'});
//   }

//   const isMatch = await user.comparePassword(password);

//   if(!isMatch) {
//     return res.status(401).json({message: 'Invalid Email or Password '});
//   }

//   const token = user.generateAuthToken();
//   res.cookie('token', token);


//   res.status(200).json({token, user});
// }

// // Profile

// const profile = async(req, res,next) => {
//   res.status(200).json(req.user);
// }

// //Logout

// const logoutUser = async (req, res, next) => {
//   const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

//     await blackListTokenModel.create({ token });

//     res.clearCookie('token');

//     res.status(200).json({ message: 'Logged out successfully' });

//     res.status(500).json({ message: 'Logout failed', error: err.message });
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   profile,
//   logoutUser,
// }


//...........................................................................................................//



const User = require('../models/UserModel');
const BlackList = require('../models/BlackListTokenModel');
const { sendOtpEmail, sendOtpSms } = require('../utils/otpSender');
const { validationResult } = require('express-validator');

let otpStore = {};

function isEmail(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}

function isIndianMobile(input) {
  return /^(\+91)?[6-9]\d{9}$/.test(input.trim());
}

function generateOtp() {
  return ('' + Math.floor(1000 + Math.random() * 9000));
}

async function sendOtp(req, res) {
  const { input } = req.body;
  if (!input) return res.status(400).json({ message: 'Enter email or mobile' });
  if (!isEmail(input) && !isIndianMobile(input))
    return res
      .status(400)
      .json({ message: 'Enter a valid Indian mobile or email' });

  const otp = generateOtp();
  otpStore[input] = otp;
  setTimeout(() => delete otpStore[input], 5 * 60 * 1000);

  try {
    if (isEmail(input)) await sendOtpEmail(input, otp);
    else {
      const phone = input.startsWith('+91') ? input : '+91' + input;
      await sendOtpSms(phone, otp);
    }
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not send OTP' });
  }
}

async function verifyOtp(req, res) {
  const { input, otp } = req.body;
  if (!input || !otp) return res.status(400).json({ message: 'Input and OTP required' });
  if (otpStore[input] !== otp)
    return res.status(401).json({ message: 'Invalid or expired OTP' });

  delete otpStore[input];
  let user = await User.findOne({ contact: input });
  if (!user) {
    const name = isEmail(input) ? input.split('@')[0] : input;
    user = await User.create({
      fullName: { firstName: name },
      contact: input,
    });
  }

  const token = user.generateAuthToken();
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Authenticated', token, user });
}

async function profile(req, res) {
  res.json(req.user);
}

async function logoutUser(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (token) await BlackList.create({ token });
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}

module.exports = { sendOtp, verifyOtp, profile, logoutUser };