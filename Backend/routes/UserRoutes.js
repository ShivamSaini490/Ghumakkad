// ===========================================

// LOGIN / SIGNUP BY THE EMAIL ID AND PASSWORD

// ===========================================


// const express = require ('express');
// const router = express.Router();
// const {body} =  require('express-validator');
// const userController  = require('../controllers/UserControllers');
// const authmiddlewares = require('../middlewares/AuthMiddlewares');

// // Create User

// router.post('/register', [
//   body('email').isEmail().withMessage('Invalid Email'),
//   body('fullName.firstName').isLength({min: 3}).withMessage('First Name must be at least 3 characters'),
//   body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters')
// ],
//   userController.registerUser
// );

// //Login

// router.post('/login', [
//   body('email').isEmail().withMessage('Invalid Email'),
//   body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters')
// ],
// userController.loginUser
// );

// // Add these routes
// router.post('/request-otp', userController.requestOtp);
// router.post('/login-otp', userController.loginWithOtp);

// // Profile

// router.get('/profile', authmiddlewares.authUser, userController.profile);

// // Logout

// router.get('/logout', authmiddlewares.authUser, userController.logoutUser);

// module.exports = router;





// ====================================

// LOGIN / SIGNUP BY EMAIL ID AND OTP

// ====================================




const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserControllers');
const authMiddleware = require('../middlewares/AuthMiddlewares');

// === OTP Auth Routes ===
router.post('/auth/request-otp', userController.requestOtp);
router.post('/auth/verify-otp', userController.verifyOtp);
router.post('/auth/signup-complete', userController.completeSignup);

// === Protected Profile Route ===
router.get('/profile', authMiddleware.authUser, (req, res) => {
  res.status(200).json(req.user);
});

// === Logout ===
router.get('/logout', authMiddleware.authUser, async (req, res) => {
  try {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    await require('../models/BlackListTokenModel').create({ token });
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", error: err.message });
  }
});

module.exports = router;
