// const userController = require('../models/UserModel');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const userModel = require('../models/UserModel');
// const blackListTokenModel = require('../models/BlackListTokenModel');
// const captainModel = require ("../models/CaptainModel");

// // Authentication for the user
// const authUser = async(req, res, next) => {
//   const token = req.cookies.token || (req.headers.authorization && req.headers.authorization?.split(' ')[1]);

//   if(!token) {
//     return res.status(401).json({message: 'Unauthorized'});
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const isBlacklisted = await blackListTokenModel.findOne({token: token});

//     if(isBlacklisted) {
//       return res.status(401).json({message: 'Unathorized'});
//     }
//     const user = await userModel.findById(decoded._id)

//     req.user = user;

//     return next();

//   } catch (error) {
//     return res.status(401).json({message: 'Unauthorized'});
//   }
// }

// // Authentication for the captain
// const authCaptain = async(req, res, next) => {
//   const token = req.cookies.token || (req.headers.authorization && req.headers.authorization?.split(' ')[1]);

//   if(!token) {
//     return res.status(401).json({message: 'Unauthorized'});
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const isBlacklisted = await blackListTokenModel.findOne({token: token});

//     if(isBlacklisted) {
//       return res.status(401).json({message: 'Unathorized'});
//     }
//     const captain = await captainModel.findById(decoded._id)

//     req.captain = captain;

//     return next();

//   } catch (error) {
//     return res.status(401).json({message: 'Unauthorized'});
//   }
// }
// module.exports = {
//   authUser,
//   authCaptain,
// }


//.......................................................................................................//



const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const BlackList = require('../models/BlackListTokenModel');

async function authUser(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Unauthorized: No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (await BlackList.findOne({ token })) {
      return res.status(401).json({ message: 'Unauthorized: Token blacklisted' });
    }
    const user = await User.findById(payload._id);
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

module.exports = { authUser };
