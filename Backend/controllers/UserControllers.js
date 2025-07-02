const userModel = require('../models/UserModel');
const userService = require('../services/UserService');
const {validationResult} = require('express-validator');
const blackListTokenModel = require('../models/BlackListTokenModel');

// Create A User
const registerUser = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
 }


  const {fullName, email, password} = req.body;

  const isUserAlreadyExist = await userModel.findOne({email});

  if (isUserAlreadyExist) {
    res.status(400).json({message: 'User alreday exist'})
  }

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userService.createUser({
    firstName: fullName.firstName,
    lastName: fullName.lastName,
    email,
    password: hashedPassword
  });

  const token = user.generateAuthToken();

  res.status(201).json({token, user});
}


// Login A User

const loginUser = async(req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const {email, password} = req.body;

  const user = await userModel.findOne({email}).select('+password');

  if(!user) {
    return res.status(401).json({message: 'Invalid Email or Password'});
  }

  const isMatch = await user.comparePassword(password);

  if(!isMatch) {
    return res.status(401).json({message: 'Invalid Email or Password '});
  }

  const token = user.generateAuthToken();
  res.cookie('token', token);


  res.status(200).json({token, user});
}

// Profile

const profile = async(req, res,next) => {
  res.status(200).json(req.user);
}

//Logout

const logoutUser = async (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out successfully' });

    res.status(500).json({ message: 'Logout failed', error: err.message });
};

module.exports = {
  registerUser,
  loginUser,
  profile,
  logoutUser,
}
