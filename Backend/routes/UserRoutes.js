const express = require ('express');
const router = express.Router();
const {body} =  require('express-validator');
const userController  = require('../controllers/UserControllers');
const authmiddlewares = require('../middlewares/AuthMiddlewares');

// Create User

router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('fullName.firstName').isLength({min: 3}).withMessage('First Name must be at least 3 characters'),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters')
],
  userController.registerUser
);

//Login

router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters')
],
userController.loginUser
);

// Add these routes
router.post('/request-otp', userController.requestOtp);
router.post('/login-otp', userController.loginWithOtp);

// Profile

router.get('/profile', authmiddlewares.authUser, userController.profile);

// Logout

router.get('/logout', authmiddlewares.authUser, userController.logoutUser);

module.exports = router;

