const captainModel = require("../models/CaptainModel");
const captainService = require("../services/CaptainService");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/BlackListTokenModel");

// Create Captain

const registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // const {firstName, lastName, email, password, color, plate, capacity, vehicleType} = req.body;

  const { fullName, email, password, vehicle } = req.body;

  const isCaptainAlreadyExist = await captainModel.findOne({ email });

  if (isCaptainAlreadyExist) {
    return res.status(400).json({ message: "Captain already exist" });
  }

  const hashedPassword = await captainModel.hashPassword(password);

  const captain = await captainService.createCaptain({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword,
    color: vehicle.color,
    plate: vehicle.plate,
    capacity: vehicle.capacity,
    vehicleType: vehicle.vehicleType,
  });

  const token = captain.generateAuthToken();

  res
    .status(201)
    .json({ token, captain, message: "Captain created successfully" });
};

// Login

const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const captain = await captainModel.findOne({ email }).select("+password");

  if (!captain) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  const isMatch = await captain.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  const token = captain.generateAuthToken();
  res.cookie("token", token);

  res.status(200).json({ token, captain, message: "Login Successfully" });
};

// Profile
const profile = async(req, res,next) => {
  res.status(200).json({captain: req.captain});
}

//Logout

const logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out successfully' });

    res.status(500).json({ message: 'Logout failed', error: err.message });
};

module.exports = {
  registerCaptain,
  loginCaptain,
  profile,
  logoutCaptain,
};
